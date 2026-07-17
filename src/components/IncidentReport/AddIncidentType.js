import React, { useState, useEffect } from "react";
import helpers from "../../helpers/helpers";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "./IncidentReportNew.scss";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import RegisterIncident from "./RegisterIncident";
import IncidentReport from "./IncidentReport";
import IncidentReportDashboard from "./IncidentReportDashboard";
import incidentTypeService from "../../services/incidentType.service";

toast.configure();

function AddIncidentType(props) {
  const [activeTab, setActiveTab] = useState("incidentType");
  //#region Tab toggle
  const toggle = (tab) => {
    setActiveTab(tab);

    if (tab === "incidentReport" || tab === "registerIncident" || tab === "incidentReportDashboard") {
      history.push("/IncidentReportMenu");
    }
  };
  //#endregion
  let history = useHistory();

  //#region State initialization
  const [initialState, setInitStates] = useState({
    incidentTypeID: 0,
    incidentType: "",
    isActive: true,
    isInActive: false,
    formErrors: "",
    loading: false,
    spinnerMessage: "",
  });
  //#endregion

  //#region On Change Add Incident Type
  const onChangeAddIncidentType = (e) => {
    setInitStates((prevState) => ({
      ...prevState,
      incidentType: e.target.value,
      formErrors: "",
    }));
  };
  //#endregion

  //#region Reset the page
  const resetAddIncidentType = () => {
    setInitStates({
      incidentTypeID: 0,
      incidentType: "",
      isActive: true,
      formErrors: "",
      loading: false,
      spinnerMessage: "",
    });
  };
  //#endregion

  //#region Save Incident Type
  const saveAddIncidentType = (e) => {
    e.preventDefault();

    if (!initialState.incidentType.trim()) {
      setInitStates((prevState) => ({
        ...prevState,
        formErrors: "Incident Type is required",
      }));
      return;
    }

    const user = helpers.getUser();
    if (!user) {
      history.push({ pathname: "/" });
      return;
    }

    const data = {
      IncidentTypeID: initialState.incidentTypeID,
      IncidentType: initialState.incidentType,
      IsActive: initialState.isActive,
      UserID: user,
    };

    setInitStates((prevState) => ({
      ...prevState,
      loading: true,
      formErrors: "",
    }));

    incidentTypeService
      .PostAddIncidentType(data)
      .then((response) => {
        const { Success, Msg } = response?.data || {};

        if (Success === 1) {
          toast.success(Msg || "", { autoClose: 3000 });
          resetAddIncidentType();
          history.push({
            pathname: "/IncidentType",
            state: { activeTab: "incidentType" },
          });
        } else {
          toast.error(Msg || "", { autoClose: 3000 });
          setInitStates((prevState) => ({ ...prevState, loading: false }));
        }
      })
      .catch((error) => {
        setInitStates((prevState) => ({ ...prevState, loading: false }));

        const errorMsg =
          error?.response?.data?.Msg ||
          error?.response?.data?.Message ||
          error?.message || "";

        toast.error(errorMsg, { autoClose: 3000 });
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!initialState || Object.keys(initialState).length === 0) {
      history.push("/IncidentType");
    }
  }, [initialState, history]);

  //#region return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initialState.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helpers.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>{initialState.spinnerMessage}</p>
          </div>
        }
      >
        <div className="incidentReportMenus">
          <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={toggle}>
            <div className="row" style={{ marginRight: "15px", marginTop: '0px' }}>
              <div>
                <Nav variant="pills" className="mg-l-40 mg-b-10 mg-t-10" style={{ cursor: "pointer" }}>
                  <Nav.Item>
                    <Nav.Link eventKey="incidentReportDashboard" style={{ border: "1px solid #5E41FC" }}>
                      Incident Report Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="registerIncident" style={{ border: "1px solid #5E41FC" }}>
                      Register Incident
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="incidentReport" style={{ border: "1px solid #5E41FC" }}>
                      Incident Report
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="incidentType" style={{ border: "1px solid #5E41FC" }}>
                      Incident Type
                    </Nav.Link>
                  </Nav.Item>

                </Nav>
              </div>
              <div className="d-flex justify-content-end"></div>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="incidentReportDashboard">
                <IncidentReportDashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="registerIncident">
                <RegisterIncident />
              </Tab.Pane>
              <Tab.Pane eventKey="incidentReport">
                <IncidentReport />
              </Tab.Pane>
              <Tab.Pane eventKey="incidentType">
                <div className="addIncidentTypeMainContent" style={{ height: "100%", position: "relative", paddingLeft: "25px", marginTop: "30px" }}>
                  <h4>
                    Create Incident Type{" "}
                    <span className="icon-size">
                      <Link
                        to={{
                          pathname: "/IncidentType",
                          state: {
                            activeTab: activeTab,
                          },
                        }}
                      >
                        <i
                          className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                          tabIndex="1"
                          title="Back to Incident Type List"
                        ></i>
                      </Link>
                    </span>
                  </h4>
                  <div>
                    <div className="row row-sm mg-t-20">
                      <div className="col-lg-4">
                        <div className="createnm mroDictionayViewrVersionSelected">
                          <FloatingLabel
                            label={
                              <>
                                <b>Incident Type</b>
                              </>
                            }
                            className="float-hidden float-select">
                            <input
                              type="text"
                              className={`form-control mg-l-5 mg-r-15 synonymInputText`}
                              maxLength="50"
                              name="Incident"
                              value={initialState.incidentType}
                              onChange={onChangeAddIncidentType}
                              style={{ background: "#fff" }}
                            />
                          </FloatingLabel>
                          <span className="asterisk-size text-danger ml-2">*</span>
                        </div>
                        {initialState.formErrors && (
                          <div className="error-message">{initialState.formErrors}</div>
                        )}
                      </div>
                    </div>
                    <div className="row row-sm mg-t-20">
                      <div className="col-md-2">
                        <label><b>Is Active?</b></label>
                      </div>
                      <div className="col-md-5 mg-t-5">
                        <label className="switch">
                          <input type="checkbox" name="IsToIncludeVendorNameInShortDesc" checked={true} id="chkVendorNameToShort" readOnly />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                    <br />
                    <div className="row row-sm">
                      <div className="col-md-2">
                        <button id="Save" className="btn btn-gray-700 btn-block" tabIndex="4" onClick={saveAddIncidentType}>
                          <i className="fa fa-save mg-r-5"></i> Save
                        </button>
                      </div>
                      <div className="col-md-2">
                        <button className="btn btn-gray-700 btn-block" tabIndex="5" onClick={resetAddIncidentType} id="Reset">
                          <i className="fa fa-refresh mg-r-5"></i>Reset
                        </button>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default AddIncidentType;