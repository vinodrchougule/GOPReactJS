/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from 'react';
import {
    Button,
    Col,
    Form,
    Row
} from "react-bootstrap";
import './ProjectSetting.scss';
import { useEffect } from 'react';
import helper from "../../helpers/helpers";
import productionAllocationService from "../../services/productionAllocation.service";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { toast } from "react-toastify";
import projectService from '../../services/project.service';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import Select from "react-select";
import accessControlService from '../../services/accessControl.service';
toast.configure();

function ProjectSetting() {

    const locationData = JSON.parse(sessionStorage.getItem("locationData"));

    const location = useLocation();
    const queryParams = location.pathname.split("/").splice(1);
    let findLocation = queryParams[1];

    //#region initial value customer Data
    const [state, setState] = useState({
        customerData: [],
        projectCodes: [],
        customInputOptions: [],
        loading: true,
        spinnerMessage: "Please wait while fetching Customers...",
    });

    const [canUserAccess, setCanUserAccess] = useState(false)
    //#endregion

    //#region initial value for project settings
    const [projectSettings, setProjectSettings] = useState({
        CustomerCode: "",
        ProjectCode: "",
        AdditionalInfoPrefix: "",
        MFRNamePrefix: "",
        MFRPNPrefix: "",
        VendorNamePrefix: "",
        VendorPNPrefix: "",
        IsToIncludeAdditionalInfoInShortDesc: false,
        IsToIncludeAdditionalInfoInLongDesc: false,
        IsToIncludeMFRNameInShortDesc: false,
        IsToIncludeMFRNameInLongDesc: false,
        IsToIncludeMFRPNInShortDesc: false,
        IsToIncludeMFRPNInLongDesc: false,
        IsToIncludeVendorNameInShortDesc: false,
        IsToIncludeVendorNameInLongDesc: false,
        IsToIncludeVendorPNInShortDesc: false,
        IsToIncludeVendorPNInLongDesc: false,
        IsToConvertAttributeValueToUppercase: false,
        MFRNameInputColumnName: "",
        MFRPNInputColumnName: "",
        VendorNameInputColumnName: "",
        VendorPNInputColumnName: "",
        ShortDescriptionInputColumnName: "",
        LongDescriptionInputColumnName: "",
        CustomColumnName1: "",
        CustomColumnName2: "",
        CustomColumnName3: "",
        SpecialCharacters: [],
        UserID: "",
    });
    //#endregion

    //#region initial value customer Data
    const [customColumnState, setCustomColumnState] = useState({
        validateColumn2: false,
        validateColumn3: false,
    });
    // #endregion

    //#region set value for special character input
    const [specialCharacter, setSpecialCharacter] = useState('')
    // #endregion

    //#region table header
    let tableHeader = [
        { name: "", align: "center", width: "20px" },
        { name: "Customer And Project", align: "left", width: "150px" },
    ];
    //#endregion

    //#region set back to initial value
    const setBackToInitianValue = (CustomerCode, projectCode) => {

        const user = helper.getUser();
        
        setProjectSettings({
            ...projectSettings,
            CustomerCode: CustomerCode,
            ProjectCode: projectCode,
            UserID: user,
            AdditionalInfoPrefix: "",
            MFRNamePrefix: "",
            MFRPNPrefix: "",
            VendorNamePrefix: "",
            VendorPNPrefix: "",
            IsToIncludeAdditionalInfoInShortDesc: false,
            IsToIncludeAdditionalInfoInLongDesc: false,
            IsToIncludeMFRNameInShortDesc: false,
            IsToIncludeMFRNameInLongDesc: false,
            IsToIncludeMFRPNInShortDesc: false,
            IsToIncludeMFRPNInLongDesc: false,
            IsToIncludeVendorNameInShortDesc: false,
            IsToIncludeVendorNameInLongDesc: false,
            IsToIncludeVendorPNInShortDesc: false,
            IsToIncludeVendorPNInLongDesc: false,
            IsToConvertAttributeValueToUppercase: false,
            MFRNameInputColumnName: "",
            MFRPNInputColumnName: "",
            VendorNameInputColumnName: "",
            VendorPNInputColumnName: "",
            ShortDescriptionInputColumnName: "",
            LongDescriptionInputColumnName: "",
            CustomColumnName1: "",
            CustomColumnName2: "",
            CustomColumnName3: "",
            SpecialCharacters: [],
        });
    };
    //#endregion

    //#region fetching customers of on-going projects from Web API
    const fetchCustomers = useCallback(() => {
        productionAllocationService
            .getCustomerCodes()
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    customerData: response.data,
                    loading: false,
                }));
            })
            .catch((e) => {
                setState((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
                console.log(e);
            });
    }, []);
    //#endregion

    //#region page onload function
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    useEffect(() => {
        if (locationData && findLocation !== "projectSettings") {
            projectSettings.CustomerCode = locationData.CustomerCode;
            projectSettings.ProjectCode = locationData.ProjectCode;
            handleProjectData(locationData.CustomerCode, locationData.ProjectCode);
        }
        if (locationData && findLocation === "viewProjectSettings") {
            canUserAccessPage("Create Project");
        }
    }, []);
    //#endregion

    //#region fetching Project page access
    const canUserAccessPage = (pageName) => {

        accessControlService
        .CanUserAccessPage(helper.getUser(), pageName)
        .then((response) => {
            setCanUserAccess(response.data);
        })
        .catch((e) => {
            toast.error(e.response.data.Message, { autoClose: false });
        });
    }
    //#endregion

    //#region Display navigate to previous page
    let history = useHistory();
    const goBackNavigation = () => {
        sessionStorage.removeItem("locationData");
        history.goBack();
    };
    //#endregion

    //#region row expand functon
    const [expandedRow, setExpandedRow] = useState(null);

    const handleExpand = (index, CustomerCode) => {
        setBackToInitianValue(CustomerCode, "", "");
        setState({ ...state, loading: true });
        setExpandedRow(expandedRow === index ? null : index);
        productionAllocationService
            .getProjectCodesOfCustomer(CustomerCode)
            .then((response) => {
                setState({
                    ...state,
                    projectCodes: response.data,
                    loading: false,
                    customInputOptions: [],
                });
            })
            .catch((e) => {
                this.setState({
                    ...state,
                    loading: false,
                    customInputOptions: [],
                });
                console.log(e);
            });
    };
    //#endregion

    //#region Fetch selected project data
    const handleProjectData = (customerCode, projectCode) => {
        setState({ ...state, loading: true });
        projectService
            .readProjectSettings(customerCode, projectCode)
            .then((resp) => {
                let settingData = resp.data;
                if (!resp.data.UserID) {
                    settingData.UserID = helper.getUser();
                }
                setState({ ...state, loading: false });
                setProjectSettings(settingData);
            })
            .catch((e) => {
                setState({ ...state, loading: false });
                setBackToInitianValue(customerCode, projectCode, helper.getUser());
                console.log(e);
            });
    };
    //#endregion

    //#region handle input function
    const handlePrefixInput = (e) => {
        const { name, value } = e.target;
        setProjectSettings({ ...projectSettings, [name]: value });
    };
    //#endregion

    //#region handle checkbox function
    const handleCheckBox = (e) => {
        if (findLocation === "viewProjectSettings") {
            return;
        }
        const { name, checked } = e.target;
        setProjectSettings({ ...projectSettings, [name]: checked });
    };
    // #endregion

    //#region handle Add special characters
    const addCharactersToArray = () => {
        let characterList = [];
        if(projectSettings.SpecialCharacters !== null){
            characterList = projectSettings.SpecialCharacters
        }
        characterList.push({ Characters: specialCharacter })
        setProjectSettings((prevState) => ({
            ...prevState,
            SpecialCharacters: characterList
        }))
        setSpecialCharacter('')
    }
    const deleteCharacter = (character) => {
        let characterList = projectSettings.SpecialCharacters.filter(characters => characters.Characters !== character)
        setProjectSettings((prevState) => ({
            ...prevState,
            SpecialCharacters: characterList
        }))
    }
    //#endregion handle Add special characters

    //#region fetching custom input dropdowns
    const fetchCustomColumnNames = () => {
        setCustomColumnState({
            ...customColumnState,
            validateColumn2: false,
            validateColumn3: false,
        });
        if (!projectSettings.CustomerCode || !projectSettings.ProjectCode) {
            toast.warning("Please select the project");
            return;
        }
        projectService
            .readCustomColumnsNames(
                projectSettings.CustomerCode,
                projectSettings.ProjectCode
            )
            .then((resp) => {
                let options = resp.data.map((item) => {
                    return { label: item, value: item };
                });
                setState({ ...state, customInputOptions: options, loading: false });
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //#endregion

    //#region handle Map Input select change
    const selectedValue = (value) => {
        return { value: value, label: value };
    };
    const handleMapInputSelect = (data, name) => {
        if (data) {
            setProjectSettings({ ...projectSettings, [name]: data.value });
        } else {
            setProjectSettings({ ...projectSettings, [name]: "" });
        }
    };
    //#endregion handle select change

    //#region Validte Map Inputs
    const fetchAllInputValues = (projectSettings) => {
        const mapCustomInputs = {
            MFRNameInputColumnName: {
                label: projectSettings.MFRNameInputColumnName,
                value: projectSettings.MFRNameInputColumnName,
            },
            MFRPNInputColumnName: {
                label: projectSettings.MFRPNInputColumnName,
                value: projectSettings.MFRPNInputColumnName,
            },
            VendorNameInputColumnName: {
                label: projectSettings.VendorNameInputColumnName,
                value: projectSettings.VendorNameInputColumnName,
            },
            VendorPNInputColumnName: {
                label: projectSettings.VendorPNInputColumnName,
                value: projectSettings.VendorPNInputColumnName,
            },
            ShortDescriptionInputColumnName: {
                label: projectSettings.ShortDescriptionInputColumnName,
                value: projectSettings.ShortDescriptionInputColumnName,
            },
            LongDescriptionInputColumnName: {
                label: projectSettings.LongDescriptionInputColumnName,
                value: projectSettings.LongDescriptionInputColumnName,
            },
            CustomColumnName1: {
                label: projectSettings.CustomColumnName1,
                value: projectSettings.CustomColumnName1,
            },
            CustomColumnName2: {
                label: projectSettings.CustomColumnName2,
                value: projectSettings.CustomColumnName2,
            },
            CustomColumnName3: {
                label: projectSettings.CustomColumnName3,
                value: projectSettings.CustomColumnName3,
            },
        };
        return mapCustomInputs;
    };
    let validateStatus = [];
    const ValidateMapInputs = (inputName, selectValue) => {
        const selectedValues = Object.values(fetchAllInputValues(projectSettings));
        const filteredValues = selectedValues.filter((value, index) => {
            return (
                Object.keys(fetchAllInputValues(projectSettings))[index] !== inputName
            );
        });
        let containsselectValue;
        if (selectValue) {
            containsselectValue = filteredValues.some(
                (item) => item.value === selectValue
            );
        } else {
            containsselectValue = false;
        }

        validateStatus.push(containsselectValue);
        return containsselectValue;
    };
    //#endregion Validte Map Inputs

    //#region project settings save function
    const handleProjectSettings = () => {
        const userId = helper.getUser();
        if (!projectSettings.CustomerCode || !projectSettings.ProjectCode) {
            toast.error("Please select the project");
            return;
        }
        if (validateStatus.includes(true)) {
            toast.error(
                "Input column should not be same as others, Please clear the error before saving data...!"
            );
            return;
        }
        if (
            (!projectSettings.CustomColumnName1 &&
                projectSettings.CustomColumnName2) ||
            (!projectSettings.CustomColumnName2 && projectSettings.CustomColumnName3)
        ) {
            toast.error(
                "You can not selecet column name2 without selecting column name1 or column name3 without selecting column name2...!"
            );
            return;
        }

        setState({
            ...state,
            loading: true,
            spinnerMessage: "Please wait while saving the settings...",
        });
        const payload = { ...projectSettings, UserID: userId };
        projectService
            .updateProjectSettings(payload)
            .then((resp) => {
                setState({ ...state, loading: false });
                toast.success("Project settings saved successfully...!");
            })
            .catch((e) => {
                console.log(e);
            });
    };
    //#endregion

    //#region Cancel function
    const cancelAllSettings = () => {
        projectService
            .readProjectSettings(
                projectSettings.CustomerCode,
                projectSettings.ProjectCode
            )
            .then((resp) => {
                setProjectSettings(resp.data);
            })
            .catch((e) => {
                setExpandedRow(null);
                setBackToInitianValue(projectSettings.CustomerCode, projectSettings.ProjectCode, helper.getUser());
                console.log(e);
            });
    };
    //#endregion

    const navigateProjectSettings = (CustomerCode, ProjectCode) => {
        let locationData =  {
            CustomerCode: CustomerCode,
            ProjectCode: ProjectCode,
            activeTab: 1,
          }
      
          sessionStorage.setItem("locationData", JSON.stringify(locationData));
        //   if(this.state.canAccessProjectBatchList){
            history.push({
              pathname: "/Allocation/editProjectSettings",
            });
        //   }
    }

    //#region main return
    return (
        <div className='main-prefix-page'>
            <LoadingOverlay
                active={state.loading}
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
                            {state.spinnerMessage}
                        </p>
                    </div>
                }
            >
                <div className='prefix-page-header'>
                    <div className='d-flex align-items-center'>
                        <i
                            className="far fa-arrow-alt-circle-left pointer pr-3"
                            style={{ fontSize: "15px" }}
                            onClick={goBackNavigation}
                        ></i>
                        <h2 className='m-0'>{findLocation === "viewProjectSettings" ? "View" : findLocation === "editProjectSettings" ? "Edit" : "Project"} Screen Settings</h2></div>
                </div>
                <Row className='prefix-page-row'>
                    {findLocation === "projectSettings" &&
                        <Col className='prifix-col prefix-col-left'>
                            <div className='project-list-div'>

                                <div className='list-table'>
                                    <Paper style={{ height: "100%", overflow: "hidden" }}>
                                        <TableContainer sx={{ width: '100%', overflow: 'auto', height: "100%" }} className='table-main-div'>
                                            <Table aria-label="sticky table table-responsive" className='prifix-table'>
                                                <TableHead className='custom-table-header'>
                                                    <TableRow>
                                                        {tableHeader.map((header, i) => (
                                                            <TableCell key={i} align={header.align} style={{ minWidth: `${header.width}` }}>
                                                                {header.name}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {state.customerData && state.customerData.map((project, i) => (
                                                        <React.Fragment key={i}>
                                                            <TableRow className={`${expandedRow === i && "rowBackgroundColor"}`}>
                                                                <TableCell align="center" onClick={() => handleExpand(i, project.CustomerCode)}>
                                                                    {expandedRow === i ? "(-)" : "(+)"}
                                                                </TableCell>
                                                                <TableCell onClick={() => handleExpand(i, project.CustomerCode)}>
                                                                    {project.CustomerCode}
                                                                </TableCell>
                                                            </TableRow>
                                                            {expandedRow === i && (
                                                                <TableRow>
                                                                    <TableCell colSpan={2}>
                                                                        <Table className='expand-table'>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell style={{ minWidth: "100%" }}>
                                                                                        Project Code
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {state.projectCodes && state.projectCodes.map((projCode, index) => (
                                                                                    <TableRow key={index} className={`${(project.CustomerCode === projectSettings.CustomerCode && projCode.ProjectCode === projectSettings.ProjectCode) && "rowBackgroundColor"}`}>
                                                                                        <TableCell style={{ minWidth: "100%" }} onClick={() => handleProjectData(project.CustomerCode, projCode.ProjectCode)}>
                                                                                            {projCode.ProjectCode}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </div>
                            </div>
                        </Col>
                    }
                    <Col className={`prifix-col ${findLocation !== "projectSettings" ? 'prefix-location-right' : 'prefix-col-right'}`}>
                        <div className='project-list-div'>
                            <div style={{ height: "100%" }}>
                                <div style={{ height: "100%" }}>
                                    <div className='select-project-details'>
                                        <div className="prefix-production-details">
                                            <div className='row-div'>
                                                <h6 className='m-0'>
                                                    Customer Code:{" "}
                                                </h6>
                                                &nbsp;
                                                <p id="CustomerCode" name="CustomerCode" className="m-0">
                                                    {projectSettings.CustomerCode}
                                                </p>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <div className='row-div'>
                                                <h6 className='m-0'>
                                                    Project Code:{" "}
                                                </h6>
                                                &nbsp;
                                                <p id="ProjectCode" name="ProjectCode" className="m-0">
                                                    {projectSettings.ProjectCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='prefix-list'>
                                        <div className='prefix-heading'><h5>Prefix to include in Long Description</h5></div>
                                        <div className='prefix-title-div'>
                                            <Row className='prefix-list-row'>
                                                <Col md={6}>
                                                    <div className='px-setting-div'>
                                                        <h6>MFR Name:</h6>
                                                        <span><input type="text" name="MFRNamePrefix" value={projectSettings.MFRNamePrefix}
                                                            onChange={handlePrefixInput} readOnly={findLocation === "viewProjectSettings"} /></span>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className='px-setting-div'>
                                                        <h6>MFR PN:</h6>
                                                        <span><input type="text" name="MFRPNPrefix" value={projectSettings.MFRPNPrefix}
                                                            onChange={handlePrefixInput} readOnly={findLocation === "viewProjectSettings"} /></span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className='prefix-list-row'>
                                                <Col md={6}>
                                                    <div className='px-setting-div'>
                                                        <h6>Vendor Name:</h6>
                                                        <span><input type="text" name="VendorNamePrefix" value={projectSettings.VendorNamePrefix}
                                                            onChange={handlePrefixInput} readOnly={findLocation === "viewProjectSettings"} /></span>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className='px-setting-div'>
                                                        <h6>Vendor PN:</h6>
                                                        <span><input type="text" name="VendorPNPrefix" value={projectSettings.VendorPNPrefix}
                                                            onChange={handlePrefixInput} readOnly={findLocation === "viewProjectSettings"} /></span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className='prefix-list-row'>
                                                <Col md={6}>
                                                    <div className='px-setting-div'>
                                                        <h6>Additional Info:</h6>
                                                        <span><input type="text" name="AdditionalInfoPrefix" value={projectSettings.AdditionalInfoPrefix}
                                                            onChange={handlePrefixInput} readOnly={findLocation === "viewProjectSettings"} /></span>
                                                    </div>
                                                </Col>
                                                <Col md={6}></Col>
                                            </Row>
                                        </div>
                                        <div className='prefix-heading'><h5> Include / Exclude Add. Info, MFR/Vendor Name and P/N in Short/Long Description</h5></div>
                                        <div className=''>
                                            <Row className='m-0 p-0 '>
                                                <Col md={6} className='prefix-title-div'>
                                                    <Row className='prefix-list-row'>
                                                        <Col md={6}>
                                                            <div className="d-flex align-items-center pb-1">
                                                                <div className="d-flex align-items-center">
                                                                    <h5>Long Description</h5>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="d-flex align-items-center pb-1">
                                                                <div className="d-flex align-items-center">
                                                                    <h5>Short Description</h5>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className='prefix-list-row'>
                                                        <Col md={6}>
                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeMFRNameInLongDesc"
                                                                            checked={projectSettings.IsToIncludeMFRNameInLongDesc}
                                                                            id="chkMFRNameToLong"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; MFR Name
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeMFRPNInLongDesc"
                                                                            checked={projectSettings.IsToIncludeMFRPNInLongDesc}
                                                                            id="chkMFRPNToLong"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; MFR PN
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeVendorNameInLongDesc"
                                                                            checked={projectSettings.IsToIncludeVendorNameInLongDesc}
                                                                            id="chkVendorNameToLong"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; Vendor Name
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeVendorPNInLongDesc"
                                                                            checked={projectSettings.IsToIncludeVendorPNInLongDesc}
                                                                            id="chkVendorPNToLong"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; Vendor PN
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeAdditionalInfoInLongDesc"
                                                                            checked={projectSettings.IsToIncludeAdditionalInfoInLongDesc}
                                                                            id="chkAddInfo"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; Additional Info
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeMFRNameInShortDesc"
                                                                            checked={projectSettings.IsToIncludeMFRNameInShortDesc}
                                                                            id="chkMFRNameToShort"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; MFR Name
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeMFRPNInShortDesc"
                                                                            checked={projectSettings.IsToIncludeMFRPNInShortDesc}
                                                                            id="chkMFRPNToShort"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; MFR PN
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeVendorNameInShortDesc"
                                                                            checked={projectSettings.IsToIncludeVendorNameInShortDesc}
                                                                            id="chkVendorNameToShort"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; Vendor Name
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeVendorPNInShortDesc"
                                                                            checked={projectSettings.IsToIncludeVendorPNInShortDesc}
                                                                            id="chkVendorPNToShort"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; Vendor PN
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center pb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="IsToIncludeAdditionalInfoInShortDesc"
                                                                            checked={projectSettings.IsToIncludeAdditionalInfoInShortDesc}
                                                                            id="chkAddInfo"
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    &nbsp; Additional Info
                                                                </div>
                                                            </div>
                                                        </Col>

                                                    </Row>
                                                </Col>
                                                <Col md={6} className='prefix-title-div'>
                                                    <div style={{ padding: "10px 15px" }}>
                                                        <div className="d-flex align-items-center pb-3">
                                                            <div className="d-flex align-items-center">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="IsToConvertAttributeValueToUppercase"
                                                                        checked={projectSettings.IsToConvertAttributeValueToUppercase}
                                                                        id="chkMFRNameToShort"
                                                                        onChange={handleCheckBox}
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                                &nbsp; Is To Convert Attribute Value, MFR, Vendor, Add Info To Uppercase?
                                                            </div>
                                                        </div>
                                                        {/* <div className="d-flex align-items-center pb-1 pt-2">
                                                            <div className="d-flex align-items-center">
                                                                <h5>Special Characters</h5>
                                                            </div>
                                                        </div> */}
                                                        <div className="d-flex align-items-center pb-1">
                                                            <div className="d-flex align-items-start" style={{ width: "100%" }}>
                                                                <div className='pl-3 pr-3' style={{ width: "30%" }}>
                                                                    <div className="d-flex align-items-center">
                                                                        <h5>Special Characters</h5>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="IsToConvertAttributeValueToUppercase"
                                                                        id="txt"
                                                                        style={{ width: "100%" }}
                                                                        value={specialCharacter}
                                                                        maxLength={5}
                                                                        onChange={(e) => setSpecialCharacter(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className='pl-2 pr-2' style={{ width: "15%", paddingTop: "28px" }}>
                                                                    <Button className='btn-special-char' style={{ width: "100%" }}
                                                                        onClick={addCharactersToArray}>Add <i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
                                                                </div>
                                                                <div className='pl-3 pr-3' style={{ width: "50%" }}>
                                                                    <div className="d-flex align-items-center">
                                                                        <h5>Exclude below characters from Attribute value</h5>
                                                                    </div>
                                                                    <Paper style={{ height: "100%", overflow: "hidden" }}>
                                                                        <TableContainer
                                                                            sx={{ width: "100%", overflow: "auto", maxHeight: "150px" }}
                                                                            className="table-main-div"
                                                                        >
                                                                            <Table
                                                                                aria-label="sticky table table-responsive"
                                                                                className="attribute-table"
                                                                            >
                                                                                <TableHead className="custom-table-header">
                                                                                    <TableRow>
                                                                                        <TableCell>
                                                                                            <b>Characters</b>
                                                                                        </TableCell>
                                                                                        <TableCell align="center">
                                                                                            <b>Delete</b>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {projectSettings.SpecialCharacters && projectSettings.SpecialCharacters.length !== 0 &&
                                                                                        projectSettings.SpecialCharacters.map((characters, i) => (
                                                                                            <TableRow key={i}>
                                                                                                <TableCell>{characters.Characters}</TableCell>
                                                                                                <TableCell align="center"><i className="fa fa-trash" aria-hidden="true"
                                                                                                    style={{ cursor: "pointer" }}
                                                                                                    onClick={() => deleteCharacter(characters.Characters)}></i></TableCell>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </Paper>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className='prefix-heading'><h5> Map Input Columns</h5></div>
                                        <div className='prefix-title-div'>
                                            <Row className='prefix-list-row'>
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="mapped-input-labels"> MFR Name </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}
                                                                options={state.customInputOptions}
                                                                name="MFRNameInputColumnName"
                                                                value={selectedValue(projectSettings.MFRNameInputColumnName)}
                                                                onChange={(data) => handleMapInputSelect(data, "MFRNameInputColumnName")}
                                                                onFocus={() => fetchCustomColumnNames("MFRNameInputColumnName")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("MFRNameInputColumnName", projectSettings.MFRNameInputColumnName) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="mapped-input-labels"> MFR PN </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                name="MFRPNInputColumnName"
                                                                options={state.customInputOptions}
                                                                value={selectedValue(projectSettings.MFRPNInputColumnName)}
                                                                onChange={(data) => handleMapInputSelect(data, "MFRPNInputColumnName")}
                                                                onFocus={() => fetchCustomColumnNames("MFRPNInputColumnName")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>

                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("MFRPNInputColumnName", projectSettings.MFRPNInputColumnName) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className='prefix-list-row'>
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="mapped-input-labels"> Vendor Name </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                options={state.customInputOptions}
                                                                name="VendorNameInputColumnName"
                                                                value={selectedValue(projectSettings.VendorNameInputColumnName)}
                                                                onChange={(data) => handleMapInputSelect(data, "VendorNameInputColumnName")}
                                                                onFocus={() => fetchCustomColumnNames("VendorNameInputColumnName")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("VendorNameInputColumnName", projectSettings.VendorNameInputColumnName) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="mapped-input-labels"> Vendor PN </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                name="VendorPNInputColumnName"
                                                                options={state.customInputOptions}
                                                                value={selectedValue(projectSettings.VendorPNInputColumnName)}
                                                                onChange={(data) => handleMapInputSelect(data, "VendorPNInputColumnName")}
                                                                onFocus={() => fetchCustomColumnNames("VendorPNInputColumnName")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>

                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("VendorPNInputColumnName", projectSettings.VendorPNInputColumnName) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className='prefix-list-row'>
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="mapped-input-labels"> Short Description </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                options={state.customInputOptions}
                                                                name="ShortDescriptionInputColumnName"
                                                                value={selectedValue(projectSettings.ShortDescriptionInputColumnName)}
                                                                onChange={(data) => handleMapInputSelect(data, "ShortDescriptionInputColumnName")}
                                                                onFocus={() => fetchCustomColumnNames("ShortDescriptionInputColumnName")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("ShortDescriptionInputColumnName", projectSettings.ShortDescriptionInputColumnName) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="mapped-input-labels"> Long Description </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                name="LongDescriptionInputColumnName"
                                                                options={state.customInputOptions}
                                                                value={selectedValue(projectSettings.LongDescriptionInputColumnName)}
                                                                onChange={(data) => handleMapInputSelect(data, "LongDescriptionInputColumnName")}
                                                                onFocus={() => fetchCustomColumnNames("LongDescriptionInputColumnName")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>

                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("LongDescriptionInputColumnName", projectSettings.LongDescriptionInputColumnName) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className='prefix-heading'><h5> Map Custom Input Columns</h5></div>
                                        <div className='prefix-title-div'>
                                            <Row className='prefix-list-row'>
                                                <Col md={4}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="gop-mfr-label"> Custom Column1 </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}
                                                                options={state.customInputOptions}
                                                                name="CustomColumnName1"
                                                                value={selectedValue(projectSettings.CustomColumnName1)}
                                                                onChange={(data) => handleMapInputSelect(data, "CustomColumnName1")}
                                                                onFocus={() => fetchCustomColumnNames("CustomColumnName1")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("CustomColumnName1", projectSettings.CustomColumnName1) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="gop-mfr-label"> Custom Column2 </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                name="CustomColumnName2"
                                                                options={!customColumnState.validateColumn2 ? state.customInputOptions : []}
                                                                value={selectedValue(projectSettings.CustomColumnName2)}
                                                                onChange={(data) => handleMapInputSelect(data, "CustomColumnName2")}
                                                                onFocus={() => fetchCustomColumnNames("CustomColumnName2")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />

                                                        </div>

                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("CustomColumnName2", projectSettings.CustomColumnName2) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                                            <Form.Label className="gop-mfr-label"> Custom Column3 </Form.Label>&nbsp;
                                                            <Select
                                                                styles={helper.customStyles}

                                                                options={!customColumnState.validateColumn3 ? state.customInputOptions : []}
                                                                name="CustomColumnName3"
                                                                value={selectedValue(projectSettings.CustomColumnName3)}
                                                                onChange={(data) => handleMapInputSelect(data, "CustomColumnName3")}
                                                                onFocus={() => fetchCustomColumnNames("CustomColumnName3")}
                                                                isSearchable={true}
                                                                isClearable={true}
                                                                className="custom-select-div select-custom-input"
                                                                isDisabled={findLocation === "viewProjectSettings" || findLocation === "editProjectSettings"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="error-message" style={{ fontSize: "11px", textAlign: "center", display: ValidateMapInputs("CustomColumnName3", projectSettings.CustomColumnName3) ? "block" : "none" }}>
                                                        Selected Input column should not be same as other
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        {findLocation === "viewProjectSettings" ?

<div
className="d-grid gap-2 d-md-flex justify-content-md-end p-3"
>
<Button
    varinat="primary"
    className="saveEditScreenData float-end mr-4 p-3"
    disabled={!canUserAccess}
    onClick={() => navigateProjectSettings(projectSettings.CustomerCode, projectSettings.ProjectCode)}
>
    Edit
</Button>
{/* <Button
    varinat="primary"
    className="saveEditScreenData float-end mr-4 p-3"
    onClick={cancelAllSettings}
>
    Cancel
</Button> */}
</div>
:
                                            <div
                                                className="d-grid gap-2 d-md-flex justify-content-md-end p-3"
                                            >
                                                <Button
                                                    varinat="primary"
                                                    className="saveEditScreenData float-end mr-4 p-3"
                                                    onClick={handleProjectSettings}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    varinat="primary"
                                                    className="saveEditScreenData float-end mr-4 p-3"
                                                    onClick={cancelAllSettings}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </LoadingOverlay>
        </div>
    )
    //#endregion
}


export default ProjectSetting;