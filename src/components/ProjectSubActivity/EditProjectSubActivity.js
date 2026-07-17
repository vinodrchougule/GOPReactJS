import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom"; // Updated for React Router v5
import projectSubActivityService from "../../services/projectSubActivity.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function EditProjectSubActivity() {
  //#region State
  const [subActivityID, setSubActivityID] = useState(0);
  const [subActivity, setSubActivity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Hooks and navigation
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Use effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }
    fetchProjectSubActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching selected Edit Project Sub Activity details
  const fetchProjectSubActivity = () => {
    const state = location.state;
    if (!state) {
      history.push("/Masters/ProjectSubActivities");
      return;
    }
    setSpinnerMessage("Please wait while loading Project Sub Activities...");
    setLoading(true);

    projectSubActivityService
      .getProjectSubActivity(state, helper.getUser())
      .then((response) => {
        setSubActivityID(response.data.ProjectSubActivityID);
        setSubActivity(response.data.SubActivity);
        setIsActive(response.data.IsActive);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const subActivityTrimmed = subActivity.trim();
    let errors = {};
    let isValidForm = true;

    if (!subActivityTrimmed) {
      isValidForm = false;
      errors["subActivityError"] = "Sub Activity is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Redirect to Project Sub Activity List Page
  const moveToSubActivityList = () => {
    history.push("/Masters/ProjectSubActivities");
  };
  //#endregion

  //#region On Change Sub Activity
  const onChangeSubActivity = (e) => {
    setSubActivity(e.target.value);
    if (e.target.value !== "") setFormErrors({});
  };
  //#endregion

  //#region get IsActive value
  const onChangeIsActive = (e) => {
    setIsActive(e.target.checked);
  };
  //#endregion

  //#region Reset the Edit Project Sub Activity page
  const resetEditProjectSubActivity = () => {
    fetchProjectSubActivity();
    setFormErrors({});
  };
  //#endregion

  //#region Save Project Sub Activity
  const saveEditProjectSubActivity = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while editing the Project Sub-Activity...");
      setLoading(true);

      const data = {
        ProjectSubActivityID: subActivityID,
        SubActivity: subActivity.trim(),
        IsActive: isActive,
        UserID: helper.getUser(),
      };

      projectSubActivityService
        .updateProjectSubActivity(subActivityID, data)
        .then(() => {
          toast.success("Sub Activity Updated Successfully");
          moveToSubActivityList();
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
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
          <span>Sub-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Edit Project Sub-Activity{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={moveToSubActivityList} title="Back to Project Sub-Activity List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15">
              <div className="inputOutputFormatFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Project Sub-Activity ID</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    id="FormatID"
                    value={subActivityID}
                    onChange={subActivityID}
                    readOnly
                  />
                </FloatingLabel>
              </div>
            </div>

          </div>
          <div className="row row-sm mg-t-20">
            <div className="col-md-4">
              <div className="projectSubActivityFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Sub-Activity</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" id="SubActivity" name="SubActivity" maxLength="50" value={subActivity} onChange={onChangeSubActivity} />
                  {formErrors.subActivityError && (
                    <div className="error-message">{formErrors.subActivityError}</div>
                  )}
                </FloatingLabel>
              </div>
            </div>
          </div>

          <div className="row row-sm mg-t-20">
            <div className="col-md-3">
              <label>
                <b>Is Active?</b>
              </label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" checked={isActive} id="IsActive" onChange={onChangeIsActive} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="row row-sm mg-t-10">
            <div className="col-md-2">
              <button className="btn btn-gray-700 btn-block" id="Save" onClick={saveEditProjectSubActivity}>
                Save
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-gray-700 btn-block" id="Reset" onClick={resetEditProjectSubActivity}>
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
export default EditProjectSubActivity;