import React, { useState, useEffect } from "react";
import helper from "../../helpers/helpers";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import { Button, Modal } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import RegisterIncident from "./RegisterIncident";
import IncidentReport from "./IncidentReport";
import IncidentReportDashboard from "./IncidentReportDashboard";
import incidentTypeService from "../../services/incidentType.service";
import { Link } from "react-router-dom";

toast.configure();

function ViewIncidentType() {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [incidentTypeID, setIncidentTypeID] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [isActive, setIsActive] = useState("");

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

  //#region Initialize table columns and data on mount
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    fetchIncidentTypeByID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location]);

  //#endregion

  //#region State initialization
  const [initStates, setInitStates] = useState({
    incidentTypeID: 0,
    incidentType: "",
    isActive: "",
    spinnerMessage: "Please wait a while View Incident Type data loading.....",
    showViewIncidentTypeDeleteModal: false,
  });
  //#endregion

  //#region Navigate to Edit Incident Type
  const editIncidentType = (IncidentTypeID) => {
    history.push({
      pathname: "/EditIncidentType",
      search: `?IncidentTypeID=${IncidentTypeID}`,
    });
  };
  //#endregion

  //#region Handle View Incident Type Delete Confirmation
  const handleViewIncidentTypeDeleteConfirmation = () => {
    setInitStates((prevState) => ({
      ...prevState,
      showViewIncidentTypeDeleteModal: true,
    }));
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
          setActiveTab(activeTab || "incidentType");
        }
        // setActiveTab(activeTab ?? "default");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Handle View Incident Type Delete Yes
  const handleDelete = () => {
    setLoading(true);

    const data = {
      IncidentTypeID: incidentTypeID,
      IncidentType: incidentType,
      IsActive: isActive,
      UserID: helper.getUser(),
    };

    incidentTypeService
      .postDeleteIncidentType(data)
      .then((response) => {
        const { Success, Msg } = response?.data || {};
        if (Success === 1) {
          toast.success(Msg);
          history.push({
            pathname: "/IncidentType",
            state: { activeTab: "incidentType" },
          });
        } else {
          toast.error(Msg);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.Msg);
      })
      .finally(() => setLoading(false));
  };
  //#endregion

  //#region Handle View Incident Type Delete No
  const handleViewIncidentTypeDeleteNo = () => {
    setInitStates((prevState) => ({
      ...prevState,
      showViewIncidentTypeDeleteModal: false,
    }));
  };
  //#endregion

  //#region Return
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
              {initStates.spinnerMessage}
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
                  className="incidentTypeMainContent"
                  style={{
                    height: "100%",
                    position: "relative",
                    paddingLeft: "25px",
                    marginTop: "30px",
                  }}
                >
                  <h4>
                    View Incident Type{" "}
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
                    <div className="row row-sm mg-t-20 incidentTypeText">
                      <div className="col-lg-2">
                        <div className="incidentTypeContent">
                          <label>Incident Type ID </label>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="incidentTypeContent">
                          <span>{incidentTypeID}</span>
                        </div>
                      </div>
                    </div>
                    <div className="row row-sm mg-t-20 incidentTypeText">
                      <div className="col-lg-2">
                        <div className="incidentTypeContent">
                          <label>Incident Type </label>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="incidentTypeContent">
                          <span>{incidentType}</span>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row row-sm incidentTypeText">
                      <div className="col-lg-2">
                        <div className="incidentTypeContent">
                          <label>Is Active? </label>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="incidentTypeContent">
                          <span>{isActive ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row row-sm">
                      <div className="col-md-2">
                        <button
                          id="Save"
                          className="btn btn-gray-700 btn-block"
                          tabIndex="4"
                          onClick={() => editIncidentType(incidentTypeID)}
                        >
                          <i className="fa fa-pencil"></i> Edit
                        </button>
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-gray-700 btn-block"
                          tabIndex="5"
                          onClick={handleViewIncidentTypeDeleteConfirmation}
                          id="Reset"
                        >
                          <i className="fa fa-close"></i> Delete
                        </button>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
                <Modal
                  className="updateProjectDetailsDeleteConfirmationModal"
                  show={initStates.showViewIncidentTypeDeleteModal}
                  onHide={handleViewIncidentTypeDeleteNo}
                  aria-labelledby="contained-modal-title-vcenter"
                  backdrop="static"
                  enforceFocus={false}
                >
                  <Modal.Header>
                    <Modal.Title>Delete Incident Type Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <p>
                        Are you sure, you want to delete this Incident Type?
                      </p>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>
                      Yes
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleViewIncidentTypeDeleteNo}
                    >
                      No
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ViewIncidentType;
