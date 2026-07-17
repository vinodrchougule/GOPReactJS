import React, { useEffect, useState } from 'react'
import helpers from '../../helpers/helpers';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import projectActivityService from '../../services/projectActivity.service';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function EditProjectActivity() {

  let history = useHistory();
  const location = useLocation();

  const [initialState, setInitialState] = useState({
    activityID: 0,
    activity: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  })

  const resetInitial = () => {
    setInitialState({
      activityID: 0,
      activity: "",
      isActive: true,
      formErrors: {},
      loading: false,
      spinnerMessage: "",
    })
  }

  //#region Page render
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    fetchProjectActivity();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  //#region Fetching selected Project Activity details
  const fetchProjectActivity = () => {
    const { state } = location; 
    if (state === 0 || state === null || state === undefined) {
      history.push("/Masters/ProjectActivities");
      return;
    }

    setInitialState((prevState) => ({...prevState,
      spinnerMessage: "Please wait while loading Project Activities...",
      loading: true,
    }));

    projectActivityService
      .getProjectActivity(state, helpers.getUser())
      .then((response) => {
        setInitialState((prevState) => ({...prevState,
          activityID: response.data.ProjectActivityID,
          activity: response.data.Activity,
          isActive: response.data.IsActive,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitialState((prevState) => ({...prevState, loading: false }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const activity = initialState.activity.trim();
    let formErrors = {};
    let isValidForm = true;

    //activity
    if (!activity) {
      isValidForm = false;
      formErrors["activityError"] = "Activity is required";
    }

    setInitialState((prevState) => ({...prevState, formErrors: formErrors }));
    return isValidForm;
  }
  //#endregion

  //#region Bind control value to state variable
  const onChangeActivity = (e) => {
    setInitialState((prevState) => ({...prevState,
      activity: e.target.value,
    }));

    if (e.target.value !== "" || e.target.value !== null)
    setInitialState((prevState) => ({...prevState, formErrors: {} }));
  }
  //#endregion

  //#region get IsActive value
  const onChangeIsActive = (e) => {
    setInitialState((prevState) => ({...prevState,
      isActive: e.target.checked,
    }));
  }
  //#endregion

  //#region Redirect to Project Activity List Page
  const moveToActivityList = (e) => {
    history.push("/Masters/ProjectActivities");
  };
  //#endregion

  //#region Reset the page
  const reset = () => {
    setInitialState((prevState) => ({...prevState,
      formErrors: {},
    }));
    fetchProjectActivity();
  }
  //#endregion

  //#region Save Project Activity
  const saveProjectActivity = (e) => {
    e.preventDefault(); //cancels the event if it is cancelable,
    //meaning that the default action that belongs to the event will not occur.

    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setInitialState((prevState) => ({...prevState,
        spinnerMessage: "Please wait while saving Project Activity...",
        loading: true,
      }));

      //Bind state data to object
      var data = {
        ProjectActivityID: initialState.activityID,
        activity: initialState.activity.trim(),
        isActive: initialState.isActive,
        UserID: helpers.getUser(),
      };

      //Service call
      projectActivityService
        .updateProjectActivity(initialState.activityID, data)
        .then((response) => {
          toast.success("Activity Updated Successfully");
          resetInitial()
          history.push({
            pathname: "/Masters/ProjectActivities",
          });
        })
        .catch((error) => {
          setInitialState((prevState) => ({...prevState,
            loading: false,
          }));
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  const { activityError } = initialState.formErrors;

  //#region Return
  return (
    <div className="pro-main-display">
        <LoadingOverlay
          active={initialState.loading}
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
                {initialState.spinnerMessage}
              </p>
            </div>
          }
        >
          <div style={{height: "100%", position: "relative"}}>
          <div className="az-content-breadcrumb mg-l-10">
            <span>Master</span>
            <span>Project-Activities</span>
          </div>
          <h4 className="mg-l-10 d-flex align-items-center">
            Edit Project-Activity{" "}
            <span className="icon-size">
              <i
                className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                onClick={moveToActivityList}
                title="Back to List"
                tabIndex="1"
              ></i>
            </span>
          </h4>
          <div>
            <div className="row row-sm">
            
              <div className="col-lg-4 mg-t-15">
                <div className="editCustomerFloatingInput">
                  <FloatingLabel
                    label={
                      <>
                        <b>Project Activity ID</b> <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="SubSubActivity"
                      value={initialState.activityID}
                      onChange={onChangeActivity}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0"></div>
            </div>
            <div className="row row-sm">
            <div className="col-lg-4 mg-t-20">
                <div className="editCustomerFloatingInput">
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
                      id="SubSubActivity"
                      value={initialState.activity}
                      onChange={onChangeActivity}
                    />
                    {activityError && (
                      <div className="error-message">{activityError}</div>
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
                  <input
                      type="checkbox"
                      name="IsToIncludeVendorNameInShortDesc"
                      checked={initialState.isActive}
                      id="chkVendorNameToShort"
                      onChange={onChangeIsActive}
                  />
                  <span className="slider"></span>
              </label>
              </div>
            </div>
            <br />
            <div className="row row-sm">
              <div className="col-md-2">
                <button
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  tabIndex="4"
                  id="Save"
                  onClick={saveProjectActivity}
                >
                  Save
                </button>
              </div>
              <div className="col-md-2">
                <button
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  tabIndex="5"
                  id="Reset"
                  onClick={reset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          </div>
        </LoadingOverlay>
      </div>
  )
  //#endregion
}

export default EditProjectActivity
