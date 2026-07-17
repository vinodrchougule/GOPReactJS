import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from "react-router-dom";
//import { MaterialReactTable } from "material-react-table";
import { TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ModernDatepicker from "react-modern-datepicker";
import "../IncidentReport/ActionOnIncident.scss";
import incidentRegisterService from "../../services/incidentRegister.service";
import userService from "../../services/user.service";
import Moment from "moment";
import { Link } from "react-router-dom";
import accessControlService from "../../services/accessControl.service";
toast.configure();

function ActionOnIncident() {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [incidentRegisterID, setIncidentRegisterID] = useState(0);
  const [incidentNo, setIncidentNo] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [departmentResolvingIncident, setDepartmentResolvingIncident] =
    useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [nameOfPersonReportingIncident, setNameOfPersonReportingIncident] =
    useState("");
  const [contactNo, setContactNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [informationAffected, setInformationAffected] = useState("");
  const [equipmentAffected, setEquipmentAffected] = useState("");
  const [noOfPeopleAffected, setNoOfPeopleAffected] = useState("");
  const [impactOnBusiness, setImpactOnBusiness] = useState("");
  const [priority, setPriority] = useState("");
  const [assetIDs, setAssetIDs] = useState("");
  const [departmentsAffectedCSV, setDepartmentsAffectedCSV] = useState("");

  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [preventiveAction, setPreventiveAction] = useState("");
  const [actionCompletedBy, setActionCompletedBy] = useState("");
  const [actionCompletedOn, setActionCompletedOn] = useState("");
  const [remarks, setRemarks] = useState("");

  const [usersByDepartment, setUsersByDepartment] = useState([]);

  //#region Initialize table columns and data on mount
  useEffect(() => {
    const userName = helper.getUser();
    if (!userName) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region can User Access Page
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Register Incident")
      .then((response) => {
        if (response.data) {
          fetchIncidentDetails();
        } else {
          history.push({ pathname: "/" });
          return;
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  const fetchIncidentDetails = () => {
    const queryParams = new URLSearchParams(location.search);
    const incidentRegisterID = queryParams.get("incidentRegisterID");
    if (!incidentRegisterID) {
      history.push("/IncidentReportMenu");
      return;
    }
    setIncidentRegisterID(incidentRegisterID);
    setSpinnerMessage("Please wait while fetching incident details...");
    setLoading(true);

    incidentRegisterService
      .readIncidentById(incidentRegisterID)
      .then((response) => {
        const data = response.data.IncidentDetails;
        setIncidentRegisterID(incidentRegisterID);
        setIncidentNo(data.IncidentNo);
        setIncidentType(data.IncidentType);
        setDepartmentResolvingIncident(data.DepartmentResolvingIncident);
        setIncidentDescription(data.IncidentDescription);
        setNameOfPersonReportingIncident(data.NameOfPersonReportingIncident);
        setContactNo(data.ContactNo);
        setEmailID(data.EmailID);
        setIncidentDate(
          data.IncidentDate
            ? Moment(data.IncidentDate).format("DD-MMM-yyyy")
            : ""
        );
        setIncidentTime(data.IncidentTime);
        setIncidentLocation(data.IncidentLocation);
        setAssetIDs(data.AssetIDs);
        setInformationAffected(data.InformationAffected);
        setEquipmentAffected(data.EquipmentAffected);
        setNoOfPeopleAffected(data.NoOfPeopleAffected);
        setImpactOnBusiness(data.ImpactOnBusiness);
        setPriority(data.Priority);
        setDepartmentsAffectedCSV(data.DepartmentsAffectedCSV);
        setRootCause(data.RootCause);
        setCorrectiveAction(data.CorrectiveAction);
        setPreventiveAction(data.PreventiveAction);
        setActionCompletedBy(data.ActionCompletedByUserName);
        setActionCompletedOn(
          data.ActionCompletedOn
            ? Moment(data.ActionCompletedOn).format("DD-MMM-yyyy")
            : ""
        );
        setRemarks(data.Remarks);
        fetchActionCompletedByUserNames(data.DepartmentResolvingIncident);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };

  //#region Fetch Action Completed By User Names
  const fetchActionCompletedByUserNames = (departmentResolvingIncident) => {
    setSpinnerMessage(
      "Please wait while loading Action Completed By User Names..."
    );

    userService
      .getUsersByDepartment(departmentResolvingIncident)
      .then((response) => {
        setUsersByDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        setUsersByDepartment([]);
      })
      .finally(() => setLoading(false));
  };
  //#endregion

  //#region Set Form Errors if exists
  //#region Root Cause Error
  const onChangeRootCause = (e) => {
    setRootCause(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, rootCauseError: "" }));
    }
  };
  //#endregion

  //#region Corrective Action Error
  const onChangeCorrectiveAction = (e) => {
    setCorrectiveAction(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        correctiveActionError: "",
      }));
    }
  };
  //#endregion

  //#region Preventive Action Error
  const onChangePreventiveAction = (e) => {
    setPreventiveAction(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        preventiveActionError: "",
      }));
    }
  };
  //#endregion

  //#region Action Completed By Error
  const onChangeActionCompletedBy = (e) => {
    setActionCompletedBy(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        actionCompletedByError: "",
      }));
    }
  };
  //#endregion

  //#region Action Completed on
  const onChangeActionCompletedOn = (date) => {
    setActionCompletedOn(date);
    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        actionCompletedOnError: "",
      }));
    }
  };
  //#endregion

  //#region Remarks Error
  const onChangeRemarks = (e) => {
    setRemarks(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        remarksError: "",
      }));
    }
  };
  //#endregion
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    let formErrors = {};
    let isValidForm = true;

    if (!rootCause || rootCause.length === 0) {
      isValidForm = false;
      formErrors["rootCauseError"] = "Root Cause is required";
    }

    if (!correctiveAction || correctiveAction.length === 0) {
      isValidForm = false;
      formErrors["correctiveActionError"] = "Corrective Action is required";
    }

    if (!preventiveAction || preventiveAction.length === 0) {
      isValidForm = false;
      formErrors["preventiveActionError"] = "Preventive Action is required";
    }

    if (!actionCompletedBy || actionCompletedBy === 0) {
      isValidForm = false;
      formErrors["actionCompletedByError"] = "Action Completed By is required";
    }

    if (!actionCompletedOn || actionCompletedOn === 0) {
      isValidForm = false;
      formErrors["actionCompletedOnError"] = "Action Completed on is required";
    }

    if (!remarks || remarks.length === 0) {
      isValidForm = false;
      formErrors["remarksError"] = "Remarks required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Save Incident Register
  const submitActionOnIncident = (isConfirmed) => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving action on incident...");
      setLoading(true);
      const data = {
        IncidentRegisterID: incidentRegisterID,
        IncidentNo: incidentNo,
        IncidentDate: incidentDate,
        IncidentTime: incidentTime,
        IncidentStatus: isConfirmed ? "C" : "I",
        DepartmentResolvingIncident: departmentResolvingIncident,
        IncidentType: incidentType,
        IncidentDescription: incidentDescription.trim(),
        NameOfPersonReportingIncident: nameOfPersonReportingIncident.trim(),
        ContactNo: contactNo.trim(),
        EmailID: emailID.trim(),
        IncidentLocation: incidentLocation.trim(),
        InformationAffected: informationAffected.trim(),
        EquipmentAffected: equipmentAffected.trim(),
        NoOfPeopleAffected: noOfPeopleAffected,
        ImpactOnBusiness:
          impactOnBusiness === "High"
            ? "H"
            : impactOnBusiness === "Medium"
            ? "M"
            : "L",
        Priority: priority === "High" ? "H" : priority === "Medium" ? "M" : "L",
        AssetIDs: assetIDs,
        RootCause: rootCause,
        CorrectiveAction: correctiveAction,
        PreventiveAction: preventiveAction,
        ActionCompletedByUserName: actionCompletedBy,
        ActionCompletedOn: actionCompletedOn,
        Remarks: remarks,
        IsActionConfirmed: isConfirmed,
        UserID: helper.getUser(),
      };

      incidentRegisterService
        .postUpdateActionOnIncident(data)
        .then((response) => {
          const successMessage = response?.data?.Msg;
          toast.success(successMessage);
          setLoading(false);
          resetActionOnIncident();
          //props.toggle(3, "incidentReport");
        })
        .catch((error) => {
          setLoading(false);
          const errorMessage = error?.response?.data?.Msg;
          toast.error(errorMessage, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Reset Incident Register
  const resetActionOnIncident = () => {
    fetchIncidentDetails();
  };
  //#endregion

  //#region return
  return (
    <div className="actionOnIncidentMainContent">
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
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <h4 className="mg-l-25 d-flex align-items-center">
          Action on Incident
          <span className="icon-size">
            <Link
              to={{
                pathname: "/IncidentReportMenu",
                state: {
                  activeTab: 3,
                },
              }}
            >
              <i
                className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                tabIndex="1"
                title="Back to Incident Report"
              ></i>
            </Link>
          </span>
        </h4>
        <div className="row mg-r-15 mg-l-10 mg-t-10">
          <div className="col-lg-3">
            <div className="createProjectFloatingInput">
              <FloatingLabel
                label="Incident No."
                className="float-hidden float-select"
              >
                <input
                  type="text"
                  className="form-control mg-l-5 mg-r-0"
                  maxLength="20"
                  value={incidentNo}
                  readOnly
                />
              </FloatingLabel>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="createProjectFloatingInput actionOnIncidentDate reportIncidentDate">
              <FloatingLabel
                label="Incident Date and Time"
                className="float-hidden float-select"
              >
                <div className="form-control">
                  <input
                    type="text"
                    maxLength="20"
                    value={incidentDate + " " + incidentTime}
                    style={{ border: "none" }}
                    readOnly
                  />
                </div>
              </FloatingLabel>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="createProjectFloatingInput">
              <FloatingLabel
                label="Incident Type"
                className="float-hidden float-select"
              >
                <input
                  type="text"
                  className="form-control mg-l-5 mg-r-0"
                  maxLength="20"
                  value={incidentType}
                  readOnly
                />
              </FloatingLabel>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="createProjectFloatingInput">
              <FloatingLabel
                label="Department resolving incident"
                className="float-hidden float-select"
              >
                <input
                  type="text"
                  className="form-control mg-l-5 mg-r-0"
                  maxLength="20"
                  value={departmentResolvingIncident}
                  readOnly
                />
              </FloatingLabel>
            </div>
          </div>
        </div>
        <div
          style={{ border: "1px solid #cdd4e0" }}
          className="mg-l-25 mg-r-20 mg-t-15 mg-b-15 actionOnIncidentReportMainText"
        >
          <div className="row mg-r-0 mg-l-0 mg-t-15 mg-b-15">
            <div className="col-lg-5">
              <div className="createProjectFloatingInput mg-b-10">
                <FloatingLabel
                  label="Description"
                  className="float-hidden float-select"
                >
                  <TextField
                    className="resizable-textfield actionOnIncidentReportInputData actionTextAreaRead"
                    id="Details"
                    inputProps={{ maxLength: 4000 }}
                    value={incidentDescription}
                    multiline
                    rows={3}
                    col={300}
                    variant="outlined"
                    size="small"
                    style={{
                      width: "100%",
                      height: "80px",
                      backgroundColor: "#e3e7ed",
                    }}
                    disabled
                  />
                </FloatingLabel>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Name of the Person Reporting Incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={nameOfPersonReportingIncident || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Contact No."
                    className="float-hidden float-select"
                  >
                    <input
                      type="number"
                      className="form-control"
                      value={contactNo || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15 mg-b-15">
                  <FloatingLabel
                    label="Email"
                    className="float-hidden float-select"
                  >
                    <input
                      type="email"
                      className="form-control"
                      value={emailID || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Location of Incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentLocation || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Information Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control "
                      name="informationAffected"
                      value={informationAffected || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Equipment Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control "
                      name="EquipmentAffected"
                      value={equipmentAffected || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Number of People Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={noOfPeopleAffected || 0}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Impact on Business"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={impactOnBusiness || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Priority"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={priority || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Departments Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={departmentsAffectedCSV || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="masters-material-table actionOnIncidentReportTableContent">
                {/* <MaterialReactTable
                  data={incidentDetailsData}
                  columns={incidentReportColumns}
                  muiPaginationProps={{
                    color: "primary",
                    shape: "rounded",
                    showRowsPerPage: false,
                    variant: "outlined",
                    sx: {
                      "& .MuiPaginationItem-root": {
                        borderColor: "#5B47FB",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#5B47FB",
                        color: "white",
                      },
                      "& .MuiPaginationItem-ellipsis": {
                        borderColor: "#5B47FB",
                      },
                      marginTop: "16px",
                    },
                  }}
                  paginationDisplayMode="false"
                  enableColumnFilterModes={false}
                  enableColumnOrdering={false}
                  enableColumnFilters={false}
                  enableColumnActions={false}
                  enableStickyHeader={true}
                  enableDensityToggle={false}
                  enableGlobalFilter={false}
                  enableRowSelection={false}
                  enableFullScreenToggle={false}
                  initialState={{ pagination: { pageIndex: 0, pageSize: 100 } }}
                  getRowProps={(row) => ({
                    style: {
                      backgroundColor:
                        activeRowId === row.original.id
                          ? "#e0e0e0"
                          : "transparent",
                    },
                  })}
                /> */}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="actionOnIncidentReportEditData mg-t-0">
                <FloatingLabel
                  label="Root Cause"
                  className="float-hidden float-select"
                >
                  <TextField
                    className="resizable-textfield actionOnIncidentReportInputData"
                    id="Details"
                    inputProps={{ maxLength: 4000 }}
                    value={rootCause || ""}
                    onChange={onChangeRootCause}
                    multiline
                    rows={5}
                    col={300}
                    variant="outlined"
                    size="small"
                    style={{ width: "100%", height: "80px" }}
                  />
                  <div className="error-message">
                    {formErrors["rootCauseError"]}
                  </div>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="actionOnIncidentReportEditData mg-t-15">
                <FloatingLabel
                  label="Corrective Action"
                  className="float-hidden float-select"
                >
                  <TextField
                    className="resizable-textfield actionOnIncidentReportInputData"
                    id="Details"
                    inputProps={{ maxLength: 4000 }}
                    value={correctiveAction}
                    onChange={onChangeCorrectiveAction}
                    multiline
                    rows={5}
                    col={300}
                    variant="outlined"
                    size="small"
                    style={{ width: "100%", height: "80px" }}
                  />
                  <div className="error-message">
                    {formErrors["correctiveActionError"]}
                  </div>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="actionOnIncidentReportEditData mg-t-15">
                <FloatingLabel
                  label="Preventive Action"
                  className="float-hidden float-select"
                >
                  <TextField
                    className="resizable-textfield actionOnIncidentReportInputData"
                    id="Details"
                    inputProps={{ maxLength: 4000 }}
                    value={preventiveAction}
                    onChange={onChangePreventiveAction}
                    multiline
                    rows={5}
                    col={300}
                    variant="outlined"
                    size="small"
                    style={{ width: "100%", height: "100px" }}
                  />
                  <div className="error-message">
                    {formErrors["preventiveActionError"]}
                  </div>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="actionOnIncidentReportIncidentSelectText mg-t-15">
                <FloatingLabel
                  label="Action Completed By"
                  className="float-hidden float-select"
                >
                  <select
                    className="form-control"
                    id="userName"
                    name="userName"
                    value={actionCompletedBy}
                    onChange={onChangeActionCompletedBy}
                  >
                    <option value="">---Select Action Completed By---</option>
                    {usersByDepartment.map((userName) => (
                      <option key={userName}>{userName}</option>
                    ))}
                  </select>
                  <div className="error-message">
                    {formErrors["actionCompletedByError"]}
                  </div>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="actionOnIncidentReportAreaInputText mg-t-15 reportIncidentDate">
                <FloatingLabel
                  label={<>Action Completed On</>}
                  className="float-hidden float-select"
                >
                  <div className="form-control">
                    <ModernDatepicker
                      date={actionCompletedOn}
                      format={"DD-MMM-YYYY"}
                      //value={actionCompletedOn}
                      onChange={(date) => onChangeActionCompletedOn(date)}
                      className="color"
                      // minDate={new Date(1900, 1, 1)}
                    />
                  </div>
                  <div className="error-message">
                    {formErrors["actionCompletedOnError"]}
                  </div>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-3"></span>
              </div>
              <div className="actionOnIncidentReportIncidentSelectText mg-t-15">
                <FloatingLabel
                  label="Remarks"
                  className="float-hidden float-select"
                >
                  <TextField
                    className="resizable-textfield actionOnIncidentReportInputData"
                    id="Remarks"
                    inputProps={{ maxLength: 4000 }}
                    value={remarks}
                    onChange={onChangeRemarks}
                    multiline
                    rows={5}
                    col={300}
                    variant="outlined"
                    size="small"
                    style={{ width: "100%", height: "90px" }}
                  />
                  <div className="error-message">
                    {formErrors["remarksError"]}
                  </div>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="reportIncidentInputText mg-t-15">
                <FloatingLabel
                  label="Asset IDs"
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control mg-l-5 mg-r-15"
                    value={assetIDs || ""}
                    readOnly
                  />
                </FloatingLabel>
              </div>
            </div>
          </div>
          <div className="actionOnIncidentReportIncidentButtonsContent mg-t-20 mg-b-20">
            <Button
              variant="secondary"
              className="actionOnIncidentReportIncidentBtn"
              onClick={() => submitActionOnIncident(false)}
            >
              Submit
            </Button>
            <Button
              variant="secondary"
              className="actionOnIncidentReportIncidentBtn"
              onClick={() => submitActionOnIncident(true)}
            >
              Confirm and Email
            </Button>
            <Button
              variant="secondary"
              className="actionOnIncidentReportIncidentBtn"
              onClick={resetActionOnIncident}
            >
              Reset
            </Button>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ActionOnIncident;
