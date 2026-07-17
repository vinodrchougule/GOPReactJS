import React, { useState, useEffect, useMemo } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import helper from "../../helpers/helpers";
import SuggestionToManagement from "./suggestiontomanagement";
import ViewSuggestions from "./viewsuggestions";
import "../reports/report.scss";
import "./grievancereach.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
toast.configure();

function GrievanceReach(props) {
  //#region State Variables
  const [activeTab, setActiveTab] = useState("suggestiontomanagement");
  const [canAccessSuggestionToManagement, setCanAccessSuggestionToManagement] = useState(false);
  const [canAccessViewSuggestions, setCanAccessViewSuggestions] = useState(false);
  const [reloadData, setReloadData] = useState(false); 
  //#endregion

  //#region Use Effect
  useEffect(() => {
    canUserAccessPage();
  }, []);

  useEffect(() => {
    
    setReloadData((prevState) => !prevState);
  }, [activeTab, canAccessSuggestionToManagement, canAccessViewSuggestions]);
  //#endregion

  //#region Access control
  const canUserAccessPage = () => {
    accessControlService.CanUserAccessPage(helper.getUser(), "Suggestion To Management")
      .then((response) => {
        const canAccess = response?.data ?? false;
        setCanAccessSuggestionToManagement(canAccess);
        return accessControlService.CanUserAccessPage(helper.getUser(), "View Suggestions");
      })
      .then((response) => {
        const canAccess = response?.data ?? false;
        setCanAccessViewSuggestions(canAccess);
      })
      .catch((e) => {
        const errorMessage = e.response?.data?.Message ?? "An error occurred";
        toast.error(errorMessage, { autoClose: false });
      });
  };
  //#endregion

  //#region Suggestion To Management Components
  const SuggestionToManagementComponent = useMemo(
    () =>
      canAccessSuggestionToManagement && (
        <SuggestionToManagement {...props} reloadData={reloadData} />
      ),
    [canAccessSuggestionToManagement, props, reloadData]
  );
  //#endregion

  //#region View Suggestions Components
  const ViewSuggestionsComponent = useMemo(
    () => canAccessViewSuggestions && <ViewSuggestions reloadData={reloadData} />,
    [canAccessViewSuggestions, reloadData]
  );
  //#endregion

  //#region Render
  return (
    <div>
      <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <div className="row" style={{ marginRight: "15px", marginTop: "15px" }}>
          <div>
            <Nav variant="pills" className="mg-l-50 mg-b-15 mg-t-10" style={{ cursor: "pointer" }}>
              {canAccessSuggestionToManagement && (
                <Nav.Item>
                  <Nav.Link eventKey="suggestiontomanagement" style={{ border: "1px solid #5E41FC" }}>Suggestion To Management</Nav.Link>
                </Nav.Item>
              )}
              {canAccessViewSuggestions && (
                <Nav.Item>
                  <Nav.Link eventKey="viewsuggestions" style={{ border: "1px solid #5E41FC" }}>View Suggestions</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </div>
          <div className="d-flex justify-content-end"></div>
        </div>
        <Tab.Content>
          <Tab.Pane eventKey="suggestiontomanagement" active={activeTab === "suggestiontomanagement"}>
            {activeTab === "suggestiontomanagement" && SuggestionToManagementComponent}
          </Tab.Pane>
          <Tab.Pane eventKey="viewsuggestions" active={activeTab === "viewsuggestions"}>
            {activeTab === "viewsuggestions" && ViewSuggestionsComponent}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
  //#endregion
}
export default GrievanceReach;
