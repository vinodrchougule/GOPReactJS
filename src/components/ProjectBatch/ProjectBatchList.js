import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import helper from "../../helpers/helpers";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import DeliveredProjectBatchList from "./DeliveredProjectBatchList";
import OnGoingProjectBatchList from "./OnGoingProjectBatchList";
import accessControlService from "../../services/accessControl.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ProjectBatchList() {

  //#region State management using useState hook
  const [state, setState] = useState({
    projectID: null,
    customerCode: null,
    projectCode: null,
    scope: null,
    canAccessCreateProjectBatch: false,
    activeTab: null,
    activeTabFromPreviousPage: null,
    defaultActiveKey: "onGoing",
  });
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    canUserAccessPage("Create Project Batch");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region fetching Project page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          canAccessCreateProjectBatch: response.data,
        }));
        fetchProjectDetails();
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region fetching Project Details
  const fetchProjectDetails = () => {
    const { state: locationState } = location;
  
    // Redirect if locationState is not available
    if (!locationState) {
      history.push("/Projects");
      return;
    }
  
    // Set defaultActiveKey based on locationState's activeTab
    const defaultActiveKey = locationState.activeTab === 2 ? "delivered" : "onGoing";
  
    // Update state with the locationState values
    setState((prevState) => ({
      ...prevState,
      projectID: locationState.ProjectID,
      customerCode: locationState.CustomerCode,
      projectCode: locationState.ProjectCode,
      scope: locationState.Scope,
      activeTab: locationState.activeTab,
      activeTabFromPreviousPage: locationState.activeTab,
      defaultActiveKey,
    }));
  };
  
  //#endregion

  //#region toggle tab
  const toggle = (tab) => {
    // alert(tab)
    if (state.activeTab !== tab) {
      setState((prevState) => ({
        ...prevState,
        activeTab: tab,
      }));
    }
  };
  //#endregion

  const {
    projectID,
    customerCode,
    projectCode,
    scope,
    canAccessCreateProjectBatch,
    defaultActiveKey,
    activeTab,
    activeTabFromPreviousPage,
  } = state;

  if (projectID === null) {
    return "";
  }
  
  

  // alert(defaultActiveKey)
  //#region main return
  return (
    <div>
      <div className="az-content-breadcrumb mg-l-50">
        <span>Project Batch</span>
        <span>List</span>
      </div>
      <div className="mg-l-50">
        <h4 className="d-flex align-items-center" style={{width:"25%"}}>
          Project Batches List{" "}
          <span className="icon-size">
            <Link
              to={{
                pathname: "/Projects",
                state: {
                  activeTab: activeTabFromPreviousPage,
                },
              }}
            >
              <i
                className="far fa-arrow-alt-circle-left mg-l-5"
                title="Back to Project List"
              ></i>
            </Link>{" "}
            {canAccessCreateProjectBatch && (
              <Link
                to={{
                  pathname: "/Projects/CreateProjectBatch",
                  state: {
                    ProjectID: projectID,
                    CustomerCode: customerCode,
                    ProjectCode: projectCode,
                    Scope: scope,
                  },
                }}
                title="Add Project Batch"
              >
                <i className="fa fa-plus"></i>
              </Link>
            )}
          </span>
        </h4>
      </div>
      <Tab.Container defaultActiveKey={defaultActiveKey}>
        <Nav variant="pills" className="mg-l-50 mg-b-20">
          <Nav.Item>
            <Nav.Link
              eventKey="onGoing"
              style={{ border: "1px solid #5E41FC" }}
              onClick={() => toggle(1)}
            >
              On Going
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="delivered"
              style={{ border: "1px solid #5E41FC" }}
              onClick={() => toggle(2)}
            >
              Delivered
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="onGoing">
            {activeTab === 1 && <OnGoingProjectBatchList projectID={projectID} />}
          </Tab.Pane>
          <Tab.Pane eventKey="delivered">
            {activeTab === 2 && <DeliveredProjectBatchList projectID={projectID} />}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
  //#endregion
};
export default ProjectBatchList;