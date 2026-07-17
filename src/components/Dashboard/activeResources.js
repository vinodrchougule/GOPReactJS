import React, { useState, useEffect } from "react";
import helpers from "../../helpers/helpers";
import { useHistory } from "react-router-dom";
import dashboardService from "../../services/dashboard.service";
import Moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import ModernDatepicker from "react-modern-datepicker";
import LoadingOverlay from "react-loading-overlay";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
// import { CSVLink } from "react-csv";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function ActiveResources() {
  const history = useHistory();
  //const csvLink = useRef(null);
  const [resources, setResources] = useState([]);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [formErrors, setFormErrors] = useState({
    fromDateError: "",
    toDateError: "",
  });
  const [resourceProductivityDetails, setResourceProductivityDetails] =
    useState([]);
  const [expandedRows, setExpandedRows] = React.useState({});

  //#region useEffect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push("/");
      return;
    }
    fetchActiveResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Validating the From Date and To Date
  const handleDateValidation = () => {
    let errors = {};
    let isValid = true;

    if (fromDate || toDate) {
      if (!fromDate) {
        isValid = false;
        errors["fromDateError"] = "From Date is required.";
      }
      if (!toDate) {
        isValid = false;
        errors["toDateError"] = "To Date is required.";
      }
      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        isValid = false;
        errors["fromDateError"] = "From Date can't be later than To Date";
      }
    }
    setFormErrors(errors);
    return isValid;
  };
  //#endregion

  //#region Fetch Active Resources
  const fetchActiveResources = () => {
    if (!handleDateValidation()) return;

    setSpinnerMessage("Please wait while fetching Active Resources...");
    setLoading(true);

    dashboardService
      .ReadResources(fromDate, toDate)
      .then((response) => {
        if (!response.data.length) {
          setResources([]);
          setLoading(false);
          toast.error("No Data Found!!");
        } else {
          const formattedArray = response.data.map((obj) => ({
            ...obj,
            StartDate: Moment(obj.StartDate).format("DD-MMM-yyyy"),
            EndDate: Moment(obj.EndDate).format("DD-MMM-yyyy"),
          }));
          setResources(formattedArray);
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message);
      });
  };
  //#endregion

  // //#region On Going Project List Export to CSV
  // const activeResourcesListCSVExport = () => {
  //   csvLink.current.link.click();
  // };
  // //#endregion

  // //#region Transformed On Going Project List Data CSV For Export
  // const getTransformedActiveResourcesDataForExport = () => {
  //   return resources.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Resource Code": row.ResourceCode,
  //     "Resource Name": row.ResourceName,
  //     "Start Date": row.StartDate || "N/A",
  //     "End Date": row.EndDate || "N/A",
  //     "Production Completed Count": row.ProductionCompletedCount,
  //     "QC Completed Count": row.QCCompletedCount,
  //     "Hours Worked": row.HoursWorked,
  //   }));
  // };
  // //#endregion

  //#region  Get Selected From Date
  const onChangeFromDate = (date) => {
    setFromDate(date);
    setResources([]);
  };
  //#endregion

  //#region  Get Selected To Date
  const onChangeToDate = (date) => {
    setToDate(date);
    setResources([]);
  };
  //#endregion

  //#region Export Active Resources to Excel
  const exportActiveResourcesToExcel = () => {
    setSpinnerMessage(
      "Please wait while exporting active resources to excel...",
    );
    setLoading(true);

    dashboardService
      .exportActiveResourcesToExcel(fromDate, toDate, helpers.getUser())
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Active Resources.xlsx");
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message);
      });
  };
  //#endregion

  //#region Fetch Resource Productivity Details
  const fetchResourceProductivityDetails = (row, isExpand) => {
    if (!isExpand) {
      setLoading(false);
      return;
    }
    setSpinnerMessage(
      "Please wait while fetching Resource Productivity Details...",
    );
    setLoading(true);

    dashboardService
      .ReadResourceProductivityDetails(
        row.original.ResourceCode,
        fromDate,
        toDate,
      )
      .then((response) => {
        setResourceProductivityDetails(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Clear Date Fields
  const clearDates = () => {
    setFromDate(null);
    setToDate(null);
    setResources([]);
    setFormErrors({ fromDateError: "", toDateError: "" });
    fetchActiveResources();
  };
  //#endregion

  //#region Active Resources Table Columns
  const activeResourcesColumns = [
    {
      accessorKey: "SlNo",
      header: "Sl No",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("SlNo")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "ResourceCode",
      header: "Resource Code",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("ResourceCode")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "ResourceName",
      header: "Resource Name",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("ResourceName")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "StartDate",
      header: "Start Date",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("StartDate")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "EndDate",
      header: "End Date",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("EndDate")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "ProductionCompletedCount",
      header: "Production Completed Count",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("ProductionCompletedCount")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "QCCompletedCount",
      header: "QC Completed Count",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("QCCompletedCount")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "HoursWorked",
      header: "Hours Worked",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchResourceProductivityDetails(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("HoursWorked")}</span>
            </div>
          </Box>
        );
      },
    },
  ];
  //#endregion

  //#region Resource Productivity Details Table Columns
  const dateColumns = [
    {
      accessorKey: "DateWorked",
      header: "Date Worked",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => (
        <span>{Moment(cell.getValue()).format("DD-MMM-yyyy")}</span>
      ),
      filterFn: (row, filterValue) =>
        Moment(row.getValue("DateWorked"))
          .format("DD-MMM-yyyy")
          .includes(filterValue),
    },
    {
      accessorKey: "CustomerCode",
      header: "Cus Code",
      size: 100,
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
      accessorKey: "Activity",
      header: "Activity",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "ProductionCompletedCount",
      header: "Production Completed Count",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "ProductionTarget",
      header: "Production Target",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "QCCompletedCount",
      header: "QC Completed Count",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "QCTarget",
      header: "QC Target",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "HoursWorked",
      header: "Hours Worked",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ];
  //#endregion

  //#region return
  return (
    <div className="activeResourcesMainContent">
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader
              css={helpers.getcss()}
              color={"#38D643"}
              width={"350px"}
              height={"10px"}
              speedMultiplier={0.3}
            />
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="container-fluid">
          <div className="row mg-b-10 mg-t-20">
            <div className="col-md-4">
              <div className="row">
                <h5 style={{ marginLeft: "30px", marginTop: "7px" }}>
                  <b>Active Resources</b>
                </h5>
                <span className="icon-size mg-l-5">
                  <Link
                    to={{
                      pathname: "/Dashboard",
                    }}
                  >
                    <i
                      className="far fa-arrow-alt-circle-left"
                      title="Back to Dashboard"
                    ></i>
                  </Link>
                </span>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-4">
                  <div className="reportIncidentInputText activeResourcesDate">
                    <FloatingLabel
                      label={
                        <>
                          <b>From Date</b>
                          <span className="text-danger asterisk-size ml-2">
                            *
                          </span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <div className="form-control">
                        <ModernDatepicker
                          date={fromDate}
                          format={"DD-MMM-YYYY"}
                          onChange={(date) => onChangeFromDate(date)}
                          className="color"
                          minDate={new Date(1900, 1, 1)}
                        />
                      </div>
                    </FloatingLabel>
                  </div>
                  <div className="error-message">
                    {formErrors["fromDateError"]}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="reportIncidentInputText activeResourcesDate">
                    <FloatingLabel
                      label={
                        <>
                          <b>To Date</b>
                          <span className="text-danger asterisk-size ml-2">
                            *
                          </span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <div className="form-control">
                        <ModernDatepicker
                          date={toDate}
                          format={"DD-MMM-YYYY"}
                          onChange={(date) => onChangeToDate(date)}
                          className="color"
                          minDate={new Date(1900, 1, 1)}
                        />
                      </div>
                    </FloatingLabel>
                  </div>
                  <div className="error-message">
                    {formErrors["toDateError"]}
                  </div>
                </div>
                <div className="col-md-1">
                  <span
                    className="btn btn-primary pd-b-5"
                    onClick={clearDates}
                    title="Clear Date Fields"
                  >
                    <i className="far fa-window-close"></i>
                  </span>
                </div>
                <div className="col-md-3">
                  <button
                    onClick={() => fetchActiveResources(fromDate, toDate)}
                    className="btn btn-gray-700 btn-block"
                    style={{ height: "42px" }}
                  >
                    View Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="masters-material-table mg-l-15 mg-r-15 activeResourcesListTable">
            <MaterialReactTable
              columns={activeResourcesColumns}
              data={resources}
              className="activeResourcesListTable"
              initialState={{ density: "compact" }}
              enableRowExpansion={false}
              enableColumnFilterModes
              enableColumnOrdering={false}
              enableRowSelection={false}
              enableFullScreenToggle={true}
              enablePagination={false}
              enableStickyHeader={true}
              state={{ expanded: expandedRows }}
              onRowClick={({ row }) => {
                setExpandedRows((prevExpanded) => ({
                  ...prevExpanded,
                  [row.id]: !prevExpanded[row.id],
                }));
              }}
              muiTableBodyRowProps={({ row }) => ({
                sx: {
                  backgroundColor:
                    row.index % 2 === 0
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(244, 246, 248, 1)",
                },
              })}
              renderDetailPanel={({ row }) => (
                <Box
                  sx={{
                    padding: "16px",
                    backgroundColor: "rgba(244, 246, 248, 1)",
                  }}
                >
                  <Box sx={{ paddingBottom: "16px" }}>
                    <div
                      className="onGoingProjectListInnerListTable"
                      style={{ height: "250px", overflowY: "auto" }}
                    >
                      <MaterialReactTable
                        className="onGoingProjectListInnerActivitiesExpandTable"
                        style={{
                          height: "150px",
                          width: "250px",
                          overflowY: "auto",
                        }}
                        columns={dateColumns}
                        data={resourceProductivityDetails}
                        enableRowExpansion={false}
                        enableColumnFilterModes={false}
                        enableColumnOrdering={false}
                        enableRowSelection={false}
                        enableFullScreenToggle={true}
                        enablePagination={false}
                        enableStickyHeader={true}
                        muiTableBodyRowProps={({ row }) => ({
                          sx: {
                            backgroundColor:
                              row.index % 2 === 0
                                ? "rgba(255, 255, 255, 1)"
                                : "rgba(244, 246, 248, 1)",
                          },
                        })}
                      />
                    </div>
                  </Box>
                </Box>
              )}
              renderTopToolbarCustomActions={() => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {/* <Tooltip title="Download CSV">
                    <IconButton onClick={activeResourcesListCSVExport}>
                      <FileDownloadIcon
                        title="Export to CSV"
                        style={{ color: "rgba(0, 0, 0, 0.54)", width: "1em", height: "1em" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <CSVLink
                    data={getTransformedActiveResourcesDataForExport()}
                    filename="Active Resources.csv"
                    ref={csvLink}
                  /> */}
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportActiveResourcesToExcel}>
                      <FaFileExcel
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          fontSize: "1.3rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ActiveResources;
