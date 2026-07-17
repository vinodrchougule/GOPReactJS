import React, { Component } from "react";
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
import customerService from "../../services/customer.service";
import projectStatusService from "../../services/projectStatus.service";
import periodicProjectReportService from "../../services/periodicProjectReport.service";
toast.configure();

class projectPeriodicReport extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.onChangeCustomerCode = this.onChangeCustomerCode.bind(this);
    this.onChangeProjectCode = this.onChangeProjectCode.bind(this);
    this.onChangeBatchNo = this.onChangeBatchNo.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.displaySortingFields = this.displaySortingFields.bind(this);
    this.displayFilteringField = this.displayFilteringField.bind(this);
    this.onChangefilterValue = this.onChangefilterValue.bind(this);
    this.onChangeColumn = this.onChangeColumn.bind(this);
    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.sortData = this.sortData.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.exportPeriodicProjectReportToExcel =
      this.exportPeriodicProjectReportToExcel.bind(this);

      
    //#region State Variables
    this.state = {
      customers: [],
      selectedCustomerCode: "",
      customerCode: "",
      projectCodes: [],
      selectedProjectCode: "",
      projectCode: "",
      batches: [],
      selectedBatchNo: "",
      fromDate: "",
      toDate: "",
      periodicProjectReport: [],
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

    // this.canUserAccessPage("QC Download-Upload");
    this.fetchCustomers();
  }
  //#endregion

  //#region fetching customers from Web API
  fetchCustomers() {
    this.setState({
      spinnerMessage: "Please wait while loading Customers...",
      loading: true,
    });

    customerService
      .getAllCustomers(helper.getUser())
      .then((response) => {
        this.setState({
          customers: response.data,
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

  //#region Get Selected Customer Code
  onChangeCustomerCode(e) {
    let customerCode = e.target.value.split("(");
    customerCode = customerCode[0].trim();

    this.setState(
      {
        selectedCustomerCode: customerCode,
        customerCode: e.target.value,
        selectedProjectCode: "",
        selectedBatchNo: "",
        fromDate: "",
        toDate: "",
        batches: [],
        periodicProjectReport: [],
        viewChart: false,
        isToShowFilteringField: false,
        isToShowSortingFields: false,
      },
      () => this.fetchProjectCodesOfCustomer(this.state.selectedCustomerCode)
    );

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...this.state.formErrors,
        customerCodeError: "",
      };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Fetch Project Codes of Customer
  fetchProjectCodesOfCustomer(customerCode) {
    if (!customerCode) {
      this.setState({ projectCodes: [], selectedProjectCode: "" });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while loading Project Codes...",
      loading: true,
    });

    projectStatusService
      .readProjectCodesOfCustomer(customerCode)
      .then((response) => {
        this.setState({
          projectCodes: response.data,
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

  //#region Get Selected Project Code
  onChangeProjectCode(e) {
    let projectCode = e.target.value.split("(");
    projectCode = projectCode[0].trim();

    this.setState(
      {
        selectedProjectCode: projectCode,
        projectCode: e.target.value,
        selectedBatchNo: "",
        batches: [],
        fromDate: "",
        toDate: "",
        periodicProjectReport: [],
        viewChart: false,
        isToShowFilteringField: false,
        isToShowSortingFields: false,
      },
      () => this.fetchBatchNosOfProject(this.state.selectedProjectCode)
    );

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...this.state.formErrors,
        projectCodeError: "",
      };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Fetch Batch Nos of Project
  fetchBatchNosOfProject(projectCode) {
    if (!projectCode) {
      this.setState({ batches: [], selectedBatchNo: "" });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while loading Batch Nos...",
      loading: true,
    });

    projectStatusService
      .ReadBatchesOfProject(this.state.selectedCustomerCode, projectCode)
      .then((response) => {
        if (response.data.length !== 0) {
          this.setState({
            batches: response.data,
            loading: false,
          });
        } else {
          this.fetchProjectDetails(
            this.state.selectedCustomerCode,
            projectCode,
            ""
          );
        }
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Get Selected Batch No
  onChangeBatchNo(e) {
    this.setState(
      {
        selectedBatchNo: e.target.value,
        periodicProjectReport: [],
        fromDate: "",
        toDate: "",
        isToShowFilteringField: false,
        isToShowSortingFields: false,
      },
      () =>
        this.fetchProjectDetails(
          this.state.selectedCustomerCode,
          this.state.selectedProjectCode,
          this.state.selectedBatchNo
        )
    );

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, batchNoError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region fetching Project Details of Selected Project or Batch No from Web API
  fetchProjectDetails(customerCode, projectCode, batchNo) {
    if (this.state.batches.length > 0 && !batchNo) {
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while loading Project Details...",
      loading: true,
    });

    projectStatusService
      .readProjectDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        var toDate = new Date();
        toDate.setDate(toDate.getDate());

        const formErrors = {
          ...this.state.formErrors,
          fromDateError: "",
          toDateError: "",
        };

        this.setState({
          fromDate: Moment(response.data.ReceivedOn).format("DD-MMM-yyyy"),
          toDate: Moment(toDate).format("DD-MMM-yyyy"),
          formErrors: formErrors,
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

  //#region  Validating the data
  handleReportValidation() {
    const customerCode = this.state.selectedCustomerCode.trim();
    const projectCode = this.state.selectedProjectCode.trim();
    const batchNo = this.state.selectedBatchNo.trim();

    const fromDate = this.state.fromDate.trim();
    const toDate = this.state.toDate.trim();

    var fromDateValue = new Date(this.state.fromDate);
    var toDateValue = new Date(this.state.toDate);

    let formErrors = {};
    let isValidForm = true;

    //Customer Code
    if (!customerCode) {
      isValidForm = false;
      formErrors["customerCodeError"] = "Customer Code is required";
    }

    //Project Code
    if (!projectCode) {
      isValidForm = false;
      formErrors["projectCodeError"] = "Project Code is required";
    }

    if (this.state.batches.length > 0) {
      if (!batchNo) {
        isValidForm = false;
        formErrors["batchNoError"] = "Batch No. is required";
      }
    }

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

  //#region View Report
  viewReport() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    if (this.handleReportValidation()) {
      this.setState({
        spinnerMessage: "Please wait while fetching Periodic Project Report...",
        loading: true,
      });

      var data = {
        CustomerCode: this.state.selectedCustomerCode.trim(),
        ProjectCode: this.state.selectedProjectCode.trim(),
        BatchNo: this.state.selectedBatchNo.trim(),
        FromDate: this.state.fromDate.trim(),
        ToDate: this.state.toDate.trim(),
      };

      periodicProjectReportService
        .ReadPeriodicProjectReportData(data)
        .then((response) => {
          if (response.data.length === 0) {
            toast.error("No Data Found!!");
          }
          this.setState({
            periodicProjectReport: response.data,
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

  //#region Export Periodic Project Report to Excel
  exportPeriodicProjectReportToExcel() {
    this.setState({
      spinnerMessage:
        "Please wait while exporting Periodic Project Report to Excel...",
      loading: true,
    });

    var data = {
      CustomerCode: this.state.selectedCustomerCode.trim(),
      ProjectCode: this.state.selectedProjectCode.trim(),
      BatchNo: this.state.selectedBatchNo.trim(),
      FromDate: this.state.fromDate.trim(),
      ToDate: this.state.toDate.trim(),
      UserID: helper.getUser()
    };

    let fileName = "";

    if (this.state.selectedBatchNo) {
      fileName =
        "PeriodicProjectReport_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo;
    } else {
      fileName =
        "PeriodicProjectReport_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode;
    }

    periodicProjectReportService
      .exportPeriodicProjectReportToExcel(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName + ".xlsx");
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

  //#region Get Selected From Date
  onChangeFromDate(date) {
    this.setState({
      fromDate: date,
      periodicProjectReport: [],
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
      periodicProjectReport: [],
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    });

    if (date !== "" && date !== null) {
      const formErrors = { ...this.state.formErrors, toDateError: "" };
      this.setState({ formErrors: formErrors });
    }
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
      this.state.periodicProjectReport,
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
    let columns = Object.keys(this.state.periodicProjectReport[0]);

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
      "ProductionAllocatedCount",
      "ProductionCompletedCount",
      "QCAllocatedCount",
      "QCCompletedCount",
    ];

    sortedArray = tableFunctions.sortData(
      this.state.periodicProjectReport,
      column,
      selectedSort,
      numberColumns,
      []
    );

    this.setState({ periodicProjectReport: sortedArray });
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
    const data = this.state.periodicProjectReport.slice(0, this.state.index);
    const filteredData = this.state.filteredArray.slice(0, this.state.index);
    const periodicProjectReportLength = this.state.periodicProjectReport.length;

    const projectPeriodicReportColumns = [
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
        headerAlign: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
      {
        dataField: "Activity",
        text: "Activity",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        title: true,
      },
      {
        dataField: "ProductionAllocatedCount",
        text: "Prod. Allocated Count",
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
        dataField: "QCAllocatedCount",
        text: "QC Allocated Count",
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
    ];

    //#region UI
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
                <div className="row">
                  <div className="col-md-5">
                    <b>Customer Code</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-control"
                      tabIndex="1"
                      id="customerCode"
                      name="customerCode"
                      placeholder="--Select--"
                      value={this.state.customerCode}
                      onChange={this.onChangeCustomerCode}
                    >
                      <option value="">--Select--</option>
                      {this.state.customers.map((customer) => (
                        <option key={customer.CustomerID}>
                          {customer.CustomerCode} ({customer.NoOfProjects})
                        </option>
                      ))}
                    </select>
                    <div className="error-message">
                      {this.state.formErrors["customerCodeError"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-5">
                    <b>Project Code</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-control"
                      tabIndex="2"
                      id="projectCode"
                      name="projectCode"
                      placeholder="--Select--"
                      value={this.state.projectCode}
                      onChange={this.onChangeProjectCode}
                    >
                      <option value="">--Select--</option>
                      {this.state.projectCodes.map((projectCode) => (
                        <option key={projectCode.ProjectCode}>
                          {projectCode.ProjectCode} (
                          {projectCode.ProjectInputCount})
                        </option>
                      ))}
                    </select>
                    <div className="error-message">
                      {this.state.formErrors["projectCodeError"]}
                    </div>
                  </div>
                </div>
              </div>
              {this.state.batches.length > 0 ? (
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <div className="row">
                    <div className="col-md-4">
                      <b>Batch No.</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </div>
                    <div className="col-md-6">
                      <select
                        className="form-control"
                        tabIndex="3"
                        id="batchNo"
                        name="batchNo"
                        placeholder="--Select--"
                        value={this.state.selectedBatchNo}
                        onChange={this.onChangeBatchNo}
                      >
                        <option value="">--Select--</option>
                        {this.state.batches.map((batch) => (
                          <option key={batch.BatchNo}>{batch.BatchNo}</option>
                        ))}
                      </select>
                      <div className="error-message">
                        {this.state.formErrors["batchNoError"]}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              )}
            </div>
            <br />
            <div className="row row-sm mg-r-15 mg-l-5">
              <div className="col-lg">
                <div className="row row-sm">
                  <div className="col-md-5">
                    <b>From Date</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-6">
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
                  <div className="col-md-5">
                    <b>To Date</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-6">
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
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="col-md-6 mg-l-35">
                  <button
                    onClick={this.viewReport}
                    className="btn btn-gray-700 btn-block"
                    tabIndex="4"
                  >
                    View Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mg-l-50">
            <ToolkitProvider
              keyField="SlNo"
              data={this.state.filterValue === "" ? data : filteredData}
              columns={projectPeriodicReportColumns}
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
                        {this.state.periodicProjectReport.length > 0 &&
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
                    {periodicProjectReportLength > 0 && (
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
                          onClick={this.exportPeriodicProjectReportToExcel}
                          title="Export to Excel"
                        ></i>
                      </div>
                    )}
                  </div>
                  {/* <div style={{ width: "98.3%" }}> */}
                  <div
                    style={{
                      overflowY: "scroll",
                      borderBottom: "1px solid #cdd4e0",
                    }}
                    ref={this.divScrollRef}
                    className="periodic-project-report-table-height"
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
    //#endregion
  }
}

export default projectPeriodicReport;
