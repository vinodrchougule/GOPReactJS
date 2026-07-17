import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import helpers from "../../helpers/helpers";
import dashboardService from "../../services/dashboard.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { CSVLink } from "react-csv";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import "react-toastify/dist/ReactToastify.css";
import { FaFileExcel } from "react-icons/fa";
import { Link } from "react-router-dom";
toast.configure();

function ActiveTasks() {
  const history = useHistory();
  const [activeRowId] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //#region useEffect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchActiveTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetch Active Tasks
  const fetchActiveTasks = () => {
    setSpinnerMessage("Please wait while fetching Active Tasks...");
    setLoading(true);

    dashboardService
      .ReadActiveTasks()
      .then((response) => {
        setActiveTasks(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Export Active Tasks to Excel
  const exportActiveTasksToExcel = () => {
    setSpinnerMessage("Please wait while exporting active tasks to excel...");
    setLoading(true);

    dashboardService
      .exportActiveTasksToExcel(helpers.getUser())
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Active Tasks.xlsx");
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  // let csvLink;
  // //#region CSV export handler
  // const handleActiveTasksDataCSVExport = () => {
  //   if (csvLink) {
  //     csvLink.link.click();
  //   }
  // };
  // //#endregion

  // //#region Get transformed noun modifier data for CSV export
  // const getTransformedActiveTasksDataForExport = () => {
  //   return activeTasks.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Customer Code": row.CustomerCode,
  //     "Project Code": row.ProjectCode,
  //     "Batch No": row.BatchNo,
  //     "Input Count": row.InputCount,
  //     Activity: row.Activity,
  //     "Production Completed Count": row.ProductionCompletedCount,
  //     "QC Completed Count": row.QCCompletedCount,
  //   }));
  // };
  // //#endregion

  //#region Active Tasks Table Columns
  const activeTasksColumns = [
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
    },
    {
      accessorKey: "CustomerCode",
      header: "Customer Code",
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
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "BatchNo",
      header: "Batch No",
      size: 100,
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
      size: 100,
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
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
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
    },
  ];
  //#endregion

  //#region return
  return (
    <div className="activeTasksMainContent">
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
          <div className="row mg-l-20 mg-t-20">
            <div className="col-md-9 pd-lg-l-0">
              <div className="d-flex align-items-center">
                <h5 className="mg-b-0">
                  <b>Active Tasks</b>
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
          </div>
          <div className="masters-material-table activeTasksTableContent mg-r-20 mg-l-20">
            <MaterialReactTable
              data={activeTasks}
              columns={activeTasksColumns}
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
                    activeRowId === row.original.id ? "#e0e0e0" : "transparent",
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
                  {/* <Tooltip title="Download CSV">
                    <IconButton onClick={handleActiveTasksDataCSVExport}>
                      <FileDownloadIcon
                        title="Export to CSV"
                        style={{ color: "#5B47FB", width: "1em", height: "1em" }}
                      />
                    </IconButton>
                  </Tooltip>

                  <CSVLink
                    data={getTransformedActiveTasksDataForExport()}
                    filename="Active Tasks List.csv"
                    ref={(r) => (csvLink = r)}
                    target="_blank"
                    style={{ display: "none" }}
                  /> */}
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportActiveTasksToExcel}>
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
export default ActiveTasks;
