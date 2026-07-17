import React, { useState, useEffect, useCallback } from "react";
import ItemStatusService from "../../services/itemStatus.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function AddItemStatus(props) {
  //#region State
  const [itemStatusID, setItemStatusID] = useState(0);
  const [status, setStatus] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Initial State
  const initialState = {
    itemStatusID: 0,
    status: "",
    isActive: true,
    formErrors: {},
    loading: false,
    spinnerMessage: "",
  };
  //#endregion

  //#region Reset the Add Item Status page
  const resetItemStatus = () => {
    setItemStatusID(initialState.itemStatusID);
    setStatus(initialState.status);
    setIsActive(initialState.isActive);
    setFormErrors(initialState.formErrors);
    setLoading(initialState.loading);
    setSpinnerMessage(initialState.spinnerMessage);
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const trimmedStatus = status.trim();
    let errors = {};
    let isValidForm = true;
    if (!trimmedStatus) {
      isValidForm = false;
      errors["statusError"] = "Status is required";
    }
    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region On Change Item Status
  const onChangeItemStatus = (e) => {
    setStatus(e.target.value);
    if (e.target.value !== "") {
      setFormErrors({});
    }
  };
  //#endregion

  //#region Save Item Status
  const saveItemStatus = useCallback(() => {
    if (!helper.getUser()) {
      props.history.push({ pathname: "/" });
      return;
    }
    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while adding Item Status...");
      setLoading(true);
      const data = {
        ItemStatusID: itemStatusID,
        Status: status.trim(),
        IsActive: isActive,
        UserID: helper.getUser(),
      };
      ItemStatusService.createItemStatus(data)
        .then(() => {
          toast.success("Item Status Added Successfully");
          resetItemStatus();
          props.history.push({ pathname: "/Masters/ItemStatusList" });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemStatusID, status, isActive, props.history]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({ pathname: "/" });
    }
  }, [props.history]);
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
          <span>Item Status</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Create Item Status{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Item Status List"></i>
          </span>
        </h4>
        <div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15">
              <div className="inputStatusFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>Status</b> <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select"
                >
                  <input type="text" className="form-control" maxLength="50" id="itemStatus" value={status} onChange={onChangeItemStatus}/>
                  {formErrors.statusError && (
                    <div className="error-message">{formErrors.statusError}</div>
                  )}
                </FloatingLabel>
              </div>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2">
              <label><b>Is Active?</b></label>
            </div>
            <div className="col-md-5 mg-t-5">
              <label className="switch">
                <input type="checkbox" checked={true} id="IsActive" value={isActive} readOnly/>
                <span className="slider"></span>
              </label>
            </div>
            <div className="col-lg mg-t-10 mg-lg-t-0"></div>
          </div>
          <br />
          <div className="row row-sm">
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={saveItemStatus}>
                Save
              </button>
            </div>
            <div className="col-md-2 mg-t-10 mg-lg-t-0">
              <button className="btn btn-gray-700 btn-block" onClick={resetItemStatus} id="Reset">
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
export default AddItemStatus;