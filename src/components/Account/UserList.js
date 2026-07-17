import React, { useState, useEffect, useRef } from "react";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import userService from "../../services/user.service";
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
import * as http from "../../http-common";
import moment from "moment";
toast.configure();

function UserList(props) {
  //#region State
  const [userLists, setUserLists] = useState([]);
  const [canAccessCreateUser, setCanAccessCreateUser] = useState(false);
  const [canAccessViewUser, setCanAccessViewUser] = useState(false);
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
    canUserAccessPage("Create User");
    canUserAccessPage("View User");
    fetchUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Export to CSV
  const handleCSVExport = () => {
    csvLink.current.link.click();
  };
  //#endregion

  //#region Transformed Roles Data CSV For Export
  const getTransformedUserListDataForExport = () => {
    return userLists.map((row, index) => ({
      "Sl No.": index + 1,
      "User ID": row.UserID,
      "Full Name": row.FullName,
      "Role ID": row.RoleID,
      "Role Name": row.RoleName,
      Department: row.DepartmentName || "N/A",
      "Manager Name": row.ManagerName || "N/A",
      "Email ID": row.Email || "N/A",
      "Active Status": row.IsActive ? "Yes" : "No",
      "Is Locked Out": row.IsLockedOut === "Yes" ? "Locked" : "Unlocked",
      "Relieving Date": row.RelievingDate
        ? moment(row.RelievingDate).format("DD-MM-YYYY")
        : "N/A",
    }));
  };
  //#endregion

  // #region service call for reset userCredential
  const resetCredential = (userId) => {
    userService
      .resetUserCredential(userId, helper.getUser())
      .then((response) => {
        if (response.data === "SUCCESS") {
          toast.success("User credential reset successfully!");
          fetchUsersList();
        } else {
          toast.error(response?.Message, { autoClose: false });
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  // #endregion

  //#region Navigate to View Role Page
  const navigateToView = (UserID) => {
    history.push({
      pathname: "/admin/ViewUser",
      state: { UserID },
    });
  };
  //#endregion

  //#region User List Data Table
  const userListDataTable = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        size: 100,
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "UserID",
        header: "User ID",
        size: 100,
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "FullName",
        header: "Full Name",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "UserName",
        header: "User Name",
        size: 100,
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const { UserID, UserName } = row.original;
          return (
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => navigateToView(UserID)}
            >
              {UserName}
            </span>
          );
        },
      },
      {
        accessorKey: "PhotoFileName",
        header: "Photo",
        muiTableHeadCellProps: { align: "center", style: { width: "20%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const photoFileName = row.original.PhotoFileName;
          if (photoFileName) {
            return (
              <img
                src={`${http.baseURL}project/downloadfile?FileName=${photoFileName}&FileType=profilephoto`}
                alt="Profile"
                width="30"
                height="30"
                className="profile-img"
              />
            );
          }
          return null;
        },
      },
      {
        accessorKey: "Email",
        header: "Email ID",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "DepartmentName",
        header: "Department",
        size: 100,
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "ManagerName",
        header: "Manager",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "IsLockedOut",
        header: "Is Locked Out?",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "RelievingDate",
        header: "Relieving Date",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const relievingDate = row.original.RelievingDate;
          return (
            <div>
              {relievingDate
                ? moment(new Date(relievingDate)).format("DD-MM-YYYY")
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "UserCredentialReset",
        header: "User Credential Reset",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const isLockedOut = row.original.IsLockedOut === "Yes";
          const hasRelievingDate = !!row.original.RelievingDate;

          return isLockedOut && !hasRelievingDate ? (
            <div
              onClick={() => resetCredential(row.original.UserID)}
              style={{ cursor: "pointer" }}
            >
              <i className="fa fa-lock" aria-hidden="true"></i>
            </div>
          ) : null;
        },
      },
    ];
  };
  //#endregion

  //#region Fetching User List page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create User") {
          setCanAccessCreateUser(response.data);
        } else if (pageName === "View User") {
          setCanAccessViewUser(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Users List from Web API
  const fetchUsersList = () => {
    setSpinnerMessage("Please wait while loading User List...");
    setLoading(true);
    userService
      .getAllUsers(helper.getUser(), false)
      .then((response) => {
        const formattedArray = response.data.map((obj) => ({
          ...obj,
          FullName: `${obj.FirstName} ${
            obj.MiddleName ? obj.MiddleName + " " : ""
          }${obj.LastName}`,
          IsLockedOut: obj.IsLockedOut === true ? "Yes" : "No",
        }));
        setUserLists(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Redirect to Create User Page
  const moveToCreateUser = () => {
    props.history.push("/admin/CreateUser");
  };
  //#endregion

  //#region Export User List to Excel
  const exportUserListToExcel = () => {
    setSpinnerMessage("Please wait while exporting user list to excel...");
    setLoading(true);
    let fileName = "User List.xlsx";
    userService
      .exportUserListToExcel()
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
    <div>
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
        <div className="az-content-breadcrumb">
          <span>Admin</span>
          <span>Users-List</span>
        </div>
        <h4 className="d-flex align-items-center">
          Users List{" "}
          {canAccessCreateUser && (
            <span className="icon-size">
              <i
                className="fa fa-plus text-primary pointer mg-l-5"
                onClick={moveToCreateUser}
                title="Add New User"
              ></i>
            </span>
          )}
        </h4>
        {canAccessViewUser && (
          <div className="masters-material-table usersListTable">
            <MaterialReactTable
              columns={userListDataTable()}
              data={userLists}
              enablePagination={false}
              initialState={{ density: "compact" }}
              enableStickyHeader
              renderTopToolbarCustomActions={() => (
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Export CSV">
                    <IconButton onClick={handleCSVExport}>
                      <FileDownloadIcon
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          fontSize: "1.5rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <CSVLink
                    data={getTransformedUserListDataForExport()}
                    filename="Users List.csv"
                    ref={csvLink}
                  />
                  <Tooltip title="Export Excel">
                    <IconButton onClick={exportUserListToExcel}>
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
        )}
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default UserList;
