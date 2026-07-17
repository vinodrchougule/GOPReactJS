import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import helper from "../../helpers/helpers";
import tableFunctions from "../../helpers/tableFunctions";
import Moment from "moment";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import ModernDatepicker from "react-modern-datepicker";
import employeesTaskReportService from "../../services/employeesTaskReport.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export default class employeesTaskUnAllocatedResourcesReport extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);
    this.displaySortingFields = this.displaySortingFields.bind(this);
    this.displayFilteringField = this.displayFilteringField.bind(this);
    this.onChangefilterValue = this.onChangefilterValue.bind(this);
    this.onChangeColumn = this.onChangeColumn.bind(this);
    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.sortData = this.sortData.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.exportUnAllocatedResourceDetailsReportDataToExcel =
      this.exportUnAllocatedResourceDetailsReportDataToExcel.bind(this);
    this.clearSearchResult = this.clearSearchResult.bind(this);

    //#region State Variables
    this.state = {
      fromDate: "",
      toDate: "",
      formErrors: "",
      employeesTaskUnAllocatedResourcesReport: [],
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

    var fromDate = new Date();
    var toDate = new Date();

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    fromDate.setDate(firstDay.getDate());
    toDate.setDate(toDate.getDate());

    this.setState(
      {
        fromDate: Moment(fromDate).format("DD-MMM-yyyy"),
        toDate: Moment(toDate).format("DD-MMM-yyyy"),
      },
      () => this.fetchEmployeesTaskUnAllocatedResourceReport(),
    );
  }
  //#endregion

  //#region fetching Employees Task Report from Web API
  fetchEmployeesTaskUnAllocatedResourceReport() {
    if (this.handleReportValidation()) {
      this.setState({
        spinnerMessage:
          "Please wait while loading Employees Task UnAllocated Resource Report...",
        loading: true,
      });

      var data = {
        FromDate: this.state.fromDate,
        ToDate: this.state.toDate,
      };

      employeesTaskReportService
        .readUnAllocatedResourceDetailsReportData(data)
        .then((response) => {
          if (response.data.length === 0) {
            this.setState({
              loading: false,
            });
            toast.error("No Data Found!!");
            return;
          }

          let formattedArray = response.data.map((obj) => {
            delete obj.FromDate;
            delete obj.ToDate;

            return obj;
          });

          this.setState({
            employeesTaskUnAllocatedResourcesReport: formattedArray,
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

  //#region Get Selected From Date
  onChangeFromDate(date) {
    this.setState({
      fromDate: date,
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    });

    if (date !== "" && date !== null) {
      const formErrors = { ...this.state.formErrors, fromDateError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Get Selected To Date
  onChangeToDate(date) {
    this.setState({
      toDate: date,
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    });

    if (date !== "" && date !== null) {
      const formErrors = { ...this.state.formErrors, toDateError: "" };
      this.setState({ formErrors: formErrors });
    }
  }

  //#endregion

  //#region  Validating the data
  handleReportValidation() {
    const fromDate = this.state.fromDate.trim();
    const toDate = this.state.toDate.trim();

    var fromDateValue = new Date(this.state.fromDate);
    var toDateValue = new Date(this.state.toDate);

    let formErrors = {};
    let isValidForm = true;

    //From Date
    if (!fromDate) {
      isValidForm = false;
      formErrors["fromDateError"] = "From Date is required";
    } else if (fromDateValue > toDateValue) {
      isValidForm = false;
      formErrors["fromDateError"] = "From Date can't be later than To Date";
    }

    //To Date
    if (!toDate) {
      isValidForm = false;
      formErrors["toDateError"] = "To Date is required";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
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
      this.getFilteredRows(),
    );
  }
  //#endregion

  //#region get filtered rows
  getFilteredRows() {
    const filteredArray = tableFunctions.filterArray(
      this.state.employeesTaskUnAllocatedResourcesReport,
      this.state.filterValue,
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
    let columns = Object.keys(
      this.state.employeesTaskUnAllocatedResourcesReport[0],
    );

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
      () => this.sortData(),
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
    let numberColumns = ["SlNo"];

    sortedArray = tableFunctions.sortData(
      this.state.employeesTaskUnAllocatedResourcesReport,
      column,
      selectedSort,
      numberColumns,
      [],
    );

    this.setState({ employeesTaskUnAllocatedResourcesReport: sortedArray });
  }
  //#endregion

  //#region  Clear Sort
  clearSort() {
    this.setState(
      {
        selectedColumn: "",
        selectedSort: "",
      },
      () => this.sortData(),
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

  //#region Clear search result
  clearSearchResult() {
    var fromDate = new Date();
    var toDate = new Date();

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    fromDate.setDate(firstDay.getDate());
    toDate.setDate(toDate.getDate());

    this.setState(
      {
        fromDate: Moment(fromDate).format("DD-MMM-yyyy"),
        toDate: Moment(toDate).format("DD-MMM-yyyy"),
      },
      () => this.fetchEmployeesTaskUnAllocatedResourceReport(),
    );
  }
  //#endregion

  //#region Export Employees Task UnAllocated Resources Report to Excel
  exportUnAllocatedResourceDetailsReportDataToExcel() {
    this.setState({
      spinnerMessage:
        "Please wait while exporting Employees Task Unallocated Resources Report to Excel...",
      loading: true,
    });

    var data = {
      FromDate: this.state.fromDate,
      ToDate: this.state.toDate,
      UserID: helper.getUser(),
    };

    employeesTaskReportService
      .exportUnAllocatedResourceDetailsReportDataToExcel(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "Un-Allocated Resource Details Report.xlsx",
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

  render() {
    const data = this.state.employeesTaskUnAllocatedResourcesReport.slice(
      0,
      this.state.index,
    );
    const filteredData = this.state.filteredArray.slice(0, this.state.index);
    const employeesTaskUnAllocatedResourcesReportLength =
      this.state.employeesTaskUnAllocatedResourcesReport.length;

    const employeesTaskUnAllocatedResourcesReportColumns = [
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
        dataField: "EmployeeCode",
        text: "Emp Code",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "EmployeeName",
        text: "Emp Name",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
      {
        dataField: "Department",
        text: "Department",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "Manager",
        text: "Manager",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
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
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-5">
              <div className="col-lg">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <b>From Date</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-7">
                    <div className="form-control">
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
                  <div className="col-md-4">
                    <b>To Date</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-8">
                    <div className="form-control">
                      <ModernDatepicker
                        date={this.state.toDate}
                        format={"DD-MMM-YYYY"}
                        onChange={(date) => this.onChangeToDate(date)}
                        placeholder={"Select a date"}
                        className="color"
                        minDate={new Date(1900, 1, 1)}
                      />
                    </div>
                    <div className="error-message">
                      {this.state.formErrors["toDateError"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 mg-t-10 mg-lg-t-0">
                <button
                  onClick={() => {
                    this.fetchEmployeesTaskUnAllocatedResourceReport();
                  }}
                  className="btn btn-gray-700 btn-block"
                >
                  Submit
                </button>
              </div>
              <div className="col-md-2 mg-t-10 mg-lg-t-0">
                <button
                  onClick={() => {
                    this.clearSearchResult();
                  }}
                  className="btn btn-gray-700 btn-block"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="mg-l-50">
            <ToolkitProvider
              keyField="SlNo"
              data={this.state.filterValue === "" ? data : filteredData}
              columns={employeesTaskUnAllocatedResourcesReportColumns}
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
                        {this.state.isToShowFilteringField &&
                          this.state.employeesTaskUnAllocatedResourcesReport
                            .length > 0 && (
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
                    {employeesTaskUnAllocatedResourcesReportLength > 0 && (
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
                            this
                              .exportUnAllocatedResourceDetailsReportDataToExcel
                          }
                          title="Export to Excel"
                        ></i>
                      </div>
                    )}
                  </div>
                  <div
                    className="borderTable"
                    style={{ overflowX: "auto", width: "98%" }}
                  >
                    <div
                      style={{
                        overflowY: "scroll",
                        borderBottom: "1px solid #cdd4e0",
                      }}
                      ref={this.divScrollRef}
                      className="employees-task-unallocated-resources-report-table-height"
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
                  </div>
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
