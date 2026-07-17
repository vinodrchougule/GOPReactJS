import React, { useState, useEffect, useRef } from "react";
import ItemStatusService from "../../services/itemStatus.service";
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
import itemStatusService from "../../services/itemStatus.service";

toast.configure();

function ItemStatusList() {
  //#region State
  const csvLink = useRef(null);
  const history = useHistory();
  const [canAccessCreateItemStatus, setCanAccessCreateItemStatus] = useState(false);
  const [canAccessViewItemStatus, setCanAccessViewItemStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [itemStatusListTableColumns, setItemStatusColumns] = useState([]);
  const [itemStatusListData, setInputOutputFormats] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage();
    ItemStatusListTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching Item Status List
  const fetchItemStatusList = () => {
    setSpinnerMessage("Please wait while loading Item Status List...");
    setLoading(true);
    ItemStatusService.getAllItemStatus(helper.getUser())
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));
        setInputOutputFormats(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Item Status List Page Access
  const canUserAccessPage = () => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Create Item Status")
      .then((response) => setCanAccessCreateItemStatus(response.data))
      .catch(() => toast.error("Error checking access for Create Item Status."));

    accessControlService
      .CanUserAccessPage(helper.getUser(), "View Item Status")
      .then((response) => {
        setCanAccessViewItemStatus(response.data);
        if (response.data) {
          fetchItemStatusList();
        }
      })
      .catch((e) => toast.error(e.response.data.Message, { autoClose: false }));
  };
  //#endregion

  //#region Navigate to Add Item Status Page
  const moveToAddItemStatus = () => {
    history.push("/Masters/AddItemStatus");
  };
  
  //#region Navigate to View Item Status Page
  const navigateToView = (ItemStatusID) => {
    history.push({
      pathname: "/Masters/ViewItemStatus",
      state: { ItemStatusID },
    });
  };
  //#endregion

  //#region Export Item Status List to Excel
  const exportItemStatusListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Item Status List to excel...");
    setLoading(true);
   
    let fileName = "Item Status List.xlsx";

    itemStatusService
      .exportItemStatusListToExcel()
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

  //#region Item Status List Table
  const ItemStatusListTable = () => {
    const columns = [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "ItemStatusID",
        header: "Item Status ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "Status",
        header: "Status",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => {
          const { ItemStatusID, Status } = row.original;
          return (
            <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateToView(ItemStatusID)}>
              {Status}
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
    setItemStatusColumns(columns);
  };
  //#endregion

  //#region Transformed Item Status Data For CSV Export
  const getTransformedItemStatusDataForExport = () => {
    return itemStatusListData.map((row) => ({
      "Sl No.": row.SlNo,
      "Item Status ID": row.ItemStatusID,
      "Status": row.Status,
      "Is Active?": row.IsActive,
    }));
  };

  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Render
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Item Status</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Item Status List{" "}
          {canAccessCreateItemStatus && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-8" onClick={moveToAddItemStatus} title="Add New Input Output Format"></i>
            </span>
          )}
        </h4>
        {canAccessViewItemStatus && (
          <div className="masters-material-table mg-l-10 itemStatusTable">
            <MaterialReactTable
              keyField="ItemStatusID"
              columns={itemStatusListTableColumns}
              data={itemStatusListData}
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
                  <CSVLink data={getTransformedItemStatusDataForExport()} filename="Item Status List.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportItemStatusListToExcel}>
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
export default ItemStatusList;