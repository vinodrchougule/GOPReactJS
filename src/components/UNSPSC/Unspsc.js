// #region Imported files
import React, { Component } from "react";
import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import ClearImg from "../../assets/icons/clear-icon.png";
import LatQueImg from "../../assets/icons/quest-icon.png";
import SearchImg from "../../assets/icons/search-icon.png";
import UNSPSCService from "../../services/Unspsc.service";
import helper from "../../helpers/helpers";
import "./Unspsc.scss";
import { BarLoader } from "react-spinners";
import LoadingOverlay from "react-loading-overlay";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { toast } from "react-toastify";
toast.configure();
// #endregion

// #region Table Column
const columns = [
  {
    dataField: "Code",
    text: "Code",
    style: {
      width: "100px",
    },
    sort: true,
    title: true,
    formatter: (cell, row, rowIndex, extraData) => <div>{row.Code}</div>,
  },
  {
    dataField: "Category",
    text: "Category",
    sort: true,
    title: true,
    formatter: (cell, row, rowIndex, extraData) => <div>{row.Category}</div>,
  },
];
// #endregion

export default class Unspsc extends Component {
  // #region State values
  constructor(props) {
    super(props);
    this.dropdownRef = React.createRef();
    this.radio1Ref = React.createRef();
    this.radio2Ref = React.createRef();
    this.inputRefs = {
      checkbox1: false,
      txtKeyWord1: React.createRef(),
      radio1: React.createRef(),
      radio2: React.createRef(),
      txtKeyWord2: React.createRef(),
      chkDoNotContain: React.createRef(),
      chkSelectSegment: React.createRef(),
      txtUnspsc1: React.createRef(),
      txtUnspsc2: React.createRef(),
      txtUnspsc3: React.createRef(),
      txtUnspsc4: React.createRef(),
      button1: React.createRef(),
      button2: React.createRef(),
      segment: React.createRef(),
      family: React.createRef(),
      classData: React.createRef(),
      commodity: React.createRef(),
      unspscCodeCategory: React.createRef(),
      unspscCode: React.createRef(),
      unspscCategory: React.createRef(),
    };
    this.state = {
      isSelectFocused: false,
      unspcVersions: [],
      searchedUnspscData: [],
      unspscLatestVersion: "",
      selectedVersion: false,
      isLocked: false,
      txtKeyWord1: "",
      selectedOption: "AND",
      txtKeyWord2: "",
      chkDoNotContain: false,
      txtUnspsc1: "",
      txtUnspsc2: "",
      txtUnspsc3: "",
      txtUnspsc4: "",
      searchSegment: false,
      segment: "",
      family: "",
      classData: "",
      commodity: "",
      categoryDefinition: "",
      unspscCodeCategory: "",
      unspscCode: "",
      unspscCategory: "",
      selectedUnspscRow: null,
      selectedRowCode: "",
      commodityData: {},
      selectedRowIndex: null,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      pageNo: 1,
      currentPage: 0,
      TotalCount: 0,
      totalPageCount: 1,
      divStyle: {},
      loading: false,
    };
  }
  // #endregion

  // #region Onload function component didmount
  componentDidMount() {
    this.fetchUnspcVersionData();
    document.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("resize", this.updateWindowHeight);
    this.setState((prevState) => ({
      ...prevState,
      divStyle: { height: "93%", padding: "10px" },
    }));

    this.fetchLatestVersion(this.props.unspscVerion);

    // console.log(this.props.unspscVerion, "this.props.unspscVerion")

    if (this.props.showUnspscModal) {
      if (this.props.unspscVerion) {
        this.setState((prevState) => ({
          ...prevState,
          selectedVersion: this.props.unspscVerion,
          isLocked: true,
          divStyle: { height: "100%", padding: "0" },
        }));
      } else if (!this.props.unspscVerion) {
        this.setState((prevState) => ({
          ...prevState,
          divStyle: { height: "100%", padding: "0" },
        }));
      }
      return;
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("resize", this.updateWindowHeight);
  }
  // #endregion Onload function component didmount

  // #region Get window Height and Width
  updateWindowHeight = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };
  // #endregion Get window Height and Width

