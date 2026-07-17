import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Link,
  useHistory,
} from "react-router-dom";
import RolesList from "./components/Role/RolesList";
import CreateRole from "./components/Role/CreateRole";
import ViewRole from "./components/Role/ViewRole";
import EditRole from "./components/Role/EditRole";
import UserList from "./components/Account/UserList";
import CreateUser from "./components/Account/CreateUser";
import ViewUser from "./components/Account/ViewUser";
import EditUser from "./components/Account/EditUser";
import RoleAccessList from "./components/RoleAccess/RoleAccessList";
import createRoleAccess from "./components/RoleAccess/createRoleAccess";
import EditRoleAccess from "./components/RoleAccess/EditRoleAccess";
import UserRoleList from "./components/UserRoles/UserRoleList";
import CreateUserRole from "./components/UserRoles/createUserRole";
import EditUserRoles from "./components/UserRoles/EditUserRoles";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

//import icons from react icons
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import viewUserRole from "./components/UserRoles/viewUserRole";
import viewRoleAccess from "./components/RoleAccess/viewRoleAccess";

import accessControlService from "../src/services/accessControl.service";
import helper from "../src/helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import "./components/admin.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Admin() {
  //#region State
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [style, setStyle] = useState("margin-not-collpased-admin admn-mn-page");
  const [userPageAccess, setUserPageAccess] = useState(false);
  const [rolePageAccess, setRolePageAccess] = useState(false);
  const [userRolePageAccess, setUserRolePageAccess] = useState(false);
  const [roleAccessPageAccess, setRoleAccessPageAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region History Initialization
  const history = useHistory();
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    fetchUserRoleAccess();
  }, [history]);
  //#endregion

  //#region Fetching Logged In User Access
  const fetchUserRoleAccess = () => {
    setSpinnerMessage("Please wait while loading...");
    setLoading(true);

    accessControlService
      .ReadUserMenuAccessList(helper.getUser(), "Admin")
      .then((response) => {
        const userPage = response.data.find((a) => a.PageName === "User List");
        const rolePage = response.data.find((a) => a.PageName === "Role List");
        const userRolePage = response.data.find(
          (a) => a.PageName === "User Role(s) List"
        );
        const roleAccessPage = response.data.find(
          (a) => a.PageName === "Role Access List"
        );

        setUserPageAccess(userPage?.canAccess || false);
        setRolePageAccess(rolePage?.canAccess || false);
        setUserRolePageAccess(userRolePage?.canAccess || false);
        setRoleAccessPageAccess(roleAccessPage?.canAccess || false);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    if (menuCollapse) {
      setMenuCollapse(false);
      setStyle("margin-not-collpased-admin admn-mn-page");
    } else {
      setMenuCollapse(true);
      setStyle("margin-collpased");
    }
  };
  //#endregion

  //#region Return
  return (
    <div>
      <LoadingOverlay
        active={loading}
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
        <div className="az-content">
          <div className="container-fluid">
            <div id="header" style={{ zIndex: "0" }}>
              <ProSidebar collapsed={menuCollapse}>
                <SidebarHeader>
                  <div className="logotext">
                    <p>{menuCollapse ? "Admin" : "Admin"}</p>
                  </div>
                  <div className="closemenu" onClick={menuIconClick}>
                    {menuCollapse ? (
                      <FiArrowRightCircle />
                    ) : (
                      <FiArrowLeftCircle />
                    )}
                  </div>
                </SidebarHeader>
                <hr />
                <SidebarContent>
                  <Menu iconShape="square">
                    {userPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> User
                        <Link to="/admin/UserList"></Link>
                      </MenuItem>
                    )}
                    {rolePageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Role
                        <Link to="/admin/Roles"></Link>
                      </MenuItem>
                    )}
                    {userRolePageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> User Role
                        <Link to="/admin/UserRolesList"></Link>
                      </MenuItem>
                    )}
                    {roleAccessPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Role
                        Access
                        <Link to="/admin/RoleAccessList"></Link>
                      </MenuItem>
                    )}
                  </Menu>
                </SidebarContent>
              </ProSidebar>
            </div>

            <div className={style} style={{ width: "100%" }}>
              <div className="az-content-body d-flex flex-column">
                <Router>
                  <Switch>
                    <Route path="/admin" component={UserList} exact />
                    <Route path="/admin/Roles" component={RolesList} />
                    <Route path="/admin/CreateRole" component={CreateRole} />
                    <Route path="/admin/ViewRole" component={ViewRole} />
                    <Route path="/admin/EditRole" component={EditRole} />
                    <Route path="/admin/UserList" component={UserList} />
                    <Route path="/admin/CreateUser" component={CreateUser} />
                    <Route path="/admin/ViewUser" component={ViewUser} />
                    <Route path="/admin/EditUser" component={EditUser} />
                    <Route
                      path="/admin/RoleAccessList"
                      component={RoleAccessList}
                    />
                    <Route
                      path="/admin/RoleAccess"
                      component={createRoleAccess}
                    />
                    <Route
                      path="/admin/EditRoleAccess"
                      component={EditRoleAccess}
                    />
                    <Route
                      path="/admin/ViewRoleAccess"
                      component={viewRoleAccess}
                    />
                    <Route
                      path="/admin/UserRolesList"
                      component={UserRoleList}
                    />
                    <Route path="/admin/UserRoles" component={CreateUserRole} />
                    <Route
                      path="/admin/EditUserRoles"
                      component={EditUserRoles}
                    />
                    <Route
                      path="/admin/ViewUserRole"
                      component={viewUserRole}
                    />
                  </Switch>
                </Router>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default Admin;
