import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import roleAccessService from "../../services/roleAccess.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";

toast.configure();

function EditRoleAccess(props) {
  //#region state
  const [roleAccess, setRoleAccess] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [grantAll, setGrantAll] = useState(false);
  const [revokeAll, setRevokeAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
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
      props.history.push({
        pathname: "/",
      });
      return;
    }
    fetchRoleAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching selected Role Access details
  const fetchRoleAccess = () => {
    const { state } = props.location; 
    if (state === 0 || state === null || state === undefined) {
      props.history.push("/admin/RoleAccessList");
      return;
    }
    setRoleName(state);
    setSpinnerMessage("Please wait while loading Role Access...");
    setLoading(true);

    roleAccessService
      .ReadRoleAccessByRoleName(state, helper.getUser())
      .then((response) => {
        setRoleAccess(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region get IsActive value
  const onChangeIsActive = (PageName, IsActive) => {
    console.log(roleAccess, "roleAccess")
    console.log(PageName, "RoleName")
    const updatedRoleAccess = roleAccess.map((role) =>
      role.PageName === PageName ? { ...role, IsActive } : role
    );
    setRoleAccess(updatedRoleAccess);
    setGrantAll(false);
    setRevokeAll(false);
  };  
  //#endregion

  //#region Save Role Access
  const saveEditRoleAccess = (e) => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
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
        toast.success("Role Access Updated Successfully");
        resetEditRoleAccess();
        props.history.push({
          pathname: "/admin/RoleAccessList",
        });
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Grant All or Revoke all
  const grantAllOrRevokeAll = (value) => {
    const updatedRoleAccess = roleAccess.map((obj) => ({
      ...obj,
      IsActive: value,
    }));
    setRoleAccess(updatedRoleAccess);
    setGrantAll(value);
    setRevokeAll(!value);
  };
  //#endregion

  //#region Reset the page
  const resetEditRoleAccess = () => {
    setRoleAccess([]);
    setRoleName(initialState.roleName);
    setGrantAll(initialState.grantAll);
    setRevokeAll(initialState.revokeAll);
    setLoading(initialState.loading);
    setSpinnerMessage(initialState.spinnerMessage);
    fetchRoleAccess();
    onChangeIsActive();
  };
  //#endregion

  //#region Edit Role Access Table
  const editRoleAccessTable = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
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
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell, row }) => (
          <input type="checkbox" value={cell.getValue()} onChange={() => onChangeIsActive(row.original.PageName, !cell.getValue())} checked={cell.getValue()}/>
        ),
      },
    ];
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
          <span>Role</span>
          <span>Role Access</span>
        </div>
        <h4 className="d-flex align-items-center">
          Edit Role Access{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => props.history.push("/admin/RoleAccessList")} title="Back to Role Access List"></i>
          </span>
        </h4>
        <div id="Add_form">
          <Row className="mg-t-15">
            <Col md={4}>
              <div className="editRoleAccessFloatingInput">
                <FloatingLabel
                  label={
                    <>
                      Role Name <span className="text-danger">*</span>
                    </>
                  }
                  className="float-hidden float-select">
                  <input type="text" className="form-control" maxLength="50" id="roleName" name="roleName" value={roleName} readOnly />
                </FloatingLabel>
              </div>
            </Col>
            <Col md={4} style={{ marginTop: "10px" }}>
              <div className="row text-nowrap">
                {roleAccess.length > 0 && (
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
              </div>
            </Col>
          </Row>
          <div className="masters-material-table mg-t-15 editRoleAccessListTable">
            <MaterialReactTable columns={editRoleAccessTable()} data={roleAccess} enablePagination={false} initialState={{density: "compact", columnVisibility: {RoleName: false,},}} enableStickyHeader/>
            <Row className="mg-t-20">
              <Col md={11}>
                <Row>
                  <Col md={4}></Col>
                  <Col md={2} className="mg-t-10 mg-lg-t-0">
                    <button id="Save" onClick={saveEditRoleAccess} className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block">Save</button>
                  </Col>
                  <Col md={1}></Col>
                  <Col md={2} className="mg-t-10 mg-lg-t-0">
                    <button id="Reset" onClick={resetEditRoleAccess} className="btn btn-gray-700 btn-block">Reset</button>
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
export default EditRoleAccess;