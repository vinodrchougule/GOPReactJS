import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./IncidentReportNew.scss";
import IncidentType from "./IncidentType";
import RegisterIncident from "./RegisterIncident";
import IncidentReport from "./IncidentReport";
import IncidentReportDashboard from "./IncidentReportDashboard";
import { useHistory, useLocation } from "react-router-dom";
import accessControlService from "../../services/accessControl.service";
import incidentRegisterService from "../../services/incidentRegister.service";
import LatQueImg from "../../assets/icons/quest-icon.png";

toast.configure();

function IncidentReportMenu() {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const [defaultActiveKey, setDefaultActiveKey] = useState("");
  const [activeKey, setActiveKey] = useState("incidentReportDashboard");
  const [loading] = useState(false);
  const [spinnerMessage] = useState("");
  const [canAccessIncidentTypes, setCanAccessIncidentTypes] = useState(false);
  const [canAccessRegisterIncident, setCanAccessRegisterIncident] =
    useState(false);
  const [canAccessIncidentReport, setCanAccessIncidentReport] = useState(false);
  const [
    canAccessIncidentReportDashboard,
    setCanAccessIncidentReportDashboard,
  ] = useState(false);

  //#region Tab toggle
  const toggle = (tab, key) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setActiveKey(key);
    }
    setActiveTab(tab);
  };
  //#endregion

  //#region  Download Help Document
  const downloadHelpDocument = () => {
    incidentRegisterService
      .DownloadHelpFile()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Incident Report - User Guide.pptx");
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    canUserAccessPage("Incident Type");
    canUserAccessPage("Register Incident");
    canUserAccessPage("Incident Report");
    canUserAccessPage("Incident Report Dashboard");

    setActiveTabFromState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#region Fetching Customer Feedback Type List Page Access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Incident Type") {
          setCanAccessIncidentTypes(response.data);
        } else if (pageName === "Register Incident") {
          setCanAccessRegisterIncident(response.data);
        } else if (pageName === "Incident Report") {
          setCanAccessIncidentReport(response.data);
        } else if (pageName === "Incident Report Dashboard") {
          setCanAccessIncidentReportDashboard(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Set Active Tab
  const setActiveTabFromState = () => {
    const { state } = location;
    if (state) {
      if (state.activeTab === 5) {
        setActiveTab(5);
        setDefaultActiveKey("incidentType");
        setActiveKey("incidentType");
      } else if (state.activeTab === 3) {
        setActiveTab(3);
        setDefaultActiveKey("incidentReport");
        setActiveKey("incidentReport");
      } else if (state.activeTab === 2) {
        setActiveTab(2);
        setDefaultActiveKey("registerIncident");
        setActiveKey("registerIncident");
      } else {
        setActiveTab(1);
        setDefaultActiveKey("incidentReportDashboard");
        setActiveKey("incidentReportDashboard");
      }
    } else {
      setActiveTab(1);
      setDefaultActiveKey("incidentReportDashboard");
      setActiveKey("incidentReportDashboard");
    }
  };
  //#endregion

  //#region return
  return (
    <div className="incidentReportMenuMain">
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
        <div>
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey={defaultActiveKey}
            activeKey={activeKey}
          >
            {activeTab !== 5 && (
              <div
                className="row"
                style={{ marginRight: "15px", marginTop: "0px" }}
              >
                <div>
                  <Nav
                    variant="pills"
                    className="mg-l-40 mg-b-10 mg-t-10"
                    style={{ cursor: "pointer" }}
                  >
                    {canAccessIncidentReportDashboard && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="incidentReportDashboard"
                          style={{ border: "1px solid #5E41FC" }}
                          onClick={() => toggle(1, "incidentReportDashboard")}
                        >
                          Incident Report Dashboard
                        </Nav.Link>
                      </Nav.Item>
                    )}
                    {canAccessRegisterIncident && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="registerIncident"
                          style={{ border: "1px solid #5E41FC" }}
                          onClick={() => toggle(2, "registerIncident")}
                        >
                          Register Incident
                        </Nav.Link>
                      </Nav.Item>
                    )}
                    {canAccessIncidentReport && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="incidentReport"
                          style={{ border: "1px solid #5E41FC" }}
                          onClick={() => toggle(3, "incidentReport")}
                        >
                          Incident Report
                        </Nav.Link>
                      </Nav.Item>
                    )}
                    {canAccessIncidentTypes && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="incidentType"
                          style={{ border: "1px solid #5E41FC" }}
                          onClick={() => toggle(5, "incidentType")}
                        >
                          Incident Type
                        </Nav.Link>
                      </Nav.Item>
                    )}
                  </Nav>
                </div>
                <div style={{ marginLeft: "750px", marginTop: "15px" }}>
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={downloadHelpDocument}
                    className="ir-lat-img"
                  />
                </div>
              </div>
            )}
            <Tab.Content>
              <Tab.Pane eventKey="incidentReportDashboard">
                <IncidentReportDashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="registerIncident">
                <RegisterIncident toggle={toggle} setActiveKey={setActiveKey} />
              </Tab.Pane>
              <Tab.Pane eventKey="incidentReport">
                <IncidentReport
                  setActiveTab={setActiveTab}
                  setActiveKey={setActiveKey}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="incidentType">
                <IncidentType />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default IncidentReportMenu;
