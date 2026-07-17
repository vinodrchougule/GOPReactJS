import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import { Row, Col, Modal } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import fileService from "../../services/GATServices/fileServices.service";
import projectService from "../../services/project.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
import { Box, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import attributeValueConsistencyCheckService from "../../services/GATServices/attributeValueConsistencyCheck.service";
toast.configure();

export default function AttributeValueConsistencyCheck() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [inputFileValidationStatus, setInputFileValidationStatus] =
    useState("pending");
  const [uomFileValidationStatus, setUOMFileValidationStatus] =
    useState("pending");
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");
  const [successMessage, setSuccessMessage] = useState("");

  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [uomFileName, setUOMFileName] = useState("");
  const [uomFileKey, setUOMFileKey] = useState(Date.now());

  const [multipleValuesSeparator, setMultipleValuesSeparator] = useState(", ");
  const [checkSpaceBeforeUOM, setCheckSpaceBeforeUOM] = useState("");

  const [
    checkSpaceForMultipleDimensionSeparator,
    setCheckSpaceForMultipleDimensionSeparator,
  ] = useState("");
  const [
    isMultipleDimensionSeparatorXChecked,
    setIsMultipleDimensionSeparatorXChecked,
  ] = useState(true);
  const [
    isMultipleDimensionSeparatorFwdSlashChecked,
    setIsMultipleDimensionSeparatorFwdSlashChecked,
  ] = useState(true);
  const [
    isMultipleDimensionSeparatorTOChecked,
    setIsMultipleDimensionSeparatorTOChecked,
  ] = useState(true);
  const [
    isMultipleDimensionSeparatorHyphenChecked,
    setIsMultipleDimensionSeparatorHyphenChecked,
  ] = useState(true);

  const [
    checkSpaceForRangeValuesSeparator,
    setCheckSpaceForRangeValuesSeparator,
  ] = useState("");
  const [isRangeValuesSeparatorTOChecked, setIsRangeValuesSeparatorTOChecked] =
    useState(true);
  const [
    isRangeValuesSeparatorHyphenChecked,
    setIsRangeValuesSeparatorHyphenChecked,
  ] = useState(true);

  const [uomsList, setUOMsList] = useState([]);
  const [selectedUOM, setSelectedUOM] = useState("");
  const [uomOrderedList, setUOMOrderedList] = useState([]);

  const [isConversionOfVAChecked, setIsConversionOfVAChecked] = useState(true);

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uomOrderedList]);
  //#endregion

  //#region  Download File Template
  const downloadFileTemplate = (fileTemplate) => {
    setSpinnerMessage("Please wait while downloading File Template...");
    setLoading(true);

    let fileName;

    if (fileTemplate === "I")
      fileName = "AttributeValueConsistencyCheckInputFileTemplate.xlsx";
    else if (fileTemplate === "U")
      fileName = "AttributeValueConsistencyCheckUOMFileTemplate.xlsx";

    fileService
      .downloadTemplateFile(fileName)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region Upload Input File to Server
  const uploadInputFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    if (currentFile) {
      // Check extension
      if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
        alert("Please select only .xlsx files");
        e.target.value = ""; // Clear the invalid file
        return;
      }

      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading input file...");
      setLoading(true);
      setUploadedInputFileName(currentFile.name);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          setInputFileName(response.data);
        })
        .catch((error) => {
          setInputFileName("");
          toast.error(error.response.data.Message, { autoClose: false });
        })
        .finally(() => {
          setLoading(false);
        });

      if (e.target.value !== "" && e.target.value !== null) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          inputFileError: "",
        }));
      }
    }
  };
  //#endregion

  //#region Upload UOM File to Server
  const uploadUOMFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    if (currentFile) {
      // Check extension
      if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
        alert("Please select only .xlsx files");
        e.target.value = ""; // Clear the invalid file
        return;
      }

      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading UOM file...");
      setLoading(true);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          setUOMFileName(response.data);
          setSpinnerMessage("Please wait while fetching UOMs from UOM file...");
          attributeValueConsistencyCheckService
            .fetchUniqueUOMs(response.data)
            .then((response) => {
              const uomsList = response.data;
              setUOMsList(uomsList);
            })
            .catch((error) => {
              // Safe check for error response
              const msg =
                error.response?.data?.Message ||
                "An error occurred while fetching UOMs.";
              toast.error(msg, { autoClose: false });
            });
        })
        .catch((error) => {
          setUOMFileName("");
          toast.error(error.response.data.Message, { autoClose: false });
        })
        .finally(() => {
          setLoading(false);
        });

      if (e.target.value !== "" && e.target.value !== null) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          uomFileError: "",
        }));
      }
    }
  };
  //#endregion

  //#region on Change Multiple Values Separator
  const onChangeMultipleValuesSeparator = (e) => {
    let value = e.target.value;

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        multipleValuesSeparatorError: "",
      }));
    }

    setMultipleValuesSeparator(value);
  };
  //#endregion

  //#region on Change of Multiple Dimension Separator Check boxes
  const onChangeMultipleDimensionSeparatorX = (e) => {
    setIsMultipleDimensionSeparatorXChecked(e.target.checked);
  };

  const onChangeMultipleDimensionSeparatorFwdSlash = (e) => {
    setIsMultipleDimensionSeparatorFwdSlashChecked(e.target.checked);
  };

  const onChangeMultipleDimensionSeparatorTO = (e) => {
    setIsMultipleDimensionSeparatorTOChecked(e.target.checked);
  };

  const onChangeMultipleDimensionSeparatorHyphen = (e) => {
    setIsMultipleDimensionSeparatorHyphenChecked(e.target.checked);
  };
  //#endregion

  //#region on Change of Range Value Separator Check boxes
  const onChangeRangeValueSeparatorTo = (e) => {
    setIsRangeValuesSeparatorTOChecked(e.target.checked);
  };

  const onChangeRangeValueSeparatorHyphen = (e) => {
    setIsRangeValuesSeparatorHyphenChecked(e.target.checked);
  };
  //#endregion

  //#region on Change of Conversion of VA Check boxes
  const onChangeIsConversionOfVAChecked = (e) => {
    setIsConversionOfVAChecked(e.target.checked);
  };
  //#endregion

  //#region on Change UOM
  const onChangeUOM = (e) => {
    setSelectedUOM(e.target.value);
  };
  //#endregion

  //#region Move to OrderedUOMsList
  const moveToOrderedUOMsList = () => {
    if (!selectedUOM) return;

    // Check if the string already exists in our object list
    const exists = uomOrderedList.some((item) => item.name === selectedUOM);

    if (!exists) {
      const newEntry = {
        id: Date.now(), // Unique ID for the Remove function
        name: selectedUOM, // This matches accessorKey: "name"
      };
      setUOMOrderedList([...uomOrderedList, newEntry]);
      setSelectedUOM(""); // Optional: reset dropdown after adding
    } else {
      toast.warning("UOM already added to the list");
    }
  };
  //#endregion

  const removeFromOrderedList = (rowToDelete) => {
    // Filter out the item based on a unique ID
    setUOMOrderedList((prev) =>
      prev.filter((item) => item.id !== rowToDelete.id),
    );
  };

  //#region Validate, Process and, Download output file
  const validateAndCheck = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    let isInputFileValidated = false;
    let isUOMFileValidated = false;
    let isFileProcessedSuccessfully = false;
    let isFileDownloaded = false;
    let outputFileName = "";

    if (handleFormValidation()) {
      // 1. Get the indices from the selection state
      const selectedUOMsIndices = Object.keys(uomOrderedList);

      // 2. Map those indices to the actual names from uom Ordered List
      const selectedUOMsNames = selectedUOMsIndices.map(
        (index) => uomOrderedList[index]?.name,
      );

      var data = {
        InputFileName: inputFileName,
        UploadedInputFileName: uploadedInputFileName,
        UOMFileName: uomFileName,
        MultipleValuesSeparator: multipleValuesSeparator,
        CheckSpaceBeforeUOM: checkSpaceBeforeUOM,
        CheckSpaceForMultipleDimensionSeparator:
          checkSpaceForMultipleDimensionSeparator,
        IsMultipleDimensionSeparatorXChecked:
          isMultipleDimensionSeparatorXChecked,
        IsMultipleDimensionSeparatorFWDSlashChecked:
          isMultipleDimensionSeparatorFwdSlashChecked,
        IsMultipleDimensionSeparatorTOChecked:
          isMultipleDimensionSeparatorTOChecked,
        IsMultipleDimensionSeparatorHyphenChecked:
          isMultipleDimensionSeparatorHyphenChecked,
        CheckSpaceForRangeValuesSeparator: checkSpaceForRangeValuesSeparator,
        IsRangeValuesSeparatorTOChecked: isRangeValuesSeparatorTOChecked,
        IsRangeValuesSeparatorHyphenChecked:
          isRangeValuesSeparatorHyphenChecked,
        SelectedOrderedUOMList: selectedUOMsNames,
        IsConversionOfVAChecked: isConversionOfVAChecked,
        UserID: helper.getUser(),
      };

      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setInputFileValidationStatus(false);
      setUOMFileValidationStatus(false);

      attributeValueConsistencyCheckService
        .validateInputFile(inputFileName)
        .then((response) => {
          setInputFileValidationStatus("success");
          setUOMFileValidationStatus("loading");
          isInputFileValidated = true;
          return attributeValueConsistencyCheckService.validateUOMFile(
            uomFileName,
          );
        })
        .then((response) => {
          setUOMFileValidationStatus("success");
          setProcessingStatus("loading");
          isUOMFileValidated = true;
          return attributeValueConsistencyCheckService.checkAttributeValueConsistency(
            data,
          );
        })
        .then((response) => {
          outputFileName = response.data;
          setProcessingStatus("success");
          setDownloadingStatus("loading");
          isFileProcessedSuccessfully = true;
          return fileService.downloadOutputFile(outputFileName);
        })
        .then((response) => {
          setDownloadingStatus("success");
          isFileDownloaded = true;
          setSuccessMessage(
            "Attribute Value Consistency Check completed successfully and output is updated in the downloaded file.",
          );
          let fileName = "Output_" + uploadedInputFileName;
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
          setShowCloseButton(true);
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setErrorMessage(errorMessage);
          setShowCloseButton(true);

          if (!isInputFileValidated) {
            setInputFileName("");
            setInputFileValidationStatus("error");
            return;
          }

          if (!isUOMFileValidated) {
            setInputFileName("");
            setUOMFileName("");
            setUOMFileValidationStatus("error");
            return;
          }

          if (!isFileProcessedSuccessfully) {
            setProcessingStatus("error");
            return;
          }

          if (!isFileDownloaded) {
            setDownloadingStatus("error");
            return;
          }
        });
    }
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const formErrors = {};
    let isValidForm = true;

    if (!inputFileName) {
      isValidForm = false;
      formErrors["inputFileError"] = "Input File is required";
    }

    if (!uomFileName) {
      isValidForm = false;
      formErrors["uomFileError"] = "UOM File is required";
    }

    if (!multipleValuesSeparator) {
      isValidForm = false;
      formErrors["multipleValuesSeparatorError"] =
        "Multiple Values Separator is required";
    }

    if (!checkSpaceBeforeUOM) {
      isValidForm = false;
      formErrors["checkSpaceBeforeUOMError"] =
        "Check Space Before UOM is required";
    }

    if (!checkSpaceForMultipleDimensionSeparator) {
      isValidForm = false;
      formErrors["multipleDimensionSeparatorError"] =
        "Check Space For Multiple Dimension Separator is required";
    }

    if (!checkSpaceForRangeValuesSeparator) {
      isValidForm = false;
      formErrors["rangeValuesSeparatorError"] =
        "Check Space For Range Values Separator is required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  const onChangeSpaceBeforeUOM = (e) => {
    setCheckSpaceBeforeUOM(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        checkSpaceBeforeUOMError: "",
      }));
    }
  };

  const onChangeCheckSpaceForMultipleDimensionSeparator = (e) => {
    setCheckSpaceForMultipleDimensionSeparator(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        multipleDimensionSeparatorError: "",
      }));
    }
  };

  const onChangeCheckSpaceForRangeValueSeparator = (e) => {
    setCheckSpaceForRangeValuesSeparator(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        rangeValuesSeparatorError: "",
      }));
    }
  };

  //#region Refresh page
  const refreshPage = () => {
    setLoading(false);
    setSpinnerMessage("");
    setUploadedInputFileName("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setUOMFileName("");
    setUOMFileKey(Date.now());
    setMultipleValuesSeparator(", ");
    setCheckSpaceBeforeUOM("");
    setCheckSpaceForMultipleDimensionSeparator("");
    setIsMultipleDimensionSeparatorXChecked(true);
    setIsMultipleDimensionSeparatorFwdSlashChecked(true);
    setIsMultipleDimensionSeparatorTOChecked(true);
    setIsMultipleDimensionSeparatorHyphenChecked(true);
    setCheckSpaceForRangeValuesSeparator("");
    setIsRangeValuesSeparatorTOChecked(true);
    setIsRangeValuesSeparatorHyphenChecked(true);
    setUOMsList([]);
    setSelectedUOM("");
    setUOMOrderedList([]);
    setIsConversionOfVAChecked(true);
    setFormErrors({});
    setShowModal(false);
    setInputFileValidationStatus("pending");
    setUOMFileValidationStatus("pending");
    setProcessingStatus("pending");
    setDownloadingStatus("pending");
    setSuccessMessage("");
    setErrorMessage("");
    setShowCloseButton(false);
  };
  //#endregion

  return (
    <div className="p-2 rounded bg-white">
      <h4>Attribute Value Consistency Check</h4>
      <div className="border container-fluid" style={{ width: "100%" }}>
        <LoadingOverlay
          active={loading}
          className="custom-loader"
          spinner={
            <div className="spinner-background text-center">
              <BarLoader
                css={helper.getcss()}
                color={"#38D643"}
                width={"100%"}
                height={"10px"}
                speedMultiplier={0.3}
              />
              <p className="mt-2 text-dark">{spinnerMessage}</p>
            </div>
          }
        >
          {/* Download Links Row */}
          <Row>
            <Col xs={12} md={4} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile mt-2">
                <Link
                  to="#/"
                  id="lnkDownloadInputFileTemplate"
                  name="lnkDownloadInputFileTemplate"
                  onClick={() => downloadFileTemplate("I")}
                >
                  Download Input File Template
                </Link>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile mt-2">
                <Link
                  to="#/"
                  id="lnkDownloadUOMFileTemplate"
                  name="lnkDownloadUOMFileTemplate"
                  onClick={() => downloadFileTemplate("U")}
                >
                  Download UOM File Template
                </Link>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-2"></Col>
          </Row>
          <div className="border border-lime-500 p-2 flex items-center gap-4 mb-2">
            <Row>
              <Col xs={12} md={4} className="mb-2">
                <div
                  className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                  style={{ width: "100%" }}
                >
                  <FloatingLabel
                    label={
                      <>
                        Input File <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="file"
                      className="form-control"
                      tabIndex="15"
                      id="inputFile"
                      name="inputFile"
                      accept=".xlsx"
                      key={inputFileKey}
                      onChange={uploadInputFile}
                    />
                  </FloatingLabel>
                  <div className="error-message">
                    {formErrors["inputFileError"]}
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} className="mb-2">
                <div
                  className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                  style={{ width: "100%" }}
                >
                  <FloatingLabel
                    label={
                      <>
                        Select UOM file <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="file"
                      className="form-control"
                      tabIndex="15"
                      id="uomFile"
                      name="uomFile"
                      accept=".xlsx"
                      key={uomFileKey}
                      onChange={uploadUOMFile}
                    />
                  </FloatingLabel>
                  <div className="error-message">
                    {formErrors["uomFileError"]}
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div
                  className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                  style={{ width: "100%", paddingTop: "2%" }}
                >
                  <span style={{ fontSize: "12px" }}>
                    Multiple Values Separator{" "}
                  </span>
                  <span className="text-danger">*</span>
                  {"   "}
                  <input
                    type="text"
                    id="txtMultipleValuesSeparator"
                    name="txtMultipleValuesSeparator"
                    style={{ width: "30px" }}
                    value={multipleValuesSeparator}
                    onChange={onChangeMultipleValuesSeparator}
                    title="Enter multiple values separator"
                  />
                  <div className="error-message">
                    {formErrors["multipleValuesSeparatorError"]}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="border border-lime-500 p-2 flex items-center gap-4 mb-2">
            <Row>
              <Col xs={12} md={3} className="mb-2">
                <span style={{ fontSize: "12px" }}>
                  1. Check Spacing before UOM{" "}
                </span>
              </Col>
              <Col xs={12} md={2} className="mb-2">
                <Row>
                  <Col xs={12} md={6} className="mb-2">
                    <div>
                      <input
                        type="radio"
                        name="group3"
                        id="rdoCheckSpaceBeforeUOMWithSpace"
                        value="W"
                        checked={checkSpaceBeforeUOM === "W"}
                        onChange={onChangeSpaceBeforeUOM}
                        title="select if, space before UOM is required"
                      />
                      <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                        With Space
                      </label>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="mb-2">
                    <div>
                      <input
                        type="radio"
                        name="group2"
                        id="rdoCheckSpaceBeforeUOMWithoutSpace"
                        value="O"
                        checked={checkSpaceBeforeUOM === "O"}
                        onChange={onChangeSpaceBeforeUOM}
                        title="select if, space before UOM is not required"
                      />
                      <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                        Without Space
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="error-message">
                  {formErrors["checkSpaceBeforeUOMError"]}
                </div>
              </Col>
              <Col xs={12} md={7} className="mb-2"></Col>
            </Row>
            <Row>
              <Col xs={12} md={3} className="mb-2">
                <span style={{ fontSize: "12px" }}>
                  2. Multiple Dimension Separator{" "}
                </span>
              </Col>
              <Col xs={12} md={2} className="mb-2">
                <Row>
                  <Col xs={12} md={6} className="mb-2">
                    <div>
                      <input
                        type="radio"
                        name="group4"
                        id="rdoMultipleDimensionSeparatorWithSpace"
                        value="W"
                        checked={checkSpaceForMultipleDimensionSeparator === "W"}
                        onChange={
                          onChangeCheckSpaceForMultipleDimensionSeparator
                        }
                        title="select if, space for multiple dimension separator is required"
                      />
                      <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                        With Space
                      </label>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="mb-2">
                    <div>
                      <input
                        type="radio"
                        name="group5"
                        id="rdoMultipleDimensionSeparatorWithoutSpace"
                        value="O"
                        checked={checkSpaceForMultipleDimensionSeparator === "O"}
                        onChange={
                          onChangeCheckSpaceForMultipleDimensionSeparator
                        }
                        title="select if, space for multiple dimension separator is not required"
                      />
                      <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                        Without Space
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="error-message">
                  {formErrors["multipleDimensionSeparatorError"]}
                </div>
              </Col>
              <Col xs={12} md={7} className="mb-2"></Col>
            </Row>
            <Row>
              <Col xs={12} md={2} className="mb-2">
                <label
                  className="flex items-center gap-1 ml-4"
                  style={{ fontSize: "12px" }}
                >
                  <input
                    type="checkbox"
                    id="chkMultipleDimensionSeparatorX"
                    name="chkMultipleDimensionSeparatorX"
                    checked={isMultipleDimensionSeparatorXChecked}
                    onChange={onChangeMultipleDimensionSeparatorX}
                  />{" "}
                  X
                </label>
                <label
                  className="flex items-center gap-1 ml-4"
                  style={{ fontSize: "12px" }}
                >
                  <input
                    type="checkbox"
                    id="chkMultipleDimensionSeparatorFwdSlash"
                    name="chkMultipleDimensionSeparatorFwdSlash"
                    checked={isMultipleDimensionSeparatorFwdSlashChecked}
                    onChange={onChangeMultipleDimensionSeparatorFwdSlash}
                  />{" "}
                  /
                </label>
                <label
                  className="flex items-center gap-1 ml-4"
                  style={{ fontSize: "12px" }}
                >
                  <input
                    type="checkbox"
                    id="chkMultipleDimensionSeparatorTo"
                    name="chkMultipleDimensionSeparatorTo"
                    checked={isMultipleDimensionSeparatorTOChecked}
                    onChange={onChangeMultipleDimensionSeparatorTO}
                  />{" "}
                  TO
                </label>
                <label
                  className="flex items-center gap-1 ml-4"
                  style={{ fontSize: "12px" }}
                >
                  <input
                    type="checkbox"
                    id="chkMultipleDimensionSeparatorHyphen"
                    name="chkMultipleDimensionSeparatorHyphen"
                    checked={isMultipleDimensionSeparatorHyphenChecked}
                    onChange={onChangeMultipleDimensionSeparatorHyphen}
                  />{" "}
                  -
                </label>
              </Col>
              <Col xs={12} md={2} className="mb-2"></Col>
              <Col xs={12} md={7} className="mb-2"></Col>
            </Row>
            <Row>
              <Col xs={12} md={3} className="mb-2">
                <span style={{ fontSize: "12px" }}>
                  3. Range Value Separator{" "}
                </span>
              </Col>
              <Col xs={12} md={2} className="mb-2">
                <Row>
                  <Col xs={12} md={6} className="mb-2">
                    <div>
                      <input
                        type="radio"
                        name="rdoRangeValueSeparatorWithSpace"
                        id="rdoRangeValueSeparatorWithSpace"
                        value="W"
                        checked={checkSpaceForRangeValuesSeparator === "W"}
                        onChange={onChangeCheckSpaceForRangeValueSeparator}
                        title="select if, space for range value separator is required"
                      />
                      <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                        With Space
                      </label>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="mb-2">
                    <div>
                      <input
                        type="radio"
                        name="rdoRangeValueSeparatorWithoutSpace"
                        id="rdoRangeValueSeparatorWithoutSpace"
                        value="O"
                        checked={checkSpaceForRangeValuesSeparator === "O"}
                        onChange={onChangeCheckSpaceForRangeValueSeparator}
                        title="select if, space for range value separator is not required"
                      />
                      <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                        Without Space
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="error-message">
                  {formErrors["rangeValuesSeparatorError"]}
                </div>
              </Col>
              <Col xs={12} md={7} className="mb-2"></Col>
            </Row>
            <Row>
              <Col xs={12} md={3} className="mb-2">
                <label
                  className="flex items-center gap-1 ml-4"
                  style={{ fontSize: "12px" }}
                >
                  <input
                    type="checkbox"
                    id="chkRangeValueSeparatorTo"
                    name="chkRangeValueSeparatorTo"
                    checked={isRangeValuesSeparatorTOChecked}
                    onChange={onChangeRangeValueSeparatorTo}
                  />{" "}
                  TO
                </label>
                <label
                  className="flex items-center gap-1 ml-4"
                  style={{ fontSize: "12px" }}
                >
                  <input
                    type="checkbox"
                    id="chkRangeValueSeparatorHyphen"
                    name="chkRangeValueSeparatorHyphen"
                    checked={isRangeValuesSeparatorHyphenChecked}
                    onChange={onChangeRangeValueSeparatorHyphen}
                  />{" "}
                  -
                </label>
              </Col>
              <Col xs={12} md={2} className="mb-2"></Col>
              <Col xs={12} md={7} className="mb-2"></Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
                <span style={{ fontSize: "12px" }}>
                  4. Order of Attribute Values Dimensions{" "}
                </span>
              </Col>
              <Col xs={12} md={2} className="mb-2"></Col>
              <Col xs={12} md={7} className="mb-2"></Col>
            </Row>
            <Row>
              <Col xs={12} md={1} className="mb-2">
                <div style={{ fontSize: "12px", marginTop: "110px" }}>UOM </div>
              </Col>
              <Col xs={12} md={3} className="mb-2">
                <div>
                  <select
                    className="form-control"
                    style={{ width: "200px", marginTop: "100px" }}
                    id="cmbUOM"
                    name="cmbUOM"
                    value={selectedUOM}
                    onChange={onChangeUOM}
                  >
                    <option value="">--Select uom--</option>
                    {uomsList.map((uom) => (
                      <option key={uom}>{uom}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col xs={12} md={3} className="mb-2">
                <Button
                  variant="contained"
                  style={{ width: "250px", marginTop: "100px" }}
                  id="btnMoveToOrderedSequence"
                  name="btnMoveToOrderedSequence"
                  onClick={moveToOrderedUOMsList}
                >
                  Move To Ordered Sequence →
                </Button>
              </Col>
              <Col xs={12} md={5} className="mb-2">
                <MaterialReactTable
                  columns={[
                    {
                      accessorKey: "name", // First Column: UOM Name
                      header: "UOM",
                      size: 150,
                    },
                    {
                      header: "Remove", // Second Column: Action Button
                      id: "remove-action",
                      Cell: ({ row }) => (
                        <IconButton
                          color="error"
                          onClick={() => removeFromOrderedList(row.original)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ),
                      size: 100,
                    },
                  ]}
                  data={uomOrderedList}
                  initialState={{ density: "compact" }}
                  muiTableBodyRowProps={{
                    sx: {
                      height: 24, // 👈 set row height
                      "& td": {
                        paddingTop: "2px",
                        paddingBottom: "2px",
                      },
                    },
                  }}
                  enablePagination={false}
                  muiTableContainerProps={{ sx: { height: 160 } }}
                  muiTopToolbarProps={{
                    sx: {
                      backgroundColor: "#f0f4ff", // light blue background
                      padding: "8px 12px",
                    },
                  }}
                  renderTopToolbarCustomActions={() => (
                    <Box sx={{ fontWeight: 500 }}>UOMs to check in order</Box>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} className="mb-2">
                <input
                  type="checkbox"
                  id="chkConversionOfUOM"
                  name="chkConversionOfUOM"
                  checked={isConversionOfVAChecked}
                  onChange={onChangeIsConversionOfVAChecked}
                />{" "}
                <span style={{ fontSize: "12px" }}>
                  5. Check conversion of Volts/Amps to KiloVolts/KiloAmps for
                  values &gt;=1000 (V/VAC/VDC/A/VA){" "}
                </span>
              </Col>
            </Row>
          </div>
          <div className="mb-2">
            <Row>
              <Col xs={12} md={2}></Col>
              <Col xs={12} md={6} className="text-center">
                <button
                  className="btn btn-gray-700"
                  id="btnValidateAndCheck"
                  name="btnValidateAndCheck"
                  onClick={validateAndCheck}
                  style={{
                    maxWidth: "100%",
                    width: "350px",
                    fontSize: "0.875rem",
                  }}
                >
                  Validate and Check
                </button>
              </Col>
              <Col xs={12} md={4} className="align-left">
                <button
                  className="btn btn-gray-700"
                  id="btnRefresh"
                  name="btnRefresh"
                  onClick={refreshPage}
                  style={{
                    maxWidth: "100%",
                    width: "100px",
                    fontSize: "0.875rem",
                  }}
                >
                  Refresh
                </button>
              </Col>
            </Row>
          </div>
        </LoadingOverlay>
        <Modal
          show={showModal}
          onHide={refreshPage}
          className="edit-gop-modal mymnmdl viewsug mrdictionary"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Validating and Processing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="mymdldata"
              style={{ paddingBottom: "0px", width: "100%" }}
            >
              <table className="table table-bordered">
                <tbody className="mrodicttblebdy">
                  {[
                    {
                      status: inputFileValidationStatus,
                      label: "Validating the input file first worksheet",
                    },
                    {
                      status: uomFileValidationStatus,
                      label: "Validating the UOM file first worksheet",
                    },
                    {
                      status: processingStatus,
                      label:
                        "Checking Attribute Value consistency and writing to the output file",
                    },
                    {
                      status: downloadingStatus,
                      label: "Downloading the output file",
                    },
                  ].map((item, index) => (
                    <tr className="txt-plce mrodictcnt mt-2 mb-2" key={index}>
                      <td
                        style={{
                          width: "25px",
                          textAlign: "center",
                          visibility: "hidden",
                        }}
                      >
                        {processingStatus === "success" && (
                          <img
                            src={checkmarkIcon}
                            alt="checkmark"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                      </td>
                      <td style={{ width: "25px", textAlign: "center" }}>
                        {item.status === "loading" && (
                          <img
                            src={loaderIcon}
                            alt="loadericon"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                        {item.status === "success" && (
                          <img
                            src={checkmarkIcon}
                            alt="checkmark"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                        {item.status === "error" && (
                          <img
                            src={errorIcon}
                            alt="erroricon"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                        {item.status !== "success" &&
                          item.status !== "loading" &&
                          item.status !== "error" && (
                            <span className="reptimg">Pending</span>
                          )}
                      </td>
                      <td>
                        <b>
                          {index + 1}. {item.label}
                        </b>
                      </td>
                      <td
                        style={{
                          width: "25px",
                          textAlign: "center",
                          visibility: "hidden",
                        }}
                      >
                        {processingStatus === "success" && (
                          <img
                            src={checkmarkIcon}
                            alt="checkmark"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="insttxt">
                <b></b>
              </span>
              <div className="mt-2 mysgtdta successmsg">
                {(successMessage || errorMessage) && (
                  <div className="mt-2 mysgtdta successmsg">
                    {successMessage && (
                      <div className="alert alert-success">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="mrodta alert alert-danger">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {showCloseButton && (
              <Button
                variant="secondary"
                onClick={refreshPage}
                className="vewsubmit-button"
              >
                <i className="fa fa-close mr-1"></i> Close
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
