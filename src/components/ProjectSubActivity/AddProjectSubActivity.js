import React, { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import projectSubActivityService from "../../services/projectSubActivity.service";
import helper from "../../helpers/helpers";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function AddProjectSubActivity() {
  const history = useHistory();

  //#region State variables
  const [subActivityID, setSubActivityID] = useState(0);
  const [subActivity, setSubActivity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Initial state
  const initialState = {
    subActivityID: 0,
    subActivity: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region Use effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
    }
  }, [history]);
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    let errors = {};
    let isValidForm = true;
  
    // Sub Activity validation
    if (!subActivity.trim()) {
      isValidForm = false;
      errors["subActivityError"] = "Sub Activity is required";
    }
  
    setFormErrors(errors);
    return isValidForm;
  };
  
  //#endregion

  //#region Save Project Sub Activity
  const saveAddProjectSubActivity = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while adding Project Sub-Activity...");
      setLoading(true);

      const data = {
        SubActivityID: subActivityID,
        SubActivity: subActivity.trim(),
        IsActive: isActive,
        UserID: helper.getUser(),
      };

      projectSubActivityService
        .createProjectSubActivity(data)
        .then(() => {
          toast.success("Sub Activity Added Successfully");
          resetAddProjectSubActivity(); 
          history.push("/Masters/ProjectSubActivities");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Reset the Add Project Sub Activity page
  const resetAddProjectSubActivity = () => {
    setSubActivityID(initialState.subActivityID);
    setSubActivity(initialState.subActivity);
    setIsActive(initialState.isActive);
    setFormErrors(initialState.formErrors);
    setLoading(initialState.loading);
    setSpinnerMessage(initialState.spinnerMessage);
  };
  //#endregion

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
        <h4 className="mg-l-10 d-flex align-items-center">
          Create Project Sub-Activity{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => history.goBack()} title="Back to Project Sub-Activity List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15">
              <div className="projectSubActivityFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Sub-Activity</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="SubSubActivity" value={subActivity}
                    onChange={(e) => {
                      setSubActivity(e.target.value);
                      if (e.target.value !== "") setFormErrors({});
                    }}
                  />
                  {formErrors.subActivityError && (
                    <div className="error-message">{formErrors.subActivityError}</div>
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
                <input type="checkbox" checked={true} id="chkVendorNameToShort" readOnly/>
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveAddProjectSubActivity}>
                Save
              </button>
            </div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetAddProjectSubActivity} id="Reset">
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
export default AddProjectSubActivity;