import React, { useState, useEffect } from "react";
import roleService from "../../services/role.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function EditRole(props) {
  //#region State
  const [roleID, setRoleID] = useState(0);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetch role details
  const fetchRole = () => {
    const { state } = props.location;
    if (state === 0 || state === null || state === undefined) {
      props.history.push("/admin/Roles");
      return;
    }
    setSpinnerMessage("Please wait while loading Role Details...");
    setLoading(true);
    roleService
      .getRole(state, helper.getUser())
      .then((response) => {
        setRoleID(response.data.RoleID);
        setRoleName(response.data.RoleName);
        setDescription(response.data.Description);
        setIsActive(response.data.IsActive);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Handle changes in role name
  const onChangeRoleName = (e) => {
    setRoleName(e.target.value);
    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors({});
    }
  };
  //#endregion

  //#region Handle changes in description
  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  //#endregion

  //#region Handle changes in isActive checkbox
  const onChangeIsActive = (e) => {
    setIsActive(e.target.checked);
  };
  //#endregion

  //#region Validate form data
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

  //#region Save role
  const saveEditRole = () => {
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
        .updateRole(roleID, data)
        .then(() => {
          toast.success("Role Updated Successfully");
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

  //#region Reset the page
  const resetEditRole = () => {
    fetchRole();
    setFormErrors({});
  };
  //#endregion

  //#region return
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
          <span>Roles</span>
        </div>
        <h4 className="d-flex align-items-center">
          Edit Role{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Roles List"></i>
          </span>
        </h4>
        <div id="Edit_Role">
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15 userp-l-0">
              <div className="editRoleFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Project Sub-Activity ID</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="roleName" name="roleName" value={roleName} onChange={onChangeRoleName}
                  />
                  {formErrors.roleError && (
                    <div className="error-message">{formErrors.roleError}</div>
                  )}
                </FloatingLabel>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-lg-4 userp-l-0">
              <div className="editRoleFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Description</b>
                    </>
                  }
                  className="float-hidden float-select">
                  <textarea className="form-control" rows="2" id="description" style={{ height: '100px' }} name="description" maxLength="500" value={description} onChange={onChangeDescription}></textarea>
                </FloatingLabel>
              </div>
            </div>
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
                <input type="checkbox" checked={isActive} id="IsActive" value={isActive} name="IsActive" onChange={onChangeIsActive} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 userp-l-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveEditRole}>Save</button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-gray-700 btn-block" onClick={resetEditRole} id="Reset">Reset</button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};
export default EditRole;