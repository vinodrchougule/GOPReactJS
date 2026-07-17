import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./Masters.scss";

import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import accessControlService from "../services/accessControl.service";
import helper from "../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomerList from "./Customer/CustomerList";
import AddCustomer from "./Customer/AddCustomer";
import ViewCustomer from "./Customer/ViewCustomer";
import EditCustomer from "./Customer/EditCustomer";

import ProjectActivityList from "./ProjectActivity/ProjectActivityList";
import AddProjectActivity from "./ProjectActivity/AddProjectActivity";
import ViewProjectActivity from "./ProjectActivity/ViewProjectActivity";
import EditProjectActivity from "./ProjectActivity/EditProjectActivity";

import ProjectSubActivityList from "./ProjectSubActivity/ProjectSubActivityList";
import AddProjectSubActivity from "./ProjectSubActivity/AddProjectSubActivity";
import ViewProjectSubActivity from "./ProjectSubActivity/ViewProjectSubActivity";
import EditProjectSubActivity from "./ProjectSubActivity/EditProjectSubActivity";

import InputOutputFormatList from "./InputOutputFormat/InputOutputFormatList";
import AddInputOutputFormat from "./InputOutputFormat/AddInputOutputFormat";
import ViewInputOutputFormat from "./InputOutputFormat/ViewInputOutputFormat";
import EditInputOutputFormat from "./InputOutputFormat/EditInputOutputFormat";

import ItemStatusList from "./ItemStatus/ItemStatusList";
import AddItemStatus from "./ItemStatus/AddItemStatus";
import ViewItemStatus from "./ItemStatus/ViewItemStatus";
import EditItemStatus from "./ItemStatus/EditItemStatus";

import GenericActivityList from "./GenericActivity/GenericActivityList";
import CreateGenericActivity from "./GenericActivity/CreateGenericActivity";
import ViewGenericActivity from "./GenericActivity/ViewGenericActivity";
import EditGenericActivity from "./GenericActivity/EditGenericActivity";

import CommunicationModeList from "./CommunicationMode/CommunicationModeList";
import CreateCommunicationMode from "./CommunicationMode/CreateCommunicationMode";
import ViewCommunicationMode from "./CommunicationMode/ViewCommunicationMode";
import EditCommunicationMode from "./CommunicationMode/EditCommunicationMode";

import CustomerFeedbackTypeList from "./CustomerFeedbackType/CustomerFeedbackTypeList";
import CreateCustomerFeedbackType from "./CustomerFeedbackType/CreateCustomerFeedbackType";
import ViewCustomerFeedbackType from "./CustomerFeedbackType/ViewCustomerFeedbackType";
import EditCustomerFeedbackType from "./CustomerFeedbackType/EditCustomerFeedbackType";

toast.configure();

