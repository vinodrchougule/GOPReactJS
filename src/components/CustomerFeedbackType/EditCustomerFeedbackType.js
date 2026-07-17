import React, { useState, useEffect } from "react";
import customerFeedbackTypeService from "../../services/customerFeedbackType.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function EditCustomerFeedbackType(props) {
  //#region State
  const [customerFeedbackTypeID, setCustomerFeedbackTypeID] = useState(0);
  const [feedbackType, setFeedbackType] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region UseEffect Hook
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({ pathname: "/" });
      return;
    }
    fetchCustomerFeedbackType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching Customer Feedback Type details
  const fetchCustomerFeedbackType = () => {
    const { state } = props.location;
    if (!state) {
      props.history.push("/Masters/CustomerFeedbackTypeList");
      return;
    }

    setSpinnerMessage("Please wait while loading Customer Feedback Type...");
    setLoading(true);

    customerFeedbackTypeService
      .getCustomerFeedbackType(state, helper.getUser())
      .then((response) => {
        setCustomerFeedbackTypeID(response.data.CustomerFeedbackTypeID);
        setFeedbackType(response.data.FeedbackType);
        setIsActive(response.data.IsActive);
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

  //#region Feedback Type Change
  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
    if (e.target.value) setFormErrors({});
  };
  //#endregion

  //#region Is Active Change
  const handleIsActiveChange = (e) => {
    setIsActive(e.target.checked);
  };
  //#endregion

  //#region Save Edit Customer Feedback Type
  const saveEditCustomerFeedbackType = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      props.history.push({ pathname: "/" });
      return;
    }

    if (validateForm()) {
      setSpinnerMessage("Please wait while saving Customer Feedback Type...");
      setLoading(true);

      const data = {
        CustomerFeedbackTypeID: customerFeedbackTypeID,
        FeedbackType: feedbackType.trim(),
        isActive,
        UserID: helper.getUser(),
      };

      customerFeedbackTypeService
        .updateCustomerFeedbackType(customerFeedbackTypeID, data)
        .then(() => {
          toast.success("Customer Feedback Type Updated Successfully");
          props.history.push("/Masters/CustomerFeedbackTypeList");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response?.data?.Message, {
            autoClose: false,
          });
        });
    }
  };
  //#endregion

  //#region  Validating the input data
  const validateForm = () => {
    const feedbackTypeTrimmed = feedbackType.trim();
    let isValidForm = true;
    let errors = {};

    if (!feedbackTypeTrimmed) {
      isValidForm = false;
      errors.feedbackTypeError = "Feedback Type is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Reset Edit Customer Feedback Type page
  const resetEditCustomerFeedbackType = () => {
    setFormErrors({});
    fetchCustomerFeedbackType();
  };
  //#endregion

  //#region Redirect to Customer Feedback Type List Page
  const moveToCustomerFeedbackTypeList = () => {
    props.history.push("/Masters/CustomerFeedbackTypeList");
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
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Customer Feedback Types</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Edit Customer Feedback Type{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={moveToCustomerFeedbackTypeList} title="Back to Customer Feedback Type List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15">
              <div className="customerFeedbackTypeFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Customer Feedback Type ID</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    id="CustomerFeedbackTypeID"
                    value={customerFeedbackTypeID}
                    onChange={customerFeedbackTypeID}
                    readOnly
                  />
                </FloatingLabel>
              </div>
            </div>

          </div>
          <div className="row row-sm mg-t-20">
            <div className="col-md-4">
              <div className="customerFeedbackTypeFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Customer Feedback Type</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" id="FeedbackType" name="FeedbackType" maxLength="50" value={feedbackType} onChange={handleFeedbackTypeChange}
                  />
                  {formErrors.feedbackTypeError && (
                    <div className="error-message">
                      {formErrors.feedbackTypeError}
                    </div>
                  )}
                </FloatingLabel>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-3">
              <label>
                <b>Is Active?</b>
              </label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" value={isActive} checked={isActive} id="IsActive" onChange={handleIsActiveChange} />
                <span className="slider"></span>
              </label>

            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Save" onClick={saveEditCustomerFeedbackType}>
                Save
              </button>
            </div>
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Reset" onClick={resetEditCustomerFeedbackType}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};
export default EditCustomerFeedbackType;