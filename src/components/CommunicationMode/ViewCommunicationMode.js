import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import communicationModeService from "../../services/communicationMode.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function ViewCommunicationMode() {
  // #region State and Variables
  const [communicationModes, setCommunicationModes] = useState({
    CommunicationModeID: 0,
    CommunicationMode: "",
    IsActive: true,
  });
  const [communicationModeShowModal, setShowModal] = useState(false);
  const [canAccessEditCommunicationMode, setCanAccessEditCommunicationMode] = useState(false);
  const [canAccessDeleteCommunicationMode, setCanAccessDeleteCommunicationMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const history = useHistory();
  const location = useLocation();
  // #endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    canUserAccessPage("Edit Communication Mode", setCanAccessEditCommunicationMode);
    canUserAccessPage("Delete Communication Mode", setCanAccessDeleteCommunicationMode);
    fetchCommunicationMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  // #region Fetching Communication Mode
  const fetchCommunicationMode = () => {
    const { CommunicationModeID } = location.state || {};
    if (!CommunicationModeID) {
      history.push("/Masters/CommunicationModeList");
      return;
    }

    setSpinnerMessage("Please wait while loading Communication Mode...");
    setLoading(true);

    communicationModeService
      .getCommunicationMode(CommunicationModeID, helper.getUser())
      .then((response) => {
        setCommunicationModes(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  // #endregion

  //#region Fetching View Communication Mode Page Access
  const canUserAccessPage = (pageName, setAccessState) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setAccessState(response.data);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  // #endregion

  //#region Delete Communication Mode data
  const communicationModeHandleYes = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    setSpinnerMessage("Please wait while deleting Communication Mode...");
    setLoading(true);

    communicationModeService
      .deleteCommunicationMode(communicationModes.CommunicationModeID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("Communication Mode Deleted Successfully");
        history.push("/Masters/CommunicationModeList");
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
        setShowModal(false);
      });
  };
  // #endregion

  //#region Close Communication Mode Modal
  const communicationModeHandleNo = () => {
    setShowModal(false);
  };
  // #endregion

  //#region Show the Communication Mode Modal
  const showPopUp = () => {
    setShowModal(true);
  };
  // #endregion

  // #region Return
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
          <span>Communication Modes</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center mg-b-20">
          View Communication Mode{" "}
          <span className="icon-size">
            <Link to="/Masters/CommunicationModeList" title="Back to List">
              <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
            </Link>
          </span>
        </h4>
        <br />
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-4">
                  <b>Communication Mode ID</b>
                </div>
                <div className="col-md-6">
                  <p>{communicationModes.CommunicationModeID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-4">
                  <b>Communication Mode</b>
                </div>
                <div className="col-md-6">
                  <p>{communicationModes.CommunicationMode}</p>
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
                <div className="col-md-6">
                  {communicationModes.IsActive ? <p>Yes</p> : <p>No</p>}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            {canAccessEditCommunicationMode && (
              <div className="col-md-2">
                <Link to={{pathname: "/Masters/EditCommunicationMode",
                    state: communicationModes.CommunicationModeID,
                  }}
                  className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block"
                >
                  Edit
                </Link>
              </div>
            )}
            {canAccessDeleteCommunicationMode && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block" onClick={showPopUp}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <Modal show={communicationModeShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={communicationModeHandleNo} backdrop="static" enforceFocus={false} className="communicationModeDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Communication Mode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Communication Mode?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={communicationModeHandleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={communicationModeHandleNo}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  // #endregion
}
export default ViewCommunicationMode;