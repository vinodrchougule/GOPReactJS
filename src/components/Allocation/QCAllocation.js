import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap-table-next";
import helper from "../../helpers/helpers";
import Moment from "moment";
import QCAllocationService from "../../services/QCAllocation.service";
import projectService from "../../services/project.service";
import userService from "../../services/user.service";
import { Modal } from "react-bootstrap";
import "./ProductionAllocation.scss";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
toast.configure();

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

class QCAllocation extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.uploadQCAllocatedFile = this.uploadQCAllocatedFile.bind(this);
    this.deleteQCAllocatedFile = this.deleteQCAllocatedFile.bind(this);

    this.handleFormValidation = this.handleFormValidation.bind(this);
    this.validateAndAllocate = this.validateAndAllocate.bind(this);

    this.reset = this.reset.bind(this);

    this.fetchExistingQCAllocation = this.fetchExistingQCAllocation.bind(this);
    this.onChangeQCUser = this.onChangeQCUser.bind(this);

    this.changeProuctionUser = this.changeProuctionUser.bind(this);

    this.showDeletePopUp = this.showDeletePopUp.bind(this);
    this.handleDeleteNo = this.handleDeleteNo.bind(this);

    this.deleteQCAllocatedActivities =
      this.deleteQCAllocatedActivities.bind(this);

    this.showChangeUserPopUp = this.showChangeUserPopUp.bind(this);
    this.handleChangeUserNo = this.handleChangeUserNo.bind(this);

    this.handleAllocatedListNo = this.handleAllocatedListNo.bind(this);
    this.downloadQCOutput = this.downloadQCOutput.bind(this);

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
      disableViewExistingQCAllocation: true,
      customerCode: "",
      projectCode: "",
      batchNo: "",
      scope: "",
      inputCount: "",
      QCCompletedCount: "",
      QCCompletedPercentage: "",
      QCAllocatedFileName: "",
      QCAllocatedFileUploadedName: "",
      QCAllocatedFileKey: Date.now(),
      allocations: [],
      allocationActivitiyDetails: [],
      allocationDetailsExpanded: [],
      formErrors: {},
      users: [],
      changeUserModalQCAllocationDetailsID: "",
      changeUserModalQCAllocationID: "",
      changeUserModalQCActivities: "",
      changeUserModalQCAllocatedCount: "",
      changeUserModalQCPendingCount: "",
      changeUserModalQCUser: "",
      changeUserFormErrors: {},
      changedUsername: "",
      deleteModalQCAllocationID: "",
      deleteModalQCActivities: "",
      deleteModalQCAllocatedCount: "",
      deleteModalQCPendingCount: "",
      deleteModalQCUser: "",
      showDeleteModal: false,
      showChangeUserModal: false,
      showAllocatedListModal: false,
      canAccessQCAllocation: false,
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

    this.canUserAccessPage("QC Allocation");
    this.fetchUsersList();
    this.fetchCustomers();
  }
  //#endregion

  //#region fetching QC Allocation page access
  canUserAccessPage(pageName) {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        this.setState({
          canAccessQCAllocation: response.data,
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

  //#region fetching QC Completed customers from Web API
  fetchCustomers() {
    this.setState({
      spinnerMessage: "Please wait while fetching Customers...",
      loading: true,
    });

    QCAllocationService.getCustomerCodes("O")
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

  //#region fetching project codes of Selected customer from Web API
  fetchProjectsOfSelectedCustomer = (row, isExpand, rowIndex, e) => {
    if (!isExpand) {
      this.setState(() => ({
        customerCodeExpanded: [],
        selectedProjectCode: "",
        batches: [],
        selectedBatchNo: "",
        projectCodeExpanded: [],
        customerCode: "",
        projectCode: "",
        batchNo: "",
        scope: "",
        inputCount: "",
        QCCompletedCount: "",
        QCCompletedPercentage: "",
        QCAllocatedFileKey: Date.now(),
        QCAllocatedFileName: "",
        QCAllocatedFileUploadedName: "",
        disableViewExistingQCAllocation: true,
      }));
      return;
    }

    const formErrors = {
      ...this.state.formErrors,
      projectError: "",
    };

    this.setState({
      spinnerMessage: "Please wait while fetching Projects...",
      loading: true,
    });

    QCAllocationService.getProjectCodesOfCustomer(row.CustomerCode)
      .then((response) => {
        this.setState({
          projectCodes: response.data,
          batches: [],
          selectedBatchNo: "",
          selectedCustomerCode: row.CustomerCode,
          formErrors: formErrors,
          customerCodeExpanded: [row.CustomerCode],
          selectedProjectCode: "",
          customerCode: "",
          projectCode: "",
          batchNo: "",
          scope: "",
          inputCount: "",
          QCCompletedCount: "",
          QCCompletedPercentage: "",
          QCAllocatedFileKey: Date.now(),
          QCAllocatedFileName: "",
          QCAllocatedFileUploadedName: "",
          disableViewExistingQCAllocation: true,
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
        QCCompletedCount: "",
        QCCompletedPercentage: "",
        QCAllocatedFileKey: Date.now(),
        QCAllocatedFileName: "",
        QCAllocatedFileUploadedName: "",
        disableViewExistingQCAllocation: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Batches...",
      loading: true,
    });

    const formErrors = {
      ...this.state.formErrors,
      projectError: "",
    };

    QCAllocationService.getBatchesOfProject(
      this.state.selectedCustomerCode,
      row.ProjectCode
    )
      .then((response) => {
        if (response.data.length !== 0) {
          this.setState({
            batches: response.data,
            selectedProjectCode: row.ProjectCode,
            projectCodeExpanded: [row.ProjectCode],
            formErrors: formErrors,
            loading: false,
            disableViewExistingQCAllocation: true,
            customerCode: "",
            projectCode: "",
            batchNo: "",
            scope: "",
            inputCount: "",
            QCCompletedCount: "",
            QCCompletedPercentage: "",
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
            //formErrors: formErrors,
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
    const formErrors = {
      ...this.state.formErrors,
      projectError: "",
    };

    this.setState({
      spinnerMessage: "Please wait while loading project details...",
      loading: true,
    });

    QCAllocationService.getProjectDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        if (response.data.IsProjectAllocated === 0) {
          this.setState({
            disableViewExistingQCAllocation: true,
          });
        } else {
          this.setState({
            disableViewExistingQCAllocation: false,
          });
        }

        this.setState({
          selectedBatchNo: batchNo,
          customerCode: response.data.CustomerCode,
          projectCode: response.data.ProjectCode,
          batchNo: response.data.BatchNo,
          scope: response.data.Scope,
          inputCount: response.data.InputCount,
          QCCompletedCount: response.data.QCCompletedCount,
          QCCompletedPercentage: response.data.QCCompletedPercentage,
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

  //#region Uploading QC Allocated File
  uploadQCAllocatedFile(e) {
    if ((e.target.value === null) | (e.target.value === "")) {
      this.setState({
        QCAllocatedFileUploadedName: "",
        QCAllocatedFileName: "",
      });
      return;
    }

    const formErrors = {
      ...this.state.formErrors,
      QCAllocatedFileError: "",
    };

    this.setState({
      formErrors: formErrors,
    });

    let fileName = e.target.files[0].name;
    let allowedFileExtesions = ["xlsx"];

    if (!helper.IsValidFileExtension(fileName, allowedFileExtesions)) {
      let invalidFileError = {};

      invalidFileError["QCAllocatedFileError"] =
        "Allocation file should be in  .xlsx format";

      this.setState({
        formErrors: invalidFileError,
        QCAllocatedFileKey: Date.now(),
        QCAllocatedFileName: "",
      });
      return;
    }

    const fsize = e.target.files.item(0).size;
    const file = Math.round(fsize / 1024);
    let formErrorsFile = {};

    if (file > 20000) {
      formErrorsFile["QCAllocatedFileError"] =
        "Max. file size should not exceed 20Mb";

      this.setState({
        formErrors: formErrorsFile,
        QCAllocatedFileKey: Date.now(),
        QCAllocatedFileName: "",
      });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while uploading QC Allocation File...",
      loading: true,
    });

    var files = e.target.files;

    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
    this.setState({
      QCAllocatedFileUploadedName: fileNameUploaded,
    });

    let formData = new FormData();
    formData.append("File", currentFile);

    //Service call
    projectService
      .saveFileupload(formData)
      .then((response) => {
        this.setState({
          QCAllocatedFileName: response.data,
          formErrors: formErrors,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          QCAllocatedFileName: "",
        });
        toast.error(error.response.data.Message, { autoClose: false });
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...this.state.formErrors,
        QCAlloctedFileError: "",
      };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Deleting QC Allocated File
  deleteQCAllocatedFile() {
    this.setState({
      spinnerMessage: "Please wait while deleting QC allocation File...",
      loading: true,
    });
    projectService
      .deleteFile(this.state.QCAllocatedFileName)
      .then(() => {
        this.setState({
          QCAllocatedFileKey: Date.now(),
          QCAllocatedFileName: "",
          QCAllocatedFileUploadedName: "",
          loading: false,
        });
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        this.setState({
          QCAllocatedFileName: "",
          loading: false,
        });
      });
  }
  //#endregion

  //#region Validating the input data on Validate and Allocate button code
  handleFormValidation() {
    const QCAllocatedFileName = this.state.QCAllocatedFileName.trim();
    const customerCode = this.state.selectedCustomerCode.trim();
    const projectCode = this.state.selectedProjectCode.trim();
    const batchNos = this.state.batches;
    const batchNo = this.state.selectedBatchNo.trim();
    let formErrors = {};
    let isValidForm = true;

    //Customer Code
    if (customerCode) {
      if (projectCode) {
        if (batchNos.length > 0) {
          if (!batchNo) {
            isValidForm = false;
            formErrors["projectError"] = "Please Select Batch No";

            this.setState({ formErrors: formErrors });
          }
        }
      } else {
        isValidForm = false;
        formErrors["projectError"] = "Please Select Project Code";

        this.setState({ formErrors: formErrors });
      }
    } else {
      isValidForm = false;
      formErrors["projectError"] = "Please Select Customer Code";
    }

    //QC Allocated File
    if (!QCAllocatedFileName) {
      isValidForm = false;
      formErrors["QCAllocatedFileError"] = "Please Upload QC Allocated File";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region Validate and Allocate QC File
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
          "Please wait while Validating and Allocating QC Allocated file...",
        loading: true,
      });

      //Bind state data to object
      var data = {
        CustomerCode: this.state.selectedCustomerCode.trim(),
        ProjectCode: this.state.selectedProjectCode.trim(),
        BatchNo: this.state.selectedBatchNo.trim(),
        AllocatedFileName: this.state.QCAllocatedFileName,
        UserID: helper.getUser(),
      };

      //Service call
      QCAllocationService.ValidateAndAllocate(data)
        .then(() => {
          toast.success("QC Allocation Created Successfully");
          this.setState({
            QCAllocatedFileKey: Date.now(),
            QCAllocatedFileName: "",
            loading: false,
            disableViewExistingQCAllocation: false,
          });
        })
        .catch((error) => {
          this.setState({
            QCAllocatedFileKey: Date.now(),
            QCAllocatedFileName: "",
            loading: false,
          });
          toast.error(error.response.data.Message, { autoClose: false });
        });
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
    this.setState({ QCAllocatedFileKey: Date.now(), loading: false });
  }
  //#endregion

  //#region Fetch Existing QC Allocations
  fetchExistingQCAllocation() {
    this.setState({
      spinnerMessage:
        "Please wait while loading existing allocation details...",
      loading: true,
    });

    QCAllocationService.getExistingQCAllocation(
      this.state.selectedCustomerCode,
      this.state.selectedProjectCode,
      this.state.selectedBatchNo
    )
      .then((response) => {
        if (response.data.length === 0) {
          this.handleAllocatedListNo();
          this.setState({
            disableViewExistingQCAllocation: true,
            loading: false,
          });
          return;
        }
        this.setState({
          allocations: response.data,
          showAllocatedListModal: true,
          allocationDetailsExpanded: [],
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

  //#region Download QC Allocated File
  downloadQCAllocatedFile(QCAllocationID, allocatedFileName) {
    this.setState({
      spinnerMessage: "Please wait while downloading QC Allocated file...",
      modalLoading: true,
    });

    QCAllocationService.downloadQCAllocatedFile(QCAllocationID)
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

  //#region Fetch Activities of selected Allocation
  fetchExistingQCAllocationDetailsByID = (row, isExpand, rowIndex, e) => {
    if (!isExpand) {
      this.setState(() => ({
        allocationDetailsExpanded: [],
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while loading QC allocation details...",
      modalLoading: true,
    });

    QCAllocationService.getExistingQCAllocationDetailsByID(row.QCAllocationID)
      .then((response) => {
        this.setState({
          allocationActivitiyDetails: response.data,
          allocationDetailsExpanded: [row.QCAllocationID],
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

  //#region Select the Customer
  selectCustomerRow = {
    mode: "radio",
    hideSelectColumn: true,
    clickToSelect: true,
    clickToExpand: true,
  };
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
    hideSelectColumn: true,
    clickToSelect: true,
    bgColor: "#DCDCDC",
    //clickToExpand: true,
  };
  //#endregion

  handleDeleteNo() {
    this.setState({ showDeleteModal: false });
  }

  //#region Display Delete Pop up for deleting Allocation Activities
  showDeletePopUp(
    QCAllocationID,
    QCActivities,
    QCAllocatedCount,
    QCPendingCount,
    QCUser
  ) {
    this.setState({
      deleteModalQCAllocationID: QCAllocationID,
      deleteModalQCActivities: QCActivities,
      deleteModalQCAllocatedCount: QCAllocatedCount,
      deleteModalQCPendingCount: QCPendingCount,
      deleteModalQCUser: QCUser,
      showDeleteModal: true,
    });
  }
  //#endregion

  handleChangeUserNo() {
    this.setState({ showChangeUserModal: false });
  }

  //#region Display change User Modal pop up
  showChangeUserPopUp(
    QCAllocationDetailsID,
    QCAllocationID,
    Activities,
    QCUser,
    QCPendingCount,
    QCAllocatedCount
  ) {
    this.setState({
      changeUserModalQCAllocationDetailsID: QCAllocationDetailsID,
      changeUserModalQCAllocationID: QCAllocationID,
      changeUserModalQCActivities: Activities,
      changeUserModalQCAllocatedCount: QCAllocatedCount,
      changeUserModalQCPendingCount: QCPendingCount,
      changeUserModalQCUser: QCUser,
      changedUsername: "",
      showChangeUserModal: true,
      changeUserFormErrors: {},
    });
  }
  //#endregion

  //#region Get Selected Customer
  onChangeQCUser(e) {
    this.setState({
      changedUsername: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      this.setState({ changeUserFormErrors: [] });
    }
  }
  //#endregion

  //#region Change QC User for selected activities
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
      spinnerMessage: "Please wait while changing the user...",
      modalLoading: true,
    });

    var data = {
      QCAllocationDetailsID: this.state.changeUserModalQCAllocationID,
      QCAllocationID: this.state.changeUserModalQCAllocationID,
      Activities: this.state.changeUserModalQCActivities,
      QCUser: this.state.changeUserModalQCUser,
      ChangeToQCUser: this.state.changedUsername,
      UserID: helper.getUser(),
    };

    QCAllocationService.changeQCAllocationUser(data)
      .then((response) => {
        toast.success("QC Allocation Activity User Changed Successfully");
        this.setState({
          allocationDetailsExpanded: [],
          changedUsername: "",
          modalLoading: false,
        });
        this.fetchExistingQCAllocation();
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

  //#region Delete QC Allocated Activities
  deleteQCAllocatedActivities() {
    this.setState({
      spinnerMessage:
        "Please wait while deleting QC allocated activties of user...",
      modalLoading: true,
    });

    var data = {
      QCAllocationID: this.state.deleteModalQCAllocationID,
      Activities: this.state.deleteModalQCActivities,
      QCUser: this.state.deleteModalQCUser,
      UserID: helper.getUser(),
    };

    QCAllocationService.deleteQCAllocationActivities(data)
      .then((response) => {
        toast.success("QC Allocation Activity Deleted Successfully");
        this.fetchExistingQCAllocation();
        this.setState({
          showDeleteModal: false,
          allocationDetailsExpanded: [],
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

  //#region Delete QC Allocation
  deleteQCAllocation(QCAllocationID) {
    this.setState({
      spinnerMessage: "Please wait while deleting QC allocation...",
      modalLoading: true,
    });

    QCAllocationService.deleteQCAllocation(QCAllocationID, helper.getUser())
      .then(() => {
        this.setState({
          modalLoading: false,
        });
        toast.success("QC Allocation Deleted Successfully");
        this.fetchExistingQCAllocation();
      })
      .catch((e) => {
        this.setState({
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Hide Allocation List Pop up
  handleAllocatedListNo() {
    this.setState({ showAllocatedListModal: false });
  }
  //#endregion

  //#region Download QC Completed Count of Allocation Activity Details
  downloadQCCompletedCountofAllocationActivityDetails(
    allocationID,
    activities,
    QCUser
  ) {
    this.setState({
      spinnerMessage: "Please wait while downloading user QC completed file...",
      modalLoading: true,
    });

    var data = {
      QCAllocationID: allocationID,
      Activities: activities,
      QCUser: QCUser,
    };

    QCAllocationService.downloadQCCompletedAllocationActivities(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "QCCompletedActivities_" +
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
  //#endregion

  //#region Download QC Completed Count of Allocation
  downloadQCCompletedCountofAllocation(allocationID) {
    this.setState({
      spinnerMessage: "Please wait while downloading QC Completed file...",
      modalLoading: true,
    });

    QCAllocationService.downloadAllocationQCCompletedAllDetails(allocationID)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "QCCompletedAllocationAllDetails_" + allocationID + ".xlsx"
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

  //#region Download QC Output
  downloadQCOutput() {
    let outputFileName = "";

    if (this.state.selectedBatchNo) {
      outputFileName =
        "QCCompletedOutputTable_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        "_" +
        this.state.selectedBatchNo +
        ".xlsx";
    } else {
      outputFileName =
        "QCCompletedOutputTable_" +
        this.state.selectedCustomerCode +
        "_" +
        this.state.selectedProjectCode +
        ".xlsx";
    }

    this.setState({
      spinnerMessage: "Please wait while downloading QC output file...",
      loading: true,
    });

    QCAllocationService.downloadQCCompletedOutputTable(
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

  render() {
    const QCAllocatedFileName = this.state.QCAllocatedFileName;

    const canAccessQCAllocation = this.state.canAccessQCAllocation;

    //#region Customer Columns
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

    //#region Allocation Columns
    const allocationColumns = [
      {
        dataField: "QCAllocationID",

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
                title="Download QC Completed File"
                onClick={() =>
                  this.downloadQCCompletedCountofAllocation(row.QCAllocationID)
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
                this.downloadQCAllocatedFile(
                  row.QCAllocationID,
                  row.AllocatedFileName
                )
              }
            ></i>
            {row.AllocatedCount !== row.CompletedCount && (
              <i
                className="fas fa-trash-alt pointer mg-l-10"
                onClick={() => this.deleteQCAllocation(row.QCAllocationID)}
                title="Discard Allocation"
              ></i>
            )}
          </div>
        ),
      },
    ];
    //#endregion

    //#region Expand QC Allocation row and display activties
    const expandAllocationRow = {
      parentClassName: "rowBackgroundColor",
      className: "rowBackgroundColor",
      expanded: this.state.allocationDetailsExpanded,
      onExpand: this.fetchExistingQCAllocationDetailsByID,
      expandHeaderColumnRenderer: (isAnyExpands) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      ),
      onlyOneExpanding: true,
      expandByColumnOnly: true,
      showExpandColumn: true,
      renderer: (row) => (
        <div
          className="table-responsive"
          style={{
            height:
              this.state.allocationActivitiyDetails.length > 8 ? "280px" : "",
          }}
        >
          <BootstrapTable
            keyField="QCAllocationDetailsID"
            data={this.state.allocationActivitiyDetails}
            columns={allocationActivityColumns}
          />
        </div>
      ),
    };
    //#endregion

    //#region QC Allocation Activity Columns
    const allocationActivityColumns = [
      {
        dataField: "QCAllocationID",

        text: "Allocation ID",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        headerAlign: "center",
        align: "center",
        hidden: "true",
      },
      {
        dataField: "QCAllocationDetailsID",

        text: "QC Allocation Details ID",
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
        dataField: "QCAllocatedCount",

        text: "QC Allocated Count",
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
        dataField: "QCCompletedCount",

        text: "QC Completed Count",
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
            {row.QCCompletedCount}{" "}
            {row.QCCompletedCount > 0 && (
              <i
                className="fas fa-download pointer mg-l-10"
                title="Download QC Completed Activity File"
                onClick={() =>
                  this.downloadQCCompletedCountofAllocationActivityDetails(
                    row.QCAllocationID,
                    row.Activities,
                    row.QCUser
                  )
                }
              ></i>
            )}
          </div>
        ),
      },
      {
        dataField: "QCPendingCount",

        text: "QC Pending Count",
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
        dataField: "QCUser",

        text: "QC Allocated To",
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
            {row.QCAllocatedCount !== row.QCCompletedCount && (
              <>
                <i
                  className="fas fa-forward pointer mg-l-30"
                  title="Change User Allocation"
                  onClick={() =>
                    this.showChangeUserPopUp(
                      row.QCAllocationDetailsID,
                      row.QCAllocationID,
                      row.Activities,
                      row.QCUser,
                      row.QCPendingCount,
                      row.QCAllocatedCount
                    )
                  }
                ></i>
                <i
                  className="fas fa-trash-alt pointer mg-l-10"
                  title="Discard Activity Allocation"
                  onClick={() =>
                    this.showDeletePopUp(
                      row.QCAllocationID,
                      row.Activities,
                      row.QCAllocatedCount,
                      row.QCPendingCount,
                      row.QCUser
                    )
                  }
                ></i>
              </>
            )}
          </div>
        ),
      },
    ];
    //#endregion

    return !canAccessQCAllocation ? (
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
              <h4>QC Allocation</h4>
              <br />
              <Tab.Container defaultActiveKey="onGoing">
                <Nav variant="pills" className="mg-l-0 mg-b-20">
                  <Nav.Item style={{ border: "1px solid #5E41FC" }}>
                    <Nav.Link eventKey="onGoing">On Going</Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ border: "1px solid #5E41FC" }}>
                    <Nav.Link eventKey="delivered">Delivered</Nav.Link>
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
                        <label htmlFor="batchNo">
                          <b>Batch No</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="batchNo" name="ProjectCode">
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
                        <label htmlFor="scope">
                          <b>Scope</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p
                          id="scope"
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
                    <div className="row row-sm">
                      <div className="col-md-6">
                        <label htmlFor="OutputCount">
                          <b>Output Count</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <div className="row">
                          <p id="OutputCount" name="OutputCount">
                            {this.state.QCCompletedCount}{" "}
                          </p>
                          {this.state.QCCompletedCount > 0 && (
                            <p>( {this.state.QCCompletedPercentage}%)</p>
                          )}{" "}
                          {this.state.QCCompletedCount > 0 && (
                            <i
                              className="fas fa-download pointer mg-l-20 mg-t-3"
                              onClick={this.downloadQCOutput}
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{ marginRight: "0px", marginLeft: "0px" }}
              >
                <div
                  className="col-md-8 pd-t-5"
                  style={{ border: "1px solid #cdd4e0" }}
                >
                  <div className="row">
                    <div className="col-md-4 mg-t-8">
                      <p>Upload QC Allocated File</p>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="file"
                        className="form-control"
                        accept=".xlsx"
                        tabIndex="1"
                        key={this.state.QCAllocatedFileKey}
                        id="UploadQCAllocatedFile"
                        onChange={this.uploadQCAllocatedFile}
                      />
                      {this.state.formErrors["QCAllocatedFileError"] && (
                        <div className="error-message">
                          {this.state.formErrors["QCAllocatedFileError"]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-2">
                      {QCAllocatedFileName && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-5"
                            onClick={this.deleteQCAllocatedFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-4 pd-t-5"
                  style={{ border: "1px solid #cdd4e0" }}
                >
                  {this.state.disableViewExistingQCAllocation === false && (
                    <span
                      className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                      onClick={this.fetchExistingQCAllocation}
                    >
                      View Existing QC Allocations
                    </span>
                  )}
                </div>
              </div>
              <div className="row row-sm mg-t-30">
                <div className="col-md-2"></div>
                <div className="col-md-3 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={this.validateAndAllocate}
                  >
                    Validate and Allocate
                  </span>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-3  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="28"
                    onClick={this.reset}
                    id="Reset"
                  >
                    Reset
                  </span>
                </div>
              </div>
            </div>
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
                        {this.state.deleteModalQCAllocationID}
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
                      <p id="ProjectCode" name="ProjectCode">
                        {this.state.deleteModalQCActivities}
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
                        {this.state.deleteModalQCUser}
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
                        {this.state.deleteModalQCPendingCount}
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
                        {this.state.deleteModalQCAllocatedCount}
                      </p>
                    </div>
                  </div>
                  <div className="row row-sm mg-t-10">
                    <div className="col-md-2"></div>
                    <div className="col-md-3 mg-t-10 mg-lg-t-0">
                      <span
                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        onClick={this.deleteQCAllocatedActivities}
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
                    Change User Allocation
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
                        {this.state.changeUserModalQCAllocationID}
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
                        {this.state.changeUserModalQCActivities}
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
                        {this.state.changeUserModalQCUser}
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
                        {this.state.changeUserModalQCPendingCount}
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
                        {this.state.changeUserModalQCAllocatedCount}
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
                        onChange={this.onChangeQCUser}
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
                    Existing QC Allocation
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <BootstrapTable
                    keyField="QCAllocationID"
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
              </LoadingOverlay>
            </Modal>
          </div>
        </LoadingOverlay>
      </>
    );
  }
}

export default QCAllocation;
