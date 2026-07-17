import React, { Component } from "react";
import productionAllocationTemplateService from "../../services/productionAllocationTemplate.service";
import accessControlService from "../../services/accessControl.service";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "ag-grid-react";
import { Col, Row } from "react-bootstrap";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import "./ProductionAllocation.scss";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import GOPEditScreen from "./GOPEditScreen";
import GOPPreviewScreen from "./GOPPreviewScreen";
import Button from "react-bootstrap/Button";
import MovetoQC from "./MovetoQC";
import Form from "react-bootstrap/Form";

toast.configure();

class ProductionUpdateList extends Component {
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
      productionUser: [],
      projectCodeExpanded: [],
      selectedProjectCode: state?.ProjectCode,
      batches: [],
      selectedBatchNo: state?.batchNo,
      disableViewExistingProductionAllocation: true,
      customerCode: state?.CustomerCode,
      projectCode: state?.ProjectCode,
      batchNo: state?.batchNo,
      scope: state?.scope,
      viewedbystatus: state?.viewedbystatus,
      allocationId: state?.AllocationId,
      srchOn: state?.SearchOn,
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
      status: "",
      isMovedToQC: "",
      selectedOption: "In Process",
      productionUpdateListSearchFields: "",
      selectedSearchField: " ",
      searchField: [],
      searchFieldInputs: [],
      sortFieldInputs: [],
      sortOn: "",
      sortDirection: "ASC",
      filterValue: "",
      query: "",
      application: "",
      dwg: "",
      pos: "",
      itemNo: "",
      serialNo: "",
      otherNumber: "",
      kksCode: "",
      greenItems: "",
      assemblyOrPart: "",
    };

    this.initialState = this.state;
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.fetchSearchFields();
    this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
    this.handleSortFieldChange = this.handleSortFieldChange.bind(this);
    this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
    this.handleSortDirectionChange = this.handleSortDirectionChange.bind(this);
    this.onChangeSearchField = this.onChangeSearchField.bind(this);
    this.onChangeFilterValue = this.onChangeFilterValue.bind(this);
    this.prodclearSearchField = this.prodclearSearchField.bind(this);
  }

  //#region Display navigate to previous page
  goBackNavigation = () => {
    sessionStorage.removeItem("prodUpdateData");
    this.props.history.push({
      pathname: "/Allocation",
    });
  };
  //#endregion

  componentWillUnmount() {
    const { history } = this.props;
    if (history.action === "POP") {
      sessionStorage.removeItem("prodUpdateData");
    }
  }
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
          const savedNounModifier =
            resp.data.Noun && resp.data.Modifier
              ? {
                  value: `${resp.data.Noun}_${resp.data.Modifier}`,
                  label: `${resp.data.Noun}_${resp.data.Modifier}`,
                }
              : {};

          let modifiers = [];
          let formattedString = [];

          if (resp.data.ItemAttributes) {
            resp.data.ItemAttributes.forEach((item) => {
              if (item.AttributeValue) {
                modifiers.push(item.AttributeValue);
                formattedString.push(
                  `${item.AttributeName}:${item.AttributeValue}`
                );
              }
            });
          }

          const attributeShort =
            resp.data.Noun && resp.data.Modifier
              ? `${resp.data.Noun},${resp.data.Modifier}: ${modifiers.join(
                  ", "
                )}`
              : "";
          const attributeLong =
            resp.data.Noun && resp.data.Modifier
              ? `${resp.data.Noun},${
                  resp.data.Modifier
                }: ${formattedString.join(", ")}`
              : "";

          viewScreen = {
            attributeShort,
            attributeLong,
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
              resp.data.MFRName1 ? resp.data.MFRName1 + "," : ""
            }${resp.data.MFRName2 ? resp.data.MFRName2 + "," : ""}${
              resp.data.MFRName3 || ""
            }`,
            mfrPNDescription: `${
              resp.data.MFRPN1 ? resp.data.MFRPN1 + "," : ""
            }${resp.data.MFRPN2 ? resp.data.MFRPN2 + "," : ""}${
              resp.data.MFRPN3 || ""
            }`,
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
              resp.data.VendorName1 ? resp.data.VendorName1 + "," : ""
            }${resp.data.VendorName2 ? resp.data.VendorName2 + "," : ""}${
              resp.data.VendorName3 || ""
            }`,
            vendorPNDescription: `${
              resp.data.VendorPN1 ? resp.data.VendorPN1 + "," : ""
            }${resp.data.VendorPN2 ? resp.data.VendorPN2 + "," : ""}${
              resp.data.VendorPN3 || ""
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
              resp.data.AdditionalInfoFromWeb || resp.data.AdditionalInfo
                ? resp.data.AdditionalInfoFromWeb +
                  "," +
                  resp.data.AdditionalInfo
                : ""
            }`,
            unspscCode: resp.data.UNSPSCCode,
            unspscCategory: resp.data.UNSPSCCategory,
            webRefURL1: resp.data.WebRefURL1,
            webRefURL2: resp.data.WebRefURL2,
            webRefURL3: resp.data.WebRefURL3,
            webRefPdfURL: resp.data.PDFURL,
            remarks: resp.data.Remarks,
            query: resp.data.Query,
            application: resp.data.Application,
            dwg: resp.data.DWG,
            pos: resp.data.POS,
            itemNo: resp.data.ItemNo,
            serialNo: resp.data.SerialNo,
            otherNo: resp.data.OtherNo,
            kksCode: resp.data.KKSCode,
            assemblyOrPart: resp.data.AssemblyOrPart,
            bom: resp.data.BOM,
            greenItems: resp.data.GreenItems,
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
    this.setState({ editModal: false });
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
    return null;
  };

  // #endregion apply row style

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

  //#region fetching Production Allocation page access
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
      this.fetchDynamicAGGridData(
        +e.target.value,
        this.state.pageSize,
        this.state.selectedOption
      );
    }
  };

  handlePaginationPage = (val) => {
    if (val) {
      this.setState((prev) => ({ ...prev, currentPage: val }));
      this.fetchDynamicAGGridData(
        val,
        this.state.pageSize,
        this.state.selectedOption,
        this.state.isMovedToQC
      );
    }
  };

  // #endregion

  //#region fetching customers from Web API
  fetchDynamicAGGridData = (currentPage, pageSize, status, isMovedToQC) => {
    const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
    this.setState({
      spinnerMessage: "Please wait while fetching Production Update List...",
      loading: true,
    });
    productionAllocationTemplateService
      .ProductionItemDetailsOfProductionUserFromAllocationWithStatus(
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

  handleOptionChange(option) {
    this.setState(
      {
        selectedOption: option,
        currentPage: 1,
      },
      () => {
        this.fetchDynamicAGGridData(
          this.state.currentPage,
          this.state.pageSize,
          this.state.selectedOption,
          this.state.isMovedToQC
        );
      }
    );
  }
  //#endregion

  //#region fetching read production update list search fields from Web API
  fetchSearchFields = () => {
    this.setState({
      spinnerMessage: "Please wait while loading...",
      loading: true,
    });

    productionAllocationTemplateService
      .ReadProductionUpdateListSearchFields()
      .then((response) => {
        this.setState({
          searchFieldInputs: response.data,
          sortFieldInputs: response.data, //Same search fields for sort dropdown too
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

  //#region fetching search production update list from Web API
  fetchSearchData = (currentPage, pageSize, searchText) => {
    const state = JSON.parse(sessionStorage.getItem("prodUpdateData")) || {};
    const { selectedSearchField, filterValue, batchNo, sortOn, sortDirection } =
      this.state;
    const searchOn = selectedSearchField;

    if (!selectedSearchField || !filterValue) {
      toast.error("Please select a search field and enter a search value.", {
        autoClose: false,
      });
      return;
    }
    this.setState({
      spinnerMessage: "Please wait while fetching Production Update List...",
      loading: true,
    });
    productionAllocationTemplateService
      .SearchProductionUpdateList(
        state.CustomerCode,
        state.ProjectCode,
        state.AllocationId,
        helper.getUser().trim(),
        batchNo,
        searchOn,
        searchText || filterValue,
        sortOn,
        sortDirection
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
          let totalPages = Math.ceil(totalRowCount / pageSize);

          this.setState({
            dynamicColumnBody: updatedData,
            totalPages: totalPages,
            totalRowCount: totalRowCount,
            modalLoading: false,
            loading: false,
            rowData: updatedData,
            selectedOption: "All",
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

  //#endregion

  //#region clear the filterValue and selectedSearchField data
  prodclearSearchField = () => {
    this.setState(
      {
        filterValue: "",
        selectedSearchField: "",
        sortOn: "",
        sortDirection: "ASC",
      },
      () => {
        this.fetchDynamicAGGridData(
          this.state.currentPage,
          this.state.pageSize,
          this.state.selectedOption
        );
      }
    );
  };
  //#endregion

  //#region search field
  handleSearchFieldChange(event) {
    this.setState({ selectedSearchField: event.target.value });
  }
  //#endregion

  //#region sort field
  handleSortFieldChange(event) {
    this.setState({ sortOn: event.target.value });
  }
  //#endregion

  //#region sort Direction
  handleSortDirectionChange(event) {
    this.setState({ sortDirection: event.target.value });
  }
  //#endregion

  //#region filter value
  handleFilterValueChange(event) {
    this.setState({ filterValue: event.target.value });
  }
  //#endregion

  //#region change search field
  onChangeSearchField(e) {
    this.setState({
      selectedSearchField: e.target.value,
    });

    if (e.target.value) {
      const formErrors = { ...this.state.formErrors, receivedFormatError: "" };
      this.setState({ formErrors });
    }
  }
  //#endregion

  //#region change filter value
  onChangeFilterValue = (e) => {
    const newFilterValue = e.target.value;
    this.setState({ filterValue: newFilterValue }, () => {
      this.fetchSearchData(
        this.state.currentPage,
        this.state.pageSize,
        newFilterValue
      );
    });
  };
  //#endregion

  //#region column edit
  isEditable = (params) => {
    return (
      (params.data.ProductionItemID === this.state.selectedStatus.rowId &&
        (this.state.selectedStatus.status === "Completed" ||
          this.state.selectedStatus.status === "Query")) ||
      params.data.Status === "Completed" ||
      params.data.Status === "Query"
    );
  };
  //#endregion

  // #region Open QC modal
  handleShowQCModal = () => {
    this.setState((prevstate) => ({ ...prevstate, QCModalshow: true }));
  };
  handleCloseQCModal = () => {
    this.setState((prevstate) => ({ ...prevstate, QCModalshow: false }));
  };
  //#endregion

  render() {
    const { selectedOption } = this.state;

    const user = helper.getUser();
    const { dynamicColumnBody } = this.state;

    const handleStatusValueChanged = (params) => {
      if (params.newValue === "In Process") {
        let selectStatus = {
          rowId: params.data.ProductionItemID,
          status: params.newValue,
        };
        this.setState((prevState) => ({
          ...prevState,
          selectedStatus: selectStatus,
          isStatusUpdating: true,
        }));
        updateStatus(params.data.ProductionItemID, "I", user);
        return;
      }
      let selectStatus = {
        rowId: params.data.ProductionItemID,
        status: params.newValue,
      };
      this.setState((prevState) => ({
        ...prevState,
        selectedStatus: selectStatus,
      }));
      toast.warning("Status will be saved after selecting level!");
    };

    const handleLevelValueChanged = (params) => {
      let level = "c";
      let status = "";
      if (this.state.selectedStatus.status === "Completed") {
        status = "C";
      } else if (this.state.selectedStatus.status === "Query") {
        status = "Q";
      }
      if (params.newValue === "Enriched") {
        level = "e";
      } else if (params.newValue === "Exception") {
        level = "x";
      }

      let selectedLevel = {
        rowId: params.data.ProductionItemID,
        level: params.newValue,
      };
      this.setState((prevState) => ({
        ...prevState,
        selectedLevel: selectedLevel,
        isStatusUpdating: true,
      }));

      updateStatus(params.data.ProductionItemID, status, user, level);
    };

    const updateStatus = (
      ProductionItemID,
      status,
      user,
      level,
      isMovedToQC
    ) => {
      productionAllocationTemplateService
        .changeProductionItemStatus(
          ProductionItemID,
          status,
          user,
          level,
          isMovedToQC
        )
        .then(() => {
          this.setState((prevState) => ({
            ...prevState,
            isStatusUpdating: false,
          }));
          toast.success("Production Item status updated succesfully...!");
          this.fetchDynamicAGGridData(
            this.state.currentPage,
            this.state.pageSize,
            this.state.selectedOption,
            this.state.isMovedToQC
          );
        })
        .catch((e) => {
          this.setState((prevState) => ({
            ...prevState,
            isStatusUpdating: false,
          }));
          toast.error(e.response.data.Message, { autoClose: false });
        });
    };

    const dynamicColumnHead = [
      {
        field: "ProductionAllocationID",
        headerName: "Production Allocation ID",
        minWidth: 160,
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
        width: 170,
      },

      {
        field: "Action",
        headerName: "Edit",
        minWidth: 100,
        cellClass: (params) => {
          const selectedOption = this.state.selectedOption;
          const isMovedToQC = params.data.IsMovedToQC;
          if (
            selectedOption === "Moved to QC" ||
            (isMovedToQC === "Yes" && selectedOption === "All")
          ) {
            return "dynamic-readOnly-field dynamic-readOnly-id edclmn";
          }
          return "dynamic-readOnly-id";
        },
        resizable: true,
        editable: (params) => {
          const selectedOption = this.state.selectedOption;
          const isMovedToQC = params.data.IsMovedToQC;
          if (
            selectedOption === "Moved to QC" ||
            (isMovedToQC === "Yes" && selectedOption === "All")
          ) {
            return false;
          }
          return true;
        },
        width: 100,
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

        onCellValueChanged: handleStatusValueChanged,
      },
      {
        field: "Level",
        headerName: "Level",
        minWidth: 100,
        sortable: true,
        width: 100,
        editable: this.isEditable,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Cleansed", "Enriched", "Exception"],
        },
        onCellValueChanged: handleLevelValueChanged,
      },
      {
        field: "IsMovedToQC",
        headerName: "Is Moved To QC?",
        minWidth: 150,
        sortable: true,
        width: 150,
      },
      {
        field: "ShortDescription",
        headerName: "Short Description",
        minWidth: 160,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
      },
      {
        field: "LongDescription",
        headerName: "Long Description",
        minWidth: 160,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
      },
      {
        field: "UOM",
        headerName: "UOM",
        minWidth: 100,
        resizable: true,
        sortable: true,
        width: 100,
      },
      {
        field: "NewShortDescription",
        headerName: "New Short Description",
        minWidth: 200,
        resizable: true,
        sortable: true,
        width: 200,
      },
      {
        field: "NewLongDescription",
        headerName: "New Long Description",
        minWidth: 200,
        resizable: true,
        sortable: true,
        width: 200,
      },
      {
        field: "MFRName",
        headerName: "MFR Name",
        minWidth: 160,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "MFRPN",
        headerName: "MFR PN",
        minWidth: 120,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "VendorName",
        headerName: "Vendor Name",
        minWidth: 160,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "VendorPN",
        headerName: "Vendor PN",
        minWidth: 120,
        cellClass: "dynamic-readOnly-field",
        resizable: true,
        sortable: true,
        width: 120,
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
        width: 120,
      },
      {
        field: "Modifier",
        headerName: "Modifier",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "MFRName1",
        headerName: "MFR Name 1",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "MFRPN1",
        headerName: "MFR PN 1",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "MFRName2",
        headerName: "MFR Name 2",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "MFRPN2",
        headerName: "MFR PN 2",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "MFRName3",
        headerName: "MFR Name 3",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "MFRPN3",
        headerName: "MFR PN 3",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "VendorName1",
        headerName: "Vendor Name 1",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "VendorPN1",
        headerName: "Vendor PN 1",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "VendorName2",
        headerName: "Vendor Name 2",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "VendorPN2",
        headerName: "Vendor PN 2",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "VendorName3",
        headerName: "Vendor Name 3",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "VendorPN3",
        headerName: "Vendor PN 3",
        minWidth: 120,
        resizable: true,
        sortable: true,
        width: 120,
      },
      {
        field: "AdditionalInfoFromWeb",
        headerName: "Additional Info From Web",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "AdditionalInfo",
        headerName: "Additional Info From Input",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "UNSPSCCode",
        headerName: "UNSPSC Code",
        minWidth: 140,
        resizable: false,
        sortable: true,
        width: 140,
      },
      {
        field: "UNSPSCCategory",
        headerName: "UNSPSC Category",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "WebRefURL1",
        headerName: "URL 1",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "WebRefURL2",
        headerName: "URL 2",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "WebRefURL3",
        headerName: "URL 3",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "PDFURL",
        headerName: "PDF URL",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "Remarks",
        headerName: "Remarks",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "Query",
        headerName: "Query",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },

      {
        field: "Application",
        headerName: "Application",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "DWG",
        headerName: "DWG",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "POS",
        headerName: "POS",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "ItemNo",
        headerName: "Item No.",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "SerialNo",
        headerName: "Serial No",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "OtherNo",
        headerName: "Other No.",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "KKSCode",
        headerName: "KKS Code",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "AssemblyOrPart",
        headerName: "Assembly/Part?",
        minWidth: 150,
        resizable: true,
        sortable: true,
        width: 150,
      },
      {
        field: "BOM",
        headerName: "BOM",
        minWidth: 160,
        resizable: true,
        sortable: true,
        width: 160,
      },
      {
        field: "GreenItems",
        headerName: "Green Items (Yes / Not Applicable)",
        minWidth: 200,
        resizable: true,
        sortable: true,
        width: 200,
      },
    ];

    const canAccessProductionDownloadOrUpload =
      this.state.canAccessProductionDownloadOrUpload;

    const setHeight = (value) => {
      return { height: `${value}%` };
    };

    return !canAccessProductionDownloadOrUpload ? (
      ""
    ) : (
      <div style={setHeight(93)} className="production-update-main">
        {this.state.editModal && (
          <GOPEditScreen
            showEditModal={this.state.editModal}
            hideEdiModal={this.hideEdiModal}
          />
        )}

        {this.state.previewModal && (
          <GOPPreviewScreen
            showPreview={this.state.previewModal}
            closePreviewModal={this.hidePreviewModal}
            stateValue={this.state.viewScreenData}
          />
        )}

        {this.state.QCModalshow && (
          <MovetoQC
            QcModalShow={this.state.QCModalshow}
            handleCloseQCModal={this.handleCloseQCModal}
            dataFetch={this.fetchDynamicAGGridData}
            selectedStatus={this.state.selectedOption}
          />
        )}

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
          <div className="">
            <div
              className="az-content-breadcrumb mg-l-45 mt-lg-4 prdupdlst"
              style={setHeight(5)}
            >
              <span>Project</span>
              <span>List</span>
            </div>
            <Row className="mg-l-30 mg-r-15 prdupdlst">
              <Col lg={12} style={{ maxWidth: "100%" }}>
                <div style={setHeight(6)} className="production-update-header">
                  <h4 style={{ marginBottom: "0", fontSize: "18px" }}>
                    <i
                      className="far fa-arrow-alt-circle-left pointer mb-1"
                      style={{ fontSize: "15px" }}
                      onClick={this.goBackNavigation}
                    ></i>
                    &nbsp;&nbsp; Production Update List
                  </h4>
                  {this.state.isStatusUpdating && (
                    <h6
                      style={{
                        marginBottom: "0",
                        fontSize: "13px",
                        color: "green",
                      }}
                    >
                      Please wait while updating the status...
                    </h6>
                  )}
                  <button
                    className="down-item-link mg-l-15"
                    onClick={this.downloadAllProductionItems}
                    disabled={!this.state.customerCode}
                  >
                    Download Item Details
                  </button>
                </div>
                <div style={setHeight(100)}>
                  <div className="production-details-row" style={setHeight(3)}>
                    <div className="gop-mfr-row">
                      <label
                        className="readOnlyHead form-label m-0"
                        htmlFor="custCode"
                      >
                        {" "}
                        Customer Code:{" "}
                      </label>
                      &nbsp;
                      <p id="CustomerCode" name="CustomerCode" className="m-0">
                        {this.state.customerCode}
                      </p>
                    </div>
                    &nbsp; &nbsp;
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
                    &nbsp; &nbsp;
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
                    &nbsp; &nbsp;
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
                    &nbsp; &nbsp;
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
                    &nbsp; &nbsp;
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
                        className="m-0"
                        title={this.state.scope}
                      >
                        {this.state.scope}
                      </p>
                    </div>
                    &nbsp; &nbsp;
                    <div className="gop-mfr-row myvewdta">
                      <label
                        className="readOnlyHead form-label vew ml-5 mt-0 mb-0"
                        htmlFor="custCode"
                      >
                        {" "}
                        View:{""}
                      </label>
                      &nbsp; &nbsp;
                      <p
                        id="Viewedbystatus"
                        name="Viewedbystatus"
                        className="m-0"
                        title={this.state.viewedbystatus}
                      >
                        {this.state.viewedbystatus}
                      </p>
                    </div>
                    &nbsp; &nbsp;
                    {["radio"].map((type) => (
                      <div
                        key={`inline-${type}`}
                        className=" gop-mfr-row prdlst"
                      >
                        <Form.Check
                          inline
                          label="In Process"
                          name="group1"
                          type={type}
                          id={`inline-${type}-1`}
                          checked={selectedOption === "In Process"}
                          onChange={() => this.handleOptionChange("In Process")}
                        />
                        <Form.Check
                          inline
                          label="Query"
                          name="group2"
                          type={type}
                          id={`inline-${type}-2`}
                          checked={selectedOption === "Query"}
                          onChange={() => this.handleOptionChange("Query")}
                        />
                        <Form.Check
                          inline
                          label="Completed"
                          name="group3"
                          type={type}
                          id={`inline-${type}-3`}
                          checked={selectedOption === "Completed"}
                          onChange={() => this.handleOptionChange("Completed")}
                        />
                        <Form.Check
                          inline
                          label="In QC"
                          name="group4"
                          type={type}
                          id={`inline-${type}-4`}
                          checked={selectedOption === "Moved to QC"}
                          onChange={() =>
                            this.handleOptionChange("Moved to QC")
                          }
                        />
                        <Form.Check
                          inline
                          label="All"
                          name="group5"
                          type={type}
                          id={`inline-${type}-5`}
                          checked={selectedOption === "All"}
                          onChange={() => this.handleOptionChange("All")}
                        />
                      </div>
                    ))}
                    <div className="qcbtn-cnt">
                      <Button
                        className="qcbtn"
                        onClick={this.handleShowQCModal}
                      >
                        Move to QC
                      </Button>
                    </div>
                  </div>

                  <div className="row row-sm  mg-r-0 mg-l-0 mg-t-10">
                    <div className="col-md-2" style={{ paddingLeft: "0" }}>
                      <select
                        className="form-control"
                        tabIndex="1"
                        id="productionUpdateListSearchFields"
                        name="productionUpdateListSearchFields"
                        value={this.state.selectedSearchField || ""}
                        onChange={this.handleSearchFieldChange}
                      >
                        <option value="">--Search on--</option>
                        {this.state.searchFieldInputs.map((searchField) => (
                          <option key={searchField}>{searchField}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4" style={{ paddingLeft: "0" }}>
                      <input
                        type="text"
                        className="form-control mg-l-5"
                        maxLength="20"
                        placeholder="Search..."
                        value={this.state.filterValue || ""}
                        onChange={this.handleFilterValueChange}
                      />
                    </div>
                    <div className="col-md-2" style={{ paddingLeft: "0" }}>
                      <select
                        className="form-control"
                        tabIndex="1"
                        id="productionUpdateListSortFields"
                        name="productionUpdateListSortFields"
                        value={this.state.sortOn || ""}
                        onChange={this.handleSortFieldChange}
                      >
                        <option value="">--Sort on--</option>
                        {this.state.sortFieldInputs.map((sortOn) => (
                          <option key={sortOn}>{sortOn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2" style={{ paddingLeft: "0" }}>
                      <select
                        className="form-control"
                        tabIndex="1"
                        id="productionUpdateListSortFields"
                        name="productionUpdateListSortFields"
                        value={this.state.sortDirection || ""}
                        onChange={this.handleSortDirectionChange}
                      >
                        <option value="">--Sort on--</option>
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                      </select>
                    </div>
                    <div className="col-md-2" style={{ paddingRight: "0" }}>
                      <div className="myprd-dta">
                        <Button
                          className="myprdsrchqcbtn mt-0"
                          onClick={this.fetchSearchData}
                        >
                          Search
                        </Button>
                        <span
                          className="btn btn-primary pd-b-5 myprdqcbtn mt-0 ml-2"
                          onClick={this.prodclearSearchField}
                        >
                          <i
                            className="fa fa-refresh mr-1"
                            title="Clear Filter"
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingTop: "10px", ...setHeight(100) }}>
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
                          ></AgGridReact>
                        </div>
                        <div
                          className="status-bar-div"
                          style={{ height: "100%", backgroundColor: "#bfd4f1" }}
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

                              <div className="pagination-search">Page:</div>
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
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default withRouter(ProductionUpdateList);
