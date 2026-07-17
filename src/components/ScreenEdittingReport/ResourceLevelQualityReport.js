import { Component } from "react";
import helper from "../../helpers/helpers";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import ModernDatepicker from "react-modern-datepicker";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import productionAllocationService from "../../services/productionAllocation.service";
import productionService from "../../services/production.service";
import { toast } from "react-toastify";

toast.configure();

//#region Resource Level Quality SKUs List Col Defs
const resourceLevelQualitySKUsListColDefs = [
  {
    accessorKey: "CustomerCode",
    header: "Customer Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 130,
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
    size: 130,
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
    size: 130,
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

export default class ResourceLevelQualityReport extends Component {
  //#region constructor
  constructor() {
    super();

    this.state = {
      userNames: [],
      selectedUserName: "",
      customerCodes: [],
      selectedCustomerCode: "",
      projectCodes: [],
      selectedProjectCode: "",
      batchNos: [],
      selectedBatchNo: "",
      projectScope: "",
      isBatchExist: true,
      fromDate: null,
      toDate: null,
      allocatedCount: null,
      processedCount: null,
      qcApprovedCount: null,
      attributesChangedCount: null,
      attributeChangedPercentage: null,
      nmChangedCount: null,
      nmChangedPercentage: null,
      mfrOrSupplierChangedCount: null,
      mfrOrSupplierChangedPercentage: null,
      selectedStatus: "P",
      resourceLevelQualitySKUsListData: [],
      loading: false,
      spinnerMessage: "",
      formErrors: {},
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

    this.fetchUserNames();
    this.fetchCustomerCodes();
  }
  //#endregion

  //#region fetching user names from Web API
  fetchUserNames = () => {
    this.setState({
      spinnerMessage: "Please wait while fetching user names...",
      loading: true,
    });

    productionService
      .readProductionAndQCUniqueUserNames()
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.UserNamesList)
        ) {
          this.setState({
            userNames: response.data.UserNamesList,
          });
        } else {
          this.setState({
            userNames: [],
          });
        }
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

  //#region On Change User Name
  onChangeUserName = (e) => {
    if (e.target.value) {
      this.setState((prevState) => ({
        selectedUserName: e.target.value,
        formErrors: {
          ...prevState.formErrors,
          userError: "",
        },
      }));
    }
  };
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
      selectedProjectCode: "",
      selectedBatchNo: "",
      isBatchExist: true,
      batchNos: [],
      projectScope: "",
      resourceLevelQualitySKUsListData: [],
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
    if (e.target.value) {
      this.setState((prevState) => ({
        selectedProjectCode: e.target.value,
        selectedBatchNo: "",
        isBatchExist: true,
        projectScope: "",
        resourceLevelQualitySKUsListData: [],
        formErrors: {
          ...prevState.formErrors,
          projectCodeError: "",
        },
      }));
      this.fetchBatchNosOfProject(
        this.state.selectedCustomerCode,
        e.target.value,
      );
    }
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
          this.setState({
            batchNos: [],
            selectedBatchNo: "",
            isBatchExist: false,
          });
        }
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

  //#region On Change Batch No.
  onChangeBatchNo = (e) => {
    this.setState(
      {
        selectedBatchNo: e.target.value,
      },
      // () => this.fetchCountStatsAndSKUDetails()
    );
  };
  //#endregion

  //#region On Change From Date
  onChangeFromDate = (date) => {
    this.setState({
      fromDate: date,
    });
  };
  //#endregion

  //#region On Change To Date
  onChangeToDate = (date) => {
    this.setState({
      toDate: date,
    });
  };
  //#endregion

  //#region Fetch Count Stats and SKU details both
  fetchCountStatsAndSKUDetails = async () => {
    const { selectedCustomerCode, fromDate, toDate } = this.state;

    if (!selectedCustomerCode && !fromDate && !toDate) {
      toast.error("Please select Project / Date range", {
        autoClose: false,
      });
      return;
    }

    if (this.handleFormValidation()) {
      await this.fetchResourceLevelQualityCountStats();
      this.fetchSKUDetails();
    }
  };
  //#endregion

  //#region Handle form validation
  handleFormValidation = () => {
    let isValidForm = true;
    let errors = {};

    const {
      selectedUserName,
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      isBatchExist,
      fromDate,
      toDate,
    } = this.state;

    if (!selectedUserName) {
      isValidForm = false;
      errors.userError = "User is required";
    }

    if (selectedCustomerCode) {
      if (!selectedProjectCode) {
        isValidForm = false;
        errors.projectCodeError = "Project Code is required";
      }
    }

    if (selectedProjectCode && isBatchExist) {
      if (!selectedBatchNo) {
        isValidForm = false;
        errors.batchNoError = "Batch No. is required";
      }
    }

    if (fromDate) {
      if (!toDate) {
        isValidForm = false;
        errors.toDateError = "To date is required";
      }
    }

    if (toDate) {
      if (!fromDate) {
        isValidForm = false;
        errors.fromDateError = "From date is required";
      }
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

  //#region Fetch Count Stats
  fetchResourceLevelQualityCountStats = async () => {
    let userName = "";
    const {
      selectedUserName,
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      fromDate,
      toDate,
    } = this.state;

    let userNameArray = selectedUserName.split("-");

    if (userNameArray.length === 2) {
      userName = userNameArray[1].trim();
    }

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while fetching Resource Level Quality Count Stats...",
    });

    productionService
      .readResourceLevelQualityReportCountStats(
        userName,
        selectedCustomerCode,
        selectedProjectCode,
        fromDate,
        toDate,
        selectedBatchNo,
      )
      .then((response) => {
        const data = response.data;
        this.setState({
          allocatedCount: data.AllocatedCount,
          processedCount: data.ProcessedCount,
          qcApprovedCount: data.QCApprovedCount,
          attributesChangedCount: data.AttributeChangedCount,
          attributeChangedPercentage: data.AttributeChangedPercentage,
          nmChangedCount: data.NMChangedCount,
          nmChangedPercentage: data.NMChangedPercentage,
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
    let userName = "";
    const {
      selectedUserName,
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      fromDate,
      toDate,
      selectedStatus,
    } = this.state;

    let userNameArray = selectedUserName.split("-");

    if (userNameArray.length === 2) {
      userName = userNameArray[1].trim();
    }

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while fetching Resource Level Quality Report SKUs...",
    });

    productionService
      .readResourceLevelQualityReportSKUDetails(
        userName,
        selectedCustomerCode,
        selectedProjectCode,
        fromDate,
        toDate,
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
            resourceLevelQualitySKUsListData: data || [],
          });
        } else {
          this.setState({
            resourceLevelQualitySKUsListData: [],
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
    let userName = "";

    const {
      selectedUserName,
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      fromDate,
      toDate,
      selectedStatus,
    } = this.state;

    let userNameArray = selectedUserName.split("-");

    if (userNameArray.length === 2) {
      userName = userNameArray[1].trim();
    }

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while exporting Resource Level Quality Report SKUs List to excel...",
    });

    let fileName = "Resource Level Quality Report.xlsx";

    productionService
      .exportResourceLevelQualityReportToExcel(
        userName,
        selectedCustomerCode,
        selectedProjectCode,
        fromDate,
        toDate,
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
            className="d-flex justify-content-center align-items-center text-white mg-l-50 mg-r-25 mg-b-10"
            style={{ backgroundColor: "#4472C4" }}
          >
            <div className="d-flex align-items-center gap-2 mg-t-10 mg-b-10">
              <label
                className="form-check-label text-white me-2 mg-r-10"
                htmlFor="userName"
                style={{ "font-size": "0.875rem" }}
              >
                User
              </label>
              <select
                className="form-control"
                tabIndex="1"
                id="userName"
                name="userName"
                style={{
                  minWidth: "300px",
                  minHeight: "15px",
                  fontSize: "14px",
                }}
                placeholder="--Select--"
                value={this.state.selectedUserName}
                onChange={this.onChangeUserName}
              >
                <option value="">--Select--</option>
                {this.state.userNames.map((user) => (
                  <option key={user.UserName} value={user.UserName}>
                    {user.UserName}
                  </option>
                ))}
              </select>
            </div>
            <div className="error-message" style={{ paddingLeft: "5px" }}>
              {this.state.formErrors["userError"]}
            </div>
          </div>
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <div className="row reportIncidentSelectText mg-t-10 mg-b-10">
              <div className="col-md-2 mg-l-15">
                <FloatingLabel label="Customer Code" className="float-select">
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
                <div></div>
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
                <div className="error-message">
                  {this.state.formErrors["projectCodeError"]}
                </div>
              </div>
              <div className="col-md-2">
                {this.state.isBatchExist ? (
                  <>
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
                    {this.state.selectedProjectCode && (
                      <div className="error-message">
                        {this.state.formErrors["batchNoError"]}
                      </div>
                    )}
                  </>
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
                    style={{ width: "590px" }}
                    value={this.state.projectScope || ""}
                    readOnly
                  />
                </FloatingLabel>
              </div>
            </div>
            <div className="row reportIncidentSelectText mg-t-10 mg-b-10">
              <div className="col-md-2 mg-l-15">
                <div className="createProjectFloatingInput">
                  <FloatingLabel
                    label={<>From Date</>}
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
              <div className="col-md-2">
                <div className="createProjectFloatingInput">
                  <FloatingLabel
                    label={<>To Date</>}
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
              <div className="col-md-2"></div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-md-4">
                    <button
                      onClick={this.fetchCountStatsAndSKUDetails}
                      className="btn btn-gray-700 btn-block"
                      tabIndex="2"
                    >
                      View Report
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      onClick={this.resetComponent}
                      className="btn btn-gray-700 btn-block"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mg-l-50 mg-r-25 mg-b-10">
            <div
              className="d-flex justify-content-between align-items-center text-white py-2 px-3 mb-3"
              style={{ backgroundColor: "#4472C4" }}
            >
              <div className="col">
                <strong>Allocated</strong>
                <br />
                {this.state.allocatedCount}
              </div>
              <div className="col">
                <strong>Processed</strong>
                <br />
                {this.state.processedCount}
              </div>
              <div className="col">
                <strong>QC Approved</strong>
                <br />
                {this.state.qcApprovedCount}
              </div>
              <div className="col">
                <strong>Attributes Changed</strong>
                <br />
                {this.state.attributesChangedCount > 0 ? (
                  <>
                    {this.state.attributesChangedCount} (
                    {this.state.attributeChangedPercentage}
                    %)
                  </>
                ) : this.state.attributesChangedCount === 0 ? (
                  <>0</>
                ) : null}
              </div>
              <div className="col">
                <strong>NM Changed</strong>
                <br />
                {this.state.nmChangedCount > 0 ? (
                  <>
                    {this.state.nmChangedCount} (
                    {this.state.nmChangedPercentage}
                    %)
                  </>
                ) : this.state.nmChangedCount === 0 ? (
                  <>0</>
                ) : null}
              </div>
              <div className="col">
                <strong>MFR / Supplier Changed</strong>
                <br />
                {this.state.mfrOrSupplierChangedCount > 0 ? (
                  <>
                    {this.state.mfrOrSupplierChangedCount} (
                    {this.state.mfrOrSupplierChangedPercentage}
                    %)
                  </>
                ) : this.state.mfrOrSupplierChangedCount === 0 ? (
                  <>0</>
                ) : null}
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
                  <div style={{ marginLeft: "40px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-allocated"
                      value="L"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "L"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUDetails();
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-allocated"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Allocated
                    </label>
                  </div>
                  <div style={{ marginLeft: "10px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-processed"
                      value="P"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "P"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUDetails();
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-processed"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Processed
                    </label>
                  </div>
                  <div style={{ marginLeft: "12px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-qcApproved"
                      value="Q"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "Q"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUDetails();
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-qcApproved"
                      style={{ "font-size": "0.875rem" }}
                    >
                      QC Approved
                    </label>
                  </div>
                  <div style={{ marginLeft: "15px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-attributesChanged"
                      value="A"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "A"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUDetails();
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-qcapproved"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Attributes Changed
                    </label>
                  </div>
                  <div style={{ marginLeft: "5px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-nmChanged"
                      value="N"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "N"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUDetails();
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-nmChanged"
                      style={{ "font-size": "0.875rem" }}
                    >
                      NM Changed
                    </label>
                  </div>
                  <div style={{ marginLeft: "10px", width: "10%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-mfrOrSupplierChanged"
                      value="M"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "M"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUDetails();
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-query"
                      style={{ "font-size": "0.875rem" }}
                    >
                      MFR / Supplier Changed
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
              columns={resourceLevelQualitySKUsListColDefs}
              data={this.state.resourceLevelQualitySKUsListData}
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
