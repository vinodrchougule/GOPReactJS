import React, { useState, useEffect, useRef } from "react";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import roleService from "../../services/role.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { CSVLink } from "react-csv";

toast.configure();

function RolesList(props) {
  //#region State
  const [roles, setRoles] = useState([]);
  const [canAccessCreateRole, setCanAccessCreateRole] = useState(false);
  const [canAccessViewRole, setCanAccessViewRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const csvLink = useRef(null);
  //#endregion

  //#region Hooks and navigation
  const history = useHistory();
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("Create Role");
    canUserAccessPage("View Role");
    fetchRolesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region fetching Roles List from Web API
  const fetchRolesList = () => {
    setSpinnerMessage("Please wait while loading Role List...");
    setLoading(true);
    roleService
      .getAllRoles(helper.getUser(), false)
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));
        formattedArray = formattedArray.map((obj) => {
          delete obj.UserID;
          return obj;
        });
        setRoles(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Roles List page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create Role") {
          setCanAccessCreateRole(response.data);
        } else if (pageName === "View Role") {
          setCanAccessViewRole(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Redirect to Create Role Page
  const moveToCreateRole = () => {
    props.history.push("/admin/CreateRole");
  };
  //#endregion

  //#region Export Role List to Excel
  const exportRolesListToExcel = () => {
    setSpinnerMessage("Please wait while exporting role list to excel...");
    setLoading(true);
    let fileName = "Role List.xlsx";
    roleService
      .exportRoleListToExcel()
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
  const navigateToView = (RoleID) => {
    history.push({
      pathname: "/admin/ViewRole",
      state: { RoleID },
    });
  };
  //#endregion

  //#region Role List Data Table
  const roleListDataTable = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "RoleID",
        header: "Role ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "RoleName",
        header: "Role Name",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const { RoleID, RoleName } = row.original;
          return (
            <span style={{color: "blue", textDecoration: "underline", cursor: "pointer"}} onClick={() => navigateToView(RoleID)}> {RoleName} </span>
          );
        },
      },
      {
        accessorKey: "Description",
        header: "Description",
        muiTableHeadCellProps: { align: "center", style: { width: "20%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "IsActive",
        header: "Is Active",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
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
  const getTransformedRolesDataForExport = () => {
    return roles.map((row) => ({
      "Sl No.": row.SlNo,
      "Role ID": row.RoleID,
      "Role Name": row.RoleName,
      "Is Active": row.IsActive,
    }));
  };
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay
        active={loading}
        spinner={
          <div className="spinner-background">
            <BarLoader color="#38D643" width="350px" />
            <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
              {spinnerMessage || "Please wait while loading Roles List..."}
            </p>
          </div>
        }
      >
        <div className="az-content-breadcrumb">
          <span>Master</span>
          <span>Roles</span>
        </div>
        <h4 className="d-flex align-items-center">
          Roles List{" "}
          {canAccessCreateRole && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-8" onClick={moveToCreateRole} title="Add New Role"></i>
            </span>
          )}
        </h4>
        {canAccessViewRole && (
          <div className="masters-material-table rolesListTable">
            <MaterialReactTable columns={roleListDataTable()} data={roles} enablePagination={false} initialState={{ density: "compact" }}
              enableStickyHeader
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Export CSV">
                    <IconButton onClick={handleCSVExport}>
                      <FileDownloadIcon style={{color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem"}}/>
                    </IconButton>
                  </Tooltip>
                  <CSVLink data={getTransformedRolesDataForExport()} filename="Roles List.csv" ref={csvLink}/>
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportRolesListToExcel}>
                      <FaFileExcel style={{color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem"}}/>
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
export default RolesList;