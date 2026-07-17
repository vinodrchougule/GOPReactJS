import React, { useState, useEffect } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import customerFeedbackTypeService from "../../services/customerFeedbackType.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function ViewCustomerFeedbackType() {
  //#region State and Variables
  const history = useHistory();
  const location = useLocation();

  const [customerFeedbackTypes, setCustomerFeedbackTypes] = useState({
    CustomerFeedbackTypeID: 0,
    FeedbackType: "",
    IsActive: true,
  });
  const [customerFeedbackTypeShowModal, setShowModal] = useState(false);
  const [canAccessEditCustomerFeedbackType, setCanAccessEditCustomerFeedbackType] = useState(false);
  const [canAccessDeleteCustomerFeedbackType, setCanAccessDeleteCustomerFeedbackType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Fetching Customer Feedback Type
  const fetchCustomerFeedbackType = () => {
    const { CustomerFeedbackTypeID } = location.state || {};
    if (!CustomerFeedbackTypeID) {
      history.push("/Masters/CustomerFeedbackTypeList");
      return;
    }
    setSpinnerMessage("Please wait while loading Customer Feedback Type...");
    setLoading(true);
    customerFeedbackTypeService
      .getCustomerFeedbackType(CustomerFeedbackTypeID, helper.getUser())
      .then((response) => {
        setCustomerFeedbackTypes(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetching View Customer Feedback Type Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Customer Feedback Type") {
          setCanAccessEditCustomerFeedbackType(response.data);
        } else if (pageName === "Delete Customer Feedback Type") {
          setCanAccessDeleteCustomerFeedbackType(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Delete Customer Feedback Type data
  const customerFeedbackTypeHandleYes = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    setSpinnerMessage("Please wait while deleting Customer Feedback Type...");
    setLoading(true);

    customerFeedbackTypeService
      .deleteCustomerFeedbackType(customerFeedbackTypes.CustomerFeedbackTypeID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("Customer Feedback Type Deleted Successfully");
        history.push("/Masters/CustomerFeedbackTypeList");
      })
      .catch((e) => {
        setShowModal(false);
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Close the Customer Feedback Type Modal
  const customerFeedbackTypeHandleNo = () => setShowModal(false);
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    canUserAccessPage("Edit Customer Feedback Type");
    canUserAccessPage("Delete Customer Feedback Type");
    fetchCustomerFeedbackType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  const { CustomerFeedbackTypeID, FeedbackType, IsActive } = customerFeedbackTypes;

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
          <span>Customer Feedback Types</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center mg-b-5">
          View Customer Feedback Type{" "}
          <span className="icon-size">
            <Link to="/Masters/CustomerFeedbackTypeList" title="Back to Customer Feedback Type List">
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
                  <b>Customer Feedback Type ID</b>
                </div>
                <div className="col-md-6">
                  <p>{CustomerFeedbackTypeID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm">
                <div className="col-md-4">
                  <b>Feedback Type</b>
                </div>
                <div className="col-md-6">
                  <p>{FeedbackType}</p>
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
                  {IsActive ? <p>Yes</p> : <p>No</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="row row-sm">
            {canAccessEditCustomerFeedbackType && (
              <div className="col-md-2">
                <Link to={{pathname: "/Masters/EditCustomerFeedbackType",
                    state: CustomerFeedbackTypeID,
                  }}
                  className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block"
                >
                  Edit
                </Link>
              </div>
            )}
            {canAccessDeleteCustomerFeedbackType && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block" onClick={() => setShowModal(true)}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <Modal show={customerFeedbackTypeShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={customerFeedbackTypeHandleNo} backdrop="static" enforceFocus={false} className="customerFeedbackTypeDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Customer Feedback Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Customer Feedback Type?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={customerFeedbackTypeHandleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={customerFeedbackTypeHandleNo}>
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
export default ViewCustomerFeedbackType;