import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import helper from "../../helpers/helpers";
import Moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import postProjectBatchDetailsService from "../../services/postProjectBatchDetails.service";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function PostProjectBatchDetails () {

    //#region State management using useState hook
    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState("");
    const [projectID, setProjectID] = useState(null);
    const [customerCode, setCustomerCode] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [scope, setScope] = useState("");
    const [deliveredDate, setDeliveredDate] = useState("");
    const [inputCount, setInputCount] = useState(0);
    const [deliveredCount, setDeliveredCount] = useState(0);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const [exceptionalCount, setExceptionalCount] = useState(0);
    const [notProcessedCount, setNotProcessedCount] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [QCSamplingPercentage, setQCSamplingPercentage] = useState(0);
    const [QCErrorRate, setQCErrorRate] = useState(0);
    const [QASamplingPercentage, setQASamplingPercentage] = useState(0);
    const [QAErrorRate, setQAErrorRate] = useState(0);
    const [CAPADetails, setCAPADetails] = useState("");
    const [formErrors, setFormErrors] = useState({});
    //#endregion

    //#region Use Effect
    useEffect(() => {
        if (!helper.getUser()) {
            history.push({
                pathname: "/",
            });
            return;
        }
        fetchPostProjectBatchDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //#endregion

    //#region Fetching Post Project Batch Details
    const fetchPostProjectBatchDetails = () => {
        const state = location.state; 
    
        if (!state) {
          history.push("/Projects");
          return;
        }
    
        setSpinnerMessage("Please wait while fetching post project batch details...");
        setLoading(true);
    
        postProjectBatchDetailsService
          .readPostProjectBatchDetailsByBatchNo(
            state.CustomerCode,
            state.ProjectCode,
            state.BatchNo,
            helper.getUser()
          )
          .then((response) => {
            const data = response.data;

            setProjectID(state.ProjectID);
            setCustomerCode(state.CustomerCode);
            setProjectCode(state.ProjectCode);
            setBatchNo(state.BatchNo);
            setScope(state.Scope);
            setInputCount(state.InputCount);
            setDeliveredDate(state.DeliveredDate);
            setDeliveredCount(state.DeliveredCount);
            setDuplicateCount(data.DuplicateCount);
            setExceptionalCount(data.ExceptionalCount);
            setNotProcessedCount(data.NotProcessedCount);
            setQCSamplingPercentage(data.QCSamplingPercentage);
            setQCErrorRate(data.QCErrorRate);
            setQASamplingPercentage(data.QASamplingPercentage);
            setQAErrorRate(data.QAErrorRate);
            setRemarks(data.Remarks);
            setCAPADetails(data.CAPADetails);
    
            setLoading(false);
            setSpinnerMessage("");
          })
          .catch((error) => {
            setLoading(false);
            setSpinnerMessage("");
            const errorMessage = error.response?.data?.Message;
            toast.error(errorMessage, { autoClose: false });
          });
      };
    //#endregion

    //#region On Change Duplicate Count
    const onChangeDuplicateCount = (e) => {
        const value = e.target.value;
        setDuplicateCount(value);

        if (value !== "" && value !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                duplicateCountError: "",
            }));
        }
    };
    //#endregion

    //#region On Change Exceptional Count
    const onChangeExceptionalCount = (e) => {
        const value = e.target.value;
        setExceptionalCount(value);

        if (value !== "" && value !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                exceptionalCountError: "",
            }));
        }
    };
    //#endregion

    //#region On Change Not Processed Count
    const onChangeNotProcessedCount = (e) => {
        const value = e.target.value;
        setNotProcessedCount(value);

        if (value !== "" && value !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                notProcessedCountError: "",
            }));
        }
    };
    //#endregion

    //#region On Change Remarks
    const onChangeRemarks = (e) => {
        setRemarks(e.target.value);
    };
    //#endregion

    //#region On Change QC Sampling Percentage
    const onChangeQCSamplingPercentage = (e) => {
        const value = e.target.value;

        setQCSamplingPercentage(value);

        if (value !== "" && value !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                QCSamplingPercentageError: "",
            }));
        }
    };
    //#endregion

    //#region On Change QC Error Rate
    const onChangeQCErrorRate = (e) => {
        const value = e.target.value;
        setQCErrorRate(value);

        if (value !== "" && value !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                QCErrorRateError: "",
            }));
        }
    };
    //#endregion

    //#region On Change QA Sampling Percentage
    const onChangeQASamplingPercentage = (e) => {
        const value = e.target.value;
        setQASamplingPercentage(value);

        if (value !== "" && value !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                QASamplingPercentageError: "",
            }));
        }
    };
    //#endregion

    //#region On Change QA Error Rate
    const onChangeQAErrorRate = (e) => {
        const value = e.target.value;
        setQAErrorRate(value);

        if (value !== "" && value !== null) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                QAErrorRateError: ""
            }));
        }
    };
    //#endregion

    //#region On Change CAPA Details
    const onChangeCAPADetails = (e) => {
        setCAPADetails(e.target.value);
    };
    //#endregion

    //#region Validating the Post Project Batch Form data
    const handlePostProjectBatchFormValidation = () => {
        let isValidForm = true;
        let errors = {};

        if (!duplicateCount) {
            isValidForm = false;
            errors["duplicateCountError"] = "Duplicate Count is required";
        } else if (duplicateCount > inputCount) {
            isValidForm = false;
            errors["duplicateCountError"] = "Duplicate Count can't be more than Input Count";
        }

        if (!exceptionalCount) {
            isValidForm = false;
            errors["exceptionalCountError"] = "Exceptional Count is required";
        } else if (exceptionalCount > inputCount) {
            isValidForm = false;
            errors["exceptionalCountError"] = "Exceptional Count can't be more than Input Count";
        }

        if (!notProcessedCount) {
            isValidForm = false;
            errors["notProcessedCountError"] = "Not Processed Count is required";
        } else if (notProcessedCount > inputCount) {
            isValidForm = false;
            errors["notProcessedCountError"] = "Not Processed Count can't be more than Input Count";
        }

        if (!QCSamplingPercentage) {
            isValidForm = false;
            errors["QCSamplingPercentageError"] = "QC Sampling Percentage is required";
        }

        if (!QCErrorRate) {
            isValidForm = false;
            errors["QCErrorRateError"] = "QC Error Rate is required";
        }

        if (!QASamplingPercentage) {
            isValidForm = false;
            errors["QASamplingPercentageError"] = "QA Sampling Percentage is required";
        }

        if (!QAErrorRate) {
            isValidForm = false;
            errors["QAErrorRateError"] = "QA Error Rate is required";
        }

        setFormErrors(errors);
        return isValidForm;
    };
    //#endregion

    //#region Save Post Project Batch Details
    const savePostProjectBatchDetails = (e) => {
        e.preventDefault();

        if (!helper.getUser()) {
            history.push({
                pathname: "/",
            });
            return;
        }

        if (handlePostProjectBatchFormValidation()) {
            setSpinnerMessage("Please wait while Saving Post Project Batch Details...");
            setLoading(true);

            const data = {
                CustomerCode: customerCode,
                ProjectCode: projectCode,
                BatchNo: batchNo,
                DuplicateCount: duplicateCount,
                ExceptionalCount: exceptionalCount,
                NotProcessedCount: notProcessedCount,
                QCSamplingPercentage: QCSamplingPercentage,
                QCErrorRate: QCErrorRate,
                QASamplingPercentage: QASamplingPercentage,
                QAErrorRate: QAErrorRate,
                Remarks: remarks,
                CAPADetails: CAPADetails,
                UserID: helper.getUser(),
            };
            postProjectBatchDetailsService
                .updatePostProjectBatchDetails(data)
                .then(() => {
                    setLoading(false);
                    toast.success("Post Project Batch Details Updated Successfully");
                    setCustomerCode(customerCode);
                    setProjectCode(projectCode);
                    setBatchNo(batchNo);
                    setDuplicateCount(duplicateCount);
                    setExceptionalCount(exceptionalCount);
                    setNotProcessedCount(notProcessedCount);
                    setQCSamplingPercentage(QCSamplingPercentage);
                    setQCErrorRate(QCErrorRate);
                    setQASamplingPercentage(QASamplingPercentage);
                    setQAErrorRate(QAErrorRate);
                    setRemarks(remarks);
                    setCAPADetails(CAPADetails);

                    history.push({
                        pathname: "/Projects/ProjectBatchList",
                        state: {
                            ProjectID: projectID,
                            CustomerCode: data.CustomerCode,
                            ProjectCode: data.ProjectCode,
                            Scope: scope,
                            activeTab: 2,
                        },
                    });
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(error.response.data.Message, { autoClose: false });
                });
        }
    };
    //#endregion

    //#region Reset Page
    const reset = () => {
        setFormErrors({});
        setRemarks("");
        setCAPADetails("");
        fetchPostProjectBatchDetails();
    };
    //#endregion

    //#region main return
    return (
        <>
            <LoadingOverlay
                active={loading}
                className="custom-loader"
                spinner={
                    <div className="spinner-background">
                        <BarLoader
                            css={helper.getcss()}
                            color={"#38D643"}
                            width={"350px"}
                            height={"10px"}
                            speedMultiplier={0.3}
                        />
                        <p style={{ color: "black", marginTop: "5px" }}>
                            {spinnerMessage}
                        </p>
                    </div>
                }
            >
                <div>
                    <div className="container mg-t-15">
                        <h4 className="d-flex align-items-center" style={{width:"25%"}}>
                            Post Project Batch Details{" "}
                            <span className="icon-size mg-l-5">
                                <Link
                                    to={{
                                        pathname: "/Projects/ProjectBatchList",
                                        state: {
                                            ProjectID: projectID,
                                            CustomerCode: customerCode,
                                            ProjectCode: projectCode,
                                            Scope: scope,
                                            activeTab: 2,
                                        },
                                    }}
                                >
                                    <i
                                        className="far fa-arrow-alt-circle-left text-primary pointer"
                                        tabIndex="1"
                                        title="Back to List"
                                    ></i>
                                </Link>
                            </span>
                        </h4>
                        <form onSubmit={savePostProjectBatchDetails}>
                            <div className="postProjectBatchDetailsMain">
                                <div className="row row-sm read-project-data">
                                    <div className="col-lg-4">
                                        <div className="form-field-div-read">
                                            <label htmlFor="CustomerCode">
                                                <b>Customer Code</b>{" "}
                                                <span className="text-danger asterisk-size">*</span>
                                            </label>
                                            <div>
                                                <p id="CustomerCode" name="CustomerCode">
                                                    {customerCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-field-div-read">
                                            <label htmlFor="CustomerCode">
                                                <b>Project Code</b>{" "}
                                                <span className="text-danger asterisk-size">*</span>
                                            </label>
                                            <div>
                                                <p id="CustomerCode" name="CustomerCode">
                                                    {projectCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-field-div-read">
                                            <label htmlFor="CustomerCode">
                                                <b>Batch No.</b>{" "}
                                                <span className="text-danger asterisk-size">*</span>
                                            </label>
                                            <div>
                                                <p id="CustomerCode" name="CustomerCode">
                                                    {batchNo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="row row-sm">
                                    <div className="col-lg">
                                        <h5>
                                            <b>Enter Details of Delivered Project</b>
                                        </h5>
                                        <div className="row">
                                            <div className="col-md-8 text-nowrap mg-t-7">
                                                <label htmlFor="DeliveredDate">Delivered Date</label>
                                            </div>
                                            <div className="col-md-4 mg-t-7">
                                                <p id="DeliveredDate" name="DeliveredDate">
                                                    {deliveredDate !== null
                                                        ? Moment(deliveredDate).format(
                                                            "DD-MMM-yyyy"
                                                        )
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-8 text-nowrap">
                                                <label htmlFor="InputCount">Input Count</label>
                                            </div>
                                            <div className="col-md-4">
                                                <p id="InputCount" name="InputCount">
                                                    {inputCount}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-8 text-nowrap">
                                                <label htmlFor="DeliveredCount">
                                                    Delivered Count
                                                </label>
                                            </div>
                                            <div className="col-md-4">
                                                <p id="DeliveredCount" name="DeliveredCount">
                                                    {deliveredCount}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                Duplicate Count <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="DuplicateCount"
                                                            name="DuplicateCount"
                                                            value={duplicateCount}
                                                            onChange={onChangeDuplicateCount}
                                                            max="999999"
                                                            min="0"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["duplicateCountError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                Exceptional Count <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="ExceptionalCount"
                                                            name="ExceptionalCount"
                                                            value={exceptionalCount}
                                                            onChange={onChangeExceptionalCount}
                                                            max="999999"
                                                            min="0"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["exceptionalCountError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                Not Processed Count <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="NotProcessedCount"
                                                            name="NotProcessedCount"
                                                            value={notProcessedCount}
                                                            onChange={onChangeNotProcessedCount}
                                                            max="999999"
                                                            min="0"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["notProcessedCountError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                Remarks
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <textarea
                                                            className="form-control"
                                                            rows="2"
                                                            id="Remarks"
                                                            name="Remarks"
                                                            maxLength="500"
                                                            value={remarks}
                                                            onChange={onChangeRemarks}
                                                        ></textarea>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg mg-t-10 mg-lg-t-0">
                                        <h5>
                                            <b>QC Details</b>
                                        </h5>
                                        <div className="row mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                QC Sampling(%) <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="QCSampling"
                                                            name="QCSampling"
                                                            value={QCSamplingPercentage}
                                                            onChange={onChangeQCSamplingPercentage}
                                                            max="100"
                                                            min="0"
                                                            placeholder="Enter from 0-100%"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["QCSamplingPercentageError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mg-b-20 mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                QC Error Rate(%) <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="QCErrorRate"
                                                            name="QCErrorRate"
                                                            value={QCErrorRate}
                                                            onChange={onChangeQCErrorRate}
                                                            max="100"
                                                            min="0"
                                                            placeholder="Enter from 0-100%"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["QCErrorRateError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <h5>
                                            <b>QA Details</b>
                                        </h5>
                                        <div className="row mg-t-25">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                QA Sampling(%) <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="QASampling"
                                                            name="QASampling"
                                                            value={QASamplingPercentage}
                                                            onChange={onChangeQASamplingPercentage}
                                                            max="100"
                                                            min="0"
                                                            placeholder="Enter from 0-100%"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["QASamplingPercentageError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mg-b-20 mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                QA Error Rate(%) <span className="text-danger">*</span>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="QAErrorRate"
                                                            name="QAErrorRate"
                                                            value={QAErrorRate}
                                                            onChange={onChangeQAErrorRate}
                                                            max="100"
                                                            min="0"
                                                            placeholder="Enter from 0-100%"
                                                        />
                                                        <div className="error-message">
                                                            {formErrors["QAErrorRateError"]}
                                                        </div>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mg-t-15">
                                            <div className="col-md-12">
                                                <div className="createProjectFloatingInput">
                                                    <FloatingLabel
                                                        label={
                                                            <>
                                                                <b>CAPA Details</b>
                                                            </>
                                                        }
                                                        className="float-hidden float-select">
                                                        <textarea
                                                            className="form-control"
                                                            rows="2"
                                                            id="CAPADetails"
                                                            name="CAPADetails"
                                                            maxLength="500"
                                                            value={CAPADetails}
                                                            onChange={onChangeCAPADetails}
                                                        ></textarea>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <br />
                                <div className="row row-sm">
                                    <div className="col-md-3"></div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-2 mg-t-10 mg-lg-t-0">
                                        <input
                                            type="submit"
                                            id="Save"
                                            className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                                            value="Save"
                                        />
                                    </div>
                                    
                                    <div className="col-md-2  mg-t-10 mg-lg-t-0">
                                        <span
                                            className="btn btn-gray-700 btn-block"
                                            onClick={reset}
                                            id="Reset"
                                        >
                                            Reset
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </LoadingOverlay>
        </>
    );
    //#endregion
}
export default PostProjectBatchDetails;