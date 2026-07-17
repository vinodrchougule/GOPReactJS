import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { getProjectBatches } from "../../actions/projectBatch/projectBatch";
import accessControlService from "../../services/accessControl.service";
import projectBatchService from "../../services/projectBatch.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import helper from "../../helpers/helpers";
import Moment from "moment";
import { Modal } from "react-bootstrap";
import ModernDatepicker from "react-modern-datepicker";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box } from '@mui/material';
import { CSVLink } from "react-csv";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function OnGoingProjectBatchList(props) {

    //#region State management using useState hook
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState("");
    const [canUserDeliverProjectBatch, setCanUserDeliverProjectBatch] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [customerCode, setCustomerCode] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [deliveredDate, setDeliveredDate] = useState("");
    const [deliveredCount, setDeliveredCount] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [projectBatches, setProjectBatches] = useState([]);
    const csvLink = useRef(null);
    const location = useLocation();
    const [isChangeProjectStatusModalVisible, setIsChangeProjectStatusModalVisible] = useState(false);
    const [canAccessViewProjectBatch, setCanAccessViewProjectBatch] = useState(false);
    //#endregion

    //#region Use Effect
    useEffect(() => {
        setLoading(true);
        setSpinnerMessage("Please wait while loading Project Batches List...");

        if (!helper.getUser()) {
            props.history.push({
                pathname: "/",
            });
            return;
        }
        if (location.state && location.state.ProjectID) {
            setProjectCode(location.state.ProjectID);
            fetchOnGoingProjectBatchesList(location.state.ProjectID);
        }
        canUserAccessPage("View Project Batch")
        fetchOnGoingProjectBatchesList();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //#endregion

    //#region fetching On Going Project Batches List Details from Web API
    const fetchOnGoingProjectBatchesList = () => {
        const { projectID } = props;
        const userID = helper.getUser();
        const status = 'O';

        projectBatchService.getProjectBatches(projectID, userID, status)
            .then((response) => {

                const responseData = response?.data;

                if (responseData && responseData.length > 0) {
                    const modifiedResponseData = responseData.map((obj) => ({
                        ...obj,
                        ReceivedDate: Moment(obj.ReceivedDate).format("DD-MMM-yyyy"),
                        PlannedDeliveryDate: Moment(obj.PlannedDeliveryDate).format("DD-MMM-yyyy"),
                    }));

                    modifiedResponseData.forEach((item) => {
                        item.setProjectBatches = true;
                    });

                    setCanUserDeliverProjectBatch(modifiedResponseData[0]?.canUserDeliverProjectBatch || false);
                    setProjectBatches(modifiedResponseData);
                }
            })
            .catch((error) => {
                toast.error(error.message, { autoClose: false });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    //#endregion

    //#region fetching Project page access
    const canUserAccessPage = (pageName) => {
        accessControlService
            .CanUserAccessPage(helper.getUser(), pageName)
            .then((response) => {
                setCanAccessViewProjectBatch(response.data);
            })
            .catch((error) => {
                toast.error(error.response?.data?.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region show Modal to Deliver Project Batch
    const showDeliverProjectBatchModal = (customerCode, projectCode, batchNo) => {
        setCustomerCode(customerCode);
        setProjectCode(projectCode);
        setBatchNo(batchNo);
        setIsChangeProjectStatusModalVisible(true);
        setDeliveredDate("");
        setDeliveredCount(0);
        setFormErrors({});
    };
    //#endregion

    //#region Get Selected Delivered Date
    const onChangeDeliveredDate = (date) => {
        setDeliveredDate(date);

        if (date !== "" && date !== null) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                deliveredDateError: "",
            }));
        }
    };
    //#endregion

    //#region Get Entered Delivered Count
    const onChangeDeliveredCount = (e) => {
        const value = e.target.value;
        setDeliveredCount(value);

        if (value !== "" && value !== null) {
            const updatedFormErrors = { ...formErrors, deliveredCountError: "" };
            setFormErrors(updatedFormErrors);
        }
    };
    //#endregion

    //#region Handle Deliver Project Batch Form Validation
    const handleDeliverProjectBatchFormValidation = () => {
        let formErrors = {};
        let isValidForm = true;
        if (!deliveredCount) {
            isValidForm = false;
            formErrors["deliveredCountError"] = "Delivered Count is required";
        }
        if (!deliveredDate) {
            isValidForm = false;
            formErrors["deliveredDateError"] = "Delivered Date is required";
        } else if (new Date(deliveredDate) > new Date()) {
            isValidForm = false;
            formErrors["deliveredDateError"] =
                "Delivered Date can't be a future date";
        }
        setFormErrors(formErrors);
        return isValidForm;
    };
    //#endregion

    //#region On Going Project List Export to CSV
    const onGoingProjectListCSVExport = () => {
        csvLink.current.link.click();
    };
    //#endregion

    //#region Transformed On Going Project List Data CSV For Export
    const getTransformedOnGoingProjectListDataForExport = () => {
        return projectBatches.map((row, index) => ({
            "Sl No.": index + 1,
            "Customer Code": row.CustomerCode,
            "Project Code": row.ProjectCode,
            "Batch No": row.BatchNo,
            "Scope": row.Scope,
            "Received Date": row.ReceivedDate || "N/A",
            "Planned Delivery Date": row.PlannedDeliveryDate || "N/A",
            "Input Count": row.InputCount,
            "Status": row.Status,

        }));
    };
    //#endregion

    //#region Export On Going Project List to Excel
    const exportOnGoungProjectBatchDataListToExcel = () => {
        setSpinnerMessage("Please wait while exporting On Going Project Batch List to excel...");
        setLoading(true);

        let fileName = "On Going Projects Batch List.xlsx";

        projectBatchService.exportProjectBatchListToExcel(projectID, "O")
            .then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement("a");
                fileLink.href = fileURL;
                fileLink.setAttribute("download", fileName);
                document.body.appendChild(fileLink);
                fileLink.click();
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.Message, { autoClose: false });
            });
    }
    //#endregion

    //#region Deliver Project Batch
    const deliverProjectBatch = (e) => {
        e.preventDefault();

        if (handleDeliverProjectBatchFormValidation()) {
            setSpinnerMessage("Please wait while delivering the Project Batch...");
            setModalLoading(true);

            const data = {
                CustomerCode: customerCode,
                ProjectCode: projectCode,
                BatchNo: batchNo,
                DeliveredDate: deliveredDate,
                DeliveredCount: deliveredCount,
                UserID: helper.getUser(),
            };
            projectBatchService.deliverProjectBatch(data)
                .then(() => {
                    setModalLoading(false);
                    toast.success("Project Batch Delivered Details updated successfully");
                    setIsChangeProjectStatusModalVisible(false);
                    setProjectBatches((prevBatches) =>
                        prevBatches.filter((batch) => batch.BatchNo !== batchNo)
                    );
                    getProjectBatches(projectID, helper.getUser(), "O");
                    props.toggle(2);
                })
                .catch((error) => {
                    setModalLoading(false);
                    toast.error(error.response?.data?.Message, { autoClose: false });
                });
        }
    };

    //#endregion

    const projectID = props.projectID;

    //#region Project Batches List Columns
    const projectBatchesListColumns = [
        {
            accessorKey: "SlNo",
            header: "Sl No.",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
        },
        {
            accessorKey: "ProjectID",
            header: "Project ID",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
            isHidden: true,
        },
        {
            accessorKey: "CustomerCode",
            header: "Customer Code",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
        },
        {
            accessorKey: "ProjectCode",
            header: "Project Code",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
        },
        {
            accessorKey: "BatchNo",
            header: "Batch No.",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
            classes: canAccessViewProjectBatch ? "demo-key-row1" : "",
            Cell: ({ row }) => {
                return (
                    <div
                        onClick={() => {
                            if (canAccessViewProjectBatch) {
                                history.push({
                                    pathname: "/Projects/ViewProjectBatch",
                                    state: {
                                        ProjectBatchID: row.original.ProjectBatchID,
                                        activeTab: 1,
                                    },
                                });
                            }
                        }}
                        style={{ cursor: "pointer", color: "blue", textDecoration: "underline", }}
                    >
                        {row.getValue("BatchNo")}

                    </div>
                );
            },
            style: {
                width: "7%",
            },
        },
        {
            accessorKey: "Scope",
            header: "Scope",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
        },
        {
            accessorKey: "ReceivedDate",
            header: "Received Date",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
        },
        {
            accessorKey: "PlannedDeliveryDate",
            header: "Planned Delivery Date",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
        },
        {
            accessorKey: "InputCount",
            header: "Input Count",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
        },
        {
            accessorKey: "Status",
            header: "Status",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
        },
        {
            accessorKey: "canUserDeliverProjectBatch",
            header: "Can User Deliver Project Batch",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
            isHidden: true,
        },
        {
            accessorKey: "deliver",
            header: "Deliver Project Batch",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { width: "9%" },
            },
            hidden: canUserDeliverProjectBatch ? false : true,
            Cell: ({ row }) => {
                return (
                    <div>
                        <i
                            className="fas fa-chevron-circle-right pointer"
                            title="Deliver Project Batch"
                            onClick={() =>
                                showDeliverProjectBatchModal(
                                    row.getValue("CustomerCode"),
                                    row.getValue("ProjectCode"),
                                    row.original.BatchNo
                                )
                            }
                            style={{ fontSize: "18px", color: "#5B47FB" }}
                        />
                    </div>
                );
            },
        },
    ];
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
                <div className="masters-material-table mg-l-50 mg-r-30 onGoingProjectListTable">
                    <MaterialReactTable
                        columns={projectBatchesListColumns
                            .map((column, index) => {
                                if (index === 1) {
                                    return { ...column, className: "first-column", isHidden: true };
                                }
                                return column;
                            })
                            .filter((column) => !column.isHidden)}
                        data={projectBatches}
                        className="onGoingProjectListTable"
                        initialState={{ density: "compact" }}
                        enableRowExpansion={false}
                        enableColumnFilterModes
                        enableColumnOrdering={false}
                        enableRowSelection={false}
                        enableFullScreenToggle={true}
                        enablePagination={false}
                        enableStickyHeader={true}
                        muiTableBodyRowProps={({ row }) => ({
                            sx: {
                                backgroundColor: row.index % 2 === 0
                                    ? "rgba(255, 255, 255, 1)"
                                    : "rgba(244, 246, 248, 1)",
                            },
                        })}
                        renderTopToolbarCustomActions={() => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                <Tooltip title="Download CSV">
                                    <IconButton onClick={onGoingProjectListCSVExport}>
                                        <FileDownloadIcon
                                            title="Export to CSV"
                                            style={{ color: "rgba(0, 0, 0, 0.54)", width: "1em", height: "1em" }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <CSVLink
                                    data={getTransformedOnGoingProjectListDataForExport()}
                                    filename="On Going Project Batches List.csv"
                                    ref={csvLink}
                                />
                                <Tooltip title="Export Excel">
                                    <IconButton onClick={exportOnGoungProjectBatchDataListToExcel}>
                                        <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                </div>
            </LoadingOverlay>
            <Modal
                show={isChangeProjectStatusModalVisible}
                dialogClassName="modal-width-produpload"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                enforceFocus={false}
            >
                <LoadingOverlay
                    active={modalLoading}
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
                    <Modal.Header>
                        <Modal.Title>Deliver Project Batch</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={deliverProjectBatch}>
                            <div className="row row-sm">
                                <div className="col-md-4 text-nowrap">
                                    <label htmlFor="CustomerCode">
                                        <b>Customer Code</b>{" "}
                                        <span className="text-danger asterisk-size">*</span>
                                    </label>
                                </div>
                                <div className="col-md-6 mg-t-7">
                                    <p id="CustomerCode" name="CustomerCode">
                                        {customerCode}
                                    </p>
                                </div>
                            </div>
                            <div className="row row-sm">
                                <div className="col-md-4 text-nowrap">
                                    <label htmlFor="ProjectCode">
                                        <b>Project Code</b>{" "}
                                        <span className="text-danger asterisk-size">*</span>
                                    </label>
                                </div>
                                <div className="col-md-6 mg-t-7">
                                    <p id="ProjectCode" name="ProjectCode">
                                        {projectCode}
                                    </p>
                                </div>
                            </div>
                            <div className="row row-sm">
                                <div className="col-md-4 text-nowrap">
                                    <label htmlFor="BatchNo">
                                        <b>Batch No.</b>{" "}
                                        <span className="text-danger asterisk-size">*</span>
                                    </label>
                                </div>
                                <div className="col-md-6 mg-t-7">
                                    <p id="BatchNo" name="BatchNo">
                                        {batchNo}
                                    </p>
                                </div>
                            </div>
                            <div className="row row-sm">
                                <div className="col-md-8">
                                    <div className="createProjectFloatingInput">
                                        <FloatingLabel
                                            label={
                                                <>
                                                    Delivered Date <span className="text-danger">*</span>
                                                </>
                                            }
                                            className="float-hidden float-select">
                                            <div className="form-field-div">
                                                <div className="form-control date-field-width" style={{ width: "100%" }}>
                                                    <ModernDatepicker
                                                        date={deliveredDate}
                                                        format={"DD-MMM-YYYY"}
                                                        onChange={(date) => onChangeDeliveredDate(date)}
                                                        placeholder={"Select Delivered Date"}
                                                        className="color"
                                                        minDate={new Date(1900, 1, 1)}
                                                    />
                                                </div>
                                                <span
                                                    className="btn btn-secondary"
                                                    onClick={() => setDeliveredDate("")}
                                                >
                                                    <i
                                                        className="far fa-window-close"
                                                        title="Clear Delivered Date"
                                                    ></i>
                                                </span>
                                            </div>
                                            <div className="error-message">
                                                {formErrors["deliveredDateError"]}
                                            </div>
                                        </FloatingLabel>
                                    </div>
                                </div>
                            </div>
                            <div className="row row-sm mg-t-20">
                                <div className="col-md-8">
                                    <div className="createProjectFloatingInput">
                                        <FloatingLabel
                                            label={
                                                <>
                                                    Delivered Count <span className="text-danger">*</span>
                                                </>
                                            }
                                            className="float-hidden float-select">
                                            <input type="number" className="form-control" id="DeliveredCount"
                                                name="DeliveredCount"
                                                value={deliveredCount}
                                                onChange={onChangeDeliveredCount}
                                                max="9999999"
                                                min="1"
                                            />
                                            <div className="error-message">
                                                {formErrors["deliveredCountError"]}
                                            </div>
                                        </FloatingLabel>
                                    </div>
                                </div>
                            </div>
                            <div className="row row-sm mg-t-30">
                                <div className="col-md-2 mg-l-25"></div>
                                <div className="col-md-3">
                                    <input type="submit" id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block" value="Update" />
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-3 mg-t-10 mg-lg-t-0">
                                    <span
                                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                                        onClick={() => setIsChangeProjectStatusModalVisible(false)}
                                    >
                                        Close
                                    </span>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </LoadingOverlay>
            </Modal>
        </div>
    );
    //#endregion
}

const mapStateToProps = (state) => {
    return {
        projectBatches: state.projectBatches,
    };
};

export default connect(mapStateToProps, { getProjectBatches })(
    OnGoingProjectBatchList
);
