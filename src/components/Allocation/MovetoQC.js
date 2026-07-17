import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import { Col, Row } from "react-bootstrap";
import helper from "../../helpers/helpers";
import { AgGridReact } from "ag-grid-react";
import productionAllocationTemplateService from "../../services/productionAllocationTemplate.service";
import { toast } from "react-toastify";
import accessControlService from "../../services/accessControl.service";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

class MovetoQC extends Component {
  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  constructor(props) {
    super(props);

    this.isloading = this.isloading.bind(this);
    this.downloadAllProductionItems =
      this.downloadAllProductionItems.bind(this);

    const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
    this.state = {
      loading: false,
      modalLoading: false,
      spinnerMessage: "",
      customers: [],
      customerCodeExpanded: [],
      selectedCustomerCode: state?.CustomerCode,
      projectCodes: [],
      projectCodeExpanded: [],
      selectedProjectCode: state?.ProjectCode,
      batches: [],
      selectedBatchNo: state?.batchNo,
      disableViewExistingProductionAllocation: true,
      customerCode: state?.CustomerCode,
      projectCode: state?.ProjectCode,
      batchNo: state?.batchNo,
      scope: state?.scope,
      allocationId: state?.AllocationId,
      inputCount: "",
      productionCompletedCount: "",
      productionCompletedPercentage: "",
      activities: [],
      productionAllocatedFileName: "",
      productionAllocatedFileUploadedName: "",
      messageForProductionAllocatedFile: false,
      productionAllocatedFileKey: Date.now(),
      fileFormErrors: {},
      formErrors: {},
      canAccessProductionDownloadOrUpload: false,
      dynamicColumnBody: [],
      totalRowCount: "",
      totalPages: "",
      pageSize: 20,
      currentPage: 1,
      rowData: [],
      projectSettings: {},
      selectedStatus: { rowId: "", status: "" },
      selectedLevel: { rowId: "", level: "" },
      isStatusUpdating: false,
      editModal: false,
      viewScreenData: {},
      previewModal: false,
      QCModalshow: false,
      selectedRowsForMoveToQC: [],
      selectedRows: [],
      QCconfirmmodalshow: false,
      status: "",
      isMovedToQC: "",
    };

    this.initialState = this.state;
  }
  //#region Display navigate to previous page
  goBackNavigation = () => {
    sessionStorage.removeItem("prodUpdateData");
    this.props.history.push({
      pathname: "/Allocation",
    });
  };
  //#endregion

