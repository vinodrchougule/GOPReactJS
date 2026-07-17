import React, { useState, useEffect, useRef } from "react";
import genericActivityService from "../../services/genericActivity.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { CSVLink } from "react-csv";

toast.configure();

function GenericActivityList() {
  const csvLink = useRef(null);
  //#region State
  const [genericActivities, setGenericActivities] = useState([]);
  const [canAccessCreateGenericActivity, setCanAccessCreateGenericActivity] = useState(false);
  const [genericActivityListTableColumns, setGenericActivityColumns] = useState([]);
  const [canAccessViewGenericActivity, setCanAccessViewGenericActivity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  const history = useHistory();

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage();
    GenericActivityListTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region Fetch Generic Activity List page access
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Create Generic Activity")
      .then((response) => setCanAccessCreateGenericActivity(response.data))
      .catch(() => toast.error("Error checking access for Create Item Status."));
    accessControlService
      .CanUserAccessPage(helper.getUser(), "View Generic Activity")
      .then((response) => {
        setCanAccessViewGenericActivity(response.data);
        if (response.data) {
          fetchGenericActivities();
        }
      })
      .catch((e) => toast.error(e.response.data.Message, { autoClose: false }));
  };
  //#endregion

  //#region Fetch Generic Activities
  const fetchGenericActivities = () => {
    setSpinnerMessage("Please wait while loading Generic Activity List...");
    setLoading(true);
    genericActivityService
      .getAllActivities(helper.getUser(), false)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive ? "Yes" : "No",
        }));
        setGenericActivities(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(true);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Redirect to Create Generic Activity Page
  const moveToCreateGenericActivity = () => {
    history.push("/Masters/CreateGenericActivity");
  };
  //#endregion

  //#region Navigate to View Generic Activity
  const navigateToView = (GenericActivityID) => {
    history.push({
      pathname: "/Masters/ViewGenericActivity",
      state: { GenericActivityID },
    });
  };
  //#endregion

  //#region Define Generic Activity List Table
  const GenericActivityListTable = () => {
    const columns = [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "GenericActivityID",
        header: "Generic Activity ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "Activity",
        header: "Activity",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => {
          const { GenericActivityID, Activity } = row.original;
          return (
            <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateToView(GenericActivityID)}>
              {Activity}
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
    setGenericActivityColumns(columns);
  };
  //#endregion

  //#region Generic Activity List Data Export to CSV
  const getTransformedGenericActivityDataForExport = () => {
    return genericActivities.map((row) => ({
      "Sl No.": row.SlNo,
      "Generic Activity ID": row.GenericActivityID,
      "Activity": row.Activity,
      "Is Active?": row.IsActive,
    }));
  };

  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Export Generic Activity List to Excel
  const exportGenericActivityListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Generic Activity List to excel...");
    setLoading(true);
   
    let fileName = "Generic Activity List.xlsx";

    genericActivityService
      .exportGenericActivityListToExcel()
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

  //#region Return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={loading}
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Generic-Activities</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Generic Activities{" "}
          {canAccessCreateGenericActivity && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-8" onClick={moveToCreateGenericActivity} title="Add New Input Output Format"></i>
            </span>
          )}
        </h4>
        {canAccessViewGenericActivity && (
          <div className="masters-material-table mg-l-10 genericActivityListTable">
            <MaterialReactTable
              keyField="GenericActivityID"
              columns={genericActivityListTableColumns}
              data={genericActivities}
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
                  <CSVLink data={getTransformedGenericActivityDataForExport()} filename="Generic Activity List.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportGenericActivityListToExcel}>
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
};

export default GenericActivityList;
