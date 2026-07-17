import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { readDeliveredProjectsList } from "../../actions/projects";
import helper from "../../helpers/helpers";
import projectService from "../../services/project.service";
import accessControlService from "../../services/accessControl.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import Moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
//import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
//import { CSVLink } from "react-csv";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function DeliveredProjectList(props) {
  //#region State management using useState hook
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [deliveredProjects, setDeliveredProjects] = useState([]);
  const [canAccessViewProject, setCanAccessViewProject] = useState(false);
  const [projectsDetailsExpanded, setProjectsDetailsExpanded] = useState([]);
  const [deliveredTaskExpanded, setDeliveredTaskExpanded] = useState([]);
  const [deliveredTasks, setDeliveredTasks] = useState([]);
  const [expandedProjectID, setExpandedProjectID] = useState(null);
  const [resources, setResources] = useState([]);
  const [canUserRevertProjectStatus, setCanUserRevertProjectStatus] =
    useState(false);
  const [index] = useState();
  const history = useHistory();
  //const csvLink = useRef(null);
  const [expandedRows, setExpandedRows] = React.useState({});
  const [resourceExpandedRows, setResourceExpandedRows] = React.useState({});
  //#endregion

  //#region useEffect
  useEffect(() => {
    setSpinnerMessage("Please wait while loading Delivered Projects List...");
    setLoading(true);
    canUserAccessPage("View Project");
    fetchDeliveredProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  //#endregion

  //#region Fetch Delivered Projects List
  const fetchDeliveredProjects = () => {
    const data = {
      CustomerCode: props.customerCode,
      ProjectCode: props.projectCode,
      ProjectType: props.projectType,
      FromDate: props.fromDate,
      ToDate: props.toDate,
      UserID: helper.getUser(),
    };

    projectService
      .readDeliveredProjectsList(data)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          ReceivedDate: Moment(obj.ReceivedDate).format("DD-MMM-yyyy"),
          PlannedDeliveryDate: obj.PlannedDeliveryDate
            ? Moment(obj.PlannedDeliveryDate).format("DD-MMM-yyyy")
            : "",
          DeliveredOn: obj.DeliveredOn
            ? Moment(obj.DeliveredOn).format("DD-MMM-yyyy")
            : "",
        }));

        setCanUserRevertProjectStatus(canUserRevertProjectStatus);
        setDeliveredProjects(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Project page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "View Project") {
          setCanAccessViewProject(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Revert Project Status
  const revertProjectStatus = (customerCode, projectBatch) => {
    setLoading(true);
    setSpinnerMessage("Please wait while reverting the Project Status...");

    projectService
      .revertProjectStatus(customerCode, projectBatch, helper.getUser())
      .then(() => {
        return readDeliveredProjectsList(helper.getUser());
      })
      .then(() => {
        toast.success("Project Status reverted successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, {
          autoClose: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
        setDeliveredTaskExpanded([]);
        setDeliveredTasks(response.data);
        setProjectsDetailsExpanded([row.original.ProjectID]);
        setExpandedProjectID(row.original.ProjectID);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, { autoClose: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region Delivered Project List Export to CSV
  // const deliveredProjectListCSVExport = () => {
  //   csvLink.current.link.click();
  // };
  //#endregion

  //#region Transformed Delivered Project List Data CSV For Export
  // const getTransformedDeliveredProjectListDataForExport = () => {
  //   return data.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Customer Code": row.CustomerCode,
  //     "Project Code": row.ProjectCode,
  //     Batches: row.NoOfBatches,
  //     Activities: row.NoOfActivities,
  //     Description: row.Scope,
  //     "Received Date": row.ReceivedDate || "N/A",
  //     "Planned Delivery Date": row.PlannedDeliveryDate || "N/A",
  //     "Project Type": row.ProjectType,
  //     "Input Count": row.InputCount,
  //     "Delivered Count": row.DeliveredCount,
  //     "Delivered On": row.DeliveredOn,
  //     Status: row.Status,
  //     "Revert Status": row.RevertStatus,
  //   }));
  // };
  //#endregion

  //#region Export On Going Project List to Excel
  const exportDeliveredProjectsDataListToExcel = () => {
    setSpinnerMessage(
      "Please wait while exporting delivered project list to excel..."
    );
    setLoading(true);

    let fileName = "Delivered Projects List.xlsx";

    var data = {
      CustomerCode: props.customerCode,
      ProjectCode: props.projectCode,
      ProjectType: props.projectType,
      FromDate: props.fromDate,
      ToDate: props.toDate,
      UserID: helper.getUser(),
    };

    projectService
      .exportDeliveredProjectsListToExcel(data)
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

  //#region Fetch Resources of Selected Customer Code, Project Code and Task
  const fetchResources = (row, isExpand) => {
    if (!isExpand) {
      deliveredTaskExpanded([]);
      setLoading(false);
      return;
    }
    setSpinnerMessage(
      "Please wait while fetching Resources of selected Task..."
    );
    setLoading(true);
    const ProjectActivityID = row.original.ProjectActivityID;
    projectService
      .readProjectActivityResourcesWithHoursWorked(
        expandedProjectID,
        ProjectActivityID
      )
      .then((response) => {
        setResources(response.data);
        setDeliveredTaskExpanded([row.SlNo]);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Project List Table
  const data = deliveredProjects.slice(0, index);

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
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("CustomerCode")}</span>
            </div>
          </Box>
        );
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
                position: "relative",
                left: "41%",
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
      accessorKey: "Scope",
      header: "Description",
      muiTableHeadCellProps: {
        align: "center",
        style: { width: "550px", minWidth: "550px", maxWidth: "550px" },
      },
      muiTableBodyCellProps: {
        align: "left",
        style: {
          width: "500px",
          minWidth: "500px",
          maxWidth: "500px",
          whiteSpace: "normal",
        },
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
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("Scope")}</span>
            </div>
          </Box>
        );
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
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("ReceivedDate")}</span>
            </div>
          </Box>
        );
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
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("PlannedDeliveryDate")}</span>
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
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      classes: (row) => (row.original.NoOfBatches > 0 ? "demo-key-row1" : ""),
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
        const handleClick = () => {
          if (row.original.NoOfBatches > 0) {
            history.push({
              pathname: "/Projects/ProjectBatchList",
              state: {
                ProjectID: row.original.ProjectID,
                CustomerCode: row.original.CustomerCode,
                ProjectCode: row.original.ProjectCode,
                Scope: row.original.Scope,
                activeTab: 2,
              },
            });
          }
        };

        return (
          <div className="d-flex">
            <div
              style={{
                cursor: row.original.NoOfBatches > 0 ? "pointer" : "default",
                textDecoration:
                  row.original.NoOfBatches > 0 ? "underline" : "none",
                color: row.original.NoOfBatches > 0 ? "blue" : "black",
                position: "relative",
                left: "35%",
              }}
              onClick={handleClick}
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
              <span style={{ width: "200px", display: "inline-block" }}></span>{" "}
              {/* Empty space for expand toggle */}
            </div>
          </div>
        );
      },
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
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("ProjectType")}</span>
            </div>
          </Box>
        );
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
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("InputCount")}</span>
            </div>
          </Box>
        );
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
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("Status")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "RevertStatus",
      header: "Revert Status",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      hidden: canUserRevertProjectStatus ? false : true,
      Cell: ({ row }) => (
        <div>
          <i
            className="fas fa-chevron-circle-left pointer"
            title="Revert Status"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure, to revert the status of this Project?\n" +
                    "Customer Code: " +
                    row.original.CustomerCode +
                    " " +
                    "Project Code: " +
                    row.original.ProjectCode
                )
              ) {
                revertProjectStatus(
                  row.original.CustomerCode,
                  row.original.ProjectCode
                );
              }
            }}
          ></i>
        </div>
      ),
    },
    {
      accessorKey: "DeliveredCount",
      header: "Delivered Count",
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
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("DeliveredCount")}</span>
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "DeliveredOn",
      header: "Delivered Date",
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
                cursor: "pointer",
              }}
              onClick={handleExpandToggle}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <span>{row.getValue("DeliveredOn")}</span>
            </div>
          </Box>
        );
      },
    },
  ];
  //#endregion

  //#region Delivered Tasks Table
  const deliveredTasksColumns = [
    {
      accessorKey: "SlNo",
      header: "Sl No.",
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

  //#region Active Resources Table
  const resourcesColumns = [
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
      Cell: ({ row }) => (
        <div>{Moment(row.getValue("EndDate")).format("DD-MMM-yyyy")}</div>
      ),
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

  //#region main return
  return (
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
      <div className="masters-material-table mg-l-50 mg-r-30 deliveredProjectListTable">
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
          onRowClick={({ row }) => {
            setExpandedRows((prevExpanded) => ({
              ...prevExpanded,
              [row.id]: !prevExpanded[row.id],
            }));
          }}
          state={{ expanded: expandedRows }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              backgroundColor:
                row.index % 2 === 0
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(244, 246, 248, 1)",
            },
          })}
          renderDetailPanel={({ row }) => (
            <Box sx={{ padding: "16px", backgroundColor: "#f9f9f9" }}>
              <Box sx={{ paddingBottom: "16px" }}>
                <strong>Tasks</strong>
                <div
                  className="onGoingProjectListInnerListTable"
                  style={{ height: "150px", overflowY: "auto", width: "60%" }}
                >
                  <MaterialReactTable
                    className="onGoingProjectListInnerActivitiesExpandTable"
                    columns={deliveredTasksColumns.filter(
                      (column) => !column.isHidden
                    )}
                    data={deliveredTasks}
                    enableRowExpansion={false}
                    enableColumnFilterModes
                    enableColumnOrdering={false}
                    enableRowSelection={false}
                    enableFullScreenToggle={true}
                    enablePagination={false}
                    enableStickyHeader={true}
                    state={{ expanded: resourceExpandedRows }}
                    onExpandedChange={(newExpanded) =>
                      setResourceExpandedRows(newExpanded)
                    }
                    muiTableBodyRowProps={({ row }) => ({
                      sx: {
                        backgroundColor:
                          row.index % 2 === 0
                            ? "rgba(255, 255, 255, 1)"
                            : "rgba(244, 246, 248, 1)",
                      },
                    })}
                    renderDetailPanel={({ row }) => (
                      <Box sx={{ padding: "16px", backgroundColor: "#f1f1f1" }}>
                        <strong>Resources / Project Team</strong>
                        <div
                          className="onGoingProjectListInnerListTable"
                          style={{ height: "200px", overflowY: "auto" }}
                        >
                          <MaterialReactTable
                            className="onGoingProjectListInnerExpandTable"
                            columns={resourcesColumns}
                            data={resources}
                            enableRowExpansion={false}
                            enableColumnFilterModes={false}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={true}
                            enablePagination={false}
                            enableStickyHeader={true}
                            onExpandedChange={(newExpanded) => {
                              if (newExpanded[row.index]) {
                                const columnIndex = resourcesColumns.findIndex(
                                  (col) => col.accessor === "slno"
                                );
                                if (columnIndex !== -1) {
                                  fetchResources(row, true);
                                }
                              }
                              setResourceExpandedRows(newExpanded);
                            }}
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
                    )}
                  />
                </div>
              </Box>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Box
              sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
            >
              {/* <Tooltip title="Download CSV">
                <IconButton onClick={deliveredProjectListCSVExport}>
                  <FileDownloadIcon
                    title="Export to CSV"
                    style={{
                      color: "rgba(0, 0, 0, 0.54)",
                      width: "1em",
                      height: "1em",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <CSVLink
                data={getTransformedDeliveredProjectListDataForExport()}
                filename="Delivered Project List.csv"
                ref={csvLink}
              /> */}
              <Tooltip title="Export Excel">
                <IconButton onClick={exportDeliveredProjectsDataListToExcel}>
                  <FaFileExcel
                    style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </div>
    </LoadingOverlay>
  );
  //#endregion
}
const mapStateToProps = (state) => {
  return {
    projects: state.projects,
  };
};

export default connect(mapStateToProps, { readDeliveredProjectsList })(
  DeliveredProjectList
);