  // #region to onclell clicked
  onCellClicked = (e) => {
    const { selectedOption } = this.state;
    if (e.colDef.field === "Action") {
      if (
        selectedOption === "Moved to QC" ||
        (e.data.IsMovedToQC === "Yes" && selectedOption === "All")
      ) {
        return;
      }
      const user = helper.getUser();
      const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
      let editScreen = {
        CustomerCode: state?.CustomerCode,
        ProjectCode: state?.ProjectCode,
        batchNo: state?.batchNo,
        ProductionItemID: e.data.ProductionItemID,
        NextProductionItemID: "",
        PreviousProductionItemID: "",
        AllocationId: state?.AllocationId,
        productionUser: user,
      };
      sessionStorage.setItem("ProdItemData", JSON.stringify(editScreen));
      this.setState((prevStates) => ({ ...prevStates, editModal: true }));
    } else if (e.colDef.field === "UniqueID") {
      const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
      let viewScreen = {};
      productionAllocationTemplateService
        .ProductionItemDetails(e.data.ProductionItemID)
        .then((resp) => {
          var savedNounModifier = {};
          if (resp.data.Noun && resp.data.Modifier) {
            savedNounModifier = {
              value: resp.data.Noun + "_" + resp.data.Modifier,
              label: resp.data.Noun + "_" + resp.data.Modifier,
            };
          }

          let modifiers = [];
          const formattedString = [];
          if (resp.data.ItemAttributes) {
            resp.data.ItemAttributes.forEach((item) => {
              if (
                item.AttributeValue !== "" &&
                item.AttributeValue !== undefined
              ) {
                modifiers.push(item.AttributeValue);
              }
            });

            resp.data.ItemAttributes.forEach((item) => {
              if (item.AttributeValue) {
                formattedString.push(
                  `${item.AttributeName}:${item.AttributeValue}`
                );
              }
            });
          }

          let attributeShort = "";
          let attributeLong = "";
          if (resp.data.Noun && resp.data.Modifier) {
            attributeShort =
              resp.data.Noun +
              "," +
              resp.data.Modifier +
              ": " +
              modifiers.join(", ");
            attributeLong =
              resp.data.Noun +
              "," +
              resp.data.Modifier +
              ": " +
              formattedString.join(", ");
          }

          viewScreen = {
            attributeShort: attributeShort,
            attributeLong: attributeLong,
            productionItemID: resp.data.ProductionItemID,
            nextProductionItemID: resp.data.NextProductionItemID,
            previousProductionItemID: resp.data.PreviousProductionItemID,
            customerCode: state.CustomerCode,
            projectCode: state.ProjectCode,
            batchNo: state.batchNo,
            uniqueId: resp.data.UniqueID,
            shortDescription: resp.data.ShortDescription,
            longDescription: resp.data.LongDescription,
            uOM: resp.data.UOM,
            newShortDescription: resp.data.NewShortDescription,
            newLongDescription: resp.data.NewLongDescription,
            missingWords: resp.data.MissingWords,
            mfrName: resp.data.MFRName,
            mfrPN: resp.data.MFRPN,
            vendorName: resp.data.VendorName,
            vendorPN: resp.data.VendorPN,
            customColumnName1: resp.data.CustomColumnName1,
            customColumnName1Value: resp.data.CustomColumnName1Value,
            customColumnName2: resp.data.CustomColumnName2,
            customColumnName2Value: resp.data.CustomColumnName2Value,
            customColumnName3: resp.data.CustomColumnName3,
            customColumnName3Value: resp.data.CustomColumnName3Value,
            selectedStatus: resp.data.Status,
            selectedLevel: resp.data.Level,
            mfrName1: { label: resp.data.MFRName1, value: resp.data.MFRName1 },
            mfrPN1: { label: resp.data.MFRPN1, value: resp.data.MFRPN1 },
            mfrName2: { label: resp.data.MFRName2, value: resp.data.MFRName2 },
            mfrPN2: { label: resp.data.MFRPN2, value: resp.data.MFRPN2 },
            mfrName3: { label: resp.data.MFRName3, value: resp.data.MFRName3 },
            mfrPN3: { label: resp.data.MFRPN3, value: resp.data.MFRPN3 },
            mfrNameDescription: `${
              resp.data.MFRName1 && resp.data.MFRName1 + ","
            }${resp.data.MFRName2 && resp.data.MFRName2 + ","}${
              resp.data.MFRName3 && resp.data.MFRName3
            }`,
            mfrPNDescription: `${resp.data.MFRPN1 && resp.data.MFRPN1 + ","}${
              resp.data.MFRPN2 && resp.data.MFRPN2 + ","
            }${resp.data.MFRPN3 && resp.data.MFRPN3}`,
            MFRNames: {
              mfrName1: resp.data.MFRName1,
              mfrName2: resp.data.MFRName2,
              mfrName3: resp.data.MFRName3,
            },
            MFRPNs: {
              mfrPN1: resp.data.MFRPN1,
              mfrPN2: resp.data.MFRPN2,
              mfrPN3: resp.data.MFRPN3,
            },
            vendorName1: {
              label: resp.data.VendorName1,
              value: resp.data.VendorName1,
            },
            vendorPN1: {
              label: resp.data.VendorPN1,
              value: resp.data.VendorPN1,
            },
            vendorName2: {
              label: resp.data.VendorName2,
              value: resp.data.VendorName2,
            },
            vendorPN2: {
              label: resp.data.VendorPN2,
              value: resp.data.VendorPN2,
            },
            vendorName3: {
              label: resp.data.VendorName3,
              value: resp.data.VendorName3,
            },
            vendorPN3: {
              label: resp.data.VendorPN3,
              value: resp.data.VendorPN3,
            },
            vendorNameDescription: `${
              resp.data.VendorName1 && resp.data.VendorName1 + ","
            }${resp.data.VendorName2 && resp.data.VendorName2 + ","}${
              resp.data.VendorName3 && resp.data.VendorName3
            }`,
            vendorPNDescription: `${
              resp.data.VendorPN1 && resp.data.VendorPN1 + ","
            }${resp.data.VendorPN2 && resp.data.VendorPN2 + ","}${
              resp.data.VendorPN3 && resp.data.VendorPN3
            }`,
            vendorsNames: {
              vendorName1: resp.data.VendorName1,
              vendorName2: resp.data.VendorName2,
              vendorName3: resp.data.VendorName3,
            },
            vendorsPN: {
              vendorPN1: resp.data.VendorPN1,
              vendorPN2: resp.data.VendorPN2,
              vendorPN3: resp.data.VendorPN3,
            },
            additionalInfo: resp.data.AdditionalInfo,
            additionalInfoFromWeb: resp.data.AdditionalInfoFromWeb,
            addWebInputInfo: `${
              (resp.data.AdditionalInfoFromWeb || resp.data.AdditionalInfo) &&
              resp.data.AdditionalInfoFromWeb + "," + resp.data.AdditionalInfo
            }`,
            unspscCode: resp.data.UNSPSCCode,
            unspscCategory: resp.data.UNSPSCCategory,
            webRefURL1: resp.data.WebRefURL1,
            webRefURL2: resp.data.WebRefURL2,
            webRefURL3: resp.data.WebRefURL3,
            webRefPdfURL: resp.data.PDFURL,
            remarks: resp.data.Remarks,
            query: resp.data.Query,
            itemAttributes: resp.data.ItemAttributes,
            userID: resp.data.UserID,
            selectedNounModifier: savedNounModifier,
            allResponseData: resp.data,
            loading: false,
          };

          this.setState((prevStates) => ({
            ...prevStates,
            previewModal: true,
            viewScreenData: viewScreen,
          }));
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    }
  };
  //#endregion

  hideEdiModal = () => {
    this.fetchDynamicAGGridData(this.state.currentPage, this.state.pageSize);
    this.setState((prevState) => ({ ...prevState, editModal: false }));
  };

  hidePreviewModal = () => {
    this.setState((prevState) => ({ ...prevState, previewModal: false }));
  };

  // #region apply row style
  getRowStyle = (params) => {
    if (params) {
      if (
        params.data.Status === "Completed" ||
        params.data.Status === "Query"
      ) {
        return { background: "#DDEEFA" };
      }
    }
    return null; // or return {}
  };
  // #endregion

  // #region row selecion changed
  onSelectionChanged = () => {
    const selectedRows = this.gridApi ? this.gridApi.getSelectedRows() : [];
    this.setState({ selectedRows });
  };
  // #endregion

  handleConfirmModalShow = () => {
    this.setState({ QCconfirmmodalshow: true });
  };

  handleClose = () => {
    this.setState({ QCconfirmmodalshow: false });
    this.props.dataFetch(
      this.state.currentPage,
      this.state.pageSize,
      this.props.selectedStatus,
      false
    );
  };

  // #region click on selected to move to QC
  handleConfirmMoveToQC = () => {
    const { selectedRows } = this.state;
    const productionItemIDs = selectedRows.map((row) => ({
      ProductionItemID: row.ProductionItemID,
    }));

    let postData = {
      CustomerCode: this.state.customerCode,
      ProjectCode: this.state.projectCode,
      BatchNo: this.state.batchNo,
      ProductionAllocationID: this.state.allocationId,
      ProductionItemIDs: productionItemIDs,
      UserID: helper.getUser(),
    };

    productionAllocationTemplateService
      .moveToQC(postData)
      .then(() => {
        toast.success("Selected items have been moved to QC.");
        this.setState({ selectedRows: [] }, () => {
          this.fetchDynamicAGGridData(
            this.state.currentPage,
            this.state.pageSize,
            ["Completed", "Moved to QC"]
          );
        });
        this.handleClose();
      })
      .catch((e) => {
        toast.error("An error occurred while moving items to QC.");
        console.error("Error:", e);
      });
  };
  // #endregion

  // #region grid selection
  handleSelectionChanged = () => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.setState({ selectedRows: selectedData });
  };
  // #endregion

  // #region move to QC modal
  handleMoveToQC = () => {
    if (this.state.selectedRows.length === 0) {
      toast.error("Please select at least one row to move to QC.");
      return;
    }
    this.handleConfirmModalShow();
  };

  handleSave = () => {
    const { selectedRows } = this.state;
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("No rows selected");
      return;
    }

    const productionItemIDs = selectedRows.map((row) => row.ProductionItemID);

    productionAllocationTemplateService
      .saveProductionItemIDs(productionItemIDs)
      .then(() => {
        toast.success("Data successfully moved to QC");
        this.handleClose();
      })
      .catch((error) => {
        toast.error("Error moving data to QC");
        console.error(error);
      });
  };
  // #endregion

