import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import ConfirmDuplicatesFromCIF from "./ConfirmDuplicatesFromCIF";
import AllocateSKUsOnScreenForProduction from "./AllocateSKUsOnScreenForProduction";

export default function OnScreenProductionAllocation() {
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
      <Tab.Container defaultActiveKey="confirmDuplicatesFromCustomerInputFile">
        <div className="row" style={{ marginRight: "15px" }}>
          <div>
            <Nav
              variant="pills"
              className="mg-l-65 mg-b-20 mg-t-5"
              style={{ cursor: "pointer" }}
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="confirmDuplicatesFromCustomerInputFile"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(1);
                  }}
                >
                  Confirm Duplicates From Customer Input File
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="allocateSKUsOnScreenForProduction"
                  style={{ border: "1px solid #5E41FC" }}
                  onClick={() => {
                    toggle(2);
                  }}
                >
                  Allocate SKUs for Production
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="d-flex justify-content-end"></div>
        </div>

        <Tab.Content>
          <Tab.Pane eventKey="confirmDuplicatesFromCustomerInputFile">
            {initState.activeTab === 1 ? (
              <div>
                <ConfirmDuplicatesFromCIF />
              </div>
            ) : null}
          </Tab.Pane>
          <Tab.Pane eventKey="allocateSKUsOnScreenForProduction">
            {initState.activeTab === 2 ? (
              <div>
                <AllocateSKUsOnScreenForProduction />
              </div>
            ) : null}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
