import React, { useState } from "react";
import roleService from "../../services/role.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function CreateRole(props) {
  //#region State Variables
  const [roleID, setRoleID] = useState(0);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Validation
  const handleFormValidation = () => {
    const roleNameTrimmed = roleName.trim();
    let errors = {};
    let isValid = true;
    if (!roleNameTrimmed) {
      isValid = false;
      errors["roleError"] = "Role Name is required";
    }
    setFormErrors(errors);
    return isValid;
  };
  //#endregion

  //#region Save Role
  const saveCreateRole = (e) => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving Role...");
      setLoading(true);
      const data = {
        RoleID: roleID,
        RoleName: roleName.trim(),
        Description: description.trim(),
        IsActive: isActive,
        UserID: helper.getUser(),
      };
      roleService
        .createRole(data)
        .then(() => {
          toast.success("Role Added Successfully");
          setRoleID(0);
          setRoleName("");
          setDescription("");
          setIsActive(true);
          setFormErrors({});
          props.history.push({
            pathname: "/admin/Roles",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Change the Role Name
  const onChangeRoleName = (e) => {
    setRoleName(e.target.value);
    if (formErrors.roleError) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        roleError: "",
      }));
    }
  };
  //#endregion

  //#region Reset the Create Role page
  const resetCreateRole = () => {
    setRoleID(0);
    setRoleName("");
    setDescription("");
    setIsActive(true);
    setFormErrors({});
  };
  //#endregion

  const { roleError } = formErrors;

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
          <span>Roles</span>
        </div>
        <h4 className="d-flex align-items-center">
          Create Role{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Roles List"></i>
          </span>
        </h4>
        <div id="Add_Role">
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-10 userp-l-0">
              <div className="createRoleFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Role Name</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="roleName" name="roleName" value={roleName} onChange={onChangeRoleName}/>
                  {roleError && (
                    <div className="error-message">{roleError}</div>
                  )}
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-lg-4 userp-l-0">
              <div className="createRoleFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Description</b>
                    </>
                  }
                  className="float-hidden float-select">
                  <textarea className="form-control" rows="2" style={{ height: '100px' }} id="description" name="description" maxLength="500" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 userp-l-0">
              <label htmlFor="IsActive">
                <b>Is Active?</b>
              </label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" checked={true} id="IsActive" value={isActive} name="IsActive" readOnly/>
                <span className="slider"></span>
              </label>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 mg-t-10 mg-lg-t-0 userp-l-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveCreateRole}>Save</button>
            </div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetCreateRole} id="Reset">Reset</button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  // #endregion
}
export default CreateRole;