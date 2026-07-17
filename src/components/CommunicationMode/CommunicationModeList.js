import React, { useState, useEffect, useRef } from "react";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import communicationModeService from "../../services/communicationMode.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { CSVLink } from "react-csv";

function CommunicationModeList(props) {
  //#region State
  const csvLink = useRef(null);
  const [communicationModes, setCommunicationModes] = useState([]);
  const [communicationModeListTableColumns, setGenericActivityColumns] = useState([]);
  const [canAccessCreateCommunicationMode, setCanAccessCreateCommunicationMode] = useState(false);
  const [canAccessViewCommunicationMode, setCanAccessViewCommunicationMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  
  //#endregion

  //#region History Initialization
  const history = useHistory();
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage("Create Communication Mode");
    canUserAccessPage("View Communication Mode");
    CommunicationModeListTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region Fetch Communication Modes
  const fetchCommunicationModes = () => {
    setSpinnerMessage("Please wait while loading Communication Modes...");
    setLoading(true);

    communicationModeService
      .getAllCommunicationModes(helper.getUser(), false)
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));

        formattedArray = formattedArray.map((obj) => {
          delete obj.UserID;
          return obj;
        });

        setCommunicationModes(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Communication Modes List page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create Communication Mode") {
          setCanAccessCreateCommunicationMode(response.data);
        } else if (pageName === "View Communication Mode") {
          setCanAccessViewCommunicationMode(response.data);
        }
        fetchCommunicationModes();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Redirect to Create Communication Mode Page
  const moveToCreateCommunicationMode = () => {
    props.history.push("/Masters/CreateCommunicationMode");
  };
  //#endregion

  //#region Navigation to View Communication Mode Page
  const navigateToView = (CommunicationModeID) => {
    history.push({
      pathname: "/Masters/ViewCommunicationMode",
      state: { CommunicationModeID },
    });
  };
  //#endregion

  //#region Communication Mode List Table
  const CommunicationModeListTable = () => {
    const columns = [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "CommunicationModeID",
        header: "Communication Mode ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "CommunicationMode",
        header: "Communication Mode",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => {
          const { CommunicationModeID, CommunicationMode } = row.original;
          return (
            <span
              style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => navigateToView(CommunicationModeID)}
            >
              {CommunicationMode}
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

  //#region Transformed Communication Mode Data Export to CSV
  const getTransformedCommunicationModeDataForExport = () => {
    return communicationModes.map((row) => ({
      "Sl No.": row.SlNo,
      "Communication Mode ID": row.CommunicationModeID,
      "Communication Mode": row.CommunicationMode,
      "Is Active?": row.IsActive,
    }));
  };

  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Export Communication Mode List to Excel
  const exportCommunicationModeListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Communication Mode List to excel...");
    setLoading(true);
  
    let fileName = "Communication Mode List.xlsx";
  
    communicationModeService
      .exportCommunicationModeListToExcel()
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

  //#region Return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Communication Mode</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Communication Mode List{" "}
          {canAccessCreateCommunicationMode && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-8" onClick={moveToCreateCommunicationMode} title="Add New Communication Mode"></i>
            </span>
          )}
        </h4>
        {canAccessViewCommunicationMode && (
          <div className="masters-material-table mg-l-10 communicationModeListTable">
            <MaterialReactTable
              keyField="CommunicationModeID"
              columns={communicationModeListTableColumns}
              data={communicationModes}
              enablePagination={false}
              initialState={{ density: "compact" }}
              enableStickyHeader
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Export CSV">
                    <IconButton onClick={handleCSVExport}>
                      <FileDownloadIcon style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem" }} />
                    </IconButton>
                  </Tooltip>
                  <CSVLink data={getTransformedCommunicationModeDataForExport()} filename="Communication Mode List.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportCommunicationModeListToExcel}>
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
export default CommunicationModeList;