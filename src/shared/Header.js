import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import helper from "../helpers/helpers";
import { Dropdown, Modal } from "react-bootstrap";
import face1 from "../assets/faces/face1.jpg";
import loginService from "../services/login.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BootstrapTable from "react-bootstrap-table-next";
import UserProfile from "../components/Profile/UserProfile";
import projectService from "../services/project.service";
import accessControlService from "../services/accessControl.service";
import incidentIcon from "../../src/assets/incident-icon.png";
import pointerLeft from "../../src/assets/pointing-left.png";
import adminUser from "../../src/assets/user-gear.png";
import dictionaryIcon from "../../src/assets/mro-dictionary.png";
import mastersIcon from "../../src/assets/mastersIcon.png";
import reportsIcon from "../../src/assets/reportsIcon.png";
import snomedSearchIcon from "../../src/assets/snomed-search.png";
import unspscIcon from "../../src/assets/UNSPSCIcon.png";
import allocationIcon from "../../src/assets/AllocationIcon.png";

toast.configure();

//#region Version Columns
const VersionColumns = [
  {
    dataField: "Sl. No",
    text: "Sl. No.",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
    headerAlign: "center",
    align: "center",
  },
  {
    dataField: "Product",
    text: "Product",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
    headerAlign: "center",
    align: "center",
  },
  {
    dataField: "ChangeDescription",
    text: "Change Description",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
    headerAlign: "center",
    align: "left",
  },
  {
    dataField: "Version No",
    text: "Version No.",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
    headerAlign: "center",
    align: "center",
  },
  {
    dataField: "Released on",
    text: "Released on",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
    headerAlign: "center",
    align: "center",
  },
];
//#endregion

