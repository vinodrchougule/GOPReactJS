import React, { useState, useEffect, useRef } from "react";
import userRoleService from "../../services/userRole.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
import { Row, Col } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFileExcel } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { CSVLink } from "react-csv";

toast.configure();

function UserRoleList (props) {
  //#region state
  const [userRolesList, setUserRoles] = useState([]);
  const [canAccessCreateUserRole, setCanAccessCreateUserRole] = useState(false);
  const [canAccessViewUserRole, setCanAccessViewUserRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const csvLink = useRef(null);
  //#endregion

  //#region Hooks and navigation
   const history = useHistory();
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    canUserAccessPage("Create-Edit User Role(s)");
    canUserAccessPage("View User Role(s)");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region fetching User Roles List page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create-Edit User Role(s)") {
          setCanAccessCreateUserRole(response.data);
        } else if (pageName === "View User Role(s)") {
          setCanAccessViewUserRole(response.data);
        }
        fetchUserRole();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Redirect to User Roles Page
  const moveToCreateUserRole = () => {
    props.history.push("/admin/UserRoles");
  };
  //#endregion

  //#region fetching User Roles from Web API
  const fetchUserRole = () => {
    setSpinnerMessage("Please wait while loading User Role List...");
    setLoading(true);

    userRoleService
      .ReadUserRoles(helper.getUser())
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          IsActive: obj.IsActive === true ? "Yes" : "No",
        }));

        setUserRoles(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Export User Role List to Excel
  const exportUserRoleListToExcel = () => {
    setSpinnerMessage("Please wait while exporting user role list to excel...");
    setLoading(true);

    let fileName = "User Role List.xlsx";

    userRoleService
      .exportUserRoleListToExcel()
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

  //#region User List Data Table
  const userRoleListDataTable = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "UserName",
        header: "User Name",
        muiTableHeadCellProps: {
          align: "center",
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          align: "center",
          style: { cursor: "pointer", color: "blue", textDecoration: "underline" },
        },
        Cell: ({ row }) => {
          const { UserName } = row.original;
          return (
            <span style={{color: "blue", textDecoration: "underline", cursor: "pointer", }} onClick={() => navigateToView(UserName)}>
              {UserName}
            </span>
          );
        },
      },
      {
        accessorKey: "RoleName",
        header: "Role Name",
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

  //#region Navigate to View Role Page
  const navigateToView = (UserName) => {
    props.history.push({
      pathname: "/admin/ViewUserRole",
      state: { UserName }, 
    });
  };  
  //#endregion

  //#region Export to CSV
  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Transformed Roles Data CSV For Export
  const getTransformedRolesDataForExport = () => {
    return userRolesList.map((row) => ({
      "Sl No.": row.SlNo,
      "User Name": row.UserName,
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
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb">
          <span>Users</span>
          <span>User Roles-List</span>
        </div>
        <h4 className="d-flex align-items-center">
          User Role(s) List{" "}
          {canAccessCreateUserRole && (
            <span className="icon-size">
              <i className="fa fa-plus text-primary pointer mg-l-5" onClick={moveToCreateUserRole} title="Create User Role"></i>
            </span>
          )}
        </h4>
        <Row>
          <Col>
            <div className="content">
              <div className="user-role-list">
                {canAccessViewUserRole && (
                  <div className="masters-material-table mg-l-0 usersRolesListTable">
                    <MaterialReactTable columns={userRoleListDataTable()} data={userRolesList} enablePagination={false}
                      initialState={{ density: "compact" }} enableStickyHeader
                      renderTopToolbarCustomActions={() => (
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Export CSV">
                            <IconButton onClick={handleCSVExport}>
                              <FileDownloadIcon style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem" }}/>
                            </IconButton>
                          </Tooltip>
                          <CSVLink data={getTransformedRolesDataForExport()} filename="User Roles List.csv" ref={csvLink} />
                          <Tooltip title="Export Excel">
                            <IconButton onClick={exportUserRoleListToExcel}>
                              <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </LoadingOverlay>
    </div>
  );
  //#endregion
};
export default UserRoleList;