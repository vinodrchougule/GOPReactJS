import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { BarLoader } from "react-spinners";
import LoadingOverlay from "react-loading-overlay";
import helper from "../../helpers/helpers";
import { Col, Form, Row } from "react-bootstrap";
import "./SnomedSearch.css";
import BootstrapTable from "react-bootstrap-table-next";
import snomedsearchService from "../../services/snomedsearch.service";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import LatQueImg from "../../assets/icons/quest-icon.png";
import { toast } from "react-toastify";
toast.configure();

// #region Table Headers
const columns = [
  {
    dataField: "Active",
    text: "Active",
    style: {
      width: "80px",
    },
  },
  {
    dataField: "IsFSN",
    text: "Is FSN?",
    style: {
      width: "50px",
      textAlign: "center",
    },
    headerStyle: {
      textAlign: "center",
    },
    align: "center",
    sort: true,
  },
  {
    dataField: "ConceptId",
    text: "Concept Id",
    style: {
      width: "100px",
    },
    sort: true,
  },
  {
    dataField: "Term",
    text: "Term",
  },
];

const defaultSorted = [
  {
    dataField: "ConceptId",
    order: "desc",
  },
];

const synonymsColumns = [
  {
    dataField: "ConceptId",
    text: "Concept Id",
    style: {
      width: "100px",
    },
  },
  {
    dataField: "Term",
    text: "Term",
    sort: true,
  },
];

const parentColumns = [
  {
    dataField: "DestinationID",
    text: "Destination Id",
    style: {
      width: "100px",
    },
  },
  {
    dataField: "DestinationIDName",
    text: "Destination Id Name",
    sort: true,
  },
];

const childrenColumns = [
  {
    dataField: "SourceId",
    text: "Source Id",
    style: {
      width: "100px",
    },
  },
  {
    dataField: "SourceIDName",
    text: "Source Id Name",
    sort: true,
  },
];
// #endregion Table Headers

class SnomedSearch extends Component {
  constructor(props) {
    super(props);
    //#region Initialize state
    this.state = {
      filteredData: [],
      snomedSearchData: [],
      snomedFilterConceptData: [],
      snomedSearchDataLength: 0,
      snomedSynonymsData: [],
      snomedFilterSynonymsData: [],
      synonymDataLength: 0,
      snomedParentData: [],
      snomedFilterParentData: [],
      parentDataLength: 0,
      snomedChildrenData: [],
      snomedFilterChildrenData: [],
      childrenDataLength: 0,
      selectedRow: null,
      selectedSynonymRow: null,
      selectedParentRow: null,
      selectedChildrenRow: null,
      snomedResultString: "",
      searchText1: "",
      searchText2: "",
      searchText3: "",
      searchText4: "",
      searhedValue: "",
      searchedParentValue: "",
      searchedSynonymValue: "",
      searchedChildrenValue: "",
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      emptyRows: 0,
      loading: false,
    };
    //#endregion
  }

  // #region onloadFunctions
  componentDidMount() {
    let numberOfEmptyRows = 10;
    if (this.state.windowWidth > 1366) {
      numberOfEmptyRows = 15;
    }
    this.setState({
      emptyRows: numberOfEmptyRows,
    });
    window.addEventListener("resize", this.updateWindowHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowHeight);
  }

