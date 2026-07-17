import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import roleService from "../../services/role.service";
import roleAccessService from "../../services/roleAccess.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function CreateRoleAccess(props) {
  //#region State
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [roleAccess, setRoleAccess] = useState([]);
  const [grantAll, setGrantAll] = useState(false);
  const [revokeAll, setRevokeAll] = useState(false);
  //#endregion

  //#region InitialState
  const initialState = {
    roleAccess: [],
    roleName: "",
    grantAll: false,
    revokeAll: false,
    loading: false,
    spinnerMessage: "",
    index: 30,
    position: 0,
    columns: [],
    selectedColumn: "",
    selectedSort: "",
    isToShowSortingFields: false,
    isToShowFilteringField: true,
    filteredArray: [],
    filterValue: "",
  };
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push("/");
      return;
    }
    fetchRolesList();
  }, [props.history]);
  //#endregion

  //#region Fetching Roles List from Web API
  const fetchRolesList = () => {
    setLoading(true);
    roleService
      .getAllRoles(helper.getUser(), true)
      .then((response) => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message || "");
      });
  };
  //#endregion

  //#region Fetching Page Names based on Role Name
  const handleRoleNameChange = (e) => {
    const value = e.target.value;
    setRoleName(value);
    getRoleNames(value)
  };
  //#endregion

  //#region to get user roles
  const getRoleNames = (valueSet) => {
    const value = valueSet;
    if (value) {
      setSpinnerMessage("Loading Role Access List...");
      setLoading(true);

      roleAccessService
        .ReadRoleAccessByRoleName(value, helper.getUser())
        .then((response) => {
          setRoleAccess(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response?.data?.Message || "Error fetching role access");
        });
    } else {
      setRoleAccess([]);
    }
  }
  //#endregion

  //#region Get IsActive value
  const handleIsActiveChange = (pageName, isActive) => {
    const updatedRoleAccess = roleAccess.map((item) =>
      item.PageName === pageName ? { ...item, IsActive: isActive } : item
    );
    setGrantAll(false);
    setRevokeAll(false);
    setRoleAccess(updatedRoleAccess);
  };
  //#endregion

  //#region Create User List Table
  const userListDataTable = () => [
    {
      accessorKey: "SlNo",
      header: "Sl No.",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
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
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },

      Cell: ({ row }) => (
        <input type="checkbox" checked={row.original.IsActive} onChange={() => handleIsActiveChange(row.original.PageName, !row.original.IsActive)} />
      ),
    },
  ];
  //#endregion

  //#region Grant All or Revoke all
  const grantAllOrRevokeAll = (value) => {
    const updatedRoleAccess = roleAccess.map((obj) => ({
      ...obj,
      IsActive: value,
    }));
    setGrantAll(value);
    setRevokeAll(!value);
    setRoleAccess(updatedRoleAccess);
  };
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const roleNameTrimmed = roleName.trim();
    let errors = {};
    let isValid = true;
    if (!roleNameTrimmed) {
      isValid = false;
      errors["RoleNameError"] = "Role Name is required";
    }
    setFormErrors(errors);
    return isValid;
  };
  //#endregion

  //#region Save Role Access
  const saveCreateRoleAccess = () => {
    if (!helper.getUser()) {
      props.history.push("/");
      return;
    }
    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while saving Role Access...");
      setLoading(true);
      const data = {
        RoleAccessID: 0,
        RoleAccessList: roleAccess,
        UserID: helper.getUser(),
      };
      roleAccessService
        .updateRoleAccess(data)
        .then(() => {
          toast.success("Role Access Added Successfully");
          setLoading(false);
          props.history.push("/admin/RoleAccessList");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response?.data?.Message || "", {
            autoClose: false,
          });
        });
    }
  };
  //#endregion

  //#region Reset the page
  const resetCreateRoleAccess = () => {
    getRoleNames(roleName)
    setFormErrors({});
    setGrantAll(initialState.grantAll);
    setRevokeAll(initialState.revokeAll);
  };
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
          Create Role Access
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.goBack()} title="Back to Role Access List"></i>
          </span>
        </h4>

        <Row className="mg-t-15 align-items-center">
          <Col md={4}>
            <div className="createUserFloatingInput">
              <FloatingLabel
                label={
                  <>
                    <b>Role Name</b><span className="text-danger">*</span>
                  </>
                }
                className="float-hidden float-select"
              >
                <select className="form-control" id="roleName" name="roleName" value={roleName} onChange={handleRoleNameChange}>
                  <option value="">--Select--</option>
                  {roles.map((role) => (
                    <option key={role.RoleID} value={role.RoleName}>
                      {role.RoleName}
                    </option>
                  ))}
                </select>
                {formErrors.RoleNameError && (
                  <div className="error-message">{formErrors.RoleNameError}</div>
                )}
              </FloatingLabel>
            </div>
          </Col>
          <Col md={4}>
            {roleName.length > 0 && (
              <div className="d-flex align-items-center">
                <div className="sldeuserroles d-flex align-items-center">
                  <label htmlFor="grantAll" className="mg-r-10">
                    <b>Grant All</b>
                  </label>
                  <label className="switch">
                    <input type="checkbox" checked={grantAll} id="grantAll" name="grantAll" value={grantAll} onChange={() => grantAllOrRevokeAll(true)}/>
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="sldeuserroles d-flex align-items-center mg-l-10">
                  <label htmlFor="revokeAll" className="mg-r-10">
                    <b>Revoke All</b>
                  </label>
                  <label className="switch">
                    <input type="checkbox" checked={revokeAll} id="revokeAll" name="revokeAll" value={revokeAll} onChange={() => grantAllOrRevokeAll(false)}/>
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}
          </Col>
        </Row>
        <div className="masters-material-table mg-t-10 createUserListTable">
          <MaterialReactTable columns={userListDataTable()} data={roleAccess} enablePagination={false} initialState={{ density: "compact" }} enableStickyHeader />
        </div>
        <Row className="mg-t-20">
          <Col md={11}>
            <Row>
              <Col md={4}></Col>
              <Col md={2}>
                <button id="Save" onClick={saveCreateRoleAccess} className="btn btn-gray-700 btn-block">Save</button>
              </Col>
              <Col md={2}>
                <button id="Reset" onClick={resetCreateRoleAccess} className="btn btn-gray-700 btn-block">Reset</button>
              </Col>
            </Row>
          </Col>
        </Row>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default CreateRoleAccess;