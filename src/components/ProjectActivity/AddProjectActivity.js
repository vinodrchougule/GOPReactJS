import React, { useEffect, useState } from "react";
import helpers from "../../helpers/helpers";
import { useHistory } from "react-router-dom";
import projectActivityService from "../../services/projectActivity.service";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
// import { TextField } from "@mui/material";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function AddProjectActivity() {
  let history = useHistory();
  const [initStates, setInitStates] = useState({
    activityID: 0,
    activity: "",
    isActive: true,
    formErrors: "",
    loading: false,
    spinnerMessage: "",
  });

  //#region Use effect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const activity = initStates.activity.trim();
    let formErrors = "";
    let isValidForm = true;

    //activity
    if (!activity) {
      isValidForm = false;
      formErrors = "Activity is required.";
    }
    setInitStates((prevState) => ({ ...prevState, formErrors: formErrors }));
    return isValidForm;
  };
  //#endregion

  //#region Bind control value to state variable
  const onChangeActivity = (e) => {
    setInitStates((prevState) => ({ ...prevState, activity: e.target.value }));
    if (e.target.value !== "" || e.target.value !== null)
      setInitStates((prevState) => ({ ...prevState, formErrors: "" }));
  };
  //#endregion

  // //#region get IsActive value
  // const onChangeIsActive = (e) => {
  //   setInitStates((prevState) => ({ ...prevState, isActive: e.target.checked }));
  // };
  // //#endregion

  //#region Reset the page
  const reset = () => {
    setInitStates({
      activityID: 0,
      activity: "",
      isActive: true,
      formErrors: "",
      loading: false,
      spinnerMessage: "",
    });
  };
  //#endregion

  //#region Save Project Activity
  const saveProjectActivity = (e) => {
    e.preventDefault();

    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setInitStates((prevState) => ({
        ...prevState,
        spinnerMessage: "Please wait while adding Project Activity...",
        loading: true,
      }));

      //Bind state data to object
      var data = {
        activityID: initStates.activityID,
        activity: initStates.activity.trim(),
        isActive: initStates.isActive,
        UserID: helpers.getUser(),
      };

      //Service call
      projectActivityService
        .createProjectActivity(data)
        .then(() => {
          toast.success("Activity Added Successfully");
          reset();
          history.push({
            pathname: "/Masters/ProjectActivities",
          });
        })
        .catch((error) => {
          setInitStates((prevState) => ({ ...prevState, loading: false }));
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initStates.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader
              css={helpers.getcss()}
              color={"#38D643"}
              width={"350px"}
              height={"10px"}
              speedMultiplier={0.3}
            />
            <p style={{ color: "black", marginTop: "5px" }}>
              {initStates.spinnerMessage}
            </p>
          </div>
        }
      >
        <div
          style={{ height: "100%", position: "relative" }}
        >
          <div className="az-content-breadcrumb mg-l-10">
            <span>Master</span>
            <span>Project-Activities</span>
          </div>
          <h4 className="d-flex align-items-center mg-l-10">
            Create Project-Activity{" "}
            <span className="icon-size">
              <i
                className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                onClick={() => history.goBack()}
                title="Back to List"
              ></i>
            </span>
          </h4>
          <div>
            <div className="row row-sm">
            <div className="col-lg-4 mg-t-15 mg-b-5">
                <div className="addCustomerFloatingInput">
                  <FloatingLabel
                    label={
                      <>
                        <b>Activity</b> <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input 
                      type="text" 
                      className="form-control" 
                      maxLength={50}
                      id="Activity" 
                      value={initStates.activity}
                      onChange={onChangeActivity}
                    />
                    {initStates.formErrors && (
                      <div className="error-message">{initStates.formErrors}</div>
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
                  <input type="checkbox" value={initStates.isActive} checked={initStates.isActive} id="IsActive" readOnly/>
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <br />
            <div className="row row-sm">
              <div className="col-md-2 mg-t-10 mg-lg-t-0">
                <button
                  id="Save"
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  tabIndex="4"
                  onClick={saveProjectActivity}
                >
                  Save
                </button>
              </div>
              <div className="col-md-2  mg-t-10 mg-lg-t-0">
                <button
                  className="btn btn-gray-700 btn-block"
                  tabIndex="5"
                  onClick={reset}
                  id="Reset"
                >
                  Reset
                </button>
              </div>
            </div>
            <br />
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
}
export default AddProjectActivity;
