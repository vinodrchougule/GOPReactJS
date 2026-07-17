import React, { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import projectService from "../../services/project.service";
import Moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import helper from "../../helpers/helpers";
import accessControlService from "../../services/accessControl.service";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
//import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
//import { CSVLink } from "react-csv";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function NotStartedProjectList(props) {
  //#region State management using useState hook
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [index] = useState();
  //const csvLink = useRef(null);
  const [canAccessViewProject, setCanAccessViewProject] = useState(false);
  const [canAccessProjectBatchList, setCanAccessProjectBatchList] =
    useState(false);
  //#endregion

  //#region Use Effect
  useEffect(() => {
    setSpinnerMessage("Please wait while fetching not started project List...");
    canUserAccessPage("View Project");
    canUserAccessPage("Project Batch List");
    fetchNotStartedProjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  //#endregion

  //#region Fetch Not Started Projects List
  const fetchNotStartedProjectList = () => {
    const data = {
      CustomerCode: props.customerCode,
      ProjectCode: props.projectCode,
      ProjectType: props.projectType,
      FromDate: props.fromDate,
      ToDate: props.toDate,
      UserID: helper.getUser(),
    };

    projectService
      .readNotStartedProjectsList(data)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          ReceivedDate: Moment(obj.ReceivedDate).format("DD-MMM-yyyy"),
          PlannedDeliveryDate:
            obj.PlannedDeliveryDate !== null
              ? Moment(obj.PlannedDeliveryDate).format("DD-MMM-yyyy")
              : "",
        }));
        setLoading(false);
        setProjects(formattedArray);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Not Started Project List Export to CSV
  // const notStartedProjectListCSVExport = () => {
  //   csvLink.current.link.click();
  // };
  //#endregion

  //#region Transformed Not Started Project List Data CSV For Export
  // const getTransformedNotStartedProjectListDataForExport = () => {
  //   return data.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Customer Code": row.CustomerCode,
  //     "Project Code": row.ProjectCode,
  //     Description: row.Scope,
  //     "Received Date": row.ReceivedDate || "N/A",
  //     "Planned Delivery Date": row.PlannedDeliveryDate || "N/A",
  //     Batches: row.NoOfBatches,
  //     "Project Type": row.ProjectType,
  //     "Input Count": row.InputCount,
  //   }));
  // };
  //#endregion

  //#region Export Not Started Projects List to Excel
  const exportNotStartedProjectDataListToExcel = () => {
    setSpinnerMessage(
      "Please wait while exporting Not Started Projects List to excel...",
    );
    setLoading(true);

    let fileName = "Not Started Projects List.xlsx";

    var data = {
      CustomerCode: props.customerCode,
      ProjectCode: props.projectCode,
      ProjectType: props.projectType,
      FromDate: props.fromDate,
      ToDate: props.toDate,
      UserID: helper.getUser(),
    };

    projectService
      .exportNotStartedProjectListToExcel(data)
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

  //#region Navigate to project settings page
  const showProjectSettingPage = (row) => {
    const locationData = {
      CustomerCode: row.CustomerCode,
      ProjectCode: row.ProjectCode,
      activeTab: 1,
    };
    sessionStorage.setItem("locationData", JSON.stringify(locationData));
    if (canAccessProjectBatchList) {
      history.push({
        pathname: "/Allocation/screenProjectSettings",
      });
    }
  };
  //#endregion

  //#region Project List Table
  const data = projects.slice(0, index);
  data.forEach((items) => {
    items.Action = "Edit Project Setting";
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
    },
    {
      accessorKey: "ProjectID",
      header: "Proj ID",
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
      header: "Customer Code	",
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
      Cell: ({ row }) => {
        const onClick = () => {
          if (canAccessViewProject) {
            history.push({
              pathname: "/Projects/ViewProject",
              state: {
                ProjectID: row.original.ProjectID,
                activeTab: 3,
              },
            });
          }
        };
        return (
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={onClick}
          >
            {row.getValue("ProjectCode")}
          </span>
        );
      },
    },
    {
      accessorKey: "Scope",
      header: "Description",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
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
      classes: "demo-key-row1",
      Cell: ({ row }) => (
        <div
          className="demo-key-row1"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            history.push({
              pathname: "/Projects/ProjectBatchList",
              state: {
                ProjectID: row.original.ProjectID,
                CustomerCode: row.original.CustomerCode,
                ProjectCode: row.original.ProjectCode,
                Scope: row.original.Scope,
                activeTab: 1,
              },
            });
          }}
        >
          {row.getValue("NoOfBatches")}
        </div>
      ),
    },
    {
      accessorKey: "Action",
      header: "Edit Screen Settings",
      muiTableHeadCellProps: {
        align: "left",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => (
        <div>
          <i
            className="fas fa-edit pointer"
            title="Edit Screen Settings"
            onClick={() => showProjectSettingPage(row.original)}
            style={{ color: "blue", cursor: "pointer" }}
          ></i>
        </div>
      ),
      classes: canAccessProjectBatchList ? "demo-key-row1" : "",
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
    },
  ];
  //#endregion

  //#region main return
  return (
    <>
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
        <div className="masters-material-table mg-l-50 mg-r-30 notStartedProjectListTable">
          <MaterialReactTable
            columns={projectListColumns.filter((column) => !column.isHidden)}
            data={data}
            initialState={{ density: "compact" }}
            enableRowExpansion={false}
            enableColumnFilterModes={false}
            enableColumnOrdering={false}
            enableRowSelection={false}
            enableFullScreenToggle={true}
            enablePagination={false}
            enableStickyHeader={true}
            renderTopToolbarCustomActions={() => (
              <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
              >
                {/* <Tooltip title="Download CSV">
                  <IconButton onClick={notStartedProjectListCSVExport}>
                    <FileDownloadIcon
                      title="Export to CSV"
                      style={{ color: "rgba(0, 0, 0, 0.54)", width: "1em", height: "1em" }}
                    />
                  </IconButton>
                </Tooltip>
                <CSVLink data={getTransformedNotStartedProjectListDataForExport()} filename="Not Started Project List.csv" ref={csvLink} /> */}
                <Tooltip title="Export Excel">
                  <IconButton onClick={exportNotStartedProjectDataListToExcel}>
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
      </LoadingOverlay>
    </>
  );
  //#endregion
}
export default NotStartedProjectList;
