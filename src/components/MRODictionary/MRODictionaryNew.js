import React, { Component } from "react";
import MroDictionaryViewer from "./MRODictionaryViewer";
import UploadMroDictionary from "./UploadMroDictionary";
import NounModifierTemplateList from "./NounModifierTemplateList";
import CreateNounModifierTemplate from "./CreateNounModifierTemplate";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import helper from "../../helpers/helpers";
import accessControlService from "../../services/accessControl.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MRODictionaryNew.scss";
import LatQueImg from "../../assets/icons/quest-icon.png";
import mroDictionaryService from "../../services/mroDictionary.service";

toast.configure();

class MRODictionary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: sessionStorage.getItem("activeMroDictionaryTab") ? sessionStorage.getItem("activeMroDictionaryTab") : "mroDictionaryViewer",
      accessControl: [],
      canUserAccessUploadMRODictionary: false,
      canUserAccessMroDictionaryViewer: false,
      canUserAccessNounModifierTemplateList: false,
      canUserAccessCreateNounModifierTemplate: false,
      spinnerMessage: "",
      loading: false,
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  componentDidMount() {
    this.fetchUserRoleAccess();
  }

  //#region User Access
  fetchUserRoleAccess() {
    this.setState({
      spinnerMessage: "Please wait while loading...",
      loading: true,
    });

    if (sessionStorage.getItem("activeMroDictionaryTab") === "nounModifierTemplateList") {

      this.setState({
        activeTab: "nounModifierTemplateList"
      });
    }

    accessControlService
      .ReadUserMenuAccessList(helper.getUser(), "MRO Dictionary")
      .then((response) => {
        this.setState(
          {
            accessControl: response.data,
          },
          () => {
            const canUserAccessMRODictionaryViewer =
              this.state.accessControl.find(
                (a) => a.PageName === "MRO Dictionary Viewer"
              );
            const canUserAccessUploadMRODictionary =
              this.state.accessControl.find(
                (a) => a.PageName === "Upload MRO Dictionary"
              );
            const canUserAccessNounModifierTemplateList =
              this.state.accessControl.find(
                (a) => a.PageName === "Noun-Modifier Template List"
              );
            const canUserAccessCreateNounModifierTemplate =
              this.state.accessControl.find(
                (a) => a.PageName === "Create Noun-Modifier Template"
              );
            this.setState({
              canUserAccessMRODictionaryViewer:
                canUserAccessMRODictionaryViewer.canAccess,
              canUserAccessUploadMRODictionary:
                canUserAccessUploadMRODictionary.canAccess,
              canUserAccessNounModifierTemplateList:
                canUserAccessNounModifierTemplateList.canAccess,
              canUserAccessCreateNounModifierTemplate:
                canUserAccessCreateNounModifierTemplate.canAccess,
              loading: false,
            });
          }
        );
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Download MRO Dictionary Help Guide
  downloadMRODictionaryHelpDocument() {
    mroDictionaryService
      .downloadHelpDocument()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "UserGuide-MRODictionary.pptx");
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  handleTabSelect(selectedTab) {
    this.setState({
        activeTab: selectedTab,
      });
      sessionStorage.setItem("activeMroDictionaryTab", selectedTab);
  }

  render() {
    const { activeTab, loading, spinnerMessage } = this.state;

    return (
      <div>
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
          <Tab.Container defaultActiveKey={activeTab} onSelect={this.handleTabSelect}>
            <div className="row" style={{ marginRight: "15px" }}>
              <div className="col-md-10">
                <Nav variant="pills" className="mg-l-35 mg-b-0 mg-t-10">
                  {this.state.canUserAccessMRODictionaryViewer && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="mroDictionaryViewer"
                        style={{ border: "1px solid #5E41FC" }}
                      >
                        MRO Dictionary Viewer
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {this.state.canUserAccessUploadMRODictionary && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="uploadMRODictionary"
                        style={{ border: "1px solid #5E41FC" }}
                      >
                        Upload MRO Dictionary
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {this.state.canUserAccessNounModifierTemplateList && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="nounModifierTemplateList"
                        style={{ border: "1px solid #5E41FC" }}
                      >
                        Noun - Modifier Template List
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {this.state.canUserAccessCreateNounModifierTemplate && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="createNounModifierTemplate"
                        style={{ border: "1px solid #5E41FC" }}
                      >
                        Create Noun - Modifier Template
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </div>
              <div className="col-md-2 mg-t-10">
                <img
                  src={LatQueImg}
                  alt="query-img"
                  onClick={this.downloadMRODictionaryHelpDocument}
                  className="mroDictionaryHelpImg"
                />
              </div>
            </div>

            <Tab.Content>
              <Tab.Pane eventKey="mroDictionaryViewer" key={`mroDictionaryViewer-${activeTab}`}>
                <MroDictionaryViewer />
              </Tab.Pane>
              <Tab.Pane eventKey="uploadMRODictionary" key={`uploadMRODictionary-${activeTab}`}>
                <UploadMroDictionary />
              </Tab.Pane>
              <Tab.Pane eventKey="nounModifierTemplateList" key={`nounModifierTemplateList-${activeTab}`}>
                <NounModifierTemplateList {...this.props} />
              </Tab.Pane>
              <Tab.Pane eventKey="createNounModifierTemplate" key={`createNounModifierTemplate-${activeTab}`}>
                <CreateNounModifierTemplate />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

        </LoadingOverlay>
      </div>
    );
  }
}

export default MRODictionary;
