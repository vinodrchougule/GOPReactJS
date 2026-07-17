import React, { useState, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { TextField } from "@mui/material";
import "../IncidentReport/RegisterIncident.scss";
import { MultiSelect } from "react-multi-select-component";
import ModernDatepicker from "react-modern-datepicker";
import incidentTypeService from "../../services/incidentType.service";
import { loadUserProfile } from "../../services/userProfile.service";
import { useDispatch } from "react-redux";
import userService from "../../services/user.service";
import incidentRegisterService from "../../services/incidentRegister.service";
import Moment from "moment";
import { Link } from "react-router-dom";
import accessControlService from "../../services/accessControl.service";

toast.configure();

function EditIncident(props) {
  const history = useHistory();
  const location = useLocation();
  const [selectedIncidentType, setSelectedIncidentType] = useState("");
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [incidentRegisterID, setIncidentRegisterID] = useState(0);
  const [incidentNo, setIncidentNo] = useState("");
  const [departmentResolvingIncident, setDepartmentResolvingIncident] =
    useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [incidentDescription, setIncidentDescription] = useState("");
  const [nameOfPersonReportingIncident, setNameOfPersonReportingIncident] =
    useState("");
  const [contactNo, setContactNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [informationAffected, setInformationAffected] = useState("");
  const [equipmentAffected, setEquipmentAffected] = useState("");
  const [noOfPeopleAffected, setNoOfPeopleAffected] = useState("");
  const [impactOnBusiness, setImpactOnBusiness] = useState("");
  const [priority, setPriority] = useState("");
  const [assetIDs, setAssetIDs] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("");

  const dispatch = useDispatch();
  const [selectedDepartment, setSelectedDepartment] = useState("");

  //#region Get Selected From Date
  const onChangeSetIncidentDate = (date) => {
    setIncidentDate(date);
    if (date !== "" && date !== null) {
    }
  };
  //#endregion

  //#region validate Email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  //#endregion

  //#region Handle Email Change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailID(value);
    if (!validateEmail(value)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        emailIDError: "Please enter a valid email address",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        emailIDError: "",
      }));
    }
  };
  //#endregion

  //#region Show the Buttons
  const showButtons = true;
  //#endregion

  //#region useEffect
  useEffect(() => {
    const userName = helper.getUser();
    if (!userName) {
      history.push({ pathname: "/" });
      return;
    }

    dispatch(loadUserProfile(userName))
      .then((data) => {
        if (data && data.DepartmentName) {
          setSelectedDepartment(data.DepartmentName);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch department.");
      });

    canUserAccessPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, dispatch]);
  //#endregion

  //#region can User Access Page
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Register Incident")
      .then((response) => {
        if (response.data) {
          fetchIncidentTypes();
          fetchIncidentDetails();
          fetchOperationsDepartments();
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
        setSelectedIncidentType(data.IncidentType);
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
        setIncidentStatus(data.IncidentStatus);
        const data1 = response.data.IncidentDetails.DepartmentsAffected;
        if (Array.isArray(data1)) {
          const selectedDepartmentNames = data1.map((dept) => ({
            label: dept.DepartmentName,
            value: dept.DepartmentName.toLowerCase(),
          }));
          setSelectedDepartments(selectedDepartmentNames);
        } else {
          setSelectedDepartments([]);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });

    setLoading(false);
  };

  //#region Fetch Incident Types
  const fetchIncidentTypes = () => {
    setSpinnerMessage("Please wait while loading Incident Types...");
    setLoading(true);
    incidentTypeService
      .ReadAllIncidentTypes(helper.getUser(), true)
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.IncidentTypes)
        ) {
          setIncidentTypes(response.data.IncidentTypes);
        } else {
          setIncidentTypes([]);
        }
      })
      .catch((error) => {
        // console.error("Error fetching incident types:", error);
        // toast.error("Failed to fetch incident types.");
        setIncidentTypes([]);
      })
      .finally(() => setLoading(false));
  };
  //#endregion

  //#region Fetch Operations Departments
  const fetchOperationsDepartments = () => {
    setSpinnerMessage("Please wait while loading Departments Affected...");
    setLoading(true);

    userService
      .readDepartmentsHcNMro(false)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const departmentOptions = response.data.map((dept) => ({
            label: dept.Name,
            value: dept.Name.toLowerCase(),
          }));
          setDepartmentOptions(departmentOptions);
        } else {
          setDepartmentOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments.");
        setDepartmentOptions([]);
      })
      .finally(() => setLoading(false));
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    let formErrors = {};
    let isValidForm = true;

    if (!selectedIncidentType || selectedIncidentType.length === 0) {
      isValidForm = false;
      formErrors["incidentTypeError"] = "Incident Type is required";
    }

    if (!incidentDescription || incidentDescription.length === 0) {
      isValidForm = false;
      formErrors["incidentDescriptionError"] =
        "Incident Description is required";
    }

    if (
      !nameOfPersonReportingIncident ||
      nameOfPersonReportingIncident.length === 0
    ) {
      isValidForm = false;
      formErrors["nameOfPersonReportingIncidentError"] =
        "Name of Person Reporting Incident is required";
    }

    if (!incidentDate || incidentDate === 0) {
      isValidForm = false;
      formErrors["dateOfIncidentError"] = "Date of Incident is required";
    }

    if (!incidentTime || incidentTime === 0) {
      isValidForm = false;
      formErrors["timeOfIncidentError"] = "Time of Incident is required";
    }

    if (!incidentLocation || incidentLocation === 0) {
      isValidForm = false;
      formErrors["locationOfIncidentError"] =
        "Location of Incident is required";
    }

    if (!impactOnBusiness || impactOnBusiness === 0) {
      isValidForm = false;
      formErrors["impactOnBusinessError"] = "Impact on Business is required";
    }

    if (!priority || priority === 0) {
      isValidForm = false;
      formErrors["priorityError"] = "Priority is required";
    }

    if (!selectedDepartments || selectedDepartments.length === 0) {
      isValidForm = false;
      formErrors["departmentAffectedError"] = "Department Affected is required";
    }

    if (!assetIDs || assetIDs.length === 0) {
      isValidForm = false;
      formErrors["assetIdsError"] = "Asset IDs are required";
    }

    if (!selectedDepartment) {
      isValidForm = false;
      formErrors["departmentError"] =
        "Department Resolving Incident is required";
    }

    if (!emailID || emailID.trim() === "") {
      isValidForm = false;
      formErrors["emailIDError"] = "Email is required";
    } else if (!validateEmail(emailID)) {
      isValidForm = false;
      formErrors["emailIDError"] = "Please enter a valid email address";
    }
    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Save Incident Register
  const submitIncidentRegister = (isConfirmed) => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving incident details...");
      setLoading(true);

      const data = {
        IncidentRegisterID: incidentRegisterID,
        IncidentNo: incidentNo,
        IncidentDate: incidentDate,
        IncidentTime: incidentTime,
        IncidentStatus: incidentStatus === "Pending" ? "P" : "I",
        DepartmentResolvingIncident: departmentResolvingIncident,
        IncidentType: selectedIncidentType,
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
        DepartmentsAffectedList: selectedDepartments.map((dept) => ({
          DepartmentName: dept.label,
        })),
        AssetIDs: assetIDs,
        IsConfirmed: isConfirmed,
        UserID: helper.getUser(),
      };

      incidentRegisterService
        .postUpdateIncident(data)
        .then((response) => {
          const successMessage = response?.data?.Msg;
          toast.success(successMessage);
          setLoading(false);
          resetIncidentRegister();
          props.toggle(3, "incidentReport");
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
  const resetIncidentRegister = () => {
    fetchIncidentDetails(incidentRegisterID);
    fetchIncidentTypes();
    fetchOperationsDepartments();
  };
  //#endregion

  //#region Get Department Value
  const onChangeIncidentType = (e) => {
    setSelectedIncidentType(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, incidentTypeError: "" }));
    }
  };
  //#endregion

  //#region Return
  return (
    <div>
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
          Edit Incident
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
        <Row
          className="mg-t-0 mg-l-25 mg-r-30 reportIncidentData"
          style={{ border: "2px solid #ccc" }}
        >
          <div className="col-md-12 pd-t-0 pd-b-0">
            <div className="reportIncidentMainContent">
              <div className="reportIncidentContent mg-r-20 reportIncidentLeftText">
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Incident No."
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentNo || ""}
                      disabled
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Incident Type"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control"
                      id="department"
                      name="department"
                      value={selectedIncidentType}
                      onChange={onChangeIncidentType}
                    >
                      <option value="">--Select incident type--</option>
                      {incidentTypes.length > 0 ? (
                        incidentTypes.map((incidentType) => {
                          return (
                            <option
                              key={incidentType.IncidentTypeID}
                              value={String(incidentType.IncidentType)}
                            >
                              {incidentType.IncidentType}
                            </option>
                          );
                        })
                      ) : (
                        <option disabled>Loading incident types...</option>
                      )}
                    </select>
                    <div className="error-message">
                      {formErrors["incidentTypeError"]}
                    </div>
                  </FloatingLabel>

                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentText mg-t-15">
                  <FloatingLabel
                    label="Description of Incident (max. 4000 characters)"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield"
                      id="Details"
                      inputProps={{ maxLength: 4000 }}
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      style={{ width: "100%" }}
                      value={incidentDescription}
                      onChange={(e) => {
                        const value = e.target.value;
                        setIncidentDescription(value);
                        if (value.trim().length > 0) {
                          setFormErrors((prevErrors) => ({
                            ...prevErrors,
                            incidentDescriptionError: "",
                          }));
                        }
                      }}
                    />

                    {formErrors["incidentDescriptionError"] && (
                      <div className="error-message">
                        {formErrors["incidentDescriptionError"]}
                      </div>
                    )}
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Name of the Person Reporting Incident (max. 100 characters)"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="100"
                      name="Incident"
                      value={nameOfPersonReportingIncident}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNameOfPersonReportingIncident(value);
                        if (value.trim().length > 0) {
                          setFormErrors((prevErrors) => ({
                            ...prevErrors,
                            nameOfPersonReportingIncidentError: "",
                          }));
                        }
                      }}
                    />
                    <div className="error-message">
                      {formErrors["nameOfPersonReportingIncidentError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Contact No. (max. 50 characters)"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="50"
                      name="Incident"
                      value={contactNo}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z0-9 ]/g,
                          ""
                        );
                        setContactNo(value);
                      }}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-3"></span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Email (max. 50 characters)"
                    className="float-hidden float-select"
                  >
                    <input
                      type="email"
                      name="Incident"
                      id="email"
                      maxLength="50"
                      value={emailID}
                      onChange={handleEmailChange}
                      className={`form-control ${formErrors.emailIDError}`}
                    />
                  </FloatingLabel>

                  <span className="text-danger asterisk-size ml-3"></span>
                </div>
                {formErrors.emailIDError && (
                  <div className="error-message">{formErrors.emailIDError}</div>
                )}
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label={<>Date of Incident</>}
                    className="float-hidden float-select"
                  >
                    <div className="form-control position-relative d-flex align-items-center">
                      <ModernDatepicker
                        date={incidentDate || ""}
                        format={"DD-MMM-YYYY"}
                        onChange={(date) => {
                          onChangeSetIncidentDate(date);
                          if (date?.trim()?.length > 0) {
                            setFormErrors((prevErrors) => ({
                              ...prevErrors,
                              dateOfIncidentError: "",
                            }));
                          }
                        }}
                        className="color DateofIncidentRegister"
                        minDate={new Date(1900, 1, 1)}
                        maxDate={new Date()}
                      />
                      {incidentDate && (
                        <button
                          type="button"
                          className="clear-icon-btn"
                          onClick={() => {
                            onChangeSetIncidentDate("");
                            setFormErrors((prevErrors) => ({
                              ...prevErrors,
                              dateOfIncidentError: "",
                            }));
                          }}
                          aria-label="Clear Date"
                          style={{ background: "none", border: "none" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="error-message">
                      {formErrors["dateOfIncidentError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div
                  className="reportIncidentTimeText mg-t-15 mg-b-10"
                  style={{ position: "relative" }}
                >
                  <TextField
                    id="time"
                    label="Time of Incident"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      step: 300,
                    }}
                    value={incidentTime}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIncidentTime(value);
                      if (value?.trim()?.length > 0) {
                        setFormErrors((prevErrors) => ({
                          ...prevErrors,
                          timeOfIncidentError: "",
                        }));
                      }
                    }}
                    style={{ height: "42px" }}
                  />
                  {incidentTime && (
                    <button
                      type="button"
                      className="clear-icon-btn"
                      onClick={() => {
                        setIncidentTime("");
                        setFormErrors((prevErrors) => ({
                          ...prevErrors,
                          timeOfIncidentError: "",
                        }));
                      }}
                      aria-label="Clear Time"
                      style={{
                        background: "none",
                        border: "none",
                        position: "absolute",
                        right: "60px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                {formErrors["timeOfIncidentError"] && (
                  <div className="error-message">
                    {formErrors["timeOfIncidentError"]}
                  </div>
                )}
              </div>
              <div className="reportIncidentContent">
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Department resolving incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={departmentResolvingIncident || ""}
                      disabled
                      placeholder="Loading..."
                    />
                  </FloatingLabel>

                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Location of Incident (max. 50 characters)"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="50"
                      name="Incident"
                      value={incidentLocation}
                      onChange={(e) => {
                        const value = e.target.value;
                        setIncidentLocation(value);
                        if (value.trim().length > 0) {
                          setFormErrors((prevErrors) => ({
                            ...prevErrors,
                            locationOfIncidentError: "",
                          }));
                        }
                      }}
                    />
                    <div className="error-message">
                      {formErrors["locationOfIncidentError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Information Affected (max. 100 characters)"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="100"
                      name="Incident"
                      value={informationAffected}
                      onChange={(e) => setInformationAffected(e.target.value)}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-3"></span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Equipment Affected (max. 100 characters)"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="100"
                      name="Incident"
                      value={equipmentAffected}
                      onChange={(e) => setEquipmentAffected(e.target.value)}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-3"></span>
                </div>
                <div className="reportIncidentInputText mg-t-10">
                  <FloatingLabel
                    label="Number of People affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="number"
                      className="form-control mg-l-5 mg-r-15"
                      name="Incident"
                      value={noOfPeopleAffected}
                      onChange={(e) => setNoOfPeopleAffected(e.target.value)}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-3"></span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Impact on business"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control"
                      id="impactOnBusiness"
                      name="impactOnBusiness"
                      value={impactOnBusiness}
                      onChange={(e) => {
                        const value = e.target.value;
                        setImpactOnBusiness(value);

                        if (value) {
                          setFormErrors((prev) => ({
                            ...prev,
                            impactOnBusinessError: "",
                          }));
                        }
                      }}
                      onBlur={() => {
                        if (!impactOnBusiness) {
                          setFormErrors((prev) => ({
                            ...prev,
                            impactOnBusinessError:
                              "Impact on Business is required",
                          }));
                        }
                      }}
                    >
                      <option value="">---Select Impact on business---</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <div className="error-message">
                      {formErrors["impactOnBusinessError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Priority"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control"
                      id="version"
                      name="version"
                      value={priority}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPriority(value);
                        if (value) {
                          setFormErrors((prev) => ({
                            ...prev,
                            priorityError: "",
                          }));
                        }
                      }}
                      onBlur={() => {
                        if (!priority) {
                          setFormErrors((prev) => ({
                            ...prev,
                            priorityError: "Priority is required",
                          }));
                        }
                      }}
                    >
                      <option>---Select priority---</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <div className="error-message">
                      {formErrors["priorityError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-10">
                  <FloatingLabel
                    label="Departments Affected"
                    className="float-hidden float-select"
                  >
                    <div className="floatStatus">
                      {/* <pre>{JSON.stringify(selectedOperationsDepartment)}</pre> */}
                      <MultiSelect
                        options={
                          departmentOptions.length > 0
                            ? departmentOptions
                            : [{ label: "No Departments Available", value: "" }]
                        }
                        value={selectedDepartments}
                        onChange={setSelectedDepartments}
                        labelledBy="Select"
                        overrideStrings={{
                          selectSomeItems: "---Select Departments---",
                          allItemsAreSelected: "All Departments Selected",
                        }}
                      />

                      <div className="error-message">
                        {formErrors["departmentAffectedError"]}
                      </div>
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>

                <div className="reportIncidentInputText mg-t-10">
                  <FloatingLabel
                    label="Asset IDs (max. 1000 characters)"
                    className="float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="1000"
                      name="Incident"
                      value={assetIDs}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAssetIDs(value);
                        if (value.trim().length > 0) {
                          setFormErrors((prevErrors) => ({
                            ...prevErrors,
                            assetIdsError: "",
                          }));
                        }
                      }}
                    />
                    <div className="error-message">
                      {formErrors["assetIdsError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Status"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control"
                      id="incidentStatus"
                      name="incidentStatus"
                      value={incidentStatus}
                      onChange={(e) => {
                        const value = e.target.value;
                        setIncidentStatus(value);

                        if (value) {
                          setFormErrors((prev) => ({
                            ...prev,
                            incidentStatusError: "",
                          }));
                        }
                      }}
                      onBlur={() => {
                        if (!incidentStatus) {
                          setFormErrors((prev) => ({
                            ...prev,
                            incidentStatusError: "Incident Status is required",
                          }));
                        }
                      }}
                    >
                      <option value="">---Select Incident Status---</option>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">InProgress</option>
                    </select>
                    <div className="error-message">
                      {formErrors["incidentStatusError"]}
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
          </div>
        </Row>
        {showButtons && (
          <div className="reportIncidentButtonsContent mg-t-15">
            <Button
              variant="secondary"
              className="reportIncidentBtn"
              onClick={() => submitIncidentRegister(false)}
            >
              Submit
            </Button>

            <Button
              variant="secondary"
              className="reportIncidentBtn"
              onClick={() => submitIncidentRegister(true)}
            >
              Confirm and Email
            </Button>

            <Button
              variant="secondary"
              className="reportIncidentBtn"
              onClick={resetIncidentRegister}
            >
              Reset
            </Button>
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
  //#endregion
}

export default EditIncident;
