import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import genericActivityService from "../../services/genericActivity.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ViewGenericActivity () {
  //#region State
  const [genericActivities, setGenericActivities] = useState({
    GenericActivityID: 0,
    Activity: "",
    IsActive: true,
  });
  const [viewGenericActivityShowModal, setShowModal] = useState(false);
  const [canAccessEditGenericActivity, setCanAccessEditGenericActivity] =
    useState(false);
  const [canAccessDeleteGenericActivity, setCanAccessDeleteGenericActivity] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  const history = useHistory();
  const location = useLocation();

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    canUserAccessPage("Edit Generic Activity");
    canUserAccessPage("Delete Generic Activity");
    fetchGenericActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching Generic Activity
  const fetchGenericActivity = () => {
    const { GenericActivityID } = location.state || {};
    if (!GenericActivityID) {
      history.push("/Masters/GenericActivities");
      return;
    }
    setSpinnerMessage("Please wait while loading Generic Activity...");
    setLoading(true);

    genericActivityService
      .getGenericActivity(GenericActivityID, helper.getUser())
      .then((response) => {
        setGenericActivities(response.data);
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

  //#region Fetching View Generic Activity Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Generic Activity") {
          setCanAccessEditGenericActivity(response.data);
        } else if (pageName === "Delete Generic Activity") {
          setCanAccessDeleteGenericActivity(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Delete View Generic Activity data
  const genericActivityHandleYes = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    setSpinnerMessage("Please wait while deleting Generic Activity...");
    setLoading(true);

    genericActivityService
      .deleteGenericActivity(
        genericActivities.GenericActivityID,
        helper.getUser()
      )
      .then(() => {
        setShowModal(false);
        toast.success("Generic Activity Deleted Successfully");
        history.push("/Masters/GenericActivities");
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
        genericActivityHandleNo();
      });
  };
  //#endregion

  //#region Close the Modal
  const genericActivityHandleNo = () => {
    setShowModal(false);
  };
  //#endregion

  //#region Show the Modal Popup
  const showPopUp = () => {
    setShowModal(true);
  };
  //#endregion

  //#region Return
  return (
    <div className="pro-main-display">
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
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Generic-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center mg-b-20">
          View Generic Activity{" "}
          <span className="icon-size">
            <Link to="/Masters/GenericActivities" title="Back to Generic-Activity List">
              <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
            </Link>
          </span>
        </h4>
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>Generic Activity ID</b>
                </div>
                <div className="col-md-6">
                  <p>{genericActivities.GenericActivityID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>Activity</b>
                </div>
                <div className="col-md-6">
                  <p>{genericActivities.Activity}</p>
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
                  <p>{genericActivities.IsActive ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row row-sm mg-t-10">
            {canAccessEditGenericActivity && (
              <div className="col-md-2">
                <Link to={{pathname: "/Masters/EditGenericActivity", 
                    state: genericActivities.GenericActivityID,
                  }}
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                >
                  Edit
                </Link>
              </div>
            )}
            {canAccessDeleteGenericActivity && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={showPopUp}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <Modal show={viewGenericActivityShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={genericActivityHandleNo} backdrop="static" enforceFocus={false} className="genericActivityDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Generic Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure to delete this Generic Activity?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={genericActivityHandleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={genericActivityHandleNo}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};

export default ViewGenericActivity;