  //#region  Download UNSPSC Help Guide
  downloadUNSPSCHelpDocument() {
    UNSPSCService.DownloadUNSPSCHelpFile()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "UserGuideUNSPSCSearcher.pptx");
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  // #region Fetch Version Dropdown datas
  fetchUnspcVersionData() {
    this.setState({
      spinnerMessage: "Please wait while fetching the data...!",
      loading: true,
    });
    UNSPSCService.UNSPSCVersionData()
      .then((resp) => {
        if (resp.data.length === 0) {
          this.setState({
            loading: false,
          });
          return;
        }
        this.setState({
          ...this.state,
          unspcVersions: resp.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  }
  // #endregion

  // #region Fetch Latest Version
  fetchLatestVersion(lockedVersion) {
    UNSPSCService.UNSPSCLatestVersion()
      .then((resp) => {
        if (!resp.data) {
          this.setState({
            loading: false,
          });
          return;
        }
        if (lockedVersion) {
          this.setState({
            ...this.state,
            unspscLatestVersion: resp.data,
            loading: false,
          });
        } else if (!lockedVersion) {
          this.setState({
            ...this.state,
            unspscLatestVersion: resp.data,
            selectedVersion: resp.data,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  }
  // #endregion

  // #region Clear button
  clearSearchedData = () => {
    this.setState({
      searchedUnspscData: [],
      segment: "",
      family: "",
      classData: "",
      commodity: "",
      categoryDefinition: "",
      selectedUnspscRow: "",
      selectedRowCode: "",
      unspscCodeCategory: "",
      unspscCode: "",
      unspscCategory: "",
      loading: false,
    });
  };
  clearSegmentData = () => {
    this.setState({
      ...this.state,
      // searchSegment: false,
      segment: "",
      family: "",
      classData: "",
      commodity: "",
      categoryDefinition: "",
      unspscCodeCategory: "",
      unspscCode: "",
      unspscCategory: "",
      selectedRowIndex: null,
      selectedUnspscRow: null,
      selectedRowCode: "",
    });
  };
  // #endregion

  // #region Handle Pagination
  handlePaginationPage = (pageno) => {
    if (pageno === "") {
      return;
    }
    this.clearSegmentData();
    this.setState({ pageNo: pageno });
    this.fetchSearchUnspscData(this.state.txtUnspsc1, pageno);
  };

  onPageChange = (e) => {
    if (e.target.value) {
      this.setState({ pageNo: +e.target.value });
      return;
    }
    this.setState({ pageNo: e.target.value });
  };
  // #endregion

  // #region Fetching Searched UNSPSC Data
  fetchSearchUnspscData(txtUnspsc1, pageNo) {
    if (!this.state.isLocked) {
      toast.error("Please lock the version to continue..", { autoClose: true });
      return;
    }

    if (
      !(
        this.state.selectedVersion &&
        (this.state.txtKeyWord1 ||
          this.state.txtKeyWord2 ||
          txtUnspsc1 ||
          this.state.txtUnspsc2 ||
          this.state.txtUnspsc3 ||
          this.state.txtUnspsc4)
      )
    ) {
      this.clearSearchedData();
      toast.error("Please enter atleast one search field", {
        autoClose: true,
      });
      return;
    }

    if (
      this.state.pageNo > this.state.totalPageCount ||
      this.state.pageNo < 1
    ) {
      this.setState({
        pageNo: this.state.currentPage,
      });
      toast.error(
        "Page number entered should not be greater than total page count or lesser than 1",
        { autoClose: true }
      );
      return;
    }

    let AndStatus = "F";
    let ORStatus = "F";
    let DoNotContainStatus = "F";
    if (this.state.chkDoNotContain === true) {
      DoNotContainStatus = "T";
    } else {
      if (this.state.selectedOption === "AND") {
        AndStatus = "T";
      } else if (this.state.selectedOption === "OR") {
        ORStatus = "T";
      }
    }
    this.setState({
      spinnerMessage: "Please wait while fetching the data...!",
      loading: true,
    });

    var data = {
      TableName: this.state.selectedVersion,
      Keyword1: this.state.txtKeyWord1,
      Keyword2: this.state.txtKeyWord2,
      ANDStatus: AndStatus,
      ORStatus: ORStatus,
      DoNotContainStatus: DoNotContainStatus,
      UNSPSCCode1: txtUnspsc1,
      UNSPSCCode2: this.state.txtUnspsc2,
      UNSPSCCode3: this.state.txtUnspsc3,
      UNSPSCCode4: this.state.txtUnspsc4,
      PageNo: pageNo,
      PageSize: 10000,
    };

    UNSPSCService.UNSPSCSearchData(data)
      .then((resp) => {
        if (resp.data.length === 0) {
          this.clearSearchedData();
          toast.error("No data found", { autoClose: true });
          return;
        }
        this.setState({
          ...this.state,
          searchedUnspscData: resp.data,
          TotalCount: resp.data[0].TotalCount,
          totalPageCount: Math.ceil(resp.data[0].TotalCount / 10000),
          currentPage: pageNo,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.response.data.Message, { autoClose: true });
      });
  }

  // #endregion

  // #region handle Row Click
  handleUnspscDataRowClick = (rowIndex, row, e) => {
    this.setState({
      ...this.state,
      selectedRowIndex: e,
      selectedUnspscRow: row.Code,
      selectedRowCode: row.Code,
      unspscCodeCategory: "",
      unspscCode: "",
      unspscCategory: "",
    });
    // console.log(this.state.unspscLatestVersion)
    this.fetchUnspscCommodityData(this.state.selectedVersion, row.Code);
  };
  //  #endregion

  // #region Fetch Commodity data
  fetchUnspscCommodityData(TableName, Code) {
    if (TableName && Code) {
      UNSPSCService.UNSPSCCommodityData(TableName, Code)
        .then((resp) => {
          if (!resp.data) {
            this.setState({
              loading: false,
            });
            toast.error("No data found", { autoClose: true });
            return;
          }

          this.setState({
            ...this.state,
            segment: resp.data.SegmentCode + "  " + resp.data.Segment,
            family: resp.data.FamilyCode + "  " + resp.data.Family,
            classData: resp.data.ClassCode + "  " + resp.data.Class,
            commodity: resp.data.CommodityCode + "  " + resp.data.Commodity,
            categoryDefinition: resp.data.CategoryDefinition,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  }
  // #endregion

  // #region isLock Button function
  handleLockedChange = (property) => {
    this.setState((prevState) => ({
      ...prevState,
      [property]: !this.state.isLocked,
    }));
  };

  handleSelectFocus = () => {
    this.setState({ isSelectFocused: true });
  };

  handleSelectBlur = () => {
    this.setState({ isSelectFocused: false });
  };
  // #endregion

  // #region Short Cut Keys
  handleKeyDown = (e) => {
    if (e.altKey) {
      const keyToRefMap = {
        h: this.inputRefs.txtKeyWord1.current,
        i: this.inputRefs.txtKeyWord2.current,
        b: this.inputRefs.txtUnspsc1.current,
        x: this.inputRefs.txtUnspsc2.current,
        y: this.inputRefs.txtUnspsc3.current,
        z: this.inputRefs.txtUnspsc4.current,
        j: this.inputRefs.segment.current,
        k: this.inputRefs.family.current,
        m: this.inputRefs.classData.current,
        n: this.inputRefs.commodity.current,
        p: this.inputRefs.unspscCodeCategory.current,
        q: this.inputRefs.unspscCode.current,
        g: this.inputRefs.unspscCategory.current,
      };

      const refToFocus = keyToRefMap[e.key.toLowerCase()];
      if (refToFocus) {
        let fieldValue = refToFocus.value;
        let fieldName = refToFocus.name;
        this.handleInputClick(fieldName, fieldValue);
        refToFocus.focus();
      }

      if (e.key.toLowerCase() === "v") {
        this.dropdownRef.current.focus();
      }

      if (e.key.toLowerCase() === "l") {
        this.setState((prevState) => ({
          isLocked: !prevState.isLocked,
        }));
      }

      if (e.key.toLowerCase() === "a") {
        this.radio1Ref.current.click();
        this.setState({ selectedOption: "AND", chkDoNotContain: false });
      } else if (e.key.toLowerCase() === "o") {
        this.radio2Ref.current.click();
        this.setState({ selectedOption: "OR", chkDoNotContain: false });
      }

      if (e.key.toLowerCase() === "t") {
        this.setState((prevState) => ({
          chkDoNotContain: !prevState.chkDoNotContain,
          selectedOption: "",
        }));
      }
      if (e.key.toLowerCase() === "w") {
        if (this.state.selectedRowCode) {
          if (this.state.searchSegment === false) {
            this.setState((prevState) => ({
              ...this.state,
              searchSegment: !prevState.searchSegment,
              txtUnspsc1: this.state.selectedRowCode.substring(0, 2),
            }));
            this.fetchSearchUnspscData(
              this.state.selectedRowCode.substring(0, 2),
              this.state.pageNo
            );
          } else {
            this.setState((prevState) => ({
              ...this.state,
              searchSegment: !prevState.searchSegment,
              txtUnspsc1: "",
            }));
            this.fetchSearchUnspscData("", this.state.pageNo);
          }
        } else {
          toast.error("No data selected", { autoClose: true });
        }
      }

      if (e.key.toLowerCase() === "s") {
        this.element.click();
      }

      if (e.key.toLowerCase() === "c") {
        this.clearClick();
      }
    }
    if (e.key === "Enter") {
      this.element.click();
    }
    if (e.key === "ArrowDown" && this.state.selectedRowIndex !== null) {
      const nextRowIndex = this.state.selectedRowIndex + 1;
      if (
        nextRowIndex >= 0 &&
        nextRowIndex < this.state.searchedUnspscData.length
      ) {
        const selectedRow = this.state.searchedUnspscData[nextRowIndex];
        this.handleUnspscDataRowClick("", selectedRow, nextRowIndex);
      }
    }
    if (e.key === "ArrowUp" && this.state.selectedRowIndex !== null) {
      const nextRowIndex = this.state.selectedRowIndex - 1;
      if (
        nextRowIndex >= 0 &&
        nextRowIndex < this.state.searchedUnspscData.length
      ) {
        const selectedRow = this.state.searchedUnspscData[nextRowIndex];
        this.handleUnspscDataRowClick("", selectedRow, nextRowIndex);
      }
    }
  };

  handleKeyPress = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  // #endregion Short Cut Keys

  // #region Select All textbox value
  handleInputClick = (refName, value) => () => {
    if (this.inputRefs[refName].current) {
      this.inputRefs[refName].current.select();
    }
    if (value) {
      let unspscValue = value.split("  ");
      this.setState({
        ...this.state,
        unspscCodeCategory: value,
        unspscCode: unspscValue[0],
        unspscCategory: unspscValue[1],
      });
      if (this.props.showUnspscModal) {
        this.props.AssignCategory(unspscValue);
      }
    }
  };
  // #endregion Select All textbox value

  // #region handle version select
  handleVersionChange = (e) => {
    this.setState({ selectedVersion: e.target.value });
  };
  // #endregion

  //  #region handle text box and radio and checkbox
  handleSearchInputs = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  handleDoNotContainChange = (e) => {
    this.setState({ chkDoNotContain: e.target.checked, selectedOption: "" });
  };
  // #endregion

  // #region Handle Segment change
  handleSearchSegmentChange = (e) => {
    if (this.state.selectedRowCode) {
      if (e.target.checked) {
        this.setState({
          searchSegment: e.target.checked,
          txtUnspsc1: this.state.selectedRowCode.substring(0, 2),
        });
        this.fetchSearchUnspscData(
          this.state.selectedRowCode.substring(0, 2),
          this.state.pageNo
        );
        return;
      }
      this.setState({ searchSegment: e.target.checked, txtUnspsc1: "" });
      this.fetchSearchUnspscData("", this.state.pageNo);
      return;
    }
    toast.error("Select Row First", { autoClose: true });
  };
  // #endregion

  // #region handle search btn
  searchClick = (e) => {
    e.preventDefault();
    this.clearSegmentData();
    this.fetchSearchUnspscData(this.state.txtUnspsc1, this.state.pageNo);
  };
  // #endregion

  // #region clear button
  clearClick = () => {
    this.setState({
      searchedUnspscData: [],
      txtKeyWord1: "",
      txtKeyWord2: "",
      txtUnspsc1: "",
      txtUnspsc2: "",
      txtUnspsc3: "",
      txtUnspsc4: "",
      searchSegment: false,
      segment: "",
      family: "",
      classData: "",
      commodity: "",
      categoryDefinition: "",
      unspscCodeCategory: "",
      unspscCode: "",
      unspscCategory: "",
      selectedUnspscRow: null,
      selectedRowCode: "",
      pageNo: 1,
      commodityData: {},
      selectedRowIndex: null,
    });
  };
  // #endregion

  // #region render Part
  render() {
    // #region Displaying empty Rows in Table
    const numberOfEmptyRows = 29; // Adjust as needed
    const emptyRows1 = Array(numberOfEmptyRows).fill({
      Code: "",
      Category: "",
    });
    // #endregion Displaying empty Rows in Table

    //  #region Defining state values
    const toolDelayTime = { hide: 450, show: 300 };
    const {
      isSelectFocused,
      selectedVersion,
      isLocked,
      txtKeyWord1,
      selectedOption,
      txtKeyWord2,
      chkDoNotContain,
      searchedUnspscData,
      txtUnspsc1,
      txtUnspsc2,
      txtUnspsc3,
      txtUnspsc4,
      currentPage,
      categoryDefinition,
      searchSegment,
      segment,
      family,
      classData,
      commodity,
      unspscCodeCategory,
      unspscCode,
      unspscCategory,
      pageNo,
      TotalCount,
      totalPageCount,
    } = this.state;
    // #endregion

    // #region Apply Row class to select
    const rowClass = (row, rowIndex) => {
      if (row.Code === this.state.selectedUnspscRow) {
        return "selected-row";
      }
      return "";
    };
    // #endregion Apply Row class to select

    // #region main return
    return (
      <div style={this.state.divStyle}>
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
          <Row
            className="unspsc-border unspscMainContent"
            style={{
              height: "100%",
            }}
          >
            <Col lg={5} sm={12} className="define-search">
              <div className="latest-search">
                <Row className="main-row d-flex align-items-center">
                  <Col lg={6} sm={12}>
                    <div className="unspsc-version-section">
                      <Form.Label className="unspsc-text ">
                        {" "}
                        Select <u>V</u>ersion{" "}
                      </Form.Label>
                      &nbsp;
                      <OverlayTrigger
                        className="unspsc-screens"
                        delay={toolDelayTime}
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip" className="unspsc-tooltip">
                            ALT + V
                          </Tooltip>
                        }
                      >
                        <label htmlFor="favcity" className="favicity-select">
                          <Form.Select
                            aria-label="Default select example"
                            className={
                              isSelectFocused
                                ? "focused-select unspsc-select"
                                : "unspsc-select"
                            }
                            ref={this.dropdownRef}
                            value={selectedVersion ? selectedVersion : ""}
                            onChange={this.handleVersionChange}
                            onFocus={this.handleSelectFocus}
                            onBlur={this.handleSelectBlur}
                            disabled={isLocked}
                          >
                            <option value="" hidden></option>
                            {this.state.unspcVersions.map((version) => (
                              <option
                                key={version.Version}
                                value={version.Version}
                              >
                                {version.Version}
                              </option>
                            ))}
                          </Form.Select>
                        </label>
                      </OverlayTrigger>
                    </div>
                  </Col>
                  <Col lg={2} sm={12} className="pro-left-padding">
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip">
                          ALT + L
                        </Tooltip>
                      }
                    >
                      <div className="check-col lock-col">
                        <input
                          type="checkbox"
                          className="unspsc-check"
                          id="checkbox"
                          ref={this.inputRefs.checkbox1}
                          checked={isLocked}
                          disabled={this.props.unspscVerion}
                          onChange={() => this.handleLockedChange("isLocked")}
                        />
                        &nbsp;
                        <span className="check-label lock-label">
                          {" "}
                          <u>L</u>ock{" "}
                        </span>
                      </div>
                    </OverlayTrigger>
                  </Col>
                  <Col lg={4} sm={12} className="main-version">
                    <div className="unspsc-version-section donload-btn-section">
                      {this.state.unspscLatestVersion && (
                        <span className="version-text">
                          {" "}
                          Latest_{this.state.unspscLatestVersion}{" "}
                        </span>
                      )}
                      <img
                        src={LatQueImg}
                        alt="query-img"
                        onClick={this.downloadUNSPSCHelpDocument}
                        className="lat-img"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="search-box-div d-flex">
                  <Row className="extra-row">
                    <Col lg={6} sm={12}>
                      <div className="unspsc-version-section">
                        <Form.Label className="unspsc-text unspsc-body">
                          {" "}
                          Keyword 1{" "}
                        </Form.Label>
                        &nbsp;
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip">
                              ALT + H
                            </Tooltip>
                          }
                        >
                          <Form.Control
                            type="text"
                            name="txtKeyWord1"
                            className="unspsc-input"
                            value={txtKeyWord1}
                            onChange={this.handleSearchInputs}
                            ref={this.inputRefs.txtKeyWord1}
                            onClick={this.handleInputClick("txtKeyWord1")}
                          />
                        </OverlayTrigger>
                      </div>
                      <div className="unspsc-version-section">
                        <Form.Label className="unspsc-text unspsc-body">
                          Keyword 2
                        </Form.Label>
                        &nbsp;
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip">
                              ALT + I
                            </Tooltip>
                          }
                        >
                          <Form.Control
                            type="text"
                            name="txtKeyWord2"
                            className="unspsc-input"
                            value={txtKeyWord2}
                            onChange={this.handleSearchInputs}
                            ref={this.inputRefs.txtKeyWord2}
                            onClick={this.handleInputClick("txtKeyWord2")}
                          />
                        </OverlayTrigger>
                      </div>
                      <div className="unspsc-version-section">
                        <Form.Label className="unspsc-text unspsc-body">
                          UNSPSC Code
                        </Form.Label>
                        &nbsp;
                        <div className="hyphen-input1">
                          <div className="hyphen-input1">
                            <OverlayTrigger
                              className="unspsc-screens"
                              delay={toolDelayTime}
                              placement="top"
                              overlay={
                                <Tooltip
                                  id="tooltip"
                                  className="unspsc-tooltip "
                                >
                                  ALT + B
                                </Tooltip>
                              }
                            >
                              <Form.Control
                                type="tel"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                maxLength={2}
                                className="unspsc-input"
                                name="txtUnspsc1"
                                value={txtUnspsc1}
                                onChange={this.handleSearchInputs}
                                ref={this.inputRefs.txtUnspsc1}
                                onClick={this.handleInputClick("txtUnspsc1")}
                              />
                            </OverlayTrigger>
                          </div>
                          <span className="hyphen-symbol"> - </span>
                          <div className="hyphen-input">
                            <OverlayTrigger
                              className="unspsc-screens"
                              delay={toolDelayTime}
                              placement="top"
                              overlay={
                                <Tooltip
                                  id="tooltip"
                                  className="unspsc-tooltip"
                                >
                                  ALT + X
                                </Tooltip>
                              }
                            >
                              <Form.Control
                                type="tel"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                maxLength={2}
                                className="unspsc-input"
                                name="txtUnspsc2"
                                value={txtUnspsc2}
                                onChange={this.handleSearchInputs}
                                ref={this.inputRefs.txtUnspsc2}
                                onClick={this.handleInputClick("txtUnspsc2")}
                              />
                            </OverlayTrigger>
                          </div>
                          <span className="hyphen-symbol"> - </span>
                          <div className="hyphen-input">
                            <OverlayTrigger
                              className="unspsc-screens"
                              delay={toolDelayTime}
                              placement="top"
                              overlay={
                                <Tooltip
                                  id="tooltip"
                                  className="unspsc-tooltip"
                                >
                                  ALT + Y
                                </Tooltip>
                              }
                            >
                              <Form.Control
                                type="tel"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                maxLength={2}
                                className="unspsc-input"
                                name="txtUnspsc3"
                                value={txtUnspsc3}
                                onChange={this.handleSearchInputs}
                                ref={this.inputRefs.txtUnspsc3}
                                onClick={this.handleInputClick("txtUnspsc3")}
                              />
                            </OverlayTrigger>
                          </div>
                          <span className="hyphen-symbol"> - </span>
                          <div className="hyphen-input">
                            <OverlayTrigger
                              className="unspsc-screens"
                              delay={toolDelayTime}
                              placement="top"
                              overlay={
                                <Tooltip
                                  id="tooltip"
                                  className="unspsc-tooltip"
                                >
                                  ALT + Z
                                </Tooltip>
                              }
                            >
                              <Form.Control
                                type="tel"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                maxLength={2}
                                className="unspsc-input"
                                name="txtUnspsc4"
                                value={txtUnspsc4}
                                onChange={this.handleSearchInputs}
                                ref={this.inputRefs.txtUnspsc4}
                                onClick={this.handleInputClick("txtUnspsc4")}
                              />
                            </OverlayTrigger>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={1} sm={12}></Col>
                    <Col lg={5} sm={12}>
                      <div className="unspsc-version-section">
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip ">
                              ALT + A
                            </Tooltip>
                          }
                        >
                          <div className="radio-sect">
                            <input
                              type="radio"
                              name="unspsc-radio"
                              value="AND"
                              ref={this.radio1Ref}
                              checked={selectedOption === "AND"}
                              onChange={() =>
                                this.setState({
                                  selectedOption: "AND",
                                  chkDoNotContain: false,
                                })
                              }
                            />
                            &nbsp;
                            <span className="radio-text">
                              {" "}
                              <u>A</u>ND{" "}
                            </span>
                          </div>
                        </OverlayTrigger>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip ">
                              ALT + O
                            </Tooltip>
                          }
                        >
                          <div className="radio-sect">
                            <input
                              type="radio"
                              name="unspsc-radio"
                              value="OR"
                              ref={this.radio2Ref}
                              checked={selectedOption === "OR"}
                              onChange={() =>
                                this.setState({
                                  selectedOption: "OR",
                                  chkDoNotContain: false,
                                })
                              }
                            />
                            &nbsp;
                            <span className="radio-text">
                              {" "}
                              <u>O</u>R{" "}
                            </span>
                          </div>
                        </OverlayTrigger>
                      </div>
                      <div className="unspsc-version-section">
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip ">
                              ALT + T
                            </Tooltip>
                          }
                        >
                          <div className="check-col">
                            <input
                              type="checkbox"
                              className="unspsc-check"
                              id="checkbox"
                              ref={this.inputRefs.chkDoNotContain}
                              checked={chkDoNotContain}
                              onChange={this.handleDoNotContainChange}
                            />
                            &nbsp;
                            <span className="check-label dont-label">
                              {" "}
                              Do No<u>t</u>&nbsp; Contain{" "}
                            </span>
                          </div>
                        </OverlayTrigger>
                      </div>
                      <div className="unspsc-version-section">
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip ">
                              ALT + S
                            </Tooltip>
                          }
                        >
                          <button
                            type="submit"
                            className="btn unspc-search-btn"
                            onClick={this.searchClick}
                            ref={(element) => (this.element = element)}
                            onKeyDown={this.handleKeyDown}
                          >
                            <img
                              src={SearchImg}
                              alt=""
                              className="pro-img"
                              ref={this.inputRefs.button1}
                            />
                          </button>
                        </OverlayTrigger>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <OverlayTrigger
                          className="unspsc-screens"
                          delay={toolDelayTime}
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip" className="unspsc-tooltip ">
                              ALT + C
                            </Tooltip>
                          }
                        >
                          <img
                            src={ClearImg}
                            alt=""
                            className="pro-img"
                            onClick={this.clearClick}
                            ref={this.inputRefs.button2}
                          />
                        </OverlayTrigger>
                      </div>
                    </Col>
                  </Row>
                </div>
                <Row className="extra-row search-result-div">
                  <Col lg={3}>
                    <Form.Label className="unspsc-text unspsc-head">
                      Search Result
                    </Form.Label>
                  </Col>
                  <Col lg={9}>
                    <div className="unspsc-version-section">
                      <div className="dot-div pro-left-padding">
                        <div className="dot-display dot-danger"></div>
                        <Form.Label className="dot-label danger-head">
                          Segment
                        </Form.Label>
                      </div>
                      <div className="dot-div">
                        <div className="dot-display dot-success"></div>
                        <Form.Label className="dot-label success-head">
                          Family
                        </Form.Label>
                      </div>
                      <div className="dot-div">
                        <div className="dot-display dot-class"></div>
                        <Form.Label className="dot-label Class-head">
                          Class
                        </Form.Label>
                      </div>
                      <div className="dot-div">
                        <div className="dot-display dot-commodity"></div>
                        <Form.Label className="dot-label commodity-head">
                          Commodity
                        </Form.Label>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="Unspc-custom-table">
                  <ToolkitProvider
                    keyField="id"
                    data={
                      searchedUnspscData.length === 0
                        ? emptyRows1
                        : searchedUnspscData
                    }
                    columns={columns}
                  >
                    {(props) => (
                      <div className="bootstrap-table-div">
                        <BootstrapTable
                          {...props.baseProps}
                          //   defaultSorted={defaultSorted}
                          ref={(rowElement) => (this.rowElement = rowElement)}
                          rowEvents={{
                            onClick: this.handleUnspscDataRowClick, // Attach the click event handler
                          }}
                          striped
                          rowClasses={
                            searchedUnspscData.length !== 0 ? rowClass : ""
                          }
                          hover
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                  <div
                    style={{
                      padding: "0 1px",
                      height: "7%",
                      background: "#bfd4f1 !important",
                    }}
                  >
                    <div
                      className="pagination-div"
                      style={{ height: "100%", backgroundColor: "#bfd4f1" }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "100%" }}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src="../../../Icons/step-backward.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() =>
                              this.handlePaginationPage(
                                this.state.pageNo === 1 ? "" : 1
                              )
                            }
                          />
                          <img
                            src="../../../Icons/left-arrow.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() =>
                              this.handlePaginationPage(
                                this.state.pageNo === 1
                                  ? ""
                                  : this.state.pageNo - 1
                              )
                            }
                          />

                          <div className="pagination-search">
                            Page: &nbsp;&nbsp;
                          </div>
                          <div className="pagination-search">
                            <input
                              type="text"
                              value={
                                searchedUnspscData.length === 0 &&
                                this.state.pageNo === 1
                                  ? 0
                                  : pageNo
                              }
                              className="unspsc-page-input"
                              onChange={this.onPageChange}
                            />
                          </div>
                          <div className="pagination-search">
                            of{" "}
                            {searchedUnspscData.length === 0 &&
                            (!this.state.pageNo || this.state.pageNo === 1)
                              ? 0
                              : totalPageCount}
                          </div>
                          <img
                            src="../../../Icons/right-arrow.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() =>
                              this.handlePaginationPage(
                                this.state.pageNo === this.state.totalPageCount
                                  ? ""
                                  : this.state.pageNo + 1
                              )
                            }
                          />
                          <img
                            src="../../../Icons/step-forward.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() =>
                              this.handlePaginationPage(
                                this.state.pageNo === this.state.totalPageCount
                                  ? ""
                                  : this.state.totalPageCount
                              )
                            }
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-end"
                        style={{ width: "100%" }}
                      >
                        {searchedUnspscData.length === 0 &&
                        (!this.state.pageNo || this.state.pageNo === 1) ? (
                          ""
                        ) : (
                          <p className="p-0 m-0">
                            Displaying {10000 * (currentPage - 1) + 1} -{" "}
                            {10000 * (currentPage - 1) +
                              searchedUnspscData.length}{" "}
                            of {TotalCount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Row className="segment-select">
                  <Col lg={6}>
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip">
                          ALT + W
                        </Tooltip>
                      }
                    >
                      <div className="check-col">
                        <input
                          type="checkbox"
                          className="unspsc-check"
                          id="checkbox"
                          checked={searchSegment}
                          onChange={this.handleSearchSegmentChange}
                          ref={this.inputRefs.chkSelectSegment}
                          disabled={searchedUnspscData.length === 0}
                        />
                        &nbsp;
                        <span className="check-label">
                          {" "}
                          Search in Selected Segment{" "}
                        </span>
                      </div>
                    </OverlayTrigger>
                  </Col>
                  <Col lg={6}>
                    {searchedUnspscData.length !== 0 && (
                      <span className="check-col check-label count-label">
                        {" "}
                        Count:{TotalCount}{" "}
                      </span>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              lg={7}
              sm={12}
              className="cat-defination pro-right-padding pl-0"
            >
              <div className="definaion-div">
                <h3 className="span-cat">Category Definition</h3>
                <p className="pagination-text">{categoryDefinition}</p>
              </div>
              <div className="segmment-section">
                <div className="extra-row segments-input-div">
                  <div className="text-div">
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={{ hide: 450, show: 200 }}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip ">
                          ALT + J
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="segment"
                        className="ladder-input danger-search"
                        value={segment}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.segment}
                        onClick={this.handleInputClick("segment", segment)}
                        onFocus={this.handleInputClick("segment", segment)}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                    <div className="vert-line danger-vert-line"></div>
                    <div className="horiz-line danger-horiz-line"></div>
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip">
                          ALT + K
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="family"
                        className="ladder-input success-search"
                        value={family}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.family}
                        onClick={this.handleInputClick("family", family)}
                        onFocus={this.handleInputClick("family", family)}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                    <div className="vert-line success-vert-line"></div>
                    <div className="horiz-line success-horiz-line"></div>
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip ">
                          ALT + M
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="classData"
                        className="ladder-input Class-search"
                        value={classData}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.classData}
                        onClick={this.handleInputClick("classData", classData)}
                        onFocus={this.handleInputClick("classData", classData)}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                    <div className="vert-line Class-vert-line"></div>
                    <div className="horiz-line Class-horiz-line"></div>
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip ">
                          ALT + N
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="commodity"
                        className="ladder-input default-search"
                        value={commodity}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.commodity}
                        onClick={this.handleInputClick("commodity", commodity)}
                        onFocus={this.handleInputClick("commodity", commodity)}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                </div>
                <Row className="extra-row category-input-div">
                  <div className="text-div">
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip ">
                          ALT + P
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="unspscCodeCategory"
                        className="ladder-input other-search category-text"
                        value={unspscCodeCategory}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.unspscCodeCategory}
                        onClick={this.handleInputClick("unspscCodeCategory")}
                        onFocus={this.handleInputClick("unspscCodeCategory")}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                  <div className="input-part unsp-cateory-fields">
                    <OverlayTrigger
                      className="unspsc-screens"
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip ">
                          ALT + Q
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="unspscCode"
                        className="unspsc-input segment-name category-text"
                        value={unspscCode}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.unspscCode}
                        onClick={this.handleInputClick("unspscCode")}
                        onFocus={this.handleInputClick("unspscCode")}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                    <span className="hyphen-symbol"> - </span>
                    <OverlayTrigger
                      className=""
                      delay={toolDelayTime}
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip" className="unspsc-tooltip ">
                          ALT + G
                        </Tooltip>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="unspscCategory"
                        className="unspsc-sea category-text"
                        value={unspscCategory}
                        onChange={this.handleSearchInputs}
                        ref={this.inputRefs.unspscCategory}
                        onClick={this.handleInputClick("unspscCategory")}
                        onFocus={this.handleInputClick("unspscCategory")}
                        onKeyPress={this.handleKeyPress}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                </Row>
              </div>
            </Col>
          </Row>
        </LoadingOverlay>
      </div>
    );
    // #endregion
  }
  // #endregion
}
