import React, { useState, useEffect } from "react";
import communicationModeService from "../../services/communicationMode.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function EditCommunicationMode(props) {
  //#region State
  const [communicationModeID, setCommunicationModeID] = useState(0);
  const [communicationMode, setCommunicationMode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region UseEffect Hook
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push("/");
      return;
    }
    fetchCommunicationMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching Communication Mode details
  const fetchCommunicationMode = () => {
    const { state } = props.location;
    if (!state) {
      props.history.push("/Masters/CommunicationModeList");
      return;
    }

    setSpinnerMessage("Please wait while loading Communication Mode...");
    setLoading(true);

    communicationModeService
      .getCommunicationMode(state, helper.getUser())
      .then((response) => {
        setCommunicationModeID(response.data.CommunicationModeID);
        setCommunicationMode(response.data.CommunicationMode);
        setIsActive(response.data.IsActive);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Save Communication Mode
  const saveEditCommunicationMode = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      props.history.push("/");
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving Communication Mode...");
      setLoading(true);

      const data = {
        CommunicationModeID: communicationModeID,
        CommunicationMode: communicationMode.trim(),
        isActive: isActive,
        UserID: helper.getUser(),
      };

      communicationModeService
        .updateCommunicationMode(communicationModeID, data)
        .then(() => {
          toast.success("Communication Mode Updated Successfully");
          props.history.push("/Masters/CommunicationModeList");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const trimmedMode = communicationMode.trim();
    let errors = {};
    let isValidForm = true;

    if (!trimmedMode) {
      isValidForm = false;
      errors["communicationModeError"] = "Communication Mode is required";
    }
    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Reset the Edit Communication Mode page
  const resetEditCommunicationMode = () => {
    fetchCommunicationMode();
    setFormErrors({});
  };
  //#endregion

  //#region Redirect to Communication Mode List Page
  const moveToCommunicationModeList = () => {
    props.history.push("/Masters/CommunicationModeList");
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
          <span>Communication Mode List</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Edit Communication Mode{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={moveToCommunicationModeList} title="Back to Communication Mode List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15">
              <div className="communicationModeFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Communication Mode ID</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    id="CommunicationModeID"
                    value={communicationModeID}
                    onChange={communicationModeID}
                    readOnly
                  />
                </FloatingLabel>
              </div>
            </div>
          </div>
          <div className="row row-sm mg-t-20">
            <div className="col-md-4">
              <div className="communicationModeFloatingInputEdit">
                <FloatingLabel
                  label={
                    <>
                      <b>Communication Mode</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" id="CommunicationMode" name="CommunicationMode" maxLength="50" value={communicationMode}
                    onChange={(e) => {
                      setCommunicationMode(e.target.value);
                      if (e.target.value !== "") setFormErrors({});
                    }}
                  />
                  {formErrors.communicationModeError && (
                    <div className="error-message">
                      {formErrors.communicationModeError}
                    </div>
                  )}
                </FloatingLabel>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm mg-t-10">
            <div className="col-md-3">
              <label>
                <b>Is Active?</b>
              </label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" value={isActive} checked={isActive} id="IsActive" onChange={(e) => setIsActive(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Save" onClick={saveEditCommunicationMode}>
                Save
              </button>
            </div>
            <div className="col-md-2">
              <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Reset" onClick={resetEditCommunicationMode}>
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
export default EditCommunicationMode;