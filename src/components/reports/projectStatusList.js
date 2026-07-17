import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import tableFunctions from "../../helpers/tableFunctions";
import helper from "../../helpers/helpers";
import Moment from "moment";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customerService from "../../services/customer.service";
import projectStatusService from "../../services/projectStatus.service";
toast.configure();

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

class projectStatusList extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.onChangeColumn = this.onChangeColumn.bind(this);
    this.sortData = this.sortData.bind(this);
    this.displaySortingFields = this.displaySortingFields.bind(this);
    this.displayFilteringField = this.displayFilteringField.bind(this);
    this.onChangefilterValue = this.onChangefilterValue.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.clearSearchField = this.clearSearchField.bind(this);
    this.clearSortFields = this.clearSortFields.bind(this);
    this.onChangeCustomerCode = this.onChangeCustomerCode.bind(this);
    this.onChangeProjectCode = this.onChangeProjectCode.bind(this);
    this.onChangeBatchNo = this.onChangeBatchNo.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.exportProjectStatusToExcel =
      this.exportProjectStatusToExcel.bind(this);
    this.showProjectStatusChartModal =
      this.showProjectStatusChartModal.bind(this);

    this.state = {
      customers: [],
      selectedCustomerCode: "",
      customerCode: "",
      projectCodes: [],
      selectedProjectCode: "",
      projectCode: "",
      batches: [],
      selectedBatchNo: "",
      inputCount: "",
      receivedOn: "",
      deliveredOn: "",
      scope: "",
      projectStatus: [],
      formErrors: "",
      loading: false,
      spinnerMessage: "",
      modalLoading: false,
      showProjectStatusChartModal: false,
      projectStatusChart: [],
      viewChart: false,
      activities: [],
      productionCompletedPercentages: [],
      QCCompletedPercentages: [],
      index: 20,
      position: 0,
      columns: [],
      selectedColumn: "",
      selectedSort: "",
      isToShowSortingFields: false,
      isToShowFilteringField: true,
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
        projectCodes: [],
        batches: [],
        inputCount: "",
        receivedOn: "",
        deliveredOn: "",
        scope: "",
        projectStatus: [],
        viewChart: false,
        isToShowFilteringField: false,
        isToShowSortingFields: false,
      },
      () => this.fetchProjectCodesOfCustomer(customerCode)
    );

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...this.state.formErrors,
        customerCodeError: "",
        projectCodeError: "",
        batchNoError: "",
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
        inputCount: "",
        receivedOn: "",
        deliveredOn: "",
        scope: "",
        projectStatus: [],
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
        batchNoError: "",
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
          });
        } else {
          this.fetchProjectDetails(
            this.state.selectedCustomerCode,
            projectCode,
            ""
          );
        }

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

  //#region Get Selected Batch No
  onChangeBatchNo(e) {
    this.setState(
      {
        selectedBatchNo: e.target.value,
        inputCount: "",
        receivedOn: "",
        deliveredOn: "",
        scope: "",
        projectStatus: [],
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
        this.setState({
          inputCount: response.data.InputCount,
          receivedOn: response.data.ReceivedOn,
          deliveredOn: response.data.DeliveredOn,
          scope: response.data.Scope,
        });
        this.viewReport();
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Validating the customer data
  handleReportValidation() {
    const customerCode = this.state.selectedCustomerCode.trim();
    const projectCode = this.state.selectedProjectCode.trim();
    const batchNo = this.state.selectedBatchNo.trim();

    let formErrors = {};
    let isValidForm = true;

    //Customer Code
    if (!customerCode) {
      isValidForm = false;
      formErrors["customerCodeError"] = "Customer Code is required";
    }

    //Customer Code
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
        spinnerMessage: "Please wait while fetching Project Status List...",
        loading: true,
      });

      projectStatusService
        .readProjectStatusReportData(
          this.state.selectedCustomerCode,
          this.state.selectedProjectCode,
          this.state.selectedBatchNo
        )
        .then((response) => {
          if (response.data.length === 0) {
            this.setState({
              loading: false,
              viewChart: false,
            });
            toast.error("No Data Found!!");
          } else {
            let formattedArray = response.data.map((obj) => ({
              ...obj,
              LastUpdatedDate: obj.LastUpdatedDate
                ? Moment(obj.LastUpdatedDate).format("DD-MMM-yyyy")
                : "",
            }));

            this.setState({
              projectStatus: formattedArray,
              isToShowFilteringField: true,
              loading: false,
              viewChart: true,
            });
          }
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

  //#region Export Project Status to Excel
  exportProjectStatusToExcel() {
    this.setState({
      spinnerMessage:
        "Please wait while exporting Project Status List to Excel...",
      loading: true,
    });

    let fileName = "";

    if (this.state.selectedBatchNo) {
      fileName =
        "ProjectStatusReport_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo;
    } else {
      fileName =
        "ProjectStatusReport_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode;
    }

    projectStatusService
      .exportProjectStatusReportToExcel(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo,
        helper.getUser()
      )
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

  //#region Display Project Status Chart
  showProjectStatusChartModal() {
    this.setState({
      spinnerMessage: "Please wait while displaying Activity chart...",
      loading: true,
    });

    projectStatusService
      .readProjectStatusActivitySummary(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      )
      .then((response) => {
        let activities = response.data.map((a) => a.Activity);
        let productionCompletedPercentages = response.data.map(
          (pcp) => pcp.ProductionCompletedPercentage
        );
        let QCCompletedPercentages = response.data.map(
          (cp) => cp.QCCompletedPercentage
        );

        this.setState({
          projectStatusChart: response.data,
          QCCompletedPercentages: QCCompletedPercentages,
          productionCompletedPercentages: productionCompletedPercentages,
          activities: activities,
          loading: false,
          showProjectStatusChartModal: true,
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

  //#region Scroll to Top
  scrollToTop = () => {
    this.divScrollRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  //#endregion

  //#region Sort Functions
  //#region Display Sorting Fields
  displaySortingFields() {
    let columns = Object.keys(this.state.projectStatus[0]);

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
      "ProductionPendingCount",
      "QCAllocatedCount",
      "QCCompletedCount",
      "QCPendingCount",
    ];
    let dateColumns = ["LastUpdatedDate"];

    sortedArray = tableFunctions.sortData(
      this.state.projectStatus,
      column,
      selectedSort,
      numberColumns,
      dateColumns
    );

    this.setState({ projectStatus: sortedArray });
  }
  //#endregion

  //#region  Clear Sort
  clearSortFields() {
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
      this.state.projectStatus,
      this.state.filterValue
    );

    this.setState({ filteredArray: filteredArray });
  }
  //#endregion

  //#region Clear Search
  clearSearchField() {
    this.setState({
      filterValue: "",
    });
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

  render() {
    const viewChart = this.state.viewChart;

    const data = this.state.projectStatus.slice(0, this.state.index);
    const filteredData = this.state.filteredArray.slice(0, this.state.index);

    const projectStatusListColumns = [
      {
        dataField: "SlNo",
        text: "Sl No.",
        align: "center",
      },
      {
        dataField: "EmployeeCode",
        align: "center",
        text: "Emp Code",
      },
      {
        dataField: "EmployeeName",
        text: "Emp Name",
      },
      {
        dataField: "Activity",
        text: "Activity",
        title: true,
      },
      {
        dataField: "ProductionAllocatedCount",
        align: "center",
        text: "Prod. Allocated",
      },
      {
        dataField: "ProductionCompletedCount",
        align: "center",
        text: "Prod. Completed",
      },
      {
        dataField: "ProductionPendingCount",
        align: "center",
        text: "Prod. Pending",
      },
      {
        dataField: "QCAllocatedCount",
        text: "QC Allocated",
        align: "center",
      },
      {
        dataField: "QCCompletedCount",
        text: "QC Completed",
        align: "center",
      },
      {
        dataField: "QCPendingCount",
        text: "QC Pending",
        align: "center",
      },
      {
        dataField: "LastUpdatedDate",
        text: "Last Updated Date",
        align: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.LastUpdatedDate
              ? Moment(row.LastUpdatedDate).format("DD-MMM-yyyy")
              : ""
          }`,
      },
    ];

    const projectStatusChartColumns = [
      {
        dataField: "Activity",
        text: "Activity",
        style: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
        title: true,
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "190px",
        },
        headerAlign: "center",
        sort: true,
      },
      {
        dataField: "ActivityCount",
        text: "Activity Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "135px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "ProductionAllocatedCount",
        text: "Prod. Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "180px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "ProductionAllocatedPercentage",
        text: "Prod. Allocated %",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "160px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "ProductionCompletedCount",
        text: "Prod. Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "190px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "ProductionCompletedPercentage",
        text: "Prod. Completed %",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "165px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "QCAllocatedCount",
        text: "QC Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "165px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "QCAllocatedPercentage",
        text: "QC Allocated %",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "140px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "QCCompletedCount",
        text: "QC Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "175px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "QCCompletedPercentage",
        text: "QC Completed %",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "155px",
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
    ];

    const labels = this.state.activities;

    //#region Chart Options
    const chartOptions = {
      scales: {
        y: {
          min: 0,
          max: 100,
        },
      },
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Project Activity Status",
          font: {
            size: 20,
          },
        },
        datalabels: {
          display: true,
          color: "black",
        },
      },
    };
    //#endregion

    //#region Chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: "Production",
          data: this.state.productionCompletedPercentages,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "QC",
          data: this.state.QCCompletedPercentages,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
    //#endregion

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
            className="mg-l-50 mg-r-25" >
            <div className="row row-sm  mg-r-15 mg-l-5 mg-t-5">
              <div className="col-lg">
                <div className="row">
                  <div className="col-md-6">
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
              {this.state.batches.length > 0 && (
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <div className="row">
                    <div className="col-md-5">
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
              )}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-6 mg-t-2">
                    {viewChart && (
                      <button onClick={this.showProjectStatusChartModal}>
                        <i className="far fa-chart-bar icon-size"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row row-sm mg-r-15 mg-l-5">
              <div className="col-lg">
                <div className="row row-sm">
                  <div className="col-md-7">
                    <b>Input Count </b>
                  </div>
                  <div className="col-md-5">
                    <p>{this.state.inputCount}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row row-sm">
                  <div className="col-md-5">
                    <b>Received On</b>
                  </div>
                  <div className="col-md-7">
                    <p>
                      {this.state.receivedOn !== ""
                        ? Moment(this.state.receivedOn).format("DD-MMM-yyyy")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row row-sm">
                  <div className="col-md-5">
                    <b>Delivered On</b>
                  </div>
                  <div className="col-md-7">
                    <p>
                      {this.state.deliveredOn
                        ? Moment(this.state.deliveredOn).format("DD-MMM-yyyy")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row row-sm">
                  <div className="col-md-2">
                    <b>Scope</b>
                  </div>
                  <div className="col-md-10">
                    <p title={this.state.scope} className="scopeOverflowReport">
                      {this.state.scope}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mg-l-50">
            <ToolkitProvider
              keyField="SlNo"
              data={this.state.filterValue === "" ? data : filteredData}
              columns={projectStatusListColumns}
            >
              {(props) => (
                <div>
                  <div className="row mg-b-10" style={{ marginRight: "15px" }}>
                    <div
                      className="col-md-10 mg-t-5"
                      style={{ whiteSpace: "nowrap" }}
                    >
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
                                  onClick={this.clearSortFields}
                                  title="Clear Sort Fields"
                                >
                                  <i className="far fa-window-close"></i>
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {this.state.projectStatus.length > 0 &&
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
                                      className="form-control mg-l-5"
                                      maxLength="20"
                                      value={this.state.filterValue}
                                      onChange={this.onChangefilterValue}
                                    />
                                  </div>
                                  <div>
                                    <span
                                      className="btn btn-primary pd-b-5"
                                      onClick={this.clearSearchField}
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
                    {this.state.projectStatus.length > 0 && (
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
                          onClick={this.exportProjectStatusToExcel}
                          title="Export to Excel"
                        ></i>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      overflowY: "scroll",
                      //borderBottom: "1px solid #cdd4e0",
                    }}
                    ref={this.divScrollRef}
                    className="react-bootstrap-table-height"
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
        <Modal
          show={this.state.showProjectStatusChartModal}
          dialogClassName="report-modal-width"
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header>
            <Modal.Title>
              Project Status Chart <b className="mg-l-100">Customer Code: </b>
              {this.state.selectedCustomerCode}{" "}
              <b className="mg-l-50">Project Code: </b>
              {this.state.selectedProjectCode}
              {this.state.selectedBatchNo ? (
                <b className="mg-l-50"> Batch No: </b>
              ) : (
                ""
              )}
              {this.state.selectedBatchNo}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mg-b-10">
              <Bar
                options={chartOptions}
                data={chartData}
                height={80}
                plugins={[ChartDataLabels]}
              />
            </div>
            <div
              className="borderTable"
              style={{
                overflowY: "scroll",
                borderBottom: "1px solid rgb(205, 212, 224)",
              }}
            >
              <BootstrapTable
                keyField="Activity"
                data={this.state.projectStatusChart}
                columns={projectStatusChartColumns}
                classes="borderRight"
              />
            </div>
            <div className="row row-sm mg-t-30">
              <div className="col-md-5"></div>
              <div className="col-md-2 mg-t-10 mg-lg-t-0">
                <span
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  onClick={() =>
                    this.setState({ showProjectStatusChartModal: false })
                  }
                >
                  Close
                </span>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default projectStatusList;
