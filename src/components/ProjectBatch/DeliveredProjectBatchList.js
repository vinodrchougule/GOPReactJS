import React, { useState, useEffect, useRef } from "react";
import accessControlService from "../../services/accessControl.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import Moment from "moment";
import helper from "../../helpers/helpers";
import projectBatchService from "../../services/projectBatch.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box } from '@mui/material';
import { CSVLink } from "react-csv";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function DeliveredProjectBatchList (props) {

    //#region State management using useState hook
    const [loading, setLoading] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState("");
    const [deliveredProjectBatches, setDeliveredProjectBatches] = useState([]);
    const [canUserDeleteDeliveredProjectBatch, setCanUserDeleteDeliveredProjectBatch] = useState(false);
    const [canAccessViewProjectBatch, setCanAccessViewProjectBatch] = useState(false);
    const [canAccessPostProjectBatchDetails, setCanAccessPostProjectBatchDetails] = useState(false);
    const history = useHistory();
    const csvLink = useRef(null);

   
    //#endregion

    //#region Use Effect
    useEffect(() => {
        if (!helper.getUser()) {
            history.push({
                pathname: "/",
            });
            return;
        }

        canUserAccessPage("View Project Batch");
        canUserAccessPage("Post Project Batch Details");
        fetchDeliveredProjectBatches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //#endregion

    //#region fetching View Project page access
    const canUserAccessPage = (pageName) => {
        accessControlService
            .CanUserAccessPage(helper.getUser(), pageName)
            .then((response) => {
                if (pageName === "View Project Batch") {
                    setCanAccessViewProjectBatch(response.data);
                } else if (pageName === "Post Project Batch Details") {
                    setCanAccessPostProjectBatchDetails(response.data);
                }
            })
            .catch((e) => {
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region fetching Delivered Project Batches from Web API
    const fetchDeliveredProjectBatches = () => {
        const { projectID } = props;
        const userID = helper.getUser();
        const status = 'D';
        setLoading(true);
        setSpinnerMessage("Please wait while loading Delivered Project Batches List...");

        projectBatchService
            .getProjectBatches(projectID, userID, status)
            .then((response) => {
                if (response.data.length > 0) {
                    setCanUserDeleteDeliveredProjectBatch(response.data[0].canUserDeliverProjectBatch);
                }

                const formattedArray = response.data.map((obj) => ({
                    ...obj,
                    ReceivedDate: Moment(obj.ReceivedDate).format("DD-MMM-yyyy"),
                    DeliveredDate: Moment(obj.DeliveredDate).format("DD-MMM-yyyy"),
                }));

                setDeliveredProjectBatches(formattedArray);
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.Message, { autoClose: false });
            });
    };
    //#endregion

    //#region Transformed On Going Project List Data CSV For Export
    const getTransformedOnGoingProjectListDataForExport = () => {
        return deliveredProjectBatches.map((row) => ({
            "Sl No.": row.SlNo,
            "Customer Code": row.CustomerCode,
            "Project Code": row.ProjectCode,
            "Batch No": row.BatchNo,
            "Scope": row.Scope,
            "Received Date": row.ReceivedDate || "N/A",
            "Delivered Date": row.DeliveredDate || "N/A",
            "Input Count": row.InputCount,
            "Delivered Count": row.DeliveredCount,
            "Status": row.Status,
        }));
    };
    //#endregion

    //#region On Going Project List Export to CSV
    const onGoingProjectListCSVExport = () => {
        csvLink.current.link.click();
    };
    //#endregion

    //#region Export On Going Project List to Excel
    const exportDeliveredProjectBatchListToExcel = () => {
        const { projectID } = props;
        const status = 'D';

        setSpinnerMessage("Please wait while exporting Delivered Project Batch List to Excel...");
        setLoading(true);
        const fileName = "Delivered Project Batch List.xlsx";

        projectBatchService.exportProjectBatchListToExcel(projectID, status)
            .then((response) => {
                const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                const fileLink = document.createElement("a");
                fileLink.href = fileURL;
                fileLink.setAttribute("download", fileName);
                document.body.appendChild(fileLink);
                fileLink.click();
                fileLink.remove(); 
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                const errorMessage = e.response?.data?.Message || "Failed to export the Delivered Project Batch List.";
                toast.error(errorMessage, { autoClose: false });
            });
    };
    //#endregion

    //#region Delete Delivered Project Batch
    const handleDeleteDeliveredProjectBatch = (row) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete this Delivered Project Batch Details?\n\n` +
            `Customer Code: ${row.CustomerCode}\n` +
            `Project Code: ${row.ProjectCode}\n` +
            `Batch No.: ${row.BatchNo}`
        );

        if (confirmDelete) {
            projectBatchService
                .deleteDeliveredProjectBatch(row.CustomerCode, row.ProjectCode, row.BatchNo, helper.getUser())
                .then(() => {
                    toast.success("Delivered Project Batch deleted successfully.");
                    setDeliveredProjectBatches((prevBatches) =>
                        prevBatches.filter(
                          (batch) =>
                            batch.CustomerCode !== row.CustomerCode ||
                            batch.ProjectCode !== row.ProjectCode ||
                            batch.BatchNo !== row.BatchNo
                        )
                      );
                })
                .catch((e) => {
                    const errorMessage = e?.response?.data?.Message;
                    toast.error(errorMessage, { autoClose: false });
                });
        }
    };
    //#endregion
  
    //#region Post Project Batch Details
    const handlePostProjectBatchDetails = (row) => {
        history.push({
            pathname: "/Projects/PostProjectBatchDetails",
            state: {
                ProjectID: row.ProjectID,
                CustomerCode: row.CustomerCode,
                ProjectCode: row.ProjectCode,
                BatchNo: row.BatchNo,
                Scope: row.Scope,
                InputCount: row.InputCount,
                DeliveredDate: row.DeliveredDate,
                DeliveredCount: row.DeliveredCount,
            },
        });
    };
    //#endregion

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
            accessorKey: "DeliveredDate",
            header: "Delivered Date",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
            dataField: "DeliveredDate",

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
            accessorKey: "DeliveredCount",
            header: "Delivered Count",
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
            accessorKey: "IsPostProjectBatchDetailsExist",
            header: "Is Post Project Batch Details Exist",
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { whiteSpace: "nowrap" },
            },
            isHidden: true,
        },
        {
            accessorKey: "delete",
            header: "Delete",
            enableSorting: false,
            hidden: !canUserDeleteDeliveredProjectBatch,
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
            },
            Cell: ({ row }) => {
                const { original } = row;
                return (
                    <div>
                        
                            <i
                                className="fas fa-trash-alt pointer"
                                style={{ cursor: "pointer" }}
                                title="Delete Delivered Project Batch Details"
                                onClick={() => handleDeleteDeliveredProjectBatch(original)}
                            ></i>
                        
                    </div>
                );
            },
        },
        {
            accessorKey: "PostProjectBatchEntry",
            header: "Post Project Batch Entry",
            hidden: !canAccessPostProjectBatchDetails,
            enableSorting: false,
            muiTableHeadCellProps: {
                align: "center",
            },
            muiTableBodyCellProps: {
                align: "center",
                style: { width: "15%" },
            },
            Cell: ({ row }) => {
                const { original } = row;
                return (
                    <div>
                        <i
                            className="fas fa-file-alt pointer"
                            title="Enter Post Project Batch Details"
                            onClick={() => handlePostProjectBatchDetails(original)}
                        ></i>
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
                        data={deliveredProjectBatches}
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
                                    filename="Delivered Project Batch List.csv"
                                    ref={csvLink}
                                />
                                <Tooltip title="Export Excel">
                                    <IconButton onClick={exportDeliveredProjectBatchListToExcel}>
                                        <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    />
                </div>
            </LoadingOverlay>
        </div>
    );
    //#endregion
}
export default DeliveredProjectBatchList;