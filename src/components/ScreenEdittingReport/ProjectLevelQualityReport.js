import { Component } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { Button } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import productionAllocationService from "../../services/productionAllocation.service";
import productionService from "../../services/production.service";
import "./ProjectLevelQualityReport.scss";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";

toast.configure();

//#region Project Level Quality SKUs List Col Defs
const projectLevelQualitySKUsListColDefs = [
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
    accessorKey: "ProductionStatus",
    header: "Production Status",
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
    accessorKey: "QCStatus",
    header: "QC Status",
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

export default class ProjectLevelQualityReport extends Component {
  //#region constructor
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.state = {
      customerCodes: [],
      selectedCustomerCode: "",
      projectCodes: [],
      selectedProjectCode: "",
      batchNos: [],
      selectedBatchNo: "",
      isBatchExist: true,
      projectScope: "",
      selectedStatus: "P",
      volume: "-",
      processedCount: "-",
      allocatedCount: "-",
      acceptedCount: "-",
      acceptedPercentage: "-",
      rejectedCount: "-",
      nmChangedCount: "-",
      nmChangedPercentage: "-",
      attributeChangedCount: "-",
      attributeChangedPercentage: "-",
      mfrOrSupplierChangedCount: "-",
      mfrOrSupplierChangedPercentage: "-",
      projectLevelQualitySKUsListData: [],
      loading: false,
      spinnerMessage: "",
    };

    this.initialState = this.state;
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

    this.fetchCustomerCodes();
  }
  //#endregion

  //#region fetching customer codes from Web API
  fetchCustomerCodes() {
    this.setState({
      spinnerMessage: "Please wait while fetching Customer codes...",
      loading: true,
    });

    productionAllocationService
      .getCustomerCodes()
      .then((response) => {
        this.setState({
          customerCodes: response.data,
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  //#endregion

  //#region On Change Customer Code
  onChangeCustomerCode = (e) => {
    this.setState({
      selectedCustomerCode: e.target.value,
      isBatchExist: true,
      batchNos: [],
      projectScope: "",
      projectLevelQualitySKUsListData: [],
    });
    this.fetchProjectCodesOfCustomer(e.target.value);
  };
  //#endregion

  //#region Fetch Project Codes Of Customer
  fetchProjectCodesOfCustomer = (customerCode) => {
    if (!customerCode) {
      this.setState({
        projectCodes: [],
        selectedProjectCode: "",
      });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Project codes...",
      loading: true,
    });

    productionAllocationService
      .getProjectCodesOfCustomer(customerCode)
      .then((response) => {
        this.setState({
          projectCodes: response.data,
          batchNos: [],
          selectedBatchNo: "",
          selectedCustomerCode: customerCode,
          selectedProjectCode: "",
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };
  //#endregion

  //#region On Change Project Code
  onChangeProjectCode = (e) => {
    this.setState({
      selectedProjectCode: e.target.value,
      isBatchExist: true,
      projectScope: "",
      projectLevelQualitySKUsListData: [],
    });
    this.fetchBatchNosOfProject(
      this.state.selectedCustomerCode,
      e.target.value,
    );
  };
  //#endregion

  //#region Fetch Batch Nos. of Project
  fetchBatchNosOfProject = (customerCode, projectCode) => {
    if (!customerCode || !projectCode) {
      this.setState({
        batchNos: [],
        selectedBatchNo: "",
        isBatchExist: false,
      });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Batch Nos...",
      loading: true,
    });

    productionAllocationService
      .getBatchesOfProject(customerCode, projectCode)
      .then((response) => {
        if (response.data.length !== 0) {
          this.setState({
            batchNos: response.data,
            isBatchExist: true,
            loading: false,
          });
        } else {
          this.setState(
            {
              batchNos: [],
              selectedBatchNo: "",
              isBatchExist: false,
            },
            () => this.fetchCountStatsAndSKUDetails(),
          );
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Count Stats and SKU details both
  fetchCountStatsAndSKUDetails = async () => {
    await this.fetchProjectLevelQualityCountStats();
    this.fetchSKUDetails();
  };
  //#endregion

  //#region On Change Batch No.
  onChangeBatchNo = (e) => {
    this.setState(
      {
        selectedBatchNo: e.target.value,
      },
      () => this.fetchCountStatsAndSKUDetails(),
    );
  };
  //#endregion

  //#region Fetch Count Stats
  fetchProjectLevelQualityCountStats = async () => {
    const { selectedCustomerCode, selectedProjectCode, selectedBatchNo } =
      this.state;

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while fetching Project Level Quality Stats...",
    });

    productionService
      .readProjectLevelQualityReportCountStats(
        selectedCustomerCode,
        selectedProjectCode,
        selectedBatchNo,
      )
      .then((response) => {
        const data = response.data;
        this.setState({
          volume: data.Volume,
          processedCount: data.ProcessedCount,
          allocatedCount: data.AllocatedCount,
          acceptedCount: data.QCApprovedCount,
          acceptedPercentage: data.AcceptedPercentage,
          rejectedCount: data.RejectedCount,
          nmChangedCount: data.NMChangedCount,
          nmChangedPercentage: data.NMChangedPercentage,
          attributeChangedCount: data.AttributeChangedCount,
          attributeChangedPercentage: data.AttributeChangedPercentage,
          mfrOrSupplierChangedCount: data.MFRorSupplierChangedCount,
          mfrOrSupplierChangedPercentage: data.MFRorSupplierChangedPercentage,
          projectScope: data.ProjectScope,
        });
      })
      .catch((e) => {
        toast.error(e.response?.data?.Message || "Error occurred.", {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Fetch SKU details
  fetchSKUDetails = () => {
    const {
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      selectedStatus,
    } = this.state;

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while fetching Project Level Quality Report SKUs...",
    });

    productionService
      .readProjectLevelQualityReportSKUDetails(
        selectedCustomerCode,
        selectedProjectCode,
        selectedBatchNo,
        selectedStatus,
      )
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.ProductionItemsList)
        ) {
          const data = response.data.ProductionItemsList;
          this.setState({
            projectLevelQualitySKUsListData: data || [],
          });
        } else {
          this.setState({
            projectLevelQualitySKUsListData: [],
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

  //#region Export SKU Details List to Excel
  exportListToExcel = () => {
    const {
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      selectedStatus,
    } = this.state;

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while exporting Project Level Quality Report SKUs List to excel...",
    });

    let fileName = "Project Level Quality Report.xlsx";

    productionService
      .exportProjectLevelQualityReportToExcel(
        selectedCustomerCode,
        selectedProjectCode,
        selectedBatchNo,
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
            <div className="row reportIncidentSelectText mg-t-10 mg-b-10">
              <div className="col-md-2 mg-l-15">
                <FloatingLabel
                  label="Customer Code"
                  className="float-hidden float-select"
                >
                  <select
                    className="form-control"
                    tabIndex="1"
                    id="customerCode"
                    name="customerCode"
                    value={this.state.selectedCustomerCode}
                    onChange={this.onChangeCustomerCode}
                  >
                    <option value="">---Select Customer Code---</option>
                    {this.state.customerCodes.map((c) => (
                      <option key={c.CustomerCode} value={c.CustomerCode}>
                        {c.CustomerCode}
                      </option>
                    ))}
                  </select>
                </FloatingLabel>
              </div>
              <div className="col-md-2">
                <FloatingLabel
                  label="Project Code"
                  className="float-hidden float-select"
                >
                  <select
                    className="form-control"
                    tabIndex="1"
                    id="projectCode"
                    name="projectCode"
                    value={this.state.selectedProjectCode}
                    onChange={this.onChangeProjectCode}
                  >
                    <option value="">---Select Project Code---</option>
                    {this.state.projectCodes.map((pc) => (
                      <option key={pc.ProjectCode} value={pc.ProjectCode}>
                        {pc.ProjectCode}
                      </option>
                    ))}
                  </select>
                </FloatingLabel>
              </div>
              <div className="col-md-2">
                {this.state.isBatchExist ? (
                  <FloatingLabel
                    label="Batch No."
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control"
                      tabIndex="1"
                      id="batchNo"
                      name="batchNo"
                      value={this.state.selectedBatchNo}
                      onChange={this.onChangeBatchNo}
                    >
                      <option value="">---Select Batch No.---</option>
                      {this.state.batchNos.map((bn) => (
                        <option key={bn.BatchNo} value={bn.BatchNo}>
                          {bn.BatchNo}
                        </option>
                      ))}
                    </select>
                  </FloatingLabel>
                ) : (
                  <FloatingLabel
                    label="Batch No."
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      style={{ textAlign: "center" }}
                      value="N / A"
                      readOnly
                    />
                  </FloatingLabel>
                )}
              </div>
              <div className="col-md-4">
                <FloatingLabel
                  label="Scope"
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: "480px" }}
                    value={this.state.projectScope || ""}
                    readOnly
                  />
                </FloatingLabel>
              </div>
              <div className="col-md-1 mg-l-80">
                <Button
                  variant="secondary"
                  className="vewsubmit-button"
                  style={{ width: "75px" }}
                  onClick={this.resetComponent}
                >
                  <i class="fa fa-refresh mr-1"></i>Refresh
                </Button>
              </div>
            </div>
          </div>
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <div class="container mt-2 mb-2">
              <div class="d-flex flex-wrap gap-4 justify-content-start card-group">
                <div class="status-card">
                  <div class="status-header">Volume Status</div>
                  <div class="status-row">
                    <div class="status-cell">Volume</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.volume}
                    </div>
                    <div class="status-cell"></div>
                  </div>
                  <div class="status-row">
                    <div class="status-cell">Processed</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.processedCount}
                    </div>
                    <div class="status-cell" style={{ alignContent: "center" }}>
                      <input
                        type="radio"
                        name="group1"
                        id="radio-processed"
                        value="P"
                        checked={this.state.selectedStatus === "P"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div class="status-row">
                    <div class="status-cell">Allocated</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.allocatedCount}
                    </div>
                    <div class="status-cell">
                      <input
                        type="radio"
                        name="group1"
                        id="radio-allocated"
                        value="L"
                        checked={this.state.selectedStatus === "L"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div class="status-card1"></div>
                <div class="status-card ml-5">
                  <div class="status-header">Acceptance %</div>
                  <div class="status-row">
                    <div class="status-cell">Accepted</div>
                    {this.state.acceptedPercentage > 0 ? (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        {this.state.acceptedPercentage} %
                      </div>
                    ) : (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        -
                      </div>
                    )}
                    <div class="status-cell"></div>
                  </div>
                  <div class="status-row">
                    <div class="status-cell">Accepted</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.acceptedCount}
                    </div>
                    <div class="status-cell">
                      <input
                        type="radio"
                        name="group1"
                        id="radio-accepted"
                        value="Q"
                        checked={this.state.selectedStatus === "Q"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div class="status-row">
                    <div class="status-cell">Rejected</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.rejectedCount}
                    </div>
                    <div class="status-cell">
                      <input
                        type="radio"
                        name="group1"
                        id="radio-rejected"
                        value="R"
                        checked={this.state.selectedStatus === "R"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div class="status-card1"></div>
                <div class="status-card2 ml-5">
                  <div class="status-header">Change Details</div>
                  <div class="status-row">
                    <div class="status-cell">NM Changed</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.nmChangedCount}
                    </div>
                    {this.state.nmChangedPercentage > 0 ? (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        {this.state.nmChangedPercentage} %
                      </div>
                    ) : (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        -
                      </div>
                    )}
                    <div class="status-cell">
                      <input
                        type="radio"
                        name="group1"
                        id="radio-nmchanged"
                        value="N"
                        checked={this.state.selectedStatus === "N"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div class="status-row">
                    <div class="status-cell">Attribute Changed</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.attributeChangedCount}
                    </div>
                    {this.state.attributeChangedPercentage > 0 ? (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        {this.state.attributeChangedPercentage} %
                      </div>
                    ) : (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        -
                      </div>
                    )}
                    <div class="status-cell">
                      <input
                        type="radio"
                        name="group1"
                        id="radio-attributechanged"
                        value="A"
                        checked={this.state.selectedStatus === "A"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div class="status-row">
                    <div class="status-cell">MFR / Supplier Changed</div>
                    <div class="status-cell" style={{ textAlign: "center" }}>
                      {this.state.mfrOrSupplierChangedCount}
                    </div>
                    {this.state.mfrOrSupplierChangedPercentage > 0 ? (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        {this.state.mfrOrSupplierChangedPercentage} %
                      </div>
                    ) : (
                      <div class="status-cell" style={{ textAlign: "center" }}>
                        -
                      </div>
                    )}
                    <div class="status-cell">
                      <input
                        type="radio"
                        name="group1"
                        id="radio-mfrsupplierchanged"
                        value="M"
                        checked={this.state.selectedStatus === "M"}
                        onChange={(e) => {
                          this.setState(
                            { selectedStatus: e.target.value },
                            () => {
                              this.fetchSKUDetails(); // Called only after state is updated
                            },
                          );
                        }}
                      />
                    </div>
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
              columns={projectLevelQualitySKUsListColDefs}
              data={this.state.projectLevelQualitySKUsListData}
              className="onGoingProjectListTable"
              initialState={{ density: "compact" }}
              enableRowVirtualization={true}
              enableRowExpansion={false}
              enableColumnFilterModes
              enableColumnOrdering={false}
              enableRowSelection={false}
              enableFullScreenToggle={true}
              enablePagination={false}
              enableStickyHeader={true}
              muiTableContainerProps={{
                sx: {
                  height: {
                    xs: "calc(100vh - 180px)", // mobile
                    sm: "calc(100vh - 160px)", // small devices
                    md: "calc(100vh - 140px)", // tablets/small laptops
                    lg: "calc(100vh - 120px)", // desktops
                    xl: "calc(100vh - 100px)", // large screens
                  },
                  maxHeight: {
                    xs: "calc(100vh - 180px)",
                    sm: "calc(100vh - 160px)",
                    md: "calc(100vh - 140px)",
                    lg: "calc(100vh - 120px)",
                    xl: "calc(100vh - 100px)",
                  },
                  overflowY: "auto",
                  width: "100%",
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
                    <IconButton onClick={this.exportListToExcel}>
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
        </LoadingOverlay>
      </div>
    );
  }
  //#endregion
}
