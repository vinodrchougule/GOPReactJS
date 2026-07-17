import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal } from "react-bootstrap";
import helper from "../../helpers/helpers";
import projectService from "../../services/project.service";
import productionAllocationService from "../../services/productionAllocation.service";
import userService from "../../services/user.service";
import "./ProductionAllocation.scss";
import Moment from "moment";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

toast.configure();

const projectColumns = [
  {
    dataField: "ProjectCode",
    text: "Project Codes",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
  },
];

const batchColumns = [
  {
    dataField: "BatchNo",
    text: "Batch Nos.",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
  },
];

class productionAllocation extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.showDeletePopUp = this.showDeletePopUp.bind(this);
    this.handleDeleteNo = this.handleDeleteNo.bind(this);

    this.showChangeUserPopUp = this.showChangeUserPopUp.bind(this);
    this.handleChangeUserNo = this.handleChangeUserNo.bind(this);

    this.fetchExistingProjectAllocationDetails =
      this.fetchExistingProjectAllocationDetails.bind(this);
    this.handleAllocatedListNo = this.handleAllocatedListNo.bind(this);

    this.uploadProductionAllocatedFile =
      this.uploadProductionAllocatedFile.bind(this);
    this.deleteProductionAllocatedFile =
      this.deleteProductionAllocatedFile.bind(this);

    this.fetchUniqueColumnNames = this.fetchUniqueColumnNames.bind(this);
    this.onChangeUniqueColumnName = this.onChangeUniqueColumnName.bind(this);

    this.isloading = this.isloading.bind(this);

    this.validateAndAllocate = this.validateAndAllocate.bind(this);
    this.reset = this.reset.bind(this);

    this.fetchExistingProjectAllocationDetailsByID =
      this.fetchExistingProjectAllocationDetailsByID.bind(this);

    this.deleteProductionAllocatedActivities =
      this.deleteProductionAllocatedActivities.bind(this);

    this.deleteProductionAllocation =
      this.deleteProductionAllocation.bind(this);
    this.changeProuctionUser = this.changeProuctionUser.bind(this);
    this.onChangeProductionUser = this.onChangeProductionUser.bind(this);
    this.downloadProductionOutput = this.downloadProductionOutput.bind(this);
    this.closeProductionPendingListModal =
      this.closeProductionPendingListModal.bind(this);

    this.downloadAllAllocatedSKUs = this.downloadAllAllocatedSKUs.bind(this);
    this.downloadAllProductionPendingSKUs =
      this.downloadAllProductionPendingSKUs.bind(this);

    this.state = {
      loading: false,
      modalLoading: false,
      spinnerMessage: "",
      customers: [],
      customerCodeExpanded: [],
      selectedCustomerCode: "",
      projectCodes: [],
      projectCodeExpanded: [],
      selectedProjectCode: "",
      batches: [],
      selectedBatchNo: "",
      disableViewExistingProductionAllocation: true,
      customerCode: "",
      isProjectSettingExist: false,
      projectCode: "",
      batchNo: "",
      scope: "",
      inputCount: "",
      productionCompletedCount: "",
      productionCompletedPercentage: "",
      activities: [],
      productionAllocatedFileName: "",
      productionAllocatedFileUploadedName: "",
      messageForProductionAllocatedFile: false,
      productionAllocatedFileKey: Date.now(),
      uniqueColumnNames: [],
      fileFormErrors: {},
      selectedUniqueColumnName: "",
      formErrors: {},
      allocations: [],
      allocationActivitiyDetails: [],
      allocationDetailsExpanded: [],
      showDeleteModal: false,
      deleteModalProductionAllocationID: "",
      deleteModalProductionActivities: "",
      deleteModalProductionAllocatedCount: "",
      deleteModalProductionPendingCount: "",
      deleteModalProductionUser: "",
      showChangeUserModal: false,
      users: [],
      changeUserModalProductionAllocationID: "",
      changeUserModalProductionActivities: "",
      changeUserModalProductionAllocatedCount: "",
      changeUserModalProductionPendingCount: "",
      changeUserModalProductionUser: "",
      changeUserFormErrors: {},
      changedUsername: "",
      showAllocatedListModal: false,
      canAccessProductionAllocation: false,
      showProductionPendingList: false,
      productionPendingCountHeaders: [],
      productionPendingCountList: [],
      productionPendingModalProductionAllocationID: "",
      noOfChangedSKUs: 0,
      columnDefs: [],
      rowData: [],
      isToRefreshActivityDetails: false,
    };

    this.initialState = this.state;
  }

  //#region page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
    this.canUserAccessPage("Production Allocation");
    this.fetchUsersList();
    this.fetchCustomers();
  }
  //#endregion

  //#region fetching Production Allocation page access
  canUserAccessPage(pageName) {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        this.setState({
          canAccessProductionAllocation: response.data,
        });
        if (!response.data) {
          toast.error("Access Denied");
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region fetching Users List from Web API
  fetchUsersList() {
    this.setState({
      spinnerMessage: "Please wait while fetching Users...",
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
        this.setState({ loading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Display/ Hide Spinner
  isloading(e) {
    this.setState({
      loading: true,
    });
  }
  //#endregion

  //#region fetching allocation pending customers from Web API
  fetchCustomers() {
    this.setState({
      spinnerMessage: "Please wait while fetching Customers...",
      loading: true,
    });

    productionAllocationService
      .getCustomerCodes()
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

  //#region fetching project codes of Selected customer from Web API
  fetchProjectsOfSelectedCustomer = (row, isExpand, rowIndex, e) => {
    if (!isExpand) {
      this.setState(() => ({
        customerCodeExpanded: [],
        selectedProjectCode: "",
        projectCodeExpanded: [],
        batches: [],
        selectedBatchNo: "",
        customerCode: "",
        projectCode: "",
        batchNo: "",
        scope: "",
        inputCount: "",
        productionCompletedCount: "",
        productionCompletedPercentage: "",
        activities: [],
        productionAllocatedFileKey: Date.now(),
        productionAllocatedFileName: "",
        productionAllocatedFileUploadedName: "",
        uniqueColumnNames: [],
        selectedUniqueColumnName: "",
        disableViewExistingProductionAllocation: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Projects...",
      loading: true,
    });

    const fileFormErrors = {
      ...this.state.fileFormErrors,
      uniqueColumnNameError: "",
    };

    const formErrors = {
      ...this.state.formErrors,
      projectError: "",
    };

    productionAllocationService
      .getProjectCodesOfCustomer(row.CustomerCode)
      .then((response) => {
        this.setState({
          projectCodes: response.data,
          batches: [],
          selectedBatchNo: "",
          selectedCustomerCode: row.CustomerCode,
          fileFormErrors: fileFormErrors,
          formErrors: formErrors,
          customerCodeExpanded: [row.CustomerCode],
          projectCodeExpanded: [],
          selectedProjectCode: "",
          customerCode: "",
          projectCode: "",
          batchNo: "",
          scope: "",
          inputCount: "",
          productionCompletedCount: "",
          productionCompletedPercentage: "",
          activities: [],
          productionAllocatedFileKey: Date.now(),
          productionAllocatedFileName: "",
          productionAllocatedFileUploadedName: "",
          uniqueColumnNames: [],
          selectedUniqueColumnName: "",
          disableViewExistingProductionAllocation: true,
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Batch Nos. of Selected Project from Web API
  fetchBatchesOfSelectedProject = (row, isExpand, rowIndex, e) => {
    if (!isExpand) {
      this.setState(() => ({
        selectedProjectCode: "",
        projectCodeExpanded: [],
        batches: [],
        selectedBatchNo: "",
        customerCode: "",
        projectCode: "",
        batchNo: "",
        scope: "",
        inputCount: "",
        productionCompletedCount: "",
        productionCompletedPercentage: "",
        activities: [],
        productionAllocatedFileKey: Date.now(),
        productionAllocatedFileName: "",
        productionAllocatedFileUploadedName: "",
        uniqueColumnNames: [],
        selectedUniqueColumnName: "",
        disableViewExistingProductionAllocation: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Batches...",
      loading: true,
    });

    const fileFormErrors = {
      ...this.state.fileFormErrors,
      uniqueColumnNameError: "",
    };

    const formErrors = {
      ...this.state.formErrors,
      projectError: "",
    };

    productionAllocationService
      .getBatchesOfProject(this.state.selectedCustomerCode, row.ProjectCode)
      .then((response) => {
        if (response.data.length !== 0) {
          this.setState({
            batches: response.data,
            selectedProjectCode: row.ProjectCode,
            projectCodeExpanded: [row.ProjectCode],
            fileFormErrors: fileFormErrors,
            formErrors: formErrors,
            customerCode: "",
            projectCode: "",
            batchNo: "",
            scope: "",
            inputCount: "",
            productionCompletedCount: "",
            productionCompletedPercentage: "",
            activities: [],
            disableViewExistingProductionAllocation: true,
            loading: false,
          });
        } else {
          this.fetchProjectDetails(
            this.state.selectedCustomerCode,
            row.ProjectCode,
            ""
          );
          this.setState({
            batches: [],
            selectedBatchNo: "",
            selectedProjectCode: row.ProjectCode,
            projectCodeExpanded: [row.ProjectCode],
            fileFormErrors: fileFormErrors,
            formErrors: formErrors,
          });
        }
      })
      .catch((e) => {
        this.setState({ loading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Project Details of Selected Project or Batch No from Web API
  fetchProjectDetails(customerCode, projectCode, batchNo) {
    this.setState({
      spinnerMessage: "Please wait while loading project details...",
      loading: true,
    });

    const fileFormErrors = {
      ...this.state.fileFormErrors,
      uniqueColumnNameError: "",
    };

    productionAllocationService
      .getProjectDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        if (response.data.IsProjectAllocated === 0) {
          this.setState({
            disableViewExistingProductionAllocation: true,
          });
        } else {
          this.setState({
            disableViewExistingProductionAllocation: false,
          });
        }
        this.setState({
          selectedBatchNo: batchNo,
          customerCode: response.data.CustomerCode,
          projectCode: response.data.ProjectCode,
          isProjectSettingExist: response.data.IsProjectSettingsExist,
          batchNo: response.data.BatchNo,
          scope: response.data.Scope,
          inputCount: response.data.InputCount,
          productionCompletedCount: response.data.ProductionCompletedCount,
          productionCompletedPercentage:
            response.data.ProductionCompletedPercentage,
          fileFormErrors: fileFormErrors,
        }, () => this.fetchActivityDetails(customerCode, projectCode, batchNo));
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
    
  }
  //#endregion

  //#region fetching activity Details of Selected Project or Batch No from Web API
  fetchActivityDetails(customerCode, projectCode, batchNo) {
    this.setState({
      spinnerMessage: "Please wait while loading activity details...",
      loading: true,
    });
    if(this.state.isProjectSettingExist){
      productionAllocationService
      .getOnScreenProjectDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        this.setState({
          activities: [response.data],
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
    } else {
      productionAllocationService
      .getActivityDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        this.setState({
          activities: response.data,
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

  //#region Validating the input data
  handleUniqueColumnValidation() {
    // const productionAllocatedFileName =
    //   this.state.productionAllocatedFileName.trim();
    const customerCode = this.state.selectedCustomerCode.trim();
    const projectCode = this.state.selectedProjectCode.trim();
    const batches = this.state.batches;
    const batchNo = this.state.selectedBatchNo;
    let formErrors = {};
    let isValidForm = true;

    //Customer Code
    if (!customerCode) {
      isValidForm = false;
      formErrors["uniqueColumnNameError"] = "Please Select Customer Code";

      this.setState({ fileFormErrors: formErrors });
      return isValidForm;
    }
    //Project Code
    if (projectCode) {
      if (batches.length !== 0) {
        if (!batchNo) {
          isValidForm = false;
          formErrors["uniqueColumnNameError"] = "Please select Batch No";

          this.setState({ fileFormErrors: formErrors });
          return isValidForm;
        }
      }
    } else {
      isValidForm = false;
      formErrors["uniqueColumnNameError"] = "Please select Project Code";

      this.setState({ fileFormErrors: formErrors });
      return isValidForm;
    }

    return isValidForm;
  }
  //#endregion

  //#region fetching unique column name from Web API
  fetchUniqueColumnNames() {
    this.setState({
      spinnerMessage: "Please wait while fetching unique column names...",
      loading: true,
    });

    productionAllocationService
      .getUniqueColumnNames(
        this.state.productionAllocatedFileName,
        this.state.customerCode,
        this.state.projectCode,
        this.state.batchNo
      )
      .then((response) => {
        this.setState({
          uniqueColumnNames: response.data,
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

  //#region Uploading Production Allocated File
  uploadProductionAllocatedFile(e) {
    if ((e.target.value === null) | (e.target.value === "")) {
      this.setState({
        productionAllocatedFileUploadedName: "",
        productionAllocatedFileName: "",
      });
      return;
    }

    const fileFormErrors = {
      ...this.state.fileFormErrors,
      uniqueColumnNameError: "",
    };

    const formErrors = {
      ...this.state.formErrors,
      productionAllocatedFileError: "",
    };

    this.setState({
      fileFormErrors: fileFormErrors,
      formErrors: formErrors,
    });

    let fileName = e.target.files[0].name;
    let allowedFileExtesions = ["xlsx"];

    if (!helper.IsValidFileExtension(fileName, allowedFileExtesions)) {
      let invalidFileError = {};

      invalidFileError["productionAllocatedFileError"] =
        "Allocation file should be in  .xlsx format";

      this.setState({
        fileFormErrors: fileFormErrors,
        formErrors: invalidFileError,
        productionAllocatedFileKey: Date.now(),
        productionAllocatedFileName: "",
      });
      return;
    }

    const fsize = e.target.files.item(0).size;
    const file = Math.round(fsize / 1024);
    let formErrorsFile = {};

    if (file > 20000) {
      formErrorsFile["productionAllocatedFileError"] =
        "Max. file size should not exceed 20Mb";

      this.setState({
        fileFormErrors: fileFormErrors,
        formErrors: formErrorsFile,
        productionAllocatedFileKey: Date.now(),
        productionAllocatedFileName: "",
      });
      return;
    }

    if (this.handleUniqueColumnValidation()) {
      if ((e.target.value === null) | (e.target.value === "")) {
        this.setState({
          productionAllocatedFileUploadedName: "",
          productionAllocatedFileName: "",
          uniqueColumnNames: [],
        });
        return;
      }

      this.setState({
        messageForProductionAllocatedFile: true,
        spinnerMessage:
          "Please wait while uploading Production Allocated File...",
        loading: true,
      });

      var files = e.target.files;

      let currentFile = files[0];
      let fileNameUploaded = files[0].name;
      this.setState({
        productionAllocatedFileUploadedName: fileNameUploaded,
      });

      let formData = new FormData();
      formData.append("File", currentFile);

      //Service call
      projectService
        .saveFileupload(formData)
        .then((response) => {
          this.setState(
            {
              messageForProductionAllocatedFile: false,
              productionAllocatedFileName: response.data,
              fileFormErrors: fileFormErrors,
              formErrors: formErrors,
            },
            () => this.fetchUniqueColumnNames()
          );
        })
        .catch((error) => {
          toast.error(error.response.data.Message, { autoClose: false });
          this.setState({
            messageForProductionAllocatedFile: false,
            loading: false,
            productionAllocatedFileName: "",
          });
        });

      if (e.target.value !== "" && e.target.value !== null) {
        const formErrors = {
          ...this.state.fileFormErrors,
          ProductionAlloctedFileError: "",
        };
        this.setState({ fileFormErrors: formErrors });
      }
    } else {
      this.setState({
        productionAllocatedFileKey: Date.now(),
      });
    }
  }
  //#endregion

  //#region Deleting Production Allocated File
  deleteProductionAllocatedFile() {
    this.setState({
      spinnerMessage: "Please wait while deleting Production Allocated File...",
      loading: true,
    });

    projectService
      .deleteFile(this.state.productionAllocatedFileName)
      .then(() => {
        this.setState({
          productionAllocatedFileKey: Date.now(),
          productionAllocatedFileName: "",
          productionAllocatedFileUploadedName: "",
          uniqueColumnNames: [],
          selectedUniqueColumnName: "",
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          productionAllocatedFileName: "",
          loading: false,
        });
        toast.error(error.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  selectCustomerRow = {
    mode: "radio",
    hideSelectColumn: true,
    clickToSelect: true,
    clickToExpand: true,
  };

  selectBatchRow = {
    onSelect: (row) =>
      this.fetchProjectDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        row.BatchNo
      ),
    mode: "radio",
    hideSelectColumn: true,
    clickToSelect: true,
    bgColor: "#DCDCDC",
    //clickToExpand: true,
  };

  selectactivityRow = {
    mode: "checkbox",
    // clickToSelect: true,
  };

  fetchExistingProjectAllocationDetails() {
    this.setState({
      spinnerMessage:
        "Please wait while fetching existing production allocations...",
      loading: true,
      isToRefreshActivityDetails: false,
    });

    productionAllocationService
      .getExistingProjectAllocationDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      )
      .then((response) => {
        if (response.data.length === 0) {
          this.handleAllocatedListNo();
          this.setState({
            disableViewExistingProductionAllocation: true,
            loading: false,
          });
          return;
        }
        this.setState({
          allocations: response.data,
          allocationDetailsExpanded: [],
          showAllocatedListModal: true,
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

  //#region  Fetch Activities of selected Allocation
  fetchExistingProjectAllocationDetailsByID = (row, isExpand, rowIndex, e) => {
    if (!isExpand) {
      this.setState(() => ({
        allocationDetailsExpanded: [],
        modalLoading: false,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Allocation Details...",
      modalLoading: true,
    });

    productionAllocationService
      .getExistingProjectAllocationDetailsByID(row.ProductionAllocationID)
      .then((response) => {
        this.setState({
          allocationActivitiyDetails: response.data,
          allocationDetailsExpanded: [row.ProductionAllocationID],
          productionPendingModalProductionAllocationID:
            row.ProductionAllocationID,
          modalLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  handleDeleteNo() {
    this.setState({ showDeleteModal: false });
  }

  showDeletePopUp(
    productionAllocationID,
    productionActivities,
    productionAllocatedCount,
    productionPendingCount,
    productionUser
  ) {
    this.setState({
      deleteModalProductionAllocationID: productionAllocationID,
      deleteModalProductionActivities: productionActivities,
      deleteModalProductionAllocatedCount: productionAllocatedCount,
      deleteModalProductionPendingCount: productionPendingCount,
      deleteModalProductionUser: productionUser,
      showDeleteModal: true,
    });
  }

  handleChangeUserNo() {
    this.setState({ showChangeUserModal: false });
  }

  showChangeUserPopUp(
    productionAllocationID,
    productionActivities,
    productionUser,
    productionPendingCount,
    productionAllocatedCount
  ) {
    this.setState({
      changeUserModalProductionAllocationID: productionAllocationID,
      changeUserModalProductionActivities: productionActivities,
      changeUserModalProductionAllocatedCount: productionAllocatedCount,
      changeUserModalProductionPendingCount: productionPendingCount,
      changeUserModalProductionUser: productionUser,
      showChangeUserModal: true,
    });
  }

  handleAllocatedListNo() {
    if (this.state.isToRefreshActivityDetails) {
      this.fetchActivityDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      );
    }
    this.setState({ showAllocatedListModal: false });
  }

  //#region  Download Production Allocated File
  downloadProductionAllocatedFile(allocationID, allocatedFileName) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading Production Allocated File...",
      modalLoading: true,
    });

    productionAllocationService
      .DownloadAllocatedFile(allocationID)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", allocatedFileName);
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({
          modalLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Get Unique Column Name Value
  onChangeUniqueColumnName(e) {
    this.setState({
      selectedUniqueColumnName: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...this.state.formErrors,
        uniqueColumnNameError: "",
      };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Reset the page
  reset() {
    this.setState({
      spinnerMessage: "Please wait while Resetting...",
      loading: true,
    });
    this.setState(this.initialState);
    this.componentDidMount();
    this.setState({ productionAllocatedFileKey: Date.now(), loading: false });
  }
  //#endregion

  //#region Validating the input data
  handleFormValidation() {
    const productionAllocatedFileName =
      this.state.productionAllocatedFileName.trim();
    const customerCode = this.state.selectedCustomerCode.trim();
    const projectCode = this.state.selectedProjectCode.trim();
    const uniqueColumnName = this.state.selectedUniqueColumnName;
    let formErrors = {};
    let isValidForm = true;

    this.setState({ fileFormErrors: {} });

    //Customer Code
    if (customerCode) {
      if (!projectCode) {
        isValidForm = false;
        formErrors["projectError"] = "Please Select Project Code";

        this.setState({ formErrors: formErrors });
      }
    } else {
      isValidForm = false;
      formErrors["projectError"] = "Please Select Customer Code";
    }

    //Production Allocated File
    if (!productionAllocatedFileName) {
      isValidForm = false;
      formErrors["productionAllocatedFileError"] =
        "Please Upload Production Allocated File";
    }

    //Production Allocated File
    if (!uniqueColumnName) {
      isValidForm = false;
      formErrors["uniqueColumnNameError"] = "Please Select Unique Column Name";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region Validate and Allocated Production File
  validateAndAllocate() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    if (this.handleFormValidation()) {
      this.setState({
        spinnerMessage:
          "Please wait while Validating and Uploading Production Allocated File...",
        loading: true,
      });

      //Bind state data to object
      var data = {
        CustomerCode: this.state.selectedCustomerCode.trim(),
        ProjectCode: this.state.selectedProjectCode.trim(),
        BatchNo: this.state.selectedBatchNo.trim(),
        AllocatedFileName: this.state.productionAllocatedFileName,
        UniqueColumnName: this.state.selectedUniqueColumnName,
        UserID: helper.getUser(),
      };

      //Service call
      productionAllocationService
        .ValidateAndAllocate(data)
        .then(() => {
          toast.success("Production Allocation Created Successfully");
          this.setState({
            productionAllocatedFileKey: Date.now(),
            productionAllocatedFileName: "",
            uniqueColumnNames: [],
            selectedUniqueColumnName: "",
            loading: false,
            disableViewExistingProductionAllocation: false,
          });
          this.fetchActivityDetails(
            this.state.selectedCustomerCode,
            this.state.selectedProjectCode,
            this.state.selectedBatchNo
          );
        })
        .catch((error) => {
          this.setState({
            productionAllocatedFileKey: Date.now(),
            productionAllocatedFileName: "",
            uniqueColumnNames: [],
            selectedUniqueColumnName: "",
            loading: false,
          });
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  }
  //#endregion

  //#region Delete Production Allocated Activities
  deleteProductionAllocatedActivities() {
    this.setState({
      spinnerMessage:
        "Please wait while deleting Production Allocated Activities...",
      modalLoading: true,
    });

    var data = {
      ProductionAllocationID: this.state.deleteModalProductionAllocationID,
      Activities: this.state.deleteModalProductionActivities,
      ProductionUser: this.state.deleteModalProductionUser,
      UserID: helper.getUser(),
    };

    productionAllocationService
      .deleteProductionAllocationActivities(data)
      .then(() => {
        toast.success("Production Allocation Activity Deleted Successfully");
        this.fetchExistingProjectAllocationDetails();
        this.setState({
          showDeleteModal: false,
          allocationDetailsExpanded: [],
          modalLoading: false,
          isToRefreshActivityDetails: true,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion
  //#region Delete On Screen Production Allocated Activities
  deleteOnScreenProductionAllocatedActivities = () => {
    this.setState({
      spinnerMessage:
        "Please wait while deleting Production Allocated Activities...",
      modalLoading: true,
    });

    var data = {
      ProductionAllocationID: this.state.deleteModalProductionAllocationID,
      Activities: this.state.deleteModalProductionActivities,
      ProductionUser: this.state.deleteModalProductionUser,
      UserID: helper.getUser(),
    };

    productionAllocationService
      .deleteOnScreenProductionAllocationActivities(data)
      .then(() => {
        toast.success("Production Allocation Activity Deleted Successfully");
        this.fetchExistingProjectAllocationDetails();
        this.setState({
          showDeleteModal: false,
          allocationDetailsExpanded: [],
          modalLoading: false,
          isToRefreshActivityDetails: true,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Delete Production Allocation
  deleteProductionAllocation(productionAllocationID) {
    this.setState({
      spinnerMessage: "Please wait while deleting Production Allocation...",
      modalLoading: true,
    });

    productionAllocationService
      .deleteProductionAllocation(productionAllocationID, helper.getUser())
      .then(() => {
        this.fetchExistingProjectAllocationDetails();
        this.setState({
          modalLoading: false,
          isToRefreshActivityDetails: true,
        });
        toast.success("Production Allocation Deleted Successfully");
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Delete Production Allocation
  deleteOnScreenProductionAllocation(productionAllocationID) {
    this.setState({
      spinnerMessage: "Please wait while deleting Production Allocation...",
      modalLoading: true,
    });

    productionAllocationService
      .deleteOnScreenProductionAllocation(productionAllocationID, helper.getUser())
      .then(() => {
        this.fetchExistingProjectAllocationDetails();
        this.setState({
          modalLoading: false,
          isToRefreshActivityDetails: true,
        });
        toast.success("Production Allocation Deleted Successfully");
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Change Production user for selected activities
  changeProuctionUser() {
    const changedUsername = this.state.changedUsername.trim();
    let formErrors = {};

    //Changed Username
    if (!changedUsername) {
      formErrors["changeUserError"] = "Please Select Change User";

      this.setState({ changeUserFormErrors: formErrors });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while changing User...",
      modalLoading: true,
    });

    var data = {
      ProductionAllocationID: this.state.changeUserModalProductionAllocationID,
      Activities: this.state.changeUserModalProductionActivities,
      ProductionUser: this.state.changeUserModalProductionUser,
      ChangeToProductionUser: this.state.changedUsername,
      UserID: helper.getUser(),
    };

    productionAllocationService
      .changeProductionAllocationUser(data)
      .then((response) => {
        toast.success(
          "Production Allocation Activity User Changed Successfully"
        );
        this.setState({
          allocationDetailsExpanded: [],
          changedUsername: "",
          modalLoading: false,
        });
        this.fetchExistingProjectAllocationDetails(); //check later for collpase table
        this.setState({ showChangeUserModal: false });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Get Selected User
  onChangeProductionUser(e) {
    this.setState({
      changedUsername: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      this.setState({ changeUserFormErrors: [] });
    }
  }
  //#endregion

  //#region Download Production Completed Count of Allocation
  downloadProductionCompletedCountofAllocation(allocationID) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading Production Completed File...",
      modalLoading: true,
    });

    productionAllocationService
      .downloadAllocationProductionCompletedAllDetails(allocationID)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "ProductionCompletedAllocationAllDetails_" + allocationID + ".xlsx"
        );
        document.body.appendChild(fileLink);
        fileLink.click();
        this.setState({
          modalLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }

  downloadProductionCompletedCountofAllocationSKUs(allocationID) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading Production Completed File...",
      modalLoading: true,
    });

    productionAllocationService
      .downloadAllocationProductionCompletedSKUs(allocationID)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "ProductionCompletedAllocationAllDetails_" + allocationID + ".xlsx"
        );
        document.body.appendChild(fileLink);
        fileLink.click();
        this.setState({
          modalLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Download Production Completed Count of Allocation Activity Details
  downloadProductionCompletedCountofAllocationActivityDetails(
    allocationID,
    activities,
    productionUser
  ) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading User Production Completed File...",
      modalLoading: true,
    });

    var data = {
      ProductionAllocationID: allocationID,
      Activities: activities,
      ProductionUser: productionUser,
    };

    productionAllocationService
      .downloadProductionCompletedAllocationActivities(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "ProductionCompletedActivities_" +
            helper.getUser() +
            "_" +
            allocationID +
            ".xlsx"
        );
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({
          modalLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }

  downloadProductionCompletedCountofAllocationActivityDetailsSKUs(
    allocationID,
    productionUser
  ) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading User Production Completed File...",
      modalLoading: true,
    });
    var data = {
      ProductionAllocationID: allocationID,
      Activities: "",
      ProductionUser: productionUser,
    };

    productionAllocationService
      .downloadProductionCompletedAllocationActivitiesSKUs(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "ProductionCompletedAllSKUsOfUser_" +
            productionUser +
            "_" +
            allocationID +
            ".xlsx"
        );
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({
          modalLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Download Production Output
  downloadProductionOutput() {
    this.setState({
      spinnerMessage: "Please wait while downloading Production Output file...",
      loading: true,
    });
    let outputFileName = "";

    if (this.state.selectedBatchNo) {
      outputFileName =
        "ProductionCompletedOutputTable_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo +
        ".xlsx";
    } else {
      outputFileName =
        "ProductionCompletedOutputTable_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        ".xlsx";
    }

    productionAllocationService
      .downloadProductionCompletedOutputTable(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", outputFileName);
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

  //#region Fetch Production Pending Count
  fetchProductionPendingCountModal(
    productionAllocationID,
    activities,
    productionUser
  ) {
    this.setState({
      spinnerMessage: "Please wait while fetching Production Pending Rows...",
      modalLoading: true,
    });

    var data = {
      ProductionAllocationID: productionAllocationID,
      Activities: activities,
      ProductionUser: productionUser,
    };

    productionAllocationService
      .readProductionPendingSKUsByProductionUser(data)
      .then((response) => {
        let productionPendingCountHeaders = Object.keys(response.data[0]);

        let colDefs = [];
        productionPendingCountHeaders.forEach((key) => {
          if (key === "ProductionUser") {
            colDefs.push({
              field: key,
              headerName: "Production User",
              editable: true,
              filter: "agTextColumnFilter",
              sortable: true,
              width: 300,
              valueGetter: (params) => {
                return params.data.ProductionUser;
              },
              valueSetter: (params) => {
                if (params.newValue.length === 3) {
                  params.data.ProductionUser = params.newValue;
                  return true;
                }
              },
            });
          } else {
            colDefs.push({
              field: key,
              headerName: key,
              filter: "agTextColumnFilter",
              sortable: true,
              width: 350,
            });
          }
        });
        this.setState({
          productionPendingCountHeaders: productionPendingCountHeaders,
          productionPendingCountList: response.data,
          modalLoading: false,
          noOfChangedSKUs: 0,
          columnDefs: colDefs,
          rowData: response.data,
          showProductionPendingList: true,
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Change SKU Production User
  changeSKUProductionUser(oldValue, newValue, row) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue.length !== 3) {
      toast.error("Invalid Production User");
      return;
    }
    this.setState({
      spinnerMessage: "Please wait while changing the Production User...",
      modalLoading: true,
    });

    let uniqueColumnValue = Object.values(row)[0];

    var data = {
      ProductionAllocationID:
        this.state.productionPendingModalProductionAllocationID,
      UniqueColumnValue: uniqueColumnValue,
      Activities: row.Activities,
      ChangeToProductionUser: newValue.toUpperCase(),
      UserID: helper.getUser(),
    };

    productionAllocationService
      .ChangeSKUProductionUser(data)
      .then((response) => {
        this.setState((prevState) => {
          return {
            modalLoading: false,
            noOfChangedSKUs: prevState.noOfChangedSKUs + 1,
          };
        });
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Close Production Pending List Modal
  closeProductionPendingListModal() {
    if (this.state.noOfChangedSKUs > 0) {
      this.fetchExistingProjectAllocationDetails();
      this.setState({
        allocationDetailsExpanded: [],
      });
    }

    this.setState({
      showProductionPendingList: false,
    });
  }
  //#endregion

  onCellEditingStopped = (event) => {
    this.changeSKUProductionUser(event.oldValue, event.newValue, event.data);
  };

  //#region  Download All Allocated SKUs
  downloadAllAllocatedSKUs() {
    this.setState({
      spinnerMessage: "Please wait while downloading all allocated SKUs...",
      modalLoading: true,
    });

    let fileName = "";

    if (this.state.selectedBatchNo) {
      fileName =
        "ProductionAllocation_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo +
        ".xlsx";
    } else {
      fileName =
        "ProductionAllocation_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        ".xlsx";
    }

    productionAllocationService
      .downloadAllProductionAllocatedSKUs(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({ modalLoading: false });
      })
      .catch((e) => {
        this.setState({ modalLoading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Download All Allocated SKUs
  downloadAllProductionPendingSKUs() {
    this.setState({
      spinnerMessage:
        "Please wait while downloading all production pending SKUs...",
      modalLoading: true,
    });

    let fileName = "";

    if (this.state.selectedBatchNo) {
      fileName =
        "ProductionPendingSKUs_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo +
        ".xlsx";
    } else {
      fileName =
        "ProductionPendingSKUs_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        ".xlsx";
    }

    productionAllocationService
      .downloadAllProductionPendingSKUs(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({ modalLoading: false });
      })
      .catch((e) => {
        this.setState({ modalLoading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion
  //#region  Download All Allocated SKUs
  downloadAllProductionOnScreenPendingSKUs = () => {
    this.setState({
      spinnerMessage:
        "Please wait while downloading all production pending SKUs...",
      modalLoading: true,
    });

    let fileName = "";

    if (this.state.selectedBatchNo) {
      fileName =
        "ProductionPendingSKUsOnScreen_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo +
        ".xlsx";
    } else {
      fileName =
        "ProductionPendingSKUsOnScreen_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        ".xlsx";
    }

    productionAllocationService
      .downloadAllProductionOnScreenPendingSKUs(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();

        this.setState({ modalLoading: false });
      })
      .catch((e) => {
        this.setState({ modalLoading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  render() {
    const messageForProductionAllocatedFile =
      this.state.messageForProductionAllocatedFile;
    const productionAllocatedFileName = this.state.productionAllocatedFileName;

    const noOfChangedSKUs = this.state.noOfChangedSKUs;
    const canAccessProductionAllocation =
      this.state.canAccessProductionAllocation;

    const customerColumns = [
      {
        dataField: "CustomerCode",
        text: "Customers and Projects",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
    ];

    //#region Expand customer code row and fetch projects of selected customer
    const expandRow = {
      expanded: this.state.customerCodeExpanded,
      onExpand: this.fetchProjectsOfSelectedCustomer,
      onlyOneExpanding: true,
      showExpandColumn: true,
      parentClassName: "rowBackgroundColor",
      expandHeaderColumnRenderer: (isAnyExpands) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      ),
      renderer: (row) => (
        <>
          <div>
            <BootstrapTable
              keyField="ProjectCode"
              data={this.state.projectCodes}
              columns={projectColumns}
              expandRow={expandBatchRow}
              selectRow={this.selectCustomerRow}
            />
          </div>
        </>
      ),
    };
    //#endregion

    //#region Expand Batch Row
    const expandBatchRow = {
      expanded: this.state.projectCodeExpanded,
      onExpand: this.fetchBatchesOfSelectedProject,
      onlyOneExpanding: true,
      showExpandColumn: true,
      parentClassName: "rowBackgroundColor",
      expandHeaderColumnRenderer: (isAnyExpands) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      ),
      renderer: (row) => (
        <div>
          <BootstrapTable
            keyField="BatchNo"
            data={this.state.batches}
            columns={batchColumns}
            selectRow={this.selectBatchRow}
          />
        </div>
      ),
    };
    //#endregion

    //#region Activity Columns
    const activityColumnsFalse = [
      {
        dataField: "Activity",

        text: "Activity",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        style: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
        title: true,
      },
      {
        dataField: "ActivityCount",

        text: "Activity Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "110px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionAllocatedCount",

        text: "Prod. Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "160px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionPendingToAllocate",

        text: "Prod. Pending to Allocate",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "190px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionCompletedCount",

        text: "Prod. Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "170px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionCompletionPercentage",

        text: "Prod. Completion %",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
    ];

    const activityColumnsTrue = [
      {
        dataField: "Activities",

        text: "Activity",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        style: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
        title: true,
      },
      {
        dataField: "ProductionAllocatedCount",

        text: "Prod. Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "160px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionPendingToAllocate",

        text: "Prod. Pending to Allocate",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "190px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionCompletedCount",

        text: "Prod. Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "170px",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "ProductionCompletionPercentage",

        text: "Prod. Completion %",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
    ];
    //#endregion

    //#region Allocation Columns
    const allocationColumns = [
      {
        dataField: "ProductionAllocationID",

        text: "Allocation ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "AllocatedOn",

        text: "Allocated On",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${Moment(row.AllocatedOn).format("DD-MMM-yyyy")}`,
      },
      {
        dataField: "AllocatedByUserName",

        text: "Allocated By",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "AllocatedCount",

        text: "Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "CompletedCount",

        text: "Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.CompletedCount}{" "}
            {row.CompletedCount > 0 && (
              <i
                className="fas fa-download pointer mg-l-10"
                title="Download Prod. Completed File"
                onClick={() =>
                  this.state.isProjectSettingExist ?
                  this.downloadProductionCompletedCountofAllocationSKUs(
                    row.ProductionAllocationID
                  ) :
                   this.downloadProductionCompletedCountofAllocation(
                    row.ProductionAllocationID
                  )
                }
              ></i>
            )}
          </div>
        ),
      },
      {
        dataField: "AllocatedFileName",
        text: "File name",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        hidden: true,
      },

      {
        dataField: "IsProductionDownloaded",
        text: "Is Production Downloaded",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        hidden: true,
      },
      {
        dataField: "deleteAllocation",
        text: "Action",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            <i
              className="fas fa-download pointer mg-l-10"
              title="Download Allocated File"
              onClick={() =>
                this.downloadProductionAllocatedFile(
                  row.ProductionAllocationID,
                  row.AllocatedFileName
                )
              }
            ></i>
            {(row.AllocatedCount !== row.CompletedCount) && (
              <i
                className="fas fa-trash-alt pointer mg-l-10"
                onClick={() =>
                  this.state.isProjectSettingExist ?
                  this.deleteOnScreenProductionAllocation(row.ProductionAllocationID)
                  :
                  this.deleteProductionAllocation(row.ProductionAllocationID)
                }
                title="Discard Allocation"
              ></i>
            )}
          </div>
        ),
      },
    ];
    //#endregion

    //#region Display Allocation details of selected allocation
    const expandAllocationRow = {
      parentClassName: "rowBackgroundColor",
      className: "rowBackgroundColor",
      expanded: this.state.allocationDetailsExpanded,
      onExpand: this.fetchExistingProjectAllocationDetailsByID,
      expandHeaderColumnRenderer: (isAnyExpands) => null,
      onlyOneExpanding: true,
      expandByColumnOnly: true,
      showExpandColumn: true,
      renderer: (row) => (
        <div>
          <div
            className="table-responsive"
            style={{
              height:
                this.state.allocationActivitiyDetails.length > 8 ? "280px" : "",
            }}
          >
            <BootstrapTable
              keyField="ProductionAllocationDetailsID"
              data={this.state.allocationActivitiyDetails}
              columns={allocationActivityColumns}
            />
          </div>
        </div>
      ),
    };
    //#endregion

    //#region Allocation Activity Columns
    const allocationActivityColumns = [
      {
        dataField: "ProductionAllocationID",

        text: "Allocation ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        hidden: "true",
      },
      {
        dataField: "ProductionAllocationDetailsID",

        text: "Production Allocation Details ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        hidden: "true",
      },
      {
        dataField: "Activities",

        text: "Activities",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        style: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          backgroundColor: "white",
        },
        title: true,
      },
      {
        dataField: "ProductionAllocatedCount",

        text: "Prod. Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        style: {
          backgroundColor: "white",
        },
      },
      {
        dataField: "ProductionCompletedCount",

        text: "Prod. Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        style: {
          backgroundColor: "white",
        },
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.ProductionCompletedCount}{" "}
            {(row.ProductionCompletedCount > 0) && (
              <i
                className="fas fa-download pointer mg-l-10"
                title="Download Prod. Completed Activity File"
                onClick={() =>
                  this.state.isProjectSettingExist ?
                  this.downloadProductionCompletedCountofAllocationActivityDetailsSKUs(
                    row.ProductionAllocationID,
                    row.ProductionUser
                  )
                  :
                  this.downloadProductionCompletedCountofAllocationActivityDetails(
                    row.ProductionAllocationID,
                    row.Activities,
                    row.ProductionUser
                  )
                }
              ></i>
            )}
          </div>
        ),
      },
      {
        dataField: "ProductionPendingCount",

        text: "Prod. Pending Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        style: {
          backgroundColor: "white",
        },
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.ProductionPendingCount}{" "}
            {(row.ProductionPendingCount > 0 && !this.state.isProjectSettingExist) && (
              <i
                className="fas fa-step-forward pointer mg-l-10"
                title="Re-allocate Partially"
                onClick={() =>
                  this.fetchProductionPendingCountModal(
                    row.ProductionAllocationID,
                    row.Activities,
                    row.ProductionUser
                  )
                }
              ></i>
            )}
          </div>
        ),
      },
      {
        dataField: "ProductionUser",

        text: "Prod. Allocated To",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        style: {
          backgroundColor: "white",
        },
      },
      {
        dataField: "IsActivityDownloadedForProduction",

        text: "Is Activity Downloaded For Production",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        style: {
          backgroundColor: "white",
        },
        hidden: true,
      },
      {
        dataField: "",

        text: "Action",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        style: {
          backgroundColor: "white",
        },
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {
            (row.ProductionAllocatedCount !== row.ProductionCompletedCount) && (
              <>
                 {!this.state.isProjectSettingExist  && <i
                  className="fas fa-forward pointer mg-l-30"
                  title="Re-allocate all"
                  onClick={() =>
                    this.showChangeUserPopUp(
                      row.ProductionAllocationID,
                      row.Activities,
                      row.ProductionUser,
                      row.ProductionPendingCount,
                      row.ProductionAllocatedCount
                    )
                  }
                ></i>}
                {row.ProductionAllocatedCount !==
                  row.ProductionCompletedCount && (
                  <i
                    className="fas fa-trash-alt pointer mg-l-10"
                    title="Discard Activity Allocation"
                    onClick={() =>
                      this.showDeletePopUp(
                        row.ProductionAllocationID,
                        row.Activities,
                        row.ProductionAllocatedCount,
                        row.ProductionPendingCount,
                        row.ProductionUser
                      )
                    }
                  ></i>
                )}
              </>
            )}
          </div>
        ),
      },
    ];
    //#endregion

    return !canAccessProductionAllocation ? (
      ""
    ) : (
      <>
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
          <div className="az-content-breadcrumb mg-l-50">
            <span>Project</span>
            <span>List</span>
          </div>
          <div className="row mg-l-30 mg-r-15">
            <div className="col-md-3">
              <h4>Production Allocation</h4>
              <br />
              <Tab.Container defaultActiveKey="onGoing">
                <Nav variant="pills" className="mg-l-0 mg-b-20">
                  <Nav.Item style={{ border: "1px solid #5E41FC" }}>
                    <Nav.Link eventKey="onGoing" id="OnGoing">
                      On Going
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ border: "1px solid #5E41FC" }}>
                    <Nav.Link eventKey="delivered" id="Delivered">
                      Delivered
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Tab.Container>
              <div
                className="table-responsive"
                style={{
                  marginTop: "3%",
                  width: "88%",
                  height: this.state.customers.length > 10 ? "300px" : "",
                }}
              >
                <BootstrapTable
                  keyField="CustomerCode"
                  data={this.state.customers}
                  columns={customerColumns}
                  expandRow={expandRow}
                  selectRow={this.selectCustomerRow}
                  id="customer"
                />
              </div>
              <div className="error-message">
                {this.state.formErrors["projectError"]}
              </div>
            </div>
            <div className="col-md-9 mg-t-10">
              <div style={{ border: "1px solid #cdd4e0" }}>
                <div className="row mg-l-10">
                  <div className="col-lg">
                    <div className="row row-sm">
                      <div className="col-md-6 text-nowrap">
                        <label htmlFor="CustomerCode">
                          <b>Customer Code</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="CustomerCode" name="CustomerCode">
                          {this.state.customerCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-6 text-nowrap">
                        <label htmlFor="ProjectCode">
                          <b>Project Code</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="ProjectCode" name="ProjectCode">
                          {this.state.projectCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-5">
                        <label htmlFor="BatchNo">
                          <b>Batch No</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="BatchNo" name="BatchNo">
                          {this.state.batchNo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mg-l-10">
                  <div className="col-lg">
                    <div className="row row-sm">
                      <div className="col-md-6 text-nowrap">
                        <label htmlFor="CustomerCode">
                          <b>Scope</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p
                          id="Scope"
                          name="Scope"
                          className="scopeOverflow"
                          title={this.state.scope}
                        >
                          {this.state.scope}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-6">
                        <label htmlFor="ProjectCode">
                          <b>Input Count</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="InputCount" name="ProjectCode">
                          {this.state.inputCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-6">
                        <label htmlFor="OutputCount">
                          <b>Output Count</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <div className="row">
                          <p id="OutputCount" name="ProjectCode">
                            {this.state.productionCompletedCount}{" "}
                          </p>
                          {this.state.productionCompletedCount > 0 && (
                            <p>
                              ( {this.state.productionCompletedPercentage}%)
                            </p>
                          )}{" "}
                          {(this.state.productionCompletedCount > 0 && !this.state.isProjectSettingExist) && (
                            <i
                              className="fas fa-download pointer mg-l-20 mg-t-3"
                              onClick={this.downloadProductionOutput}
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="table-responsive mg-t-10"
                style={{
                  height: this.state.activities.length > 5 ? "200px" : "",
                }}
              >
                <BootstrapTable
                  keyField="Activity"
                  data={this.state.activities}
                  columns={this.state.isProjectSettingExist ? activityColumnsTrue : activityColumnsFalse}
                  id="Activities"
                />
              </div>
              <br />
              <div style={{ marginLeft: "15px", marginRight: "15px" }}>
                <div className="row">
                  <div
                    className="col-md-8 pd-t-5"
                    style={{ border: "1px solid #cdd4e0" }}
                  >
                    <div className="row">
                      <div className="col-md-4 mg-t-8 text-nowrap">
                        <p>
                          Upload Prod. Allocated File{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="file"
                          className="form-control"
                          accept=".xlsx"
                          tabIndex="1"
                          key={this.state.productionAllocatedFileKey}
                          id="UploadProductionAllocatedFile"
                          onChange={this.uploadProductionAllocatedFile}
                        />
                        {messageForProductionAllocatedFile && (
                          <p>Please Wait...</p>
                        )}
                        <div className="error-message">
                          {
                            this.state.fileFormErrors[
                              "productionAllocatedFileError"
                            ]
                          }
                        </div>
                        {this.state.fileFormErrors["uniqueColumnNameError"] && (
                          <div className="error-message">
                            {this.state.fileFormErrors["uniqueColumnNameError"]}
                          </div>
                        )}
                        {this.state.formErrors[
                          "productionAllocatedFileError"
                        ] && (
                          <div className="error-message">
                            {
                              this.state.formErrors[
                                "productionAllocatedFileError"
                              ]
                            }
                          </div>
                        )}
                      </div>
                      <div className="col-md-2">
                        {productionAllocatedFileName && (
                          <>
                            <span
                              className="btn btn-secondary mg-l-5"
                              onClick={this.deleteProductionAllocatedFile}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mg-t-15">
                        <p>
                          Unique Column Name{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </p>
                      </div>
                      <div className="col-md-6 mg-t-10 mg-b-5">
                        <select
                          className="form-control"
                          id="UniqueColumnName"
                          name="InputCountType"
                          value={this.state.selectedUniqueColumnName}
                          tabIndex="2"
                          onChange={this.onChangeUniqueColumnName}
                        >
                          <option value="">--Select--</option>
                          {this.state.uniqueColumnNames.map((uniqueColName) => (
                            <option key={uniqueColName.UniqueColumnName}>
                              {uniqueColName.UniqueColumnName}
                            </option>
                          ))}
                        </select>
                        {this.state.formErrors["uniqueColumnNameError"] && (
                          <div className="error-message">
                            {this.state.formErrors["uniqueColumnNameError"]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-4 pd-t-25"
                    style={{ border: "1px solid #cdd4e0" }}
                  >
                    {this.state.disableViewExistingProductionAllocation ===
                      false && (
                      <div
                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        onClick={this.fetchExistingProjectAllocationDetails}
                        tabIndex="3"
                        id="ViewExistingProductionAllocations"
                      >
                        View Existing Prod. Allocations
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row row-sm mg-t-30">
                <div className="col-md-2"></div>
                <div className="col-md-3 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    tabIndex="4"
                    id="ValidateAndAllocate"
                    onClick={this.validateAndAllocate}
                  >
                    Validate and Allocate
                  </span>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-3  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="5"
                    onClick={this.reset}
                    id="Reset"
                  >
                    Reset
                  </span>
                </div>
              </div>
              <p className="mg-t-20">
                Template Columns: &lt;Unique ID Column (Mandatory)&gt; , Activities
                separated by " | " delimiter (Mandatory), Production User (Mandatory),&lt;Input
                Columns&gt;, &lt;Output Columns&gt;
              </p>
            </div>
          </div>
        </LoadingOverlay>
        <Modal
          show={this.state.showDeleteModal}
          onHide={this.handleDeleteNo}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          enforceFocus={false}
          dialogClassName="border border-secondary"
        >
          <LoadingOverlay
          active={this.state.modalLoading}
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
            <Modal.Header>
              <Modal.Title id="deleteModal">
                Delete Activity Allocation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="CustomerCode">
                    <b>Allocation ID</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-6 mg-t-7">
                  <p id="CustomerCode" name="CustomerCode">
                    {this.state.deleteModalProductionAllocationID}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="ProjectCode">
                    <b>Activity</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-6 mg-t-7">
                  <p id="Activity" name="ProjectCode">
                    {this.state.deleteModalProductionActivities}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="ProjectCode">
                    <b>Allocated To</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="AllocatedTo" name="ProjectCode">
                    {this.state.deleteModalProductionUser}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="CustomerCode">
                    <b>Pending Count</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="PendingCount" name="CustomerCode">
                    {this.state.deleteModalProductionPendingCount}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="AllocatedCount">
                    <b>Allocated Count</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="AllocatedCount" name="AllocatedCount">
                    {this.state.deleteModalProductionAllocatedCount}
                  </p>
                </div>
              </div>
              <div className="row row-sm mg-t-10">
                <div className="col-md-2"></div>
                <div className="col-md-3 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={() => this.state.isProjectSettingExist ?
                      this.deleteOnScreenProductionAllocatedActivities()
                      :
                      this.deleteProductionAllocatedActivities()}
                  >
                    Delete
                  </span>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-3  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="28"
                    onClick={this.handleDeleteNo}
                    id="Reset"
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </Modal.Body>
          </LoadingOverlay>
        </Modal>
        <Modal
          show={this.state.showChangeUserModal}
          onHide={this.handleChangeUserNo}
          // dialogClassName="modal-width"
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          enforceFocus={false}
          dialogClassName="border border-secondary"
        >
          <LoadingOverlay
          active={this.state.modalLoading}
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
            <Modal.Header>
              <Modal.Title id="deleteModal">
                Re-allocate all pending SKUs
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="CustomerCode">
                    <b>Allocation ID</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="CustomerCode" name="CustomerCode">
                    {this.state.changeUserModalProductionAllocationID}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="ProjectCode">
                    <b>Activity</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="ProjectCode" name="ProjectCode">
                    {this.state.changeUserModalProductionActivities}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="ProjectCode">
                    <b>Allocated To</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="ProjectCode" name="ProjectCode">
                    {this.state.changeUserModalProductionUser}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="CustomerCode">
                    <b>Pending Count</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="CustomerCode" name="CustomerCode">
                    {this.state.changeUserModalProductionPendingCount}
                  </p>
                </div>
              </div>
              <div className="row row-sm">
                <div className="col-md-5 text-nowrap">
                  <label htmlFor="ProjectCode">
                    <b>Allocated Count</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </label>
                </div>
                <div className="col-md-5 mg-t-7">
                  <p id="ProjectCode" name="ProjectCode">
                    {this.state.changeUserModalProductionAllocatedCount}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <b>Change to User</b>{" "}
                  <span className="text-danger asterisk-size">*</span>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control"
                    tabIndex="2"
                    id="ChangeUser"
                    name="ChangeUser"
                    placeholder="--Select--"
                    value={this.state.changedUsername}
                    onChange={this.onChangeProductionUser}
                  >
                    <option value="">--Select--</option>
                    {this.state.users.map((user) => (
                      <option key={user.UserID}>
                        {user.FirstName +
                          " " +
                          user.MiddleName +
                          " " +
                          user.LastName +
                          " - " +
                          user.UserName}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {this.state.changeUserFormErrors["changeUserError"]}
                  </div>
                </div>
              </div>
              <div className="row row-sm mg-t-30">
                <div className="col-md-3"></div>
                <div className="col-md-3 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={this.changeProuctionUser}
                  >
                    Change
                  </span>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-3  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="28"
                    onClick={this.handleChangeUserNo}
                    id="Reset"
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </Modal.Body>
          </LoadingOverlay>
        </Modal>
        <Modal
          show={this.state.showAllocatedListModal}
          onHide={this.handleAllocatedNo}
          dialogClassName="allocation-modal-width"
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          enforceFocus={false}
        >
          <LoadingOverlay
          active={this.state.modalLoading}
          className="custom-loader"
          style={{height: "100%"}}
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
          <div style={{height: "100%", overflow: "auto"}}>
            <Modal.Header>
              <Modal.Title id="deleteModal">
                Existing Prod. Allocation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="row mg-l-30 mg-r-15">
            <div className="col-md-12 mg-t-10">
              <div style={{ border: "1px solid #cdd4e0" }}>
                <div className="row mg-l-10">
                  <div className="col-lg">
                    <div className="row row-sm">
                      <div className="col-md-6 text-nowrap">
                        <label htmlFor="CustomerCode">
                          <b>Customer Code</b>{" "}
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="CustomerCode" name="CustomerCode">
                          {this.state.customerCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-6 text-nowrap">
                        <label htmlFor="ProjectCode">
                          <b>Project Code</b>{" "}
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="ProjectCode" name="ProjectCode">
                          {this.state.projectCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-5">
                        <label htmlFor="BatchNo">
                          <b>Batch No</b>{" "}
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="BatchNo" name="BatchNo">
                          {this.state.batchNo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mg-l-10">
                  <div className="col-lg">
                    <div className="row row-sm">
                      <div className="col-md-6 text-nowrap">
                        <label htmlFor="CustomerCode">
                          <b>Scope</b>{" "}
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p
                          id="Scope"
                          name="Scope"
                          className="scopeOverflow"
                          title={this.state.scope}
                        >
                          {this.state.scope}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <div className="row row-sm">
                      <div className="col-md-6">
                        <label htmlFor="ProjectCode">
                          <b>Input Count</b>{" "}
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="InputCount" name="ProjectCode">
                          {this.state.inputCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                  </div>
                </div>
              </div>
              <br />
            </div>
          </div>
              
              <div style={{ textAlign: "end" }}>
              <label
                className="demo-key-row1"
                onClick={this.downloadAllAllocatedSKUs} >
                Download All Allocated SKU's
              </label>
             <label
                className="demo-key-row1 mg-l-15"
                onClick={this.state.isProjectSettingExist ? this.downloadAllProductionOnScreenPendingSKUs : this.downloadAllProductionPendingSKUs} >
                Download Pending for Production SKU's
              </label>
            </div>
              <BootstrapTable
                keyField="ProductionAllocationID"
                data={this.state.allocations}
                columns={allocationColumns}
                expandRow={expandAllocationRow}
              />
              <div className="row row-sm mg-t-30">
                <div className="col-md-5"></div>
                <div className="col-md-2 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={this.handleAllocatedListNo}
                  >
                    Close
                  </span>
                </div>
              </div>
            </Modal.Body>
            </div>
          </LoadingOverlay>
        </Modal>
        <Modal
          show={this.state.showProductionPendingList}
          dialogClassName="allocation-modal-width modal-border"
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          enforceFocus={false}
        >
          <LoadingOverlay
          active={this.state.modalLoading}
          className="custom-loader"
          style={{height: "100%"}}
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
            <div style={{height: "100%", overflow: "auto"}}>
            <Modal.Header>
              <Modal.Title id="productionPendingModal">
                Re-allocate pending SKUs partially
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row row-sm mg-r-15">
                <div className="col-lg">
                  <div className="row row-sm">
                    <div className="col-md-7">
                      <b>Allocation ID</b>
                    </div>
                    <div className="col-md-5">
                      <p>
                        {
                          this.state
                            .productionPendingModalProductionAllocationID
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <div className="row row-sm">
                    <div className="col-md">
                      <b>Customer Code</b>
                    </div>
                    <div className="col-md">
                      <p>{this.state.selectedCustomerCode}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <div className="row row-sm">
                    <div className="col-md">
                      <b>Project Code</b>
                    </div>
                    <div className="col-md">
                      <p>{this.state.selectedProjectCode}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  <div className="row row-sm">
                    <div className="col-md">
                      <b>Batch No</b>
                    </div>
                    <div className="col-md">
                      <p>{this.state.selectedBatchNo}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p>No. SKUs Changed: {noOfChangedSKUs}</p>
              <p className="text-danger">
                Note: Double-Click / Press Enter to change the Production User
              </p>
              <div
                className="ag-theme-alpine"
                style={{
                  height: "360px",
                  width: "1020px",
                }}
              >
                <AgGridReact
                  columnDefs={this.state.columnDefs}
                  rowData={this.state.rowData}
                  onCellEditingStopped={this.onCellEditingStopped.bind(this)}
                  pagination={true}
                  paginationPageSize="10"
                ></AgGridReact>
              </div>
              <div className="row row-sm mg-t-30">
                <div className="col-md-5"></div>
                <div className="col-md-2 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={this.closeProductionPendingListModal}
                  >
                    Close
                  </span>
                </div>
              </div>
            </Modal.Body>
            </div>
          </LoadingOverlay>
        </Modal>
      </>
    );
  }
}

export default productionAllocation;
