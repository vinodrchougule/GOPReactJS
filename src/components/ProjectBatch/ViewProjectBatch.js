import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import projectBatchService from "../../services/projectBatch.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import Moment from "moment";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function ViewProjectBatch () {

  //#region State management using useState hook
  const history = useHistory();
  const location = useLocation();
  const [projectID, setProjectID] = useState(null);
  const [projectBatchID, setProjectBatchID] = useState(null);
  const [customerCode, setCustomerCode] = useState(null);
  const [projectCode, setProjectCode] = useState(null);
  const [batchNo, setBatchNo] = useState(null);
  const [scope, setScope] = useState(null);
  const [inputCount, setInputCount] = useState(null);
  const [inputCountType, setInputCountType] = useState(null);
  const [receivedDate, setReceivedDate] = useState(null);
  const [receivedFormat, setReceivedFormat] = useState(null);
  const [outputFormat, setOutputFormat] = useState(null);
  const [plannedStartDate, setPlannedStartDate] = useState(null);
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [customerInputFileName, setCustomerInputFileName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [canAccessEditProjectBatch, setCanAccessEditProjectBatch] = useState(false);
  const [canAccessDeleteProjectBatch, setCanAccessDeleteProjectBatch] = useState(false);
  const [canAccessChangeBatchNo, setCanAccessChangeBatchNo] = useState(false);
  const [showChangeBatchNoModal, setShowChangeBatchNoModal] = useState(false);
  const [changedBatchNo, setChangedBatchNo] = useState("");
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [deliveredDate, setDeliveredDate] = useState("");
  const [status, setStatus] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }

    canUserAccessPage("Edit Project Batch");
    canUserAccessPage("Delete Project Batch");
    canUserAccessPage("Change Project Batch No");
    fetchProjectBatchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching selected Project Batch details
  const fetchProjectBatchDetails = () => {
    const { state } = location;
    if (state === 0 || state === null || state === undefined) {
      history.push("/Projects");
      return;
    }

    setSpinnerMessage("Please wait while fetching project batch details...");
    setLoading(true);

    projectBatchService
      .getProjectBatchDetailsByID(state.ProjectBatchID, helper.getUser())
      .then((response) => {
        setProjectID(response.data.ProjectID);
        setProjectBatchID(response.data.ProjectBatchID);
        setCustomerCode(response.data.CustomerCode);
        setProjectCode(response.data.ProjectCode);
        setBatchNo(response.data.BatchNo);
        setScope(response.data.Scope);
        setInputCount(response.data.InputCount);
        setInputCountType(response.data.InputCountType);
        setReceivedDate(response.data.ReceivedDate);
        setReceivedFormat(response.data.ReceivedFormat);
        setOutputFormat(response.data.OutputFormat);
        setPlannedStartDate(response.data.PlannedStartDate);
        setPlannedDeliveryDate(response.data.PlannedDeliveryDate);
        setRemarks(response.data.Remarks);
        setCustomerInputFileName(response.data.CustomerInputFileName);
        setDeliveredCount(response.data.DeliveredCount);
        setDeliveredDate(response.data.DeliveredDate);
        setStatus(response.data.Status);
        setActiveTab(activeTab);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Project page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Project Batch") {
          setCanAccessEditProjectBatch(response.data);
        } else if (pageName === "Delete Project Batch") {
          setCanAccessDeleteProjectBatch(response.data);
        } else if (pageName === "Change Project Batch No") {
          setCanAccessChangeBatchNo(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Downloading Customer Input File
  const downloadCustomerInputFile = () => {
    setSpinnerMessage("Please wait while downloading customer input file...");
    setLoading(true);

    projectBatchService
      .downloadFile(customerInputFileName, "customerinputfile")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", customerInputFileName);
        document.body.appendChild(fileLink);

        fileLink.click();

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);

        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Display Modal Pop up
  const showPopUp = () => {
    setShowModal(true);
  };
  //#endregion

  //#region Close modal Pop Up
  const handleNo = () => {
    setShowModal(false);
  };
  //#endregion

  //#region Delete Project Batch
  const handleYes = () => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    setSpinnerMessage("Please wait while deleting project batch...");
    setLoading(true);

    projectBatchService
      .deleteProjectBatch(projectBatchID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("Project Batch Deleted Successfully");
        history.push({
          pathname: "/Projects/ProjectBatchList",
          state: {
            ProjectID: projectID,
            CustomerCode: customerCode,
            ProjectCode: projectCode,
            Scope: scope,
            activeTab: 1,
          },
        });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
        handleNo();
      });
  };
  //#endregion

  //#region Show Change Batch No Modal
  const showChangeBatchNoModalHandler = () => {
    setShowChangeBatchNoModal(true);
    setChangedBatchNo("");
    setFormErrors({});
  };
  //#endregion

  //#region On Change Batch No
  const onChangeBatchNo = (e) => {
    const value = e.target.value;
    setChangedBatchNo(value);
    if (value !== "" && value !== null) {
      setFormErrors({});
    }
  };
  //#endregion

  //#region Validating the Changed Batch No
  const handleBatchValidation = () => {
    const changedBatchNoTrimmed = changedBatchNo.trim();
    const batchNoTrimmed = batchNo.trim();
    let errors = {};
    let isValidForm = true;
    const re = /^\d+$/;

    if (!changedBatchNoTrimmed) {
      isValidForm = false;
      errors["batchNoError"] = "Batch No is required";
    }

    if (changedBatchNoTrimmed) {
      if (changedBatchNoTrimmed === batchNoTrimmed) {
        isValidForm = false;
        errors["batchNoError"] =
          "Change To Batch No. cannot be same as existing Batch No.";
      } else if (!re.test(changedBatchNoTrimmed)) {
        isValidForm = false;
        errors["batchNoError"] = "Batch No. should contain only numbers";
      } else if (changedBatchNoTrimmed.length !== 4) {
        isValidForm = false;
        errors["batchNoError"] = "Batch No. must have 4 Digits";
      } else if (changedBatchNoTrimmed === "0000") {
        isValidForm = false;
        errors["batchNoError"] = "Invalid Change To Batch No.";
      }
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Save Batch No
  const changeBatchNo = () => {
    if (handleBatchValidation()) {
      setSpinnerMessage("Please wait while changing Batch No...");
      setModalLoading(true);

      projectBatchService
        .changeBatchNo(
          customerCode,
          projectCode,
          batchNo,
          changedBatchNo,
          helper.getUser()
        )
        .then(() => {
          setModalLoading(false);
          toast.success("Batch No Changed Successfully");
          history.push({
            pathname: "/Projects/ProjectBatchList",
            state: {
              ProjectID: projectID,
              CustomerCode: customerCode,
              ProjectCode: projectCode,
              Scope: scope,
              activeTab: 1,
            },
          });
        })
        .catch((e) => {
          setModalLoading(false);
          toast.error(e.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region main return
  return (
    <div>
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
        <div className="container">
          <div className="az-content-breadcrumb mg-t-20 mg-l-15">
            <span>Projects</span>
            <span>View Project Batch</span>
          </div>
          <h4 className="mg-l-15 d-flex align-items-center" style={{width:"25%"}}>
            View Project Batch{" "}
            <span className="icon-size mg-l-5">
              <i onClick={() => {
                history.push({
                  pathname: "/Projects/ProjectBatchList",
                  state: {
                    ProjectID: projectID,
                    CustomerCode: customerCode,
                    ProjectCode: projectCode,
                    Scope: scope,
                    activeTab: 1,
                  },
                });
              }}
                className="far fa-arrow-alt-circle-left text-primary pointer"
                tabIndex="1"
                title="Back to Project Batch List"
              ></i>
            </span>
          </h4>
          <div className="viewProjectBatchMainContent">
            <div className="col-md-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Customer Code</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{customerCode}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Project Code </label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{projectCode}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Batch No. </label>
                    </div>
                    <div className="col-sm-4">
                      <label>{batchNo}</label>
                    </div>
                    <div className="col-sm-4">
                      {canAccessChangeBatchNo &&
                        deliveredCount === 0 && (
                          <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={showChangeBatchNoModalHandler}>
                            Change Batch No
                          </button>
                        )}
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Scope </label>
                    </div>
                    <div className="col-sm-4">
                      <label>{scope}</label>
                    </div>
                    <div className="col-sm-5 row">
                      {deliveredCount > 0 && (
                        <>
                          <label className="mg-r-70">Delivered Date</label>
                          <label>
                            {Moment(deliveredDate).format(
                              "DD-MMM-yyyy"
                            )}
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Input Count</label>
                    </div>
                    <div className="col-sm-4">
                      <label>{inputCount}</label>
                    </div>
                    <div className="col-sm-5 row">
                      {deliveredCount > 0 && (
                        <>
                          <label className="mg-r-70">Delivered Count</label>
                          <label>{deliveredCount}</label>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Input Count Type</label>
                    </div>
                    <div className="col-sm-4">
                      <label>{inputCountType}</label>
                    </div>
                    <div className="col-sm-5 row">
                      <>
                        <label className="mg-r-120">Status</label>
                        <label>{status}</label>
                      </>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Received Date</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>
                        {receivedDate !== null
                          ? Moment(receivedDate).format(
                            "DD-MMM-yyyy"
                          )
                          : ""}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Received Format</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{receivedFormat}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Output Format</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{outputFormat}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Planned Start Date</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>
                        {plannedStartDate !== null
                          ? Moment(plannedStartDate).format(
                            "DD-MMM-yyyy"
                          )
                          : ""}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Planned Delivery Date</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>
                        {plannedDeliveryDate !== null
                          ? Moment(plannedDeliveryDate).format(
                            "DD-MMM-yyyy"
                          )
                          : ""}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Remarks</label>
                    </div>
                    <div className="col-sm-9">
                      <label>{remarks}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Customer Input File</label>
                    </div>
                    <div className="col-sm-9">
                      <label>
                        <Link to="#/" onClick={downloadCustomerInputFile}>
                          {customerInputFileName}
                        </Link>
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-2"></div>
                    {canAccessEditProjectBatch && deliveredCount === 0 && (
                      <div className="col-md-3">
                        <Link
                          to={{
                            pathname: "/Projects/EditProjectBatch",
                            state: projectBatchID,
                          }}
                          className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                    <div className="col-sm-1"></div>
                    {canAccessDeleteProjectBatch && deliveredCount === 0 && (
                      <div className="col-md-3">
                        <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={showPopUp}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={showModal} className="viewRoleDeleteModal" aria-labelledby="contained-modal-title-vcenter" onHide={handleNo} backdrop="static" enforceFocus={false}>
            <Modal.Header>
              <Modal.Title>Delete Project Batch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Project Batch?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={handleNo}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showChangeBatchNoModal} onHide={() => setShowChangeBatchNoModal(false)} dialogClassName="modal-width-produpload" aria-labelledby="contained-modal-title-vcenter" backdrop="static" enforceFocus={false}>
            <LoadingOverlay active={modalLoading} className="custom-loader"
              spinner={
                <div className="spinner-background">
                  <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
                  <p style={{ color: "black", marginTop: "5px" }}>
                    {spinnerMessage}
                  </p>
                </div>
              }
            >
              <Modal.Header>
                <Modal.Title id="changeProjectCodeModal">
                  Change Batch No
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row row-sm">
                  <div className="col-md-6 text-nowrap">
                    <label htmlFor="CustomerCode">
                      <b>Customer Code</b>
                    </label>
                  </div>
                  <div className="col-md-5 mg-t-7 mg-l-2">
                    <p id="CustomerCode" name="CustomerCode">
                      {customerCode}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-6 text-nowrap">
                    <label htmlFor="ProjectCode">
                      <b>Project Code</b>
                    </label>
                  </div>
                  <div className="col-md-5 mg-t-7 mg-l-2">
                    <p id="ProjectCode" name="ProjectCode">
                      {projectCode}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-6 text-nowrap">
                    <label htmlFor="ProjectCode">
                      <b>Batch No</b>
                    </label>
                  </div>
                  <div className="col-md-5 mg-t-7 mg-l-2">
                    <p id="ProjectCode" name="ProjectCode">
                      {batchNo}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-8 mg-t-7 mg-l-2">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            Change To Batch No. <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select">
                        <input type="text" className="form-control" maxLength="4" id="ChangeToBatchNo" name="ChangeToBatchNo" tabIndex="1" value={changedBatchNo} onChange={onChangeBatchNo} />
                        <div className="error-message">
                          {formErrors["batchNoError"]}
                        </div>
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
                <div className="row row-sm mg-t-30">
                  <div className="col-md-3"></div>
                  <div className="col-md-3 mg-t-10 mg-lg-t-0">
                    <span className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" onClick={changeBatchNo}>
                      Change
                    </span>
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-3  mg-t-10 mg-lg-t-0">
                    <span className="btn btn-gray-700 btn-block" onClick={() => setShowChangeBatchNoModal(false)} id="Cancel">
                      Cancel
                    </span>
                  </div>
                </div>
              </Modal.Body>
            </LoadingOverlay>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ViewProjectBatch;