import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import { Link, useHistory, useLocation } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import roleAccessService from "../../services/roleAccess.service";
import accessControlService from "../../services/accessControl.service";
import { MaterialReactTable } from "material-react-table";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Row, Col } from "react-bootstrap";

toast.configure();

function ViewRoleAccess (props) {
  //#region state
  const [roleName, setRoleName] = useState("");
  const [roleAccess, setRoleAccess] = useState([]);
  const [canAccessEditRoleAccess, setCanAccessEditRoleAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region History
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("Create-Edit Role Access");
    if (location.state && location.state.RoleName) {
      setRoleName(location.state.RoleName);
      fetchRoleAccess(location.state.RoleName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location]);
  //#endregion

  //#region fetching Role Access page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setCanAccessEditRoleAccess(response.data);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetching selected User Role details
  const fetchRoleAccess = (roleName) => {
    const { state } = location; 
    if (state === 0 || state === null || state === undefined) {
      history.push("/admin/RoleAccessList");
      return;
    }
    setSpinnerMessage("Please wait while loading Role Access...");
    setLoading(true);
  
    roleAccessService
      .ReadRoleAccessByRoleName(roleName, helper.getUser())
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

  //#region Role List Data Table
  const viewRoleAccessListTable = () => {
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
        header: "Is Active",
        muiTableHeadCellProps: {
          align: "center",
          style: { width: "10%" },
        },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" value={row.original.IsActive} checked={row.original.IsActive} readOnly />
          </div>
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
          <span>Users</span>
          <span>Role Access</span>
        </div>
        <h4 className="d-flex align-items-center">
          View Role Access{" "}
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => history.goBack()} title="Back to Role Access List"></i>
          </span>
        </h4>
        <div id="Add_form">
          <Row className="mg-t-15">
            <Col md={4}>
              <div className="viewRoleAccessFloatingInput">
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
          </Row>
          <div className="masters-material-table mg-t-15 viewRoleAccessListTable">
            <MaterialReactTable columns={viewRoleAccessListTable()} data={roleAccess} enablePagination={false} initialState={{density: "compact", columnVisibility: {RoleName: false,},}} enableStickyHeader />
            <div>
              <div className="row row-sm col-md-11 mg-t-15">
                <div className="col-md-6"></div>
                {canAccessEditRoleAccess && (
                  <div className="col-md-2 mg-t-10 mg-lg-t-0">
                    <Link to={{pathname: "/admin/EditRoleAccess", state: roleName}} className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block">Edit</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ViewRoleAccess;