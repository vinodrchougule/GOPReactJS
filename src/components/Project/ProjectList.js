import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import helper from "../../helpers/helpers";
import DeliveredProjectList from "./DeliveredProjectList";
import OnGoingProjectList from "./OnGoingProjectList";
import NotStartedProjectList from "./NotStartedProjectList";
import accessControlService from "../../services/accessControl.service";
import ModernDatepicker from "react-modern-datepicker";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import "./projects.scss";
import Moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customerService from "../../services/customer.service";
import projectStatusService from "../../services/projectStatus.service";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useHistory, useLocation } from "react-router-dom";

toast.configure();

function ProjectList () {

  //#region State Variables
  const [canAccessCreateProject, setCanAccessCreateProject] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [defaultActiveKey, setDefaultActiveKey] = useState("");
  const [activeKey, setActiveKey] = useState("onGoing");
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerCode, setCustomerCode] = useState("(All)");
  const [selectedCustomerCode, setSelectedCustomerCode] = useState("(All)");
  const [projectCodes, setProjectCodes] = useState([]);
  const [projectCode, setProjectCode] = useState("(All)");
  const [selectedProjectCode, setSelectedProjectCode] = useState("(All)");
  const [projectTypes] = useState(["Regular", "Pilot"]);
  const [selectedProjectType, setSelectedProjectType] = useState("(All)");
  const [fromDate, setFromDate] = useState("01-Apr-2011");
  const [toDate, setToDate] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region useEffect Hook
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    setActiveTabFromState();
    checkUserAccessForPage("Create Project");
    fetchCustomers();
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    setToDate(Moment(currentDate).format("DD-MMM-yyyy"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Set Active Tab
  const setActiveTabFromState = () => {
    const { state } = location;
    if (state) {
      if (state.activeTab === 3) {
        setActiveTab(3);
        setDefaultActiveKey("notStarted");
        setActiveKey("notStarted");
      } else if (state.activeTab === 2) {
        setActiveTab(2);
        setDefaultActiveKey("delivered");
        setActiveKey("delivered");
      } else {
        setActiveTab(1);
        setDefaultActiveKey("onGoing");
        setActiveKey("onGoing");
      }
    } else {
      setActiveTab(1);
      setDefaultActiveKey("onGoing");
      setActiveKey("onGoing");
    }
  };
  //#endregion

  //#region Fetch Customers
  const fetchCustomers = () => {
    setSpinnerMessage("Please wait while loading Customers...");
    setLoading(true);
    customerService
      .getAllCustomers(helper.getUser())
      .then((response) => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Change Customer Code
  const onChangeCustomerCode = (e) => {
    const value = e.target.value;
    setCustomerCode(value);
    setSelectedCustomerCode(value);
    setSelectedProjectCode("(All)");
    setActiveTab(0);
    setActiveKey("");
    fetchProjectCodesOfCustomer(value);
  };
  //#endregion

  //#region Fetch Project Codes Of Customer
  const fetchProjectCodesOfCustomer = (customerCode) => {
    if (!customerCode) {
      setProjectCodes([]);
      setSelectedProjectCode("");
      return;
    }
    
    setSpinnerMessage("Please wait while loading Project Codes...");
    setLoading(true);
    let selectedCustomerCode = customerCode;
    projectStatusService
      .readProjectCodesOfCustomer(selectedCustomerCode)
      .then((response) => {
        setProjectCodes(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Change Project Code
  const onChangeProjectCode = (e) => {
    setProjectCode(e.target.value);
    setSelectedProjectCode(e.target.value);
    setActiveTab(0);
    setActiveKey("");
  };
  //#endregion

  //#region On Change Project Type
  const onChangeProjectType = (e) => {
    setSelectedProjectType(e.target.value);
    setActiveTab(0);
    setActiveKey("");
  };
  //#endregion

  //#region On Change From Date
  const onChangeFromDate = (date) => {
    setFromDate(date);
    setActiveTab(0);
    setActiveKey("");

    if (!date) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        fromDateError: "From date is required",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        fromDateError: "",
      }));
    }
  };
  //#endregion

  //#region On Change To Date
  const onChangeToDate = (date) => {
    setToDate(date);
    setActiveTab(0);
    setActiveKey("");

    if (!date) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        toDateError: "To date is required",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        toDateError: "",
      }));
    }
  };
  //#endregion

  //#region User Access For Page
  const checkUserAccessForPage = (pageName) => {
    setLoading(true);

    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setCanAccessCreateProject(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Move To Create Project
  const moveToCreateProject = () => {
    history.push("/Projects/CreateProject");
  };
  //#endregion

  //#region toggle tab
  const toggle = (tab, key) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setActiveKey(key);
    }
  };
  //#endregion

  //#region Clear Search Result
  const clearSearchResult = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    setCustomerCode("(All)");
    setSelectedCustomerCode("(All)");
    setProjectCode("(All)");
    setSelectedProjectCode("(All)");
    setSelectedProjectType("(All)");
    setFromDate("01-Apr-2011");
    setToDate(Moment(currentDate).format("DD-MMM-yyyy"));
    setActiveTab(0);
    setActiveKey("onGoing");
    toggle(1, "onGoing");
  };
  //#endregion

  //#region main return
  return (
    <div className="projectsMainContent">
      {activeTab === null ? (
        <LoadingOverlay
          active={true}
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
                {spinnerMessage}
              </p>
            </div>
          }
        >
          <p style={{ height: "580px" }}></p>
        </LoadingOverlay>
      ) : (
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
              <p style={{ color: "black", marginTop: "5px" }}>
                {spinnerMessage}
              </p>
            </div>
          }
        >
          <div className="az-content-breadcrumb mg-l-50">
            <span>Project</span>
            <span>List</span>
          </div>
          <h4 className="mg-l-50 d-flex align-items-center" style={{width:"25%"}}>
            Projects List{" "}
            {canAccessCreateProject && (
              <span className="icon-size">
                <i
                  className="fa fa-plus text-primary pointer mg-l-5"
                  onClick={moveToCreateProject}
                  title="Add New Project"
                ></i>
              </span>
            )}
          </h4>
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-15">
              <div className="col-lg">
                <div className="row">
                  <div className="col-md-12">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            Customer Code <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select">
                        <select
                          className="form-control"
                          tabIndex="1"
                          id="customerCode"
                          name="customerCode"
                          placeholder="--Select--"
                          value={selectedCustomerCode}
                          onChange={onChangeCustomerCode}
                        >
                          <option value="(All)">(All)</option>
                          {customers.map((customer) => (
                            <option
                              key={customer.CustomerID}
                              value={customer.CustomerCode}
                            >
                              {customer.CustomerCode} ({customer.NoOfProjects})
                            </option>
                          ))}
                        </select>
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            Project Code <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select">
                        <select
                          className="form-control"
                          id="projectCode"
                          name="projectCode"
                          placeholder="--Select--"
                          value={selectedProjectCode}
                          onChange={onChangeProjectCode}
                        >
                          <option value="(All)">(All)</option>
                          {projectCodes.map((projectCode) => (
                            <option
                              key={projectCode.ProjectCode}
                              value={projectCode.ProjectCode}
                            >
                              {projectCode.ProjectCode}
                              ({projectCode.ProjectInputCount})
                            </option>
                          ))}
                        </select>
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                {selectedProjectCode === "(All)" && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="createProjectFloatingInput">
                        <FloatingLabel
                          label={
                            <>
                              Project Type <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select">
                          <select
                            className="form-control"
                            id="projectType"
                            name="projectType"
                            placeholder="--Select--"
                            value={selectedProjectType}
                            onChange={onChangeProjectType}
                          >
                            <option value="(All)">(All)</option>
                            {projectTypes.map((type) => (
                              <option key={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-15 mg-b-15">
              <div className="col-lg">
                <div className="row">
                  <div className="col-md-12">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            From Date <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select">
                        <div className="form-control">
                          <ModernDatepicker
                            date={fromDate}
                            format={"DD-MMM-YYYY"}
                            onChange={onChangeFromDate}
                            className="color"
                            placeholder={"Select a date"}
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="error-message">
                    {formErrors["fromDateError"]}
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            To Date <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select">
                        <div className="form-control">
                          <ModernDatepicker
                            date={toDate}
                            format={"DD-MMM-YYYY"}
                            onChange={onChangeToDate}
                            className="color"
                            placeholder={"Select a date"}
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="error-message">
                    {formErrors["toDateError"]}
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-6">
                    <button
                      onClick={() => toggle(1, "onGoing")}
                      className="btn btn-gray-700 btn-block" tabIndex="2">
                      Submit
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      onClick={clearSearchResult}
                      className="btn btn-gray-700 btn-block">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tab.Container
            defaultActiveKey={defaultActiveKey}
            activeKey={activeKey}
          >
            <Nav variant="pills" className="mg-l-50 mg-b-10" style={{ width: "25%" }}>
              <Nav.Item>
                <Nav.Link
                  eventKey="onGoing" style={{ border: "1px solid #5E41FC" }}
                  onClick={() => toggle(1, "onGoing")}
                >
                  On Going
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="delivered" style={{ border: "1px solid #5E41FC" }}
                  onClick={() => toggle(2, "delivered")}
                >
                  Delivered
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="notStarted" style={{ border: "1px solid #5E41FC" }}
                  onClick={() => toggle(3, "notStarted")}
                >
                  Not Started
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="onGoing">
                <OnGoingProjectList
                  customerCode={customerCode}
                  projectCode={projectCode}
                  projectType={selectedProjectType}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="delivered">
                <DeliveredProjectList
                  customerCode={customerCode}
                  projectCode={projectCode}
                  projectType={selectedProjectType}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="notStarted">
                <NotStartedProjectList
                  customerCode={customerCode}
                  projectCode={projectCode}
                  projectType={selectedProjectType}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </LoadingOverlay>
      )}
    </div>
  );
  //#endregion
}
export default ProjectList;