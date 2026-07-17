import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import FindDuplicates from "./FindDuplicates";
import FindDuplicatesCustomer from "./FindDuplicatesCustomer";
import PendingforQC from "./PendingforQC";
import ProjectOverallStatus from "./ProjectOverallStatus";
import DateRangeStatusReport from "./DateRangeStatusReport";
import UserBasedStatusReport from "./UserBasedStatusReport";
import ProjectLevelQualityReport from "./ProjectLevelQualityReport";
import ResourceLevelQualityReport from "./ResourceLevelQualityReport";

function ScreenEditingReport() {
  const [initState, setInItState] = useState({
    activeTab: 1,
    accessControl: [],
    defaultActiveKey: "",
    spinnerMessage: "",
    loading: false,
  });

  const toggle = (tab) => {
    if (initState.activeTab !== tab) {
      setInItState((prevState) => ({ ...prevState, activeTab: tab }));
    }
  };

  return (
    <div>
      <Tab.Container defaultActiveKey="findDuplicatescustomer">
        <div className="row" style={{ marginRight: "15px" }}>
          <div>
            <Nav
              variant="pills"
              className="mg-l-65 mg-b-20 mg-t-10"
              style={{ cursor: "pointer" }}
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="findDuplicatescustomer"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(1);
                  }}
                >
                  Find Duplicates from Customer Input File
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="findDuplicates"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(2);
                  }}
                >
                  Find Duplicates from Production SKUs
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="pendingForQC"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(3);
                  }}
                >
                  Pending For QC
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="projectOverallStatus"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(4);
                  }}
                >
                  Project Overall Status
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="dateRangeStatus"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(5);
                  }}
                >
                  Date Range Status
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="userBasedStatusReport"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(6);
                  }}
                >
                  User Based Status
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="projectLevelQualityReport"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(7);
                  }}
                >
                  Project Level Quality Report
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="resourceLevelQualityReport"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(8);
                  }}
                >
                  Resource Level Quality Report
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="d-flex justify-content-end"></div>
        </div>

        <Tab.Content>
          <Tab.Pane eventKey="findDuplicatescustomer">
            {initState.activeTab === 1 ? (
              <div>
                <FindDuplicatesCustomer />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="findDuplicates">
            {initState.activeTab === 2 ? (
              <div>
                <FindDuplicates />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="pendingForQC">
            {initState.activeTab === 3 ? (
              <div>
                <PendingforQC />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="projectOverallStatus">
            {initState.activeTab === 4 ? (
              <div>
                <ProjectOverallStatus />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="dateRangeStatus">
            {initState.activeTab === 5 ? (
              <div>
                <DateRangeStatusReport />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="userBasedStatusReport">
            {initState.activeTab === 6 ? (
              <div>
                <UserBasedStatusReport />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="projectLevelQualityReport">
            {initState.activeTab === 7 ? (
              <div>
                <ProjectLevelQualityReport />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="resourceLevelQualityReport">
            {initState.activeTab === 8 ? (
              <div>
                <ResourceLevelQualityReport />
              </div>
            ) : null}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default ScreenEditingReport;
