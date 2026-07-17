import React, { useState, useEffect } from "react";  
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import { Modal, Button, Row, Col, Tab, Nav } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import grievanceService from "../../services/grievanceService";
import accessControlService from "../../services/accessControl.service";
import { FaFileExcel } from "react-icons/fa";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import moment from "moment";

toast.configure();

function ViewSuggestions () {
    //#region State
    const [loading] = useState(false);
    const [spinnerMessage] = useState("");
    const [state, setState] = useState({
        activeTab: "open", accessControl: [], customers: [], closedcustomers: [],
        index: 30, position: 0, columns: [], closedcolumns: [], modalData: {},
        filterValue: "", myfilterValue: "", defaultActiveKey: "open", spinnerMessage: "",
        loading: false, showModal: false, openSuggestions: [], closedSuggestions: [],
        currentTab: "open", fullScreen: false, SuggestionToManagementID: "",
        UserID: "dsm", subject: "", details: "", id: "",
    });
    const { activeTab, showModal, modalData, openSuggestions, closedSuggestions } = state;
    //#endregion

    //#region Get Today Date
    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    };
    const fixedDate = getTodayDate();
    const convertDateToISO = (dateString) => {
        const [day, month, year] = dateString.split(".");
        return `${year}-${month}-${day}`;
    };
    const isoDate = convertDateToISO(fixedDate);
    console.log(isoDate);
    //#endregion

    //#region useEffect
    useEffect(() => {
        loadSuggestions(); 
        loadSuggestionsid(); 
        loadClosedSuggestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //#endregion

    //#region Read Suggestions By Status open suggestions
    const loadSuggestions = () => {
        setState((prevState) => ({ ...prevState, loading: true }));
        const { UserID } = state;
        const Status = "o";
        grievanceService
            .ReadSuggestionsByStatus(UserID, Status)
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    openSuggestions: response.data,
                    loading: false,
                }));
            })
            .catch((e) => {
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region Read Suggestions By Status closed suggestions
    const loadClosedSuggestions = () => {
        setState((prevState) => ({ ...prevState, loading: true }));
        const { UserID } = state;
        const Status = "c";
        grievanceService
            .ReadSuggestionsByStatus(UserID, Status)
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    closedSuggestions: response.data,
                    loading: false,
                }));
            })
            .catch((e) => {
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region Read Suggestion By Id
    const loadSuggestionsid = () => {
        const { modalData } = state;
        const id = modalData.SuggestionToManagementID;
        const UserID = state.UserID;
        const myStatus = "o";
        if (!id) {
            return;
        }
        setState((prevState) => ({ ...prevState, loading: true }));
        grievanceService
            .ReadSuggestionById(id, UserID)
            .then((response) => {
                const newSuggestion = response.data;
                setState((prevState) => ({
                    ...prevState,
                    modalData: newSuggestion,
                    Status: myStatus,
                    loading: false,
                }));
            })
            .catch((e) => {
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region Update Suggestion Status To Closed
    const updateSuggestionStatusToClosed = () => {
        accessControlService
            .CanUserAccessPage(helper.getUser(), "Update Suggestion")
            .then((response) => {
                if (response.data) {
                    const { modalData } = state;
                    const id = modalData.SuggestionToManagementID;
                    const UserID = state.UserID;
                    const newStatus = "c";
                    if (!id) {
                        return;
                    }
                    setState((prevState) => ({ ...prevState, loading: true }));
                    grievanceService
                        .UpdateSuggestionStatusToClosed(id, UserID)
                        .then(() => {
                            setState((prevState) => ({
                                ...prevState,
                                modalData: {
                                    ...prevState.modalData,
                                    Status: newStatus,
                                },
                                loading: false,
                            }));
                            toast.success("Suggestion Closed successfully.");
                            loadSuggestions();
                            loadClosedSuggestions();
                            handleClose();
                        })
                        .catch((e) => {
                           
                            toast.error(e.response.data.Message, { autoClose: false });
                        });
                } else {
                    toast.error("Access Denied");
                }
            })
            .catch((e) => {
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region Export Suggestions To Excel
    const handleExport = () => {
        const { currentTab } = state;
        const UserID = "dsm";
        const Status = currentTab === "open" ? "o" : "c";
        setState((prevState) => ({ ...prevState, loading: true }));
        grievanceService
            .ExportSuggestionsToExcel(UserID, Status)
            .then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement("a");
                fileLink.href = fileURL;
                fileLink.download = `${currentTab === "open" ? "Open" : "Closed"}Suggestions.xlsx`;
                document.body.appendChild(fileLink);
                fileLink.click();
                document.body.removeChild(fileLink);
                window.URL.revokeObjectURL(fileURL);
                setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    spinnerMessage: "",
                }));
            })
            .catch((error) => {
                console.error("Error downloading file:", error);
                setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    spinnerMessage: "",
                }));
            });
    };
    //#endregion

    //#region Tab handling
    const handleTabChange = (tab) => {
        setState((prevState) => ({ ...prevState, currentTab: tab }));
    };
    const toggle = (key) => {
        setState((prevState) => ({ ...prevState, activeTab: key }));
    };
    //#endregion

    //#region Handle Row Click
    const handleRowClick = (rowData) => {
        setState((prevState) => ({
            ...prevState,
            modalData: rowData || {},
            showModal: true,
        }));
    };
    //#endregion

    //#region Handle Close
    const handleClose = () => {
        setState((prevState) => ({
            ...prevState,
            modalData: {},
            showModal: false,
        }));
    };
    //#endregion

    //#region Table Columns
    const createColumns = () => {
        return [
            {
                accessorKey: "Subject",
                header: "Subject",
                textAlign: "center",
                muiTableHeadCellProps: {
                    align: "left",
                    style: {
                        maxWidth: '25%', width: '25%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    },
                },
                muiTableBodyCellProps: {
                    align: "left",
                    style: {
                        maxWidth: '25%', width: '25%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    },
                },
                Cell: ({ row }) => (
                    <div style={{ cursor: 'pointer', color: '#5b47fb', textDecoration: 'underline' }} onClick={() => handleRowClick(row.original)}>
                        {row.original.Subject}
                    </div>
                ),
            },
            {
                accessorKey: "Details",
                header: "Details",
                textAlign: "center",
                muiTableHeadCellProps: {
                    align: "center",
                },
                muiTableBodyCellProps: {
                    align: "left",
                    style: {
                        maxWidth: '50%', width: '50%', whiteSpace: 'break-spaces',
                    },
                },
            },
            {
                accessorKey: "CreatedOn",
                header: "Date",
                Cell: ({ row }) => (
                    <div>
                        {moment(row.original.CreatedOn).format("DD-MM-YYYY")}
                    </div>
                ),
            },
        ];
    };
    //#endregion

    //#region Return
    return (
        <div>
            <LoadingOverlay active={loading} className="custom-loader" spinner={
                <div className="spinner-background">
                    <BarLoader css={{}} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
                    <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
                </div>
            }>
                <div>
                    <div className="mg-l-35 mg-r-25">
                        <Tab.Container defaultActiveKey={activeTab} onSelect={handleTabChange}>
                            <Row>
                                <Col md={3}>
                                    <Nav variant="pills" className="mg-l-0 mg-b-15 mg-t-0">
                                        <Nav.Item>
                                            <Nav.Link eventKey="open" onClick={() => toggle('open')}>Open</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="closed" onClick={() => toggle('closed')}>Closed</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                            </Row>
                            <Tab.Content>
                                <Tab.Pane eventKey="open">
                                    <ToolkitProvider keyField="id">
                                        {() => (
                                            <div className="mg-t-0">
                                                <div className="masters-material-table viewSuggestionsListTable">
                                                    <MaterialReactTable data={openSuggestions} columns={createColumns()} enableColumnFilterModes={false} enablePagination={false} enableColumnOrdering={false} enableStickyHeader={true} initialState={{ density: "compact" }} renderTopToolbarCustomActions={() => (
                                                            <Box sx={{display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap',}}>
                                                                <Tooltip title="Download Excel">
                                                                    <IconButton onClick={handleExport}>
                                                                        <FaFileExcel style={{ color: 'green', width: '1em', height: '1em' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </ToolkitProvider>
                                </Tab.Pane>
                                <Tab.Pane eventKey="closed">
                                    <ToolkitProvider keyField="id">
                                        {() => (
                                            <div className="mg-t-0">
                                                <div className="masters-material-table viewSuggestionsListTable">
                                                    <MaterialReactTable data={closedSuggestions} columns={createColumns()} enableColumnOrdering={false} enablePagination={false} enableStickyHeader={true} enableColumnFilterModes={false} initialState={{ density: "compact" }}
                                                        renderTopToolbarCustomActions={() => (<Box sx={{display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap'}}>
                                                                <Tooltip title="Download Excel">
                                                                    <IconButton onClick={handleExport}>
                                                                        <FaFileExcel style={{ color: 'green', width: '1em', height: '1em' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </ToolkitProvider>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
                <Modal show={showModal} onHide={handleClose} className="edit-gop-modal mymnmdl viewsug" backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Suggestion / Change Suggestion Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mymdldata">
                            <div className="row mt-2 mysgtdta">
                                <div className="col-md-1 txt-plce">
                                    <b>Subject :</b>
                                </div>
                                <div className="col-md-11">
                                    <div className="mydtlscnt"><input type="text" className="form-control mg-l-5 mg-r-15 myfrm" maxLength="20" placeholder="Subject" value={modalData.Subject || ''} readOnly /></div>
                                </div>
                            </div>
                            <div className="row mt-2 mb-4 mysgtdta">
                                <div className="col-md-1 txt-plce"><b>Details :</b></div>
                                <div className="col-md-11"><div className="mydtlscnt"><textarea placeholder="Details" rows="10" cols="210" className="mg-r-15 mytxtareacnt" value={modalData.Details || ''} readOnly /></div></div>
                            </div>
                            <div className="row mt-2 mb-4 mysgtdta">
                                <div className="col-md-1 txt-plce"><b>Date :</b></div>
                                <div className="col-md-4"><input type="date" className="form-control date-input" value={moment(modalData.CreatedOn).format('YYYY-MM-DD') || ''} readOnly /></div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {state.currentTab === "closed" ? (
                            <Button variant="secondary" onClick={handleClose} className="vewsubmit-button"><i className="fa fa-close mr-1"></i> Close Window</Button>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={handleClose} className="vewsubmit-button"><i className="fa fa-close mr-1"></i> Close Window </Button>
                                <Button variant="primary" type="submit" className="vewsubmit-button" onClick={updateSuggestionStatusToClosed}><i className="fa fa-save"></i> Close Suggestion </Button>
                            </>
                        )}
                    </Modal.Footer>
                </Modal>
            </LoadingOverlay>
        </div>
    );
    //#endregion
};
export default ViewSuggestions;