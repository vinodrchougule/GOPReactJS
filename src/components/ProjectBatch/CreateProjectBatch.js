import React, { useState, useEffect } from "react";
import projectService from "../../services/project.service";
import projectBatchService from "../../services/projectBatch.service";
import inputOutputFormatService from "../../services/inputOutputFormat.service";
import helper from "../../helpers/helpers";
import ModernDatepicker from "react-modern-datepicker";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function CreateProjectBatch() {

  //#region State management using useState hook
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state;
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [selectedInputCountType, setSelectedInputCountType] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [InputOutputFormats, setInputOutputFormats] = useState([]);
  const [selectedReceivedFormat, setSelectedReceivedFormat] = useState("");
  const [selectedOutputFormat, setSelectedOutputFormat] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");
  const [customerInputFileKey, setCustomerInputFileKey] = useState(Date.now());
  const [remarks, setRemarks] = useState("");
  const [scope, setScope] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [projectID, setProjectID] = useState(0);
  const [customerCode, setCustomerCode] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [customerInputFile, setCustomerInputFile] = useState("");
  const [messageForCustomerInputFile, setMessageForCustomerInputFile] = useState(false);
  const [customerInputFileUploadedName, setCustomerInputFileUploadedName] = useState("");
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    if (!locationState || locationState === 0) {
      history.push("/Projects");
      return;
    }
    setProjectID(locationState.ProjectID);
    setCustomerCode(locationState.CustomerCode);
    setProjectCode(locationState.ProjectCode);
    setScope(locationState.Scope);

    fetchInputOutputFormats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, locationState]);
  //#endregion

  //#region Uploading CustomerInput File
  const uploadCustomerInputFile = (e) => {
    setMessageForCustomerInputFile(true);

    const files = e.target.files;
    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
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
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, {
          autoClose: false,
        });
        setMessageForCustomerInputFile(false);
        setCustomerInputFile("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        customerInputFileError: "",
      };
      setFormErrors(formErrors);
    }
  };
  //#endregion

  //#region fetching Input Output Formats from Service
  const fetchInputOutputFormats = () => {
    setSpinnerMessage("Please wait while loading input output formats...");
    setLoading(true);

    inputOutputFormatService.getAllInputOutputFormats(helper.getUser(), true)
      .then((response) => {
        setInputOutputFormats(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Get Input Count value
  const onChangeInputCount = (e) => {
    const value = e.target.value;

    setInputCount(value);
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      inputCountError: value !== "" && value !== null ? "" : prevFormErrors.inputCountError,
    }));
  };
  //#endregion

  //#region Get Selected Input Count Type
  const onChangeInputCountType = (e) => {
    const { value } = e.target;
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
    const value = e.target.value;
    setSelectedReceivedFormat(value);
    setFormErrors((prev) => ({
      ...prev,
      receivedFormatError: value ? "" : prev.receivedFormatError,
    }));
  };
  //#endregion

  //#region Get Selected Output Format
  const onChangeOutputFormat = (e) => {
    const value = e.target.value;

    setSelectedOutputFormat(value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      outputFormatError: value !== "" && value !== null ? "" : prevErrors.outputFormatError,
    }));
  };
  //#endregion

  //#region Clearing Dates
  const clearPlannedDeliveryDate = () => {
    setPlannedDeliveryDate("");
  };

  const clearPlannedStartDate = () => {
    setPlannedStartDate("");
  };

  const clearReceivedDate = () => {
    setReceivedDate("");
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

  //#region Get Selected Planned Delivery Date
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

  //#region Downloading customer Input File
  const downloadCustomerInputFile = () => {
    setLoading(true);
    setSpinnerMessage("Please wait while downloading customer file...");

    projectBatchService.downloadFile(customerInputFile)
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
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Delete Customer Input File
  const deleteCustomerInputFile = () => {
    setSpinnerMessage("Please wait while deleting customer file...");
    setLoading(true);

    projectService.deleteFile(customerInputFile)
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

  //#region Save Project
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
        ProjectBatchID: 0,
        CustomerCode: customerCode,
        ProjectCode: projectCode,
        BatchNo: "",
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

      projectBatchService.createProjectBatch(data)
        .then((response) => {
          setLoading(false);

          toast.success(
            `Project Batch Created Successfully, Customer Code: ${customerCode}, Project Code: ${projectCode}, Batch No: ${response.data}`
          );

          setProjectID(0);
          setCustomerCode("");
          setProjectCode("");
          setScope("");
          setInputCount(0);
          setSelectedInputCountType("");
          setReceivedDate("");
          setSelectedReceivedFormat("");
          setSelectedOutputFormat("");
          setPlannedStartDate("");
          setPlannedDeliveryDate("");
          setRemarks("");
          setCustomerInputFile("");
          setCustomerInputFileKey(Date.now());

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

    if (!selectedInputCountType.trim()) {
      isValidForm = false;
      formErrors["inputCountTypeError"] = "Input Count Type is required";
    }

    if (!receivedDate) {
      isValidForm = false;
      formErrors["receivedDateError"] = "Received Date is required";
    }

    if (!selectedReceivedFormat.trim()) {
      isValidForm = false;
      formErrors["receivedFormatError"] = "Received Format is required";
    }

    if (!selectedOutputFormat.trim()) {
      isValidForm = false;
      formErrors["outputFormatError"] = "Output Format is required";
    }

    if (!plannedStartDate) {
      isValidForm = false;
      formErrors["plannedStartDateError"] = "Planned Start Date is required";
    } else if (new Date(plannedStartDate) < new Date(receivedDate)) {
      isValidForm = false;
      formErrors["plannedStartDateError"] = "Planned Start Date cannot be earlier than Received Date";
    }

    if (!plannedDeliveryDate) {
      isValidForm = false;
      formErrors["plannedDeliveryDateError"] = "Planned Delivery Date is required";
    } else if (new Date(plannedDeliveryDate) < new Date(plannedStartDate)) {
      isValidForm = false;
      formErrors["plannedDeliveryDateError"] = "Planned Delivery Date cannot be earlier than Planned Start Date";
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
    setFormErrors({});
    setInputCount(0);
    setSelectedInputCountType("");
    setReceivedDate("");
    setSelectedReceivedFormat("");
    setSelectedOutputFormat("");
    setPlannedStartDate("");
    setPlannedDeliveryDate("");
    setCustomerInputFile("");
    setCustomerInputFileKey(Date.now());
    setCustomerInputFileUploadedName("");
    setMessageForCustomerInputFile(false);
    setRemarks("");
    fetchInputOutputFormats();
  }
  //#endregion

  //#region main return
  return (
    <div className="create-project-page" style={{ height: "93%" }}>
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>
              {spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="cp-main-div">
          <form onSubmit={saveProjectBatch} className="cp-form">
            <div className="cp-breadcome-header" style={{ paddingLeft: "0px" }}>
              <div className="az-content-breadcrumb mg-t-20">
                <span>Projects</span>
                <span>Create Project Batch</span>
              </div>
              <h4 className="d-flex align-items-center" style={{width:"25%"}}>
                Create Project Batch{" "}
                <span className="icon-size mg-l-5">
                  <i
                    className="far fa-arrow-alt-circle-left text-primary pointer"
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
                    tabIndex="1"
                    title="Back to List"
                  ></i>
                </span>
              </h4>
            </div>
            <div id="Add_Project" className="cpb-container">
              <div className="row row-sm read-project-data">
                <div className="col-lg-2">
                  <div className="form-field-div-read">
                    <label htmlFor="CustomerCode">
                      <b>Customer Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div >
                      <p id="CustomerCode" name="CustomerCode">
                        {customerCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 mg-t-10 mg-lg-t-0">
                  <div className="form-field-div-read">
                    <label htmlFor="ProjectCode">
                      <b>Project Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="ProjectCode" name="ProjectCode">
                        {projectCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 mg-t-10 mg-lg-t-0">
                  <div className="form-field-div-read">
                    <label htmlFor="ProjectCode">
                      <b>Scope</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="ProjectCode" name="ProjectCode">
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
                      <input type="number" className="form-control flex-grow-1" id="InputCount" name="InputCount" value={inputCount} onChange={onChangeInputCount}
                        max="99999"
                        min="1"
                      />
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["inputCountError"]}
                    </div>
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
                      <select className="form-control flex-grow-1" id="InputCountType" name="InputCountType"
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
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["inputCountTypeError"]}
                    </div>
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
                      <div className="form-field-div d-flex align-items-center">
                        <div className="form-control date-field-width" style={{ width: "100%" }}>
                          <ModernDatepicker id="ReceivedDate" name="ReceivedDate" date={receivedDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) => onChangeReceivedDate(date)}
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span
                          className="btn btn-secondary"
                          onClick={clearReceivedDate}
                        >
                          <i
                            className="far fa-window-close"
                            title="Clear Received Date"
                          ></i>
                        </span>
                      </div>
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["receivedDateError"]}
                    </div>
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
                      <select className="form-control flex-grow-1" id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedReceivedFormat}
                        onChange={onChangeReceivedFormat}
                      >
                        <option value="">--Select--</option>
                        {InputOutputFormats.map((formats) => (
                          <option key={formats.Format}>{formats.Format}</option>
                        ))}
                      </select>
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["receivedFormatError"]}
                    </div>
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
                      <select className="form-control flex-grow-1" id="OutputFormat" name="OutputFormat"
                        value={selectedOutputFormat}
                        onChange={onChangeOutputFormat}
                      >
                        <option value="">--Select--</option>
                        {InputOutputFormats.map((formats) => (
                          <option key={formats.Format}>{formats.Format}</option>
                        ))}
                      </select>
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["outputFormatError"]}
                    </div>
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
                      <div className="form-field-div d-flex align-items-center">
                        <div className="form-control date-field-width" style={{ width: "100%" }}>
                          <ModernDatepicker id="PlannedStartDate" name="PlannedStartDate"
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
                            title="Clear Received Date"
                          ></i>
                        </span>
                      </div>
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["plannedStartDateError"]}
                    </div>
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
                      <div className="form-field-div d-flex align-items-center">
                        <div className="form-control date-field-width" style={{ width: "100%" }}>
                          <ModernDatepicker id="plannedDeliveryDate"
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
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors["plannedDeliveryDateError"]}
                    </div>
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
                      <textarea className="form-control flex-grow-1"
                        rows="2"
                        id="Remarks"
                        name="Remarks"
                        maxLength="500"
                        value={remarks}
                        onChange={onChangeRemarks}
                      ></textarea>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-4 mg-t-10 mg-lg-t-0">
                  <div className="d-flex align-items-center" style={{ width: "100%" }}>
                    <div className="createProjectFloatingChooseFileInput gdlInputFile" style={{ width: "100%" }}>
                      <FloatingLabel
                        label={
                          <>
                            Customer Input File <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select mainLblFle" style={{ width: "100%" }}>
                        <input type="file"
                          className="form-control"
                          tabIndex="10"
                          id="CustomerInputFile"
                          name="CustomerInputFile"
                          key={customerInputFileKey}
                          onChange={uploadCustomerInputFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
                        <div className="error-message">
                          {formErrors["customerInputFileError"]}
                        </div>

                      </FloatingLabel>
                    </div>
                    <div className="d-flex mg-l-5">
                      {customerInputFile && (
                        <>
                          <span
                            className="btn btn-secondary"
                            onClick={downloadCustomerInputFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            className="btn btn-secondary mg-l-5"
                            onClick={deleteCustomerInputFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {messageForCustomerInputFile && <p>Please Wait...</p>}
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-md-3"></div>
                <div className="col-md-2 mg-t-10 mg-lg-t-0">
                  <input type="submit"
                    id="Save"
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    value="Save"
                  />
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-2  mg-t-10 mg-lg-t-0">
                  <span className="btn btn-gray-700 btn-block d-flex align-items-center justify-content-center"
                    onClick={reset}
                    id="Reset"
                  >
                    Reset
                  </span>
                </div>
              </div>
              <div className="mg-b-10"></div>
            </div>
          </form>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default CreateProjectBatch;