import React, { useState, useEffect } from "react";
import userService from "../../services/user.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModernDatepicker from "react-modern-datepicker";
import moment from "moment";
import projectService from "../../services/project.service";
import { useHistory, useLocation  } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function EditUser (props) {
  //#region History Initialization
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Component state
  const [userID, setUserID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [emailID, setEmailID] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageForProfileFile, setMessageForProfileFile] = useState(false);
  const [profileFileName, setProfileFileName] = useState("");
  const [profileFileUploadedName, setProfileFileUploadedName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [relievingDate, setRelievingDate] = useState("");
  const [editPhoto, setEditPhoto] = useState(false);
  const [profileFileKey, setProfileFileKey] = useState(Date.now());
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchUser();
    fetchDepartments();
    fetchUsersList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region Fetching selected User details
  const fetchUser = () => {
    const { state } = location;
    if (!state) {
      history.push("/admin/UserList");
      return;
    }
    setSpinnerMessage("Please wait while fetching the User Details...");
    setLoading(true);
    userService
      .getUser(state, helper.getUser())
      .then((response) => {
        const relievingDate = response.data.RelievingDate
          ? moment(response.data.RelievingDate).format("DD-MMM-YYYY")
          : "";
        setUserID(response.data.UserID);
        setFirstName(response.data.FirstName);
        setMiddleName(response.data.MiddleName);
        setLastName(response.data.LastName);
        setUserName(response.data.UserName);
        setEmailID(response.data.Email);
        setRelievingDate(relievingDate);
        setSelectedDepartment(response.data.DepartmentName);
        setSelectedManager(response.data.ManagerName);
        setProfileFileName(response.data.PhotoFileName);
        setProfileFileUploadedName(response.data.PhotoFileName);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message || "Error fetching user details", { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Departments
  const fetchDepartments = () => {
    setSpinnerMessage("Please wait while loading Departments...");
    setLoading(true);
    userService
      .readDepartments()
      .then((response) => {
        setDepartments(response.data);
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

  //#region fetching Users List from Web API
  const fetchUsersList = () => {
    setSpinnerMessage("Please wait while fetching Managers...");
    setLoading(true);
    userService
      .getAllUsers(helper.getUser())
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Get First Name Value
  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, firstNameError: "" }));
    }
  };
  //#endregion

  //#region Get Middle Name Value
  const onChangeMiddleName = (e) => {
    setMiddleName(e.target.value);
  };
  //#endregion

  //#region Get Last Name Value
  const onChangeLastName = (e) => {
    setLastName(e.target.value);
  };
  //#endregion

  //#region Get Email Value
  const onChangeEmailID = (e) => {
    const newEmailID = e.target.value;
    setEmailID(newEmailID);

    if (newEmailID !== "" && newEmailID !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        emailIDError: "",
      }));
    }
  };
  //#endregion

  //#region Get Department Value
  const onChangeDepartment = (e) => {
    const newSelectedDepartment = e.target.value;
    setSelectedDepartment(newSelectedDepartment);

    if (newSelectedDepartment !== "" && newSelectedDepartment !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        departmentError: "",
      }));
    }
  };
  //#endregion

  //#region Get Manager Value
  const onChangeManager = (e) => {
    const newSelectedManager = e.target.value;
    setSelectedManager(newSelectedManager);

    if (newSelectedManager !== "" && newSelectedManager !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        managerError: "",
      }));
    }
  };
  //#endregion

  //#region Change Received Date
  const onChangeReceivedDate = (date) => {
    setRelievingDate(date);
  };
  //#endregion

  //#region Clear Received Date
  const clearReceivedDate = () => {
    setRelievingDate("");
  };
  //#endregion 

  //#region Validating the input data
  const handleFormValidation = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedEmailID = emailID.trim();
    const re = /\S+@\S+\.\S+/;
    let errors = {};
    let isValidForm = true;

    if (!trimmedFirstName) {
      isValidForm = false;
      errors["firstNameError"] = "First Name is required";
    }

    if (!trimmedEmailID) {
      isValidForm = false;
      errors["emailIDError"] = "Email ID is required";
    } else if (!re.test(trimmedEmailID)) {
      isValidForm = false;
      errors["emailIDError"] = "Invalid Email ID";
    }

    if (!selectedDepartment) {
      isValidForm = false;
      errors["departmentError"] = "Department is required";
    }

    if (!selectedManager) {
      isValidForm = false;
      errors["managerError"] = "Manager is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Upload profilePhoto
  const uploadProfilePhoto = (e) => {
    setEditPhoto(true);
    setMessageForProfileFile(true);
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = currentFile.name;
    setProfileFileUploadedName(fileNameUploaded);

    let formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading scope file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForProfileFile(false);
        setProfileFileName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForProfileFile(false);
        setProfileFileName("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const updatedFormErrors = { ...formErrors, scopeError: "" };
      setFormErrors(updatedFormErrors);
    }
  };
  //#endregion Upload profilePhoto

  //#region Downloading Scope File
  const downloadProfileFile = (e) => {
    setSpinnerMessage("Please wait while downloading profile file...");
    setLoading(true);

    projectService
      .downloadFile(profileFileName, "profilephoto")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", profileFileUploadedName);
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

  //#region Deleting Scope File
  const deleteScopeFile = () => {
    setSpinnerMessage("Please wait while deleting profile file...");
    setLoading(true);

    projectService
      .deleteFile(profileFileName)
      .then((response) => {
        setProfileFileKey(Date.now());
        setProfileFileName("");
        setProfileFileUploadedName("");
        setEditPhoto(true);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setProfileFileName("");
        setLoading(false);
      });
  };
  //#endregion
  
  //#region Save Edit User
  const saveEditUser = () => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving the User...");
      setLoading(true);
      const data = {
        UserID: userID,
        FirstName: firstName.trim(),
        MiddleName: middleName.trim(),
        LastName: lastName.trim(),
        UserName: userName.trim(),
        Email: emailID.trim(),
        RelievingDate: relievingDate,
        DepartmentName: selectedDepartment.trim(),
        ManagerName: selectedManager.trim(),
        IsLockedOut: false,
        PhotoFileName: profileFileName,
        User: helper.getUser(),
      };
      userService
        .updateUser(userID, data)
        .then(() => {
          toast.success("User Updated Successfully");
          setUserID("");
          setFirstName("");
          setMiddleName("");
          setLastName("");
          setUserName("");
          setEmailID("");
          setRelievingDate("");
          setSelectedDepartment("");
          setSelectedManager("");
          setProfileFileName("");
          setLoading(false);
          history.push({
            pathname: "/admin/UserList",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Reset the page
  const resetEditUser = () => {
    fetchUser();
    setFormErrors({});
    setEditPhoto(false);
    setMessageForProfileFile(false);
    setProfileFileName("");
    setProfileFileKey(Date.now());
  };
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay active={loading} className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb">
          <span>Admin</span>
          <span>Edit User</span>
        </div>
        <h4 className="d-flex align-items-center">
          Edit User{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Users List"></i>
          </span>
        </h4>
        <div id="Edit_User">
          <div className="row row-sm mg-t-15">
            <div className="col-lg userp-l-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      First Name <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="firstName" name="firstName" tabIndex="1" value={firstName} onChange={onChangeFirstName} />
                  <div className="error-message">
                    {formErrors["firstNameError"]}
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Middle Name
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="middleName" name="middleName" tabIndex="2" value={middleName} onChange={onChangeMiddleName} />
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Last Name
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="lastName" name="lastName" tabIndex="3" value={lastName} onChange={onChangeLastName} />
                </FloatingLabel>
              </div>
            </div>
          </div>
          <div className="row row-sm mg-t-15">
            <div className="col-lg userp-l-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Username <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="userName" name="userName" tabIndex="4" value={userName} readOnly />
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Department <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <select className="form-control" tabIndex="1" id="department" name="department" placeholder="--Select--" value={selectedDepartment} onChange={onChangeDepartment}>
                    <option value="">--Select--</option>
                    {departments.map((department) => (
                      <option key={department.DepartmentID}>
                        {department.Name}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {formErrors["departmentError"]}
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Manager <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <select className="form-control" tabIndex="1" id="manager" name="manager" placeholder="--Select--" value={selectedManager} onChange={onChangeManager}>
                    <option value="">--Select--</option>
                    {users.map((user) => (
                      <option key={user.UserID}>
                        {user.FirstName +
                          (user.MiddleName ? " " + user.MiddleName : "") +
                          (user.LastName ? " " + user.LastName : "") +
                          " - " +
                          user.UserName}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {formErrors["managerError"]}
                  </div>
                </FloatingLabel>
              </div>
            </div>
          </div>
          <div className="row row-sm mg-t-15">
            <div className="col-lg userp-l-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Email ID <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="email" className="form-control" maxLength="50" id="email" name="email" tabIndex="4" value={emailID} onChange={onChangeEmailID} />
                  <div className="error-message">
                    {formErrors["emailIDError"]}
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg">
              <div className="createUserFloatingDateInput">
                <FloatingLabel
                  label={
                    <>
                      Releaving Date <span className="text-danger asterisk-size"></span>
                    </>
                  }
                  className="float-hidden float-select">
                  <div className="form-field-div flex-grow-1">
                    <div className="form-control date-field-width">
                      <ModernDatepicker date={relievingDate} format={"DD-MMM-YYYY"} onChange={(date) => onChangeReceivedDate(date)} placeholder={"Select a date"} className="color" minDate={new Date(1900, 1, 1)} />
                    </div>
                    <span className="btn btn-secondary" onClick={clearReceivedDate}>
                      <i className="far fa-window-close" title="Clear Received Date"></i>
                    </span>
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <div className="row row-sm mg-t-15">
            <div className="col-lg userp-l-0">
              <div className="createUserFloatingChooseFileInput">
                <FloatingLabel label="User Profile Image" className="float-hidden float-select">
                  <div>
                    <input type="file" className="form-control flex-grow-1" id="pfofileFile" name="pfofileFile" key={profileFileKey} onChange={uploadProfilePhoto} accept="image/*"/>
                    {!editPhoto && profileFileName && (
                      <label htmlFor="pfofileFile" style={{ position: "absolute", left: "30px" }}>{profileFileName}</label>
                    )}
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg d-flex align-items-end">
              {messageForProfileFile && <p>Please Wait...</p>}
              {profileFileName && (
                <>
                  <span className="btn btn-secondary" onClick={downloadProfileFile} style={{ maxHeight: "38px" }}>
                    <i className="fas fa-download"></i>
                  </span>
                  <span className="btn btn-secondary mg-l-5" onClick={deleteScopeFile} style={{ maxHeight: "38px" }}>
                    <i className="fas fa-trash-alt"></i>
                  </span>
                </>
              )}
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <br />
          <div className="row row-sm">
            <div className="col-md-3"></div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveEditUser}>Save</button>
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetEditUser} id="Reset">Reset</button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default EditUser;