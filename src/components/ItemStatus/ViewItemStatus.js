import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import ItemStatusService from "../../services/itemStatus.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ViewItemStatus() {
  // #region State
  const [itemStatusData, setItemStatus] = useState({
    ItemStatusID: 0,
    Status: "",
    IsActive: true,
  });
  const [itemStatusShowModal, setShowModal] = useState(false);
  const [setCanAccessDeleteItemStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  // #endregion

  //#region Hooks and Navigation
  const history = useHistory();
  const location = useLocation();
  // #endregion

  // #region useEffect Hook
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage();
    fetchItemStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.state]);
  // #endregion

  // #region Fetching Item Status Data
  const fetchItemStatus = () => {
    const { ItemStatusID } = location.state || {};
    if (!ItemStatusID) {
      history.push("/Masters/ItemStatusList");
      return;
    }

    setSpinnerMessage("Please wait while loading Item Status...");
    setLoading(true);

    ItemStatusService.getItemStatus(ItemStatusID, helper.getUser())
      .then((response) => {
        setItemStatus(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  // #endregion

  //#region Fetching View Item Status Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setCanAccessDeleteItemStatus(response.data);
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message, {autoClose: false,
        });
      });
  };
  
  // #endregion

  //#region Show the View Item Status Modal
  const showPopUp = () => {
    setShowModal(true);
  };
  //#endregion

  //#region Delete View Item Status data
  const itemStatusHandleYes = () => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    setSpinnerMessage("Please wait while deleting Item Status...");
    setLoading(true);
    ItemStatusService.deleteItemStatus(itemStatusData.ItemStatusID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("Item Status Deleted Successfully");
        history.push({ pathname: "/Masters/ItemStatusList" });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
        itemStatusHandleNo();
      });
  };
  //#endregion

  //#region Close the Modal
  const itemStatusHandleNo = () => {
    setShowModal(false);
  };
  // #endregion

  // #region Render
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>
              {spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Item Status</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center mg-b-20">
          View Item Status{" "}
          <span className="icon-size">
            <Link to="/Masters/ItemStatusList" title="Back to Item Status List">
              <i className="far fa-arrow-alt-circle-left mg-l-8"></i>
            </Link>
          </span>
        </h4>
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>Item Status ID</b>
                </div>
                <div className="col-md-8">
                  <p>{itemStatusData.ItemStatusID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>Status</b>
                </div>
                <div className="col-md-8">
                  <p>{itemStatusData.Status}</p>
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
                <div className="col-md-8">
                  <p>{itemStatusData.IsActive ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={showPopUp}>
                Delete
              </button>
            </div>
          </div>
         
          <Modal show={itemStatusShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={itemStatusHandleNo} backdrop="static" enforceFocus={false} className="itemStatusDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Item Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure to delete this Item Status?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={itemStatusHandleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={itemStatusHandleNo}>
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
export default ViewItemStatus;