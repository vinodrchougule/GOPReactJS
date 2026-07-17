import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import userService from "../../services/user.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
toast.configure();

function ViewUser () {
  //#region State
  const [user, setUser] = useState({
    UserID: null,
    FirstName: null,
    MiddleName: null,
    LastName: null,
    UserName: null,
    Email: null,
    IsLockedOut: null,
    RelievingDate: null,
    PhotoFileName: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [canAccessEditUser, setCanAccessEditUser] = useState(false);
  const [canAccessDeleteUser, setCanAccessDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("Edit User");
    canUserAccessPage("Delete User");
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching selected User details
  const fetchUser = () => {
    const { UserID } = location.state || {};
    if (!UserID) {
      history.push("/admin/UserList");
      return;
    }
    setSpinnerMessage("Please wait while loading User Details...");
    setLoading(true);

    userService
      .getUser(UserID, helper.getUser())
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  
  //#endregion

  //#region Fetching View User page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit User") {
          setCanAccessEditUser(response.data);
        } else if (pageName === "Delete User") {
          setCanAccessDeleteUser(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region show popup
  const showPopUp = () => setShowModal(true);
  //#endregion

  //#region handle Yes
  const handleYes = () => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    setSpinnerMessage("Please wait while deleting the User...");
    setLoading(true);

    userService
      .deleteUser(user.UserID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("User Deleted Successfully");
        history.push({
          pathname: "/admin/UserList",
        });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
        handleNo();
      });
  };
  //#endregion

  //#region hanle No
  const handleNo = () => setShowModal(false);
  //#endregion

  const { UserID, FirstName, MiddleName, LastName, UserName, Email, DepartmentName, ManagerName, IsLockedOut, RelievingDate, } = user;

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
        <div className="az-content-breadcrumb mg-l-10">
          <span>Admin</span>
          <span>View User</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          View User{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => history.goBack()} title="Back to Users List"></i>
          </span>
        </h4>
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>User ID</b>
                </div>
                <div className="col-md-8">
                  <p>{UserID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>First Name</b>
                </div>
                <div className="col-md-8">
                  <p>{FirstName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Middle Name</b>
                </div>
                <div className="col-md-8">{MiddleName}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Last Name</b>
                </div>
                <div className="col-md-8">{LastName}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Username</b>
                </div>
                <div className="col-md-8">{UserName}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Email ID</b>
                </div>
                <div className="col-md-8">{Email}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Department</b>
                </div>
                <div className="col-md-8">{DepartmentName}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Manager</b>
                </div>
                <div className="col-md-8">{ManagerName}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-3">
                  <b>Is Locked Out?</b>
                </div>
                <div className="col-md-8">
                  {IsLockedOut === true ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
          <br />
          {user?.RelievingDate && (
            <div className="row">
              <div className="col-md-8">
                <div className="row row-sm">
                  <div className="col-md-3">
                    <b>Relieving Date</b>
                  </div>
                  <div className="col-md-8">
                    {moment(new Date(RelievingDate)).format("DD-MM-YYYY")}
                  </div>
                </div>
              </div>
            </div>
          )}
          {user?.PhotoFileName && (
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-2">
                {user.PhotoFileBase64String ? (
                  <div>
                    <img
                      width="150"
                      height="150"
                      src={`data:image/*;base64,${user.PhotoFileBase64String}`}
                      alt={user.ImageTempFileName || "No File Name"}
                    />
                  </div>
                ) : (
                  <div>
                    <span>No profile image</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="row row-sm">
            {canAccessEditUser && (
              <div className="col-md-2">
                <Link to={{pathname: "/admin/EditUser", state: UserID}} className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block">Edit</Link>
              </div>
            )}
            <div className="col-md-0.5"></div>
            {canAccessDeleteUser && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block" onClick={showPopUp} hidden={true}>Delete</button>
              </div>
            )}
          </div>
          
          <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" onHide={handleNo} backdrop="static" enforceFocus={false}>
            <Modal.Header>
              <Modal.Title>Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure to delete this User?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleYes}>Yes</Button>
              <Button variant="primary" onClick={handleNo}>No</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};
export default ViewUser;