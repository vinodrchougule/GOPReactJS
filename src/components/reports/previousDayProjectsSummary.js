import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import helper from "../../helpers/helpers";
import Moment from "moment";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import ModernDatepicker from "react-modern-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import projectsSummaryService from "../../services/projectsSummary.service";
toast.configure();

class previousDayProjectStatus extends Component {
  constructor(props) {
    super(props);

    this.fetchProjectsSummary = this.fetchProjectsSummary.bind(this);
    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);

    //#region State Variable
    this.state = {
      ProjectsSummary: [],
      fromDate: "",
      toDate: "",
      projectID: [],
      activityDetails: [],
      formErrors: "",
      loading: false,
      spinnerMessage: "",
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
      () => this.fetchProjectsSummary()
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

  //#region fetch Projects Summary Report
  fetchProjectsSummary() {
    if (this.handleDateValidation()) {
      this.setState({
        spinnerMessage: "Please wait while fetching Projects Summary...",
        loading: true,
      });

      projectsSummaryService
        .ReadProjectsSummaryReportData(this.state.fromDate, this.state.toDate)
        .then((response) => {
          if (response.data.length === 0) {
            toast.error("No Data Found!!");
          }

          let projectID = response.data.map((a) => a.ProjectID);

          this.setState({
            projectID: projectID,
            ProjectsSummary: response.data,
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
      ProjectsSummary: [],
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
      ProjectsSummary: [],
    });
  }
  //#endregion

  render() {
    //#region Projects Summary Columns
    const projectSummaryColumns = [
      {
        dataField: "index",
        text: "Sl No.",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "80px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProjectID",
        text: "Project ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "150px",
        },
        headerAlign: "center",
        align: "center",
        hidden: true,
      },
      {
        dataField: "CustomerCode",
        text: "Cus Code",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProjectCode",
        text: "Proj Code",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "BatchNo",
        text: "Batch No",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "InputCount",
        text: "Input Count ",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "Scope",
        text: "Scope",
        style: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
        title: true,
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
      },
    ];
    //#endregion

    //#region Project Activity Summary columns
    const projectActivitySummaryColumns = [
      {
        dataField: "Activity",
        text: "Activity",
        style: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
        headerStyle: {
          backgroundColor: "#f2f8fb",
          fontWeight: "bold",
        },
        headerAlign: "center",
      },
      {
        dataField: "ActivityCount",
        text: "Activity Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          fontWeight: "bold",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionCompletedCount",
        text: "Production Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          fontWeight: "bold",
        },
        headerAlign: "center",
        align: "center",
        hidden: true,
      },
      {
        dataField: "ProductionCompletedPercentage",
        text: "Production Completed Count (%)",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          fontWeight: "bold",
        },
        headerAlign: "center",
        align: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          // `${row.ProductionCompletedCount>0?row.ProductionCompletedCount}`
          `${row.ProductionCompletedCount} ${
            row.ProductionCompletedPercentage > 0
              ? " (" + row.ProductionCompletedPercentage + "%)"
              : ""
          }`,
      },
      {
        dataField: "QCCompletedCount",
        text: "Production Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          fontWeight: "bold",
        },
        headerAlign: "center",
        align: "center",
        hidden: true,
      },
      {
        dataField: "QCCompletedPercentage",
        text: "QC Completed Count (%)",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          fontWeight: "bold",
        },
        headerAlign: "center",
        align: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${row.QCCompletedCount} ${
            row.QCCompletedPercentage > 0
              ? " (" + row.QCCompletedPercentage + "%)"
              : ""
          }`,
      },
    ];
    //#endregion

    //#region Expand Projects Summary Row
    const expandProjectsSummaryReportRow = {
      parentClassName: "rowBackgroundColor",
      renderer: (row) => (
        <div>
          <BootstrapTable
            keyField="Activity"
            data={row.ActivityDetails}
            columns={projectActivitySummaryColumns}
          />
        </div>
      ),
      expanded: this.state.projectID,
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
                    {this.state.formErrors["fromDateError"] && (
                      <div className="error-message">
                        {this.state.formErrors["fromDateError"]}
                      </div>
                    )}
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
                    onClick={this.fetchProjectsSummary}
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
          <div
            className="mg-l-50 mg-t-10 previousDay-Projects-Summary"
            style={{
              overflowY: "scroll",
              //borderBottom: "1px solid #cdd4e0",
            }}
          >
            <BootstrapTable
              keyField="ProjectID"
              data={this.state.ProjectsSummary}
              columns={projectSummaryColumns}
              expandRow={expandProjectsSummaryReportRow}
              classes="table-98"
              condensed
            />
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default previousDayProjectStatus;
