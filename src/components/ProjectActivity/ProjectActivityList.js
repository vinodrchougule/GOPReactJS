import React, { useEffect, useState, useRef } from "react";
import helpers from "../../helpers/helpers";
import accessControlService from "../../services/accessControl.service";
import projectActivityService from "../../services/projectActivity.service";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { Box, IconButton, Tooltip } from '@mui/material';
import { CSVLink } from "react-csv";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { FaFileExcel } from "react-icons/fa";
import { mkConfig, generateCsv } from "export-to-csv";
import { useCallback } from "react";
import { darken, lighten, useTheme } from "@mui/material";
toast.configure();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

function ProjectActivityList() {
  let history = useHistory();
  const tableContainerRef = useRef(null);
  const theme = useTheme();

  //#region Initial State
  const [initStates, setInitStates] = useState({
    projectActivities: [],
    loading: false,
    spinnerMessage: "",
    index: 30,
    position: 0,
    columns: [],
    filtervalue: "",
  });
  //#endregion

  const csvLink = useRef(null);

  const [canAccessCreateProjectActivity, setCanAccessCreateProjectActivity] =
    useState(false);
  const [canAccessViewProjectActivity, setCanAccessViewProjectActivity] =
    useState(false);

  //#region useEffect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    canUserAccessPage("Create Project Activity");
    canUserAccessPage("View Project Activity");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region fetching Customer page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helpers.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create Project Activity") {
          setCanAccessCreateProjectActivity(response.data);
        } else if (pageName === "View Project Activity") {
          setCanAccessViewProjectActivity(response.data);
        }

        fetchProjectActivities();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region export data
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.download = "Project Activities List.csv";
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  //#endregion

  //#region fetching project activities from Web API
  const fetchProjectActivities = () => {
    setInitStates((prevStates) => ({
      ...prevStates,
      spinnerMessage: "Please wait while loading Project Activity List...",
      loading: true,
    }));

    projectActivityService
      .getAllActivities(helpers.getUser())
      .then((response) => {
        let formattedArray = response.data;
        formattedArray = formattedArray.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));
        formattedArray = formattedArray.map((obj) => {
          delete obj.UserID;
          return obj;
        });
        setInitStates((prevStates) => ({
          ...prevStates,
          projectActivities: formattedArray,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevStates) => ({
          ...prevStates,
          loading: false,
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Export Project Activities List to Excel
  const exportProjectActivitiesListToExcel = () => {
    setInitStates((prevStates) => ({
      ...prevStates,
      spinnerMessage:
        "Please wait while exporting Project Activities List to excel...",
      loading: true,
    }));

    let fileName = "Project Activities List.xlsx";
    projectActivityService
      .exportProjectActivityListToExcel()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setInitStates((prevStates) => ({
          ...prevStates,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevStates) => ({
          ...prevStates,
          loading: false,
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Transformed Project Sub Activity Data CSV For Export
  const getTransformedProjectActivityListDataForExport = () => {
    return columns.map((row) => ({
      "Project Activity ID": row.ProjectActivityID,
      "Activity": row.Activity,
      "Is Active?": row.IsActive,
    }));
  };
  //#endregion

  //#region Scroll to Top
  const scrollToTop = () => {
    tableContainerRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  //#endregion

  //#region Redirect to Add Project Activity Page
  const moveToAddProjectActivity = () => {
    history.push("/Masters/AddProjectActivity");
  };
  //#endregion

  let data = [];
  if (initStates?.projectActivities.length !== 0) {
    data = initStates?.projectActivities;
  }

  const fetchMoreOnBottomReached = useCallback(
    (event) => {
      if (event) {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        var currentHeight = scrollTop;
        var maxScrollPosition = scrollHeight - clientHeight;

        setInitStates((prevStates) => ({
          ...prevStates,
          position: currentHeight,
        }));

        if ((currentHeight / maxScrollPosition) * 100 > 90) {
          let curIndex = initStates.index + 20;
          setInitStates((prevStates) => ({
            ...prevStates,
            index: curIndex,
          }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#f4f6f8" : "rgba(255, 255, 255, 255)";

  //#region Table Data
  const columns = useMemo(
    () => [
      {
        accessorKey: "ProjectActivityID",
        header: "Project Activity ID",
        columnFilterModeOptions: [
          "between",
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "notEquals",
        ],
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
        textAlign: "center",
        columnFilterModeOptions: [
          "fuzzy",
          "contains",
          "startsWith",
          "endsWith",
          "notEmpty",
          "empty",
        ],
        Cell: ({ row }) => (
          <div>
            {canAccessViewProjectActivity ? (
              <Link
                to={{
                  pathname: "/Masters/ViewProjectActivity",
                  state: row.original.ProjectActivityID,
                }}
              >
                {row.original.Activity}
              </Link>
            ) : (
              <div>{row.original.Activity}</div>
            )}
          </div>
        ),
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "IsActive",
        header: "Is Active?",
        columnFilterModeOptions: [
          "fuzzy",
          "contains",
          "startsWith",
          "endsWith",
          "notEmpty",
          "empty",
        ],
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [canAccessViewProjectActivity]
  );
  //#endregion

  //#region Material React Table
  const table = useMaterialReactTable({
    data,
    columns,
    enableColumnFilterModes: true,
    initialState: { density: "compact" },
    enableColumnOrdering: false,
    enableRowSelection: false,
    enablePagination: false,
    enableStickyHeader: true,
    enableRowNumbers: true,
    rowNumberDisplayMode: "static",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Tooltip title="Export CSV">
          <IconButton onClick={handleExportData}>
            <FileDownloadIcon style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem" }} />
          </IconButton>
        </Tooltip>
        <CSVLink data={getTransformedProjectActivityListDataForExport()} filename="Customer List.csv" ref={csvLink} />
        <Tooltip title="Export Excel">
          <IconButton onClick={exportProjectActivitiesListToExcel}>
            <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
          </IconButton>
        </Tooltip>

      </Box>
    ),
    muiTablePaperProps: {
      className: "customer-table-paper",
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      className: "customer-table-body",
      onScroll: (event) => fetchMoreOnBottomReached(event),
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: "rgba(244, 246, 248, 1)",
        },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.2),
        },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: lighten(baseBackgroundColor, 0.1),
        },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.2),
        },
      }),
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid #eee",
        backgroundColor: "#f2f8fb",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid #eee",
      },
    },
  });
  //#endregion

  //#region Return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initStates.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helpers.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>
              {initStates.spinnerMessage}
            </p>
          </div>
        }
      >
        <div style={{ height: "100%", position: "relative", paddingLeft: "10px" }}>
          <div className="az-content-breadcrumb">
            <span>Masters</span>
            <span>Project Activities</span>
          </div>
          <h4 className="d-flex align-items-center">
            Project Activities List{" "}
            {canAccessCreateProjectActivity && (
              <span className="icon-size">
                <i
                  className="fa fa-plus text-primary pointer mg-l-5"
                  onClick={moveToAddProjectActivity}
                  title="Add New Project Activity"
                ></i>
              </span>
            )}
          </h4>
          <ToolkitProvider keyField="ProjectActivityID">
            {(props) => (
              <div className="mg-t-10">
                <div
                  style={{
                    borderBottom: "1px solid #cdd4e0",
                  }}
                  className="masters-material-table"
                >
                  <MaterialReactTable
                    className="custom-material-table"
                    table={table}
                  />
                </div>
              </div>
            )}
          </ToolkitProvider>
          {initStates.position > 600 && (
            <div className="scroll-top-div" style={{ textAlign: "end" }}>
              <button className="scroll-top" onClick={scrollToTop} title="Go To Top">
                <div className="arrow up"></div>
              </button>
            </div>
          )}
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ProjectActivityList;
