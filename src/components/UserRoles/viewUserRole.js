import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import helper from "../../helpers/helpers";
import userRoleService from "../../services/userRole.service";
import accessControlService from "../../services/accessControl.service";
import { MaterialReactTable } from "material-react-table";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

toast.configure();

function ViewUserRole () {
  //#region state
  const [userName, setUserName] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [canAccessEditUserRole, setCanAccessEditUserRole] = useState(false);
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
      history.push("/");
      return;
    }
    canUserAccessPage("Create-Edit User Role(s)");
    if (location.state && location.state.UserName) {
      setUserName(location.state.UserName);
      fetchUserRoles(location.state.UserName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, history]);
  //#endregion

  //#region Fetching selected User Role details
  const fetchUserRoles = (userName) => {
    const { state } = location; 
    if (state === 0 || state === null || state === undefined) {
      history.push("/admin/UserRolesList");
      return;
    }
    setLoading(true);
    setSpinnerMessage("Please wait while loading view user role details...");
    userRoleService
      .ReadUserRolesByUserName(userName, helper.getUser())
      .then((response) => {
        setUserRoles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setLoading(false);
      });
  };
  //#endregion

  //#region fetching User Role page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setCanAccessEditUserRole(response.data);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region View Role List Data Table
  const viewUserRoleListTable = () => {
    return [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
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
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
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
            <input type="checkbox" value={row.original.IsActive} checked={row.original.IsActive}/>
          </div>
        ),
      },
    ];
  };
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay active={loading}
        spinner={
          <div className="spinner-background">
            <BarLoader css={helper.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3}/>
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="az-content-breadcrumb">
          <span>Users</span>
          <span>User Roles</span>
        </div>
        <h4 className="d-flex align-items-center">
          View User Role(s)
          <span className="icon-size">
            <i className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5" onClick={() => history.goBack()} title="Back to User Role List"></i>
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
          </Row>
          <div className="masters-material-table mg-t-15 createUserListTable">
            <MaterialReactTable columns={viewUserRoleListTable()} data={userRoles} enablePagination={false} initialState={{density: "compact", columnVisibility: {UserName: false,},}} enableStickyHeader />
            <div>
              <div className="row row-sm col-md-11 mg-t-10">
                <div className="col-md-6"></div>
                {canAccessEditUserRole && (
                  <div className="col-md-2 mg-t-10 mg-lg-t-0">
                    <Link to={{pathname: "/admin/EditUserRoles", state: userName}} className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block">Edit</Link>
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
};
export default ViewUserRole;