import React, { useState, useEffect } from "react";
import genericActivityService from "../../services/genericActivity.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function CreateGenericActivity(props) {
  //#region State
  const [genericActivityID, setGenericActivityID] = useState(0);
  const [activity, setActivity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Initial State
  const initialState = {
    genericActivityID: 0,
    activity: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push("/");
    }
  }, [props.history]);
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    let errors = {};
    let isValidForm = true;

    if (!activity.trim()) {
      isValidForm = false;
      errors["activityError"] = "Activity is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Save Generic Activity
  const saveCreateGenericActivity = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      props.history.push("/");
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving Generic Activity...");
      setLoading(true);

      const data = {
        genericActivityID,
        activity: activity.trim(),
        isActive,
        UserID: helper.getUser(),
      };

      genericActivityService
        .createGenericActivity(data)
        .then(() => {
          toast.success("Generic Activity Added Successfully");
          resetCreateGenericActivity();
          props.history.push("/Masters/GenericActivities");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            error.response?.data?.Message,
            { autoClose: false }
          );
        });
    }
  };
  //#endregion

  //#region Reset the Create Generic Activity page
  const resetCreateGenericActivity = () => {
    setGenericActivityID(initialState.genericActivityID);
    setActivity(initialState.activity);
    setIsActive(initialState.isActive);
    setFormErrors(initialState.formErrors);
    setLoading(initialState.loading);
    setSpinnerMessage(initialState.spinnerMessage);
  };
  //#endregion

  //#region On Change Generic Activity
  const onChangeGenericActivity = (e) => {
    const { value } = e.target;
    setActivity(value);

    if (value.trim() !== "") {
      setFormErrors((prevErrors) => {
        const { activityError, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  //#endregion

  //#region Render
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
          <span>Generic-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Create Generic-Activity{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Generic-Activity List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-10">
              <div className="genericActivityFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Activity</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="Activity" name="Activity" value={activity} onChange={onChangeGenericActivity}/>
                  {formErrors.activityError && (
                    <div className="error-message">{formErrors.activityError}</div>
                  )}
                </FloatingLabel>
              </div>
            </div>
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
            <div className="col-md-2 mg-t-10">
              <button id="Save" className="btn btn-gray-700 btn-block" onClick={saveCreateGenericActivity}>
                Save
              </button>
            </div>
            <div className="col-md-2 mg-t-10">
              <button className="btn btn-gray-700 btn-block" onClick={resetCreateGenericActivity} id="Reset">
                Reset
              </button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default CreateGenericActivity;
