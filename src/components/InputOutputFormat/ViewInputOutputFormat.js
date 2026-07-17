import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import InputOutputFormatService from "../../services/inputOutputFormat.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ViewInputOutputFormat() {
  //#region State
  const [inputOutputFormats, setInputOutputFormats] = useState({
    FormatID: 0,
    Format: "",
    IsActive: true,
  });
  const [inputOutputFormatShowModal, setShowModal] = useState(false);
  const [canAccessEditInputOutputFormat, setCanAccessEditInputOutputFormat] = useState(false);
  const [canAccessDeleteInputOutputFormat, setCanAccessDeleteInputOutputFormat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Hooks and Navigation
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage("Edit Input-Output Format");
    canUserAccessPage("Delete Input-Output Format");
    fetchInputOutputFormat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching selected Input Output Format details
  const fetchInputOutputFormat = () => {
    const { FormatID } = location.state || {}; 
    if (!FormatID) { 
      history.push("/Masters/InputOutputFormats"); 
      return; 
    } 
    setSpinnerMessage("Please wait while loading Input-Output Format...");
    setLoading(true);
    InputOutputFormatService.getInputOutputFormat(FormatID, helper.getUser())
      .then((response) => {
        setInputOutputFormats(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetching View Input Output Format Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Input-Output Format") {
          setCanAccessEditInputOutputFormat(response.data);
        } else if (pageName === "Delete Input-Output Format") {
          setCanAccessDeleteInputOutputFormat(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Show the Modal Popup
  const showPopUp = () => {
    setShowModal(true);
  };
  //#endregion

  //#region Delete Input-Output Format data
  const inputOutputFormatHandleYes = () => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    setSpinnerMessage("Please wait while deleting Input-Output Format...");
    setLoading(true);
    InputOutputFormatService.deleteInputOutputFormat(
      inputOutputFormats.FormatID,
      helper.getUser()
    )
      .then(() => {
        setShowModal(false);
        setLoading(false);
        toast.success("Input Output Format Deleted Successfully");
        history.push({ pathname: "/Masters/InputOutputFormats" });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
        inputOutputFormatHandleNo();
      });
  };
  //#endregion

  //#region Close the Modal
  const inputOutputFormatHandleNo = () => {
    setShowModal(false);
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
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Input / Output Format</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center mg-b-20">
          View Input / Output Format{" "}
          <span className="icon-size">
            <Link to="/Masters/InputOutputFormats" title="Back to Input Output Format List">
              <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
            </Link>
          </span>
        </h4>
        
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-5">
                <div className="col-md-3">
                  <b>Format ID</b>
                </div>
                <div className="col-md-8">
                  <p>{inputOutputFormats.FormatID}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-b-8">
                <div className="col-md-3">
                  <b>Format Name</b>
                </div>
                <div className="col-md-8">
                  <p>{inputOutputFormats.Format}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="row row-sm mg-t-0">
                <div className="col-md-3">
                  <b>Is Active?</b>
                </div>
                <div className="col-md-8">
                  {inputOutputFormats.IsActive === false && <p>No</p>}
                  {inputOutputFormats.IsActive === true && <p>Yes</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="row row-sm mg-t-8">
            {canAccessEditInputOutputFormat && (
              <div className="col-md-2">
                <Link to={{pathname: "/Masters/EditInputOutputFormat",
                    state: inputOutputFormats.FormatID,
                  }}
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                >
                  Edit
                </Link>
              </div>
            )}
            {canAccessDeleteInputOutputFormat && (
              <div className="col-md-2">
                <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={showPopUp}>Delete</button>
              </div>
            )}
          </div>
          <Modal show={inputOutputFormatShowModal} aria-labelledby="contained-modal-title-vcenter" onHide={inputOutputFormatHandleNo} backdrop="static" enforceFocus={false} className="inputOutputFormatsDeleteModal">
            <Modal.Header>
              <Modal.Title>Delete Input-Output Format</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Input-Output Format?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={inputOutputFormatHandleYes}>Yes</Button>
              <Button variant="primary" onClick={inputOutputFormatHandleNo}>No</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ViewInputOutputFormat;
