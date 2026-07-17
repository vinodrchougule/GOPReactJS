import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal } from "react-bootstrap";
import helper from "../../helpers/helpers";
import "./ProductionAllocation.scss";
import Moment from "moment";
import projectService from "../../services/project.service";
import QCService from "../../services/QC.service";
import productionAllocationService from "../../services/productionAllocation.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accessControlService from "../../services/accessControl.service";
toast.configure();

class QCDownloadOrUpload extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.fetchQCUploadedList = this.fetchQCUploadedList.bind(this);
    this.hideQCUploadListPopup = this.hideQCUploadListPopup.bind(this);
    this.hideQCUploadedListPopup = this.hideQCUploadedListPopup.bind(this);
    this.uploadQCCompletedFile = this.uploadQCCompletedFile.bind(this);
    this.deleteQCCompletedFile = this.deleteQCCompletedFile.bind(this);
    this.validateAndUploadQCFile = this.validateAndUploadQCFile.bind(this);

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
      QCCompletedFileUploadAllocationID: "",
      QCCompletedFileUploadActivities: "",
      QCCompletedFileUploadedName: "",
      QCCompletedFileName: "",
      QCCompletedFileKey: "",
      showQCUploadModal: false,
      showQCUploadedListModal: false,
      QCUploadedActivities: [],
      disableViewExistingQCUploads: true,
      loadingButton: false,
      canAccessQCDownloadOrUpload: false,
      isToRefreshActivityDetails: false,
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

    this.canUserAccessPage("QC Download-Upload");
    this.fetchCustomers();
  }
  //#endregion

  //#region fetching QC Download or Upload page access
  canUserAccessPage(pageName) {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        this.setState({
          canAccessQCDownloadOrUpload: response.data,
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

    QCService.getCustomerCodes(helper.getUser(), "O")
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
        disableViewExistingQCUploads: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Projects...",
      loading: true,
    });

    QCService.getProjectCodesOfCustomer(row.CustomerCode, helper.getUser(), "O")
      .then((response) => {
        this.setState({
          projectCodes: response.data,
          batches: [],
          selectedBatchNo: "",
          selectedCustomerCode: row.CustomerCode,
          customerCodeExpanded: [row.CustomerCode],
          selectedProjectCode: "",
          customerCode: "",
          projectCode: "",
          batchNo: "",
          scope: "",
          inputCount: "",
          activities: [],
          disableViewExistingQCUploads: true,
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
        disableViewExistingQCUploads: true,
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching batches...",
      loading: true,
    });

    QCService.getBatchesOfProject(
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
            loading: false,
            customerCode: "",
            projectCode: "",
            batchNo: "",
            scope: "",
            inputCount: "",
            activities: [],
            disableViewExistingQCUploads: true,
          });
        } else {
          this.fetchProjectDetails(
            this.state.selectedCustomerCode,
            row.ProjectCode,
            ""
          );
          this.setState({
            selectedProjectCode: row.ProjectCode,
            projectCodeExpanded: [row.ProjectCode],
            batches: [],
            selectedBatchNo: "",
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

    QCService.getActivityDetails(
      customerCode,
      projectCode,
      helper.getUser(),
      batchNo
    )
      .then((response) => {
        let activityDetails = response.data;
        let obj = activityDetails.find((o) => o.QCCompletedCount > 0);

        if (!obj) {
          this.setState({ disableViewExistingQCUploads: true });
        } else {
          this.setState({ disableViewExistingQCUploads: false });
        }
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
    hideSelectColumn: true,
    clickToSelect: true,
    bgColor: "#DCDCDC",
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

  //#region Hide QC allocated list pop up
  hideQCUploadListPopup() {
    if (this.state.isToRefreshActivityDetails) {
      this.fetchActivityDetails(
        this.state.selectedCustomerCode,
        this.state.selectedProjectCode,
        this.state.selectedBatchNo
      );
    }
    this.setState({ showQCUploadedListModal: false });
  }
  //#endregion

  //#region Fetch QC Uploaded List Details
  fetchQCUploadedList() {
    this.setState({
      spinnerMessage: "Please wait while fetching QC Uploaded List...",
      loading: true,
      isToRefreshActivityDetails: false,
    });

    QCService.getQCUploadedDetails(
      this.state.selectedCustomerCode,
      this.state.selectedProjectCode,
      helper.getUser(),
      this.state.selectedBatchNo
    )
      .then((response) => {
        if (response.data.length === 0) {
          this.hideQCUploadListPopup();
          this.setState({ disableViewExistingQCUploads: true, loading: false });
          return;
        }
        this.setState({
          QCUploadedActivities: response.data,
          showQCUploadedListModal: true,
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
  downloadQCAllocatedFile(QCAllocationID, Activity, QCAllocatedCount) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading QC allocated details of User...",
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
        QCAllocatedCount;
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
        QCAllocatedCount;
    }

    var data = {
      QCAllocationID: QCAllocationID,
      Activities: Activity,
      QCUser: helper.getUser(),
    };

    QCService.downloadQCAllocatedFile(data)
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

  //#region Show QC Upload Modal
  showQCCompletedFileUploadPopUp(QCAllocationID, QCActivities) {
    this.setState({
      QCCompletedFileUploadAllocationID: QCAllocationID,
      QCCompletedFileUploadActivities: QCActivities,
      formErrors: {},
      QCCompletedFileName: "",
      showQCUploadModal: true,
    });
  }
  //#endregion

  //#region Close QC File Upload Modal
  hideQCUploadedListPopup() {
    this.setState({
      showQCUploadModal: false,
    });
  }
  //#endregion

  //#region Upload QC Completed File
  uploadQCCompletedFile(e) {
    if ((e.target.value === null) | (e.target.value === "")) {
      this.setState({
        QCCompletedFileUploadedName: "",
        QCCompletedFileName: "",
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

      invalidFileError["QCCompletedFileError"] =
        "Upload file should be in .xlsx format";

      this.setState({
        formErrors: invalidFileError,
        QCCompletedFileKey: Date.now(),
        QCCompletedFileName: "",
      });
      return;
    }

    const fsize = e.target.files.item(0).size;
    const file = Math.round(fsize / 1024);
    let formErrors = {};

    if (file > 10000) {
      formErrors["QCCompletedFileError"] =
        "Max. file size should not exceed 10Mb";

      this.setState({
        formErrors: formErrors,
        QCCompletedFileKey: Date.now(),
        QCCompletedFileName: "",
      });
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while uploading QC completed file...",
      modalLoading: true,
    });

    var files = e.target.files;

    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
    this.setState({
      QCCompletedFileUploadedName: fileNameUploaded,
    });

    let formData = new FormData();
    formData.append("File", currentFile);

    //Service call
    projectService
      .saveFileupload(formData)
      .then((response) => {
        this.setState({
          modalLoading: false,
          QCCompletedFileName: response.data,
        });
      })
      .catch((error) => {
        this.setState({
          modalLoading: false,
          QCCompletedFileName: "",
          QCCompletedFileUploadedName: "",
        });
        toast.error(error.response.data.Message, { autoClose: false });
      });

    if (e.target.value !== "" && e.target.value !== null) {
      this.setState({ formErrors: "" });
    }
  }
  //#endregion

  //#region Delete Uploaded File
  deleteQCCompletedFile() {
    this.setState({
      spinnerMessage: "Please wait while deleting QC Completed File...",
      modalLoading: true,
    });
    projectService
      .deleteFile(this.state.QCCompletedFileName)
      .then(() => {
        this.setState({
          QCCompletedFileKey: Date.now(),
          QCCompletedFileName: "",
          QCCompletedFileUploadedName: "",
          modalLoading: false,
        });
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        this.setState({
          QCAllocatedFileName: "",
          modalLoading: false,
        });
      });
  }
  //#endregion

  //#region Validate and Upload QC completed File
  validateAndUploadQCFile() {
    const QCcompletedFile = this.state.QCCompletedFileName.trim();
    let formErrors = {};

    //Changed Username
    if (!QCcompletedFile) {
      formErrors["QCCompletedFileError"] = "Please Select QC Completed File";

      this.setState({ formErrors: formErrors });
      return;
    }

    this.setState({
      spinnerMessage:
        "Please wait while Validating and Uploading QC completed file...",
      modalLoading: true,
    });

    var data = {
      QCAllocationID: this.state.QCCompletedFileUploadAllocationID,
      Activities: this.state.QCCompletedFileUploadActivities,
      UploadedFileName: this.state.QCCompletedFileName,
      UserID: helper.getUser(),
    };

    QCService.uploadQCCompletedFile(data)
      .then((response) => {
        toast.success("QC Upload Completed Successfully");
        this.setState({
          QCCompletedFileName: "",
          modalLoading: false,
        });
        this.fetchActivityDetails(
          this.state.selectedCustomerCode,
          this.state.selectedProjectCode,
          this.state.selectedBatchNo
        );
        this.setState({ showQCUploadModal: false });
      })
      .catch((e) => {
        this.setState({
          QCCompletedFileKey: Date.now(),
          QCCompletedFileName: "",
          QCCompletedFileUploadedName: "",
          modalLoading: false,
        });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Download QC Uploaded File
  downloadQCUploadedFile(QCUploadID, uploadedFileName) {
    this.setState({
      spinnerMessage: "Please wait while downloading QC uploaded file...",
      modalLoading: true,
    });

    QCService.downloadQCUploadedFile(QCUploadID)
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

  //#region Delete QC Upload
  deleteQCUpload(QCUploadID) {
    this.setState({
      spinnerMessage: "Please wait while deleting uploaded QC file...",
      modalLoading: true,
    });

    QCService.deleteQCUpload(QCUploadID, helper.getUser())
      .then(() => {
        toast.success("QC Upload Deleted Successfully");
        this.fetchQCUploadedList();

        this.setState({
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

  //#region  Download Production Error File
  downloadProductionErrorFile(QCAllocationID, Activities) {
    this.setState({
      spinnerMessage:
        "Please wait while downloading Production Error Completed File...",
      loading: true,
    });

    var data = {
      QCAllocationID: QCAllocationID,
      Activities: Activities,
      QCUser: helper.getUser(),
    };

    QCService.downloadProductionErrorFile(data)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "ProductionErrorSKUs_" +
            helper.getUser() +
            "_" +
            QCAllocationID +
            ".xlsx"
        );
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
    const user = helper.getUser();
    const QCCompletedFileName = this.state.QCCompletedFileName;
    const loadingButton = this.state.loadingButton;

    const canAccessQCDownloadOrUpload = this.state.canAccessQCDownloadOrUpload;

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
        dataField: "QCAllocationID",
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
        dataField: "QCAllocatedCount",

        text: "QC Allocated Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.QCAllocatedCount}{" "}
            <i
              className="fas fa-download pointer mg-l-10"
              title="Download Allocated SKUs"
              onClick={() =>
                this.downloadQCAllocatedFile(
                  row.QCAllocationID,
                  row.Activities,
                  row.QCAllocatedCount
                )
              }
              style={{
                color: row.IsAllocationDownloadedForQC === 0 ? "Grey" : "Green",
              }}
            ></i>{" "}
            {row.IsAllocationDownloadedForQC !== 0 &&
              row.QCAllocatedCount !== row.QCCompletedCount && (
                <>
                  <i
                    className="fas fa-upload pointer mg-l-10"
                    title="Upload QC Completed and Prod. Error SKUs"
                    onClick={() =>
                      this.showQCCompletedFileUploadPopUp(
                        row.QCAllocationID,
                        row.Activities
                      )
                    }
                    style={{
                      color: "Grey",
                    }}
                  ></i>
                </>
              )}
          </div>
        ),
      },
      {
        dataField: "QCCompletedCount",

        text: "QC Completed Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        headerAlign: "center",
      },
      {
        dataField: "QCPendingCount",

        text: "QC Pending Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        headerAlign: "center",
      },
      {
        dataField: "ProductionErrorCount",

        text: "Prod. Error Count",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        headerAlign: "center",
        formatter: (cell, row, rowIndex, extraData) => (
          <div>
            {row.ProductionErrorCount}{" "}
            {row.ProductionErrorCount > 0 &&
              row.IsProductionErrorUploadCompleted > 0 && (
                <i
                  className="fas fa-download pointer mg-l-10"
                  title="Download Allocated File"
                  onClick={() =>
                    this.downloadProductionErrorFile(
                      row.QCAllocationID,
                      row.Activities
                    )
                  }
                  style={{
                    color:
                      row.IsAllocationDownloadedForQC === 0 ? "Grey" : "Green",
                  }}
                ></i>
              )}{" "}
          </div>
        ),
      },
      {
        dataField: "IsAllocationDownloadedForQC",

        text: "Is Activity Downloaded for QC",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        hidden: true,
      },
      {
        dataField: "IsProductionErrorUploadCompleted",

        text: "Is Production Error Upload Completed",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
        align: "center",
        hidden: true,
      },
    ];
    //#endregion

    //#region Uploaded Activity Columns
    const QCUploadedColumns = [
      {
        dataField: "QCUploadID",

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
        dataField: "IsQCCompletedCountDownloaded",

        text: "Is QC  CompletedCount Downloaded",
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
                this.downloadQCUploadedFile(
                  row.QCUploadID,
                  row.UploadedFileName
                )
              }
            ></i>
            {row.IsQCCompletedCountDownloaded === 0 &&
              new Date(Moment()).getDate() ===
                new Date(row.UploadedOn).getDate() && (
                <i
                  className="fas fa-trash-alt pointer mg-l-20"
                  onClick={() => this.deleteQCUpload(row.QCUploadID)}
                  title="Discard Upload"
                ></i>
              )}
          </div>
        ),
      },
    ];
    //#endregion

    return !canAccessQCDownloadOrUpload ? (
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
              <h4 style={{ marginBottom: "10px" }}>QC</h4>
              <h6>User: {user} </h6>
              <Tab.Container defaultActiveKey="onGoing">
                <Nav variant="pills" className="mg-l-0 mg-b-20 mg-t-10">
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
                        <label htmlFor="batchNo">
                          <b>Batch No</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="batchNo" name="batchNo">
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
                          name="scope"
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
                        <label htmlFor="inputCount">
                          <b>Input Count</b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-6 mg-t-7">
                        <p id="inputCount" name="inputCount">
                          {this.state.inputCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    {!this.state.disableViewExistingQCUploads && (
                      <p
                        onClick={this.fetchQCUploadedList}
                        className="text-primary pointer mg-t-10"
                      >
                        View Existing QC Uploads
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="table-responsive mg-t-20"
                // style={{ height: "250px" }}
              >
                <BootstrapTable
                  keyField="QCAllocationID"
                  data={this.state.activities}
                  columns={activityColumns}
                />
              </div>
            </div>
          </div>
          <Modal
            show={this.state.showQCUploadedListModal}
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
                <Modal.Title id="viewExistingQCUploadModal">
                  Existing QC Uploads
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <BootstrapTable
                  keyField="QCUploadID"
                  data={this.state.QCUploadedActivities}
                  columns={QCUploadedColumns}
                />
                <div className="row row-sm mg-t-30">
                  <div className="col-md-5"></div>
                  <div className="col-md-2 mg-t-10 mg-lg-t-0">
                    <span
                      className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                      onClick={this.hideQCUploadListPopup}
                    >
                      Close
                    </span>
                  </div>
                </div>
              </Modal.Body>
            </LoadingOverlay>
          </Modal>
          <Modal
            show={this.state.showQCUploadModal}
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
                <Modal.Title id="deleteModal">QC Upload</Modal.Title>
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
                    <label htmlFor="ProjectCode">
                      <b>Project Code</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="ProjectCode" name="ProjectCode">
                      {this.state.selectedProjectCode}
                    </p>
                  </div>
                </div>
                {this.state.selectedBatchNo && (
                  <div className="row row-sm">
                    <div className="col-md-4 text-nowrap">
                      <label htmlFor="BatchNo">
                        <b>Batch No</b>{" "}
                        <span className="text-danger asterisk-size">*</span>
                      </label>
                    </div>
                    <div className="col-md-6 mg-t-7">
                      <p id="BatchNo" name="BatchNo">
                        {this.state.selectedBatchNo}
                      </p>
                    </div>
                  </div>
                )}
                <div className="row row-sm">
                  <div className="col-md-4 text-nowrap">
                    <label htmlFor="AllocationID">
                      <b>Allocation ID</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="AllocationID" name="AllocationID">
                      {this.state.QCCompletedFileUploadAllocationID}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-4 text-nowrap">
                    <label htmlFor="Activities">
                      <b>Activities</b>{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                  </div>
                  <div className="col-md-6 mg-t-7">
                    <p id="Activities" name="Activities">
                      {this.state.QCCompletedFileUploadActivities}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <b>QC Completed File </b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      className="form-control"
                      accept=".xlsx"
                      tabIndex="1"
                      key={this.state.QCCompletedFileKey}
                      id="UploadQCCompletedFile"
                      onChange={this.uploadQCCompletedFile}
                    />
                    {this.state.formErrors["QCCompletedFileError"] && (
                      <div className="error-message">
                        {this.state.formErrors["QCCompletedFileError"]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2">
                    {QCCompletedFileName && (
                      <>
                        <span
                          className="btn btn-secondary mg-l-5"
                          onClick={this.deleteQCCompletedFile}
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
                      <span
                        className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        onClick={this.validateAndUploadQCFile}
                      >
                        Validate and Upload
                      </span>
                    )}
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-3 mg-t-10 mg-lg-t-0">
                    <span
                      className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                      onClick={this.hideQCUploadedListPopup}
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

export default QCDownloadOrUpload;
