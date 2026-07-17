import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Masters from "./components/Masters";
import Header from "./shared/Header";
import Admin from "./admin";
import Allocation from "./components/Allocation/Allocation";
import Signout from "./components/Login/Signout";
import ChangePassword from "./components/Login/ChangePassword";
import Reports from "./components/reports/reports";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import NetworkDetector from "./Hoc/NetworkDetector";
import SessionTimeout from "./helpers/sessionTimeout";
import "./App.scss";
import ResetPassword from "./components/Login/resetPassword";
import SnomedSearch from "./components/SnomedSearch/SnomedSearch";
import Unspsc from "./components/UNSPSC/Unspsc";
import ProjectSetting from "./components/ProjectSetting/ProjectSetting";
import ScreenEditingReport from "./components/ScreenEdittingReport/ScreenEditingReport";
import GrievanceReach from "./components/GrievanceReach/grievancereach";
import MRODictionary from "./components/MRODictionary/MRODictionaryNew";
import ViewNounModifierTemplate from "./components/MRODictionary/ViewNounModifierTemplate";
import EditNounModifierTemplate from "./components/MRODictionary/EditNounModifierTemplate";
import MroDictionaryViewer from "./components/MRODictionary/MRODictionaryViewer";
import IncidentReportMenu from "./components/IncidentReport/IncidentReportMenu";
import IncidentReport from "./components/IncidentReport/IncidentReport";
import ActionOnIncident from "./components/IncidentReport/ActionOnIncident";
import IncidentReportDashboard from "./components/IncidentReport/IncidentReportDashboard";
import IncidentType from "./components/IncidentReport/IncidentType";
import AddIncidentType from "./components/IncidentReport/AddIncidentType";
import ViewIncidentType from "./components/IncidentReport/ViewIncidentType";
import EditIncidentType from "./components/IncidentReport/EditIncidentType";
import EditIncident from "./components/IncidentReport/EditIncident";
import GAT from "./components/GAT/gatTabs";
import Marketing from "./components/Marketing/Marketing";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  }
  // #region onloadFunctions
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowHeight);
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowHeight);
  }

  updateWindowHeight = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };
  // #endregion onloadFunctions

  render() {
    return (
      <div className="main-app" style={{ height: this.state.windowHeight }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/PasswordReset" component={ResetPassword} />
            <Route
              path="/Dashboard"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Dashboard {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            />
            <Route
              path="/Projects"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Projects {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Masters"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Masters {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Unspsc"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Unspsc {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/snomed"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <SnomedSearch {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Allocation"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Allocation {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Allocation/projectSettings"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ProjectSetting {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Allocation/screenProjectSettings"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ProjectSetting {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Allocation/editProjectSettings"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ProjectSetting {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/reports"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Reports {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/editingReport"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ScreenEditingReport {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/admin"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Admin {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/grievancereach"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <GrievanceReach {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/MRODictionary"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <MRODictionary {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/ViewNounModifierTemplate"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ViewNounModifierTemplate {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/EditNounModifierTemplate"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <EditNounModifierTemplate {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/MRODictionaryViewer"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <MroDictionaryViewer {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/IncidentReportMenu"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <IncidentReportMenu {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/GAT"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <GAT {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/Marketing"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <Marketing {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/IncidentReportDashboard"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <IncidentReportDashboard {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/IncidentReport"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <IncidentReport {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/EditIncident"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <EditIncident {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/IncidentType"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <IncidentType {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/ActionOnIncident"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ActionOnIncident {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/AddIncidentType"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <AddIncidentType {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/ViewIncidentType"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ViewIncidentType {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/EditIncidentType"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <EditIncidentType {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>
            <Route
              path="/ChangePassword"
              render={(props) => (
                <div style={{ height: "100%" }}>
                  <Header data={props} />
                  <ChangePassword {...props} />
                  <SessionTimeout {...props} />
                </div>
              )}
            ></Route>

            <Route path="/signout" component={Signout}></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default NetworkDetector(App);
