import React, { useState, useEffect, useRef } from "react";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { CSVLink } from "react-csv";
import projectSubActivityService from "../../services/projectSubActivity.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function ProjectSubActivityList() {
  //#region State variables
  const [projectSubActivitiesData, setProjectSubActivities] = useState([]);
  const [canAccessCreateProjectSubActivity, setCanAccessCreateProjectSubActivity] = useState(false);
  const [canAccessViewProjectSubActivity, setCanAccessViewProjectSubActivity] = useState(false);
  const [initStates, setInitStates] = useState({ spinnerMessage: "", loading: false, });
  const [projectSubActivityTableColumns, setProjectSubActivityListColumns] = useState([]);
  const csvLink = useRef(null);
  //#endregion

  //#region Export Project Sub-Activity List to Excel
  const exportProjectSubActivityListToExcel = () => {
    setInitStates({
      spinnerMessage: "Please wait while exporting Project Sub-Activity List to Excel...",
      loading: true,
    });

    const fileName = "Project Sub-Activity List.xlsx";

    projectSubActivityService
      .exportProjectSubActivityListToExcel()
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);

        setInitStates({ spinnerMessage: "", loading: false });
      })
      .catch((e) => {
        setInitStates({ spinnerMessage: "", loading: false });
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Hooks and navigation
  const history = useHistory();
  //#endregion

  //#region Use effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage();
    projectSubActivityTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Project Sub Activity Table Data
  const projectSubActivityTable = () => {
    const columns = [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "ProjectSubActivityID",
        header: "Sub Activity ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "SubActivity",
        header: "Sub Activity",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => {
          const { ProjectSubActivityID, SubActivity } = row.original;
          return (
            <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateToView(ProjectSubActivityID)}>
              {SubActivity}
            </span>
          );
        },
      },
      {
        accessorKey: "IsActive",
        header: "Is Active?",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
    ];
    setProjectSubActivityListColumns(columns);
  };
  //#endregion

  //#region Fetching Project Sub Activities from Web API
  const fetchProjectSubActivities = () => {
    setInitStates({
      spinnerMessage: "Please wait while loading Project Sub-Activities List...",
      loading: true,
    });

    projectSubActivityService
      .getAllSubActivities(helper.getUser())
      .then((response) => {
        const formattedArray = response.data.map((obj, index) => ({
          SlNo: index + 1,
          ...obj,
          IsActive: obj.IsActive ? "Yes" : "No",
        }));
        setProjectSubActivities(formattedArray);
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message, { autoClose: false });
      })
      .finally(() => {
        setInitStates({
          spinnerMessage: "",
          loading: false,
        });
      });
  };
  //#endregion

  //#region fetching Project Sub Activity page access
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Create Project SubActivity")
      .then((response) => setCanAccessCreateProjectSubActivity(response.data))
      .catch(() => toast.error("Error checking access."));

    accessControlService
      .CanUserAccessPage(helper.getUser(), "View Project SubActivity")
      .then((response) => {
        setCanAccessViewProjectSubActivity(response.data);
        fetchProjectSubActivities();
      })
      .catch(() => toast.error("Error checking access."));
  };
  //#endregion

  //#region Navigate to View Project Sub Activity Page
  const navigateToView = (ProjectSubActivityID) => {
    history.push({
      pathname: "/Masters/ViewProjectSubActivity",
      state: { ProjectSubActivityID },
    });
  };
  //#endregion

  //#region Export to CSV
  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Transformed Project Sub Activity Data CSV For Export
  const getTransformedProjectSubActivityDataForExport = () => {
    return projectSubActivitiesData.map((row) => ({
      "Sl No.": row.SlNo,
      "Sub Activity ID": row.ProjectSubActivityID,
      "Sub Activity": row.SubActivity,
      "Is Active?": row.IsActive,
    }));
  };
  //#endregion

  //#region Redirect to Create Generic Activity Page
  const moveToCreateProjectSubActivity = () => {
    history.push("/Masters/AddProjectSubActivity");
  };
  //#endregion

  //#region return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initStates.loading}
        spinner={
          <div className="spinner-background">
            <BarLoader color="#38D643" width="350px" />
            <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
              {initStates.spinnerMessage || "Please wait while loading Project Sub-Activities List..."}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Sub-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Project Sub-Activities List{" "}
          {canAccessCreateProjectSubActivity && (
            <span className="icon-size">
            <i className="fa fa-plus text-primary pointer mg-l-8" onClick={moveToCreateProjectSubActivity} title="Add New Project Sub Activity"></i>
          </span>
          )}
        </h4>
        {canAccessViewProjectSubActivity && (
          <div className="masters-material-table mg-l-10 projectSubActivityTypeTable">
            <MaterialReactTable
              keyField="ProjectSubActivityID"
              columns={projectSubActivityTableColumns}
              data={projectSubActivitiesData}
              enablePagination={false}
              initialState={{ density: 'compact' }}
              enableStickyHeader
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Export CSV">
                    <IconButton onClick={handleCSVExport}>
                      <FileDownloadIcon style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem" }} />
                    </IconButton>
                  </Tooltip>
                  <CSVLink data={getTransformedProjectSubActivityDataForExport()} filename="Project Sub Activity Data.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportProjectSubActivityListToExcel}>
                      <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ProjectSubActivityList;