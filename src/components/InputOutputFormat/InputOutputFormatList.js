import React, { useState, useEffect, useRef } from "react";
import InputOutputFormatService from "../../services/inputOutputFormat.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import inputOutputFormatService from "../../services/inputOutputFormat.service";

toast.configure();

function InputOutputFormatList(props) {
  const history = useHistory();
  //#region State
  const [inputOutputFormatsData, setInputOutputFormats] = useState([]);
  const csvLink = useRef(null);
  const [inputOutputFormatTableColumns, setInputOutputFormatListColumns] = useState([]);
  const [canAccessCreateInputOutputFormat, setCanAccessCreateInputOutputFormat] = useState(false);
  const [canAccessViewInputOutputFormat, setCanAccessViewInputOutputFormat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region Fetch Input Output Formats from Web API
  const fetchInputOutputFormats = () => {
    setLoading(true);
    setSpinnerMessage("Please wait while loading Input-Output Format List...");
    InputOutputFormatService.getAllInputOutputFormats(helper.getUser(), false)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));
        setInputOutputFormats(formattedArray);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        setLoading(false);
        setSpinnerMessage(""); 
      });
  };
  //#endregion

  //#region Fetch Input Output Format List page access
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Create Input-Output Format")
      .then((response) => setCanAccessCreateInputOutputFormat(response.data))
      .catch(() => toast.error("Error checking access."));
    accessControlService
      .CanUserAccessPage(helper.getUser(), "View Input-Output Format")
      .then((response) => {
        setCanAccessViewInputOutputFormat(response.data);
        if (response.data) {
          fetchInputOutputFormats();
        }
      })
      .catch((e) => toast.error(e.response.data.Message, { autoClose: false }));
  };
  //#endregion

  //#region Redirect to Add Input Output Format Page
  const moveToAddInputOutputFormat = () => {
    props.history.push("/Masters/AddInputOutputFormat");
  };
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage();
    InputOutputFormatListTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Define Input Output Format List Table
  const InputOutputFormatListTable = () => {
    const columns = [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "FormatID",
        header: "Format ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "Format",
        header: "Format",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => {
          const { FormatID, Format } = row.original;
          return (
            <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateToView(FormatID)}>
              {Format}
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
    setInputOutputFormatListColumns(columns);
  };
  //#endregion

  //#region Navigate to View Input Output Format Page
  const navigateToView = (FormatID) => {
    history.push({
      pathname: "/Masters/ViewInputOutputFormat",
      state: { FormatID },
    });
  };
  //#endregion

  //#region Export to CSV
  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Transformed Input Output Formats Data for CSV Export
  const getTransformedInputOutputFormatsDataForExport = () => {
    return inputOutputFormatsData.map((row) => ({
      "Sl No.": row.SlNo,
      "Format ID": row.FormatID,
      "Format": row.Format,
      "Is Active?": row.IsActive,
    }));
  };
  //#endregion

  //#region Export Input Output Format List to Excel
  const exportInputOutputFormatListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Input Output Formats List to excel...");
    setLoading(true);
   
    let fileName = "Input Output Format List.xlsx";

    inputOutputFormatService
      .exportInputOutputFormatListToExcel()
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
            <BarLoader color="#38D643" width="350px" />
            <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
              {spinnerMessage || "Please wait while loading Input-Output Format List..."}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Input / Output Format</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Input / Output Formats List{" "}
          {canAccessCreateInputOutputFormat && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-5" onClick={moveToAddInputOutputFormat} title="Add New Input Output Format"></i>
            </span>
          )}
        </h4>
        {canAccessViewInputOutputFormat && (
          <div className="masters-material-table mg-l-10 inputOutputFormatsTypeTable">
            <MaterialReactTable
              keyField="FormatID"
              columns={inputOutputFormatTableColumns}
              data={inputOutputFormatsData}
              enablePagination={false}
              initialState={{ density: 'compact' }}
              enableStickyHeader
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Export CSV">
                    <IconButton onClick={handleCSVExport}>
                      <FileDownloadIcon style={{ color: "rgba(0, 0, 0, 0.54)",fontSize: "1.5rem" }} />
                    </IconButton>
                  </Tooltip>
                  <CSVLink data={getTransformedInputOutputFormatsDataForExport()} filename="Input Output Format Data.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportInputOutputFormatListToExcel}>
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
export default InputOutputFormatList;
