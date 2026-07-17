import React, { useState } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { TextField } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import grievanceService from "../../services/grievanceService";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function SuggestionToManagement() {
    //#region State
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');
    const [subjectErr, setSubjectErr] = useState('');
    const [detailsErr, setDetailsErr] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [myIsFocused, setMyIsFocused] = useState(false);
    //#endregion

    //#region Form validation
    const validateForm = () => {
        let isValid = true;
        if (!subject) {
            setSubjectErr('Subject is required');
            isValid = false;
        } else if (subject.length > 100) {
            setSubjectErr('Subject must be less than 100 characters');
            isValid = false;
        } else {
            setSubjectErr('');
        }

        if (!details) {
            setDetailsErr('Details are required');
            isValid = false;
        } else if (details.length > 1000) {
            setDetailsErr('Details must be less than 1000 characters');
            isValid = false;
        } else {
            setDetailsErr('');
        }
        return isValid;
    };
    //#endregion

    //#region Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const suggestionData = { subject, details };
        setLoading(true);

        grievanceService.CreateSuggestion(suggestionData)
            .then(() => {
                toast.success("Suggestion submitted successfully.");
                setSubject('');
                setDetails(''); 
            })
            .catch((error) => {
                const errorMessage = error?.response?.data?.message || "An error occurred while submitting the suggestion.";
                toast.error(errorMessage, { autoClose: false });
            })
            .finally(() => setLoading(false));
    };
    //#endregion

    //#region Focus and Blur Handling
    const handleFocus = (input) => {
        if (input === "subject") setIsFocused(true);
        else setMyIsFocused(true);
    };

    const handleBlur = (input) => {
        if (input === "subject") setIsFocused(false);
        else setMyIsFocused(false);
    };
    //#endregion

    const shouldShowLabel = isFocused || subject !== '';
    const myShouldShowLabel = myIsFocused || details !== '';

    //#region Return
    return (
        <LoadingOverlay active={loading} className="custom-loader"
            spinner={<div className="spinner-background">
                    <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
                    <p style={{ color: "black", marginTop: "5px" }}>Processing...</p>
                </div>
            }
        >
            <div className="mg-l-50 mg-r-25 ">
                <div className="row row-sm mg-r-15 mg-l-5 mg-t-5 mygrvncecnt">
                    <div className="col-lg-7 my-mncnt mg-b-20" style={{ border: "1px solid #cdd4e0" }}>
                        <div className="row mb-2">
                            <div className="col-md-12 mt-2" style={{ textAlign: 'center' }}>
                                <h4 className="grvn-text"><b>Suggestion To Management</b></h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <textarea className="mygrvncetxtarea" rows="5" cols="100" readOnly defaultValue="Do you have a suggestion? Do you think there is a better way to do a particular activity? You may give a suggestion or opinion about anything related to operations, working environment, grievance, complaint, abuse or just about anything. Your message is sent to CEO, through this interface your personal information is not transmitted and not stored anywhere. You can be assured of anonymity and confidentiality." />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row mt-2 mysgtdta">
                                <div className="col-md-12 mg-t-5">
                                    <div className="suggestionManagementFloatingInput">
                                        <FloatingLabel
                                            label={
                                                <>
                                                    Subject <span className="text-danger">*</span>
                                                </>
                                            }
                                            className="float-hidden float-select">
                                            <TextField className="form-control custom-textfield suggestionSubjectDetailsInput"
                                                style={{ padding: "0px", borderRadius: "0px" }} id="CustomerCode" variant="outlined" size="small"
                                                placeholder="Enter the subject of suggestion here (max.100 characters)" value={subject}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSubject(value);
                                                    if (value) {
                                                        setSubjectErr('');
                                                    }
                                                }}
                                                onFocus={() => handleFocus('subject')}
                                                onBlur={() => handleBlur('subject')}
                                                inputProps={{ maxLength: 100 }}
                                                InputLabelProps={{ shrink: shouldShowLabel }}
                                            />
                                        </FloatingLabel>
                                    </div>
                                    {subjectErr && (
                                        <div className="error-message">{subjectErr}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row mt-3 mb-3">
                                <div className="col-md-12">
                                    <div className="suggestionManagementFloatingInput">
                                        <FloatingLabel
                                            label={
                                                <>
                                                    Details <span className="text-danger">*</span>
                                                </>
                                            }
                                            className="float-hidden float-select"
                                        >
                                            <TextField className="resizable-textfield" id="Details" placeholder="Enter the details of suggestion here (max.1000 characters)" value={details}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setDetails(value);
                                                    if (value) {
                                                        setDetailsErr('');
                                                    }
                                                }}
                                                onFocus={() => handleFocus('details')}
                                                onBlur={() => handleBlur('details')}
                                                inputProps={{ maxLength: 1000 }}
                                                multiline
                                                rows={7}
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{ shrink: myShouldShowLabel }}
                                                style={{ width: "100%" }}
                                            />
                                        </FloatingLabel>
                                    </div>
                                    {detailsErr && (
                                        <div className="error-message">{detailsErr}</div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="sugst submit-button mb-3"><i className="fa fa-save"></i> Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </LoadingOverlay>
    );
    //#endregion
}

export default SuggestionToManagement;
