import React, { useState, useEffect } from "react";
import userService from "../../services/user.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import projectService from "../../services/project.service";
import { useHistory } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function CreateUser(props) {
  //#region History Initialization
  const history = useHistory();
  //#endregion

  //#region Component state
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
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
  const [profileFileKey, setProfileFileKey] = useState(Date.now());
  //#endregion

  //#region InitialState
  const initialState = {
    userID: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    password: "",
    reTypePassword: "",
    emailID: "",
    formErrors: {},
    departments: [],
    users: [],
    messageForProfileFile: false,
    profileFileName: false,
    profileFileKey: Date.now(),
    profileFileUploadedName: "",
    selectedDepartment: "",
    selectedManager: "",
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchDepartments();
    fetchUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region Fetch Departments
  const fetchDepartments = () => {
    setSpinnerMessage("Please wait while loading Departments...");
    setLoading(true);
    userService.readDepartments()
      .then((response) => {
        setDepartments(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Users List from Web API
  const fetchUsersList = () => {
    setSpinnerMessage("Please wait while fetching Managers...");
    setLoading(true);
    userService.getAllUsers(helper.getUser())
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const re = /\S+@\S+\.\S+/;
    let formErrors = {};
    let isValidForm = true;

    if (!firstName.trim()) {
      isValidForm = false;
      formErrors["firstNameError"] = "First Name is required";
    }

    if (!userName.trim()) {
      isValidForm = false;
      formErrors["userNameError"] = "User Name is required";
    } else if (userName.length < 3) {
      isValidForm = false;
      formErrors["userNameError"] = "User Name must be at least 3 characters";
    }

    if (!password.trim()) {
      isValidForm = false;
      formErrors["passwordError"] = "Password is required";
    } else if (password.length < 6) {
      isValidForm = false;
      formErrors["passwordError"] = "Password must be at least 6 characters";
    }

    if (!reTypePassword.trim()) {
      isValidForm = false;
      formErrors["reTypePasswordError"] = "Re Type Password is required";
    } else if (password !== reTypePassword) {
      isValidForm = false;
      formErrors["reTypePasswordError"] = "Re Type Password doesn't match with password";
    }

    if (!emailID.trim()) {
      isValidForm = false;
      formErrors["emailIDError"] = "Email ID is required";
    } else if (!re.test(emailID)) {
      isValidForm = false;
      formErrors["emailIDError"] = "Invalid Email ID";
    }

    if (!selectedDepartment) {
      isValidForm = false;
      formErrors["departmentError"] = "Department is required";
    }

    if (!selectedManager) {
      isValidForm = false;
      formErrors["managerError"] = "Manager is required";
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Upload profilePhoto
  const uploadProfilePhoto = (e) => {
    if (e.target.files) {
      setMessageForProfileFile(true);
      const files = e.target.files;
      const currentFile = files[0];
      const fileNameUploaded = files[0].name;
      setProfileFileUploadedName(fileNameUploaded);
      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading profile photo...");
      setLoading(true);
      projectService.saveFileupload(formData)
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
    }
  };
  //#endregion

  //#region Downloading Scope File
  const downloadScopeFile = () => {
    setSpinnerMessage("Please wait while downloading scope file...");
    setLoading(true);
    projectService.downloadFile(profileFileName, "scope")
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
    setSpinnerMessage("Please wait while deleting scope file...");
    setLoading(true);
    projectService.deleteFile(profileFileName)
      .then(() => {
        setProfileFileKey(Date.now());
        setProfileFileName("");
        setProfileFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setLoading(false);
      });
  };
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
  }
  //#endregion

  //#region Get User Name Value
  const onChangeUserName = (e) => {
    const re = /^[A-Za-z]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setUserName(e.target.value);
      setFormErrors((prevErrors) => ({ ...prevErrors, userNameError: "" }));
    }
  };
  //#endregion

  //#region Get password Value
  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, passwordError: "" }));
    }
  };
  //#endregion

  //#region Get Re Type Password Value
  const onChangeReTypePassword = (e) => {
    setReTypePassword(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, reTypePasswordError: "" }));
    }
  };
  //#endregion

  //#region Get Email Value
  const onChangeEmailID = (e) => {
    setEmailID(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, emailIDError: "" }));
    }
  };
  //#endregion

  //#region Get Department Value
  const onChangeDepartment = (e) => {
    setSelectedDepartment(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, departmentError: "" }));
    }
  };
  //#endregion

  //#region Get Manager Value
  const onChangeManager = (e) => {
    setSelectedManager(e.target.value);
    if (e.target.value) {
      setFormErrors((prevErrors) => ({ ...prevErrors, managerError: "" }));
    }
  };
  //#endregion

  //#region Save Create User
  const saveCreateUser = () => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving User...");
      setLoading(true);
      const data = {
        UserID: initialState.userID,
        FirstName: firstName.trim(),
        MiddleName: middleName.trim(),
        LastName: lastName.trim(),
        UserName: userName.trim(),
        Password: password,
        Email: emailID.trim(),
        DepartmentName: selectedDepartment.trim(),
        ManagerName: selectedManager.trim(),
        IsLockedOut: false,
        PhotoFileName: profileFileName,
        User: helper.getUser(),
      };
      userService.createUser(data)
        .then(() => {
          toast.success("User Added Successfully");
          resetCreateUser();
          history.push({ pathname: "/admin/UserList" });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Reset the Create User page
  const resetCreateUser = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setUserName("");
    setPassword("");
    setReTypePassword("");
    setEmailID("");
    setFormErrors({});
    setMessageForProfileFile(false);
    setProfileFileName("");
    setProfileFileUploadedName("");
    setSelectedDepartment("");
    setSelectedManager("");
    setLoading(false);
    setSpinnerMessage("");
  };
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay active={loading} className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>
              {spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb">
          <span>Admin</span>
          <span>Create User</span>
        </div>
        <h4 className="d-flex align-items-center">
          Create User{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Users List"></i>
          </span>
        </h4>
        <div id="Add_User">
          <div className="row row-sm mg-t-15">
            <div className="col-lg userp-l-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      First Name <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
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
                  <input type="text" className="form-control" maxLength="50" id="userName" name="userName" tabIndex="4" value={userName} onChange={onChangeUserName} />
                  <div className="error-message">
                    {formErrors["userNameError"]}
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Password <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="password" className="form-control" maxLength="50" id="password" name="password" tabIndex="5" value={password} onChange={onChangePassword} />
                  <div className="error-message">
                    {formErrors["passwordError"]}
                  </div>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0">
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Re-type Password <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="password" className="form-control" maxLength="50" id="reTypePassword" name="reTypePassword" tabIndex="6" value={reTypePassword} onChange={onChangeReTypePassword} />
                  <div className="error-message">
                    {formErrors["reTypePasswordError"]}
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
                  <input type="email" className="form-control" maxLength="50" id="email" name="email" tabIndex="7" value={emailID} onChange={onChangeEmailID} />
                  <div className="error-message">
                    {formErrors["emailIDError"]}
                  </div>
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
          <div className="row row-sm mg-t-20">
            <div className="col-lg mg-t-0 mg-lg-t-0 userp-l-0 userp-r-0">
              <div className="createUserFloatingChooseFileInput">
                <FloatingLabel
                  label={
                    <>
                      Choose Profile Image
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="file" className="form-control flex-grow-1" tabIndex="18" id="ScopeFile" name="ScopeFile" key={profileFileKey} onChange={uploadProfilePhoto} accept="image/*" />
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg d-flex align-items-end">
              {messageForProfileFile && <p>Please Wait...</p>}
              {profileFileName && (
                <>
                  <span className="btn btn-secondary" onClick={downloadScopeFile} style={{ maxHeight: "41px", minHeight: "41px" }}>
                    <i className="fas fa-download"></i>
                  </span>
                  <span className="btn btn-secondary mg-l-5" onClick={deleteScopeFile} style={{ maxHeight: "41px", minHeight: "41px" }}>
                    <i className="fas fa-trash-alt"></i>
                  </span>
                </>
              )}
            </div>
            <div className="col-lg d-flex align-items-end">
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-3"></div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveCreateUser}>Save</button>
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetCreateUser} id="Reset">Reset</button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};
export default CreateUser;
