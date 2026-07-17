import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import { Row, Col, Modal } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import fileService from "../../services/GATServices/fileServices.service";
import projectService from "../../services/project.service";
import findMissingWordsService from "../../services/GATServices/findMissingWords.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
import { Box, Grid, Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import duplicatesCheckGenericService from "../../services/GATServices/duplicatesCheckGeneric.service";
toast.configure();

export default function DuplicatesCheckGeneric() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [uniqueIdentifierColumns, setUniqueIdentifierColumns] = useState([]);
  const [selectedUniqueIdentifierColumn, setSelectedUniqueIdentifierColumn] =
    useState("");
  const [duplicatesToCheckBasedOn, setDuplicatesToCheckBasedOn] = useState("I");
  const [percentageMatch, setPercentageMatch] = useState(80);
  const [
    isToFindDuplicatesWithExactMatch,
    setIsToFindDuplicatesWithExactMatch,
  ] = useState(false);
  const [
    isToFindDuplicatesWithNormalizedMatch,
    setIsToFindDuplicatesWithNormalizedMatch,
  ] = useState(false);
  const [
    isToFindDuplicatesWithPercentageMatch,
    setIsToFindDuplicatesWithPercentageMatch,
  ] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [inputFileStatus, setInputFileStatus] = useState("pending");
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");

  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});

  const availableColsConfig = [
    { accessorKey: "columnName", header: "Column Name" },
  ];

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFileName]);
  //#endregion

  //#region Handle File Change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = e.target.files;
      const currentFile = files[0];

      if (currentFile) {
        // Check extension
        if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
          alert("Please select only .xlsx files");
          e.target.value = ""; // Clear the invalid file
          return;
        }
      }

      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading input file...");
      setLoading(true);
      setUploadedInputFileName(currentFile.name);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          const fileName = response.data;
          setInputFileName(fileName);
          fetchColumnNamesFromInputFile(response.data);
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setInputFileName("");
          setErrorMessage(errorMessage);
          setShowCloseButton(true);
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

  //#region Fetch Column Names From Input File
  const fetchColumnNamesFromInputFile = (fileName) => {
    setSpinnerMessage(
      "Please wait while fetching column names from input file...",
    );
    setLoading(true);
    findMissingWordsService
      .readColumnNamesFromFile(fileName)
      .then((response) => {
        const columnsList = response.data; // This is likely ["Column1", "Column2", ...]
        setUniqueIdentifierColumns(columnsList);
      })
      .catch((error) => {
        // Safe check for error response
        const msg =
          error.response?.data?.Message ||
          "An error occurred fetching columns.";
        toast.error(msg, { autoClose: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region on Change Column Selection
  const onChangeColumnSelection = (e) => {
    setSelectedUniqueIdentifierColumn(e.target.value);

    const tableData = uniqueIdentifierColumns
      .filter((col) => col !== e.target.value) // Exclude the selected ID
      .map((col) => ({
        columnName: col,
      }));

    setAvailableColumns(tableData);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        uniqueIdentifierColumnSelectionError: "",
      }));
    }
  };
  //#endregion

  //#region Validate and Check
  const validateAndCheck = (e) => {
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
      // 1. Get the indices from the selection state
      const selectedIndices = Object.keys(selectedColumns);

      // 2. Map those indices to the actual names from availableColumns
      const selectedColumnNames = selectedIndices.map(
        (index) => availableColumns[index]?.columnName,
      );

      var data = {
        InputFileName: inputFileName,
        UploadedInputFileName: uploadedInputFileName,
        UniqueIdentifierColumnName: selectedUniqueIdentifierColumn,
        ColumnsToCheckForDuplicates: selectedColumnNames,
        DuplicatesToCheckBasedOn: duplicatesToCheckBasedOn,
        PercentageMatch: percentageMatch,
        IsToFindDuplicatesWithExactMatch: isToFindDuplicatesWithExactMatch,
        IsToFindDuplicatesWithNormalizedMatch:
          isToFindDuplicatesWithNormalizedMatch,
        IsToFindDuplicatesWithPercentageMatch:
          isToFindDuplicatesWithPercentageMatch,
      };

      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setInputFileStatus("loading");

      duplicatesCheckGenericService
        .validateInputFile(inputFileName)
        .then((response) => {
          setInputFileStatus("success");
          setProcessingStatus("loading");
          isInputFileValidated = true;
          return duplicatesCheckGenericService.duplicateCheckGenericAndWriteOutputToExcel(
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
            "Duplicates check generic completed successfully and output is updated in the downloaded file.",
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
            setInputFileStatus("error");
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

  //#region Validating the input form
  const handleFormValidation = () => {
    const formErrors = {};
    let isValidForm = true;

    if (!inputFileName) {
      isValidForm = false;
      formErrors["inputFileError"] = "Input File is required";
    }

    if (!selectedUniqueIdentifierColumn) {
      isValidForm = false;
      formErrors["uniqueIdentifierColumnSelectionError"] =
        "Unique Identifier Column selection is required";
    }

    // We extract the keys from the selectedRows object and map them to the data
    const selectedCols = Object.keys(selectedColumns).map(
      (index) => availableColumns[index]?.columnName,
    );

    // Now you can safely access it
    if (!selectedCols || selectedCols.length === 0) {
      isValidForm = false;
      formErrors["columnsToFindDuplicatesSelectionError"] =
        "Column(s) selection is required";
    }

    if (
      !isToFindDuplicatesWithExactMatch &&
      !isToFindDuplicatesWithNormalizedMatch &&
      !isToFindDuplicatesWithPercentageMatch
    ) {
      isValidForm = false;
      formErrors["matchTypeError"] = "Match Type selection is required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  const onRowSelectionChange = (updater) => {
    setSelectedColumns(updater);
    // Clear the error once a selection is made
    setFormErrors((prev) => ({
      ...prev,
      columnsToFindDuplicatesSelectionError: "",
    }));
  };

  const onChangeExactMatchType = (e) => {
    setIsToFindDuplicatesWithExactMatch(e.target.checked);
    if (e.target.checked) {
      setFormErrors((prev) => ({
        ...prev,
        matchTypeError: "",
      }));
    }
  };

  const onChangeNormalizedMatchType = (e) => {
    setIsToFindDuplicatesWithNormalizedMatch(e.target.checked);
    if (e.target.checked) {
      setFormErrors((prev) => ({
        ...prev,
        matchTypeError: "",
      }));
    }
  };

  const onChangePercentageMatchType = (e) => {
    setIsToFindDuplicatesWithPercentageMatch(e.target.checked);
    if (e.target.checked) {
      setFormErrors((prev) => ({
        ...prev,
        matchTypeError: "",
      }));
    }
  };

  //#region Refresh page
  const refreshPage = () => {
    setLoading(false);
    setSpinnerMessage("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setUploadedInputFileName("");
    setUniqueIdentifierColumns([]);
    setSelectedUniqueIdentifierColumn("");
    setAvailableColumns([]);
    setSelectedColumns({});
    setDuplicatesToCheckBasedOn("I");
    setPercentageMatch(80);
    setIsToFindDuplicatesWithExactMatch(false);
    setIsToFindDuplicatesWithNormalizedMatch(false);
    setIsToFindDuplicatesWithPercentageMatch(false);
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
      <h4>Duplicates Check Generic</h4>
      <div className="create-project-page createProjectMainContent">
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
            <div className="border border-lime-500 p-2 flex items-center gap-4 mb-2">
              <Row>
                <Col xs={12} md={12}>
                  <Row>
                    <Col xs={6} md={6}>
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
                            onChange={handleFileChange}
                          />
                        </FloatingLabel>
                        <div className="error-message">
                          {formErrors["inputFileError"]}
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} md={6}>
                      <div
                        className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                        style={{ width: "100%" }}
                      >
                        <FloatingLabel
                          label={
                            <>
                              Select unique identifier column{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <select
                            className="form-control"
                            id="ddUniqueIdentifierColumn"
                            name="ddUniqueIdentifierColumn"
                            placeholder="--Select--"
                            value={selectedUniqueIdentifierColumn}
                            onChange={onChangeColumnSelection}
                          >
                            <option value="">--Select Column--</option>
                            {uniqueIdentifierColumns.map((columnName) => (
                              <option key={columnName}>{columnName}</option>
                            ))}
                          </select>
                        </FloatingLabel>
                        <div className="error-message">
                          {formErrors["uniqueIdentifierColumnSelectionError"]}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} md={6}>
                <div
                  className="p-3 border rounded bg-white mb-3"
                  style={{ height: "98%" }}
                >
                  <Grid container spacing={2} alignItems="stretch">
                    {/* Available Columns */}
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <MaterialReactTable
                          columns={availableColsConfig}
                          data={availableColumns}
                          enablePagination={false}
                          enableRowSelection
                          //onRowSelectionChange={setSelectedColumns}
                          onRowSelectionChange={onRowSelectionChange}
                          state={{ rowSelection: selectedColumns }}
                          initialState={{ density: "compact" }}
                          muiTableBodyRowProps={{
                            sx: {
                              height: 28, // 👈 set row height
                              "& td": {
                                paddingTop: "2px",
                                paddingBottom: "2px",
                              },
                            },
                          }}
                          muiTableContainerProps={{
                            sx: { height: 460 },
                          }}
                          muiTopToolbarProps={{
                            sx: {
                              backgroundColor: "#f0f4ff", // light blue background
                              padding: "8px 12px",
                            },
                          }}
                          renderTopToolbarCustomActions={() => (
                            <Box sx={{ fontWeight: 500 }}>
                              Select Column(s) to find the duplicates on
                            </Box>
                          )}
                        />
                      </Box>
                    </Grid>
                    <div className="error-message ml-3">
                      {formErrors["columnsToFindDuplicatesSelectionError"]}
                    </div>
                  </Grid>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div
                  className="w-1/2 border rounded flex flex-col gap-3"
                  style={{ height: "98%" }}
                >
                  <div
                    className="border border-lime-500 p-2 flex items-center ml-1 mr-1"
                    style={{ marginTop: "20%" }}
                  >
                    <span style={{ fontSize: "12px" }}>Based on: </span>
                    <input
                      type="radio"
                      name="group1"
                      id="rdoBasedOnIndSelCol"
                      className="flex items-center ml-2"
                      value="I"
                      checked={duplicatesToCheckBasedOn === "I"}
                      onChange={(e) =>
                        setDuplicatesToCheckBasedOn(e.target.value)
                      }
                      title="Individual selected columns"
                    />
                    <label
                      className="flex items-center ml-2"
                      htmlFor="rdoBasedOnIndSelCol"
                      style={{ fontSize: "12px" }}
                    >
                      Individual selected columns
                    </label>
                    <input
                      type="radio"
                      name="group1"
                      id="rdoBasedOnCombSelCols"
                      className="flex items-center ml-2"
                      value="C"
                      checked={duplicatesToCheckBasedOn === "C"}
                      onChange={(e) =>
                        setDuplicatesToCheckBasedOn(e.target.value)
                      }
                      title="Combination of selected columns"
                    />
                    <label
                      className="flex items-center ml-2"
                      htmlFor="rdoBasedOnCombSelCols"
                      style={{ fontSize: "12px" }}
                    >
                      Combination of selected columns
                    </label>
                  </div>

                  <div
                    className="border border-lime-500 p-2 flex items-center ml-1 mr-1"
                    style={{ marginTop: "5%" }}
                  >
                    <span
                      className="font-bold mr-2"
                      style={{ fontSize: "12px" }}
                    >
                      Apply Percentage of Match
                    </span>
                    <select
                      className="border px-2 py-1"
                      id="ddPercentageOfMatch"
                      name="ddPercentageOfMatch"
                      value={percentageMatch}
                      onChange={(e) => setPercentageMatch(e.target.value)}
                    >
                      <option value="50">50</option>
                      <option value="60">60</option>
                      <option value="70">70</option>
                      <option value="80">80</option>
                      <option value="90">90</option>
                      <option value="100">100</option>
                    </select>
                    <span className="font-bold ml-2">%</span>
                    <span className="text-danger ml-1">*</span>
                  </div>

                  <div
                    className="border border-lime-500 p-2 flex items-center ml-1 mr-1"
                    style={{ marginTop: "5%" }}
                  >
                    <label
                      className="flex items-center gap-1"
                      style={{ fontSize: "12px" }}
                    >
                      <input
                        type="checkbox"
                        id="chkExactMatch"
                        name="chkExactMatch"
                        checked={isToFindDuplicatesWithExactMatch}
                        onChange={onChangeExactMatchType}
                      />{" "}
                      Exact Match
                    </label>
                    <label
                      className="flex items-center ml-4"
                      style={{ fontSize: "12px" }}
                    >
                      <input
                        type="checkbox"
                        id="chkNormalizedMatch"
                        name="chkNormalizedMatch"
                        checked={isToFindDuplicatesWithNormalizedMatch}
                        onChange={onChangeNormalizedMatchType}
                      />{" "}
                      Normalized Match
                    </label>
                    <label
                      className="flex items-center ml-4"
                      style={{ fontSize: "12px" }}
                    >
                      <input
                        type="checkbox"
                        id="chkPercentageMatch"
                        name="chkPercentagedMatch"
                        checked={isToFindDuplicatesWithPercentageMatch}
                        onChange={onChangePercentageMatchType}
                      />{" "}
                      Percentage Match
                    </label>
                  </div>
                  <div className="error-message ml-2">
                    {formErrors["matchTypeError"]}
                  </div>
                </div>
              </Col>
            </Row>
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
            <br />
            <Row>
              <Col xs={12} md={6}>
                <span>
                  Note1: You can select any input excel file having unique
                  identifier column
                </span>
              </Col>
              <Col xs={12} md={6}>
                <span>
                  Note2: Selected % duplicates check is applied on normalized
                  col. values more than 4 chars by removing leading zeros
                </span>
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
