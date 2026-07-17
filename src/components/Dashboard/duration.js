import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import helper from "../../helpers/helpers";
import dashboardService from "../../services/dashboard.service";
import { toast } from "react-toastify";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import { FaFileExcel } from "react-icons/fa";
import { Link } from "react-router-dom";

toast.configure();

function Duration() {
  const history = useHistory();
  const [activeRowId] = useState(null);
  const [noOfHoursWorked, setNoOfHoursWorked] = useState([]);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }
    fetchNoOfHoursWorked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetch No Of Hours Worked Resources
  const fetchNoOfHoursWorked = () => {
    setSpinnerMessage("Please wait while fetching Durations...");
    setLoading(true);

    dashboardService
      .ReadHoursWorked()
      .then((response) => {
        setNoOfHoursWorked(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e?.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Export Duration Details to Excel
  const exportDurationDetailsToExcel = () => {
    setSpinnerMessage(
      "Please wait while exporting duration details to excel...",
    );
    setLoading(true);

    dashboardService
      .exportDurationDetailsToExcel(helper.getUser())
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Duration Details.xlsx");
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e?.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  // let csvLink;
  // //#region CSV export handler
  // const handleDurationDetailsDataCSVExport = () => {
  //   if (csvLink) {
  //     csvLink.link.click();
  //   }
  // };
  // //#endregion

  // //#region Get transformed noun modifier data for CSV export
  // const getTransformedDurationDetailsDataForExport = () => {
  //   return noOfHoursWorked.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Resource Code": row.ResourceCode,
  //     "Resource Name": row.ResourceName,
  //     "Customer Code": row.CustomerCode,
  //     "Project Code": row.ProjectCode,
  //     "Batch No": row.BatchNo,
  //     "No Of Hours Worked": row.NoOfHoursWorked,
  //   }));
  // };
  // //#endregion

  //#region No Of Hours Worked Columns
  const noOfHoursWorkedColumns = [
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
      accessorKey: "ResourceCode",
      header: "Resource Code",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
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
      header: "Batch No",
      dataField: "BatchNo",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "NoOfHoursWorked",
      header: "No Of Hours Worked",
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
    <div className="durationDetailsMainContent">
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
        <div className="container-fluid">
          <div className="row mg-l-20 mg-t-20">
            <h5 style={{ marginTop: "7px" }}>
              <b>Duration</b>
            </h5>
            <div
              className="col-md-9"
              style={{ textAlign: "left", paddingLeft: "10px" }}
            >
              <span className="icon-size">
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
          <div className="masters-material-table durationDetailsTableContent mg-r-20 mg-l-20">
            <MaterialReactTable
              data={noOfHoursWorked}
              columns={noOfHoursWorkedColumns}
              rowCount={noOfHoursWorked.length}
              manualPagination
              paginationDisplayMode="pages"
              enableColumnFilterModes={true}
              enableColumnOrdering={false}
              enableStickyHeader={true}
              enableDensityToggle={true}
              enableGlobalFilter={true}
              enableRowSelection={false}
              state={{
                pagination: { pageIndex, pageSize },
              }}
              initialState={{
                density: "compact",
                pagination: { pageIndex: 0, pageSize: 100 },
              }}
              muiPaginationProps={{
                color: "primary",
                shape: "rounded",
                showRowsPerPage: true,
                rowsPerPageOptions: [10, 25, 50, 100],
                variant: "outlined",
                sx: {
                  "& .MuiPaginationItem-root": { borderColor: "#5B47FB" },
                  "& .Mui-selected": {
                    backgroundColor: "#5B47FB",
                    color: "white",
                  },
                  "& .MuiPaginationItem-ellipsis": { borderColor: "#5B47FB" },
                  marginTop: "16px",
                },
              }}
              onPaginationChange={({ pageIndex, pageSize }) => {
                setPageIndex(pageIndex);
                setPageSize(pageSize);
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
                    <IconButton onClick={handleDurationDetailsDataCSVExport}>
                      <FileDownloadIcon
                        title="Export to CSV"
                        style={{ width: "1em", height: "1em" }}
                      />
                    </IconButton>
                  </Tooltip>

                  <CSVLink
                    data={getTransformedDurationDetailsDataForExport()}
                    filename="Duration Details List.csv"
                    ref={(r) => (csvLink = r)}
                    target="_blank"
                    style={{ display: "none" }}
                  /> */}
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportDurationDetailsToExcel}>
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
export default Duration;
