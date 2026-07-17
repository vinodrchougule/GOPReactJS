import { Component } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import ModernDatepicker from "react-modern-datepicker";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";
import productionService from "../../services/production.service";
import { Box } from "@mui/material";
import moment from "moment";
import { IconButton, Tooltip } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import { toast } from "react-toastify";

toast.configure();

//#region SKUs List Col Defs
const SKUsListColDefs = [
  {
    accessorKey: "Date",
    header: "Date",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
    Cell: ({ row }) => (
      <div>{moment(row.original.UpdatedOn).format("DD-MMM-YYYY")}</div>
    ),
  },
  {
    accessorKey: "ProductionUser",
    header: "Production User",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
  {
    accessorKey: "QCUser",
    header: "QC User",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "CustomerCode",
    header: "Customer Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "ProjectCode",
    header: "Project Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "BatchNo",
    header: "Batch No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "UniqueID",
    header: "Unique ID",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "ShortDescription",
    header: "Short Description",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "LongDescription",
    header: "Long Description",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "UOM",
    header: "UOM",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "NewShortDescription",
    header: "New Short Description",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "NewLongDescription",
    header: "New Long Description",
    size: 800,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "800px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "MissingWords",
    header: "Missing Words",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "MFRName",
    header: "MFR Name",
    size: 120,
  },
  {
    accessorKey: "MFRPN",
    header: "MFR P/N",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName",
    header: "Vendor Name",
    size: 120,
  },
  {
    accessorKey: "VendorPN",
    header: "Vendor P/N",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "Noun",
    header: "Noun",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "Modifier",
    header: "Modifier",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "Level",
    header: "Level",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "MFRName1",
    header: "MFR Name1",
    size: 120,
  },
  {
    accessorKey: "MFRPN1",
    header: "MFR P/N 1",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "MFRName2",
    header: "MFR Name2",
    size: 120,
  },
  {
    accessorKey: "MFRPN2",
    header: "MFR P/N 2",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "MFRName3",
    header: "MFR Name3",
    size: 120,
  },
  {
    accessorKey: "MFRPN3",
    header: "MFR P/N 3",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName1",
    header: "Vendor Name1",
    size: 120,
  },
  {
    accessorKey: "VendorPN1",
    header: "Vendor P/N 1",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName2",
    header: "Vendor Name2",
    size: 120,
  },
  {
    accessorKey: "VendorPN2",
    header: "Vendor P/N 2",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName3",
    header: "Vendor Name3",
    size: 120,
  },
  {
    accessorKey: "VendorPN3",
    header: "Vendor P/N 3",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "AdditionalInfoFromInput",
    header: "Additional Info From Input",
    size: 800,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "800px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "AdditionalInfoFromWeb",
    header: "Additional Info From Web",
    size: 800,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "800px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "UNSPSCCode",
    header: "UNSPSC Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "UNSPSCCategory",
    header: "UNSPSC Category",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "WebRefURL1",
    header: "Web Ref URL1",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "WebRefURL2",
    header: "Web Ref URL2",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "WebRefURL3",
    header: "Web Ref URL3",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "PDFURL",
    header: "PDF URL",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "Remarks",
    header: "Remarks",
    muiTableHeadCellProps: {
      align: "left",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    size: 120,
  },
  {
    accessorKey: "Query",
    header: "Query",
    muiTableHeadCellProps: {
      align: "left",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    size: 120,
  },
  {
    accessorKey: "Application",
    header: "Application",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "DWG",
    header: "DWG",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "ItemNo",
    header: "Item No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "OtherNo",
    header: "Other No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "POS",
    header: "POS",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "SerialNo",
    header: "Serial No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "KKSCode",
    header: "KKS Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "AssemblyOrPart",
    header: "Assembly / Part",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "BOM",
    header: "BOM",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "GreenItems",
    header: "Green Items",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
];
//#endregion

export default class DateRangeStatusReport extends Component {
  //#region constructor
  constructor(props) {
    super(props);

    this.state = {
      fromDate: "",
      toDate: "",
      selectedStatus: "A",
      processedCount: 0,
      qcApprovedCount: 0,
      rejectedCount: 0,
      queryCount: 0,
      datewiseCountListData: [],
      loading: false,
      spinnerMessage: "",
      formErrors: {},
    };

    this.initialState = this.state;

    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
    this.exportDateRangeStatusListToExcel =
      this.exportDateRangeStatusListToExcel.bind(this);
    this.resetComponent = this.resetComponent.bind(this);
  }
  //#endregion

  //#region component did mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
  }
  //#endregion

  //#region On Change From Date
  onChangeFromDate = (date) => {
    this.setState((prevState) => ({
      fromDate: date,
      formErrors: {
        ...prevState.formErrors,
        fromDateError: "",
      },
    }));
  };
  //#endregion

  //#region On Change To Date
  onChangeToDate = (date) => {
    this.setState((prevState) => ({
      toDate: date,
      formErrors: {
        ...prevState.formErrors,
        toDateError: "",
      },
    }));
  };
  //#endregion

  //#region View Report
  viewReport = () => {
    if (this.handleFormValidation()) {
      this.setState({
        loading: true,
        spinnerMessage: "Please wait while fetching Date Range Status...",
      });

      const { fromDate, toDate, selectedStatus } = this.state;
      setTimeout(() => {
        productionService
          .readDateRangeStatus(fromDate, toDate, selectedStatus)
          .then((response) => {
            if (
              response.data.Success === 1 &&
              Array.isArray(response.data.ProductionItemsList)
            ) {
              const data = response.data.ProductionItemsList;
              this.setState({
                datewiseCountListData: data || [],
                processedCount: response.data.ProcessedCount || 0,
                qcApprovedCount: response.data.QCApprovedCount || 0,
                rejectedCount: response.data.RejectedCount || 0,
                queryCount: response.data.QueryCount || 0,
              });
            } else {
              this.setState({
                datewiseCountListData: [],
                processedCount: 0,
                qcApprovedCount: 0,
                rejectedCount: 0,
                queryCount: 0,
              });
            }
          })
          .catch((e) => {
            toast.error(e.response?.data?.Message || "Error occurred.", {
              autoClose: false,
            });
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      });
    }
  };
  //#endregion

  //#region Handle form validation
  handleFormValidation = () => {
    let isValidForm = true;
    let errors = {};

    const { fromDate, toDate } = this.state;

    if (!fromDate) {
      isValidForm = false;
      errors.fromDateError = "From date is required";
    }

    if (!toDate) {
      isValidForm = false;
      errors.toDateError = "To date is required";
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        isValidForm = false;
        errors.dateRangeError =
          "To date must be later than or equal to From date";
      }
    }

    this.setState({ formErrors: errors });

    return isValidForm;
  };
  //#endregion

  //#region Export Date Range Status List to Excel
  exportDateRangeStatusListToExcel = () => {
    if (this.handleFormValidation()) {
      this.setState({
        loading: true,
        spinnerMessage:
          "Please wait while exporting Date Range Status List to excel...",
      });

      let fileName = "Date Range Status List.xlsx";

      const { fromDate, toDate, selectedStatus } = this.state;

      productionService
        .exportDateRangeStatusListToExcel(
          fromDate,
          toDate,
          helper.getUser(),
          selectedStatus,
        )
        .then((response) => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((e) => {
          toast.error(e.response.data.Message, { autoClose: false });
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  };
  //#endregion

  //#region Reset Component
  resetComponent = () => {
    this.setState({
      spinnerMessage: "Please wait while reloading...",
      loading: true,
    });
    this.setState(this.initialState);
    this.componentDidMount();
  };
  //#endregion

  //#region render
  render() {
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
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-15 mg-b-15">
              <div className="col-lg">
                <div className="row">
                  <div className="col-md-12">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            From Date <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select"
                      >
                        <div className="form-control">
                          <ModernDatepicker
                            date={this.state.fromDate}
                            format={"DD-MMM-YYYY"}
                            onChange={this.onChangeFromDate}
                            className="color"
                            placeholder={"Select a date"}
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                      </FloatingLabel>
                    </div>
                    <div className="error-message">
                      {this.state.formErrors["fromDateError"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            To Date <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select"
                      >
                        <div className="form-control">
                          <ModernDatepicker
                            date={this.state.toDate}
                            format={"DD-MMM-YYYY"}
                            onChange={this.onChangeToDate}
                            className="color"
                            placeholder={"Select a date"}
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                      </FloatingLabel>
                    </div>
                    <div className="error-message">
                      {this.state.formErrors["toDateError"]}
                      {this.state.formErrors["dateRangeError"]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row">
                  <div className="col-md-6">
                    <button
                      onClick={this.viewReport}
                      className="btn btn-gray-700 btn-block"
                      tabIndex="2"
                    >
                      View Report
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      onClick={this.resetComponent}
                      className="btn btn-gray-700 btn-block"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ border: "1px solid #cdd4e0", backgroundColor: "#4472C4" }}
            className="mg-l-50 mg-r-25 mg-b-10 text-white"
          >
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-10 mg-b-10">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row" style={{ width: "100%" }}>
                  <div style={{ marginLeft: "2%", width: "20%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-all"
                      value="A"
                      checked={this.state.selectedStatus === "A"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.viewReport(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-all"
                    >
                      All
                    </label>
                  </div>
                  <div style={{ width: "20%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-processed"
                      value="P"
                      checked={this.state.selectedStatus === "P"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.viewReport(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-processed"
                    >
                      Processed
                    </label>
                  </div>
                  <div style={{ width: "20%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-qcapproved"
                      value="Q"
                      checked={this.state.selectedStatus === "Q"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.viewReport(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-qcapproved"
                    >
                      QC Approved
                    </label>
                  </div>
                  <div style={{ width: "20%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-rejected"
                      value="R"
                      checked={this.state.selectedStatus === "R"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.viewReport(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-rejected"
                    >
                      Rejected
                    </label>
                  </div>
                  <div style={{ width: "15%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-query"
                      value="U"
                      checked={this.state.selectedStatus === "U"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.viewReport(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="radio-query"
                      mg-t-2
                    >
                      Query
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <MaterialReactTable
              columns={SKUsListColDefs}
              data={this.state.datewiseCountListData}
              enableRowVirtualization={true}
              className="onGoingProjectListTable"
              initialState={{ density: "compact" }}
              enableRowExpansion={false}
              enableColumnFilterModes
              enableColumnOrdering={false}
              enableRowSelection={false}
              enableFullScreenToggle={true}
              enablePagination={false}
              enableStickyHeader={true}
              muiTableContainerProps={{
                sx: {
                  height: "290px",
                  maxHeight: "290px", // 👈 change this to your desired height
                },
              }}
              muiTableBodyRowProps={({ row }) => ({
                sx: {
                  backgroundColor:
                    row.index % 2 === 0
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(244, 246, 248, 1)",
                },
              })}
              renderTopToolbarCustomActions={() => (
                <Box
                  sx={{
                    display: "flex",
                    gap: "16px",
                    padding: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip title="Export Excel">
                    <IconButton onClick={this.exportDateRangeStatusListToExcel}>
                      <FaFileExcel
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          fontSize: "1.3rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
          </div>
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <div
              className="d-flex justify-content-between align-items-center text-white py-2 px-3 rounded"
              style={{ backgroundColor: "#4472C4" }}
            >
              {(this.state.selectedStatus === "A" ||
                this.state.selectedStatus === "P") && (
                <div className="col">
                  <strong>Processed Count : </strong>
                  {this.state.processedCount}
                </div>
              )}
              {(this.state.selectedStatus === "A" ||
                this.state.selectedStatus === "Q") && (
                <div className="col">
                  <strong>QC Approved Count : </strong>
                  {this.state.qcApprovedCount}
                </div>
              )}
              {(this.state.selectedStatus === "A" ||
                this.state.selectedStatus === "R") && (
                <div className="col">
                  <strong>Rejected Count : </strong>
                  {this.state.rejectedCount}
                </div>
              )}
              {(this.state.selectedStatus === "A" ||
                this.state.selectedStatus === "U") && (
                <div className="col">
                  <strong>Query Count : </strong> {this.state.queryCount}
                </div>
              )}
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
  //#endregion
}
