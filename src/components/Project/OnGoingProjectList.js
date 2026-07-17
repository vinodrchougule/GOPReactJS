import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { readOnGoingProjectsList } from "../../actions/projects";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import projectService from "../../services/project.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import Moment from "moment";
import { Modal } from "react-bootstrap";
import ModernDatepicker from "react-modern-datepicker";
import dayjs from 'dayjs';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from '@mui/material';
//import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box } from '@mui/material';
//import { CSVLink } from "react-csv";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function OnGoingProjectList (props) {

  //#region State management using useState hook
  const [canAccessViewProject, setCanAccessViewProject] = useState(false);
  const [canAccessProjectBatchList, setCanAccessProjectBatchList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [canUserChangeProjectStatus, setCanUserChangeProjectStatus] = useState(false);
  const [isChangeProjectStatusModalVisible, setIsChangeProjectStatusModalVisible] = useState(false);
  const [customerCode, setCustomerCode] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [changeStatusTo, setChangeStatusTo] = useState([]);
  const [selectedChangeStatusTo, setSelectedChangeStatusTo] = useState("");
  const [deliveredDate, setDeliveredDate] = useState("");
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [holdOnDate, setHoldOnDate] = useState("");
  const [holdOnReason, setHoldOnReason] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [activeResources, setActiveResources] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [projectsDetailsExpanded, setProjectsDetailsExpanded] = useState([]);
  const [expandedProjectID, setExpandedProjectID] = useState("");
  const [activeTaskExpanded, setActiveTaskExpanded] = useState([]);
  const [index] = useState();
  //const csvLink = useRef(null);
  const history = useHistory();
  const [expandedRows, setExpandedRows] = React.useState({});
  const [resourceExpandedRows, setResourceExpandedRows] = React.useState({});
  const [onGoingProjects, setOnGoingProjects] = useState([]);
  //#endregion

  //#region Use Effect
  useEffect(() => {
    setSpinnerMessage("Please wait while loading On Going Projects List...");
    setLoading(true);

    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("View Project");
    canUserAccessPage("Project Batch List");

    if (sessionStorage.getItem("sortField") === null) {
      sessionStorage.setItem("sortField", "ReceivedDate");
      sessionStorage.setItem("sortOrder", "desc");
    }
    fetchOnGoingProjectList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  //#endregion

  //#region fetching On Going Project List page access
  const fetchOnGoingProjectList = () => {
    const data = {
      CustomerCode: props.customerCode,
      ProjectCode: props.projectCode,
      ProjectType: props.projectType,
      FromDate: props.fromDate,
      ToDate: props.toDate,
      UserID: helper.getUser(),
    };

    projectService.readOnGoingProjectsList(data)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          ReceivedDate: Moment(obj.ReceivedDate).format("DD-MMM-yyyy"),
          PlannedDeliveryDate: obj.PlannedDeliveryDate
            ? Moment(obj.PlannedDeliveryDate).format("DD-MMM-yyyy")
            : "",
          HoldOnDate: obj.HoldOnDate
            ? Moment(obj.HoldOnDate).format("DD-MMM-yyyy")
            : "",
        }));

        setCanUserChangeProjectStatus(canUserChangeProjectStatus);
        setOnGoingProjects(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      })
  };
  //#endregion

  //#region fetching Project page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "View Project") {
          setCanAccessViewProject(response.data);
        } else if (pageName === "Project Batch List") {
          setCanAccessProjectBatchList(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Going Project List Export to CSV
  // const onGoingProjectListCSVExport = () => {
  //   csvLink.current.link.click();
  // };
  //#endregion

  //#region Transformed On Going Project List Data CSV For Export
  // const getTransformedOnGoingProjectListDataForExport = () => {
  //   return data.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Customer Code": row.CustomerCode,
  //     "Project Code": row.ProjectCode,
  //     "Batches": row.NoOfBatches,
  //     "Activities": row.NoOfActivities,
  //     "Description": row.Scope,
  //     "Received Date": row.ReceivedDate || "N/A",
  //     "Planned Delivery Date": row.PlannedDeliveryDate || "N/A",
  //     "Project Type": row.ProjectType,
  //     "Input Count": row.InputCount,
  //     "Production Allocated Count": row.ProductionAllocatedCount,
  //     "Production Completed Count": row.ProductionCompletedCount,
  //     "Production Pending Count": row.ProductionPendingCount,
  //     "QC Allocated Count": row.QCAllocatedCount,
  //     "QC Completed Count": row.QCCompletedCount,
  //     "QC Pending Count": row.QCPendingCount,
  //     "Delivered Count": row.DeliveredCount,
  //     "Status": row.Status,
  //     "Resources": row.NoOfResources,
  //     "Hold On Date": row.HoldOnDate,
  //     "Hold On Reason": row.HoldOnReason,
  //   }));
  // };
  //#endregion

  //#region show Modal to Change Project Status
  const showChangeProjectStatusModal = (customerCode, projectCode) => {
    setCustomerCode(customerCode);
    setProjectCode(projectCode);
    setIsChangeProjectStatusModalVisible(true);
    setSelectedChangeStatusTo("");
    setDeliveredDate("");
    setDeliveredCount(0);
    setHoldOnDate("");
    setHoldOnReason("");
    setFormErrors({});
    fetchProjectStatusChangeToList(customerCode, projectCode);
  };
  //#endregion

  //#region Fetch Project Status Change To List
  const fetchProjectStatusChangeToList = (customerCode, projectCode) => {
    setSpinnerMessage("Please wait while fetching Project Change Status to List...");
    setModalLoading(true);

    projectService.fetchChangeProjectStatusToList(customerCode, projectCode)
      .then((response) => {
        setChangeStatusTo(response.data);
        setModalLoading(false);
      })
      .catch((e) => {
        setModalLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Get Selected Project Status
  const onChangeProjectStatus = (e) => {
    const { value } = e.target;
    setSelectedChangeStatusTo(value);

    if (value === "Delivered") {
      setHoldOnDate(null);
      setHoldOnReason("");
    } else if (value === "On Hold") {
      setDeliveredDate(null);
      setDeliveredCount(0);
    } else if (value === "In Process") {
      setHoldOnDate(null);
      setHoldOnReason(null);
      setDeliveredDate(null);
      setDeliveredCount(0);
    }

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        changeStatusToError: "",
      }));
    }
  };
  //#endregion

  //#region Get Selected Delivered Date
  const onChangeDeliveredDate = (date) => {
    const formattedDate = dayjs(date, "DD-MM-YYYY", true);
    if (!formattedDate.isValid()) {
      alert("Please enter the date in DD-MM-YYYY format.");
    }

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
    setDeliveredCount(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      const updatedFormErrors = { ...formErrors, deliveredCountError: "" };
      setFormErrors(updatedFormErrors);
    }
  };
  //#endregion

  //#region On Change Hold On Date
  const onChangeHoldOnDate = (date) => {
    setHoldOnDate(date);

    if (date !== "" && date !== null) {
      const updatedFormErrors = { ...formErrors, holdOnDateError: "" };
      setFormErrors(updatedFormErrors);
    }
  };
  //#endregion

  //#region On Change Hold On Reason
  const onChangeHoldOnReason = (e) => {
    const value = e.target.value;

    setHoldOnReason(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        holdOnReasonError: "",
      }));
    }
  };
  //#endregion

  //#region handle Change Project Status Form Validation
  const handleChangeProjectStatusFormValidation = () => {

    let formErrors = {};
    let isValidForm = true;

    if (!selectedChangeStatusTo) {
      isValidForm = false;
      formErrors["changeStatusToError"] = "Change Status To is required";
    }

    if (selectedChangeStatusTo === "On Hold") {
      if (!holdOnDate) {
        isValidForm = false;
        formErrors["holdOnDateError"] = "Hold on Date is required";
      } else if (new Date(holdOnDate) > new Date()) {
        isValidForm = false;
        formErrors["holdOnDateError"] = "Hold on Date can't be a future date";
      }

      if (!holdOnReason) {
        isValidForm = false;
        formErrors["holdOnReasonError"] = "Reason to Hold on is required";
      }
    }

    if (selectedChangeStatusTo === "Delivered") {
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
    }

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Clear Delivered Date
  const clearDeliveredDate = () => {
    setDeliveredDate("");
  };
  //#endregion

  //#region Clear Hold On Date
  const clearHoldOnDate = () => {
    setHoldOnDate("");
  };
  //#endregion

  //#region Change Project Status
  const changeProjectStatus = (e) => {
    e.preventDefault();

    if (handleChangeProjectStatusFormValidation()) {
      setSpinnerMessage("Please wait while changing the Project Status...");
      setModalLoading(true);

      const projectStatusChangedData = {
        CustomerCode: customerCode,
        ProjectCode: projectCode,
        ChangeStatusTo: selectedChangeStatusTo,
        DeliveredDate: deliveredDate,
        DeliveredCount: deliveredCount,
        OnHoldReason: holdOnReason,
        OnHoldDate: holdOnDate,
        UserID: helper.getUser(),
      };
      projectService
        .ChangeProjectStatus(projectStatusChangedData)
        .then(() => {
          toast.success("Project Status Changed Successfully");
          props.readOnGoingProjectsList(helper.getUser());

          setModalLoading(false);
          setIsChangeProjectStatusModalVisible(false);
        })
        .catch((error) => {
          setModalLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Fetch Activities of Selected Customer Code and Project Code
  const fetchProjectsActivities = (row, isExpand) => {
    if (!isExpand) {
      projectsDetailsExpanded([]);
      setLoading(false);
      return;
    }
    setSpinnerMessage("Please wait while fetching Project Task Details...");
    setLoading(true);

    projectService
      .fetchProjectActivityDetils(row.original.ProjectID)
      .then((response) => {
        setActiveTaskExpanded([]);
        setActiveTasks(response.data);
        setProjectsDetailsExpanded([row.original.ProjectID]);
        setExpandedProjectID(row.original.ProjectID);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Fetch Resources of Selected Customer Code, Project Code and Task
  const fetchResources = (row, isExpand) => {
    if (!isExpand) {
      activeTaskExpanded({});
      setLoading(false);
      return;
    }
    setSpinnerMessage("Please wait while fetching Resource Details...");
    setLoading(true);
    console.log(row)
    const ProjectActivityID = row.original.ProjectActivityID;

    projectService
      .readProjectActivityResourcesWithHoursWorked(expandedProjectID, ProjectActivityID)
      .then((response) => {
        setActiveResources(response.data);
        setActiveTaskExpanded(row.SlNo)
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Navigate to project settings page
  const showProjectSetingPage = (row) => {
    const locationData = {
      CustomerCode: row.CustomerCode,
      ProjectCode: row.ProjectCode,
      activeTab: 1,
    };

    sessionStorage.setItem("locationData", JSON.stringify(locationData));
    if (canAccessProjectBatchList) {
      history.push({
        pathname: "/Allocation/viewProjectSettings",
      });
    }
  };
  //#endregion

  //#region Export On Going Project List to Excel
  const exportOnGoungProjectDataListToExcel = () => {
    setSpinnerMessage("Please wait while exporting On Going Project List to excel...");
    setLoading(true);

    let fileName = "On Going Project List.xlsx";

    var data = {
      CustomerCode: props.customerCode,
      ProjectCode: props.projectCode,
      ProjectType: props.projectType,
      FromDate: props.fromDate,
      ToDate: props.toDate,
      UserID: helper.getUser(),
    };

    projectService.exportOnGoingProjectListToExcel(data)
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

  //#region Project List Table
  const data = onGoingProjects.slice(0, index).map((items) => {
    items.viewAction = "View Project Settings";
    return items;
  });

  const projectListColumns = [
    {
      accessorKey: "SlNo",
      header: "Sl No",
      muiTableHeadCellProps: {
        align: "center",
        style: { width: "110px", minWidth: "110px", maxWidth: "110px" },
      },
      muiTableBodyCellProps: {
        align: "center",
        style: { width: "110px", minWidth: "110px", maxWidth: "110px" },
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
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
      accessorKey: "ProjectID",
      header: "Project ID",
      muiTableHeadCellProps: {
        align: "left",
      },
      muiTableBodyCellProps: {
        align: "left",
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
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];

        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("CustomerCode")}</span></div>

          </Box>
        );
      }
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
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const onClickNavigate = (e) => {
          e.stopPropagation();
          if (canAccessViewProject) {
            history.push({
              pathname: "/Projects/ViewProject",
              state: {
                ProjectID: row.original.ProjectID,
                activeTab: 1,
              },
            });
          }
        };
        const handleExpandToggle = (e) => {
          e.stopPropagation();
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };

        return (
          <Box className="d-flex justify-content-center">
            <div
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
                position:"relative",
                left:"41%"
              }}
              onClick={onClickNavigate}
            >
              {row.getValue("ProjectCode")}
            </div>
            <div
              style={{
                cursor: "pointer",
                marginTop: "5px",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span style={{ width: "200px", display: "inline-block" }}></span>
            </div>

          </Box>
        );
      },
    },
    {
      accessorKey: "viewAction",
      header: "View Project Settings",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      classes: "demo-key-row1",
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];

        const handleExpandToggle = (e) => {
          e.stopPropagation();
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };
        const onIconClick = (e) => {
          e.stopPropagation();
          showProjectSetingPage(row.original);
        };

        return (
          <Box className="d-flex">
            <div style={{ position:"relative", left:"35%" }}>
              {row.original.IsProjectSettingsExist && (
                <img
                  src="../../../Icons/view-icon.png"
                  title="View Project Settings"
                  onClick={onIconClick}
                  alt="View Project Settings"
                  className="view-icon"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
              )}
            </div>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span style={{ width: "200px", display: "inline-block" }}></span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "NoOfBatches",
      header: "Batches",
      muiTableHeadCellProps: {
        align: "center",
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      },
      muiTableBodyCellProps: {
        align: "center",
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      },
      classes: canAccessProjectBatchList ? "demo-key-row1" : "",
      Cell: ({ row }) => {
        const { ProjectID, CustomerCode, ProjectCode, Scope } = row.original;

        const isExpanded = expandedRows[row.index];

        const handleExpandToggle = (e) => {
          e.stopPropagation();
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };
        const navigateToView = () => {
          if (canAccessProjectBatchList) {
            if (ProjectID && CustomerCode && ProjectCode && Scope) {
              history.push({
                pathname: "/Projects/ProjectBatchList",
                state: {
                  ProjectID,
                  CustomerCode,
                  ProjectCode,
                  Scope,
                  activeTab: 1,
                },
              });
            } else {
              toast.error("Invalid project details. Unable to navigate.");
            }
          }
        };

        return (
          <div className="d-flex">
            <div
              className={canAccessProjectBatchList ? "demo-key-row1" : ""}
              onClick={navigateToView} style={{position:"relative",
                left:"35%"}}
            >
              {row.getValue("NoOfBatches")}
            </div>
            <div
              style={{
                cursor: "pointer",
                
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span style={{ width: "200px", display: "inline-block" }}></span> {/* Empty space for expand toggle */}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "NoOfActivities",
      header: "Activities",
      muiTableHeadCellProps: {
        align: "center",
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      },
      muiTableBodyCellProps: {
        align: "center",
        style: { width: "150px", minWidth: "150px", maxWidth: "150px" },
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("NoOfActivities")}</span></div>
          </Box>
        );
      }
    },
    {
      accessorKey: "Scope",
      header: "Description",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
                color: 'blue',
                textDecoration: "underline",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("Scope")}</span></div>

          </Box>
        );
      },
    },
    {
      accessorKey: "ReceivedDate",
      header: "Received On",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("ReceivedDate")}</span></div>
          </Box>
        );
      }
    },
    {
      accessorKey: "PlannedDeliveryDate",
      header: "Planned Delivery Date",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("PlannedDeliveryDate")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "ProjectType",
      header: "Project Type",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("ProjectType")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "InputCount",
      header: "Input Count",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("InputCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "ProductionAllocatedCount",
      header: "Production Allocated",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("ProductionAllocatedCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "ProductionCompletedCount",
      header: "Prod. Completed",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("ProductionCompletedCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "ProductionPendingCount",
      header: "Prod. Pending",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("ProductionPendingCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "QCAllocatedCount",
      header: "QC Allocated",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("QCAllocatedCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "QCCompletedCount",
      header: "QC Completed",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("QCCompletedCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "QCPendingCount",
      header: "QC Pending",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("QCPendingCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "DeliveredCount",
      header: "Delivered",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("DeliveredCount")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "Status",
      header: "Status",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("Status")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: 'flag',
      header: (
        <i
          className="far fa-flag"
          style={{ cursor: 'pointer' }}
          aria-label="Expand/Collapse all"
        ></i>
      ),
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ row }) => {
        const isExpanded = expandedRows[row.index];
        const handleExpandToggle = () => {
          setExpandedRows({
            ...expandedRows,
            [row.index]: !isExpanded,
          });
          if (!isExpanded) {
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <i
              className="far fa-flag"
              style={{
                cursor: 'pointer',
                color: 'red',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ></i>
          </Box>
        );
      },
    },
    {
      accessorKey: "NoOfResources",
      header: "Resources",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("NoOfResources")}</span></div>
          </Box>
        );
      }
    },
    {
      accessorKey: "ChangeProjectStatus",
      header: "Change Project Status",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      hidden: !canUserChangeProjectStatus,
      Cell: ({ row }) => (
        <div>
          <i
            className="fas fa-chevron-circle-right pointer"
            title="Change Project Status"
            onClick={() =>
              showChangeProjectStatusModal(
                row.getValue("CustomerCode"),
                row.getValue("ProjectCode")
              )
            }
          ></i>
        </div>
      ),
    },
    {
      accessorKey: "HoldOnDate",
      header: "Hold On Date",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("HoldOnDate")}</span></div>

          </Box>
        );
      }
    },
    {
      accessorKey: "HoldOnReason",
      header: "Hold On Reason",
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
            fetchProjectsActivities(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            ><span>{row.getValue("HoldOnReason")}</span></div>

          </Box>
        );
      }
    },
  ];
  //#endregion

  //#region Active Resources Table
  const activeResourcesColumns = [
    {
      accessorKey: "SlNo",
      header: "Sl No",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },

    },
    {
      accessorKey: "UserID",
      header: "Resource Code",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "Username",
      header: "Resource Name",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "StartDate",
      header: "Start Date",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => (
        <div>{Moment(row.getValue("StartDate")).format("DD-MMM-yyyy")}</div>
      ),
    },
    {
      accessorKey: "EndDate",
      header: "End Date",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => `${Moment(row.getValue("EndDate")).format("DD-MMM-yyyy")}`,
    },
    {
      accessorKey: "ProductionCompletedCount",
      header: "Prod. Completed Count",
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
      accessorKey: "HoursWorked",
      header: "No. of Hours Worked",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ];
  //#endregion

  //#region Active Tasks Table
  const activeTasksColumns = [
    {
      accessorKey: "SlNo",
      header: "Sl No",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {row.getValue("SlNo")}
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "ProjectActivityID",
      header: "Project Activity ID",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      isHidden: true,
    },
    {
      accessorKey: "ProjectActivity",
      header: "Activity / Task",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {row.getValue("ProjectActivity")}
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "StartDate",
      header: "Start Date",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {Moment(row.getValue("StartDate")).format("DD-MMM-yyyy")}
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "EndDate",
      header: "End Date",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {Moment(row.getValue("EndDate")).format("DD-MMM-yyyy")}
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "ProductionCompletedCount",
      header: "Prod. Completed Count",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {row.getValue("ProductionCompletedCount")}
            </div>
          </Box>
        );
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
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {row.getValue("QCCompletedCount")}
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "HoursWorked",
      header: "No. of Hours Worked",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const isExpanded = resourceExpandedRows[row.index];
        const handleExpandToggle = () => {
          setResourceExpandedRows({
            ...resourceExpandedRows,
            [row.index]: !isExpanded,
          });

          if (!isExpanded) {
            fetchResources(row, true);
          }
        };
        return (
          <Box>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {row.getValue("HoursWorked")}
            </div>
          </Box>
        );
      },
    },
  ];
  //#endregion

  //#region main return
  return (
    <>
      {onGoingProjects.length > 0 ? (
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
              columns={projectListColumns
                .map((column, index) => {
                  if (index === 1) {
                    return { ...column, className: "first-column", isHidden: true };
                  }
                  return column;
                })
                .filter((column) => !column.isHidden)}
              data={data}
              className="onGoingProjectListTable"
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
                  backgroundColor: row.index % 2 === 0
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(244, 246, 248, 1)",
                },
              })}
              renderDetailPanel={({ row }) => (
                <Box sx={{ padding: "16px", backgroundColor: "rgba(244, 246, 248, 1)" }}>
                  <Box sx={{ paddingBottom: "16px" }}>
                    <strong>Tasks</strong>
                    <div
                      className="onGoingProjectListInnerListTable"
                      style={{ height: "200px", overflowY: "auto", width: "45%" }}
                    >
                      <MaterialReactTable
                        className="onGoingProjectListInnerActivitiesExpandTable"
                        style={{ height: "150px", width: "250px", overflowY: "auto" }}
                        columns={activeTasksColumns.filter((column) => !column.isHidden)}
                        data={activeTasks}
                        enableRowExpansion={false}
                        enableColumnFilterModes={false}
                        enableColumnOrdering={false}
                        enableRowSelection={false}
                        enableFullScreenToggle={true}
                        enablePagination={false}
                        enableStickyHeader={true}
                        state={{ expanded: resourceExpandedRows }}
                        onExpandedChange={(newExpanded) => setResourceExpandedRows(newExpanded)}
                        muiTableBodyRowProps={({ row }) => ({
                          sx: {
                            backgroundColor: row.index % 2 === 0
                              ? "rgba(255, 255, 255, 1)"
                              : "rgba(244, 246, 248, 1)",
                          },
                        })}
                        renderDetailPanel={({ row }) => (
                          <Box sx={{ padding: "16px", backgroundColor: "rgba(244, 246, 248, 1)" }}>
                            <strong>Resources / Project Team</strong>
                            <div
                              className="onGoingProjectListInnerListTable"
                              style={{ height: "200px", overflowY: "auto" }}
                            >
                              <MaterialReactTable
                                className="onGoingProjectListInnerExpandTable"
                                columns={activeResourcesColumns}
                                data={activeResources}
                                enableRowExpansion={false}
                                enableColumnFilterModes={false}
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
                                onExpandedChange={(newExpanded) => {
                                  if (newExpanded[row.index]) {
                                    const columnIndex = activeResourcesColumns.findIndex(
                                      (col) => col.accessor === "slno"
                                    );
                                    if (columnIndex !== -1) {
                                      fetchResources(row, true);
                                    }
                                  }
                                  setResourceExpandedRows(newExpanded);
                                }}
                              />
                            </div>
                          </Box>
                        )}
                      />
                    </div>
                  </Box>
                </Box>
              )}
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                  {/* <Tooltip title="Download CSV">
                    <IconButton onClick={onGoingProjectListCSVExport}>
                      <FileDownloadIcon
                        title="Export to CSV"
                        style={{ color: "rgba(0, 0, 0, 0.54)", width: "1em", height: "1em" }}
                      />
                    </IconButton>
                  </Tooltip> */}
                  {/* <CSVLink
                    data={getTransformedOnGoingProjectListDataForExport()}
                    filename="On Going Project List.csv"
                    ref={csvLink}s
                  /> */}
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportOnGoungProjectDataListToExcel}>
                      <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
          </div>
        </LoadingOverlay>
      ) : (
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
              columns={projectListColumns
                .map((column, index) => {
                  if (index === 1) {
                    return { ...column, className: "first-column", isHidden: true };
                  }
                  return column;
                })
                .filter((column) => !column.isHidden)}
              data={data}
              className="onGoingProjectListMainTable"
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
                  backgroundColor: row.index % 2 === 0
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(244, 246, 248, 1)",
                },
              })}
              renderDetailPanel={({ row }) => (
                <Box sx={{ padding: "16px", backgroundColor: "rgba(244, 246, 248, 1)" }}>
                  <Box sx={{ paddingBottom: "16px" }}>
                    <strong>Tasks</strong>
                    <div
                      className="onGoingProjectListInnerListTable"
                      style={{ height: "200px", overflowY: "auto", width: "45%" }}
                    >
                      <MaterialReactTable
                        className="onGoingProjectListInnerActivitiesExpandTable"
                        style={{ height: "150px", width: "250px", overflowY: "auto" }}
                        columns={activeTasksColumns.filter((column) => !column.isHidden)}
                        data={activeTasks}
                        enableRowExpansion={false}
                        enableColumnFilterModes={false}
                        enableColumnOrdering={false}
                        enableRowSelection={false}
                        enableFullScreenToggle={true}
                        enablePagination={false}
                        enableStickyHeader={true}
                        state={{ expanded: resourceExpandedRows }}
                        onExpandedChange={(newExpanded) => setResourceExpandedRows(newExpanded)}
                        
                        muiTableBodyRowProps={({ row }) => ({
                          sx: {
                            backgroundColor: row.index % 2 === 0
                              ? "rgba(255, 255, 255, 1)"
                              : "rgba(244, 246, 248, 1)",
                          },
                        })}
                        
                        renderDetailPanel={({ row }) => (
                          <Box sx={{ padding: "16px", backgroundColor: "rgba(244, 246, 248, 1)" }}>
                            <strong>Resources / Project Team</strong>
                            <div
                              className="onGoingProjectListInnerListTable"
                              style={{ height: "200px", overflowY: "auto" }}
                            >
                              <MaterialReactTable
                                className="onGoingProjectListInnerExpandTable"
                                columns={activeResourcesColumns}
                                data={activeResources}
                                enableRowExpansion={false}
                                enableColumnFilterModes={false}
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
                                onExpandedChange={(newExpanded) => {
                                  if (newExpanded[row.index]) {
                                    const columnIndex = activeResourcesColumns.findIndex(
                                      (col) => col.accessor === "slno"
                                    );
                                    if (columnIndex !== -1) {
                                      fetchResources(row, true);
                                    }
                                  }
                                  setResourceExpandedRows(newExpanded);
                                }}
                              />
                            </div>
                          </Box>
                        )}
                      />
                    </div>
                  </Box>
                </Box>
              )}
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                  {/* <Tooltip title="Download CSV">
                    <IconButton onClick={onGoingProjectListCSVExport}>
                      <FileDownloadIcon
                        title="Export to CSV"
                        style={{ color: "rgba(0, 0, 0, 0.54)", width: "1em", height: "1em" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <CSVLink
                    data={getTransformedOnGoingProjectListDataForExport()}
                    filename="On Going Project List.csv"
                    ref={csvLink}
                  /> */}
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportOnGoungProjectDataListToExcel}>
                      <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
          </div>
        </LoadingOverlay>
      )}
      <Modal
        show={isChangeProjectStatusModalVisible}
        dialogClassName="modal-width-produpload"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
      >
        <LoadingOverlay
          active={modalLoading}
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
          <Modal.Header>
            <Modal.Title>Project Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={changeProjectStatus}>
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
                <div className="col-md-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          <b>Change Status To</b><span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select">
                      <div className="form-field-div">
                        <select
                          className="form-control"
                          id="ChangeStatusTo"
                          name="ChangeStatusTo"
                          value={selectedChangeStatusTo}
                          onChange={onChangeProjectStatus}
                          placeholder="--Select--"
                        >
                          <option value="">--Select--</option>
                          {changeStatusTo.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      <div className="error-message">
                        {formErrors["changeStatusToError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
              </div>
              {selectedChangeStatusTo === "Delivered" && (
                <>
                  <div className="row row-sm mg-t-15">
                    <div className="col-md-6">
                      <div className="createProjectFloatingInput">
                        <FloatingLabel
                          label={
                            <>
                              <b>Delivered Date</b><span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select">
                          <div className="form-field-div flex-grow-1">
                            <div className="form-control date-field-width" style={{ width: "100%" }}>
                              <ModernDatepicker
                                date={deliveredDate}
                                format={"DD-MMM-YYYY"}
                                onChange={(date) => onChangeDeliveredDate(date)}
                                placeholder={"Enter/Select Delivered Date in dd-mon-yyyy format"}
                                className="color"
                                minDate={new Date(1900, 1, 1)}
                              />
                            </div>
                            <span
                              className="btn btn-secondary" onClick={clearDeliveredDate}
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
                  <div className="row row-sm mg-t-15">
                    <div className="col-md-6">
                      <div className="createProjectFloatingInput">
                        <FloatingLabel
                          label={
                            <>
                              <b>Delivered Count</b><span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select">
                          <input
                            type="number"
                            className="form-control"
                            id="DeliveredCount"
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
                </>
              )}
              {selectedChangeStatusTo === "On Hold" && (
                <>
                  <div className="row row-sm mg-t-15">
                    <div className="col-md-6 text-nowrap">
                      <div className="createProjectFloatingInput">
                        <FloatingLabel
                          label={
                            <>
                              <b>Hold On Date</b><span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select">
                          <div className="form-field-div flex-grow-1">
                            <div className="form-control date-field-width" style={{ width: "100%" }}>
                              <ModernDatepicker
                                date={holdOnDate}
                                format={"DD-MMM-YYYY"}
                                onChange={(date) => onChangeHoldOnDate(date)}
                                placeholder={"Select Hold On Date"}
                                className="color"
                                minDate={new Date(1900, 1, 1)}
                              />
                            </div>
                            <span
                              className="btn btn-secondary" onClick={clearHoldOnDate}
                            >
                              <i
                                className="far fa-window-close"
                                title="Clear Hold On Date"
                              ></i>
                            </span>
                          </div>
                          
                          <div className="error-message">
                            {formErrors["holdOnDateError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                  <div className="row row-sm mg-t-15">
                    <div className="col-md-6 text-nowrap">
                      <div className="createProjectFloatingInput">
                        <FloatingLabel
                          label={
                            <>
                              <b>Reason to Hold On</b><span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select">
                          <textarea className="form-control" rows="2" maxLength="500" value={holdOnReason} onChange={onChangeHoldOnReason}
                          ></textarea>
                          <div className="error-message">
                            {formErrors["holdOnReasonError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="row row-sm mg-t-30">
                <div className="col-md-2"></div>
                <div className="col-md-3">
                  <input type="submit" id="Update" className="btn btn-gray-700 btn-block" value="Update" />
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-3 mg-t-10 mg-lg-t-0">
                  <span className="btn btn-gray-700 btn-block" onClick={() => setIsChangeProjectStatusModalVisible(false)}>
                    Close
                  </span>
                </div>
              </div>
            </form>
          </Modal.Body>
        </LoadingOverlay>
      </Modal>
    </>
  );
  //#endregion
}
const mapStateToProps = (state) => {
  return {
    projects: state.projects,
  };
};

export default connect(mapStateToProps, { readOnGoingProjectsList })(
  OnGoingProjectList
);