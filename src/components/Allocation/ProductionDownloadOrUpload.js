import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal, Row, Nav, Tab } from "react-bootstrap";
import helper from "../../helpers/helpers";
import "./ProductionAllocation.scss";
import Moment from "moment";
import projectService from "../../services/project.service";
import productionService from "../../services/production.service";
import productionAllocationService from "../../services/productionAllocation.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
import { withRouter } from "react-router-dom";
toast.configure();

//#region Project Columns
const projectColumns = [
  {
    dataField: "ProjectCode",
    text: "Project Codes",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
  },
];
//#endregion

//#region Batch Columns
const batchColumns = [
  {
    dataField: "BatchNo",
    text: "Batch Nos.",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
  },
];
//#endregion

class ProductionDownloadOrUpload extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.fetchProductionUploadedList =
      this.fetchProductionUploadedList.bind(this);
    this.hideProductionUploadListPopup =
      this.hideProductionUploadListPopup.bind(this);
    this.hideProductionUploadedListPopup =
      this.hideProductionUploadedListPopup.bind(this);
    this.uploadProductionCompletedFile =
      this.uploadProductionCompletedFile.bind(this);
    this.deleteProductionCompletedFile =
      this.deleteProductionCompletedFile.bind(this);
    this.validateAndUploadProductionFile =
      this.validateAndUploadProductionFile.bind(this);
    this.hideProductionErrorPopupModal =
      this.hideProductionErrorPopupModal.bind(this);
    this.validateAndUploadProductionErrorFile =
      this.validateAndUploadProductionErrorFile.bind(this);

    this.uploadProductionErrorFile = this.uploadProductionErrorFile.bind(this);
    this.deleteProductionErrorFile = this.deleteProductionErrorFile.bind(this);
    this.onChangeHoursWorked = this.onChangeHoursWorked.bind(this);
    this.onChangeMinutesWorked = this.onChangeMinutesWorked.bind(this);

    //#region state variables
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
      customerCode: "",
      projectCode: "",
      batchNo: "",
      scope: "",
      inputCount: "",
      activities: [],
      formErrors: {},
      allocations: [],
      allocationActivitiyDetails: [],
      allocationDetailsExpanded: [],
      productionCompletedFileUploadAllocationID: "",
      productionCompletedFileUploadActivities: "",
      productionCompletedFileUploadedName: "",
      productioncompletedFileName: "",
      productionCompletedFileKey: "",
      showProductionUploadModal: false,
      productionErrorFileUploadAllocationID: "",
      productionErrorFileUploadActivities: "",
      productionErrorFileUploadedName: "",
      productionErrorFileName: "",
      productionErrorFileKey: "",
      showProductionErrorUploadModal: false,
      showProductionUploadedListModal: false,
      productionUploadedActivities: [],
      disableViewExistingProductionUploads: true,
      loadingButton: false,
      canAccessProductionDownloadOrUpload: false,
      isToRefreshActivityDetails: false,
      hoursWorked: null,
      minutesWorked: null,
      IsProjectSettingsExist: false,
      isToggle: "",
    };
    //#endregion

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

    this.canUserAccessPage("Production Download-Upload");
    this.fetchCustomers();
  }
  //#endregion

  //#region fetching Production Download or Upload page access
  canUserAccessPage(pageName) {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        this.setState({
          canAccessProductionDownloadOrUpload: response.data,
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

  //#region fetching allocated customers for logedin User from Web API
  fetchCustomers() {
    this.setState({
      spinnerMessage: "Please wait while fetching Customers...",
      loading: true,
    });

    productionService
      .getCustomerCodes(helper.getUser(), "O")
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
        projectCodeExpanded: [],
        selectedProjectCode: "",
        batches: [],
        selectedBatchNo: "",
        customerCode: "",
        projectCode: "",
        batchNo: "",
        scope: "",
        inputCount: "",
        activities: [],
        disableViewExistingProductionUploads: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Projects...",
      loading: true,
    });

    productionService
      .getProjectCodesOfCustomer(row.CustomerCode, helper.getUser(), "O")
      .then((response) => {
        this.setState({
          projectCodes: response.data,
          batches: [],
          selectedBatchNo: "",
          selectedCustomerCode: row.CustomerCode,
          customerCodeExpanded: [row.CustomerCode],
          projectCodeExpanded: [],
          selectedProjectCode: "",
          customerCode: "",
          projectCode: "",
          batchNo: "",
          scope: "",
          inputCount: "",
          activities: [],
          disableViewExistingProductionUploads: true,
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
        projectCodeExpanded: [],
        selectedProjectCode: "",
        batches: [],
        selectedBatchNo: "",
        customerCode: "",
        projectCode: "",
        batchNo: "",
        scope: "",
        inputCount: "",
        activities: [],
        disableViewExistingProductionUploads: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching batches...",
      loading: true,
    });

    productionService
      .getBatchesOfProject(
        this.state.selectedCustomerCode,
        row.ProjectCode,
        helper.getUser(),
        "O"
      )
      .then((response) => {
        if (response.data.length !== 0) {
          this.setState({
            batches: response.data,
            selectedProjectCode: row.ProjectCode,
            projectCodeExpanded: [row.ProjectCode],
            customerCode: "",
            projectCode: "",
            batchNo: "",
            scope: "",
            inputCount: "",
            activities: [],
            disableViewExistingProductionUploads: true,
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
          });
        }
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Project Details of Selected Project or Batch No from Web API
  fetchProjectDetails(customerCode, projectCode, batchNo) {
    this.setState({
      spinnerMessage: "Please wait while fetching Project Details...",
      loading: true,
    });
    productionAllocationService
      .getProjectDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        this.setState({
          selectedBatchNo: batchNo,
          customerCode: response.data.CustomerCode,
          projectCode: response.data.ProjectCode,
          batchNo: response.data.BatchNo,
          scope: response.data.Scope,
          inputCount: response.data.InputCount,
          IsProjectSettingsExist: response.data.IsProjectSettingsExist,
        });
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
    this.fetchActivityDetails(customerCode, projectCode, batchNo);
  }
  //#endregion

  //#region fetching activity Details of Selected Project or Batch No from Web API
  fetchActivityDetails(customerCode, projectCode, batchNo) {
    this.setState({
      spinnerMessage:
        "Please wait while fetching user project activity details...",
      loading: true,
    });

    productionService
      .getActivityDetails(customerCode, projectCode, helper.getUser(), batchNo)
      .then((response) => {
        let activityDetails = response.data;
        let obj = activityDetails.find((o) => o.ProductionCompletedCount > 0);

        if (!obj) {
          this.setState({ disableViewExistingProductionUploads: true });
        } else {
          this.setState({ disableViewExistingProductionUploads: false });
        }
        response.data.forEach((activity) => {
          activity.onScreen = "Edit On Screen";
        });

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
  //#endregion

  //#region Select Batch Row
  selectBatchRow = {
    onSelect: (row) =>
      this.fetchProjectDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        row.BatchNo
      ),
    mode: "radio",
    bgColor: "#DCDCDC",
    hideSelectColumn: true,
    clickToSelect: true,
  };
  //#endregion

  //#region Select Customer code row
  selectCustomerRow = {
    mode: "radio",
    hideSelectColumn: true,
    clickToSelect: true,
    clickToExpand: true,
  };
  //#endregion

  //#region Hide Production Uploaded List Modal
  hideProductionUploadListPopup() {
    if (this.state.isToRefreshActivityDetails) {
      this.fetchActivityDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      );
    }
    this.setState({ showProductionUploadedListModal: false });
  }
  //#endregion

  //#region Fetch Production Uploaded List Details
  fetchProductionUploadedList() {
    this.setState({
      spinnerMessage: "Please wait while fetching Production Uploaded List...",
      loading: true,
      isToRefreshActivityDetails: false,
    });

    productionService
      .getProductionUploadedDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        helper.getUser(),
        this.state.selectedBatchNo
      )
      .then((response) => {
        if (response.data.length === 0) {
          this.hideProductionUploadListPopup();
          this.setState({
            disableViewExistingProductionUploads: true,
            loading: false,
          });
          return;
        }
        this.setState({
          productionUploadedActivities: response.data,
          showProductionUploadedListModal: true,
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

  //#region Download Production Allocated File
  downloadProductionAllocatedFile(
    productionAllocationID,
    Activity,
    ProductionAllocatedCount
  ) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading Production allocated details of User...",
      loading: true,
    });

    let fileName = "";
    let activity = "";

    if (Activity.includes("|")) {
      activity = "MultiScope";
    } else {
      activity = Activity.replace(/[^a-zA-Z0-9& ]/g, "_");
    }

    if (this.state.selectedBatchNo) {
      fileName =
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo +
        "_" +
        activity +
        "_" +
        helper.getUser() +
        "_" +
        ProductionAllocatedCount;
    } else {
      fileName =
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        activity +
        "_" +
        helper.getUser() +
        "_" +
        ProductionAllocatedCount;
    }

    var data = {
      ProductionAllocationID: productionAllocationID,
      Activities: Activity,
      ProductionUser: helper.getUser(),
    };
    productionService
      .downloadProductionAllocatedFile(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName + ".xlsx");
        document.body.appendChild(fileLink);
        fileLink.click();

        this.fetchActivityDetails(
          this.state.selectedCustomerCode,
          this.state.selectedProjectCode,
          this.state.selectedBatchNo
        );
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Show Production Upload Modal
  showProductionCompletedFileUploadPopUp(
    productionAllocationID,
    productionActivities
  ) {
    this.setState({
      productionCompletedFileUploadAllocationID: productionAllocationID,
      productionCompletedFileUploadActivities: productionActivities,
      hoursWorked: null,
      minutesWorked: null,
      showProductionUploadModal: true,
      productioncompletedFileName: "",
      formErrors: {},
    });
  }
  //#endregion

  //#region Close Production File Upload Modal
  hideProductionUploadedListPopup() {
    this.setState({
      showProductionUploadModal: false,
    });
  }
  //#endregion

  //#region Upload Production Completed File
  uploadProductionCompletedFile(e) {
    if ((e.target.value === null) | (e.target.value === "")) {
      this.setState({
        productionCompletedFileUploadedName: "",
        productioncompletedFileName: "",
      });
      return;
    }

    this.setState({
      spinnerMessage:
        "Please wait while uploading Production Completed file...",
      modalLoading: true,
      formErrors: {},
    });

    let fileName = e.target.files[0].name;
    let allowedFileExtesions = ["xlsx"];

    if (!helper.IsValidFileExtension(fileName, allowedFileExtesions)) {
      let invalidFileError = {};

      invalidFileError["productionCompletedFileError"] =
        "Production Completed file should be in  .xlsx format";

      this.setState({
        formErrors: invalidFileError,
        productionCompletedFileKey: Date.now(),
        productioncompletedFileName: "",
        modalLoading: false,
      });
      return;
    }

    const fsize = e.target.files.item(0).size;
    const file = Math.round(fsize / 1024);
    let formErrors = {};

    if (file > 10000) {
      formErrors["productionCompletedFileError"] =
        "Max. file size should not exceed 10Mb";

      this.setState({
        formErrors: formErrors,
        productionCompletedFileKey: Date.now(),
        productioncompletedFileName: "",
        modalLoading: false,
      });
      return;
    }

    var files = e.target.files;

    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
    this.setState({
      productionCompletedFileUploadedName: fileNameUploaded,
    });

    let formData = new FormData();
    formData.append("File", currentFile);

    //Service call
    projectService
      .saveFileupload(formData)
      .then((response) => {
        this.setState({
          modalLoading: false,
          productioncompletedFileName: response.data,
        });
      })
      .catch((error) => {
        this.setState({
          modalLoading: false,
          productioncompletedFileName: "",
          productionCompletedFileUploadedName: "",
        });
        toast.error(error.response.data.Message, { autoClose: false });
      });

    if (e.target.value !== "" && e.target.value !== null) {
      this.setState({ formErrors: "" });
    }
  }
  //#endregion

  //#region Delete Uploaded File
  deleteProductionCompletedFile() {
    this.setState({
      spinnerMessage: "Please wait while deleting Production Completed file...",
      modalLoading: true,
    });
    projectService
      .deleteFile(this.state.productioncompletedFileName)
      .then(() => {
        this.setState({
          productionCompletedFileKey: Date.now(),
          productioncompletedFileName: "",
          productionCompletedFileUploadedName: "",
          modalLoading: false,
        });
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        this.setState({
          productionAllocatedFileName: "",
          modalLoading: false,
        });
      });
  }
  //#endregion

  //#region On Change Worked Hour
  onChangeHoursWorked(e) {
    this.setState({
      hoursWorked: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, hoursWorkedError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region On Change Worked Minutes
  onChangeMinutesWorked(e) {
    this.setState({
      minutesWorked: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, minutesWorkedError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Validating the input data
  handleFormValidation() {
    const hoursWorked = this.state.hoursWorked;
    const minutesWorked = this.state.minutesWorked;
    const productioncompletedFile =
      this.state.productioncompletedFileName.trim();
    let formErrors = {};
    let isValidForm = true;

    //Worked Hours
    if (!hoursWorked) {
      isValidForm = false;
      formErrors["hoursWorkedError"] = "Worked Hours is required";
    } else if (hoursWorked > 23) {
      isValidForm = false;
      formErrors["hoursWorkedError"] = "Worked Hours can't  more than 23 hours";
    }

    //Minutes Worked
    if (!minutesWorked) {
      isValidForm = false;
      formErrors["minutesWorkedError"] = "Worked minutes is required";
    } else if (minutesWorked > 59) {
      isValidForm = false;
      formErrors["minutesWorkedError"] =
        "Worked Minutes can't  more than 59 minutes";
    }

    if (parseInt(minutesWorked) === 0 && parseInt(hoursWorked) === 0) {
      isValidForm = false;
      formErrors["minutesWorkedError"] =
        "both Worked Hours and Worked Minutes can't be 0";
    }

    //Production File
    if (!productioncompletedFile) {
      isValidForm = false;
      formErrors["productionCompletedFileError"] =
        "Please Select Production Completed File";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region Validate and Upload Production completed File
  validateAndUploadProductionFile = (e) => {
    e.preventDefault();

    if (this.handleFormValidation()) {
      this.setState({
        spinnerMessage:
          "Please wait while Validating and Uploading Production Completed file...",
        modalLoading: true,
      });

      var data = {
        ProductionAllocationID:
          this.state.productionCompletedFileUploadAllocationID,
        Activities: this.state.productionCompletedFileUploadActivities,
        UploadedFileName: this.state.productioncompletedFileName,
        WorkedHours: this.state.hoursWorked,
        WorkedMinutes: this.state.minutesWorked,
        UserID: helper.getUser(),
      };

      productionService
        .uploadProductionCompletedFile(data)
        .then((response) => {
          toast.success("Production Upload Completed Successfully");
          this.setState({
            productioncompletedFileName: "",
            modalLoading: false,
          });
          this.fetchActivityDetails(
            this.state.selectedCustomerCode,
            this.state.selectedProjectCode,
            this.state.selectedBatchNo
          );
          this.setState({ showProductionUploadModal: false });
        })
        .catch((e) => {
          this.setState({
            productionCompletedFileKey: Date.now(),
            productioncompletedFileName: "",
            productionCompletedFileUploadedName: "",
            modalLoading: false,
          });
          toast.error(e.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region  Download Production Uploaded File
  downloadProductionUploadedFile(productionUploadID, uploadedFileName) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading Production Uploaded file...",
      modalLoading: true,
    });

    productionService
      .downloadUploadedFile(productionUploadID)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", uploadedFileName);
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

  //#region Delete Production Upload
  deleteProductionUpload(productionUploadID) {
    this.setState({
      spinnerMessage: "Please wait while deleting Production Uploaded file...",
      modalLoading: true,
    });

    productionService
      .deleteProductionUpload(productionUploadID, helper.getUser())
      .then(() => {
        toast.success("Production Upload Deleted Successfully");
        this.fetchProductionUploadedList();

        this.setState({
          isToRefreshActivityDetails: true,
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

  //#region Download Production Error file
  downloadProductionErrorFile(productionAllocationID, Activity) {
    this.setState({
      spinnerMessage: "Please wait while downloading Production Error File...",
      loading: true,
    });

    var data = {
      ProductionAllocationID: productionAllocationID,
      Activities: Activity,
      ProductionUser: helper.getUser(),
    };

    productionService
      .downloadProductionErrorFile(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "ProductionErrorFile_" +
            helper.getUser() +
            "_" +
            productionAllocationID +
            ".xlsx"
        );
        document.body.appendChild(fileLink);
        fileLink.click();

        this.fetchActivityDetails(
          this.state.selectedCustomerCode,
          this.state.selectedProjectCode,
          this.state.selectedBatchNo
        );
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Show Production Error Upload Modal
  showProductionErrorFileUploadPopUp(
    productionAllocationID,
    productionActivities
  ) {
    this.setState({
      productionErrorFileUploadAllocationID: productionAllocationID,
      productionErrorFileUploadActivities: productionActivities,
      showProductionErrorUploadModal: true,
      productionErrorFileName: "",
      formErrors: {},
    });
  }
  //#endregion

  //#region Upload Production Error File
  uploadProductionErrorFile(e) {
    if ((e.target.value === null) | (e.target.value === "")) {
      this.setState({
        productionErrorFileUploadedName: "",
        productionErrorFileName: "",
      });
      return;
    }

    this.setState({
      formErrors: {},
    });

    let fileName = e.target.files[0].name;
    let allowedFileExtesions = ["xlsx"];

    if (!helper.IsValidFileExtension(fileName, allowedFileExtesions)) {
      let invalidFileError = {};

      invalidFileError["productionErrorFileError"] =
        "Production Error file should be in .xlsx format";

      this.setState({
        formErrors: invalidFileError,
        productionErrorFileKey: Date.now(),
        productionErrorFileName: "",
      });
      return;
    }

    const fsize = e.target.files.item(0).size;
    const file = Math.round(fsize / 1024);
    let formErrors = {};

    if (file > 10000) {
      formErrors["productionErrorFileError"] =
        "Max. file size should not exceed 10Mb";

      this.setState({
        formErrors: formErrors,
        productionErrorFileKey: Date.now(),
        productionErrorFileName: "",
      });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while uploading production Error file...",
      modalLoading: true,
    });

    var files = e.target.files;

    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
    this.setState({
      productionErrorFileUploadedName: fileNameUploaded,
    });

    let formData = new FormData();
    formData.append("File", currentFile);

    //Service call
    projectService
      .saveFileupload(formData)
      .then((response) => {
        this.setState({
          modalLoading: false,
          productionErrorFileName: response.data,
        });
      })
      .catch((error) => {
        this.setState({
          modalLoading: false,
          productionErrorFileName: "",
          productionErrorFileUploadedName: "",
        });
        toast.error(error.response.data.Message, { autoClose: false });
      });

    if (e.target.value !== "" && e.target.value !== null) {
      this.setState({ formErrors: "" });
    }
  }
  //#endregion

  //#region Delete Production Error Uploaded File
  deleteProductionErrorFile() {
    this.setState({
      spinnerMessage: "Please wait while deleting Production Error File...",
      modalLoading: true,
    });

    projectService
      .deleteFile(this.state.productionErrorFileName)
      .then(() => {
        this.setState({
          productionErrorFileKey: Date.now(),
          productionErrorFileName: "",
          productionErrorFileUploadedName: "",
          modalLoading: false,
        });
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        this.setState({
          productionErrorFileName: "",
          modalLoading: false,
        });
      });
  }
  //#endregion

  //#region Validate and Upload Production Error File
  validateAndUploadProductionErrorFile() {
    const productionErrorFile = this.state.productionErrorFileName.trim();
    let formErrors = {};

    //Filename
    if (!productionErrorFile) {
      formErrors["productionErrorFileError"] =
        "Please Select Production Completed File";

      this.setState({ formErrors: formErrors });
      return;
    }

    this.setState({
      spinnerMessage:
        "Please wait while Validating and Uploading Production Error file...",
      modalLoading: true,
    });

    var data = {
      ProductionAllocationID: this.state.productionErrorFileUploadAllocationID,
      Activities: this.state.productionErrorFileUploadActivities,
      UploadedFileName: this.state.productionErrorFileName,
      UserID: helper.getUser(),
    };

    productionService
      .uploadProductionErrorFile(data)
      .then((response) => {
        toast.success("Production Error SKUs Uploaded Successfully");
        this.setState({
          productionErrorFileName: "",
          modalLoading: false,
        });
        this.fetchActivityDetails(
          this.state.selectedCustomerCode,
          this.state.selectedProjectCode,
          this.state.selectedBatchNo
        );
        this.setState({ showProductionErrorUploadModal: false });
      })
      .catch((e) => {
        this.setState({
          productionErrorFileUploadedName: "",
          productionErrorFileName: "",
          productionErrorFileKey: Date.now(),
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Hide Production Error modal
  hideProductionErrorPopupModal() {
    this.setState({
      showProductionErrorUploadModal: false,
    });
  }
  //#endregion

  //#region Display ProductionUpdateList section
  toggleBtn = (data) => {
    this.setState({
      isToggle: data,
    });
  };
  //#endregion


  // #region navigate to Onscreen Page
  showProjectSetingPage = (row) => {
    let data = {
      CustomerCode: this.state.customerCode,
      ProjectCode: this.state.projectCode,
      batchNo: this.state.batchNo,
      scope: this.state.scope,
      AllocationId: row.ProductionAllocationID
    }
    sessionStorage.setItem("prodUpdateData", JSON.stringify(data))
    
    this.props.history.push({
      pathname: "/Allocation/ProductionUpdateList",
    });
  };
  // #endregion navigate to Onscreen Page

  render() {
    const user = helper.getUser();
    const productionCompletedFileName = this.state.productioncompletedFileName;
    const loadingButton = this.state.loadingButton;

    const canAccessProductionDownloadOrUpload =
      this.state.canAccessProductionDownloadOrUpload;

    const productionErrorFileName = this.state.productionErrorFileName;
    const ErrorModalloadingButton = this.state.ErrorModalloadingButton;

    //#region Custome Code Columns
    const customerColumns = [
      {
        dataField: "CustomerCode",
        text: "Customers and Projects",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
    ];
    //#endregion

    //#region Expand customer code row and fetch projects of selected customer
    const expandCustomerCodeRow = {
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

    //#region Display Batch No.s on project code expand
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
    const activityColumns = [
      {
        dataField: "ProductionAllocationID",

        text: "Allocation ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "120px",
        },
        headerAlign: "center",
        title: true,
        align: "center",
      },
      {
        dataField: "Activity",

        text: "Activities",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        title: true,
        style: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      },
      {
        dataField: "ProductionAllocatedCount",

        text: "Prod. Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "180px",
        },
        align: "center",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.ProductionAllocatedCount}{" "}
            {!this.state.IsProjectSettingsExist && (
              <>
                <i
                  className="fas fa-download pointer mg-l-10"
                  title="Download Allocated File"
                  onClick={() =>
                    this.downloadProductionAllocatedFile(
                      row.ProductionAllocationID,
                      row.Activity,
                      row.ProductionAllocatedCount
                    )
                  }
                  style={{
                    color:
                      row.IsAllocationDownloadedForProduction === 0
                        ? "Grey"
                        : "Green",
                  }}
                ></i>{" "}
                {row.IsAllocationDownloadedForProduction !== 0 &&
                  row.ProductionAllocatedCount !==
                    row.ProductionCompletedCount && (
                    <>
                      <i
                        className="fas fa-upload pointer mg-l-10"
                        onClick={() =>
                          this.showProductionCompletedFileUploadPopUp(
                            row.ProductionAllocationID,
                            row.Activity
                          )
                        }
                        style={{
                          color: "Grey",
                        }}
                      ></i>
                    </>
                  )}
              </>
            )}
          </div>
        ),
      },
      {
        dataField: "ProductionCompletedCount",
        text: "Prod. Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "190px",
        },
        align: "center",
      },
      {
        dataField: "ProductionPendingCount",

        text: "Prod. Pending Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "170px",
        },
        align: "center",
      },
      {
        dataField: "ProductionErrorCount",

        text: "Prod. Error Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "150px",
        },
        align: "center",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.ProductionErrorCount}{" "}
            {row.ProductionErrorCount > 0 && (
              <>
                <i
                  className="fas fa-download pointer mg-l-10"
                  title="Download Production Error File"
                  onClick={() =>
                    this.downloadProductionErrorFile(
                      row.ProductionAllocationID,
                      row.Activity
                    )
                  }
                  style={{
                    color:
                      row.IsProductionErrorDownloaded === 0 ? "Grey" : "Green",
                  }}
                ></i>{" "}
                {row.IsProductionErrorDownloaded !== 0 && (
                  <>
                    <i
                      className="fas fa-upload pointer mg-l-10"
                      onClick={() =>
                        this.showProductionErrorFileUploadPopUp(
                          row.ProductionAllocationID,
                          row.Activity
                        )
                      }
                    ></i>
                  </>
                )}
              </>
            )}
          </div>
        ),
      },
      {
        dataField: "onScreen",

        text: "Edit On Screen",
        headerStyle: {
          backgroundColor: "#f2f8fb",
          width: "170px",
        },
        align: "center",
        classes: "demo-key-row1",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {this.state.IsProjectSettingsExist && (
              <i
                className="fas fa-edit pointer"
                title="Edit On Screen"
                onClick={() => this.showProjectSetingPage(row)}
              ></i>
            )}
          </div>
        ),
        hidden: !this.state.IsProjectSettingsExist
      },
      {
        dataField: "IsAllocationDownloadedForProduction",

        text: "Is Allocation Downloaded for Production",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        hidden: true,
      },
      {
        dataField: "IsProductionErrorDownloaded",

        text: "Is Production Error Downloaded",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        hidden: true,
      },
    ];
    //#endregion

    //#region Activity Columns
    const productionUploadedColumns = [
      {
        dataField: "ProductionUploadID",

        text: "Upload ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        title: true,
        align: "center",
      },
      {
        dataField: "UploadedByUserName",

        text: "Uploaded By",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        headerAlign: "center",
      },
      {
        dataField: "UploadedOn",
        text: "Uploaded On",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) =>
          `${Moment(row.UploadedOn).format("DD-MMM-yyyy")}`,
      },
      {
        dataField: "Activities",
        text: "Activities",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        title: true,
        style: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      },
      {
        dataField: "NoOfSKUs",
        text: "No of SKUs Uploaded",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
      },
      {
        dataField: "UploadedFileName",

        text: "Uploaded File Name",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        hidden: true,
      },
      {
        dataField: "IsProductionCompletedCountDownloaded",

        text: "Is Production Completed Count Downloaded",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
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
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            <i
              className="fas fa-download pointer mg-l-10"
              title="Download Uploaded File"
              onClick={() =>
                this.downloadProductionUploadedFile(
                  row.ProductionUploadID,
                  row.UploadedFileName
                )
              }
            ></i>
            {row.IsProductionCompletedCountDownloaded === 0 &&
              new Date(Moment()).getDate() ===
                new Date(row.UploadedOn).getDate() && (
                <i
                  className="fas fa-trash-alt pointer mg-l-20"
                  onClick={() =>
                    this.deleteProductionUpload(row.ProductionUploadID)
                  }
                  title="Discard Upload"
                ></i>
              )}
          </div>
        ),
      },
    ];
    //#endregion

    return !canAccessProductionDownloadOrUpload ? (
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
              <h4 style={{ marginBottom: "10px" }}>
                Production
              </h4>
              <h6>User: {user} </h6>
              <Tab.Container defaultActiveKey="onGoing">
                <Nav variant="pills" className="mg-l-0 mg-b-20 mg-t-10">
                  <Nav.Item
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => this.toggleBtn("On Going")}
                  >
                    <Nav.Link eventKey="onGoing"> On Going </Nav.Link>
                  </Nav.Item>
                  <Nav.Item
                    style={{ border: "1px solid #5E41FC" }}
                    onClick={() => this.toggleBtn("Delivered")}
                  >
                    <Nav.Link eventKey="delivered"> Delivered </Nav.Link>
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
                  expandRow={expandCustomerCodeRow}
                  selectRow={this.selectCustomerRow}
                  id="customer"
                />
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
                        <label htmlFor="Scope">
                          <b>Batch No</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p
                          id="ProjectCode"
                          name="ProjectCode"
                          style={{ overflowWrap: "break-word" }}
                        >
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
                          title={this.state.scope}
                          className="scopeOverflow"
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
                        <p id="ProjectCode" name="ProjectCode">
                          {this.state.inputCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    {!this.state.disableViewExistingProductionUploads && (
                      <>
                        {!this.state.IsProjectSettingsExist && (
                          <p
                            onClick={this.fetchProductionUploadedList}
                            className="text-primary pointer mg-t-10"
                          >
                            View Existing Production Uploads
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="table-responsive mg-t-20"
                style={{ height: "300px" }}
              >
                <BootstrapTable
                  keyField="ProductionAllocationID"
                  data={this.state.activities}
                  columns={activityColumns}
                />
              </div>
            </div>
          </div>
          <Modal
            show={this.state.showProductionUploadedListModal}
            onHide={this.handleAllocatedNo}
            dialogClassName="allocation-modal-width"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            enforceFocus={false}
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
                  Existing Production Uploads
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <BootstrapTable
                  keyField="ProductionUploadID"
                  data={this.state.productionUploadedActivities}
                  columns={productionUploadedColumns}
                />
                <div className="row row-sm mg-t-30">
                  <div className="col-md-5"></div>
                  <div className="col-md-2 mg-t-10 mg-lg-t-0">
                    <span
                      className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                      onClick={this.hideProductionUploadListPopup}
                    >
                      Close
                    </span>
                  </div>
                </div>
              </Modal.Body>
            </LoadingOverlay>
          </Modal>
          <Modal
            show={this.state.showProductionUploadModal}
            dialogClassName="modal-width-produpload"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            enforceFocus={false}
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
                <Modal.Title id="uploadModal">Production Upload</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={this.validateAndUploadProductionFile}>
                  <div className="row row-sm">
                    <div className="col-md-4 text-nowrap">
                      <label htmlFor="CustomerCode">
                        <b>Customer Code</b>{" "}
                        <span className="text-danger asterisk-size">*</span>
                      </label>
                    </div>
                    <div className="col-md-6 mg-t-7">
                      <p id="CustomerCode" name="CustomerCode">
                        {this.state.selectedCustomerCode}
                      </p>
                    </div>
                  </div>
                  <div className="row row-sm">
                    <div className="col-md-4 text-nowrap">
                      <label htmlFor="CustomerCode">
                        <b>Project Code</b>{" "}
                        <span className="text-danger asterisk-size">*</span>
                      </label>
                    </div>
                    <div className="col-md-6 mg-t-7">
                      <p id="CustomerCode" name="CustomerCode">
                        {this.state.selectedProjectCode}
                      </p>
                    </div>
                  </div>
                  {this.state.selectedBatchNo && (
                    <div className="row row-sm">
                      <div className="col-md-4 text-nowrap">
                        <label htmlFor="CustomerCode">
                          <b>Batch No</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="CustomerCode" name="CustomerCode">
                          {this.state.selectedBatchNo}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="row row-sm">
                    <div className="col-md-4 text-nowrap">
                      <label htmlFor="CustomerCode">
                        <b>Allocation ID</b>{" "}
                        <span className="text-danger asterisk-size">*</span>
                      </label>
                    </div>
                    <div className="col-md-6 mg-t-7">
                      <p id="CustomerCode" name="CustomerCode">
                        {this.state.productionCompletedFileUploadAllocationID}
                      </p>
                    </div>
                  </div>
                  <div className="row row-sm">
                    <div className="col-md-4 text-nowrap">
                      <label htmlFor="CustomerCode">
                        <b>Activities</b>{" "}
                        <span className="text-danger asterisk-size">*</span>
                      </label>
                    </div>
                    <div className="col-md-6 mg-t-7">
                      <p id="CustomerCode" name="CustomerCode">
                        {this.state.productionCompletedFileUploadActivities}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <b>Prod. Completed File </b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="file"
                        className="form-control"
                        accept=".xlsx"
                        tabIndex="1"
                        key={this.state.productionCompletedFileKey}
                        id="UploadProductionCompletedFile"
                        onChange={this.uploadProductionCompletedFile}
                      />
                      {this.state.formErrors[
                        "productionCompletedFileError"
                      ] && (
                        <div className="error-message">
                          {
                            this.state.formErrors[
                              "productionCompletedFileError"
                            ]
                          }
                        </div>
                      )}
                    </div>
                    <div className="col-md-2">
                      {productionCompletedFileName && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-5"
                            onClick={this.deleteProductionCompletedFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Row className="mg-t-5">
                    <div className="col-md-4">
                      <b>Hours Worked</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="hoursWorked"
                        className="form-control"
                        value={this.state.hoursWorked}
                        onChange={this.onChangeHoursWorked}
                        max="23"
                        min="0"
                      />
                      {this.state.formErrors["hoursWorkedError"] && (
                        <div className="error-message">
                          {this.state.formErrors["hoursWorkedError"]}
                        </div>
                      )}
                    </div>
                  </Row>
                  <Row className="mg-t-5">
                    <div className="col-md-4">
                      <b>Minutes Worked</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="minutesWorked"
                        className="form-control"
                        value={this.state.minutesWorked}
                        onChange={this.onChangeMinutesWorked}
                        max="59"
                        min="0"
                      />
                      {this.state.formErrors["minutesWorkedError"] && (
                        <div className="error-message">
                          {this.state.formErrors["minutesWorkedError"]}
                        </div>
                      )}
                    </div>
                  </Row>
                  <div className="row row-sm mg-t-30">
                    <div className="col-md-2"></div>
                    <div className="col-md-4">
                      {loadingButton === true ? (
                        <button
                          className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                          disabled
                        >
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          Loading...
                        </button>
                      ) : (
                        <input
                          type="submit"
                          id="Save"
                          className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                          value="Validate and Upload"
                        />
                        // <span
                        //   className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        //   onClick={this.validateAndUploadProductionFile}
                        // >
                        //   Validate and Upload
                        // </span>
                      )}
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-3 mg-t-10 mg-lg-t-0">
                      <span
                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        onClick={this.hideProductionUploadedListPopup}
                      >
                        Close
                      </span>
                    </div>
                  </div>
                </form>
              </Modal.Body>
            </LoadingOverlay>
          </Modal>
          <Modal
            show={this.state.showProductionErrorUploadModal}
            dialogClassName="modal-width-produpload"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            enforceFocus={false}
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
                  Production Error Upload
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row row-sm">
                  <div className="col-md-4 text-nowrap">
                    <label htmlFor="CustomerCode">
                      <b>Customer Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="CustomerCode" name="CustomerCode">
                      {this.state.selectedCustomerCode}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-4 text-nowrap">
                    <label htmlFor="CustomerCode">
                      <b>Project Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="CustomerCode" name="CustomerCode">
                      {this.state.selectedProjectCode}
                    </p>
                  </div>
                </div>
                {this.state.selectedBatchNo && (
                  <div className="row row-sm">
                    <div className="col-md-4 text-nowrap">
                      <label htmlFor="CustomerCode">
                        <b>Batch No</b>{" "}
                        <span className="text-danger asterisk-size">*</span>
                      </label>
                    </div>
                    <div className="col-md-6 mg-t-7">
                      <p id="CustomerCode" name="CustomerCode">
                        {this.state.selectedBatchNo}
                      </p>
                    </div>
                  </div>
                )}
                <div className="row row-sm">
                  <div className="col-md-4 text-nowrap">
                    <label htmlFor="CustomerCode">
                      <b>Allocation ID</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="CustomerCode" name="CustomerCode">
                      {this.state.productionErrorFileUploadAllocationID}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-4 text-nowrap">
                    <label htmlFor="CustomerCode">
                      <b>Activities</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="CustomerCode" name="CustomerCode">
                      {this.state.productionErrorFileUploadActivities}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <b>Prod. Completed File </b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      className="form-control"
                      accept=".xlsx"
                      tabIndex="1"
                      key={this.state.productionErrorFileKey}
                      id="UploadProductionErrorFile"
                      onChange={this.uploadProductionErrorFile}
                    />
                    {this.state.formErrors["productionErrorFileError"] && (
                      <div className="error-message">
                        {this.state.formErrors["productionErrorFileError"]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2">
                    {productionErrorFileName && (
                      <>
                        <span
                          className="btn btn-secondary mg-l-5"
                          onClick={this.deleteProductionErrorFile}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="row row-sm mg-t-30">
                  <div className="col-md-2"></div>
                  <div className="col-md-4">
                    {ErrorModalloadingButton === true ? (
                      <button
                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        disabled
                      >
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </button>
                    ) : (
                      <span
                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        onClick={this.validateAndUploadProductionErrorFile}
                      >
                        Validate and Upload
                      </span>
                    )}
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-3 mg-t-10 mg-lg-t-0">
                    <span
                      className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                      onClick={this.hideProductionErrorPopupModal}
                    >
                      Close
                    </span>
                  </div>
                </div>
              </Modal.Body>
            </LoadingOverlay>
          </Modal>
        </LoadingOverlay>
      </>
    );
  }
}

export default withRouter(ProductionDownloadOrUpload);
