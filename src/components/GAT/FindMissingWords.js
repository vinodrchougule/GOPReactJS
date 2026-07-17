import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import { Row, Col, Modal } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
  Box,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import projectService from "../../services/project.service";
import findMissingWordsService from "../../services/GATServices/findMissingWords.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
toast.configure();

export default function FindMissingWords() {
  //#region Initializing State
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [inputColumns, setInputColumns] = useState([]);
  const [outputColumns, setOutputColumns] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [inputFileName, setInputFileName] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [validationStatus, setValidationStatus] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");
  const [successMessage, setSuccessMessage] = useState("");

  const availableColsConfig = [
    { accessorKey: "columnName", header: "Column Name" },
  ];
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFileName]);
  //#endregion

  //#region Add To Input
  const addToInput = () => {
    const rowsToAdd = Object.keys(selectedRows).map(
      (key) => availableColumns[key]
    );
    setInputColumns([...inputColumns, ...rowsToAdd]);
    setAvailableColumns(
      availableColumns.filter(
        (col) => !rowsToAdd.some((sel) => sel.columnName === col.columnName)
      )
    );
    setSelectedRows({});

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      inputColumnsError: "",
    }));
  };
  //#endregion

  //#region Add To Output
  const addToOutput = () => {
    const rowsToAdd = Object.keys(selectedRows).map(
      (key) => availableColumns[key]
    );
    setOutputColumns([...outputColumns, ...rowsToAdd]);
    setAvailableColumns(
      availableColumns.filter(
        (col) => !rowsToAdd.some((sel) => sel.columnName === col.columnName)
      )
    );
    setSelectedRows({});

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      outputColumnsError: "",
    }));
  };
  //#endregion

  //#region Remove From Input
  const removeFromInput = (col) => {
    // Remove from inputColumns
    setInputColumns((prev) =>
      prev.filter((c) => c.columnName !== col.columnName)
    );

    // Add to availableColumns if not already there
    setAvailableColumns((prev) => {
      if (!prev.some((c) => c.columnName === col.columnName)) {
        return [...prev, col];
      }
      return prev; // no change if already present
    });
  };
  //#endregion

  //#region Remove From Output
  const removeFromOutput = (col) => {
    // Remove from outputColumns
    setOutputColumns((prev) =>
      prev.filter((c) => c.columnName !== col.columnName)
    );

    // Add to availableColumns if not already there
    setAvailableColumns((prev) => {
      if (!prev.some((c) => c.columnName === col.columnName)) {
        return [...prev, col];
      }
      return prev; // no change if already present
    });
  };
  //#endregion

  //#region Handle Check All
  const handleCheckAll = (e) => {
    setCheckAll(e.target.checked);

    if (e.target.checked) {
      const allSelected = {};
      availableColumns.forEach((col, idx) => {
        if (col.columnName.toUpperCase().startsWith("ATTRIBUTE VALUE")) {
          allSelected[idx] = true;
        }
      });
      setSelectedRows(allSelected);
    } else {
      setSelectedRows({});
    }
  };
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
      setUploadedFileName(currentFile.name);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          const fileName = response.data;
          setInputFileName(fileName);
          findMissingWordsService
            .readColumnNamesFromFile(fileName)
            .then((response) => {
              const columnsList = response.data;
              const data = columnsList.map((item, index) => ({
                id: index + 1,
                columnName: item,
              }));
              setAvailableColumns(data);
            })
            .catch((error) => {
              let errorMessage = error.response.data.Message;
              console.log(errorMessage);
            });
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setInputFileName("");
          setValidationStatus("error");
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

  //#region Refresh page
  const refreshPage = () => {
    setAvailableColumns([]);
    setCheckAll(false);
    setInputColumns([]);
    setOutputColumns([]);

    setLoading(false);
    setSpinnerMessage("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setUploadedFileName("");
    setShowModal(false);
    setValidationStatus("pending");
    setProcessingStatus("pending");
    setDownloadingStatus("pending");
    setSuccessMessage("");
    setErrorMessage("");
    setShowCloseButton(false);
    setFormErrors({});
  };
  //#endregion

  //#region Validate, Process and, Download output file
  const validateAndProcess = (e) => {
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
      const inputColsStringArray = inputColumns.map((col) => col.columnName);
      const outputColsStringArray = outputColumns.map((col) => col.columnName);

      var data = {
        FileName: inputFileName,
        InputColumns: inputColsStringArray,
        OutputColumns: outputColsStringArray,
      };

      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setValidationStatus("loading");

      findMissingWordsService
        .validateInputFileData(data)
        .then((response) => {
          setValidationStatus("success");
          setProcessingStatus("loading");
          isInputFileValidated = true;
          return findMissingWordsService.findMissingRepeatedAndNewWordsAndWriteToExcel(
            data
          );
        })
        .then((response) => {
          outputFileName = response.data;
          setProcessingStatus("success");
          setDownloadingStatus("loading");
          isFileProcessedSuccessfully = true;
          return findMissingWordsService.downloadOutputFile(outputFileName);
        })
        .then((response) => {
          setDownloadingStatus("success");
          isFileDownloaded = true;
          setSuccessMessage(
            "Input file data processed successfully and output is updated in the downloaded file."
          );
          let fileName = "Output_" + uploadedFileName;
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
            setValidationStatus("error");
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

    if (inputColumns.length === 0) {
      isValidForm = false;
      formErrors["inputColumnsError"] = "Input Column(s) is/are required";
    }

    if (outputColumns.length === 0) {
      isValidForm = false;
      formErrors["outputColumnsError"] = "Output Column(s) is/are required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region main return
  return (
    <div>
      <div className="mg-l-40 container-fluid px-3" style={{ width: "95%" }}>
        <h4>Find Missing, Repeated and, New Words</h4>
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
              <Row className="mb-1">
                <Col xs={12} md={12}>
                  <div
                    className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                    style={{ width: "100%" }}
                  >
                    <FloatingLabel
                      label={
                        <>
                          Select Input File{" "}
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
                        onChange={handleFileChange}
                      />
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["inputFileError"]}
                    </div>
                  </div>
                </Col>

                <Col xs={12} md={4}></Col>

                <Col xs={12} md={4}></Col>
              </Row>
              <div className="p-3 border rounded bg-white mb-3">
                <Grid container spacing={2} alignItems="stretch">
                  {/* Available Columns */}
                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <MaterialReactTable
                        columns={availableColsConfig}
                        data={availableColumns}
                        enablePagination={false}
                        enableRowSelection
                        onRowSelectionChange={setSelectedRows}
                        state={{ rowSelection: selectedRows }}
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
                            Select Column(s) to move to input or output
                          </Box>
                        )}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkAll}
                            onChange={handleCheckAll}
                          />
                        }
                        label="Check ALL Attribute Value Columns"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>

                  {/* Move Buttons */}
                  <Grid
                    item
                    xs={12}
                    md={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={28}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={addToInput}
                      disabled={Object.keys(selectedRows).length === 0}
                    >
                      Move To Input →
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addToOutput}
                      disabled={Object.keys(selectedRows).length === 0}
                    >
                      Move To Output →
                    </Button>
                  </Grid>

                  {/* Input & Output Columns */}
                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <MaterialReactTable
                      columns={[
                        { accessorKey: "columnName", header: "Column Name" },
                        {
                          header: "Remove",
                          Cell: ({ row }) => (
                            <IconButton
                              color="error"
                              onClick={() => removeFromInput(row.original)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ),
                        },
                      ]}
                      data={inputColumns}
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
                      muiTableContainerProps={{ sx: { height: 200 } }}
                      muiTopToolbarProps={{
                        sx: {
                          backgroundColor: "#f0f4ff", // light blue background
                          padding: "8px 12px",
                        },
                      }}
                      renderTopToolbarCustomActions={() => (
                        <Box sx={{ fontWeight: 500 }}>Input Columns</Box>
                      )}
                    />
                    <div className="error-message">
                      {formErrors["inputColumnsError"]}
                    </div>
                    <Box mt={2} />
                    <MaterialReactTable
                      columns={[
                        { accessorKey: "columnName", header: "Column Name" },
                        {
                          header: "Remove",
                          Cell: ({ row }) => (
                            <IconButton
                              color="error"
                              onClick={() => removeFromOutput(row.original)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ),
                        },
                      ]}
                      data={outputColumns}
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
                      muiTableContainerProps={{ sx: { height: 200 } }}
                      muiTopToolbarProps={{
                        sx: {
                          backgroundColor: "#f0f4ff", // light blue background
                          padding: "8px 12px",
                        },
                      }}
                      renderTopToolbarCustomActions={() => (
                        <Box sx={{ fontWeight: 500 }}>Output Columns</Box>
                      )}
                    />
                    <div className="error-message">
                      {formErrors["outputColumnsError"]}
                    </div>
                  </Grid>
                </Grid>
              </div>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <button
                    className="btn btn-gray-700"
                    style={{ width: "350px", fontSize: "0.875rem" }}
                    onClick={validateAndProcess}
                  >
                    Validate and Process
                  </button>
                </Col>
                <Col xs="auto">
                  <button
                    className="btn btn-gray-700"
                    style={{ width: "100px", fontSize: "0.875rem" }}
                    onClick={refreshPage}
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
                        status: validationStatus,
                        label: "Validating the input file",
                      },
                      {
                        status: processingStatus,
                        label:
                          "Finding Missing Words, Repeated Words and, New Words",
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
    </div>
  );
  //#endregion
}
