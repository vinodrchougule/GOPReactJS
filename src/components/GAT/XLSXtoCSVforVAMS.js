import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import { Row, Col, Modal, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import fileService from "../../services/GATServices/fileServices.service";
import projectService from "../../services/project.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
import xlsxTocsvConverterForVAMSService from "../../services/GATServices/xlsxTocsvConverterForVAMS.service";
toast.configure();

export default function XLSXtoCSVConverterforVAMS() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());

  const [hospitalName, setHospitalName] = useState("");
  const [itemOrPO, setItemOrPO] = useState("item");

  const [delimiter, setDelimiter] = useState("|");
  const [
    isToTrimLeadingAndTrailingWhitespace,
    setIsToTrimLeadingAndTrailingWhitespace,
  ] = useState(true);
  const [
    isToWriteEachHospitalDataInSeparateFile,
    setIsToWriteEachHospitalDataInSeparateFile,
  ] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [inputFileStatus, setInputFileStatus] = useState("pending");
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Hospital Name Options Array
  const hospitalNameOptions = [
    { value: "albany", label: "Albany" },
    { value: "centracare", label: "Centra Care" },
    { value: "childrensconnecticut", label: "Children's Connecticut" },
    { value: "mercy", label: "Mercy" },
    { value: "minnesota", label: "Minnesota" },
    { value: "nuvance", label: "Nuvance" },
    { value: "texas", label: "Texas" },
    { value: "uhs", label: "UHS" },
  ];
  //#endregion

  //#region Upload Input File to Server
  const uploadInputFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    if (currentFile) {
      // Check extension
      if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
        alert("Please select only .xlsx format file");
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

  //#region On change of Hospital Name and Item or PO
  const onChangeHospitalName = (e) => {
    setHospitalName(e.target.value);
    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        hospitalNameError: "",
      }));
    }
  };

  const onChangeItemOrPO = (e) => {
    setItemOrPO(e.target.value);
    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        itemOrPOError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Delimiter
  const onChangeDelimiter = (e) => {
    setDelimiter(e.target.value);
    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Validate and Convert
  const validateAndConvert = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    let isInputFileValidated = false;
    let isFileProcessedSuccessfully = false;
    let isFileDownloaded = false;
    let outputFileName = "";

    if (handleFormValidation()) {
      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setInputFileStatus("loading");
      setProcessingStatus("pending");
      setDownloadingStatus("pending");

      xlsxTocsvConverterForVAMSService
        .validateInputFileData(inputFileName)
        .then(() => {
          setInputFileStatus("success");
          setProcessingStatus("loading");
          isInputFileValidated = true;
          return xlsxTocsvConverterForVAMSService.convertXlsxToCsv(
            uploadedInputFileName,
            inputFileName,
            delimiter,
            hospitalName,
            itemOrPO,
            isToTrimLeadingAndTrailingWhitespace,
            isToWriteEachHospitalDataInSeparateFile,
          );
        })
        .then((response) => {
          setProcessingStatus("success");
          setDownloadingStatus("loading");
          isFileProcessedSuccessfully = true;
          outputFileName = response.data;
          return fileService.downloadOutputFile(outputFileName);
        })
        .then((response) => {
          setDownloadingStatus("success");
          isFileDownloaded = true;
          setSuccessMessage(
            "Input file converted successfully and output is updated in the downloaded file.",
          );
          let fileName = outputFileName;
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
            setInputFileStatus("error");
            return;
          }

          if (!isFileProcessedSuccessfully) {
            setInputFileName("");
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

  //#region Validating the input form
  const handleFormValidation = () => {
    const formErrors = {};
    let isValidForm = true;

    if (!inputFileName) {
      isValidForm = false;
      formErrors["inputFileError"] = "Input File is required";
    }

    if (!hospitalName) {
      isValidForm = false;
      formErrors["hospitalNameError"] = "Hospital Name is required";
    }

    if (!itemOrPO) {
      isValidForm = false;
      formErrors["itemOrPOError"] = "Item or PO is required";
    }

    if (!delimiter) {
      isValidForm = false;
      formErrors["delimiterError"] = "Delimiter is required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Refresh page
  const refreshPage = () => {
    setLoading(false);
    setSpinnerMessage("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setUploadedInputFileName("");
    setHospitalName("");
    setItemOrPO("item");
    setDelimiter("|");
    setIsToTrimLeadingAndTrailingWhitespace(true);
    setIsToWriteEachHospitalDataInSeparateFile(false);
    setShowModal(false);
    setInputFileStatus("pending");
    setProcessingStatus("pending");
    setDownloadingStatus("pending");
    setSuccessMessage("");
    setErrorMessage("");
    setShowCloseButton(false);
    setFormErrors({});
  };
  //#endregion

  return (
    <div className="mg-l-40 container-fluid px-3" style={{ width: "95%" }}>
      <h4>XLSX To CSV Converter for VAMS</h4>
      <div className="create-project-page createProjectMainContent py-3">
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
          {/* File Upload Section */}
          <div className="p-3 border rounded bg-white">
            <Row className="mb-3">
              <Col xs={12} md={12} className="mb-3">
                <Row>
                  <Col xs={6} md={6} className="mb-3">
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={
                          <>
                            Input File (xlsx format){" "}
                            <span className="text-danger">*</span>
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
                  <Col xs={3} md={3} className="mb-3">
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={
                          <>
                            Select Hospital{" "}
                            <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select"
                      >
                        <select
                          className="form-control"
                          id="ddHospitalName"
                          name="ddHospitalName"
                          placeholder="--Select--"
                          value={hospitalName}
                          onChange={onChangeHospitalName}
                        >
                          <option value="">--Select Hospital--</option>
                          {hospitalNameOptions.map((hospital) => (
                            <option key={hospital.label} value={hospital.value}>
                              {hospital.label}
                            </option>
                          ))}
                        </select>
                      </FloatingLabel>
                      <div className="error-message">
                        {formErrors["hospitalNameError"]}
                      </div>
                    </div>
                  </Col>
                  <Col xs={3} md={3}>
                    <Row>
                      <Col xs={3} md={3} className="mb-3">
                        <div style={{ marginTop: "25px" }}>
                          <input
                            type="radio"
                            name="group12"
                            id="radio-item"
                            value="item"
                            checked={itemOrPO === "item"}
                            onChange={onChangeItemOrPO}
                            title="select if, you have uploaded Item file"
                          />
                          <label
                            htmlFor="radio-item"
                            style={{ marginLeft: "5px" }}
                          >
                            Item
                          </label>
                        </div>
                      </Col>
                      <Col xs={3} md={3} className="mb-3">
                        <div style={{ marginTop: "25px" }}>
                          <input
                            type="radio"
                            name="group12"
                            id="radio-po"
                            value="po"
                            checked={itemOrPO === "po"}
                            onChange={onChangeItemOrPO}
                            title="select if, you have uploaded PO file"
                          />
                          <label
                            htmlFor="radio-po"
                            style={{ marginLeft: "5px" }}
                          >
                            PO
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <div className="error-message">
                      {formErrors["itemOrPOError"]}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={2} className="mb-3">
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                      style={{ width: "100%" }}
                    >
                      <lable style={{ fontSize: "14px" }}>
                        Delimiter <span className="text-danger">*</span>
                      </lable>{" "}
                      <input
                        type="text"
                        id="delimiterBetweenSingleValues"
                        style={{ width: "30px", marginTop: "10px" }}
                        maxLength="2"
                        value={delimiter}
                        onChange={onChangeDelimiter}
                        title="Enter delimiter"
                      />
                      <div className="error-message">
                        {formErrors["delimiterError"]}
                      </div>
                    </div>
                  </Col>
                  <Col xs={4} md={4}>
                    <label
                      className="switch"
                      title="Is to Trim Leading and Trailing Spaces from the cell values"
                      style={{ marginTop: "20px" }}
                    >
                      <input
                        type="checkbox"
                        name="chkTrimLeadingAndTrailingWhitespace"
                        id="chkTrimLeadingAndTrailingWhitespace"
                        style={{ marginTop: "5px" }}
                        checked={isToTrimLeadingAndTrailingWhitespace}
                        onChange={(e) =>
                          setIsToTrimLeadingAndTrailingWhitespace(
                            e.target.checked,
                          )
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <lable style={{ fontSize: "12px" }}>
                      &nbsp; Is to Trim Leading and Trailing Spaces from the
                      cell values?
                    </lable>{" "}
                  </Col>
                  <Col xs={6} md={6}>
                    <label
                      className="switch"
                      title="Is to write each hospital data in separate file?"
                      style={{ marginTop: "20px" }}
                    >
                      <input
                        type="checkbox"
                        name="chkWriteEachHospitalDataInSeparateFile"
                        id="chkWriteEachHospitalDataInSeparateFile"
                        style={{ marginTop: "5px" }}
                        checked={isToWriteEachHospitalDataInSeparateFile}
                        onChange={(e) =>
                          setIsToWriteEachHospitalDataInSeparateFile(
                            e.target.checked,
                          )
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <lable style={{ fontSize: "12px" }}>
                      &nbsp; Is to write each hospital data in separate file?
                    </lable>{" "}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={2}></Col>
              <Col xs={12} md={4} className="text-center">
                <button
                  className="btn btn-gray-700"
                  onClick={validateAndConvert}
                  style={{
                    maxWidth: "100%",
                    width: "350px",
                    fontSize: "0.875rem",
                  }}
                >
                  Validate and Convert
                </button>
              </Col>
              <Col xs={12} md={4} className="align-left">
                <button
                  className="btn btn-gray-700"
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
              <Col xs={12} md={2}></Col>
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
                      status: inputFileStatus,
                      label: "Validating the input file",
                    },
                    {
                      status: processingStatus,
                      label:
                        "Processing the file rows and writing to the output file",
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
