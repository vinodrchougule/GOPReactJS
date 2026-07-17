import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import userService from "../../services/user.service";
import userRoleService from "../../services/userRole.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function CreateUserRole(props) {
  //#region state
  const [userRoles, setUserRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [username, setUsername] = useState("");
  const [grantAll, setGrantAll] = useState(false);
  const [revokeAll, setRevokeAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region History
  const history = useHistory();
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    if (sessionStorage.getItem("isReload")) {
      sessionStorage.removeItem("isReload");
      history.push("/admin/UserRolesList");
      return;
    }
    
    fetchUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetch users list
  const fetchUsersList = () => {
    setSpinnerMessage("Please wait while loading User List...");
    setLoading(true);

    userService
      .getAllUsers(helper.getUser())
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region User List Data Table
  const userListDataTable = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "UserName",
        header: "User Name",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
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
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell, row }) => (
          <input type="checkbox" value={cell.getValue()} onChange={() => onChangeIsActive(row.original.RoleName, !cell.getValue())} checked={cell.getValue()} />
        ),
      },
    ];
  };
  //#endregion

  //#region Handler to toggle the 'IsActive' state
  const onChangeIsActive = (RoleName, IsActive) => {
    const updatedUserRoles = userRoles.map((role) =>
      role.RoleName === RoleName ? { ...role, IsActive } : role
    );
    setUserRoles(updatedUserRoles); // This will update the state and re-render the component
    setGrantAll(false);
    setRevokeAll(false);
  };
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const userName = username.trim();
    let errors = {};
    let isValidForm = true;

    // Validating user name
    if (!userName) {
      isValidForm = false;
      errors["UsernameError"] = "Username is required";
    }

    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Save Role Access
  const saveCreateUserRole = (e) => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving User Role...");
      setLoading(true);
      const data = {
        UserRoleID: 0,
        UserRolesList: userRoles,
        UserID: helper.getUser(),
      };
      userRoleService
        .createUserRole(data)
        .then(() => {
          toast.success("User Role Added Successfully");
          setUserRoles([]);
          history.push({
            pathname: "/admin/UserRolesList",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Grant All or Revoke all
  const grantAllOrRevokeAll = (value) => {
    const updatedUserRoles = userRoles.map((obj) => ({
      ...obj,
      IsActive: value,
    }));
    setUserRoles(updatedUserRoles);
    setGrantAll(value);
    setRevokeAll(!value);
  };
  //#endregion

  //#region Reset the page
  const resetCreateUserRole = () => {
    setGrantAll(false);
    setRevokeAll(false);
    setFormErrors({});
    setLoading(false);
    setSpinnerMessage("");
    onChangeIsActive();
    fetchUsersList();
    getUserRoles(username)
  };
  //#endregion

  //#region Change Username
  const onChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value);
    getUserRoles(value)
  };
  //#endregion
  //#region to get user roles
  const getUserRoles = (valueSet) => {
    const value = valueSet;
    if (value && value.trim()) {
      const username = value.split("-")[0].trim();
      const userID = helper.getUser();
      userRoleService
        .ReadUserRolesByUserName(username, userID)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setUserRoles(response.data);
          } else {
            setUserRoles([]);
          }
        })
        .catch((e) => {
          toast.error(e.response?.data?.Message || "Error fetching roles");
          setUserRoles([]);
        });
    } else {
      setUserRoles([]);
    }
  }
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay active={loading} className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb">
          <span>Users</span>
          <span>User Roles</span>
        </div>
        <h4 className="d-flex align-items-center">
          Create User Role(s)
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to User Role List"></i>
          </span>
        </h4>
        <div id="Add_form">
          <Row className="mg-t-15 align-items-center">
            <Col md={4}>
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      <b>User Name</b><span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <select className="form-control" id="username" name="username" value={username} onChange={onChangeUsername}>
                    <option value="">--Select--</option>
                    {users.map((user) => (
                      <option key={user.UserID} value={user.UserName}>
                        {`${user.UserName} - ${user.FirstName || ""} ${user.MiddleName || ""} ${user.LastName || ""}`}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {formErrors["UsernameError"]}
                  </div>
                </FloatingLabel>
              </div>
            </Col>
            <Col md={4}>
              {userRoles.length > 0 && (
                <div className="d-flex align-items-center mg-b-10">
                  <div className="sldeuserroles d-flex align-items-center">
                    <label htmlFor="grantAll" className="mg-r-10">
                      <b>Grant All</b>
                    </label>
                    <label className="switch">
                      <input type="checkbox" checked={grantAll} id="grantAll" name="grantAll" value={grantAll} onChange={() => grantAllOrRevokeAll(true)} className="mg-l-10" />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="sldeuserroles d-flex align-items-center mg-l-10">
                    <label htmlFor="revokeAll" className="mg-r-10">
                      <b>Revoke All</b>
                    </label>
                    <label className="switch">
                      <input type="checkbox" checked={revokeAll} id="revokeAll" name="revokeAll" value={revokeAll} onChange={() => grantAllOrRevokeAll(false)} className="mg-l-10" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}
            </Col>
          </Row>
          <div className="masters-material-table mg-t-10 createUserListTable">
            <MaterialReactTable columns={userListDataTable()}
              data={userRoles.map((role, index) => ({ SlNo: index + 1, UserName: username, RoleName: role.RoleName || "No Role", IsActive: role.IsActive, }))}
              enablePagination={false} initialState={{ density: "compact", columnVisibility: { UserName: false, }, }} enableStickyHeader />
            <Row className="mg-t-20">
              <Col md={11}>
                <Row>
                  <Col md={4}></Col>
                  <Col md={2} className="mg-t-10 mg-lg-t-0">
                    <button id="Save" onClick={saveCreateUserRole} className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block">Save</button>
                  </Col>
                  <Col md={1}></Col>
                  <Col md={2} className="mg-t-10 mg-lg-t-0">
                    <button id="Reset" onClick={resetCreateUserRole} className="btn btn-gray-700 btn-block">Reset</button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default CreateUserRole;