import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";
import { Button, Modal } from "react-bootstrap";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from "react-csv";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../IncidentReport/IncidentReport.scss";
import { TextField } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import incidentRegisterService from "../../services/incidentRegister.service";
import Moment from "moment";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function IncidentReport(props) {
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [incidentReportTableData, setIncidentReportTableData] = useState([]);
  const [searchValues, setSearchValues] = useState([]);
  const [searchOn, setSearchOn] = useState("");
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showIncidentDetailsModal, setShowincidentDetailsModal] =
    useState(false);
  const [activeRowId] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const [incidentRegisterID, setIncidentRegisterID] = useState(0);
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
  const [noOfPeopleAffected, setNoOfPeopleAffected] = useState(0);
  const [impactOnBusiness, setImpactOnBusiness] = useState("");
  const [priority, setPriority] = useState("");
  const [departmentsAffectedCSV, setDepartmentsAffectedCSV] = useState("");
  const { showIncidentReport = true, showPagination = true } = props;
  const [showDeleteModal, setDeleteModal] = useState(false);

  //#region Handle Edit Incident
  const handleEditIncident = (incidentRegisterID) => {
    history.push({
      pathname: "/EditIncident",
      search: `?incidentRegisterID=${incidentRegisterID}`,
    });
  };
  //#endregion

  //#region Handle Edit Action On Incident
  const handleEditActionOnIncident = (incidentRegisterID) => {
    history.push({
      pathname: "/ActionOnIncident",
      search: `?incidentRegisterID=${incidentRegisterID}`,
    });
  };
  //#endregion

  //#region Handle Delete Incident
  const handleDeleteIncident = (
    incidentRegisterID,
    incidentNo,
    departmentResolvingIncident
  ) => {
    setIncidentRegisterID(incidentRegisterID);
    setIncidentNo(incidentNo);
    setDepartmentResolvingIncident(departmentResolvingIncident);
    setDeleteModal(true);
  };
  //#endregion

  //#region Close The modal
  const handleClose = () => {
    setShowincidentDetailsModal(false);
  };
  //#endregion

  //#region Show the Incident Details
  const handleIncidentClick = (incidentRegisterID) => {
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

  //#region Incident Report Columns
  const incidentReportColumns = () => [
    {
      accessorKey: "EditIncident",
      header: "Edit Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      enableColumnFilterModes: false,
      enableSorting: false,
      size: 100,
      enableColumnActions: false,
      Cell: ({ row }) =>
        row.original.IsConfirmed ? null : (
          <IconButton
            onClick={() => handleEditIncident(row.original.IncidentRegisterID)}
            sx={{ color: "#000000" }}
            className="editIncidentIcon"
          >
            <EditIcon />
          </IconButton>
        ),
    },
    {
      accessorKey: "EditActionOnIncident",
      header: "Edit Action On Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      enableColumnFilterModes: false,
      enableSorting: false,
      size: 100,
      enableColumnActions: false,
      Cell: ({ row }) =>
        row.original.IsConfirmed && !row.original.IsActionConfirmed ? (
          <IconButton
            onClick={() =>
              handleEditActionOnIncident(row.original.IncidentRegisterID)
            }
            sx={{ color: "#5b47fb" }}
            className="editActionOnIncidentIcon"
          >
            <EditIcon />
          </IconButton>
        ) : null,
    },
    {
      accessorKey: "DeleteIncident",
      header: "Delete Incident",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      enableColumnFilterModes: false,
      enableSorting: false,
      size: 100,
      enableColumnActions: false,
      Cell: ({ row }) =>
        row.original.IsConfirmed ? null : (
          <IconButton
            onClick={() =>
              handleDeleteIncident(
                row.original.IncidentRegisterID,
                row.original.IncidentNo,
                row.original.DepartmentResolvingIncident
              )
            }
            sx={{ color: "red" }}
            className="deleteIncidentIcon"
          >
            <DeleteIcon />
          </IconButton>
        ),
    },
    {
      accessorKey: "IncidentNo",
      header: "Incident No",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      size: 100,
      Cell: ({ row }) => (
        <span
          onClick={() => handleIncidentClick(row.original.IncidentRegisterID)}
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

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchIncidentReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  //#endregion

  //#region CSV export handler
  const handleIncidentReportCSVExport = () => {
    if (csvLink) {
      csvLink.link.click();
    }
  };
  //#endregion

  //#region Get transformed noun modifier data for CSV export
  const getTransformedIncidentReportDataForExport = () => {
    return incidentReportTableData;
  };
  //#endregion

  let csvLink;

  //#region Search On Change
  const handleSearchOnChange = (event) => {
    const { value } = event.target.value;
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        searchFieldError: "",
      }));
    }
    setSearchOn(event.target.value);
    fetchSearchValues(event.target.value);
  };
  //#endregion

  //#region Fetch Search Values of selected Search Field
  const fetchSearchValues = (searchOn) => {
    setSpinnerMessage("Please wait while loading Search Values...");
    setLoading(true);

    incidentRegisterService
      .readIncidentSearchValues(searchOn)
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.IncidentsSearchValues)
        ) {
          setSearchValues(response.data.IncidentsSearchValues);
        } else {
          setSearchValues([]);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  //#endregion

  //#region Selected Search Value
  const onChangeSearchValue = (e) => {
    const { value } = e.target.value;
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        searchValueError: "",
      }));
    }
    setSelectedSearchValue(e.target.value);
  };
  //#endregion

  //#region fetching Incident Report from Web API
  const fetchIncidentReport = () => {
    setSpinnerMessage("Please wait while loading Incident Report...");
    setLoading(true);

    incidentRegisterService
      .readAllIncidents(helper.getUser())
      .then((response) => {
        const incidents = response?.data?.["Incidents List"] || [];

        if (Array.isArray(incidents)) {
          const formattedArray = incidents.map((obj) => ({
            ...obj,
          }));

          setIncidentReportTableData(formattedArray);
        }
      })
      .catch((error) => {
        const message = error?.response?.data?.Message || error?.message || "";
        console.error(message);
        //toast.error(message, { autoClose: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region Fetch Search Result
  const fetchSearchresult = () => {
    if (handleValidation()) {
      setSpinnerMessage(
        "Please wait while loading Incident Report Search Result..."
      );
      setLoading(true);

      incidentRegisterService
        .readIncidentsBySearchFieldAndSearchValue(searchOn, selectedSearchValue)
        .then((response) => {
          const incidents = response?.data?.["IncidentsList"] || [];

          if (Array.isArray(incidents)) {
            const formattedArray = incidents.map((obj) => ({
              ...obj,
            }));

            setIncidentReportTableData(formattedArray);
          }
        })
        .catch((error) => {
          const message =
            error?.response?.data?.Message || error?.message || "";
          toast.error(message, { autoClose: false });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  //#endregion

  //#region Validate Search Field and Search Value is selected
  const handleValidation = () => {
    const formErrors = {};
    let isValidForm = true;

    if (!searchOn.trim()) {
      isValidForm = false;
      formErrors["searchFieldError"] = "Search Field is required";
    }

    if (!selectedSearchValue.trim()) {
      isValidForm = false;
      formErrors["searchValueError"] = "Search Value is required";
    }

    setFormErrors(formErrors);

    return isValidForm;
  };
  //#endregion

  //#region Delete modal methods
  const handleNo = () => {
    setDeleteModal(false);
  };

  const handleYes = () => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    setSpinnerMessage("Please wait while deleting incident details...");
    setLoading(true);

    const data = {
      IncidentRegisterID: incidentRegisterID,
      DepartmentResolvingIncident: departmentResolvingIncident,
      UserID: helper.getUser(),
    };

    incidentRegisterService
      .postDeleteIncident(data)
      .then((response) => {
        const successMessage = response?.data?.Msg;
        setLoading(false);
        setDeleteModal(false);
        toast.success(successMessage);
        fetchIncidentReport();
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.Msg;
        toast.error(errorMessage, { autoClose: false });
      });
  };
  //#endregion
  //#endregion

  //#region Export Incidents List to Excel
  const exportIncidentsListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Incidents List to excel...");
    setLoading(true);

    let fileName = "Incidents List.xlsx";

    incidentRegisterService
      .exportIncidentsListToExcel(helper.getUser())
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

  //#region return
  return (
    <div className="incidentReportMainContent">
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
        {showIncidentReport && (
          <div className="row mg-r-15 mg-l-10 mg-t-10">
            <div className="col-lg-4">
              <div className="incidentReportData">
                <FloatingLabel
                  label="Search On"
                  className="float-hidden float-select"
                >
                  <select
                    className="form-control"
                    id="searchOn"
                    name="searchOn"
                    value={searchOn}
                    onChange={handleSearchOnChange}
                  >
                    <option value="">---Select fields---</option>
                    <option value="incidentNo">Incident No.</option>
                    <option value="incidentType">Incident Type</option>
                    <option value="departmentResolvingIncident">
                      Department Resolving Incident
                    </option>
                    <option value="descriptionOfIncident">
                      Description of Incident
                    </option>
                    <option value="incidentStatus">Incident Status</option>
                    <option value="nameOfPersonReportingIncident">
                      Name of Person Reporting Incident
                    </option>
                    <option value="contactNo">Contact No.</option>
                    <option value="dateOfIncident">Date of Incident</option>
                    <option value="email">Email</option>
                    <option value="locationOfIncident">
                      Location of Incident
                    </option>
                    <option value="informationAffected">
                      Information Affected
                    </option>
                    <option value="equipmentAffected">
                      Equipment Affected
                    </option>
                    <option value="numberOfPeopleAffected">
                      Number of People Affected
                    </option>
                    <option value="impactOnBusiness">Impact on Business</option>
                    <option value="priority">Priority</option>
                    <option value="departmentAffected">
                      Department Affected
                    </option>
                    <option value="assetIDs">Asset IDs</option>
                    <option value="rootCause">Root Cause</option>
                    <option value="correctiveAction">Corrective Action</option>
                    <option value="preventiveAction">Preventive Action</option>
                    <option value="actionCompletedBy">
                      Action Completed By
                    </option>
                    <option value="actionDate">Action Date</option>
                    <option value="remarks">Remarks</option>
                  </select>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="error-message">
                {formErrors["searchFieldError"]}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="incidentReportData">
                <FloatingLabel
                  label="Search value"
                  className="float-hidden float-select"
                >
                  <select
                    className="form-control"
                    id="search"
                    name="search"
                    value={selectedSearchValue}
                    onChange={onChangeSearchValue}
                  >
                    <option value="">--Select--</option>
                    {searchValues.map((sv) => (
                      <option key={sv.SearchValue}>{sv.SearchValue}</option>
                    ))}
                  </select>
                </FloatingLabel>
                <span className="text-danger asterisk-size ml-2">*</span>
              </div>
              <div className="error-message">
                {formErrors["searchValueError"]}
              </div>
            </div>
            <div className="col-lg-4">
              <Button
                variant="secondary"
                className="incidentReportBtn"
                onClick={() => fetchSearchresult()}
              >
                <i className="fa fa-search"></i> Search
              </Button>
            </div>
          </div>
        )}
        <div
          style={{ border: "1px solid #cdd4e0" }}
          className="mg-l-25 mg-r-20 mg-t-15 mg-b-15 incidentReportMainText"
        >
          <div className="row mg-r-0 mg-l-0 mg-t-10 mg-b-15">
            <div className="col-lg-12">
              <div className="masters-material-table incidentReportTableContent">
                <MaterialReactTable
                  columns={incidentReportColumns()}
                  data={incidentReportTableData}
                  initialState={{
                    density: "compact",
                    pagination: { pageIndex: 0, pageSize: 100 },
                  }}
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
                  paginationDisplayMode={showPagination ? "pages" : false}
                  enableColumnFilterModes
                  enableColumnOrdering={false}
                  enableStickyHeader={true}
                  enableDensityToggle={false}
                  enableGlobalFilter={true}
                  enableRowSelection={false}
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
                        padding: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Tooltip title="Download CSV">
                        <IconButton onClick={handleIncidentReportCSVExport}>
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
                      <CSVLink
                        data={getTransformedIncidentReportDataForExport()}
                        headers={[
                          { label: "Incident No", key: "IncidentNo" },
                          { label: "Incident Type", key: "IncidentType" },
                          { label: "Department", key: "Department" },
                          { label: "Reporter Name", key: "ReporterName" },
                          { label: "Contact No", key: "ContactNo" },
                          { label: "Email", key: "Email" },
                          { label: "Insident Status", key: "InsidentStatus" },
                          { label: "Incident Date", key: "IncidentDate" },
                          { label: "Incident Time", key: "IncidentTime" },
                          { label: "Location", key: "Location" },
                          {
                            label: "Information Affected",
                            key: "InformationAffected",
                          },
                          {
                            label: "Equipment Affected",
                            key: "EquipmentAffected",
                          },
                          { label: "People Affected", key: "PeopleAffected" },
                          { label: "Business Impact", key: "BusinessImpact" },
                          { label: "Priority", key: "Priority" },
                          {
                            label: "Departments Affected",
                            key: "DepartmentsAffected",
                          },
                          { label: "AssetIDs", key: "AssetIDs" },
                        ]}
                        filename="Incident Report Data.csv"
                        ref={(r) => (csvLink = r)}
                        target="_blank"
                        style={{ display: "none" }}
                      />
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
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>

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
                Incident No.: <strong> {incidentNo}</strong>
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        aria-labelledby="contained-modal-title-vcenter"
        onHide={handleNo}
        backdrop="static"
        className="confirm-delete-modal"
        enforceFocus={false}
      >
        <Modal.Header>
          <Modal.Title>Delete Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Are you sure, to delete the Incident No. {incidentNo}?</p>
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
    </div>
  );
  //#endregion
}

export default IncidentReport;
