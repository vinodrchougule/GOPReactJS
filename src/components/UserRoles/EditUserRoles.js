import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import userRoleService from "../../services/userRole.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";

toast.configure();

function EditUserRole (props) {
  //#region state
  const [userRoles, setUserRoles] = useState([]);
  const [userName, setUserName] = useState("");
  const [grantAll, setGrantAll] = useState(false);
  const [revokeAll, setRevokeAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion
  
  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    fetchUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);
  //#endregion

  //#region Fetch User Roles
  const fetchUserRoles = () => {
    const { state } = props.location;
    if (!state) {
      props.history.push("/admin/UserRolesList");
      return;
    }

    setUserName(state);
    setSpinnerMessage("Please wait while loading User Roles...");
    setLoading(true);

    userRoleService
      .ReadUserRolesByUserName(state, helper.getUser())
      .then((response) => {
        setUserRoles(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Change Is Active
  const onChangeIsActive = (RoleName, IsActive) => {
    const updatedUserRoles = userRoles.map((role) =>
      role.RoleName === RoleName ? { ...role, IsActive } : role
    );
    setUserRoles(updatedUserRoles);
    setGrantAll(false);
    setRevokeAll(false);
  };
  //#endregion

  //#region Save Role Access
  const saveEditUserRole = () => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }

    setSpinnerMessage("Please wait while saving User Roles...");
    setLoading(true);

    const data = {
      UserRoleID: 0,
      UserRolesList: userRoles,
      UserID: helper.getUser(),
    };

    userRoleService
      .createUserRole(data)
      .then(() => {
        toast.success("User Role Updated Successfully");
        resetEditUserRole(); 
        props.history.push("/admin/UserRolesList");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.Message, { autoClose: false });
      });
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
  const resetEditUserRole = () => {
    setUserRoles([]);
    setUserName("");
    setGrantAll(false);
    setRevokeAll(false);
    setLoading(false);
    setSpinnerMessage("");
    fetchUserRoles();
    onChangeIsActive();
  };
  //#endregion

  //#region Edit User Role List Data Table
  const editUserRoleListTable = () => {
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
          <input type="checkbox" value={cell.getValue()} onChange={() => onChangeIsActive(row.original.RoleName, !cell.getValue())} checked={cell.getValue()}/>
        ),
      },
    ];
  };
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay active={loading} className="custom-loader" spinner={
        <div className="spinner-background">
          <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
          <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
        </div>
      }>
        <div className="az-content-breadcrumb">
          <span>Users</span>
          <span>User Roles</span>
        </div>
        <h4 className="d-flex align-items-center">
          Edit User Role(s)
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.push("/admin/UserRolesList")} title="Back to User Role List"></i>
          </span>
        </h4>
        <div id="Add_form">
          <Row className="mg-t-15">
            <Col md={4}>
              <div className="createUserFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      User Name <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="userName" name="userName" value={userName} readOnly />
                </FloatingLabel>
              </div>
            </Col>
            <Col md={4} style={{ marginTop: "10px" }}>
              {userRoles.length > 0 && (
                <div className="d-flex align-items-center">
                  <div className="sldeuserroles d-flex align-items-center">
                    <label htmlFor="grantAll" className="mg-r-10">
                      <b>Grant All</b>
                    </label>
                    <label className="switch">
                      <input type="checkbox" checked={grantAll} id="grantAll" name="grantAll" value={grantAll} onChange={() => grantAllOrRevokeAll(true)} />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="sldeuserroles d-flex align-items-center mg-l-10">
                    <label htmlFor="revokeAll" className="mg-r-10">
                      <b>Revoke All</b>
                    </label>
                    <label className="switch">
                      <input type="checkbox" checked={revokeAll} id="revokeAll" name="revokeAll" value={revokeAll} onChange={() => grantAllOrRevokeAll(false)} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}

            </Col>
          </Row>
          <div className="masters-material-table mg-t-15 createUserListTable">
            <MaterialReactTable columns={editUserRoleListTable()} data={userRoles} enablePagination={false}
              initialState={{density: "compact", columnVisibility: {UserName: false,},}} enableStickyHeader />
            <Row className="mg-t-20">
              <Col md={11}>
                <Row>
                  <Col md={4}></Col>
                  <Col md={2} className="mg-t-10 mg-lg-t-0">
                    <button id="Save" onClick={saveEditUserRole} className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block">Save</button>
                  </Col>
                  <Col md={1}></Col>
                  <Col md={2} className="mg-t-10 mg-lg-t-0">
                    <button id="Reset" onClick={resetEditUserRole} className="btn btn-gray-700 btn-block">Reset</button>
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
};
export default EditUserRole;