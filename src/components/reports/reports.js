import React, { Component } from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import helper from "../../helpers/helpers";
import ProjectStatusList from "./projectStatusList";
import PreviousDayReport from "./previousDayReport";
import PeriodicProjectReport from "./periodicProjectReport";
import EmployeeSpecificReport from "./employeeSpecificReport";
import PreviousDayProjectsSummary from "./previousDayProjectsSummary";
import EmployeesTaskReport from "./employeesTaskReport";
import "./report.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
toast.configure();

class reports extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 1,
      accessControl: [],
      defaultActiveKey: "",
      spinnerMessage: "",
      loading: false,
      employeeTaskReportPageAccess: false,
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  //#region component mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    this.canUserAccessPage();
  }
  //#endregion

  //#region Fetching User List page access
  canUserAccessPage() {
    accessControlService
      .CanUserAccessPage(helper.getUser(), "Employees Task Report")
      .then((response) => {
        this.setState({
          employeeTaskReportPageAccess: response.data,
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  navigateToReport = () => {
    this.props.history.push({
      pathname: "/editingReport",
    });
    return;
  }

  render() {
    const props = this.props;

    

    return (
      <div>
        <Tab.Container defaultActiveKey="projectStatusList">
          <div className="row" style={{ marginRight: "15px" }}>
            <div>
              <Nav
                variant="pills"
                className="mg-l-50 mg-b-20 mg-t-10"
                style={{ cursor: "pointer" }}
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="projectStatusList"
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => {
                      this.toggle(1);
                    }}
                  >
                    Project Status List
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="previousDayReport"
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => {
                      this.toggle(2);
                    }}
                  >
                    Previous Day Report
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="periodicProjectReport"
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => {
                      this.toggle(3);
                    }}
                  >
                    Periodic Project Report
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="employeeSpecificReport"
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => {
                      this.toggle(4);
                    }}
                  >
                    Employee Specific Report
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="previousDayProjectsSummary"
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => {
                      this.toggle(5);
                    }}
                  >
                    Previous Day Projects Summary
                  </Nav.Link>
                </Nav.Item>
                {this.state.employeeTaskReportPageAccess && (
                  <Nav.Item>
                    <Nav.Link
                      eventKey="employeesTaskReport"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(6);
                      }}
                    >
                      Employees Task Report
                    </Nav.Link>
                  </Nav.Item>
                )}
                <Nav.Item>
                    <Nav.Link
                      eventKey="editingReport"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.navigateToReport();
                      }} >
                      On Screen Editing Reports
                    </Nav.Link>
                  </Nav.Item>
              </Nav>
            </div>
            <div className="d-flex justify-content-end"></div>
          </div>

          <Tab.Content>
            <Tab.Pane eventKey="projectStatusList">
              {this.state.activeTab === 1 ? (
                <ProjectStatusList {...props} />
              ) : null}
            </Tab.Pane>
            <Tab.Pane eventKey="previousDayReport">
              {this.state.activeTab === 2 ? <PreviousDayReport /> : null}
            </Tab.Pane>
            <Tab.Pane eventKey="periodicProjectReport">
              {this.state.activeTab === 3 ? <PeriodicProjectReport /> : null}
            </Tab.Pane>
            <Tab.Pane eventKey="employeeSpecificReport">
              {this.state.activeTab === 4 ? <EmployeeSpecificReport /> : null}
            </Tab.Pane>
            <Tab.Pane eventKey="previousDayProjectsSummary">
              {this.state.activeTab === 5 ? (
                <PreviousDayProjectsSummary />
              ) : null}
            </Tab.Pane>
            <Tab.Pane eventKey="employeesTaskReport">
              {this.state.activeTab === 6 ? <EmployeesTaskReport /> : null}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <Router>
          <Switch>
            {/* <Route path="/Allocation" exact component={ProductionUpload}></Route> */}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default reports;
