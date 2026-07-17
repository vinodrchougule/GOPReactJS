import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import RegisterIncident from "./RegisterIncident";
import IncidentReport from "./IncidentReport";
import IncidentReportDashboard from "./IncidentReportDashboard";
import incidentTypeService from "../../services/incidentType.service";

toast.configure();

function EditIncidentType(props) {
  const location = useLocation();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("incidentType");

  const [formErrors, setFormErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [incidentTypeID, setIncidentTypeID] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [isActive, setIsActive] = useState("");

  //#region State initialization
  const [initialState, setInitStates] = useState({
    incidentTypeID: 0,
    incidentType: "",
    isActive: "",
    isInActive: false,
    formErrors: "",
    loading: false,
    spinnerMessage:
      "Please wait a while Edit Incident Type data is loading.....",
  });
  //#endregion

  //#region Initialize table columns and data on mount
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchIncidentTypeByID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.state]);
  //#endregion

  //#region Tab toggle
  const toggle = (tab) => {
    setActiveTab(tab);

    if (
      tab === "incidentReport" ||
      tab === "registerIncident" ||
      tab === "incidentReportDashboard"
    ) {
      history.push("/IncidentReportMenu");
    }
  };
  //#endregion

  //#region get IsActive value
  const onChangeIsActive = (event) => {
    setIsActive(event.target.checked);
  };
  //#endregion

  //#region Reset the page
  const resetEditIncidentType = () => {
    fetchIncidentTypeByID();
    setFormErrors("");
    setIsActive(sessionStorage.getItem("isActive") === "true");
  };
  //#endregion

  //#region Fetch Incident Type by ID
  const fetchIncidentTypeByID = () => {
    const queryParams = new URLSearchParams(location.search);
    const IncidentTypeID = queryParams.get("IncidentTypeID");
    if (!IncidentTypeID) {
      history.push("/IncidentReportMenu");
      return;
    }
    setLoading(true);

    incidentTypeService
      .readIncidentTypeById(helper.getUser(), IncidentTypeID)
      .then((response) => {
        if (response.data.Success === 1 && response.data["Incident Type"]) {
          const {
            IncidentTypeID: id,
            IncidentType: type,
            IsActive: active,
          } = response.data["Incident Type"];
          setIncidentTypeID(id);
          setIncidentType(type);
          setIsActive(active);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  const saveEditIncidentType = () => {
    if (!incidentType || incidentType.trim() === "") {
      setFormErrors("Incident Type is required");
      return;
    }

    setInitStates((prevState) => ({
      ...prevState,
      loading: true,
      spinnerMessage: "Saving incident type...",
    }));

    const data = {
      IncidentTypeID: incidentTypeID,
      IncidentType: incidentType,
      isActive,
      UserID: helper.getUser(),
    };

    incidentTypeService
      .postUpdateIncidentType(data)
      .then((response) => {
        const { Success, Msg } = response?.data || {};

        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
          spinnerMessage: "",
        }));

        if (Success === 1) {
          toast.success(Msg);
          setIncidentType("");
          setFormErrors("");

          history.push({
            pathname: "/IncidentType",
            state: { activeTab: "incidentType" },
          });
        } else {
          setFormErrors(Msg);
          toast.error(Msg);
        }
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.Message;
        setFormErrors(errorMsg);
        toast.error(errorMsg);
      });
  };

  //#endregion

  //#region On Change Incident Type
  const onChangeIncidentType = (e) => {
    const value = e.target.value;
    setIncidentType(value);

    if (!value.trim()) {
      setFormErrors("Incident Type is required");
    } else {
      setFormErrors("");
    }
  };
  //#endregion

  //#region return
  return (
    <div className="pro-main-display">
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
              {initialState.spinnerMessage}
            </p>
          </div>
        }
      >
        <div className="incidentReportMenus">
          <Tab.Container
            id="left-tabs-example"
            activeKey={activeTab}
            onSelect={toggle}
          >
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
                  <Nav.Item>
                    <Nav.Link
                      eventKey="incidentReportDashboard"
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Incident Report Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="registerIncident"
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Register Incident
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="incidentReport"
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Incident Report
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="incidentType"
                      style={{ border: "1px solid #5E41FC" }}
                    >
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
                <div
                  className="addIncidentTypeMainContent"
                  style={{
                    height: "100%",
                    position: "relative",
                    paddingLeft: "25px",
                    marginTop: "30px",
                  }}
                >
                  <h4>
                    Edit Incident Type{" "}
                    <span className="icon-size">
                      <i
                        className="far fa-arrow-alt-circle-left text-primary pointer"
                        onClick={() => history.goBack()}
                        title="Back to List"
                      ></i>
                    </span>
                  </h4>
                  <div>
                    <div className="row row-sm mg-t-20">
                      <div className="col-lg-4">
                        <div className="createnm mroDictionayViewrVersionSelected">
                          <FloatingLabel
                            label="Incident Type ID"
                            className="float-hidden float-select"
                          >
                            <input
                              type="text"
                              className="form-control mg-l-5 mg-r-15"
                              name="Incident"
                              value={incidentTypeID}
                              disabled
                            />
                          </FloatingLabel>
                        </div>
                      </div>
                    </div>
                    <div className="row row-sm mg-t-20">
                      <div className="col-lg-4">
                        <div className="createnm mroDictionayViewrVersionSelected">
                          <FloatingLabel
                            label="Incident Type"
                            className="float-hidden float-select"
                          >
                            <input
                              type="text"
                              className="form-control mg-l-5 mg-r-15"
                              maxLength="50"
                              name="Incident"
                              value={incidentType}
                              onChange={onChangeIncidentType}
                            />
                          </FloatingLabel>
                        </div>
                        {formErrors && (
                          <div className="error-message">{formErrors}</div>
                        )}
                      </div>
                    </div>
                    <div className="row row-sm mg-t-20">
                      <div className="col-md-2">
                        <label>
                          <b>Is Active?</b>
                        </label>
                      </div>
                      <div className="col-md-5 mg-t-5">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={isActive}
                            id="IsActive"
                            name="IsActive"
                            onChange={onChangeIsActive}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                    <br />
                    <div className="row row-sm">
                      <div className="col-md-2">
                        <button
                          id="Save"
                          className="btn btn-gray-700 btn-block"
                          tabIndex="4"
                          onClick={saveEditIncidentType}
                        >
                          <i className="fa fa-save mg-r-5"></i> Save
                        </button>
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-gray-700 btn-block"
                          tabIndex="5"
                          onClick={resetEditIncidentType}
                          id="Reset"
                        >
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
export default EditIncidentType;
