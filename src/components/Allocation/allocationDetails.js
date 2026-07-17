import React, { Component } from "react";
// import { HashRouter as Router, Link, Switch } from "react-router-dom";
import ProductionAllocation from "./ProductionAllocation";
import ProductionDownload from "./ProductionDownloadOrUpload";
import QCAllocation from "./QCAllocation";
import QCDownload from "./QCDownloadOrUpload";
import QCFeedbacks from "./QCFeedbacks";
import QCItemsList from "./QCItemsList";
import OnScreenProductionAllocation from "./OnScreenProductionAllocation";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import helper from "../../helpers/helpers";
import accessControlService from "../../services/accessControl.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import productionAllocationService from "../../services/productionAllocation.service";
import { Link } from "react-router-dom";
toast.configure();

class AllocationDetails extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 0,
      accessControl: [],
      defaultActiveKey: "",
      productionAllocationPageAccess: false,
      productionDownloadUploadPageAccess: false,
      QCAllocationPageAccess: false,
      QCDownloadUploadPageAccess: false,
      spinnerMessage: "Please wait while loading...",
      loading: false,
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  //#region component mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    this.fetchUserRoleAccess();
  }
  //#endregion

  //#region Fetching Logged In User Access
  fetchUserRoleAccess() {
    this.setState({
      spinnerMessage: "Please wait while loading...",
      loading: true,
    });

    accessControlService
      .ReadUserMenuAccessList(helper.getUser(), "Allocation")
      .then((response) => {
        this.setState(
          {
            accessControl: response.data,
          },
          () => {
            let productionAllocationPageAccess = this.state.accessControl.find(
              (a) => a.PageName === "Production Allocation"
            );

            let productionDownloadUploadPageAccess =
              this.state.accessControl.find(
                (a) => a.PageName === "Production Download-Upload"
              );

            let QCAllocationPageAccess = this.state.accessControl.find(
              (a) => a.PageName === "QC Allocation"
            );

            let QCDownloadUploadPageAccess = this.state.accessControl.find(
              (a) => a.PageName === "QC Download-Upload"
            );

            let activeTab = 0;
            let defaultActiveKey = "";

            if (productionAllocationPageAccess.canAccess) {
              activeTab = 1;
              defaultActiveKey = "productionAllocation";
            } else if (productionDownloadUploadPageAccess.canAccess) {
              activeTab = 2;
              defaultActiveKey = "productionDownload";
            } else if (QCAllocationPageAccess.canAccess) {
              activeTab = 3;
              defaultActiveKey = "QCAllocation";
            } else if (QCDownloadUploadPageAccess.canAccess) {
              activeTab = 4;
              defaultActiveKey = "QCDownload";
            }

            this.setState({
              activeTab: activeTab,
              defaultActiveKey: defaultActiveKey,
              productionAllocationPageAccess:
                productionAllocationPageAccess.canAccess,
              productionDownloadUploadPageAccess:
                productionDownloadUploadPageAccess.canAccess,
              QCAllocationPageAccess: QCAllocationPageAccess.canAccess,
              QCDownloadUploadPageAccess: QCDownloadUploadPageAccess.canAccess,
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

  //#region  Download GOP Help Guide
  downloadHelpDocument() {
    productionAllocationService
      .DownloadGOPHelpFile()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "GOP Help Document.docx");
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  // moveToProductionEdit() {
  //   this.props.history.push("/allocation/productionEdit");
  // }

  render() {
    const productionAllocationPageAccess =
      this.state.productionAllocationPageAccess;
    const productionDownloadUploadPageAccess =
      this.state.productionDownloadUploadPageAccess;
    const QCAllocationPageAccess = this.state.QCAllocationPageAccess;
    const QCDownloadUploadPageAccess = this.state.QCDownloadUploadPageAccess;
    const defaultActiveKey = this.state.defaultActiveKey;

    return this.state.activeTab === 0 ? (
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
              {this.state.spinnerMessage}
            </p>
          </div>
        }
      >
        <p style={{ height: "580px" }}></p>
      </LoadingOverlay>
    ) : (
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
          <Tab.Container defaultActiveKey={defaultActiveKey}>
            <div className="row" style={{ marginRight: "15px" }}>
              <div className="col-md-10">
                <Nav variant="pills" className="mg-l-50 mg-b-20 mg-t-10">
                  {productionAllocationPageAccess && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="productionAllocation"
                        style={{ border: "1px solid #5E41FC" }}
                        onClick={() => {
                          this.toggle(1);
                        }}
                      >
                        Production Allocation
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {productionDownloadUploadPageAccess && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="productionDownload"
                        style={{ border: "1px solid #5E41FC" }}
                        onClick={() => {
                          this.toggle(2);
                        }}
                      >
                        Production
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {QCAllocationPageAccess && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="QCAllocation"
                        style={{ border: "1px solid #5E41FC" }}
                        onClick={() => {
                          this.toggle(3);
                        }}
                      >
                        QC Allocation
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {QCDownloadUploadPageAccess && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="QCDownload"
                        style={{ border: "1px solid #5E41FC" }}
                        onClick={() => {
                          this.toggle(4);
                        }}
                      >
                        QC
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link
                      eventKey="qcItemsList"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(5);
                      }}
                    >
                      QC Items List
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="qcFeedbacks"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(6);
                      }}
                    >
                      QC Feedbacks
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="onScreenProductionAllocation"
                      style={{ border: "1px solid #5E41FC" }}
                      onClick={() => {
                        this.toggle(7);
                      }}
                    >
                      On-Screen Production Allocation
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
              <div className="col-md-2 mg-t-15">
                <Link to="#/" onClick={this.downloadHelpDocument}>
                  Download Help Document
                </Link>
              </div>
              <div className="d-flex justify-content-end"></div>
            </div>

            <Tab.Content>
              <Tab.Pane eventKey="productionAllocation">
                {this.state.activeTab === 1 ? <ProductionAllocation /> : null}
              </Tab.Pane>
              <Tab.Pane eventKey="productionDownload">
                {this.state.activeTab === 2 ? <ProductionDownload /> : null}
              </Tab.Pane>
              <Tab.Pane eventKey="QCAllocation">
                {this.state.activeTab === 3 ? <QCAllocation /> : null}
              </Tab.Pane>
              <Tab.Pane eventKey="QCDownload">
                {this.state.activeTab === 4 ? <QCDownload /> : null}
              </Tab.Pane>
              <Tab.Pane eventKey="qcItemsList">
                {this.state.activeTab === 5 ? <QCItemsList /> : null}
              </Tab.Pane>
              <Tab.Pane eventKey="qcFeedbacks">
                {this.state.activeTab === 6 ? <QCFeedbacks /> : null}
              </Tab.Pane>
              <Tab.Pane eventKey="onScreenProductionAllocation">
                {this.state.activeTab === 7 ? (
                  <OnScreenProductionAllocation />
                ) : null}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default AllocationDetails;
