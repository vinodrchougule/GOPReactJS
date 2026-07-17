import React, { useState, useEffect, useRef } from "react";
import customerFeedbackTypeService from "../../services/customerFeedbackType.service";
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

toast.configure();

const CustomerFeedbackTypeList = (props) => {
  const csvLink = useRef(null);
  //#region State
  const [customerFeedbackTypes, setCustomerFeedbackTypes] = useState([]);
  const [canAccessCreateCustomerFeedbackType, setCanAccessCreateCustomerFeedbackType] = useState(false);
  const [canAccessViewCustomerFeedbackType, setCanAccessViewCustomerFeedbackType] = useState(false);
  const [customerFeedbackListTableColumns, setCustomerFeedbackTypeColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  
  const history = useHistory();

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage("Create Customer Feedback Type");
    canUserAccessPage("View Customer Feedback Type");
    CustomerFeedbackTypeListTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetch Customer Feedback Types
  const fetchCustomerFeedbackTypes = () => {
    setSpinnerMessage("Please wait while loading Customer Feedback Type...");
    setLoading(true);

    customerFeedbackTypeService
      .getCustomerFeedbackTypes(helper.getUser(), false)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive ? "Yes" : "No",
        }));
        setCustomerFeedbackTypes(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetching Customer Feedback Type List Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create Customer Feedback Type") {
          setCanAccessCreateCustomerFeedbackType(response.data);
        } else if (pageName === "View Customer Feedback Type") {
          setCanAccessViewCustomerFeedbackType(response.data);
        }
        fetchCustomerFeedbackTypes();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Navigate to View Customer Feedback Type
  const navigateToView = (CustomerFeedbackTypeID) => {
    history.push({
      pathname: "/Masters/ViewCustomerFeedbackType",
      state: { CustomerFeedbackTypeID },
    });
  };
  //#endregion

  //#region Customer Feedback Type List Table
  const CustomerFeedbackTypeListTable = () => {
    const columns = [
    {
      accessorKey: "SlNo",
      header: "Sl No.",
      muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "CustomerFeedbackTypeID",
      header: "Customer Feedback Type ID",
      muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "FeedbackType",
      header: "Feedback Type",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "left" },
      Cell: ({ row }) => {
        const { CustomerFeedbackTypeID, FeedbackType } = row.original;
        return (
          <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateToView(CustomerFeedbackTypeID)}>
            {FeedbackType}
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
  ]
  setCustomerFeedbackTypeColumns(columns);
  };

  //#region Transformed Customer Feedback Data Export to CSV
  const getTransformedCustomerFeedbackDataForExport = () => {
    return customerFeedbackTypes.map((row) => ({
      "Sl No.": row.SlNo,
      "Customer Feedback Type ID": row.CustomerFeedbackTypeID,
      "Feedback Type": row.FeedbackType,
      "Is Active?": row.IsActive,
    }));
  };

  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Export Customer Feedback Type List to Excel
  const exportCustomerFeedbackTypeListToExcel = () => {
    setSpinnerMessage("Please wait while exporting Customer Feedback Type List to excel...");
    setLoading(true);

    let fileName = "Customer Feedback Type List.xlsx";

    customerFeedbackTypeService
      .exportCustomerFeedbackTypeListToExcel()
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
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
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Customer Feedback Type</span>
        </div>
        <h4 className="mg-l-10 d-flex align-items-center">
          Customer Feedback Type List{" "}
          {canAccessCreateCustomerFeedbackType && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-8" onClick={() => props.history.push("/Masters/CreateCustomerFeedbackType")} title="Add New Customer Feedback Type"></i>
            </span>
          )}
        </h4>
        {canAccessViewCustomerFeedbackType && (
          <div className="masters-material-table mg-l-10 customerFeedbackTypeListTable">
            <MaterialReactTable
              keyField="GenericActivityID"
              columns={customerFeedbackListTableColumns}
              data={customerFeedbackTypes}
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
                  <CSVLink data={getTransformedCustomerFeedbackDataForExport()} filename="Customer Feedback Type List.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportCustomerFeedbackTypeListToExcel}>
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

export default CustomerFeedbackTypeList;
