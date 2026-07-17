import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from "react-csv";
import "../IncidentReport/IncidentReportDashboard.scss";
import incidentRegisterService from "../../services/incidentRegister.service";
import { Typography } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import Moment from "moment";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import accessControlService from "../../services/accessControl.service";

toast.configure();

export default function IncidentReportDashboard() {
  const [activeRowId] = useState(null);
  const history = useHistory();
  const [incidentsListModalTitle, setIncidentsListModalTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [incidentYears, setIncidentYears] = useState([]);
  const [selectedIncidentYear, setSelectedIncidentYear] = useState("");
  const [incidentsCountSummary, setIncidentsCountSummary] = useState([]);
  const [incidentListData, setIncidentListData] = useState([]);
  const [showIncidentsListModal, setShowIncidentsListModal] = useState(false);
  const [showIncidentDetailsModal, setShowincidentDetailsModal] =
    useState(false);
  const [incidentNo, setIncidentNo] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [departmentResolvingIncident, setDepartmentResolvingIncident] =
    useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("");
  const [nameOfPersonReportingIncident, setNameOfPersonReportingIncident] =
    useState("");
  const [contactNo, setContactNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [assetIDs, setAssetIDs] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [preventiveAction, setPreventiveAction] = useState("");
  const [informationAffected, setInformationAffected] = useState("");
  const [equipmentAffected, setEquipmentAffected] = useState("");
  const [noOfPeopleAffected, setNoOfPeopleAffected] = useState(
    new Date().getFullYear()
  );
  const [impactOnBusiness, setImpactOnBusiness] = useState("");
  const [priority, setPriority] = useState("");
  const [departmentsAffectedCSV, setDepartmentsAffectedCSV] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedIncidentType, setSelectedIncidentType] = useState("");
  const [selectedIncidentStatus, setSelectedIncidentStatus] = useState("");

  //#region Modal Open
  const handleIncidentListModalOpen = (department, incidentType, status) => {
    setSelectedDepartment(department);
    setSelectedIncidentType(incidentType);
    setSelectedIncidentStatus(status);

    if (status === "P")
      setIncidentsListModalTitle(
        "Pending Incidents from Department- " +
          department +
          " and Incident Type- " +
          incidentType +
          " and from Year- " +
          selectedIncidentYear
      );
    else if (status === "I")
      setIncidentsListModalTitle(
        "InProgress Incidents from Department- " +
          department +
          " and Incident Type- " +
          incidentType +
          " and from Year- " +
          selectedIncidentYear
      );
    else if (status === "C")
      setIncidentsListModalTitle(
        "Completed Incidents from Department- " +
          department +
          " and Incident Type- " +
          incidentType +
          " and from Year- " +
          selectedIncidentYear
      );
    else {
      if (selectedIncidentYear === "All") {
        setIncidentsListModalTitle(
          "All Incidents from Department- " +
            department +
            " and Incident Type- " +
            incidentType +
            " and from All Years"
        );
      } else
        setIncidentsListModalTitle(
          "All Incidents from Department- " +
            department +
            " and Incident Type- " +
            incidentType +
            " and from Year- " +
            selectedIncidentYear
        );
    }

    setSpinnerMessage("Please wait while loading Incidents List...");
    setLoading(true);
    incidentRegisterService
      .readIncidentsByIncidentYearAndStatus(
        department,
        incidentType,
        status,
        selectedIncidentYear
      )
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.IncidentsListByYearAndStatus)
        ) {
          setIncidentListData(response.data.IncidentsListByYearAndStatus);
        } else {
          setIncidentListData([]);
        }
        setLoading(false);
        setShowIncidentsListModal(true);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.Msg;
        toast.error(errorMessage, { autoClose: false });
      });
  };
  //#endregion

  //#region Modal Close
  const handleIncidentListModalClose = () => {
    setIncidentsListModalTitle("");
    setShowIncidentsListModal(false);
  };
  //#endregion

  //#region Incident Dashboard Columns
  const incidentDashboardColumns = [
    {
      accessorKey: "Department",
      header: "Department",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "IncidentType",
      header: "Incident Type",
      muiTableHeadCellProps: {
        align: "center",
        style: {
          width: "100%",
        },
      },
      muiTableBodyCellProps: {
        align: "left",
      },
    },
    {
      accessorKey: "PendingCount",
      header: "Pending Incidents",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) =>
        row.original.PendingCount === 0 ? (
          <span>0</span>
        ) : (
          <span
            className="pending-incidents"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() =>
              handleIncidentListModalOpen(
                row.original.Department,
                row.original.IncidentType,
                "P"
              )
            }
          >
            {row.original.PendingCount}
          </span>
        ),
    },
    {
      accessorKey: "InProgressCount",
      header: "In Progress Incidents",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) =>
        row.original.InProgressCount === 0 ? (
          <span>0</span>
        ) : (
          <span
            className="pending-incidents"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() =>
              handleIncidentListModalOpen(
                row.original.Department,
                row.original.IncidentType,
                "I"
              )
            }
          >
            {row.original.InProgressCount}
          </span>
        ),
    },
    {
      accessorKey: "CompletedCount",
      header: "Completed Incidents",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) =>
        row.original.CompletedCount === 0 ? (
          <span>0</span>
        ) : (
          <span
            className="pending-incidents"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() =>
              handleIncidentListModalOpen(
                row.original.Department,
                row.original.IncidentType,
                "C"
              )
            }
          >
            {row.original.CompletedCount}
          </span>
        ),
    },
    {
      accessorKey: "TotalCount",
      header: "Total",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) =>
        row.original.TotalCount === 0 ? (
          <span>0</span>
        ) : (
          <span
            className="pending-incidents"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() =>
              handleIncidentListModalOpen(
                row.original.Department,
                row.original.IncidentType,
                "X"
              )
            }
          >
            {row.original.TotalCount}
          </span>
        ),
    },
  ];
  //#endregion

  //#region Initialize table columns and data on mount
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [""]);
  //#endregionS

  //#region can User Access Page
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Incident Report Dashboard")
      .then((response) => {
        if (response.data) {
          fetchIncidentYears();
          setSelectedIncidentYear(new Date().getFullYear());
          fetchIncidentCountSummaryByYear(new Date().getFullYear());
        } else {
          history.push({ pathname: "/" });
          return;
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region CSV export handler
  const handleIncidentReportDashboardCSVExport = () => {
    if (csvLink) {
      csvLink.link.click();
    }
  };
  //#endregion

  //#region Get transformed Incident Report Dashboard data for CSV export
  const getTransformedIncidentReportDashboardDataForExport = () => {
    return incidentsCountSummary;
  };
  //#endregion
  let csvLink;

  //#region Fetch Incident Years
  const fetchIncidentYears = () => {
    setSpinnerMessage("Please wait while loading Incident Years...");
    setLoading(true);
    incidentRegisterService
      .readIncidentYears()
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.IncidentYearsList)
        ) {
          setIncidentYears(response.data.IncidentYearsList);
        } else {
          setIncidentYears([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.Msg;
        toast.error(errorMessage, { autoClose: false });
      });
  };
  //#endregion

  //#region on Change Incident Year
  const onChangeIncidentYear = (e) => {
    setSelectedIncidentYear(e.target.value);
    if (e.target.value === "All") fetchIncidentCountSummaryByYear("");
    else fetchIncidentCountSummaryByYear(e.target.value);
  };
  //#endregion

  //#region Fetch Incident Count Summary By Year
  const fetchIncidentCountSummaryByYear = (selectedIncidentYear) => {
    setSpinnerMessage(
      "Please wait while fetching Incident Dashboard details..."
    );
    setLoading(true);

    incidentRegisterService
      .readIncidentsCountSummaryByYear(helper.getUser(), selectedIncidentYear)
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.IncidentsCountSummary)
        ) {
          setIncidentsCountSummary(response.data.IncidentsCountSummary);
        } else {
          setIncidentsCountSummary([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.Msg;
        toast.error(errorMessage, { autoClose: false });
      });
  };
  //#endregion

  //#region Export Incident Dashboard List to Excel
  const exportIncidentsDashboardListToExcel = () => {
    setSpinnerMessage(
      "Please wait while exporting incident dashboard list to excel..."
    );
    setLoading(true);

    let fileName = "Incident Dashboard List.xlsx";
    incidentRegisterService
      .exportIncidentsStatusCountSummaryToExcel(selectedIncidentYear)
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
  };
  //#endregion

  //#region Export Incidents List to Excel
  const exportIncidentsListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Incidents List to excel...");
    setLoading(true);

    //let fileName = "Incidents List.xlsx";
    let fileName = incidentsListModalTitle + ".xlsx";

    incidentRegisterService
      .exportIncidentsListByYearAndStatusToExcel(
        selectedDepartment,
        selectedIncidentType,
        selectedIncidentStatus,
        selectedIncidentYear
      )
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
  };
  //#endregion

  //#region Show the Incident Details
  const handleIncidentNoClick = (incidentRegisterID) => {
    setSpinnerMessage("Please wait while fetching Incident Details...");
    setLoading(true);

    incidentRegisterService
      .readIncidentById(incidentRegisterID)
      .then((response) => {
        const data = response.data.IncidentDetails;
        setIncidentNo(data.IncidentNo);
        setIncidentType(data.IncidentType);
        setDepartmentResolvingIncident(data.DepartmentResolvingIncident);
        setIncidentDescription(data.IncidentDescription);
        setIncidentStatus(data.IncidentStatus);
        setNameOfPersonReportingIncident(data.NameOfPersonReportingIncident);
        setContactNo(data.ContactNo);
        setEmailID(data.EmailID);
        setIncidentDate(
          data.IncidentDate
            ? Moment(data.IncidentDate).format("DD-MMM-yyyy")
            : ""
        );
        setIncidentTime(data.IncidentTime);
        setIncidentLocation(data.IncidentLocation);
        setAssetIDs(data.AssetIDs);
        setRootCause(data.RootCause);
        setCorrectiveAction(data.CorrectiveAction);
        setPreventiveAction(data.PreventiveAction);
        setInformationAffected(data.InformationAffected);
        setEquipmentAffected(data.EquipmentAffected);
        setNoOfPeopleAffected(data.NoOfPeopleAffected);
        setImpactOnBusiness(data.ImpactOnBusiness);
        setPriority(data.Priority);
        setDepartmentsAffectedCSV(data.DepartmentsAffectedCSV);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });

    setShowincidentDetailsModal(true);
  };
  //#endregion

  //#region Incident List Columns
  const incidentListColumns = () => [
    {
      accessorKey: "IncidentNo",
      header: "Incident No",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
      Cell: ({ row }) => (
        <span
          onClick={() => handleIncidentNoClick(row.original.IncidentRegisterID)}
          style={{
            cursor: "pointer",
            color: "#007bff",
            textDecoration: "underline",
          }}
        >
          {row.original.IncidentNo}
        </span>
      ),
    },
    {
      accessorKey: "IncidentType",
      header: "Incident Type",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
    },
    {
      accessorKey: "DepartmentResolvingIncident",
      header: "Department Resolving Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "IncidentDescription",
      header: "Description of Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
    },
    {
      accessorKey: "IncidentStatus",
      header: "Insident Status",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
    },
    {
      accessorKey: "NameOfPersonReportingIncident",
      header: "Name of the Person Reporting Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "ContactNo",
      header: "Contact No.",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
    },
    {
      accessorKey: "EmailID",
      header: "Email",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "IncidentDate",
      header: "Date of Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        const formattedDate = rawDate
          ? Moment(rawDate).format("DD-MMM-YYYY")
          : "";
        return formattedDate;
      },
    },
    {
      accessorKey: "IncidentTime",
      header: "Time of Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
      Cell: ({ cell }) => {
        const rawTime = cell.getValue();
        return rawTime ? Moment(rawTime, "HH:mm:ss").format("hh:mm A") : "";
      },
    },
    {
      accessorKey: "IncidentLocation",
      header: "Location of Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "InformationAffected",
      header: "Information Affected",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "EquipmentAffected",
      header: "Equipment Affected",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "NoOfPeopleAffected",
      header: "Number of People Affected",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "ImpactOnBusiness",
      header: "Impact on Business",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "Priority",
      header: "Priority",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
    },
    {
      accessorKey: "AssetIDs",
      header: "Asset IDs",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
    },
    {
      accessorKey: "RootCause",
      header: "Root Cause",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
      size: 100,
    },
    {
      accessorKey: "CorrectiveAction",
      header: "Corrective Action",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
      size: 100,
    },
    {
      accessorKey: "PreventiveAction",
      header: "Preventive Action",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
      size: 100,
    },
    {
      accessorKey: "ActionCompletedByUserName",
      header: "Action Completed By",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
    },
    {
      accessorKey: "ActionCompletedOn",
      header: "Action Completed On",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
      Cell: ({ cell }) => {
        const rawDate = cell.getValue();
        const formattedDate = rawDate
          ? Moment(rawDate).format("DD-MMM-YYYY")
          : "";
        return formattedDate;
      },
    },
    {
      accessorKey: "Remarks",
      header: "Remarks",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
      size: 100,
    },
  ];
  //#endregion

  //#region Incident Details Modal Close
  const handleIncidentDetailsModalClose = () => {
    setShowincidentDetailsModal(false);
  };
  //#endregion

  //#region return
  return (
    <div className="incidentReportDashboardMainContent">
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
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <Row
          className="mg-t-5 mg-l-10 mg-r-15"
          style={{ justifyContent: "center" }}
        >
          <Col lg={10}>
            <div
              style={{ border: "1px solid #cdd4e0" }}
              className="mg-l-0 mg-r-0 mg-t-0 incidentTypeMainText"
            >
              <div className="col-md-12 pd-t-10 pd-b-10 ">
                <div className="mg-t-0">
                  <div className="masters-material-table incidentReportDashboardTypeTableContent">
                    <MaterialReactTable
                      data={incidentsCountSummary}
                      columns={incidentDashboardColumns}
                      renderEmptyRowsFallback={() => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                          }}
                        >
                          <img
                            src="../../../Icons/no data found.png" // Replace with your image URL
                            alt="No Data Found"
                            width={350}
                            height={350}
                          />
                          <Typography variant="h6" color="textSecondary">
                            No Incidents Found
                          </Typography>
                        </Box>
                      )}
                      muiPaginationProps={{
                        color: "primary",
                        shape: "rounded",
                        showRowsPerPage: false,
                        variant: "outlined",
                        sx: {
                          "& .MuiPaginationItem-root": {
                            borderColor: "#5B47FB",
                          },
                          "& .Mui-selected": {
                            backgroundColor: "#5B47FB",
                            color: "white",
                          },
                          "& .MuiPaginationItem-ellipsis": {
                            borderColor: "#5B47FB",
                          },
                          marginTop: "16px",
                        },
                      }}
                      paginationDisplayMode="pages"
                      enableColumnFilterModes={true}
                      enableColumnOrdering={false}
                      enableStickyHeader={true}
                      enableDensityToggle={true}
                      enableGlobalFilter={true}
                      enableRowSelection={false}
                      enablePagination={true}
                      initialState={{
                        density: "compact",
                        pagination: { pageIndex: 0, pageSize: 100 },
                      }}
                      getRowProps={(row) => ({
                        style: {
                          backgroundColor:
                            activeRowId === row.original.id
                              ? "#e0e0e0"
                              : "transparent",
                        },
                      })}
                      renderTopToolbarCustomActions={() => (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "16px",
                            padding: "0px",
                            flexWrap: "nowrap",
                            alignItems: "center",
                          }}
                        >
                          <Tooltip title="Download CSV">
                            <IconButton
                              onClick={handleIncidentReportDashboardCSVExport}
                            >
                              <FileDownloadIcon
                                title="Export to CSV"
                                style={{
                                  color: "#5B47FB",
                                  width: "1em",
                                  height: "1em",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          <label
                            style={{
                              whiteSpace: "nowrap",
                              marginBottom: "0px",
                              fontSize: "14px",
                            }}
                          >
                            Year of Incident
                          </label>
                          <select
                            className="form-control"
                            id="version"
                            name="version"
                            value={selectedIncidentYear}
                            onChange={onChangeIncidentYear}
                            style={{
                              width: "100px",
                              borderRadius: "5px",
                              height: "30px",
                            }}
                          >
                            {incidentYears.map((incidentYear) => (
                              <option
                                key={incidentYear.YearOfIncident}
                                value={incidentYear.YearOfIncident}
                              >
                                {incidentYear.YearOfIncident}
                              </option>
                            ))}
                          </select>

                          <CSVLink
                            data={getTransformedIncidentReportDashboardDataForExport()}
                            headers={[
                              { label: "Department", key: "Department" },
                              { label: "Incident Type", key: "IncidentType" },
                              {
                                label: "Pending Incidents",
                                key: "PendingCount",
                              },
                              {
                                label: "InProgress Incidents",
                                key: "InProgressCount",
                              },
                              { label: "Completed", key: "CompletedCount" },
                              { label: "Total", key: "TotalCount" },
                            ]}
                            filename="Incident Report Dashboard Data.csv"
                            ref={(r) => (csvLink = r)}
                            target="_blank"
                            style={{ display: "none" }}
                          />
                          <Tooltip title="Export Excel">
                            <IconButton
                              onClick={exportIncidentsDashboardListToExcel}
                            >
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
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          show={showIncidentsListModal}
          onHide={handleIncidentListModalClose}
          size="lg"
          centered
          className="incidentReportDashboardModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{incidentsListModalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="incidentReportDashboardModalBody">
            <MaterialReactTable
              columns={incidentListColumns()}
              data={incidentListData}
              paginationDisplayMode={false}
              enableColumnFilterModes
              enableColumnOrdering={false}
              enableStickyHeader={true}
              enableDensityToggle={false}
              enableGlobalFilter={true}
              enableRowSelection={false}
              getRowProps={(row) => ({
                style: {
                  backgroundColor:
                    activeRowId === row.original.id ? "#e0e0e0" : "transparent",
                },
              })}
              renderTopToolbarCustomActions={() => (
                <Box
                  sx={{
                    display: "flex",
                    gap: "16px",
                    padding: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportIncidentsListToExcel}>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleIncidentListModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showIncidentDetailsModal}
          onHide={() => setShowincidentDetailsModal(false)}
          size="lg"
          centered
          className="incidentReportModal"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Incident Details</Modal.Title>
            <div className="row">
              <div className="col-sm-12 mg-t-10">
                <h4>
                  Incident No.:
                  <strong> {incidentNo}</strong>
                </h4>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="reportIncidentMainContent">
              <div className="reportIncidentContent mg-r-20">
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Incident Type"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentType || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Department Resolving Incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={departmentResolvingIncident || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentText mg-t-15">
                  <FloatingLabel
                    label="Description of Incident"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield actionTextAreaRead"
                      multiline
                      rows={3}
                      variant="outlined"
                      value={incidentDescription || ""}
                      size="small"
                      style={{ width: "100%" }}
                      InputProps={{ readOnly: true }}
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Incident Status"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentStatus || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Name of the Person Reporting Incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={nameOfPersonReportingIncident || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Contact No."
                    className="float-hidden float-select"
                  >
                    <input
                      type="number"
                      className="form-control"
                      value={contactNo || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15 mg-b-15">
                  <FloatingLabel
                    label="Email"
                    className="float-hidden float-select"
                  >
                    <input
                      type="email"
                      className="form-control"
                      value={emailID || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="reportIncidentContent mg-r-20">
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Date of Incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentDate || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentSelectText mg-t-15">
                  <FloatingLabel
                    label="Time of incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentTime || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Location of Incident"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={incidentLocation || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Asset IDs"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      value={assetIDs || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentText mg-t-15 ">
                  <FloatingLabel
                    label="Root Cause"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield actionTextAreaRead"
                      multiline
                      rows={3}
                      variant="outlined"
                      value={rootCause || ""}
                      size="small"
                      style={{ width: "100%" }}
                      InputProps={{ readOnly: true }}
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentText mg-t-15 mg-b-10">
                  <FloatingLabel
                    label="Corrective Action"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield actionTextAreaRead"
                      multiline
                      rows={3}
                      variant="outlined"
                      value={correctiveAction || ""}
                      size="small"
                      style={{ width: "100%" }}
                      InputProps={{ readOnly: true }}
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="reportIncidentContent">
                <div className="reportIncidentText mg-t-15">
                  <FloatingLabel
                    label="Preventive Action"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield actionTextAreaRead"
                      multiline
                      rows={3}
                      variant="outlined"
                      value={preventiveAction || ""}
                      size="small"
                      style={{ width: "100%" }}
                      InputProps={{ readOnly: true }}
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Information Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control "
                      name="informationAffected"
                      value={informationAffected || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Equipment Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control "
                      name="EquipmentAffected"
                      value={equipmentAffected || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Number of People Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={noOfPeopleAffected || 0}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Impact on Business"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={impactOnBusiness || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Priority"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={priority || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
                <div className="reportIncidentInputText mg-t-15">
                  <FloatingLabel
                    label="Departments Affected"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      value={departmentsAffectedCSV || ""}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleIncidentDetailsModalClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
