import React, { Component } from "react";
import helper from "../../helpers/helpers";
import EmployeesTaskSummaryReport from "./employeesTaskSummaryReport";
import EmployeesTaskDetailsReport from "./employeesTaskDetailsReport";
import EmployeesTaskUnAllocatedResourcesReport from "./employeesTaskUnAllocatedResourcesReport";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class employeesTaskReport extends Component {
  constructor(props) {
    super(props);

    //#region State Variables
    this.state = {
      activeTab: 1,
      defaultActiveKey: "employeesTaskSummaryReport",
      activeKey: "employeesTaskSummaryReport",
      empName: "",
      fromDate: "",
      toDate: "",
    };
    //#endregion
  }

  //#region page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
  }
  //#endregion

  //#region Toggle Tab
  toggle(tab, key) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        activeKey: key,
        empName: "",
        fromDate: "",
        toDate: "",
      });
    }
  }
  //#endregion

  onDetailsClick = (empName, fromDate, toDate) => {
    this.setState({
      activeTab: 2,
      activeKey: "employeesTaskDetailsReport",
      empName: empName,
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  render() {
    const defaultActiveKey = this.state.defaultActiveKey;
    const activeTab = this.state.activeTab;

    return (
      <div>
        <LoadingOverlay
          active={this.state.loading}
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
              <p style={{ color: "black", marginTop: "5px" }}>
                {this.state.spinnerMessage}
              </p>
            </div>
          }
        >
          <Tab.Container
            defaultActiveKey={defaultActiveKey}
            activeKey={this.state.activeKey}
          >
            <div className="row" style={{ marginRight: "15px" }}>
              <div className="col-md-10">
                <Nav
                  variant="pills"
                  className="mg-l-50 mg-b-20 mg-t-10"
                  style={{ cursor: "pointer" }}
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="employeesTaskSummaryReport"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(1, "employeesTaskSummaryReport");
                      }}
                    >
                      Summary
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="employeesTaskDetailsReport"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(2, "employeesTaskDetailsReport");
                      }}
                    >
                      Details
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="employeesTaskUnAllocatedResourcesReport"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(
                          3,
                          "employeesTaskUnAllocatedResourcesReport"
                        );
                      }}
                    >
                      Unallocated Resources
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
            <Tab.Content>
              {activeTab === 1 && (
                <Tab.Pane eventKey="employeesTaskSummaryReport">
                  <EmployeesTaskSummaryReport
                    parentCallback={this.onDetailsClick}
                  />
                </Tab.Pane>
              )}
              {activeTab === 2 && (
                <Tab.Pane eventKey="employeesTaskDetailsReport">
                  <EmployeesTaskDetailsReport
                    empName={this.state.empName}
                    fromDate={this.state.fromDate}
                    toDate={this.state.toDate}
                  />
                </Tab.Pane>
              )}
              {activeTab === 3 && (
                <Tab.Pane eventKey="employeesTaskUnAllocatedResourcesReport">
                  <EmployeesTaskUnAllocatedResourcesReport
                    empName={this.state.empName}
                    fromDate={this.state.fromDate}
                    toDate={this.state.toDate}
                  />
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default employeesTaskReport;
