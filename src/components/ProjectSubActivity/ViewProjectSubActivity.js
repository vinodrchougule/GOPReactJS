import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import projectSubActivityService from "../../services/projectSubActivity.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";

function ViewProjectSubActivity() {
  //#region State variables
  const [ProjectSubActivities, setProjectSubActivities] = useState({
    ProjectSubActivityID: 0,
    SubActivity: "",
    IsActive: true,
  });
  const [viewProjectSubActivityShowModal, setShowModal] = useState(false);
  const [canAccessEditProjectSubActivity, setCanAccessEditProjectSubActivity] = useState(false);
  const [canAccessDeleteProjectSubActivity, setCanAccessDeleteProjectSubActivity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Hooks and Navigation
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Use effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    checkAccessRights();
    fetchProjectSubActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  //#endregion

  //#region Access control
  const checkAccessRights = () => {
    canUserAccessPage("Edit Project SubActivity");
    canUserAccessPage("Delete Project SubActivity");
  };
  //#endregion
  
  //#region Data fetching Project Sub Activity
  const fetchProjectSubActivity = () => {
    const { ProjectSubActivityID } = location.state || {}; 
    if (!ProjectSubActivityID) { 
      history.push("/Masters/ProjectSubActivities"); 
      return; 
    } 
    setSpinnerMessage("Please wait while loading Project SubActivity..."); 
    setLoading(true);
    projectSubActivityService
      .getProjectSubActivity(ProjectSubActivityID, helper.getUser()) 
      .then((response) => { 
        setProjectSubActivities(response.data); 
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
  
  //#region Fetching View Project SubActivity Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Project SubActivity") {
          setCanAccessEditProjectSubActivity(response.data);
        } else if (pageName === "Delete Project SubActivity") {
          setCanAccessDeleteProjectSubActivity(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Show the View Project Sub Activity Modal
  const showPopUp = () => {
    setShowModal(true);
  };
  //#endregion

  //#region Delete Project Sub-Activity data
  const projectSubActivityHandleYes = () => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    setSpinnerMessage("Please wait while Deleting Project Sub-Activity...");
    setLoading(true);

    projectSubActivityService
      .deleteProjectSubActivity(ProjectSubActivities.ProjectSubActivityID, helper.getUser())
      .then(() => {
        setShowModal(false);
        setLoading(false);
        toast.success("Project Sub Activity Deleted Successfully");
        history.push("/Masters/ProjectSubActivities");
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
        projectSubActivityHandleNo();
      });
  };
  //#endregion

  //#region Close the View Project Sub Activity Modal
  const projectSubActivityHandleNo = () => {
    setShowModal(false);
  };
  //#endregion

  const { ProjectSubActivityID, SubActivity, IsActive } = ProjectSubActivities;

  //#region return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Sub-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center mg-b-20">
          View Project Sub-Activity{" "}
          <span className="icon-size">
            <Link to="/Masters/ProjectSubActivities" title="Back to Project Sub-Activity List">
              <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
            </Link>
          </span>
        </h4>
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-4">
                  <b>Project Sub Activity ID</b>
                </div>
                <div className="col-md-8">
                  <p>{ProjectSubActivityID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-4">
                  <b>Sub-Activity</b>
                </div>
                <div className="col-md-8">
                  <p>{SubActivity}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-4">
                  <b>Is Active?</b>
                </div>
                <div className="col-md-8">
                  <p>{IsActive ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            {canAccessEditProjectSubActivity && (
              <div className="col-md-2">
                <Link to={{pathname: "/Masters/EditProjectSubActivity",
                    state: ProjectSubActivityID,
                  }}
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                >
                  Edit
                </Link>
              </div>
            )}
            {canAccessDeleteProjectSubActivity && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={showPopUp}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <Modal show={viewProjectSubActivityShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={projectSubActivityHandleNo} backdrop="static" enforceFocus={false} className="projectSubActivityDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Project Sub Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Project Sub Activity?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={projectSubActivityHandleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={projectSubActivityHandleNo}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ViewProjectSubActivity;
