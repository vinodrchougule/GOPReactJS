import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import roleService from "../../services/role.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ViewRole () {
  //#region State initialization
  const [Role, setRole] = useState({
    RoleID: null,
    RoleName: null,
    Description: null,
    IsActive: null,
  });
  const [viewRoleShowModal, setShowModal] = useState(false);
  const [canAccessEditRole, setCanAccessEditRole] = useState(false);
  const [canAccessDeleteRole, setCanAccessDeleteRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Hooks
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Effect to handle component mount logic
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }
    canUserAccessPage("Edit Role");
    canUserAccessPage("Delete Role");
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location]);
  //#endregion

  //#region Fetching the selected Role details
  const fetchRole = () => {
    const { RoleID } = location.state || {}; 
    if (!RoleID) { 
      history.push("/admin/Roles"); 
      return; 
    } 
    setSpinnerMessage("Please wait while loading Role Details...");
    setLoading(true);
    roleService
      .getRole(RoleID, helper.getUser())
      .then((response) => {
        setRole(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetching Role page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Role") {
          setCanAccessEditRole(response.data);
        } else if (pageName === "Delete Role") {
          setCanAccessDeleteRole(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Modal functions
  const viewRoleShowPopUp = () => setShowModal(true);
  const viewRoleHandleYes = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }
    setSpinnerMessage("Please wait while deleting Role...");
    setLoading(true);
    roleService
      .deleteRole(Role.RoleID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("Role Deleted Successfully");
        history.push("/admin/Roles");
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
        viewRoleHandleNo();
      });
  };
  //#endregion

  const viewRoleHandleNo = () => setShowModal(false);

  //#region Return
  return (
    <div>
      <LoadingOverlay active={loading}
        className="custom-loader"
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
          View Role{" "}
          <span className="icon-size">
            <Link to="/admin/Roles" title="Back to Roles List">
              <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
            </Link>
          </span>
        </h4>
        <br />
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3 userp-l-0">
                  <b>Roles ID</b>
                </div>
                <div className="col-md-8">
                  <p>{Role.RoleID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3 userp-l-0">
                  <b>Role Name</b>
                </div>
                <div className="col-md-8">
                  <p>{Role.RoleName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3 userp-l-0">
                  <b>Description</b>
                </div>
                <div className="col-md-8">{Role.Description}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3 userp-l-0">
                  <b>Is Active?</b>
                </div>
                <div className="col-md-8">
                  {Role.IsActive === true ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            {canAccessEditRole && (
              <div className="col-md-2 userp-l-0">
                <Link to={{pathname: "/admin/EditRole", state: Role.RoleID}} className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block">Edit</Link>
              </div>
            )}
            {canAccessDeleteRole && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block" onClick={viewRoleShowPopUp}>Delete</button>
              </div>
            )}
          </div>
          
          <Modal show={viewRoleShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={viewRoleHandleNo} backdrop="static" enforceFocus={false} className="viewRoleDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Role?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={viewRoleHandleYes}>Yes</Button>
              <Button variant="primary" onClick={viewRoleHandleNo}>No</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};
export default ViewRole;