  // #region grid data adding
  onGridReady = (params) => {
    this.gridApi = params.api;
  };

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

  //#region Display/ Hide Spinner
  isloading(e) {
    this.setState({
      loading: true,
    });
  }
  //#endregion

  //#region fetching Batch Nos. of Selected Project from Web API
  downloadAllProductionItems() {
    this.setState({
      spinnerMessage: "Please wait while downloading all production Items...",
      modalLoading: true,
    });

    const user = helper.getUser();
    let sendBatchNo = "";
    let fileName = "";
    if (
      this.state.selectedBatchNo !== undefined &&
      this.state.selectedBatchNo !== ""
    ) {
      sendBatchNo = this.state.selectedBatchNo;
      fileName =
        "ProductionItemDetails_" +
        this.state.customerCode +
        "_" +
        this.state.projectCode +
        "_" +
        this.state.allocationId +
        "_" +
        this.state.batchNo +
        "_" +
        user +
        ".xlsx";
    } else {
      sendBatchNo = "";
      fileName =
        "ProductionItemDetails_" +
        this.state.customerCode +
        "_" +
        this.state.projectCode +
        "_" +
        this.state.allocationId +
        "_" +
        user +
        ".xlsx";
    }

    productionAllocationTemplateService
      .downloadAllProductionItemFiles(
        this.state.customerCode,
        this.state.projectCode,
        this.state.allocationId,
        user,
        sendBatchNo
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
  //#region page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
    this.canUserAccessPage("Production Download-Upload");
    let selectedOption = "";

    if (this.state.viewedbystatus === "In Process") {
      selectedOption = "I";
    } else if (this.state.viewedbystatus === "Query") {
      selectedOption = "Q";
    } else if (this.state.viewedbystatus === "Move To QC") {
      selectedOption = "M";
    } else if (this.state.viewedbystatus === "All") {
      selectedOption = "A";
    } else {
      selectedOption = this.state.selectedOption;
    }

    this.fetchDynamicAGGridData(
      this.state.currentPage,
      this.state.pageSize,
      selectedOption
    );
  }
  //#endregion
  // #region pagination functions
  onPageChange = (e) => {
    this.setState((prev) => ({ ...prev, currentPage: +e.target.value }));
    if (e.target.value) {
      if (
        +e.target.value === 0 ||
        Number(e.target.value) > this.state.totalPages
      ) {
        toast.warning("Please enter valid page number");
        return;
      }
      this.fetchDynamicAGGridData(+e.target.value, this.state.pageSize);
    }
  };

  handlePaginationPage = (val) => {
    if (val) {
      this.setState((prev) => ({ ...prev, currentPage: val }));
      this.fetchDynamicAGGridData(val, this.state.pageSize);
    }
  };

  // #endregion

  isEditable = (params) => {
    // Check if the rowId and status match the selectedStatus
    return (
      (params.data.ProductionItemID === this.state.selectedStatus.rowId &&
        (this.state.selectedStatus.status === "Completed" ||
          this.state.selectedStatus.status === "Query")) ||
      params.data.Status === "Completed" ||
      params.data.Status === "Query"
    );
  };
  #region;

  fetchDynamicAGGridData = (
    currentPage,
    pageSize,
    status = "Completed",
    isMovedToQC
  ) => {
    const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
    this.setState({
      spinnerMessage: "Please wait while fetching Production Update List...",
      loading: true,
    });

    productionAllocationTemplateService
      .ProductionItemDetailsOfProductionUserFromAllocation(
        state?.CustomerCode,
        state?.ProjectCode,
        state?.AllocationId,
        helper.getUser(),
        state?.batchNo,
        currentPage,
        pageSize,
        status,
        isMovedToQC
      )

      .then((resp) => {
        if (resp && resp.data) {
          const updatedData = resp.data.map((item) => ({
            ...item,
            [item.CustomColumnName1]: item.CustomColumnName1Value,
            [item.CustomColumnName2]: item.CustomColumnName2Value,
            [item.CustomColumnName3]: item.CustomColumnName3Value,
          }));
          updatedData.forEach((item) => (item.Action = "Edit"));

          let totalRowCount =
            updatedData.length > 0 ? updatedData[0].TotalRowsCount : 0;
          let totalPages = Math.ceil(totalRowCount / this.state.pageSize);

          this.setState({
            dynamicColumnBody: updatedData,
            totalPages: totalPages,
            totalRowCount: totalRowCount,
            modalLoading: false,
            loading: false,
            rowData: updatedData,
          });
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((e) => {
        console.error("Error fetching data:", e);
        this.setState({
          modalLoading: false,
          loading: false,
        });
        const errorMessage =
          e.response?.data?.Message || "An error occurred while fetching data.";
        toast.error(errorMessage, { autoClose: false });
      });
  };

  render() {
    const user = helper.getUser();

    const { dynamicColumnBody } = this.state;

    const dynamicColumnHead = [
      {
        headerName: "",
        minWidth: 50,
        maxWidth: 50,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        pinned: "left",
      },

      {
        field: "ProductionAllocationID",
        headerName: "Production Allocation ID",
        minWidth: 120,
        cellClass: "dynamic-readOnly-field",
        hide: true,
      },
      {
        field: "ProductionItemID",
        headerName: "Production Item ID",
        minWidth: 120,
        cellClass: "dynamic-readOnly-field",
        hide: true,
      },
      {
        field: "UniqueID",
        headerName: "Unique ID",
        minWidth: 170,
        cellClass: "dynamic-readOnly-field dynamic-readOnly-id",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 170,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
        pinned: "left",
      },

      {
        field: "Status",
        headerName: "Status",
        minWidth: 100,
        sortable: true,
        width: 100,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["In Process", "Completed", "Query"],
        },
      },
      {
        field: "Level",
        headerName: "Level",
        minWidth: 100,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
      },

      {
        field: "ShortDescription",
        headerName: "Short Description",
        minWidth: 270,
        cellClass: "dynamic-readOnly-field shrttxt",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
          whiteSpace: "nowrap",
        },
      },
      {
        field: "LongDescription",
        headerName: "Long Description",
        minWidth: 510,
        cellClass: "dynamic-readOnly-field lngtxt",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
          whiteSpace: "nowrap",
          paddingRight: "5px",
        },
      },
      {
        field: "UOM",
        headerName: "UOM",
        minWidth: 100,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "NewShortDescription",
        headerName: "New Short Description",
        minWidth: 200,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 200,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "NewLongDescription",
        headerName: "New Long Description",
        minWidth: 200,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 200,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "MFRName",
        headerName: "MFR Name",
        minWidth: 160,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "MFRPN",
        headerName: "MFR PN",
        minWidth: 120,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "VendorName",
        headerName: "Vendor Name",
        minWidth: 160,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "VendorPN",
        headerName: "Vendor PN",
        minWidth: 120,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
        cellStyle: {
          textAlign: "left",
          paddingTop: "7px",
          paddingBottom: "5px",
        },
      },
      {
        field: "CustomColumnName1Value",
        headerName: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName1
        }`,
        minWidth: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName1
            ? "120"
            : "1"
        }`,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName1
            ? "200"
            : "1"
        }`,
      },
      {
        field: "CustomColumnName2Value",
        headerName: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName2
        }`,
        minWidth: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName2
            ? "120"
            : "1"
        }`,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName2
            ? "200"
            : "1"
        }`,
      },
      {
        field: "CustomColumnName3Value",
        headerName: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName3
        }`,
        minWidth: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName3
            ? "120"
            : "1"
        }`,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: `${
          this.state.dynamicColumnBody.length !== 0 &&
          this.state.dynamicColumnBody[0].CustomColumnName3
            ? "120"
            : "1"
        }`,
      },
      {
        field: "Noun",
        headerName: "Noun",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "Modifier",
        headerName: "Modifier",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "MFRName1",
        headerName: "MFR Name 1",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "MFRPN1",
        headerName: "MFR PN 1",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "MFRName2",
        headerName: "MFR Name 2",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "MFRPN2",
        headerName: "MFR PN 2",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "MFRName3",
        headerName: "MFR Name 3",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "MFRPN3",
        headerName: "MFR PN 3",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "VendorName1",
        headerName: "Vendor Name 1",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "VendorPN1",
        headerName: "Vendor PN 1",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "VendorName2",
        headerName: "Vendor Name 2",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "VendorPN2",
        headerName: "Vendor PN 2",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "VendorName3",
        headerName: "Vendor Name 3",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "VendorPN3",
        headerName: "Vendor PN 3",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        field: "AdditionalInfoFromWeb",
        headerName: "Additional Info From Web",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "AdditionalInfo",
        headerName: "Additional Info From Input",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "UNSPSCCode",
        headerName: "UNSPSC Code",
        minWidth: 140,
        resizable: false,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 140,
      },
      {
        field: "UNSPSCCategory",
        headerName: "UNSPSC Category",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "WebRefURL1",
        headerName: "URL 1",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "WebRefURL2",
        headerName: "URL 2",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "WebRefURL3",
        headerName: "URL 3",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "PDFURL",
        headerName: "PDF URL",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "Remarks",
        headerName: "Remarks",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
      {
        field: "Query",
        headerName: "Query",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filter: "agTextColumnFilter",
        width: 160,
      },
    ];

    const setHeight = (value) => {
      return { height: `${value}%` };
    };

    return (
      <Modal
        show={this.props.QcModalShow}
        onHide={this.props.handleCloseQCModal}
        className="edit-gop-modal mymnmdl"
      >
        <Modal.Header closeButton className="clsbtn">
          <Modal.Title className="mymdltle">Pending to move QC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={setHeight(93)} className="production-update-main">
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
              <Row className="mg-l-0 mg-r-0" style={setHeight(95)}>
                <Col lg={12} style={{ maxWidth: "100%" }}>
                  <div style={setHeight(100)}>
                    <div
                      className="production-details-row"
                      style={setHeight(3)}
                    >
                      <div className="gop-mfr-row">
                        <label
                          className="readOnlyHead form-label m-0"
                          htmlFor="custCode"
                        >
                          {" "}
                          Customer Code:{" "}
                        </label>
                        &nbsp;
                        <p
                          id="CustomerCode"
                          name="CustomerCode"
                          className="m-0"
                        >
                          {this.state.customerCode}
                        </p>
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="gop-mfr-row">
                        <label
                          className="readOnlyHead form-label m-0"
                          htmlFor="custCode"
                        >
                          {" "}
                          Project Code:{" "}
                        </label>
                        &nbsp;
                        <p id="ProjectCode" name="ProjectCode" className="m-0">
                          {this.state.projectCode}
                        </p>
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="gop-mfr-row">
                        <label
                          className="readOnlyHead form-label m-0"
                          htmlFor="custCode"
                        >
                          {" "}
                          Production Allocation Id:{" "}
                        </label>
                        &nbsp;
                        <p id="ProjectCode" name="ProjectCode" className="m-0">
                          {this.state.allocationId}
                        </p>
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="gop-mfr-row">
                        <label
                          className="readOnlyHead form-label m-0"
                          htmlFor="custCode"
                        >
                          {" "}
                          Production User:{" "}
                        </label>
                        &nbsp;
                        <p id="ProjectCode" name="ProjectCode" className="m-0">
                          {user}
                        </p>
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="gop-mfr-row">
                        <label
                          className="readOnlyHead form-label m-0"
                          htmlFor="custCode"
                        >
                          {" "}
                          Batch No:{" "}
                        </label>
                        &nbsp;
                        <p id="BatchNo" name="BatchNo" className="m-0">
                          {this.state.batchNo ? this.state.batchNo : "N/A"}
                        </p>
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="gop-mfr-row">
                        <label
                          className="readOnlyHead form-label m-0"
                          htmlFor="custCode"
                        >
                          {" "}
                          Scope:{" "}
                        </label>
                        &nbsp;
                        <p
                          id="Scope"
                          name="Scope"
                          className="scopeOverflowProduction m-0"
                          title={this.state.scope}
                        >
                          {this.state.scope}
                        </p>
                      </div>
                    </div>
                    <div style={{ paddingTop: "10px", ...setHeight(97) }}>
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
                        <div style={setHeight(100)}>
                          <div className="ag-theme-alpine production-theme-alpine">
                            <AgGridReact
                              columnDefs={dynamicColumnHead}
                              rowData={dynamicColumnBody}
                              onCellClicked={this.onCellClicked}
                              getRowStyle={this.getRowStyle}
                              rowSelection="multiple"
                              onSelectionChanged={this.handleSelectionChanged}
                              onGridReady={(params) =>
                                (this.gridApi = params.api)
                              }
                            ></AgGridReact>
                          </div>
                          <div
                            className="status-bar-div"
                            style={{
                              height: "100%",
                              backgroundColor: "#bfd4f1",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ width: "100%" }}
                            >
                              <div className="d-flex align-items-center">
                                <img
                                  src="../../../Icons/step-backward.png"
                                  className="pagination-icon"
                                  alt=""
                                  onClick={() =>
                                    this.handlePaginationPage(
                                      this.state.currentPage === 1 ? "" : 1
                                    )
                                  }
                                />
                                <img
                                  src="../../../Icons/left-arrow.png"
                                  className="pagination-icon"
                                  alt=""
                                  onClick={() =>
                                    this.handlePaginationPage(
                                      this.state.currentPage === 1
                                        ? ""
                                        : this.state.currentPage - 1
                                    )
                                  }
                                />

                                <div className="pagination-search">
                                  Page: &nbsp;&nbsp;
                                </div>
                                <div className="pagination-search">
                                  <input
                                    type="text"
                                    value={
                                      this.state.dynamicColumnBody.length === 0
                                        ? 0
                                        : this.state.currentPage
                                    }
                                    className="unspsc-page-input"
                                    onChange={this.onPageChange}
                                  />
                                </div>
                                <div className="pagination-search">
                                  of{" "}
                                  {this.state.dynamicColumnBody.length === 0
                                    ? 0
                                    : this.state.totalPages}
                                </div>
                                <img
                                  src="../../../Icons/right-arrow.png"
                                  className="pagination-icon"
                                  alt=""
                                  onClick={() =>
                                    this.handlePaginationPage(
                                      this.state.currentPage ===
                                        this.state.totalPages
                                        ? ""
                                        : this.state.currentPage + 1
                                    )
                                  }
                                />
                                <img
                                  src="../../../Icons/step-forward.png"
                                  className="pagination-icon"
                                  alt=""
                                  onClick={() =>
                                    this.handlePaginationPage(
                                      this.state.currentPage ===
                                        this.state.totalPages
                                        ? ""
                                        : this.state.totalPages
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div
                              className="d-flex align-items-center justify-content-end"
                              style={{ width: "100%" }}
                            >
                              Total Allocated SKUs: &nbsp;
                              <b>{this.state.totalRowCount}</b>
                            </div>
                          </div>
                        </div>
                      </LoadingOverlay>
                    </div>
                  </div>
                </Col>
              </Row>
            </LoadingOverlay>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="mdlsv" onClick={this.handleMoveToQC}>
            Move to QC
          </Button>

          <Button variant="secondary" onClick={this.props.handleCloseQCModal}>
            Close
          </Button>
        </Modal.Footer>
        <Modal
          show={this.state.QCconfirmmodalshow}
          onHide={this.handleClose}
          className="mymninrmdl"
        >
          <Modal.Body>
            Are you sure, to move <br />
            the selected SKUs to QC?
          </Modal.Body>
          <Modal.Footer>
            <Button className="mdlsv" onClick={this.handleConfirmMoveToQC}>
              Yes
            </Button>
            <Button variant="secondary" onClick={this.handleClose}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </Modal>
    );
  }
}

export default MovetoQC;
