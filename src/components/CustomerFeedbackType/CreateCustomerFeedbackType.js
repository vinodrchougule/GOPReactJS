import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import customerFeedbackTypeService from "../../services/customerFeedbackType.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function CreateCustomerFeedbackType() {
  const history = useHistory();

  //#region State
  const [customerFeedbackTypeID, setCustomerFeedbackTypeID] = useState(0);
  const [feedbackType, setFeedbackType] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Initial State
  const initialState = {
    customerFeedbackTypeID: 0,
    feedbackType: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
    }
  }, [history]);
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const trimmedFeedbackType = feedbackType.trim();
    let errors = {};
    let isValid = true;

    if (!trimmedFeedbackType) {
      isValid = false;
      errors["customerFeedbackTypeError"] = "Feedback Type is required";
    }

    setFormErrors(errors);
    return isValid;
  };
  //#endregion

  //#region Save Create Customer Feedback Type
  const saveCreateCustomerFeedbackType = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while adding Customer Feedback Type...");
      setLoading(true);

      const data = {
        customerFeedbackTypeID,
        feedbackType: feedbackType.trim(),
        isActive,
        UserID: helper.getUser(),
      };

      customerFeedbackTypeService
        .createCustomerFeedbackType(data)
        .then(() => {
          toast.success("Customer Feedback Type Added Successfully");
          resetCreateCustomerFeedbackType();
          history.push("/Masters/CustomerFeedbackTypeList");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Reset Create Customer Feedback Type
  const resetCreateCustomerFeedbackType = () => {
    setCustomerFeedbackTypeID(initialState.customerFeedbackTypeID);
    setFeedbackType(initialState.feedbackType);
    setIsActive(initialState.isActive);
    setFormErrors(initialState.formErrors);
    setLoading(initialState.loading);
    setSpinnerMessage(initialState.spinnerMessage);
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
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>
              {spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Customer Feedback Type</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Create Customer Feedback Type{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => history.goBack()} title="Back to Customer Feedback Type List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-10">
              <div className="customerFeedbackTypeFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Customer Feedback Type</b>{" "}
                      <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="FeedbackType" name="FeedbackType" value={feedbackType}
                    onChange={(e) => {
                      setFeedbackType(e.target.value);
                      if (e.target.value !== "") setFormErrors({});
                    }}
                  />
                  {formErrors.customerFeedbackTypeError && (
                    <div className="error-message">
                      {formErrors.customerFeedbackTypeError}
                    </div>
                  )}
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2">
              <label>
                <b>Is Active?</b>
              </label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" checked={isActive} id="IsActive" readOnly/>
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveCreateCustomerFeedbackType}>
                Save
              </button>
            </div>
            <div className="col-md-2  mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetCreateCustomerFeedbackType} id="Reset">
                Reset
              </button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
}
//#endregion
export default CreateCustomerFeedbackType;