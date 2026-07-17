import React, { useState, useEffect } from "react";
import LoadingOverlay from "react-loading-overlay";
import projectService from "../../services/project.service";
import helper from "../../helpers/helpers";
import { useHistory } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import nmAutoClassifierService from "../../services/nmAutoClassifier.service";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
toast.configure();

export default function NMAutoClassifier() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [abbreviationFileName, setAbbreviationFileName] = useState("");
  const [abbreviationFileKey, setAbbreviationFileKey] = useState(Date.now());
  const [stdNounModifierFileName, setStdNounModifierFileName] = useState("");
  const [stdNounModifierFileKey, setStdNounModifierFileKey] = useState(
    Date.now()
  );
  const [showModal, setShowModal] = useState(false);
  const [inputFileStatus, setInputFileStatus] = useState("pending");
  const [abbreviationFileStatus, setAbbreviationFileStatus] =
    useState("pending");
  const [stdNounModifierFileStatus, setStdNounModifierFileStatus] =
    useState("pending");
  const [
    processingAndDownloadingTheOutputFileStatus,
    setProcessingAndDownloadingTheOutputFileStatus,
  ] = useState("pending");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Process and Download NM Auto. Classified Report To Excel

  //#region Refresh page
  const refreshPage = () => {
    setLoading(false);
    setSpinnerMessage("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setAbbreviationFileName("");
    setAbbreviationFileKey(Date.now());
    setStdNounModifierFileName("");
    setStdNounModifierFileKey(Date.now());
    setShowModal(false);
    setInputFileStatus("pending");
    setAbbreviationFileStatus("pending");
    setStdNounModifierFileStatus("pending");
    setProcessingAndDownloadingTheOutputFileStatus("pending");
    setSuccessMessage("");
    setErrorMessage("");
    setShowCloseButton(false);
    setFormErrors({});
  };
  //#endregion

  const processAndDownloadAutoClassifier = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    let inputTableName = "";
    let abbreviationTableName = "";
    let stdNounModifierTableName = "";
    let isInputFileUploaded = false;
    let isAbbreviationFileUploaded = false;
    let isStdNounModifierFileUploaded = false;

    if (handleFormValidation()) {
      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);

      nmAutoClassifierService
        .validateAndUploadInputFileData(inputFileName)
        .then((response) => {
          inputTableName = response.data;
          setInputFileStatus("success");
          isInputFileUploaded = true;
          setAbbreviationFileStatus("loading");
          return nmAutoClassifierService.validateAndUploadAbbreviationFileData(
            abbreviationFileName
          );
        })
        .then((response) => {
          abbreviationTableName = response.data;
          isAbbreviationFileUploaded = true;
          setAbbreviationFileStatus("success");
          setStdNounModifierFileStatus("loading");
          return nmAutoClassifierService.validateAndUploadStdNounModifierFileData(
            stdNounModifierFileName
          );
        })
        .then((response) => {
          stdNounModifierTableName = response.data;
          isStdNounModifierFileUploaded = true;
          setStdNounModifierFileStatus("success");
          setProcessingAndDownloadingTheOutputFileStatus("loading");
          return nmAutoClassifierService.processAndDownloadNMAutoClassifiedReportToExcel(
            inputTableName,
            abbreviationTableName,
            stdNounModifierTableName
          );
        })
        .then((response) => {
          setProcessingAndDownloadingTheOutputFileStatus("success");
          setSuccessMessage(
            "Noun-Modifier assigned successfully in the downloaded file."
          );
          let fileName = "Noun-Modifier Auto Classified Output.xlsx";
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
          if (!isInputFileUploaded) {
            setInputFileName("");
            setInputFileStatus("error");
            return;
          }

          if (!isAbbreviationFileUploaded) {
            setAbbreviationFileName("");
            setAbbreviationFileStatus("error");
            return;
          }

          if (!isStdNounModifierFileUploaded) {
            setStdNounModifierFileName("");
            setStdNounModifierFileStatus("error");
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

    if (!stdNounModifierFileName) {
      isValidForm = false;
      formErrors["stdNounModifierFileError"] =
        "Std.Noun-Modifier File is required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region  Download Input File Template
  const downloadFileTemplate = (fileType) => {
    setSpinnerMessage(
      "Please wait while downloading Noun-Modifier Auto. Classifier Input File Template..."
    );
    setLoading(true);

    let fileName = "";

    if (fileType === "input")
      fileName = "NM Auto Classifier - Input File Template.xlsx";
    else if (fileType === "abbreviation")
      fileName = "NM Auto Classifier - Abbreviation File Template.xlsx";
    else if (fileType === "noun-modifier")
      fileName = "NM Auto Classifier - Noun-Modifier File Template.xlsx";

    nmAutoClassifierService
      .downloadFileTemplate(fileType)
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

    const formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading input file...");
    setLoading(true);

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
        setShowCloseButton(true);
        // const updatedState = {
        //   loading: false,
        //   errorMessage,
        //   showCloseButton: true,
        // };
        // return updatedState;
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

    const formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading Abbreviation file...");
    setLoading(true);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        setAbbreviationFileName(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setAbbreviationFileName("");
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

  //#region Upload Std. Noun-Modifier File to Server
  const uploadStdNounModifierFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    const formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading Std. Noun-Modifier file...");
    setLoading(true);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        setStdNounModifierFileName(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setStdNounModifierFileName("");
      })
      .finally(() => {
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        stdNounModifierFileError: "",
      }));
    }
  };
  //#endregion

  const handleClose = () => {
    setLoading(false);
    setSpinnerMessage("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setAbbreviationFileName("");
    setAbbreviationFileKey(Date.now());
    setStdNounModifierFileName("");
    setStdNounModifierFileKey(Date.now());
    setShowModal(false);
    setInputFileStatus("pending");
    setAbbreviationFileStatus("pending");
    setStdNounModifierFileStatus("pending");
    setProcessingAndDownloadingTheOutputFileStatus("pending");
    setSuccessMessage("");
    setErrorMessage("");
    setShowCloseButton(false);
    setFormErrors({});
  };

  return (
    <div className="mg-l-40 container-fluid px-3" style={{ width: "95%" }}>
      <h4>Noun - Modifier Auto. Classifier</h4>
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
          {/* Download Links Row */}
          <Row className="mb-3">
            <Col xs={12} md={4} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile">
                <Link to="#/" onClick={() => downloadFileTemplate("input")}>
                  Download Input File Template
                </Link>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile">
                <Link
                  to="#/"
                  onClick={() => downloadFileTemplate("abbreviation")}
                >
                  Download Abbreviation File Template
                </Link>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-2">
              <div className="createProjectFloatingChooseFileInput gdlInputFile">
                <Link
                  to="#/"
                  onClick={() => downloadFileTemplate("noun-modifier")}
                >
                  Download Noun-Modifier File Template
                </Link>
              </div>
            </Col>
          </Row>

          {/* File Upload Section */}
          <div className="p-3 border rounded bg-white">
            <Row className="mb-3">
              <Col xs={12} md={4} className="mb-3">
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
                      id="CustomerInputFile"
                      name="CustomerInputFile"
                      accept=".xls, .xlsx"
                      key={inputFileKey}
                      onChange={uploadInputFile}
                    />
                  </FloatingLabel>
                  <div className="error-message">
                    {formErrors["inputFileError"]}
                  </div>
                </div>
              </Col>

              <Col xs={12} md={4} className="mb-3">
                <div
                  className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                  style={{ width: "100%" }}
                >
                  <FloatingLabel
                    label={
                      <>
                        Abbreviation File <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="file"
                      className="form-control"
                      tabIndex="15"
                      id="AbbreviationFile"
                      name="AbbreviationFile"
                      accept=".xls, .xlsx"
                      key={abbreviationFileKey}
                      onChange={uploadAbbreviationFile}
                    />
                  </FloatingLabel>
                  <div className="error-message">
                    {formErrors["abbreviationFileError"]}
                  </div>
                </div>
              </Col>

              <Col xs={12} md={4} className="mb-3">
                <div
                  className="createProjectFloatingChooseFileInput gdlInputFile mg-t-10"
                  style={{ width: "100%" }}
                >
                  <FloatingLabel
                    label={
                      <>
                        Std. Noun-Modifier File{" "}
                        <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="file"
                      className="form-control"
                      tabIndex="15"
                      id="NounModifierFile"
                      name="NounModifierFile"
                      accept=".xls, .xlsx"
                      key={stdNounModifierFileKey}
                      onChange={uploadStdNounModifierFile}
                    />
                  </FloatingLabel>
                  <div className="error-message">
                    {formErrors["stdNounModifierFileError"]}
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={2}></Col>
              <Col xs={12} md={4} className="text-center">
                <button
                  className="btn btn-gray-700"
                  onClick={processAndDownloadAutoClassifier}
                  style={{
                    maxWidth: "100%",
                    width: "350px",
                    fontSize: "0.875rem",
                  }}
                >
                  Process and Download Noun-Modifier Auto Classified Output
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
          onHide={handleClose}
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
                      label: "Input File",
                    },
                    {
                      status: abbreviationFileStatus,
                      label: "Abbreviation File",
                    },
                    {
                      status: stdNounModifierFileStatus,
                      label: "Std. Noun-Modifier File",
                    },
                    {
                      status: processingAndDownloadingTheOutputFileStatus,
                      label: "Processing and downloading the output file",
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
                        {processingAndDownloadingTheOutputFileStatus ===
                          "success" && (
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
                        {processingAndDownloadingTheOutputFileStatus ===
                          "success" && (
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
                onClick={handleClose}
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
