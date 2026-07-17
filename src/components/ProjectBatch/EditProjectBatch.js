import React, { useState, useEffect } from "react";
import projectService from "../../services/project.service";
import projectBatchService from "../../services/projectBatch.service";
import inputOutputFormatService from "../../services/inputOutputFormat.service";
import helper from "../../helpers/helpers";
import Moment from "moment";
import ModernDatepicker from "react-modern-datepicker";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function EditProjectBatch() {

  //#region State management using useState hook
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [projectID, setProjectID] = useState(0);
  const [projectBatchID, setProjectBatchID] = useState(0);
  const [customerCode, setCustomerCode] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [scope, setScope] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [selectedInputCountType, setSelectedInputCountType] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [customerInputFile, setCustomerInputFile] = useState("");
  const [customerInputFileUploadedName, setCustomerInputFileUploadedName] = useState("");
  const [messageForCustomerInputFile, setMessageForCustomerInputFile] = useState(false);
  const [customerInputFileKey, setCustomerInputFileKey] = useState(Date.now());
  const [showCustomerInputFileLabel, setShowCustomerInputFileLabel] = useState(true);
  const [receivedDate, setReceivedDate] = useState("");
  const [InputOutputFormats, setInputOutputFormats] = useState([]);
  const [selectedReceivedFormat, setSelectedReceivedFormat] = useState("");
  const [selectedOutputFormat, setSelectedOutputFormat] = useState("");
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");
  const [formErrors, setFormErrors] = useState({});
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchInputOutputFormats();
    fetchProjectBatchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region fetching Project Batch Details from Web API
  const fetchProjectBatchDetails = () => {
    const projectBatchID = location.state;
    if (!projectBatchID) {
      history.push("/Projects");
      return;
    }

    setSpinnerMessage("Please wait while fetching project batch details...");
    setLoading(true);

    projectBatchService
      .getProjectBatchDetailsByID(projectBatchID, helper.getUser())
      .then((response) => {
        const data = response.data;

        setSelectedInputCountType(data.InputCountType === "Items / Lines" ? "I" : "D");
        setReceivedDate(data.ReceivedDate ? Moment(data.ReceivedDate).format("DD-MMM-yyyy") : "");
        setPlannedStartDate(data.PlannedStartDate ? Moment(data.PlannedStartDate).format("DD-MMM-yyyy") : "");
        setPlannedDeliveryDate(data.PlannedDeliveryDate ? Moment(data.PlannedDeliveryDate).format("DD-MMM-yyyy") : "");

        setProjectID(data.ProjectID);
        setProjectBatchID(data.ProjectBatchID);
        setCustomerCode(data.CustomerCode);
        setProjectCode(data.ProjectCode);
        setBatchNo(data.BatchNo);
        setScope(data.Scope);
        setInputCount(data.InputCount);
        setSelectedReceivedFormat(data.ReceivedFormat);
        setSelectedOutputFormat(data.OutputFormat);
        setRemarks(data.Remarks);
        setCustomerInputFile(data.CustomerInputFileName);
        setCustomerInputFileUploadedName(data.CustomerInputFileName);

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Input Output Formats from Service
  const fetchInputOutputFormats = () => {
    setSpinnerMessage("Please wait while loading input output formats...");
    setLoading(true);

    inputOutputFormatService
      .getAllInputOutputFormats(helper.getUser(), true)
      .then((response) => {
        setInputOutputFormats(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Get Input Count value
  const onChangeInputCount = (e) => {
    const value = e.target.value;
    setInputCount(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        inputCountError: "",
      }));
    }
  };
  //#endregion

  //#region Get Selected Input Count Type
  const onChangeInputCountType = (e) => {
    const value = e.target.value;

    setSelectedInputCountType(value);
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        inputCountTypeError: "",
      }));
    }
  };
  //#endregion

  //#region  Get Selected Received Date
  const onChangeReceivedDate = (date) => {
    setReceivedDate(date);

    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receivedDateError: "",
      }));
    }
  };
  //#endregion

  //#region Get Selected Received Format
  const onChangeReceivedFormat = (e) => {
    const { value } = e.target;

    setSelectedReceivedFormat(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receivedFormatError: "",
      }));
    }
  };
  //#endregion

  //#region Get Selected Output Format
  const onChangeOutputFormat = (e) => {
    const value = e.target.value;
    setSelectedOutputFormat(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        outputFormatError: "",
      }));
    }
  };
  //#endregion

  //#region Clearing Dates
  const clearReceivedDate = () => {
    setReceivedDate("");
  };

  const clearPlannedStartDate = () => {
    setPlannedStartDate("");
  };

  const clearPlannedDeliveryDate = () => {
    setPlannedDeliveryDate("");
  };
  //#endregion

  //#region  Get Selected Planned Start Date
  const onChangePlannedStartDate = (date) => {
    setPlannedStartDate(date);

    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        plannedStartDateError: "",
      }));
    }
  };
  //#endregion

  //#region  Get Selected Planned Delivery Date
  const onChangePlannedDeliveryDate = (date) => {
    setPlannedDeliveryDate(date);

    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        plannedDeliveryDateError: "",
      }));
    }
  };
  //#endregion

  //#region get Remarks value
  const onChangeRemarks = (e) => {
    setRemarks(e.target.value);
  };
  //#endregion

  //#region Uploading CustomerInput File
  const uploadCustomerInputFile = (e) => {
    setMessageForCustomerInputFile(true);

    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;

    setCustomerInputFileUploadedName(fileNameUploaded);

    let formData = new FormData();
    formData.append("File", currentFile);

    setSpinnerMessage("Please wait while uploading customer file...");
    setLoading(true);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForCustomerInputFile(false);
        setCustomerInputFile(response.data);
        setShowCustomerInputFileLabel(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForCustomerInputFile(false);
        setCustomerInputFile("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrorsUpdated = {
        ...formErrors,
        customerInputFileError: "",
      };
      setFormErrors(formErrorsUpdated);
    }
  };
  //#endregion

  //#region Downloading customer Input File
  const downloadCustomerInputFile = (e) => {
    setSpinnerMessage("Please wait while downloading customer file...");
    setLoading(true);

    projectBatchService
      .downloadFile(customerInputFile)
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", customerInputFileUploadedName);
        document.body.appendChild(fileLink);

        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Delete Customer Input File
  const deleteCustomerInputFile = () => {
    setSpinnerMessage("Please wait while deleting customer file...");
    setLoading(true);

    projectService
      .deleteFile(customerInputFile)
      .then(() => {
        setCustomerInputFileKey(Date.now());
        setCustomerInputFile("");
        setCustomerInputFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setCustomerInputFile("");
        setLoading(false);
      });
  };
  //#endregion

  //#region Save Project Batch
  const saveProjectBatch = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while Saving Project Batch...");
      setLoading(true);

      const data = {
        ProjectID: projectID,
        ProjectBatchID: projectBatchID,
        CustomerCode: customerCode,
        ProjectCode: projectCode,
        BatchNo: batchNo,
        Scope: scope,
        InputCount: inputCount,
        InputCountType: selectedInputCountType,
        ReceivedDate: receivedDate,
        ReceivedFormat: selectedReceivedFormat,
        OutputFormat: selectedOutputFormat,
        PlannedStartDate: plannedStartDate,
        PlannedDeliveryDate: plannedDeliveryDate,
        Remarks: remarks,
        CustomerInputFileName: customerInputFile,
        Status: "",
        UserID: helper.getUser(),
      };

      projectBatchService
        .updateProjectBatch(projectBatchID, data)
        .then(() => {
          setLoading(false);
          toast.success("Project Batch Updated Successfully");

          setProjectID(null);
          setProjectBatchID(null);
          setCustomerCode(null);
          setProjectCode(null);
          setBatchNo(null);
          setScope(null);
          setInputCount(null);
          setSelectedInputCountType(null);
          setReceivedDate(null);
          setSelectedReceivedFormat(null);
          setSelectedOutputFormat(null);
          setPlannedStartDate(null);
          setPlannedDeliveryDate(null);
          setRemarks(null);
          setCustomerInputFile(null);

          history.push({
            pathname: "/Projects/ProjectBatchList",
            state: {
              ProjectID: data.ProjectID,
              CustomerCode: data.CustomerCode,
              ProjectCode: data.ProjectCode,
              Scope: data.Scope,
              activeTab: 1,
            },
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    let formErrors = {};
    let isValidForm = true;

    if (!inputCount) {
      isValidForm = false;
      formErrors["inputCountError"] = "Input Count is required";
    }

    const inputCountType = selectedInputCountType.trim();
    if (!inputCountType) {
      isValidForm = false;
      formErrors["inputCountTypeError"] = "Input Count Type is required";
    }

    if (!receivedDate) {
      isValidForm = false;
      formErrors["receivedDateError"] = "Received Date is required";
    }

    const receivedFormat = selectedReceivedFormat.trim();
    if (!receivedFormat) {
      isValidForm = false;
      formErrors["receivedFormatError"] = "Received Format is required";
    }

    const outputFormat = selectedOutputFormat.trim();
    if (!outputFormat) {
      isValidForm = false;
      formErrors["outputFormatError"] = "Output Format is required";
    }

    if (!plannedStartDate) {
      isValidForm = false;
      formErrors["plannedStartDateError"] = "Planned Start Date is required";
    } else if (new Date(plannedStartDate) < new Date(receivedDate)) {
      isValidForm = false;
      formErrors["plannedStartDateError"] =
        "Planned Start Date cannot be earlier than Received Date";
    }

    if (!plannedDeliveryDate) {
      isValidForm = false;
      formErrors["plannedDeliveryDateError"] =
        "Planned Delivery Date is required";
    } else if (new Date(plannedDeliveryDate) < new Date(plannedStartDate)) {
      isValidForm = false;
      formErrors["plannedDeliveryDateError"] =
        "Planned Delivery Date cannot be earlier than Planned Start Date";
    }

    if (!customerInputFile) {
      isValidForm = false;
      formErrors["customerInputFileError"] = "Customer Input File is required";
    }
    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Reset the page
  const reset = () => {
    setLoading(false);
    setSpinnerMessage("");
    setCustomerInputFileKey(Date.now());
    setShowCustomerInputFileLabel(true)
    fetchProjectBatchDetails();
  };
  //#endregion

  //#region main return
  return (
    <div className="create-project-page" style={{ height: "93%" }}>
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader
              css={helper.getcss()}
              color={"#38D643"}
              width={"350px"}
              height={"10px"}
              speedMultiplier={0.3}
            />
            <p style={{ color: "black", marginTop: "5px" }}>
              {spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="cp-main-div" style={{ padding: "30px" }}>
          <form onSubmit={saveProjectBatch} className="cp-form editProjectBatchMainContent">
            <div className="cp-breadcome-header" style={{ paddingLeft: "0px" }}>
              <div className="az-content-breadcrumb mg-t-20">
                <span>Projects</span>
                <span>Edit Project Batch</span>
              </div>
              <h4 className="d-flex align-items-center" style={{width:"25%"}}>
                Edit Project Batch{" "}
                <span className="icon-size mg-l-5">
                  <i
                    onClick={() => {
                      history.push({
                        pathname: "/Projects/ProjectBatchList",
                        state: {
                          ProjectID: projectID,
                          CustomerCode: customerCode,
                          ProjectCode: projectCode,
                          Scope: scope,
                          activeTab: 1,
                        },
                      });
                    }}
                    className="far fa-arrow-alt-circle-left text-primary pointer"
                    title="Back to Project Batch List"
                  ></i>
                </span>
              </h4>
            </div>

            <div id="Edit_ProjectBatch" className="cpb-container">
              <div className="row row-sm read-project-data">
                <div className="col-lg-2">
                  <div className="form-field-div-read">
                    <label htmlFor="CustomerCode">
                      <b>Customer Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="CustomerCode" name="CustomerCode">
                        {customerCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="form-field-div-read">
                    <label htmlFor="CustomerCode">
                      <b>Project Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="CustomerCode" name="CustomerCode">
                        {projectCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="form-field-div-read">
                    <label htmlFor="CustomerCode">
                      <b>Batch No.</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="CustomerCode" name="CustomerCode">
                        {batchNo}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-field-div-read">
                    <label htmlFor="CustomerCode">
                      <b>Scope</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="CustomerCode" name="CustomerCode">
                        {scope}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row row-sm">
                <div className="col-lg-4">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Input Count <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <input type="number" className="form-control flex-grow-1" tabIndex="1" id="InputCount" name="InputCount" value={inputCount} onChange={onChangeInputCount} max="99999" min="1" />
                      <div className="error-message">
                        {formErrors["inputCountError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Input Count Type <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="2"
                        id="InputCountType"
                        name="InputCountType"
                        value={selectedInputCountType}
                        onChange={onChangeInputCountType}
                      >
                        <option value="">--Select--</option>
                        <option key="Items/Lines" value="I">
                          Items / Lines
                        </option>
                        <option key="Document" value="D">
                          Document
                        </option>
                      </select>
                      <div className="error-message">
                        {formErrors["inputCountTypeError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Received Date <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <div className="form-field-div flex-grow-1">
                        <div className="form-control date-field-width" style={{ width: "100%" }}>
                          <ModernDatepicker
                            tabIndex="4"
                            id="ReceivedDate"
                            name="ReceivedDate"
                            date={receivedDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) => onChangeReceivedDate(date)}
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span className="btn btn-secondary" onClick={clearReceivedDate}>
                          <i className="far fa-window-close"
                            title="Clear Received Date"
                          ></i>
                        </span>
                      </div>
                      <div className="error-message">
                        {formErrors["receivedDateError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-4">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Received Format <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="5"
                        id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedReceivedFormat}
                        onChange={onChangeReceivedFormat}
                      >
                        <option value="">--Select--</option>
                        {InputOutputFormats.map((formats) => (
                          <option key={formats.Format}>{formats.Format}</option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["receivedFormatError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Output Format <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="6"
                        id="OutputFormat"
                        name="OutputFormat"
                        value={selectedOutputFormat}
                        onChange={onChangeOutputFormat}
                      >
                        <option value="">--Select--</option>
                        {InputOutputFormats.map((formats) => (
                          <option key={formats.Format}>{formats.Format}</option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["outputFormatError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Planned Start Date <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <div className="form-field-div">
                        <div className="form-control date-field-width" style={{ width: "100%" }}>
                          <ModernDatepicker
                            tabIndex="7"
                            id="PlannedStartDate"
                            name="PlannedStartDate"
                            date={plannedStartDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) =>
                              onChangePlannedStartDate(date)
                            }
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span
                          className="btn btn-secondary"
                          onClick={clearPlannedStartDate}
                        >
                          <i
                            className="far fa-window-close"
                            title="Clear Planned Start Date"
                          ></i>
                        </span>
                      </div>
                      <div className="error-message">
                        {formErrors["plannedStartDateError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-4">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Planned Delivery Date <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <div className="form-field-div">
                        <div className="form-control date-field-width" style={{ width: "100%" }}>
                          <ModernDatepicker
                            tabIndex="8"
                            id="plannedDeliveryDate"
                            name="plannedDeliveryDate"
                            date={plannedDeliveryDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) =>
                              onChangePlannedDeliveryDate(date)
                            }
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span
                          className="btn btn-secondary"
                          onClick={clearPlannedDeliveryDate}
                        >
                          <i
                            className="far fa-window-close"
                            title="Clear Planned Delivery Date"
                          ></i>
                        </span>
                      </div>
                      <div className="error-message">
                        {formErrors["plannedDeliveryDateError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Remarks
                        </>
                      }
                      className="float-hidden float-select">
                      <textarea
                        className="form-control flex-grow-1"
                        rows="2"
                        tabIndex="9"
                        id="Remarks"
                        name="Remarks"
                        maxLength="500"
                        value={remarks}
                        onChange={onChangeRemarks}
                      ></textarea>
                      <div className="error-message">
                        {formErrors["guidelineError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="d-flex align-items-center" style={{ width: "100%" }}>
                    <div className="createProjectFloatingChooseFileInput gdlInputFile editProjectBatchInput" style={{ width: "100%" }}>
                      <FloatingLabel
                        label={
                          <>
                            Customer Input File
                          </>
                        }
                        className="float-hidden float-select mainLblFle">
                        <input
                          type="file"
                          className="form-control"
                          tabIndex="9"
                          id="CustomerInputFile"
                          name="CustomerInputFile"
                          key={customerInputFileKey}
                          onChange={uploadCustomerInputFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
                        {showCustomerInputFileLabel && (
                          <label className="lblFile" htmlFor="GuidelineFile" style={{ position: "absolute", right: "5px", zIndex: "111", width: "80%" }}>
                            {customerInputFileUploadedName}
                          </label>
                        )}
                      </FloatingLabel>
                    </div>
                    <div className="d-flex">
                      {messageForCustomerInputFile && <p>Please Wait...</p>}
                      {customerInputFile && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-10" style={{ height: "42px" }}
                            onClick={downloadCustomerInputFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            className="btn btn-secondary mg-l-10" style={{ height: "42px" }}
                            onClick={deleteCustomerInputFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-md-3"></div>
                <div className="col-md-2 mg-t-10 mg-lg-t-0">
                  <input
                    type="submit"
                    id="Save"
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    tabIndex="12"
                    value="Save"
                  />
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-2  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block d-flex align-items-center justify-content-center"
                    tabIndex="13"
                    onClick={reset}
                    id="Reset"
                  >
                    Reset
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default EditProjectBatch;