  updateWindowHeight = () => {
    let numberOfEmptyRows = 10;
    if (window.innerWidth > 1366) {
      return (numberOfEmptyRows = 20);
    }
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      emptyRows: numberOfEmptyRows,
    });
  };
  // #endregion onloadFunctions

  //#region  Download Snomed searcher Help Guide
  downloadSnomedSearcherHelpDocument() {
    snomedsearchService
      .DownloadSnomedSearcherHelpFile()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "UserGuideSNOMEDSearcher.pptx");
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  // #region Search Filter Inputs Handle
  txtSearchFilter = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  // #endregion Search Filter Inputs Handle
  clearStateData = () => {
    this.setState({
      snomedSynonymsData: [],
      snomedFilterSynonymsData: [],
      synonymDataLength: 0,
      snomedParentData: [],
      snomedFilterParentData: [],
      parentDataLength: 0,
      snomedChildrenData: [],
      snomedFilterChildrenData: [],
      childrenDataLength: 0,
      selectedRow: null,
      selectedSynonymRow: null,
      selectedParentRow: null,
      selectedChildrenRow: null,
      snomedResultString: "",
    });
  };

  // #region Search Filter Clear Inputs
  clearFilterSearch = (divId) => {
    this.setState({
      [divId]: "",
    });
    this.clearStateData();
    this.fetchSnomedSearchData(divId);
  };
  // #endregion Search Filter Clear Inputs

  // #region Clear the page
  clearAllFilter = () => {
    window.location.reload();
  };
  // #endregion Clear the page

  // #region onclick Search function
  searchConceptData = (e) => {
    e.preventDefault();
    this.clearStateData();
    this.fetchSnomedSearchData();
  };

  fetchSnomedSearchData(clearId) {
    let searchData = {};
    if (!clearId) {
      searchData = {
        SearchText1: this.state.searchText1,
        SearchText2: this.state.searchText2,
        SearchText3: this.state.searchText3,
        SearchText4: this.state.searchText4,
      };
    } else {
      if (clearId === "searchText1") {
        searchData = {
          SearchText1: "",
          SearchText2: this.state.searchText2,
          SearchText3: this.state.searchText3,
          SearchText4: this.state.searchText4,
        };
      } else if (clearId === "searchText2") {
        searchData = {
          SearchText1: this.state.searchText1,
          SearchText2: "",
          SearchText3: this.state.searchText3,
          SearchText4: this.state.searchText4,
        };
      } else if (clearId === "searchText3") {
        searchData = {
          SearchText1: this.state.searchText1,
          SearchText2: this.state.searchText2,
          SearchText3: "",
          SearchText4: this.state.searchText4,
        };
      } else if (clearId === "searchText4") {
        searchData = {
          SearchText1: this.state.searchText1,
          SearchText2: this.state.searchText2,
          SearchText3: this.state.searchText3,
          SearchText4: "",
        };
      }
    }

    this.setState({
      spinnerMessage: "Please wait while fetching the data...!",
      loading: true,
    });
    if (
      searchData.SearchText1 ||
      searchData.SearchText2 ||
      searchData.SearchText3 ||
      searchData.SearchText4
    ) {
      snomedsearchService
        .serchSnomedData(searchData)
        .then((resp) => {
          if (resp.data.length === 0) {
            this.setState({
              ...this.state,
              snomedSearchData: [],
              snomedSynonymsData: [],
              snomedParentData: [],
              snomedChildrenData: [],
              snomedResultString: "",
              snomedSearchDataLength: 0,
              synonymDataLength: 0,
              parentDataLength: 0,
              childrenDataLength: 0,
              loading: false,
            });
            toast.error("No data Found", { autoClose: true });
            return;
          }
          this.setState({
            ...this.state,
            snomedSearchData: resp.data,
            snomedSearchDataLength: resp.data.length,
            synonymDataLength: 0,
            parentDataLength: 0,
            childrenDataLength: 0,
            searchedParentValue: "",
            searchedSynonymValue: "",
            searchedChildrenValue: "",
            loading: false,
          });
          this.handleConceptClearClick();
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          toast.error(error.response.data.Message, { autoClose: false });
        });
    } else {
      this.setState({
        snomedSearchData: [],
        snomedSynonymsData: [],
        snomedParentData: [],
        snomedChildrenData: [],
        snomedSearchDataLength: 0,
        synonymDataLength: 0,
        parentDataLength: 0,
        childrenDataLength: 0,
        loading: false,
      });
    }
  }

  // #endregion onclick Search function

  // #region Handle clear table search
  handleConceptClearClick = () => {
    this.setState({ searhedValue: "" });
    this.handleSearch("");
  };
  handleParentClearClick = () => {
    this.setState({ searchedParentValue: "" });
    this.handleParentSearch("");
  };
  handleSynonymsClearClick = () => {
    this.setState({ searchedSynonymValue: "" });
    this.handleSynonymSearch("");
  };
  handleChildrenClearClick = () => {
    this.setState({ searchedChildrenValue: "" });
    this.handleChildrenSearch("");
  };
  // #endregion Handle clear table search

  // #region Handle Row Double Click
  handleRowDoubleClick = (row) => {
    if (row.ConceptId && row.Term) {
      let snomedResultString =
        "Concept ID : " + row.ConceptId + " And Term : " + row.Term;
      this.setState({
        spinnerMessage: "Please wait while fetching the data...!",
        loading: true,
      });
      this.setState({ snomedResultString: snomedResultString });
      setTimeout(() => {
        this.fetchSnomedSynonymsData(row.ConceptId);
        this.fetchSnomedParentData(row.ConceptId);
        this.fetchSnomedChildrenData(row.ConceptId);
      }, 500);
    }
  };
  // #endregion Handle Row Double Click

  // #region Handle rowclick
  handleRowConceptClick = (row, rowIndex, e) => {
    this.setState({ selectedRow: e });
  };
  handleRowSynonymClick = (row, rowIndex, e) => {
    this.setState({ selectedSynonymRow: e });
  };
  handleRowParentClick = (row, rowIndex, e) => {
    this.setState({ selectedParentRow: e });
  };
  handleRowChildrenClick = (row, rowIndex, e) => {
    this.setState({ selectedChildrenRow: e });
  };
  // #endregion Handle rowclick

  // #region fetch functions for synonyms, parent and children
  fetchSnomedSynonymsData(ConceptId) {
    snomedsearchService
      .snomedSynonymsData(ConceptId)
      .then((resp) => {
        this.setState({
          ...this.state,
          snomedSynonymsData: resp.data,
          synonymDataLength: resp.data.length,
        });
        this.handleSynonymsClearClick();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  fetchSnomedParentData(ConceptId) {
    snomedsearchService
      .snomedParentData(ConceptId)
      .then((resp) => {
        this.setState({
          ...this.state,
          snomedParentData: resp.data,
          parentDataLength: resp.data.length,
        });
        this.handleParentClearClick();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  fetchSnomedChildrenData(ConceptId) {
    snomedsearchService
      .snomedChildrenData(ConceptId)
      .then((resp) => {
        this.setState({
          ...this.state,
          snomedChildrenData: resp.data,
          childrenDataLength: resp.data.length,
          loading: false,
        });
        this.handleChildrenClearClick();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }
  // #endregion fetch functions for synonyms, parent and children

  // #region handle stable data filter for synonyms, parent and children
  handleSearch = (searchText) => {
    const filteredData = this.filterData(
      searchText,
      this.state.snomedSearchData,
      columns
    );
    this.setState({
      ...this.state,
      snomedFilterConceptData: filteredData,
      searhedValue: searchText,
      snomedSearchDataLength: filteredData.length,
    });
  };

  handleParentSearch = (searchText) => {
    const filteredData = this.filterData(
      searchText,
      this.state.snomedParentData,
      parentColumns
    );

    this.setState({
      ...this.state,
      snomedFilterParentData: filteredData,
      searchedParentValue: searchText,
      parentDataLength: filteredData.length,
    });
  };

  handleSynonymSearch = (searchText) => {
    const filteredData = this.filterData(
      searchText,
      this.state.snomedSynonymsData,
      synonymsColumns
    );

    this.setState({
      ...this.state,
      snomedFilterSynonymsData: filteredData,
      searchedSynonymValue: searchText,
      synonymDataLength: filteredData.length,
    });
  };

  handleChildrenSearch = (searchText) => {
    const filteredData = this.filterData(
      searchText,
      this.state.snomedChildrenData,
      childrenColumns
    );

    this.setState({
      ...this.state,
      snomedFilterChildrenData: filteredData,
      searchedChildrenValue: searchText,
      childrenDataLength: filteredData.length,
    });
  };
  // #endregion handle table data filter for synonyms, parent and children

  // #region Main filter function for synonyms, parent and children
  filterData = (searchText, dataSearch, columns) => {
    if (!searchText) {
      return dataSearch; // Return all data if search text is empty
    }

    const lowerSearchText = searchText.toLowerCase();
    return dataSearch.filter((snomedData) =>
      columns.some((column) =>
        String(snomedData[column.dataField])
          .toLowerCase()
          .includes(lowerSearchText)
      )
    );
  };
  // #endregion Main filter function for synonyms, parent and children

  render() {
    // #region displaying empty rows
    let numberOfEmptyRows = this.state.emptyRows;
    const emptyRows1 = Array(numberOfEmptyRows).fill({
      Active: "",
      ConceptId: "",
      Term: "",
    });
    const parentEmpty = Array(numberOfEmptyRows).fill({
      DestinationID: "",
      DestinationIDName: "",
    });
    const childEmpty = Array(numberOfEmptyRows).fill({
      SourceId: "",
      SourceIdName: "",
    });
    // #endregion displaying empty rows

    // #region RowEvent function
    const rowEvents = {
      onDoubleClick: (e, row) => {
        this.handleRowDoubleClick(row, e);
      },
      onClick: this.handleRowConceptClick,
    };
    // #endregion RowEvent function

    // #region Apply Row class to select
    const getRowClass = (rowIndex, selectedRow) => {
      if (rowIndex === selectedRow) {
        return "selected-row";
      }
      return "";
    };
    // #endregion Apply Row class to select

    //#region return JSX
    return (
      <div className="main-data">
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
          <div
            className="az-content az-content-dashboard snomed-main-div"
            style={{
              height: `${
                this.state.windowWidth < 768
                  ? "100%"
                  : this.state.windowHeight - this.state.windowHeight * 0.09
              }px`,
            }}
          >
            <div className="container-fluid snomed-container">
              <div className="az-content-body snomed-content-body">
                <div className="snomed-header-div">
                  <h2 className="az-dashboard-title snomed-header">
                    SNOMED Searcher
                  </h2>
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={this.downloadSnomedSearcherHelpDocument}
                    className="snomed-lat-img"
                  />
                </div>
                <Row className="snomed-tabledata-section">
                  <Col md={6} className="snomed-table-left">
                    <Form style={{ height: "10%" }}>
                      <Row className="search-filter-row">
                        <Col md={2} className="search-col">
                          <div className="search-header">
                            <b>Search</b>
                          </div>
                        </Col>
                        <Col md={2} className="search-col">
                          <button
                            type="button"
                            className="btn btn-info btn-custom-seacrh"
                            onClick={this.clearAllFilter}
                          >
                            Clear All Search
                          </button>
                        </Col>
                        <Col md={3} className="search-col">
                          <div>
                            <div className="d-flex input-search">
                              <input
                                name="searchText1"
                                type="text"
                                value={this.state.searchText1}
                                onChange={this.txtSearchFilter}
                              />
                              <div
                                id="searchText1"
                                className="input-clear"
                                onClick={() =>
                                  this.clearFilterSearch("searchText1")
                                }
                              >
                                X
                              </div>
                            </div>
                            <div className="d-flex input-search">
                              <input
                                type="text"
                                name="searchText2"
                                value={this.state.searchText2}
                                onChange={this.txtSearchFilter}
                              />
                              <div
                                className="input-clear"
                                onClick={() =>
                                  this.clearFilterSearch("searchText2")
                                }
                              >
                                X
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={3} className="search-col">
                          <div>
                            <div className="d-flex input-search">
                              <input
                                name="searchText3"
                                type="text"
                                value={this.state.searchText3}
                                onChange={this.txtSearchFilter}
                              />
                              <div
                                className="input-clear"
                                onClick={() =>
                                  this.clearFilterSearch("searchText3")
                                }
                              >
                                X
                              </div>
                            </div>
                            <div className="d-flex input-search">
                              <input
                                name="searchText4"
                                type="text"
                                value={this.state.searchText4}
                                onChange={this.txtSearchFilter}
                              />
                              <div
                                className="input-clear"
                                onClick={() =>
                                  this.clearFilterSearch("searchText4")
                                }
                              >
                                X
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={2} className="search-col">
                          <button
                            type="submit"
                            className="btn btn-info btn-custom-seacrh default-search-btn"
                            onClick={this.searchConceptData}
                          >
                            Search
                          </button>
                        </Col>
                      </Row>
                    </Form>
                    <div className="custom-table">
                      <div className="table-header">
                        <b>Concepts</b>
                      </div>
                      <ToolkitProvider
                        keyField="id"
                        data={
                          this.state.snomedSearchData.length === 0
                            ? emptyRows1
                            : this.state.searhedValue
                            ? this.state.snomedFilterConceptData
                            : this.state.snomedSearchData
                        }
                        columns={columns}
                        search
                      >
                        {(props) => (
                          <div className="bootstrap-table-div">
                            <BootstrapTable
                              {...props.baseProps}
                              defaultSorted={defaultSorted}
                              rowEvents={rowEvents}
                              striped
                              rowClasses={(row, rowIndex) =>
                                getRowClass(rowIndex, this.state.selectedRow)
                              }
                              hover
                            />
                            {this.state.snomedSearchDataLength === 0 &&
                            !this.state.searhedValue ? (
                              ""
                            ) : (
                              <div className="pagination-div">
                                <span
                                  className="pagination-total-data"
                                  style={{ width: "15%" }}
                                >
                                  Rows: {this.state.snomedSearchDataLength}
                                </span>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ width: "85%" }}
                                >
                                  <div className="pr-1 pl-3">
                                    <b>Search:</b>&nbsp;
                                  </div>
                                  <div className="pagination-search">
                                    <input
                                      type="text"
                                      value={this.state.searhedValue}
                                      className="search-text-input"
                                      onChange={(e) =>
                                        this.handleSearch(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div>
                                    <button
                                      onClick={this.handleConceptClearClick}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                    <div className="note-div">
                      <p className="note-text">
                        Note: double click on row to view Synonyms, Parent and,
                        Children
                      </p>
                    </div>
                    <div className="custom-table bottom-table">
                      <div className="table-header">
                        <b>Parent</b>
                      </div>
                      <ToolkitProvider
                        keyField="id"
                        data={
                          this.state.snomedParentData.length === 0
                            ? parentEmpty
                            : this.state.searchedParentValue
                            ? this.state.snomedFilterParentData
                            : this.state.snomedParentData
                        }
                        columns={parentColumns}
                        search
                      >
                        {(props) => (
                          <div className="bootstrap-table-div">
                            <BootstrapTable
                              keyField="id1"
                              {...props.baseProps}
                              defaultSorted={defaultSorted}
                              striped
                              rowEvents={{
                                onClick: this.handleRowParentClick, // Attach the click event handler
                              }}
                              rowClasses={(row, rowIndex) =>
                                getRowClass(
                                  rowIndex,
                                  this.state.selectedParentRow
                                )
                              }
                              hover
                            />
                            {this.state.parentDataLength === 0 &&
                            !this.state.searchedParentValue ? (
                              ""
                            ) : (
                              <div className="pagination-div">
                                <span
                                  className="pagination-total-data"
                                  style={{ width: "15%" }}
                                >
                                  Rows: {this.state.parentDataLength}
                                </span>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ width: "85%" }}
                                >
                                  <div className="pr-1 pl-3">
                                    <b>Search:</b>&nbsp;
                                  </div>
                                  <div className="pagination-search">
                                    <input
                                      type="text"
                                      value={this.state.searchedParentValue}
                                      className="search-text-input"
                                      onChange={(e) =>
                                        this.handleParentSearch(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div>
                                    <button
                                      onClick={this.handleParentClearClick}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                  </Col>
                  <Col
                    md={6}
                    className="snomed-table-right"
                    style={{ padding: "0 60px" }}
                  >
                    <div style={{ height: "10%" }}>
                      <div className="search-filter-row result-row">
                        <div className="d-flex w-100">
                          <div className="result-header">
                            <b>Showing Result For:</b>&nbsp;
                          </div>
                          <div className="flex-grow-1">
                            <input
                              type="text"
                              name="snomedResultString"
                              className="filter-search-input"
                              value={this.state.snomedResultString}
                              onChange={this.txtSearchFilter}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="custom-table">
                      <div className="table-header">
                        <b>Synonyms</b>
                      </div>
                      <ToolkitProvider
                        keyField="id"
                        data={
                          this.state.snomedSynonymsData.length === 0
                            ? emptyRows1
                            : this.state.searchedSynonymValue
                            ? this.state.snomedFilterSynonymsData
                            : this.state.snomedSynonymsData
                        }
                        columns={synonymsColumns}
                        search
                      >
                        {(props) => (
                          <div className="bootstrap-table-div">
                            <BootstrapTable
                              keyField="id2"
                              {...props.baseProps}
                              defaultSorted={defaultSorted}
                              striped
                              hover
                              rowEvents={{
                                onClick: this.handleRowSynonymClick,
                              }}
                              rowClasses={(row, rowIndex) =>
                                getRowClass(
                                  rowIndex,
                                  this.state.selectedSynonymRow
                                )
                              }
                            />
                            {this.state.synonymDataLength === 0 &&
                            !this.state.searchedSynonymValue ? (
                              ""
                            ) : (
                              <div className="pagination-div">
                                <span
                                  className="pagination-total-data"
                                  style={{ width: "20%" }}
                                >
                                  Rows: {this.state.synonymDataLength}
                                </span>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ width: "80%" }}
                                >
                                  <div className="pr-1 pl-3">
                                    <b>Search:</b>&nbsp;
                                  </div>
                                  <div className="pagination-search">
                                    <input
                                      type="text"
                                      value={this.state.searchedSynonymValue}
                                      className="search-text-input"
                                      onChange={(e) =>
                                        this.handleSynonymSearch(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div>
                                    <button
                                      onClick={this.handleSynonymsClearClick}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                    <div className="note-div"></div>
                    <div className="custom-table bottom-table">
                      <div className="table-header">
                        <b>Children</b>
                      </div>
                      <ToolkitProvider
                        keyField="id"
                        data={
                          this.state.snomedChildrenData.length === 0
                            ? childEmpty
                            : this.state.searchedChildrenValue
                            ? this.state.snomedFilterChildrenData
                            : this.state.snomedChildrenData
                        }
                        columns={childrenColumns}
                        search
                      >
                        {(props) => (
                          <div className="bootstrap-table-div">
                            <BootstrapTable
                              keyField="id3"
                              {...props.baseProps}
                              defaultSorted={defaultSorted}
                              rowEvents={{
                                onClick: this.handleRowChildrenClick, // Attach the click event handler
                              }}
                              rowClasses={(row, rowIndex) =>
                                getRowClass(
                                  rowIndex,
                                  this.state.selectedChildrenRow
                                )
                              }
                              striped
                              hover
                            />
                            {this.state.childrenDataLength === 0 &&
                            !this.state.searchedChildrenValue ? (
                              ""
                            ) : (
                              <div className="pagination-div">
                                <span
                                  className="pagination-total-data"
                                  style={{ width: "20%" }}
                                >
                                  Rows: {this.state.childrenDataLength}
                                </span>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ width: "80%" }}
                                >
                                  <div className="pr-1 pl-3">
                                    <b>Search:</b>&nbsp;
                                  </div>
                                  <div className="pagination-search">
                                    <input
                                      type="text"
                                      value={this.state.searchedChildrenValue}
                                      className="search-text-input"
                                      onChange={(e) =>
                                        this.handleChildrenSearch(
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <button
                                      onClick={this.handleChildrenClearClick}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
    //#endregion
  }
}

export default withRouter(SnomedSearch);
