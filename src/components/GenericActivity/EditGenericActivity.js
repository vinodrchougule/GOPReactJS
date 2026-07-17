import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import genericActivityService from "../../services/genericActivity.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function EditGenericActivity() {
  //#region State
  const [genericActivityID, setGenericActivityID] = useState(0);
  const [activity, setActivity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }
    fetchGenericActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching selected Generic Activity details
  const fetchGenericActivity = () => {
    const { state } = location; 
    if (!state) {
      history.push("/Masters/GenericActivities");
      return;
    }

    setSpinnerMessage("Please wait while loading Generic Activities...");
    setLoading(true);

    genericActivityService
      .getGenericActivity(state, helper.getUser())
      .then((response) => {
        setGenericActivityID(response.data.GenericActivityID);
        setActivity(response.data.Activity);
        setIsActive(response.data.IsActive);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const trimmedActivity = activity.trim();
    let errors = {};
    let isValidForm = true;

    if (!trimmedActivity) {
      isValidForm = false;
      errors["activityError"] = "Activity is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Save Generic Activity
  const saveEditGenericActivity = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving Generic Activity...");
      setLoading(true);

      const data = {
        GenericActivityID: genericActivityID,
        activity: activity.trim(),
        isActive,
        UserID: helper.getUser(),
      };

      genericActivityService
        .updateGenericActivity(genericActivityID, data)
        .then(() => {
          toast.success("Activity Updated Successfully");
          history.push("/Masters/GenericActivities");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response?.data?.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Reset the Edit Generic Activity page
  const resetEditGenericActivity = () => {
    setFormErrors({});
    fetchGenericActivity();
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
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Generic-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Edit Generic-Activity{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => history.push("/Masters/GenericActivities")} title="Back to Generic-Activity List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
          <div className="col-lg-4 mg-t-15">
              <div className="genericActivityFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Generic Activity ID</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    id="GenericActivityID"
                    value={genericActivityID}
                    onChange={genericActivityID}
                    readOnly
                  />
                </FloatingLabel>
              </div>
            </div>
            
          </div>
          <div className="row row-sm mg-t-20">
            <div className="col-md-4">
              <div className="genericActivityFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Activity</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" id="Activity" name="Activity" maxLength="50" value={activity} onChange={(e) => setActivity(e.target.value)} />
                  {formErrors.formatNameError && (<div className="error-message">{formErrors.formatNameError}</div>)}
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
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}/>
              <span className="slider"></span>
              </label>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Save" onClick={saveEditGenericActivity}>
                Save
              </button>
            </div>
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Reset" onClick={resetEditGenericActivity}>
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

export default EditGenericActivity;
