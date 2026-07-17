import React, { useEffect } from 'react';
import { useState } from 'react';
import projectActivityService from '../../services/projectActivity.service';
import helpers from '../../helpers/helpers';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import accessControlService from '../../services/accessControl.service';
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import { Button, Modal } from 'react-bootstrap';
toast.configure();

function ViewProjectActivity() {
  let history = useHistory();
  const location = useLocation();

  //#region Initial State
  const [initialState, setInitialState] = useState({
    ProjectActivities: [
      {
        ProjectActivityID: 0,
        Activity: "",
        IsActive: true,
      },
    ],
      showModal: false,
      canAccessEditProjectActivity: false,
      canAccessDeleteProjectActivity: false,
      loading: false,
      spinnerMessage: "",
  })

  //#region modal functions
  //#region show popup
  const showPopUp = () => {
    setInitialState(prevState => ({...prevState, showModal: true }));
  }
  //#endregion

  //#region handle Yes
  const handleYes = () => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    projectActivityService
      .deleteProjectActivity(
        initialState.ProjectActivities.ProjectActivityID,
        helpers.getUser()
      )
      .then(() => {
        setInitialState(prevState => ({...prevState, showModal: false }));
        toast.success("Project Activity Deleted Successfully");
        history.push({
          pathname: "/Masters/ProjectActivities",
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
        handleNo();
      });
  }
  //#endregion

  //#region handle No
  const handleNo = () => {
    setInitialState(prevState => ({...prevState, showModal: false }));
  }
  //#endregion
  
  //#region Use effect
   useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    canUserAccessPage("Edit Project Activity");
    canUserAccessPage("Delete Project Activity");
    fetchProjectActivity();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
  //#endregion

  //#region Fetching selected Project Activity details
  const fetchProjectActivity = () => {
    const { state } = location; // Project Activity ID passed from Project Activity List Page
    if (state === 0 || state === null || state === undefined) {
      history.push("/Masters/ProjectActivities");
      return;
    }

    setInitialState((prevState) => ({...prevState,
      spinnerMessage: "Please wait while loading Project Activities...",
      loading: true,
    }));

    projectActivityService
      .getProjectActivity(state, helpers.getUser())
      .then((response) => {
        setInitialState((prevState) => ({...prevState,
          ProjectActivities: response.data,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitialState((prevState) => ({...prevState, loading: false }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region fetching Customer page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helpers.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Project Activity") {
          setInitialState((prevState) => ({...prevState,
            canAccessEditProjectActivity: response.data,
          }));
        } else if (pageName === "Delete Project Activity") {
          setInitialState((prevState) => ({...prevState,
            canAccessDeleteProjectActivity: response.data,
          }));
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  const { ProjectActivityID, Activity, IsActive } =
  initialState.ProjectActivities;

  //#region Return
  return (
    <div className="pro-main-display">
        <LoadingOverlay
          active={initialState.loading}
          className="custom-loader"
          spinner={
            <div className="spinner-background">
              <BarLoader
                css={helpers.getcss()}
                color={"#38D643"}
                width={"350px"}
                height={"10px"}
                speedMultiplier={0.3}
              />
              <p style={{ color: "black", marginTop: "5px" }}>
                {initialState.spinnerMessage}
              </p>
            </div>
          }
        >
          <div style={{height: "100%", position: "relative"}}>
          <div className="az-content-breadcrumb mg-l-10">
            <span>Master</span>
            <span>Project-Activities</span>
          </div>
          <h4 className="mg-l-10 d-flex align-items-center">
            View Project Activity{" "}
            <span className="icon-size">
              {" "}
              <Link to="/Masters/ProjectActivities" title="Back to Project Activity List">
                <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
              </Link>
            </span>
          </h4>
          <br />
          <div>
            <div className="row">
              <div className="col-md-8">
                <div className="row row-sm mg-b-5">
                  <div className="col-md-3">
                    <b>Project Activity ID</b>
                  </div>
                  <div className="col-md-6">
                    <p>{ProjectActivityID}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="row row-sm">
                  <div className="col-md-3">
                    <b>Activity</b>
                  </div>
                  <div className="col-md-6">
                    <p>{Activity}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="row row-sm">
                  <div className="col-md-3">
                    <b>Is Active?</b>
                  </div>
                  <div className="col-md-6">
                    {IsActive === false && <p>No</p>}
                    {IsActive === true && <p>Yes</p>}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row row-sm">
              {initialState.canAccessEditProjectActivity && (
                <div className="col-md-2">
                  <Link
                    to={{
                      pathname: "/Masters/EditProjectActivity",
                      state: ProjectActivityID, 
                    }}
                    className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block"
                  >
                    Edit
                  </Link>
                </div>
              )}
              {initialState.canAccessDeleteProjectActivity && (
                <div className="col-md-2">
                  <button
                    className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block"
                    onClick={showPopUp}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <Modal
              show={initialState.showModal}
              aria-labelledby="contained-modal-title-vcenter"
              onHide={handleNo}
              backdrop="static"
              enforceFocus={false}
              className="confirm-delete-modal"
            >
              <Modal.Header>
                <Modal.Title>Delete Project Activity</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <p>Are you sure to delete this Project Activity?</p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleYes}>
                  Yes
                </Button>
                <Button variant="primary" onClick={handleNo}>
                  No
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          </div>
        </LoadingOverlay>
    </div>
  )
  //#endregion
}

export default ViewProjectActivity
