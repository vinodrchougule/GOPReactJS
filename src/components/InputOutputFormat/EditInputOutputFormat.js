import React, { useState, useEffect } from "react";
import InputOutputFormatService from "../../services/inputOutputFormat.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function EditInputOutputFormat(props) {
    //#region Component state
    const [formatID, setFormatID] = useState(0);
    const [formatName, setFormatName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [initStates, setInitStates] = useState({ spinnerMessage: "", loading: false });
    //#endregion

    //#region UseEffect
    useEffect(() => {
        if (!helper.getUser()) {
            props.history.push({ pathname: "/" });
            return;
        }
        fetchInputOutputFormat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //#endregion

    //#region Fetching selected Input Output Format details
    const fetchInputOutputFormat = () => {
        const { state } = props.location;
        if (state === 0 || state === null || state === undefined) {
            props.history.push("/Masters/InputOutputFormats");
            return;
        }
        setInitStates({ ...initStates, spinnerMessage: "Please wait while loading Input Output Format...", loading: true });
        InputOutputFormatService.getInputOutputFormat(state, helper.getUser())
            .then((response) => {
                setFormatID(response.data.FormatID);
                setFormatName(response.data.Format);
                setIsActive(response.data.IsActive);
                setInitStates({ ...initStates, loading: false });
            })
            .catch((e) => {
                setInitStates({ ...initStates, loading: false });
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region Validating the input data
    const handleFormValidation = () => {
        const formatNameTrimmed = formatName.trim();
        let formErrors = {};
        let isValidForm = true;
        if (!formatNameTrimmed) {
            isValidForm = false;
            formErrors["formatNameError"] = "Format Name is required";
        }
        setFormErrors(formErrors);
        return isValidForm;
    };
    //#endregion

    //#region On Change Format Name
    const onChangeFormatName = (e) => {
        setFormatName(e.target.value);
        if (e.target.value !== "" || e.target.value !== null)
            setFormErrors({});
    };
    //#endregion

    //#region On Change IsActive
    const onChangeIsActive = (e) => {
        setIsActive(e.target.checked);
    };
    //#endregion

    //#region Redirect to Input Output Format List Page
    const moveToInputOutputFormatList = () => {
        props.history.push("/Masters/InputOutputFormats");
    };
    //#endregion

    //#region Reset the Edit Input Output Format page
    const resetEditInputOutputFormat = () => {
        fetchInputOutputFormat();
        setFormErrors({});
    };
    //#endregion

    //#region Save Input Output Format
    const saveEditInputOutputFormat = () => {
        if (!helper.getUser()) {
            props.history.push({ pathname: "/" });
            return;
        }
        if (handleFormValidation()) {
            setInitStates({ ...initStates, spinnerMessage: "Please wait while saving Input-Output Format...", loading: true });
            const data = {
                FormatID: formatID,
                Format: formatName.trim(),
                IsActive: isActive,
                UserID: helper.getUser(),
            };
            InputOutputFormatService.updateInputOutputFormat(formatID, data)
                .then(() => {
                    toast.success("Input-Output Format Updated Successfully");
                    resetEditInputOutputFormat();
                    props.history.push({
                        pathname: "/Masters/InputOutputFormats",
                    });
                })
                .catch((error) => {
                    setInitStates({ ...initStates, loading: false });
                    toast.error(error.response.data.Message, { autoClose: false });
                });
        }
    };
    //#endregion

    //#region return
    return (
        <div className="pro-main-display">
            <LoadingOverlay
                active={initStates.loading}
                className="custom-loader"
                spinner={
                    <div className="spinner-background">
                        <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
                        <p style={{ color: "black", marginTop: "5px" }}>{initStates.spinnerMessage}</p>
                    </div>
                }
            >
                <div className="az-content-breadcrumb mg-l-10">
                    <span>Master</span>
                    <span>Input / Output Format</span>
                </div>
                <h4 className="mg-l-10 d-flex align-items-center">
                    Edit Input / Output Format{" "}
                    <span className="icon-size">
                        <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={moveToInputOutputFormatList} title="Back to Input Output Format List" ></i>
                    </span>
                </h4>
                <div>
                    <div className="row row-sm">
                        <div className="col-lg-4 mg-t-15">
                            <div className="inputOutputFormatFloatingInputEdit">
                                <FloatingLabel
                                    label={
                                        <>
                                            <b>Format ID</b> <span className="text-danger">*</span>
                                        </>
                                    }
                                    className="float-hidden float-select"
                                >
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="FormatID"
                                        value={formatID}
                                        onChange={formatID}
                                        readOnly
                                    />
                                </FloatingLabel>
                            </div>
                        </div>
                    </div>
                    <div className="row row-sm mg-t-20">
                        <div className="col-md-4">
                            <div className="inputOutputFormatFloatingInputEdit">
                                <FloatingLabel
                                    label={
                                        <>
                                            <b>Format Name</b> <span className="text-danger">*</span>
                                        </>
                                    }
                                    className="float-hidden float-select"
                                >
                                    <input type="text" className="form-control" id="FormatName" name="FormatName" maxLength="50" value={formatName} onChange={onChangeFormatName} />
                                    {formErrors.formatNameError && (<div className="error-message">{formErrors.formatNameError}</div>)}
                                </FloatingLabel>
                            </div>
                        </div>
                    </div>

                    <div className="row row-sm mg-t-15">
                        <div className="col-md-2">
                            <label><b>Is Active?</b></label>
                        </div>
                        <div className="col-md-5 mg-t-5">
                            <label className="switch">
                                <input type="checkbox" checked={isActive} id="IsActive" onChange={onChangeIsActive} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className="row row-sm mg-t-15">
                        <div className="col-md-2">
                            <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Save" onClick={saveEditInputOutputFormat}>Save</button>
                        </div>
                        <div className="col-md-2">
                            <button className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" id="Reset" onClick={resetEditInputOutputFormat}>Reset</button>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </div>
    );
    //#endregion
};
export default EditInputOutputFormat;
