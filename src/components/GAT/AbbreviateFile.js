import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import { Row, Col, Modal, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";
import projectService from "../../services/project.service";
import abbreviateFileService from "../../services/GATServices/abbreviateFile.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
toast.configure();

export default function AbbreviateFile() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [abbreviationFileName, setAbbreviationFileName] = useState("");
  const [abbreviationFileKey, setAbbreviationFileKey] = useState(Date.now());

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [inputFileStatus, setInputFileStatus] = useState("pending");
  const [abbreviationFileStatus, setAbbreviationFileStatus] =
    useState("pending");
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFileName]);
  //#endregion

  //#region  Download File Template
  const downloadFileTemplate = (fileTemplate) => {
    setSpinnerMessage("Please wait while downloading File Template...");
    setLoading(true);

    let fileName;

    if (fileTemplate === "I") fileName = "AbbInputFileTemplate.xlsx";
    else if (fileTemplate === "A") fileName = "AbbreviationFileTemplate.xlsx";

    abbreviateFileService
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

  //#region Refresh page
  const refreshPage = () => {
    setLoading(false);
    setSpinnerMessage("");
    setInputFileName("");
    setAbbreviationFileName("");
    setInputFileKey(Date.now());
    setAbbreviationFileKey(Date.now());
    setShowModal(false);
    setInputFileStatus("pending");
    setAbbreviationFileStatus("pending");
    setProcessingStatus("pending");
    setDownloadingStatus("pending");
    setSuccessMessage("");
    setErrorMessage("");
    setShowCloseButton(false);
    setFormErrors({});
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
        let errorMessage = error.response.data.Message;
        setInputFileName("");
        setInputFileStatus("error");
        setErrorMessage(errorMessage);
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
  };
  //#endregion

  //#region Upload Abbreviation File to Server
  const uploadAbbreviationFile = (e) => {
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
    setSpinnerMessage("Please wait while uploading abbreviation file...");
    setLoading(true);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        setAbbreviationFileName(response.data);
      })
      .catch((error) => {
        let errorMessage = error.response.data.Message;
        setAbbreviationFileName("");
        setAbbreviationFileStatus("error");
        setErrorMessage(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region Validate and Process
  const validateAndAbbreviate = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    let isInputFileValidated = false;
    let isAbbreviationFileValidated = false;
    let isFileProcessedSuccessfully = false;
    let isFileDownloaded = false;
    let outputFileName = "";
    let inputFileSqlTableName = "";
    let abbreviationFileSqlTableName = "";

    if (handleFormValidation()) {
      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setInputFileStatus("loading");

      abbreviateFileService
        .validateAndWriteInputFileDataToDatabase(inputFileName)
        .then((response) => {
          inputFileSqlTableName = response.data;
          setInputFileStatus("success");
          setAbbreviationFileStatus("loading");
          isInputFileValidated = true;
          return abbreviateFileService.validateAndWriteAbbreviationFileDataToDatabase(
            abbreviationFileName
          );
        })
        .then((response) => {
          abbreviationFileSqlTableName = response.data;
          setAbbreviationFileStatus("success");
          setProcessingStatus("loading");
          isAbbreviationFileValidated = true;
          return abbreviateFileService.abbreviateInputFileAndWriteOutputToExcel(
            uploadedInputFileName,
            inputFileSqlTableName,
            abbreviationFileSqlTableName
          );
        })
        .then((response) => {
          outputFileName = response.data;
          setProcessingStatus("success");
          setDownloadingStatus("loading");
          isFileProcessedSuccessfully = true;
          return abbreviateFileService.downloadOutputFile(outputFileName);
        })
        .then((response) => {
          setDownloadingStatus("success");
          isFileDownloaded = true;
          setSuccessMessage(
            "Input file abbreviated successfully and output is updated in the downloaded file."
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

          if (!isAbbreviationFileValidated) {
            setAbbreviationFileName("");
            setAbbreviationFileStatus("error");
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

    if (!abbreviationFileName) {
      isValidForm = false;
      formErrors["abbreviationFileError"] = "Abbreviation File is required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region main return
  return (
    <div className="mg-l-40 container-fluid px-3" style={{ width: "95%" }}>
      <h4>Abbreviate File</h4>
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
          <Row className="mb-3">
            <Col xs={6} md={6} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile">
                <Link to="#/" onClick={() => downloadFileTemplate("I")}>
                  Download Input File Template
                </Link>
              </div>
            </Col>
            <Col xs={6} md={6} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile">
                <Link to="#/" onClick={() => downloadFileTemplate("A")}>
                  Download Abbreviation File Template
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
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={
                          <>
                            Abbreviation File{" "}
                            <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select"
                      >
                        <input
                          type="file"
                          className="form-control"
                          tabIndex="15"
                          id="abbreviateFile"
                          name="abbreviateFile"
                          accept=".xlsx"
                          key={abbreviationFileKey}
                          onChange={uploadAbbreviationFile}
                        />
                      </FloatingLabel>
                      <div className="error-message">
                        {formErrors["abbreviationFileError"]}
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
                  onClick={validateAndAbbreviate}
                  style={{
                    maxWidth: "100%",
                    width: "350px",
                    fontSize: "0.875rem",
                  }}
                >
                  Validate and Abbreviate
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
                      status: abbreviationFileStatus,
                      label: "Validating the abbreviation file",
                    },
                    {
                      status: processingStatus,
                      label:
                        "Abbreviating the input file and writing to the output file",
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
  //#endregion
}
