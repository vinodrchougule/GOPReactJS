import React, { useState, useEffect } from "react";
import InputOutputFormatService from "../../services/inputOutputFormat.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function AddInputOutputFormat(props) {
  //#region Initial State
  const initialState = {
    formatID: 0,
    formatName: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region State and Hooks
  const [state, setState] = useState(initialState);
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
    }
  }, [props.history]);
  //#endregion

  //#region Validating the Input data
  const handleFormValidation = () => {
    const formatName = state.formatName.trim();
    let formErrors = {};
    let isValidForm = true;
    if (!formatName) {
      isValidForm = false;
      formErrors["formatNameError"] = "Format Name is required";
    }
    setState((prevState) => ({
      ...prevState,
      formErrors: formErrors,
    }));
    return isValidForm;
  };
  //#endregion

  //#region On Change Format Name
  const onChangeFormatName = (e) => {
    setState((prevState) => ({
      ...prevState,
      formatName: e.target.value,
      formErrors: {},
    }));
  };
  //#endregion

  //#region Save Input Output Format
  const saveAddInputOutputFormat = (e) => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    if (handleFormValidation()) {
      setState((prevState) => ({
        ...prevState,
        spinnerMessage: "Please wait while saving Input-Output Format...",
        loading: true,
      }));
      const data = {
        FormatID: state.formatID,
        Format: state.formatName.trim(),
        IsActive: state.isActive,
        UserID: helper.getUser(),
      };
      InputOutputFormatService.createInputOutputFormat(data)
        .then(() => {
          toast.success("Input Output Format Added Successfully");
          setState(initialState);
          props.history.push({
            pathname: "/Masters/InputOutputFormats",
          });
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
          toast.error(error.response?.data?.Message, { autoClose: false, });
        });
    }
  };
  //#endregion

  //#region Reset the Add Input Output Format page
  const resetAddInputOutputFormat = () => {
    setState(initialState);
  };
  //#endregion

  const { formatNameError } = state.formErrors;

  //#region Return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={state.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>{state.spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Input / Output Format</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Create Input / Output Format{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Input Output Format List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm mg-t-15">
            <div className="col-lg-4">
              <div className="inputOutputFormatFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Format Name</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="FormatName" value={state.formatName} onChange={onChangeFormatName} />
                  {formatNameError && (<div className="error-message">{formatNameError}</div>)}
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <div className="row row-sm mg-t-20">
            <div className="col-md-2">
              <label>
                <b>Is Active?</b>
              </label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" checked={true} id="IsActive" readOnly/>
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="row row-sm mg-t-20">
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveAddInputOutputFormat}>Save</button>
            </div>
            <div className="col-md-2  mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetAddInputOutputFormat} id="Reset">Reset</button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default AddInputOutputFormat;
