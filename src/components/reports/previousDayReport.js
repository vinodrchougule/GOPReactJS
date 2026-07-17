import React, { Component } from "react";
import previousDayReportService from "../../services/previousDayReport.service";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import helper from "../../helpers/helpers";
import tableFunctions from "../../helpers/tableFunctions";
import Moment from "moment";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import ModernDatepicker from "react-modern-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class previousDayReport extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);
    this.viewPreviousDayReport = this.viewPreviousDayReport.bind(this);
    this.displaySortingFields = this.displaySortingFields.bind(this);
    this.displayFilteringField = this.displayFilteringField.bind(this);
    this.onChangefilterValue = this.onChangefilterValue.bind(this);
    this.onChangeColumn = this.onChangeColumn.bind(this);
    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.sortData = this.sortData.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.exportPreviousDayReportToExcel =
      this.exportPreviousDayReportToExcel.bind(this);

    this.state = {
      fromDate: "",
      toDate: "",
      previousDayReport: [],
      displayFilter: false,
      formErrors: "",
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
    };
  }

  //#region page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    var today = Moment();
    var todayDay = {
      day: today.format("dddd"),
    };

    var fromDate = new Date();
    var toDate = new Date();

    toDate.setDate(toDate.getDate() - 1);

    if (todayDay.day === "Monday") {
      fromDate.setDate(fromDate.getDate() - 3);
    } else {
      fromDate.setDate(fromDate.getDate() - 1);
    }

    this.setState(
      {
        fromDate: Moment(fromDate).format("DD-MMM-yyyy"),
        toDate: Moment(toDate).format("DD-MMM-yyyy"),
      },
      () => this.viewPreviousDayReport()
    );
  }
  //#endregion

  //#region  Validating the From Date and To Date
  handleDateValidation() {
    var fromDate = new Date(this.state.fromDate);
    var toDate = new Date(this.state.toDate);

    let formErrors = {};
    let isValidForm = true;

    if (fromDate > toDate) {
      isValidForm = false;
      formErrors["fromDateError"] = "From Date can't be later than To Date";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region fetch Previous Day Report
  viewPreviousDayReport() {
    if (this.handleDateValidation()) {
      this.setState({
        spinnerMessage: "Please wait while fetching Previous Day Report...",
        loading: true,
      });

      previousDayReportService
        .readpreviousDayReport(this.state.fromDate, this.state.toDate)
        .then((response) => {
          if (response.data.length === 0) {
            toast.error("No Data Found!!");
          }
          this.setState({
            previousDayReport: response.data,
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
  }
  //#endregion

  //#region  Get Selected From Date
  onChangeFromDate(date) {
    this.setState({
      fromDate: date,
      previousDayReport: [],
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    });

    if (date !== "" && date !== null) {
      const formErrors = { ...this.state.formErrors, fromDateError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region  Get Selected To Date
  onChangeToDate(date) {
    this.setState({
      toDate: date,
      previousDayReport: [],
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    });
  }
  //#endregion

  //#region Export Previous Day Report to Excel
  exportPreviousDayReportToExcel() {
    this.setState({
      spinnerMessage:
        "Please wait while exporting Previous Day Report to Excel...",
      loading: true,
    });

    previousDayReportService
      .exportPreviousDayReportToExcel(this.state.fromDate, this.state.toDate,helper.getUser())
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Previous Day Report.xlsx");
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
      this.state.previousDayReport,
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
    let columns = Object.keys(this.state.previousDayReport[0]);

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
    let numberColumns = [
      "SlNo",
      "ProductionCompletedCount",
      "QCCompletedCount",
    ];

    sortedArray = tableFunctions.sortData(
      this.state.previousDayReport,
      column,
      selectedSort,
      numberColumns,
      []
    );

    this.setState({ previousDayReport: sortedArray });
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

  render() {
    const data = this.state.previousDayReport.slice(0, this.state.index);
    const filteredData = this.state.filteredArray.slice(0, this.state.index);
    const previousDayReportLength = this.state.previousDayReport.length;

    const previousDayReportColumns = [
      {
        dataField: "SlNo",
        text: "Sl No",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "CustomerCode",
        align: "center",
        text: "Customer Code",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProjectCode",
        text: "Project Code",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "BatchNo",
        text: "Batch No.",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "EmployeeCode",
        text: "Employee Code",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "EmployeeName",
        text: "Employee Name",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
      {
        dataField: "Department",
        text: "Department",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ManagerName",
        text: "Manager Name",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "Activity",
        text: "Activity",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
      {
        dataField: "ProductionCompletedCount",
        text: "Prod. Completed",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "QCCompletedCount",
        text: "QC Completed",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
    ];

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
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25"
          >
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-5 mg-b-5">
              <div className="col-lg">
                <div className="row row-sm">
                  <div className="col-md-4 mg-t-10">
                    <b>From Date</b>
                  </div>
                  <div className="col-md-7">
                    <div className="form-control date-field-width">
                      <ModernDatepicker
                        date={this.state.fromDate}
                        format={"DD-MMM-YYYY"}
                        onChange={(date) => this.onChangeFromDate(date)}
                        placeholder={"Select a date"}
                        className="color"
                        minDate={new Date(1900, 1, 1)}
                      />
                    </div>
                    <div className="error-message">
                      {this.state.formErrors["fromDateError"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row row-sm">
                  <div className="col-md-4 mg-t-10">
                    <b>To Date</b>
                  </div>
                  <div className="col-md-7">
                    <div className="form-control date-field-width">
                      <ModernDatepicker
                        date={this.state.toDate}
                        format={"DD-MMM-YYYY"}
                        onChange={(date) => this.onChangeToDate(date)}
                        placeholder={"Select a date"}
                        className="color"
                        minDate={new Date(1900, 1, 1)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="col-md-6">
                  <button
                    onClick={this.viewPreviousDayReport}
                    className="btn btn-gray-700 btn-block"
                    tabIndex="4"
                  >
                    View Report
                  </button>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0"></div>
            </div>
          </div>
          <div className="mg-l-50">
            <ToolkitProvider
              keyField="SlNo"
              data={this.state.filterValue === "" ? data : filteredData}
              columns={previousDayReportColumns}
            >
              {(props) => (
                <div className="mg-t-5">
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
                        {this.state.previousDayReport.length > 0 &&
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
                    {previousDayReportLength > 0 && (
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
                          onClick={this.exportPreviousDayReportToExcel}
                          title="Export to Excel"
                        ></i>
                      </div>
                    )}
                  </div>
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
                    className="previous-day-report-table-height"
                    onScroll={this.handleScroll}
                  >
                    <BootstrapTable
                      bootstrap4
                      {...props.baseProps}
                      striped
                      hover
                      condensed
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

export default previousDayReport;
