import React, { Component } from "react";
import loginService from "../../services/login.service";
import userService from "../../services/user.service";
import helper from "../../helpers/helpers";
import EmployeeSpecificDatewiseDetailsReport from "./employeeSpecificDatewiseDetailsReport";
import EmployeeSpecificDatewiseSummaryReport from "./employeeSpecificDatewiseSummaryReport";
import Moment from "moment";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import ModernDatepicker from "react-modern-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class employeeSpecificReport extends Component {
  constructor(props) {
    super(props);

    this.divScrollRef = React.createRef();

    this.onChangeEmployee = this.onChangeEmployee.bind(this);
    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.getEmployeeDetails = this.getEmployeeDetails.bind(this);

    //#region State Variables
    this.state = {
      activeTab: 0,
      defaultActiveKey: "",
      fromDate: "",
      toDate: "",
      users: [],
      selectedEmployee: "",
      formErrors: "",
      loading: false,
      spinnerMessage: "",
      employee: "",
      department: "",
      manager: "",
      isToDisplayEmployeeSpecificReport: false,
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

    this.fetchUsersList();

    var fromDate = new Date();
    var toDate = new Date();

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    fromDate.setDate(firstDay.getDate());
    toDate.setDate(toDate.getDate());

    this.setState({
      fromDate: Moment(fromDate).format("DD-MMM-yyyy"),
      toDate: Moment(toDate).format("DD-MMM-yyyy"),
    });
  }
  //#endregion

  //#region Toggle Tab
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }
  //#endregion

  //#region fetching Users List from Web API
  fetchUsersList() {
    this.setState({
      spinnerMessage: "Please wait while fetching Employees...",
      loading: true,
    });

    userService
      .getAllUsers(helper.getUser())
      .then((response) => {
        this.setState({
          users: response.data,
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
      isToDisplayEmployeeSpecificReport: false,
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
      isToDisplayEmployeeSpecificReport: false,
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    });

    if (date !== "" && date !== null) {
      const formErrors = { ...this.state.formErrors, toDateError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Get Selected Employee
  onChangeEmployee(e) {
    this.setState(
      {
        selectedEmployee: e.target.value,
        isToShowFilteringField: false,
        isToShowSortingFields: false,
        manager: "",
        department: "",
        isToDisplayEmployeeSpecificReport: false,
      },
      () => this.getEmployeeDetails()
    );

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, employeeError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Get Employee Details
  getEmployeeDetails() {
    this.setState({
      spinnerMessage: "Please wait while fetching the Employee Details...",
      loading: true,
    });

    const employeeArray = this.state.selectedEmployee.split("-");
    const employeeCode = employeeArray[employeeArray.length - 1].trim();

    //Service Call
    loginService
      .getUsername(employeeCode)
      .then((response) => {
        this.setState({
          department: response.data.DepartmentName,
          manager: response.data.ManagerName,
          loading: false,
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Validating the Data
  handleDateValidation() {
    var fromDateValue = new Date(this.state.fromDate);
    var toDateValue = new Date(this.state.toDate);

    const employee = this.state.selectedEmployee.trim();

    const fromDate = this.state.fromDate.trim();
    const toDate = this.state.toDate.trim();

    let formErrors = {};
    let isValidForm = true;

    //Employee
    if (!employee) {
      isValidForm = false;
      formErrors["employeeError"] = "Employee is required";
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

  //#region fetch Report
  viewReport() {
    if (this.handleDateValidation()) {
      this.setState({
        activeTab: 1,
        defaultActiveKey: "employeeSpecificDatewiseSummaryReport",
        isToDisplayEmployeeSpecificReport: true,
      });
    }
  }
  //#endregion

  render() {
    const defaultActiveKey = this.state.defaultActiveKey;
    const activeTab = this.state.activeTab;

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
              <div className="col-lg-4">
                <div className="row">
                  <div className="col-md-4">
                    <b>Employee</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-8">
                    <select
                      className="form-control"
                      tabIndex="1"
                      id="employee"
                      name="employee"
                      placeholder="--Select--"
                      value={this.state.selectedEmployee}
                      onChange={this.onChangeEmployee}
                    >
                      <option value="">--Select--</option>
                      {this.state.users.map((user) => (
                        <option key={user.UserID}>
                          {user.FirstName +
                            (user.MiddleName ? " " + user.MiddleName : "") +
                            (user.LastName ? " " + user.LastName : "") +
                            " - " +
                            user.UserName}
                        </option>
                      ))}
                    </select>
                    <div className="error-message">
                      {this.state.formErrors["employeeError"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mg-t-10 mg-lg-t-0">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <b>From Date</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-8">
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
              <div className="col-lg-3 mg-t-10 mg-lg-t-0">
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
              <div className="col-lg-2 mg-t-10 mg-lg-t-0">
                <div className="col-md-10">
                  <button
                    onClick={this.viewReport}
                    className="btn btn-gray-700 btn-block"
                    tabIndex="2"
                  >
                    View Report
                  </button>
                </div>
              </div>
            </div>
            <div className="row row-sm mg-t-5 mg-l-5">
              <div className="col-lg-4">
                <div className="row">
                  <div className="col-md-4">
                    <b>Department</b>
                  </div>
                  <div className="col-md-8">{this.state.department}</div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <b>Manager</b>
                  </div>
                  <div className="col-md-8">{this.state.manager}</div>
                </div>
              </div>
              <div className="col-lg-3"></div>
              <div className="col-lg-2"></div>
            </div>
          </div>
          {this.state.isToDisplayEmployeeSpecificReport && (
            <Tab.Container defaultActiveKey={defaultActiveKey}>
              <div className="row" style={{ marginRight: "15px" }}>
                <div className="col-md-10">
                  <Nav
                    variant="pills"
                    className="mg-l-50 mg-b-20 mg-t-10"
                    style={{ cursor: "pointer" }}
                  >
                    <Nav.Item>
                      <Nav.Link
                        eventKey="employeeSpecificDatewiseSummaryReport"
                        style={{ border: "1px solid #5E41FC" }}
                        onClick={() => {
                          this.toggle(1);
                        }}
                      >
                        Datewise Summary
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="employeeSpecificDatewiseDetailsReport"
                        style={{ border: "1px solid #5E41FC" }}
                        onClick={() => {
                          this.toggle(2);
                        }}
                      >
                        Datewise Details
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <Tab.Content>
                <Tab.Pane eventKey="employeeSpecificDatewiseSummaryReport">
                  {activeTab === 1 && (
                    <EmployeeSpecificDatewiseSummaryReport
                      employee={this.state.selectedEmployee}
                      fromDate={this.state.fromDate}
                      toDate={this.state.toDate}
                    />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="employeeSpecificDatewiseDetailsReport">
                  {activeTab === 2 && (
                    <EmployeeSpecificDatewiseDetailsReport
                      employee={this.state.selectedEmployee}
                      fromDate={this.state.fromDate}
                      toDate={this.state.toDate}
                    />
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </LoadingOverlay>
      </div>
    );
  }
}

export default employeeSpecificReport;