const firstCOntent = () => {
  let tableData = (
    <div style={{ display: "block" }}>
      <div className="content-display mb-0">
        <span style={{ minWidth: "10%", whiteSpace: "pre-wrap" }}>
          <b>Masters</b>
        </span>
      </div>
      <div style={{ lineHeight: "175%" }}>
        Customers, Project Activity, Project Sub-Activity, Input / Output
        Formats, Item Status List, Generic Activities, Communication Modes,
        Customer Feedback Types, Project, Project Batch
      </div>
      <div className="content-display mb-0">
        <span style={{ minWidth: "10%" }}>
          <b>Projects</b>
        </span>
      </div>
      <div style={{ lineHeight: "175%" }}>
        Projects List (OnGoing, Delivered, Not Started), Mark Project as
        Delivered / On-hold, Mark Batch as Delivered
      </div>
      <div className="content-display mb-0">
        <span style={{ minWidth: "10%" }}>
          <b>Admin</b>
        </span>
      </div>
      <div style={{ lineHeight: "175%" }}>
        Users, Roles, User Roles, Role Access
      </div>
      <div className="content-display mb-0">
        <span style={{ minWidth: "10%" }}>
          <b>Allocation</b>
        </span>
      </div>
      <div style={{ lineHeight: "175%" }}>
        Production Allocation, Production Download / Upload, QC Allocation, QC
        Download / Upload
      </div>
      <div className="content-display mb-0">
        <span style={{ minWidth: "10%" }}>
          <b>Reports</b>
        </span>
      </div>
      <div style={{ lineHeight: "175%" }}>
        Projects Status List, Previous Day Report, Periodic Project Report,
        Employee Specific Report, Previous Day Projects Summary, Employees Task
        Report
      </div>
      <br />
      <div className="content-display mb-0">
        <span style={{ minWidth: "10%" }}>Dashboard, SNOMED Searcher</span>
      </div>
    </div>
  );

  return tableData;
};

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      middleName: "",
      lastName: "",
      profileImage: "",
      show: false,
      openProfile: false,
      canUserAccessMRODictionaryViewer: false,
      canUserAccessIncidentReport: false,
      canUserAccessMarketingModule: false,
    };
  }

  //#region component mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
    this.canUserAccessPage("MRO Dictionary Viewer");
    this.canUserAccessPage("Incident Report Dashboard");
    this.canUserAccessPage("View Marketing Documents");
    this.fetchUsername();
  }
  //#endregion

  //#region Fetching selected User details
  fetchUsername() {
    const user = helper.getUser();
    //Service Call
    loginService
      .getUsername(user)
      .then((response) => {
        this.displayProfileFile(response.data.PhotoFileName);
        this.setState({
          firstName: response.data.FirstName,
          middleName: response.data.MiddleName,
          lastName: response.data.LastName,
          showVersionModal: false,
          versionData: [
            {
              "Sl. No": "1",
              Product: "GOP",
              ChangeDescription: firstCOntent(),
              "Version No": "1.0",
              "Released on": "03-Oct-2023",
            },
            {
              "Sl. No": "2",
              Product: "GOP",
              ChangeDescription: "Added UNSPSC Searcher module",
              "Version No": "1.1",
              "Released on": "25-Oct-2023",
            },
            {
              "Sl. No": "3",
              Product: "GOP",
              ChangeDescription: "Added Reach CEO Directly module",
              "Version No": "1.2",
              "Released on": "29-Jul-2024",
            },
            {
              "Sl. No": "4",
              Product: "GOP",
              ChangeDescription: "Added MRO Dictionary module",
              "Version No": "1.3",
              "Released on": "07-Oct-2024",
            },
            {
              "Sl. No": "5",
              Product: "GOP",
              ChangeDescription: "Added Incident Report module",
              "Version No": "1.4",
              "Released on": "22-Apr-2025",
            },
            {
              "Sl. No": "6",
              Product: "GOP",
              ChangeDescription: "Added on-screen edit QC module",
              "Version No": "1.5",
              "Released on": "24-Jul-2025",
            },
            {
              "Sl. No": "7",
              Product: "GOP",
              ChangeDescription: "Added Marketing module",
              "Version No": "1.6",
              "Released on": "17-Nov-2025",
            },
          ],
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Downloading Scope File
  displayProfileFile = (profileFileName) => {
    projectService
      .downloadFile(profileFileName, "profilephoto")
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        this.setState((prevState) => ({
          ...prevState,
          profileImage: fileURL,
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //#endregion

  //#region fetching Project page access
  canUserAccessPage(pageName) {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "MRO Dictionary Viewer") {
          this.setState({
            canUserAccessMRODictionaryViewer: response.data,
          });
        } else if (pageName === "Incident Report Dashboard") {
          this.setState({
            canUserAccessIncidentReport: response.data,
          });
        } else if (pageName === "View Marketing Documents") {
          this.setState({
            canUserAccessMarketingModule: response.data,
          });
        }
      })
      .catch((e) => {
        //toast.error(e.response.data.Message, { autoClose: false });
        console.error(e.response.data.Message);
      });
  }
  //#endregion

  // #region functions for UserProfile Modal
  openProfileModal = (e) => {
    this.closeMenu(e);
    this.setState({ openProfile: true });
  };
  closeProfileModal = () => {
    this.setState({ openProfile: false });
  };
  // #endregion

  closeMenu(e) {
    e.target.closest(".dropdown").classList.remove("show");
    e.target.closest(".dropdown .dropdown-menu").classList.remove("show");
  }

  toggleHeaderMenu(e) {
    e.preventDefault();
    document.querySelector("body").classList.toggle("az-header-menu-show");
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      document.querySelector("body").classList.remove("az-header-menu-show");
    }
  }

  openVesionHandler = () => {
    this.setState({ showVersionModal: !this.state.showVersionModal });
  };

  closeVesionModal = () => {
    this.setState({ showVersionModal: !this.state.showVersionModal });
  };

  clearVersionData = () => {
    sessionStorage.removeItem("lockedData");
  };

  clearTabData = () => {
    sessionStorage.removeItem("activeMroDictionaryTab");
  };

  render() {
    return (
      <div>
        {/* User Profile Modal */}
        {this.state.openProfile && (
          <UserProfile
            openProfile={this.state.openProfile}
            closeProfileModal={this.closeProfileModal}
          />
        )}
        {/* User Profile Modal */}

        <div className="az-header">
          <div className="container-fluid">
            <div className="az-header-left">
              <div className="gop-logo-div">
                <Link to="/Dashboard" className="az-logo">
                  <span></span> GOP
                </Link>
                <span className="gop-vesrion" onClick={this.openVesionHandler}>
                  v1.6
                </span>
              </div>
              <a
                id="azMenuShow"
                onClick={(event) => this.toggleHeaderMenu(event)}
                className="az-header-menu-icon d-lg-none"
                href="#/"
              >
                <span></span>
              </a>
            </div>
            <div className="az-header-menu">
              <div className="az-header-menu-header">
                <div className="gop-logo-div">
                  <Link to="/Dashboard" className="az-logo">
                    <span></span> GOP
                  </Link>
                  <span
                    className="gop-vesrion"
                    onClick={this.openVesionHandler}
                  >
                    v1.1
                  </span>
                </div>
                <a
                  href="#/"
                  onClick={(event) => this.toggleHeaderMenu(event)}
                  className="close"
                >
                  &times;
                </a>
              </div>
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/Dashboard")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/Dashboard" className="nav-link">
                    <i
                      className="fas fa-chart-line mg-r-2"
                      style={{ color: "#5b47fb" }}
                    ></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/Projects")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/Projects" className="nav-link prjects">
                    <i
                      className="fas fa-tasks mg-r-2"
                      style={{ color: "#5b47fb" }}
                    ></i>{" "}
                    Projects
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/Allocation")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/Allocation" className="nav-link">
                    <img
                      src={allocationIcon}
                      alt="AllocationIcon"
                      style={{ marginRight: "5px" }}
                    />
                    Allocation
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/Unspsc")
                      ? "nav-item active"
                      : "nav-item"
                  }
                  onClick={this.clearVersionData}
                >
                  <Link to="/Unspsc" className="nav-link">
                    <img
                      className="fa-rotate-180"
                      src={unspscIcon}
                      alt="UNSPSCIcon"
                      style={{ marginRight: "5px" }}
                    />
                    UNSPSC
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/snomed")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/snomed" className="nav-link">
                    <img
                      src={snomedSearchIcon}
                      alt="SnomedSearchIcon"
                      style={{ marginRight: "5px" }}
                    />
                    SNOMED
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/reports")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/reports" className="nav-link">
                    <img
                      src={reportsIcon}
                      alt="ReportsIcon"
                      style={{ marginRight: "5px" }}
                    />
                    Reports
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/Masters")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/Masters/Customers" className="nav-link">
                    <img
                      src={mastersIcon}
                      alt="MastersIcon"
                      style={{ marginRight: "5px" }}
                    />
                    Masters
                  </Link>
                </li>
                {this.state.canUserAccessMRODictionaryViewer && (
                  <li
                    className={
                      this.isPathActive("/MRODictionary")
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <Link
                      to="/MRODictionary"
                      className="nav-link"
                      onClick={this.clearTabData}
                    >
                      <img
                        src={dictionaryIcon}
                        alt="MroDictionary"
                        style={{ marginRight: "5px" }}
                      />
                      MRO Dictionary
                    </Link>
                  </li>
                )}

                <li
                  className={
                    this.isPathActive("/admin") ? "nav-item active" : "nav-item"
                  }
                >
                  <Link to="/admin" className="nav-link">
                    <img
                      src={adminUser}
                      alt="AdminUser"
                      style={{ marginRight: "5px" }}
                    />
                    Admin
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/grievancereach")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/grievancereach" className="nav-link">
                    <img
                      src={pointerLeft}
                      alt="PointerLeft"
                      style={{ width: "18px", marginRight: "5px" }}
                    />
                    Reach CEO Directly
                  </Link>
                </li>
                {this.state.canUserAccessIncidentReport && (
                  <li
                    className={
                      this.isPathActive("/IncidentReportMenu")
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <Link to="/IncidentReportMenu" className="nav-link">
                      <img
                        src={incidentIcon}
                        alt="Incident Icon"
                        style={{ marginRight: "5px" }}
                      />
                      Incident Report
                    </Link>
                  </li>
                )}
                <li
                  className={
                    this.isPathActive("/GAT") ? "nav-item active" : "nav-item"
                  }
                >
                  <Link to="/GAT" className="nav-link">
                    <i
                      class="fa fa-cog mg-r-4"
                      style={{ color: "#5b47fb" }}
                    ></i>
                    GAT
                  </Link>
                </li>
                {this.state.canUserAccessMarketingModule && (
                  <li
                    className={
                      this.isPathActive("/Marketing")
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <Link to="/Marketing" className="nav-link">
                      <i
                        class="fa fa-globe mg-r-4"
                        style={{ color: "#5b47fb" }}
                      ></i>
                      Marketing
                    </Link>
                  </li>
                )}
                {/* <li
                  className={
                    this.isPathActive("/Allocation/GOPQCEditScreen")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/Allocation/GOPQCEditScreen" className="nav-link">
                    <img
                      src={incidentIcon}
                      alt="Incident Icon"
                      style={{ marginRight: "5px" }}
                    />
                    QC Edit Screen
                  </Link>
                </li> */}
                {/* <li
                  className={
                    this.isPathActive("/Allocation/QCItemsList")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/Allocation/QCItemsList" className="nav-link">
                    <img
                      src={incidentIcon}
                      alt="Incident Icon"
                      style={{ marginRight: "5px" }}
                    />
                    QC Items List
                  </Link>
                </li> */}
              </ul>
            </div>

            <div className="az-header-right">
              <Dropdown
                className="az-profile-menu"
                show={this.state.show}
                onMouseEnter={() => this.setState({ show: true })}
                onMouseLeave={() => this.setState({ show: false })}
              >
                <Dropdown.Toggle as={"a"} className="az-img-user">
                  <img
                    src={
                      this.state.profileImage ? this.state.profileImage : face1
                    }
                    alt=""
                  ></img>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="az-dropdown-header d-sm-none">
                    <i className="icon ion-md-arrow-back"></i>
                  </div>
                  <div className="az-header-profile">
                    <div className="az-img-user">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={(event) => this.openProfileModal(event)}
                      >
                        <img
                          src={
                            this.state.profileImage
                              ? this.state.profileImage
                              : face1
                          }
                          alt=""
                        ></img>
                      </span>
                    </div>
                    <h6>
                      {this.state.firstName} {this.state.middleName}{" "}
                      {this.state.lastName}
                    </h6>
                  </div>
                  <Link
                    to="/ChangePassword"
                    onClick={(event) => this.closeMenu(event)}
                    className="dropdown-item"
                  >
                    <i className="fas fa-key"></i> Change Password
                  </Link>
                  <Link to="/signout" className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* #region Version Modal */}
        <Modal
          show={this.state.showVersionModal}
          onHide={this.closeVesionModal}
          className="version-modal"
        >
          <Modal.Header className="p-2">
            <h5>
              <strong>GOP Version Change History</strong>
            </h5>
          </Modal.Header>
          <Modal.Body className="p-2">
            <BootstrapTable
              keyField="ProductionAllocationID"
              data={this.state.versionData}
              columns={VersionColumns}
            />
          </Modal.Body>
          <Modal.Footer align="center" className="justify-content-center">
            <span
              className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
              style={{ width: "20%" }}
              onClick={this.closeVesionModal}
            >
              Close
            </span>
          </Modal.Footer>
        </Modal>
        {/* #endregion Version Modal */}
      </div>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Header);
