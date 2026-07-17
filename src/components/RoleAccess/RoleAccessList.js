import React, { useState, useEffect, useRef } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import roleAccessService from "../../services/roleAccess.service";
import accessControlService from "../../services/accessControl.service";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { CSVLink } from "react-csv";
toast.configure();

function RoleAccessList(props) {
  //#region State
  const [roleAccessList, setRoleAccessList] = useState([]);
  const [canAccessCreateRoleAccess, setCanAccessCreateRoleAccess] = useState(false);
  const [canAccessViewRoleAccess, setCanAccessViewRoleAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const csvLink = useRef(null);
  //#endregion

  //#region History
  const history = useHistory();
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("Create-Edit Role Access");
    canUserAccessPage("View Role Access");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);
  //#endregion

  //#region Redirect to Create User Role Page
  const moveToCreateRoleAccess = () => {
    history.push("/admin/RoleAccess");
  };
  //#endregion

  //#region Fetch Role Access page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create-Edit Role Access") {
          setCanAccessCreateRoleAccess(response.data);
        } else if (pageName === "View Role Access") {
          setCanAccessViewRoleAccess(response.data);
        }
        fetchRoleAccess();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Role Access from Web API
  const fetchRoleAccess = () => {
    setSpinnerMessage("Please wait while loading Role Access List...");
    setLoading(true);

    roleAccessService
      .ReadRoleAccess(helper.getUser())
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));

        setRoleAccessList(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Export Role Access List to Excel
  const exportRoleAccessListToExcel = () => {
    setSpinnerMessage("Please wait while exporting role access list to excel...");
    setLoading(true);

    let fileName = "Role Access List.xlsx";
    roleAccessService
      .exportRoleAccessListToExcel()
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

  //#region Navigate to View Role Page
  const navigateToView = (RoleName) => {
    props.history.push({
      pathname: "/admin/ViewRoleAccess",
      state: { RoleName }, 
    });
  };
  //#endregion

  //#region User List Data Table
  const RoleAccessListTableData = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "RoleName",
        header: "Role Name",
        muiTableHeadCellProps: {
          align: "center",
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          align: "center",
          style: { cursor: "pointer", color: "blue", textDecoration: "underline" }, 
        },
        Cell: ({ row }) => {
          const { RoleName } = row.original;
          return (
            <span style={{color: "blue", textDecoration: "underline", cursor: "pointer",}} onClick={() => navigateToView(RoleName)}> {RoleName} </span>
          );
        },

      },
      {
        accessorKey: "PageName",
        header: "Page Name",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "IsActive",
        header: "Is Active?",
        muiTableHeadCellProps: { align: "center", style: { width: "20%" } },
        muiTableBodyCellProps: { align: "center" },
      },
    ];
  };
  //#endregion

  //#region Export to CSV
  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Transformed Roles Data CSV For Export
  const getTransformedRolesAccessListDataForExport = () => {
    return roleAccessList.map((row) => ({
      "Sl No.": row.SlNo,
      "Role Name": row.RoleName,
      "Page Name": row.PageName,
      "Is Active": row.IsActive,
    }));
  };
  //#endregion

  //#region Return
  return (
    <div>
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
        <div className="az-content-breadcrumb">
          <span>Users</span>
          <span>Role Access-List</span>
        </div>
        <h4 className="d-flex align-items-center">
          Role Access List{" "}
          {canAccessCreateRoleAccess && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-5" onClick={moveToCreateRoleAccess} title="Create User Role"></i>
            </span>
          )}
        </h4>
        {canAccessViewRoleAccess && (
          <div className="masters-material-table mg-l-0 rolesAccessListTable">
            <MaterialReactTable columns={RoleAccessListTableData()} data={roleAccessList}
              enablePagination={false} initialState={{ density: "compact" }} enableStickyHeader
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Export CSV">
                    <IconButton onClick={handleCSVExport}>
                      <FileDownloadIcon style={{color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem"}}/>
                    </IconButton>
                  </Tooltip>
                  <CSVLink data={getTransformedRolesAccessListDataForExport()} filename="Roles Access List.csv" ref={csvLink} />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportRoleAccessListToExcel}>
                      <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}/>
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
export default RoleAccessList;