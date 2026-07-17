import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import fileService from "../../services/GATServices/fileServices.service";
import projectService from "../../services/project.service";
import samplingSelectionService from "../../services/GATServices/samplingSelection.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
toast.configure();

export default function SamplingSelection() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [samplingSelectionPercentage, setSamplingSelectionPercentage] =
    useState();

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [inputFileStatus, setInputFileStatus] = useState("pending");
  const [checkDuplicateMaterialStatus, setCheckDuplicateMaterialStatus] =
    useState("pending");
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");

  //#region  Download Input File Template
  const downloadInputFileTemplate = () => {
    setSpinnerMessage("Please wait while downloading Input File Template...");
    setLoading(true);

    let fileName = "SamplingSelectionInputFileTemplate.xlsx";

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
        alert("Please select only .xlsx file");
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

  //#region on Change Sampling Selection Percentage
  const onChangeSamplingSelectionPercentage = (e) => {
    let value = e.target.value.toString();

    value = value.replace(/\D/g, "");

    // Enforce min/max manually
    if (value < 1) value = 1;
    if (value > 99) value = 99;

    setSamplingSelectionPercentage(value);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        samplingSelectionPercentageError: "",
      }));
    }
  };
  //#endregion

  //#region Validate and Process
  const validateAndProcess = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    let isInputFileValidated = false;
    let isDuplicateMaterialNoCheckCompleted = false;
    let isFileProcessedSuccessfully = false;
    let isFileDownloaded = false;
    let outputFileName = "";
    let sqlTableName = "";

    if (handleFormValidation()) {
      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setInputFileStatus("loading");

      samplingSelectionService
        .validateInputFile(inputFileName, samplingSelectionPercentage)
        .then((response) => {
          setInputFileStatus("success");
          setCheckDuplicateMaterialStatus("loading");
          isInputFileValidated = true;
          return samplingSelectionService.checkDuplicateMaterialNoExists(
            inputFileName
          );
        })
        .then((response) => {
          sqlTableName = response.data;
          setCheckDuplicateMaterialStatus("success");
          setProcessingStatus("loading");
          isDuplicateMaterialNoCheckCompleted = true;
          return samplingSelectionService.selectRandomRowsAndWriteToOutputFile(
            uploadedInputFileName,
            inputFileName,
            sqlTableName,
            samplingSelectionPercentage
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
            "Sampling selection completed successfully and output is updated in the downloaded file."
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

          if (!isDuplicateMaterialNoCheckCompleted) {
            setInputFileName("");
            setCheckDuplicateMaterialStatus("error");
            return;
          }

          if (!isFileProcessedSuccessfully) {
            setInputFileName("");
            setProcessingStatus("error");
            return;
          }

          if (!isFileDownloaded) {
            setInputFileName("");
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

    if (!samplingSelectionPercentage) {
      isValidForm = false;
      formErrors["samplingSelectionPercentageError"] =
        "Sampling Selection Percentage is required";
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
    setSamplingSelectionPercentage("");
    setShowModal(false);
    setInputFileStatus("pending");
    setCheckDuplicateMaterialStatus("pending");
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
      <h4>Sampling Selection</h4>
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
          <Row className="mb-3 align-items-center">
            <Col xs={12} md={6}>
              <div className="createProjectFloatingChooseFileInput gdlInputFile">
                <Link to="#/" onClick={downloadInputFileTemplate}>
                  Download Input File Template
                </Link>
              </div>
            </Col>
          </Row>

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
                  <Col xs={6} md={6} className="mb-3">
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                      style={{ width: "100%", paddingTop: "2%" }}
                    >
                      <span style={{ fontSize: "12px" }}>
                        Sampling Percentage{" "}
                      </span>
                      <span className="text-danger">*</span>
                      {"   "}
                      <input
                        type="number"
                        id="samplingSelectionPercentage"
                        style={{ width: "40px" }}
                        min="1"
                        max="99"
                        step="1"
                        value={samplingSelectionPercentage}
                        onChange={onChangeSamplingSelectionPercentage}
                        title="Enter Sampling Selection percentage"
                      />
                      {"   "}
                      <span>%</span>
                      <div className="error-message">
                        {formErrors["samplingSelectionPercentageError"]}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={2}></Col>
              <Col xs={12} md={4} className="text-center">
                <button
                  className="btn btn-gray-700"
                  onClick={validateAndProcess}
                  style={{
                    maxWidth: "100%",
                    width: "350px",
                    fontSize: "0.875rem",
                  }}
                >
                  Validate and Process
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
                      status: checkDuplicateMaterialStatus,
                      label: "Checking duplicate material no. in input file",
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
