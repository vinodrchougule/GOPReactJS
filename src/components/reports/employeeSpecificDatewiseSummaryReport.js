import React, { Component } from "react";
import employeeSpecificReportService from "../../services/employeeSpecificReport.service";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import helper from "../../helpers/helpers";
import tableFunctions from "../../helpers/tableFunctions";
import Moment from "moment";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class employeeSpecificDatewiseSummaryReport extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.displaySortingFields = this.displaySortingFields.bind(this);
    this.displayFilteringField = this.displayFilteringField.bind(this);
    this.onChangefilterValue = this.onChangefilterValue.bind(this);
    this.onChangeColumn = this.onChangeColumn.bind(this);
    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.sortData = this.sortData.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.exportEmployeeSpecificSummaryReportToExcel =
      this.exportEmployeeSpecificSummaryReportToExcel.bind(this);

    //#region State Variables
    this.state = {
      employeeSpecificSummaryReport: [],
      loading: false,
      spinnerMessage: "",
      index: 30,
      position: 0,
      columns: [],
      isToShowSortingFields: false,
      isToShowFilteringField: true,
      selectedColumn: "",
      selectedSort: "",
      filteredArray: [],
      filterValue: "",
      employeeSpecificDetailsReport: [],
      employeeSpecificDetailsReportExpanded: [],
    };
    //#endregion
  }

  //#region page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    this.fetchEmployeeSpecificSummaryReport();
  }
  //#endregion

  //#region fetching Employee Specific Summary Report from Web API
  fetchEmployeeSpecificSummaryReport() {
    this.setState({
      spinnerMessage:
        "Please wait while fetching Employee Specific Summary Report...",
      loading: true,
    });

    employeeSpecificReportService
      .readEmployeeSpecificSummaryReport(
        this.props.employee,
        this.props.fromDate,
        this.props.toDate
      )
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          ProductionOrQCCompletedOn: Moment(
            obj.ProductionOrQCCompletedOn
          ).format("DD-MMM-yyyy"),
        }));

        if (response.data.length === 0) {
          toast.error("No Data Found!!");
        }
        this.setState({
          employeeSpecificSummaryReport: formattedArray,
          isToShowFilteringField: true,
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Export Employee Specific Report to Excel
  exportEmployeeSpecificSummaryReportToExcel() {
    this.setState({
      spinnerMessage:
        "Please wait while exporting Employee Specific Summary Report to Excel...",
      loading: true,
    });

    employeeSpecificReportService
      .exportEmployeeSpecificSummaryReportToExcel(
        this.props.employee,
        this.props.fromDate,
        this.props.toDate,
        helper.getUser()
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "Employee Specific Summary Report.xlsx"
        );
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Filter Functions
  //#region Display Filtering Field
  displayFilteringField() {
    this.setState((previousState) => ({
      isToShowFilteringField: !previousState.isToShowFilteringField,
      filterValue: "",
      isToShowSortingFields: false,
    }));
  }
  //#endregion

  //#region on change filter value
  onChangefilterValue(e) {
    this.setState({ filterValue: e.target.value }, () =>
      this.getFilteredRows()
    );
  }
  //#endregion

  //#region get filtered rows
  getFilteredRows() {
    const filteredArray = tableFunctions.filterArray(
      this.state.employeeSpecificSummaryReport,
      this.state.filterValue
    );

    this.setState({ filteredArray: filteredArray });
  }
  //#endregion

  //#region Clear Search
  clearSearch() {
    this.setState({
      filterValue: "",
    });
  }
  //#endregion
  //#endregion

  //#region  Sort Functions
  //#region Display Sorting Fields
  displaySortingFields() {
    let columns = Object.keys(this.state.employeeSpecificSummaryReport[0]);

    this.setState((previousState) => ({
      isToShowSortingFields: !previousState.isToShowSortingFields,
      selectedColumn: "",
      selectedSort: "",
      columns: columns,
      filterValue: "",
      isToShowFilteringField: false,
    }));
  }
  //#endregion

  //#region Selecting the sort column
  onChangeColumn(e) {
    this.setState({
      selectedColumn: e.target.value,
      selectedSort: "",
    });
  }
  //#endregion

  //#region On Change Sort
  onChangeSortOrder(e) {
    this.setState(
      {
        selectedSort: e.target.value,
      },
      () => this.sortData()
    );
  }
  //#endregion

  //#region Sort Data based on column and order
  sortData() {
    let sortedArray = [];
    let column =
      this.state.selectedColumn !== "" ? this.state.selectedColumn : "SlNo";
    const selectedSort =
      this.state.selectedSort !== "" ? this.state.selectedSort : "ascending";
    let numberColumns = ["SlNo", "ProductiveHours"];

    let dateColumns = ["ProductionOrQCCompletedOn"];

    sortedArray = tableFunctions.sortData(
      this.state.employeeSpecificSummaryReport,
      column,
      selectedSort,
      numberColumns,
      dateColumns
    );

    this.setState({ employeeSpecificSummaryReport: sortedArray });
  }
  //#endregion

  //#region  Clear Sort
  clearSort() {
    this.setState(
      {
        selectedColumn: "",
        selectedSort: "",
      },
      () => this.sortData()
    );
  }
  //#endregion
  //#endregion

  //#region Handle Scroll
  handleScroll(e) {
    var currentHeight = e.currentTarget.scrollTop;
    var maxScrollPosition =
      e.currentTarget.scrollHeight - e.currentTarget.clientHeight;

    this.setState({ position: currentHeight });

    if ((currentHeight / maxScrollPosition) * 100 > 90) {
      let curIndex = this.state.index + 20;
      this.setState({ index: curIndex });
    }
  }
  //#endregion

  //#region Scroll to Top
  scrollToTop = () => {
    this.divScrollRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  //#endregion

  //#region fetch Employee Specific Details Report
  fetchEmployeeSpecificDetailsReport = (row, isExpand, rowIndex, e) => {
    if (!isExpand) {
      this.setState(() => ({
        employeeSpecificDetailsReportExpanded: [],
        loading: false,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Employee Specific Details...",
      loading: true,
    });

    employeeSpecificReportService
      .readEmployeeSpecificDetailsReport(
        this.props.employee,
        row.ProductionOrQCCompletedOn,
        row.ProductionOrQCCompletedOn
      )
      .then((response) => {
        let formattedArray = response.data.map((obj) => ({
          ...obj,
          ProductionOrQCCompletedOn: Moment(
            obj.ProductionOrQCCompletedOn
          ).format("DD-MMM-yyyy"),
        }));

        this.setState({
          employeeSpecificDetailsReport: formattedArray,
          employeeSpecificDetailsReportExpanded: [row.SlNo],
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  render() {
    const data = this.state.employeeSpecificSummaryReport.slice(
      0,
      this.state.index
    );
    const filteredData = this.state.filteredArray.slice(0, this.state.index);
    const employeeSpecificSummaryReportLength =
      this.state.employeeSpecificSummaryReport.length;

    //#region Employee Specific Summary Report Columns
    const employeeSpecificSummaryReportColumns = [
      {
        dataField: "SlNo",
        text: "Sl No",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductionOrQCCompletedOn",
        text: "Date",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductiveHours",
        text: "Productive Hours",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
    ];
    //#endregion

    //#region Employee Specifc Details Report Columns
    const employeeSpecificDetailsReportColumns = [
      {
        dataField: "SlNo",
        align: "center",
        text: "Sl No",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "CustomerCode",
        align: "center",
        text: "Cus Code",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProjectCode",
        align: "center",
        text: "Proj Code",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "BatchNo",
        align: "center",
        text: "Batch No",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "Activity",
        text: "Activity",
        title: true,
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductionOrQCCompletedOn",
        text: "Prod. or QC Completed On",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductionCompletedCount",
        text: "Prod. Completed Count",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductionTarget",
        text: "Prod. Target",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductionProductiveHours",
        text: "Prod. Productive Hours",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "QCCompletedCount",
        text: "QC Completed Count",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "QCTarget",
        text: "QC Target",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "QCProductiveHours",
        text: "QC Productive Hours",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
    ];
    //#endregion

    const rowStyle = (row, rowIndex) => {
      const style = {};
      if (row.ProductiveHours <= 4) {
        style.backgroundColor = "red";
        style.color = "white";
      }

      return style;
    };

    const expandEmployeeSpecificSummaryRow = {
      onlyOneExpanding: true,
      //parentClassName: "rowBackgroundColor",
      showExpandColumn: true,
      onExpand: this.fetchEmployeeSpecificDetailsReport,
      expanded: this.state.employeeSpecificDetailsReportExpanded,
      expandHeaderColumnRenderer: (isAnyExpands) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      ),
      renderer: (row) => (
        <div>
          <ToolkitProvider
            keyField="SlNo"
            data={this.state.employeeSpecificDetailsReport}
            columns={employeeSpecificDetailsReportColumns}
          >
            {(props) => (
              <>
                {/* <div
                  className="borderTable"
                  style={{ overflowX: "auto", width: "98%" }}
                > */}
                <div
                  style={{
                    overflowY: "scroll",
                    borderBottom: "1px solid #cdd4e0",
                  }}
                  ref={this.divScrollRef}
                  onScroll={this.handleScroll}
                >
                  <BootstrapTable bootstrap4 {...props.baseProps} />
                </div>
                {/* </div> */}
              </>
            )}
          </ToolkitProvider>
        </div>
      ),
    };

    return (
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
          <div className="mg-l-50">
            <ToolkitProvider
              keyField="SlNo"
              data={this.state.filterValue === "" ? data : filteredData}
              columns={employeeSpecificSummaryReportColumns}
            >
              {(props) => (
                <div className="mg-t-10">
                  <div className="row mg-b-10" style={{ marginRight: "15px" }}>
                    <div className="col-md-10" style={{ whiteSpace: "nowrap" }}>
                      <div className="row">
                        {this.state.isToShowSortingFields && (
                          <>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-3 mg-t-7">
                                  <label htmlFor="sortColumn">Column:</label>
                                </div>
                                <div className="col-lg">
                                  <select
                                    className="form-control mg-l-5"
                                    value={this.state.selectedColumn}
                                    onChange={this.onChangeColumn}
                                  >
                                    <option value="">--Select--</option>
                                    {this.state.columns.map((col) => (
                                      <option key={col}>{col}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-3 mg-t-7">
                                  <label htmlFor="sortOrder">Order:</label>
                                </div>
                                <div className="col-lg">
                                  <select
                                    className="form-control mg-l-5"
                                    value={this.state.selectedSort}
                                    onChange={this.onChangeSortOrder}
                                  >
                                    <option value="">--Select--</option>
                                    <option value="ascending">Ascending</option>
                                    <option value="descending">
                                      Descending
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div>
                                <span
                                  className="btn btn-primary pd-b-5"
                                  onClick={this.clearSort}
                                  title="Clear Sort Fields"
                                >
                                  <i className="far fa-window-close"></i>
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {this.state.employeeSpecificSummaryReport.length > 0 &&
                          this.state.isToShowFilteringField && (
                            <>
                              <div className="col-md-12">
                                <div
                                  className="row"
                                  style={{ flexWrap: "nowrap" }}
                                >
                                  <div className="col-md-1 mg-t-7">
                                    <label htmlFor="search">Search:</label>
                                  </div>
                                  <div className="col-lg pd-r-10">
                                    <input
                                      type="text"
                                      className="form-control mg-l-10"
                                      maxLength="20"
                                      value={this.state.filterValue}
                                      onChange={this.onChangefilterValue}
                                    />
                                  </div>
                                  <div>
                                    <span
                                      className="btn btn-primary pd-b-5"
                                      onClick={this.clearSearch}
                                    >
                                      <i
                                        className="far fa-window-close"
                                        title="Clear Filter"
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                      </div>
                    </div>
                    {employeeSpecificSummaryReportLength > 0 && (
                      <div
                        className="col-md-2"
                        style={{ textAlign: "end", marginTop: "10px" }}
                      >
                        <i
                          className="fas fa-exchange-alt fa-rotate-90 pointer"
                          title={
                            this.state.isToShowSortingFields
                              ? "Hide Sort"
                              : "Show Sort"
                          }
                          onClick={this.displaySortingFields}
                        ></i>
                        {!this.state.isToShowFilteringField ? (
                          <i
                            className="fas fa-filter pointer mg-l-10"
                            onClick={this.displayFilteringField}
                            title="Show Filter"
                          ></i>
                        ) : (
                          <i
                            className="fas fa-funnel-dollar pointer mg-l-10"
                            onClick={this.displayFilteringField}
                            title="Hide Filter"
                          ></i>
                        )}
                        <i
                          className="fas fa-file-excel mg-l-10 pointer"
                          style={{ color: "green" }}
                          onClick={
                            this.exportEmployeeSpecificSummaryReportToExcel
                          }
                          title="Export to Excel"
                        ></i>
                      </div>
                    )}
                  </div>
                  {/* <div style={{ width: "98%" }}> */}
                  <div
                    style={{
                      overflowY: "scroll",
                      borderBottom: "1px solid #cdd4e0",
                    }}
                    ref={this.divScrollRef}
                    className="employee-specific-summary-report-table-height"
                    onScroll={this.handleScroll}
                  >
                    <BootstrapTable
                      bootstrap4
                      {...props.baseProps}
                      striped
                      hover
                      condensed
                      expandRow={expandEmployeeSpecificSummaryRow}
                      rowStyle={rowStyle}
                    />
                  </div>
                  {/* </div> */}
                </div>
              )}
            </ToolkitProvider>
            {this.state.position > 600 && this.state.filterValue === "" && (
              <div style={{ textAlign: "end" }}>
                <button className="scroll-top" onClick={this.scrollToTop}>
                  <div className="arrow up"></div>
                </button>
              </div>
            )}
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default employeeSpecificDatewiseSummaryReport;
