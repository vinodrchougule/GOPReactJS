import React, { useState, useEffect } from "react";
import communicationModeService from "../../services/communicationMode.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function CreateCommunicationMode(props) {
  //#region State
  const [communicationModeID, setCommunicationModeID] = useState(0);
  const [communicationMode, setCommunicationMode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Initial State
  const initialState = {
    communicationModeID: 0,
    communicationMode: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
    }
  }, [props.history]);
  //#endregion

  //#region Communication Mode Change
  const handleCommunicationModeChange = (e) => {
    setCommunicationMode(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors({});
    }
  };
  //#endregion

  //#region Reset the Create Communication Mode page 
  const resetCreateCommunicationMode = () => {
    setCommunicationModeID(initialState.communicationModeID);
    setCommunicationMode(initialState.communicationMode);
    setIsActive(initialState.isActive);
    setFormErrors(initialState.formErrors);
    setLoading(initialState.loading);
    setSpinnerMessage(initialState.spinnerMessage);
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const trimmedCommunicationMode = communicationMode.trim();
    const errors = {};
    let isValidForm = true;

    if (!trimmedCommunicationMode) {
      isValidForm = false;
      errors["communicationModeError"] = "Communication Mode is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Save Communication Mode
  const saveCreateCommunicationMode = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while adding Communication Mode...");
      setLoading(true);

      const data = {
        communicationModeID,
        communicationMode: communicationMode.trim(),
        isActive,
        UserID: helper.getUser(),
      };

      communicationModeService
        .createCommunicationMode(data)
        .then(() => {
          toast.success("Communication Mode Added Successfully");
          resetCreateCommunicationMode();
          props.history.push({
            pathname: "/Masters/CommunicationModeList",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response?.data?.Message, {autoClose: false,
          });
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
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>
              {spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Communication Mode</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Create Communication Mode{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Communication Mode List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15">
              <div className="projectSubActivityFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Communication Mode</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="CommunicationMode" name="CommunicationMode" value={communicationMode} onChange={handleCommunicationModeChange} />
                  {formErrors.communicationModeError && (
                    <div className="error-message">
                      {formErrors.communicationModeError}
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
                <input type="checkbox" checked={true} readOnly />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveCreateCommunicationMode}>
                Save
              </button>
            </div>
            <div className="col-md-2  mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetCreateCommunicationMode} id="Reset">
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
export default CreateCommunicationMode;