function Masters(props) {
  //#region State
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [style, setStyle] = useState("margin-not-collpased");
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [pageAccess, setPageAccess] = useState({
    customerPageAccess: false,
    projectActivityPageAccess: false,
    projectSubActivityPageAccess: false,
    inputOutputFormatPageAccess: false,
    itemStatusPageAccess: false,
    genericActivityPageAccess: false,
    communicationModePageAccess: false,
    customerFeedbackTypePageAccess: false,
  });
  //#endregion

  //#region UseEffect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({ pathname: "/" });
      return;
    }
    fetchUserRoleAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetching Logged In User Access
  const fetchUserRoleAccess = () => {
    setSpinnerMessage("Please wait while loading...");
    setLoading(true);

    accessControlService
      .ReadUserMenuAccessList(helper.getUser(), "Masters")
      .then((response) => {
        const getPageAccess = (pageName) =>
          response.data.find((a) => a.PageName === pageName)?.canAccess ||
          false;

        setPageAccess({
          customerPageAccess: getPageAccess("Customer List"),
          projectActivityPageAccess: getPageAccess("Project Activity List"),
          projectSubActivityPageAccess: getPageAccess(
            "Project SubActivity List"
          ),
          inputOutputFormatPageAccess: getPageAccess(
            "Input-Output Format List"
          ),
          itemStatusPageAccess: getPageAccess("Item Status List"),
          genericActivityPageAccess: getPageAccess("Generic Activity List"),
          communicationModePageAccess: getPageAccess("Communication Mode List"),
          customerFeedbackTypePageAccess: getPageAccess(
            "Customer Feedback Type List"
          ),
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message || "Failed to load access data", {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
    setStyle(menuCollapse ? "margin-not-collpased" : "margin-collpased");
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
        <div className="az-content">
          <div className="container-fluid">
            <div id="header" style={{ zIndex: "0" }}>
              <ProSidebar collapsed={menuCollapse}>
                <SidebarHeader>
                  <div className="logotext">
                    <p>{menuCollapse ? "Masters" : "Masters"}</p>
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
                    {pageAccess.customerPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Customers
                        <Link to="/Masters/Customers"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.projectActivityPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Project
                        Activities
                        <Link to="/Masters/ProjectActivities"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.projectSubActivityPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Project
                        Sub-Activities
                        <Link to="/Masters/ProjectSubActivities"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.inputOutputFormatPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Input /
                        Output Formats
                        <Link to="/Masters/InputOutputFormats"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.itemStatusPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Item
                        Status List <Link to="/Masters/ItemStatusList"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.genericActivityPageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Generic
                        Activities
                        <Link to="/Masters/GenericActivities"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.communicationModePageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i>{" "}
                        Communication Modes
                        <Link to="/Masters/CommunicationModeList"></Link>
                      </MenuItem>
                    )}
                    {pageAccess.customerFeedbackTypePageAccess && (
                      <MenuItem>
                        <i className="fas fa-arrow-circle-right"></i> Customer
                        Feedback Types
                        <Link to="/Masters/CustomerFeedbackTypeList"></Link>
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
                    <Route path="/Masters" exact>
                      <CustomerList />
                    </Route>
                    <Route
                      path="/Masters/Customers"
                      component={CustomerList}
                    ></Route>
                    <Route
                      path="/Masters/ViewCustomer"
                      component={ViewCustomer}
                    ></Route>
                    <Route
                      path="/Masters/ProjectActivities"
                      component={ProjectActivityList}
                    ></Route>
                    <Route
                      path="/Masters/ProjectSubActivities"
                      component={ProjectSubActivityList}
                    ></Route>
                    <Route
                      path="/Masters/InputOutputFormats"
                      component={InputOutputFormatList}
                    ></Route>
                    <Route
                      path="/Masters/AddCustomer"
                      component={AddCustomer}
                    ></Route>
                    <Route
                      path="/Masters/AddProjectActivity"
                      component={AddProjectActivity}
                    ></Route>
                    <Route
                      path="/Masters/AddProjectSubActivity"
                      component={AddProjectSubActivity}
                    ></Route>
                    <Route
                      path="/Masters/AddInputOutputFormat"
                      component={AddInputOutputFormat}
                    ></Route>
                    <Route
                      path="/Masters/EditCustomer"
                      component={EditCustomer}
                    ></Route>
                    <Route
                      path="/Masters/EditProjectActivity"
                      component={EditProjectActivity}
                    ></Route>
                    <Route
                      path="/Masters/EditProjectSubActivity"
                      component={EditProjectSubActivity}
                    ></Route>
                    <Route
                      path="/Masters/EditInputOutputFormat"
                      component={EditInputOutputFormat}
                    ></Route>
                    <Route
                      path="/Masters/ItemStatusList"
                      component={ItemStatusList}
                    ></Route>
                    <Route
                      path="/Masters/AddItemStatus"
                      component={AddItemStatus}
                    ></Route>
                    <Route
                      path="/Masters/EditItemStatus"
                      component={EditItemStatus}
                    ></Route>
                    <Route
                      path="/Masters/ViewProjectActivity"
                      component={ViewProjectActivity}
                    ></Route>
                    <Route
                      path="/Masters/ViewProjectSubActivity"
                      component={ViewProjectSubActivity}
                    ></Route>
                    <Route
                      path="/Masters/ViewInputOutputFormat"
                      component={ViewInputOutputFormat}
                    ></Route>
                    <Route
                      path="/Masters/ViewItemStatus"
                      component={ViewItemStatus}
                    ></Route>
                    <Route
                      path="/Masters/GenericActivities"
                      component={GenericActivityList}
                    ></Route>
                    <Route
                      path="/Masters/CreateGenericActivity"
                      component={CreateGenericActivity}
                    ></Route>
                    <Route
                      path="/Masters/ViewGenericActivity"
                      component={ViewGenericActivity}
                    ></Route>
                    <Route
                      path="/Masters/EditGenericActivity"
                      component={EditGenericActivity}
                    ></Route>
                    <Route
                      path="/Masters/CommunicationModeList"
                      component={CommunicationModeList}
                    ></Route>
                    <Route
                      path="/Masters/CreateCommunicationMode"
                      component={CreateCommunicationMode}
                    ></Route>
                    <Route
                      path="/Masters/ViewCommunicationMode"
                      component={ViewCommunicationMode}
                    ></Route>
                    <Route
                      path="/Masters/EditCommunicationMode"
                      component={EditCommunicationMode}
                    ></Route>
                    <Route
                      path="/Masters/CustomerFeedbackTypeList"
                      component={CustomerFeedbackTypeList}
                    ></Route>
                    <Route
                      path="/Masters/CreateCustomerFeedbackType"
                      component={CreateCustomerFeedbackType}
                    ></Route>
                    <Route
                      path="/Masters/ViewCustomerFeedbackType"
                      component={ViewCustomerFeedbackType}
                    ></Route>
                    <Route
                      path="/Masters/EditCustomerFeedbackType"
                      component={EditCustomerFeedbackType}
                    ></Route>
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

export default Masters;
