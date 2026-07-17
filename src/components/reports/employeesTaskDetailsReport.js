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
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class employeesTaskDetailsReport extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.onChangeCustomerCode = this.onChangeCustomerCode.bind(this);
    this.onChangeProjectCode = this.onChangeProjectCode.bind(this);
    this.onChangeBatchNo = this.onChangeBatchNo.bind(this);
    this.loadDepartments = this.loadDepartments.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onChangeEmployee = this.onChangeEmployee.bind(this);
    this.onChangeActivity = this.onChangeActivity.bind(this);
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
    this.exportEmployeesTaskReportToExcel =
      this.exportEmployeesTaskReportToExcel.bind(this);
    this.clearSearchResult = this.clearSearchResult.bind(this);

    //#region State Variables
    this.state = {
      customers: [],
      selectedCustomerCode: "(All)",
      projectCodes: [],
      selectedProjectCode: "(All)",
      batches: [],
      selectedBatchNo: "(All)",
      departments: [],
      selectedDepartment: "(All)",
      //employees: ["(All)"],
      employeeArray: [],
      //selectedEmployee: "(All)",
      employeeCodeArray: [],
      selectedOptions: [{ value: "(All)", label: "(All)" }],
      activities: [],
      selectedActivity: "(All)",
      fromDate: "",
      toDate: "",
      formErrors: "",
      employeesTaskReport: [],
      loading: false,
      spinnerMessage: "",
      index: 20,
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

    if (this.props.fromDate && this.props.toDate) {
      this.setState(
        {
          fromDate: this.props.fromDate,
          toDate: this.props.toDate,
        },
        () =>
          this.fetchEmployeesTaskReport(true, false, false, true, true, true),
      );
    } else {
      var fromDate = new Date();
      var toDate = new Date();

      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

      fromDate.setDate(firstDay.getDate());
      toDate.setDate(toDate.getDate());

      this.setState(
        {
          //fromDate: "01-May-2023",
          fromDate: Moment(fromDate).format("DD-MMM-yyyy"),
          toDate: Moment(toDate).format("DD-MMM-yyyy"),
        },
        () =>
          this.fetchEmployeesTaskReport(true, false, false, true, true, true),
      );
    }
    if (this.props.empName) {
      let empCode = this.props.empName.split("-");

      empCode = empCode[1].trim();
      this.setState({
        employeeCodeArray: [empCode],
        selectedOptions: [
          { value: this.props.empName, label: this.props.empName },
        ],
      });
    }
  }
  //#endregion

  //#region fetching Employees Task Report from Web API
  fetchEmployeesTaskReport(
    isToLoadCustomerDropDown,
    isToLoadProjectDropDown,
    isToLoadBatchDropDown,
    isToLoadDepartmentDropDown,
    isToLoadEmployeeDropDown,
    isToLoadActivityDropDown,
  ) {
    if (this.handleReportValidation()) {
      this.setState({
        spinnerMessage: "Please wait while loading Employees Task Report...",
        loading: true,
      });

      let customerCode =
        this.state.selectedCustomerCode !== "(All)"
          ? this.state.selectedCustomerCode.split("(")[0]
          : this.state.selectedCustomerCode;

      let projectCode =
        this.state.selectedProjectCode !== "(All)"
          ? this.state.selectedProjectCode.split("(")[0]
          : this.state.selectedProjectCode;

      let employeeCodes = [];
      if (this.state.employeeCodeArray.length > 0) {
        employeeCodes = this.state.employeeCodeArray.map((empCode) => {
          return { EmpCode: empCode };
        });
      }

      var data = {
        CustomerCode: customerCode,
        ProjectCode: projectCode,
        BatchNo: this.state.selectedBatchNo,
        Department: this.state.selectedDepartment,
        EmployeeCodes: employeeCodes,
        Activity: this.state.selectedActivity,
        FromDate: this.state.fromDate,
        ToDate: this.state.toDate,
      };

      let customerCodes = this.state.customers;
      let projectCodes = this.state.projectCodes;
      let batchNo = this.state.batches;
      let departments = this.state.departments;
      let employees = this.state.employees;
      let activities = this.state.activities;

      let employeeArray = {};

      employeesTaskReportService
        .readEmployeesTaskDetailsReportData(data)
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

          if (isToLoadCustomerDropDown) {
            customerCodes = [
              ...new Set(
                formattedArray.map(
                  (obj) => obj.CustomerCode + " (" + obj.NoOfProjects + ")",
                ),
              ),
            ];

            customerCodes = customerCodes.filter(function (el) {
              return el !== "";
            });
          }

          if (isToLoadProjectDropDown) {
            projectCodes = [
              ...new Set(
                formattedArray.map(
                  (obj) => obj.ProjectCode + " (" + obj.InputCount + ")",
                ),
              ),
            ];

            projectCodes = projectCodes.filter(function (el) {
              return el !== "";
            });
          }

          if (isToLoadBatchDropDown) {
            batchNo = [...new Set(formattedArray.map((obj) => obj.BatchNo))];

            batchNo = batchNo.filter(function (el) {
              return el !== "";
            });
          }

          if (isToLoadDepartmentDropDown) {
            departments = [
              ...new Set(formattedArray.map((obj) => obj.Department)),
            ];

            departments = departments.filter(function (el) {
              return el !== "";
            });
          }

          if (isToLoadEmployeeDropDown) {
            employees = [
              ...new Set(formattedArray.map((obj) => obj.EmployeeName)),
            ];

            employees = employees.filter(function (el) {
              return el !== "";
            });

            employees = ["(All)", ...employees];

            employeeArray = employees.map((object) => {
              return { value: object, label: object };
            });
          }

          if (isToLoadActivityDropDown) {
            activities = [
              ...new Set(formattedArray.map((obj) => obj.Activity)),
            ];

            activities = activities.filter(function (el) {
              return el !== "";
            });
          }

          this.setState({
            customers: customerCodes,
            projectCodes: projectCodes,
            batches: batchNo,
            departments: departments,
            employeeArray: employeeArray,
            activities: activities,
            employeesTaskReport: formattedArray,
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

  //#region Get Selected Customer Code
  onChangeCustomerCode(e) {
    this.setState({
      selectedCustomerCode: e.target.value,
      selectedProjectCode: "(All)",
      selectedBatchNo: "(All)",
      selectedDepartment: "(All)",
      employeeCodeArray: [],
      selectedOptions: [{ value: "(All)", label: "(All)" }],
      selectedActivity: "(All)",
    });

    let customerCode = e.target.value.split("(");
    customerCode = customerCode[0].trim();

    let customerProjectCodes = this.state.employeesTaskReport.filter(
      function (t) {
        return e.target.value !== "(All)"
          ? t.ProjectCode && t.CustomerCode === customerCode
          : t.ProjectCode;
      },
    );

    let projectCodes = [
      ...new Set(
        customerProjectCodes.map(
          (obj) => obj.ProjectCode + " (" + obj.InputCount + ")",
        ),
      ),
    ];

    projectCodes = projectCodes.filter(function (el) {
      return el !== "";
    });

    this.setState({
      projectCodes: projectCodes,
    });
  }
  //#endregion

  //#region Get Selected Project Code
  onChangeProjectCode(e) {
    this.setState({
      selectedProjectCode: e.target.value,
      selectedBatchNo: "(All)",
      selectedDepartment: "(All)",
      employeeCodeArray: [],
      selectedOptions: [{ value: "(All)", label: "(All)" }],
      selectedActivity: "(All)",
    });

    let projectCode = e.target.value.split("(");
    projectCode = projectCode[0].trim();

    let projectsBatchNo = this.state.employeesTaskReport.filter(function (t) {
      return e.target.value !== "(All)"
        ? t.BatchNo && t.ProjectCode === projectCode
        : t.BatchNo;
    });

    let batchNos = [...new Set(projectsBatchNo.map((obj) => obj.BatchNo))];

    batchNos = batchNos.filter(function (el) {
      return el !== "";
    });

    this.setState(
      {
        batches: batchNos,
      },
      () => {
        if (this.state.batches.length === 0) {
          this.loadDepartments();
        }
      },
    );
  }
  //#endregion

  //#region Get Selected Batch No
  onChangeBatchNo(e) {
    this.setState(
      {
        selectedBatchNo: e.target.value,
        selectedDepartment: "(All)",
        employeeCodeArray: [],
        selectedOptions: [{ value: "(All)", label: "(All)" }],
        selectedActivity: "(All)",
      },
      () => this.loadDepartments(),
    );
  }
  //#endregion

  //#region Load departments
  loadDepartments() {
    let value;

    if (this.state.batches.length > 0) {
      value = this.state.selectedBatchNo;
    } else {
      value = this.state.selectedProjectCode.split("(")[0];
    }

    let departmentsOfProject = this.state.employeesTaskReport.filter(
      function (t) {
        return value !== "(All)"
          ? t.Department && t.BatchNo === value
          : t.Department;
      },
    );

    let departments = [
      ...new Set(departmentsOfProject.map((obj) => obj.Department)),
    ];

    departments = departments.filter(function (el) {
      return el !== "";
    });

    this.setState({
      departments: departments,
    });
  }
  //#endregion

  //#region Get Selected Department
  onChangeDepartment(e) {
    this.setState({
      selectedDepartment: e.target.value,
      employeeCodeArray: [],
      selectedOptions: [{ value: "(All)", label: "(All)" }],
      selectedActivity: "(All)",
    });

    let employeeOfDepartment = this.state.employeesTaskReport.filter(
      function (t) {
        return e.target.value !== "(All)"
          ? t.EmployeeName && t.Department === e.target.value
          : t.EmployeeName;
      },
    );

    let employees = [
      ...new Set(employeeOfDepartment.map((obj) => obj.EmployeeName)),
    ];

    employees = employees.filter(function (el) {
      return el !== "";
    });

    employees = ["(All)", ...employees];

    let employeeArray = employees.map((object) => {
      return { value: object, label: object };
    });

    this.setState({
      employeeArray: employeeArray,
    });
  }
  //#endregion

  //#region Get Selected Employee
  onChangeEmployee = (selectedOption) => {
    let employeeCodeArray = [];
    let empCodeArray;
    var isAllOptionSelected = false;

    for (var i = 0; i < selectedOption.length; i++) {
      if (selectedOption[i].value === "(All)") {
        isAllOptionSelected = true;
      }
    }

    // isAllOptionSelected = selectedOption.map((row) => {
    //   if (row.value === "(All)") {
    //     return true;
    //   }
    // });

    if (!isAllOptionSelected) {
      for (var j = 0; j < selectedOption.length; j++) {
        var split = selectedOption[j].value.split("-");
        employeeCodeArray.push(split[1]);
      }

      empCodeArray = employeeCodeArray.map((row) => row.trim());
    } else {
      empCodeArray = [];
      //selectedOption = [[{ value: "(All)", label: "(All)" }]];
    }

    this.setState({
      //selectedEmployee: selectedOption,
      employeeCodeArray: empCodeArray,
      selectedOptions: selectedOption,
    });
  };

  // onChangeEmployee(e) {
  //   this.setState({
  //     selectedEmployee: e.target.value,
  //     selectedActivity: "(All)",
  //   });

  //   let ActivitiesOfEmployee = this.state.employeesTaskReport.filter(function (
  //     t
  //   ) {
  //     return e.target.value !== "(All)"
  //       ? t.Activity && t.EmployeeName === e.target.value
  //       : t.Activity;
  //   });

  //   let activities = [
  //     ...new Set(ActivitiesOfEmployee.map((obj) => obj.Activity)),
  //   ];

  //   activities = activities.filter(function (el) {
  //     return el !== "";
  //   });

  //   this.setState({
  //     activities: activities,
  //   });
  // }
  //#endregion

  //#region Get Selected Activity
  onChangeActivity(e) {
    this.setState({
      selectedActivity: e.target.value,
    });
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

  //#region Export Employees Task Report to Excel
  exportEmployeesTaskReportToExcel() {
    this.setState({
      spinnerMessage:
        "Please wait while exporting Employees Task Report to Excel...",
      loading: true,
    });

    let customerCode =
      this.state.selectedCustomerCode !== "(All)"
        ? this.state.selectedCustomerCode.split("(")[0]
        : this.state.selectedCustomerCode;

    let projectCode =
      this.state.selectedProjectCode !== "(All)"
        ? this.state.selectedProjectCode.split("(")[0]
        : this.state.selectedProjectCode;

    var data = {
      CustomerCode: customerCode,
      ProjectCode: projectCode,
      BatchNo: this.state.selectedBatchNo,
      Department: this.state.selectedDepartment,
      EmployeeName: this.state.selectedEmployee,
      Activity: this.state.selectedActivity,
      FromDate: this.state.fromDate,
      ToDate: this.state.toDate,
      UserID: helper.getUser(),
    };

    employeesTaskReportService
      .exportEmployeesTaskReportToExcel(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Employees Task Details Report.xlsx");
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
      this.getFilteredRows(),
    );
  }
  //#endregion

  //#region get filtered rows
  getFilteredRows() {
    const filteredArray = tableFunctions.filterArray(
      this.state.employeesTaskReport,
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
    let columns = Object.keys(this.state.employeesTaskReport[0]);

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
    let numberColumns = [
      "SlNo",
      "ProductionAllocatedCount",
      "ProductionCompletedCount",
      "QCAllocatedCount",
      "QCCompletedCount",
      "AveragePerDay",
      "ProductivityManDays",
    ];

    let dateColumns = [
      "ProductionAllocatedOn",
      "QCAllocatedOn",
      "ProductionStartDate",
      "ProductionEndDate",
      "QCStartDate",
      "QCEndDate",
    ];

    sortedArray = tableFunctions.sortData(
      this.state.employeesTaskReport,
      column,
      selectedSort,
      numberColumns,
      dateColumns,
    );

    this.setState({ employeesTaskReport: sortedArray });
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
    this.setState(
      {
        selectedCustomerCode: "(All)",
        selectedProjectCode: "(All)",
        selectedBatchNo: "(All)",
        selectedDepartment: "(All)",
        employeeArray: [],
        employeeCodeArray: [],
        selectedOptions: [{ value: "(All)", label: "(All)" }],
        selectedActivity: "(All)",
      },
      () => this.fetchEmployeesTaskReport(true, false, false, true, true, true),
    );
  }
  //#endregion

  render() {
    const data = this.state.employeesTaskReport.slice(0, this.state.index);
    const filteredData = this.state.filteredArray.slice(0, this.state.index);
    const employeesTaskReportLength = this.state.employeesTaskReport.length;

    const employeesTaskReportColumns = [
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
        dataField: "CustomerCode",
        text: "Cus Code",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProjectCode",
        text: "Proj Code",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "BatchNo",
        text: "Batch No",
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
        headerAlign: "center",
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
        headerAlign: "center",
      },
      {
        dataField: "Activity",
        text: "Activity / Task",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        title: true,
      },
      {
        dataField: "ProductionAllocatedCount",
        text: "Prod. Allocated",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${row.ProductionAllocatedCount}` +
          " (Target: " +
          row.ProductionTarget +
          "/Day)",
      },
      {
        dataField: "ProductionCompletedCount",
        text: "Prod. Completed",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.ProductionHoursWorked > 0
              ? row.ProductionCompletedCount +
                " (Hrs: " +
                row.ProductionHoursWorked +
                " worked)"
              : row.ProductionCompletedCount
          }`,
      },
      {
        dataField: "QCAllocatedCount",
        text: "QC Allocated",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${row.QCAllocatedCount + " (Target: " + row.QCTarget + "/Day)"}`,
      },
      {
        dataField: "QCCompletedCount",
        text: "QC Completed",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.QCHoursWorked > 0
              ? row.QCCompletedCount +
                " (Hrs: " +
                row.QCHoursWorked +
                " worked)"
              : row.QCCompletedCount
          }`,
      },
      {
        dataField: "AveragePerDay",
        text: "Average Per Day",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductivityManDays",
        text: "Productivity (Man Days)",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
      {
        dataField: "ProductionAllocatedOn",
        text: "Prod. Allocated On",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.ProductionAllocatedOn
              ? Moment(row.ProductionAllocatedOn).format("DD-MMM-yyyy")
              : ""
          }`,
      },
      {
        dataField: "QCAllocatedOn",
        text: "QC Allocated On",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.QCAllocatedOn
              ? Moment(row.QCAllocatedOn).format("DD-MMM-yyyy")
              : ""
          }`,
      },
      {
        dataField: "ProductionStartDate",
        text: "Prod. Start Date",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.ProductionStartDate
              ? Moment(row.ProductionStartDate).format("DD-MMM-yyyy")
              : ""
          }`,
      },
      {
        dataField: "ProductionEndDate",
        text: "Prod. End Date",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.ProductionEndDate
              ? Moment(row.ProductionEndDate).format("DD-MMM-yyyy")
              : ""
          }`,
      },
      {
        dataField: "QCStartDate",
        text: "QC Start Date",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${
            row.QCStartDate ? Moment(row.QCStartDate).format("DD-MMM-yyyy") : ""
          }`,
      },
      {
        dataField: "QCEndDate",
        text: "QC End Date",
        align: "center",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${row.QCEndDate ? Moment(row.QCEndDate).format("DD-MMM-yyyy") : ""}`,
      },
      {
        dataField: "ProductionTarget",
        text: "ProductionTarget",
        align: "center",
        hidden: true,
      },
      {
        dataField: "QCTarget",
        text: "QCTarget",
        align: "center",
        hidden: true,
      },
      {
        dataField: "ProductionHoursWorked",
        text: "ProductionHoursWorked",
        align: "center",
        hidden: true,
      },
      {
        dataField: "QCHoursWorked",
        text: "QCHoursWorked",
        align: "center",
        hidden: true,
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
                  <div className="col-md-5 mg-t-5">
                    <b>Customer Code</b>
                  </div>
                  <div className="col-md-7">
                    <select
                      className="form-control"
                      tabIndex="1"
                      id="customerCode"
                      name="customerCode"
                      placeholder="--Select--"
                      value={this.state.selectedCustomerCode}
                      onChange={this.onChangeCustomerCode}
                      onSelect={this.onChangeCustomerCode}
                    >
                      <option value="(All)">(All)</option>
                      {this.state.customers.map((customer) => (
                        <option key={customer}>{customer}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-4 mg-t-5">
                    <b>Proj Code</b>
                  </div>
                  <div className="col-md-8">
                    <select
                      className="form-control"
                      tabIndex="2"
                      id="projectCode"
                      name="projectCode"
                      placeholder="--Select--"
                      value={this.state.selectedProjectCode}
                      onChange={this.onChangeProjectCode}
                    >
                      <option value="(All)">(All)</option>
                      {this.state.projectCodes.map((projectCode) => (
                        <option key={projectCode}>{projectCode}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
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
            </div>
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-5 mg-b-5">
              <div className="col-md-2">
                <div className="row">
                  <div className="col-md-5 mg-t-5">
                    <b>Department</b>
                  </div>
                  <div className="col-md-7">
                    <select
                      className="form-control"
                      id="department"
                      name="department"
                      placeholder="--Select--"
                      value={this.state.selectedDepartment}
                      onChange={this.onChangeDepartment}
                    >
                      <option value="(All)">(All)</option>
                      {this.state.departments.map((department) => (
                        <option key={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-4 mg-t-5">
                    <b>Emp Name</b>
                  </div>
                  <div className="col-md-8">
                    <ReactMultiSelectCheckboxes
                      onChange={this.onChangeEmployee}
                      options={this.state.employeeArray}
                      value={this.state.selectedOptions}
                    />
                  </div>
                </div>
              </div>
              {this.state.batches.length > 0 ? (
                <div className="col-md-2 mg-t-10 mg-lg-t-0">
                  <div className="row">
                    <div className="col-md-6 mg-t-5">
                      <b>Batch No.</b>
                    </div>
                    <div className="col-md-6">
                      <select
                        className="form-control"
                        id="batchNo"
                        name="batchNo"
                        placeholder="--Select--"
                        value={this.state.selectedBatchNo}
                        onChange={this.onChangeBatchNo}
                      >
                        <option value="(All)">(All)</option>
                        {this.state.batches.map((batchNo) => (
                          <option key={batchNo}>{batchNo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-md-2 mg-t-10 mg-lg-t-0"></div>
              )}
              <div className="col-md-5 mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-2 mg-t-5">
                    <b>Activity</b>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-control"
                      id="activity"
                      name="activity"
                      value={this.state.selectedActivity}
                      onChange={this.onChangeActivity}
                    >
                      <option value="(All)">(All)</option>
                      {this.state.activities.map((activity) => (
                        <option key={activity}>{activity}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <button
                      onClick={() => {
                        this.fetchEmployeesTaskReport(
                          true,
                          true,
                          true,
                          true,
                          true,
                          true,
                        );
                      }}
                      className="btn btn-gray-700 btn-block"
                      tabIndex="2"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-md-3">
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
            </div>
          </div>
          <div className="mg-l-50">
            <ToolkitProvider
              keyField="SlNo"
              data={this.state.filterValue === "" ? data : filteredData}
              columns={employeesTaskReportColumns}
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
                          this.state.employeesTaskReport.length > 0 && (
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
                    {employeesTaskReportLength > 0 && (
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
                          onClick={this.exportEmployeesTaskReportToExcel}
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
                    className="employees-task-report-table-height"
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
    //#endregion
  }
}

export default employeesTaskDetailsReport;
