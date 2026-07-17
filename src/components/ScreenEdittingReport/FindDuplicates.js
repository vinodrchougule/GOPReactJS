import React, { useEffect, useRef, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import helpers from "../../helpers/helpers";
import customerService from "../../services/customer.service";
import { toast } from "react-toastify";
import projectStatusService from "../../services/projectStatus.service";
import { MultiSelect } from "react-multi-select-component";
import "./screenEditingReport.scss";
import productionService from "../../services/production.service";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import productionAllocationTemplateService from "../../services/productionAllocationTemplate.service";
import GOPPreviewScreen from "../Allocation/GOPPreviewScreen";

function FindDuplicates() {
  const initialStates = {
    customers: [],
    selectedCustomerCode: "",
    customerCode: "",
    projectCodes: [],
    selectedProjectCode: "",
    projectCode: "",
    batches: [],
    selectedBatchNo: "",
    inputCount: "",
    receivedOn: "",
    deliveredOn: "",
    scope: "",
    projectStatus: [],
    formErrors: "",
    loading: false,
    spinnerMessage: "",
    modalLoading: false,
    showProjectStatusChartModal: false,
    projectStatusChart: [],
    viewChart: false,
    activities: [],
    productionCompletedPercentages: [],
    QCCompletedPercentages: [],
    index: 20,
    position: 0,
    columns: [],
    selectedColumn: "",
    selectedSort: "",
    isToShowSortingFields: false,
    isToShowFilteringField: true,
    filteredArray: [],
    filterValue: "",
    dynamicColumnBody: [],
    previewModal: false,
    viewScreenData: [],
  };

  const [initStates, setInitStates] = useState(initialStates);

  //#region page load
  useEffect(() => {
    fetchCustomers();
  }, []);
  // #end region

  //#region fetching customers from Web API
  const fetchCustomers = () => {
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Customers...",
      loading: true,
    }));

    customerService
      .getAllCustomers(helpers.getUser())
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          customers: response.data,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Get Selected Customer Code
  const onChangeCustomerCode = (e) => {
    let customerCode = e.target.value.split("(");
    customerCode = customerCode[0].trim();

    setInitStates((prevState) => ({
      ...prevState,
      selectedCustomerCode: customerCode,
      customerCode: e.target.value,
    }));

    fetchProjectCodesOfCustomer(customerCode);

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...initStates.formErrors,
        customerCodeError: "",
        projectCodeError: "",
        batchNoError: "",
      };
      setInitStates((prevState) => ({ ...prevState, formErrors: formErrors }));
    }
  };
  //#endregion

  //#region Fetch Project Codes of Customer
  const fetchProjectCodesOfCustomer = (customerCode) => {
    if (!customerCode) {
      setInitStates((prevState) => ({
        ...prevState,
        projectCodes: [],
        selectedProjectCode: "",
      }));
      return;
    }

    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Project Codes...",
      loading: true,
    }));

    projectStatusService
      .readProjectCodesOfCustomer(customerCode)
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          projectCodes: response.data,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Get Selected Project Code
  const onChangeProjectCode = (e) => {
    let projectCode = e.target.value.split("(");
    projectCode = projectCode[0].trim();

    setInitStates((prevState) => ({
      ...prevState,

      selectedProjectCode: projectCode,
      projectCode: e.target.value,
      selectedBatchNo: "",
      batches: [],
      inputCount: "",
      receivedOn: "",
      deliveredOn: "",
      scope: "",
      projectStatus: [],
      viewChart: false,
      isToShowFilteringField: false,
      isToShowSortingFields: false,
    }));
    fetchBatchNosOfProject(projectCode);

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...initStates.formErrors,
        projectCodeError: "",
        batchNoError: "",
      };
      setInitStates((prevState) => ({ ...prevState, formErrors: formErrors }));
    }
  };
  //#endregion

  //#region Fetch Batch Nos of Project
  const fetchBatchNosOfProject = (projectCode) => {
    if (!projectCode) {
      setInitStates((prevState) => ({
        ...prevState,
        batches: [],
        selectedBatchNo: "",
      }));
      return;
    }

    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Batch Nos...",
      loading: true,
    }));

    projectStatusService
      .ReadBatchesOfProject(initStates.selectedCustomerCode, projectCode)
      .then((response) => {
        if (response.data.length !== 0) {
          setInitStates((prevState) => ({
            ...prevState,
            batches: response.data,
          }));
        }
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }));
        // toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Get Selected Batch No
  const onChangeBatchNo = (e) => {
    setInitStates((prevState) => ({
      ...prevState,
      selectedBatchNo: e.target.value,
      inputCount: "",
      receivedOn: "",
      deliveredOn: "",
      scope: "",
      projectStatus: [],
    }));

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...initStates.formErrors, batchNoError: "" };
      setInitStates((prevState) => ({
        ...prevState,
        formErrors: formErrors,
      }));
    }
  };
  //#endregion

  const [selected, setSelected] = useState([]);

  const options = [
    { label: "ShortDescription", value: "ShortDescription" },
    { label: "LongDescription", value: "LongDescription" },
    { label: "ProductionUser", value: "ProductionUser" },
    { label: "UOM", value: "UOM" },
    { label: "MFRName", value: "MFRName" },
    { label: "MFRPN", value: "MFRPN" },
    { label: "VendorName", value: "VendorName" },
    { label: "VendorPN", value: "VendorPN" },
    { label: "NewShortDescription", value: "NewShortDescription" },
    { label: "NewLongDescription", value: "NewLongDescription" },
    { label: "Noun", value: "Noun" },
    { label: "Modifier", value: "Modifier" },
    { label: "MFRName1", value: "MFRName1" },
    { label: "MFRName2", value: "MFRName2" },
    { label: "MFRName3", value: "MFRName3" },
    { label: "MFRPN1", value: "MFRPN1" },
    { label: "MFRPN2", value: "MFRPN2" },
    { label: "MFRPN3", value: "MFRPN3" },
    { label: "VendorName1", value: "VendorName1" },
    { label: "VendorName2", value: "VendorName2" },
    { label: "VendorName3", value: "VendorName3" },
    { label: "VendorPN1", value: "VendorPN1" },
    { label: "VendorPN2", value: "VendorPN2" },
    { label: "VendorPN3", value: "VendorPN3" },
    { label: "AdditionalInfo", value: "AdditionalInfo" },
    { label: "AdditionalInfoFromWeb", value: "AdditionalInfoFromWeb" },
    { label: "UNSPSCCode", value: "UNSPSCCode" },
    { label: "UNSPSCCategory", value: "UNSPSCCategory" },
    { label: "WebRefURL1", value: "WebRefURL1" },
    { label: "WebRefURL2", value: "WebRefURL2" },
    { label: "WebRefURL3", value: "WebRefURL3" },
    { label: "PDFURL", value: "PDFURL" },
    { label: "Remarks", value: "Remarks" },
  ];

  // #region find duplicate function
  const findDuplicates = () => {
    if (!initStates.selectedCustomerCode || !initStates.selectedProjectCode) {
      toast.error("Please  select project code and customer code");
      return;
    }

    if (selected.length === 0) {
      toast.error("Selecet atleast one column");
      return;
    }

    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading data...",
      loading: true,
    }));

    var selectAttributes = selected.map((attributes) => {
      return { ColumnName: attributes.value };
    });

    let searchData = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo ? initStates.selectedBatchNo : "",
      ColumnNames: selectAttributes,
    };

    productionService
      .findDuplicates(searchData)
      .then((resp) => {
        setInitStates((prevState) => ({
          ...prevState,
          dynamicColumnBody: resp.data,
          loading: false,
        }));
      })
      .catch((err) => {
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };
  // #endregion

  // #region reset button
  const handleResetFilter = () => {
    setInitStates(initialStates);
    setSelected([]);
    fetchCustomers();
  };
  // #endregion

  // #region to expoer csv file

  const gridRef = useRef();
  const onBtnExport = () => {
    gridRef.current.api.exportDataAsCsv({
      fileName: `Duplicate_SKUs_${initStates.selectedCustomerCode}_${initStates.selectedProjectCode}.csv`,
    });
  };
  //   #endregion

  // #region to onclell clicked
  const onCellClicked = (e) => {
    if (e.colDef.field === "UniqueID") {
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
                  `${item.AttributeName}:${item.AttributeValue}`,
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
            customerCode: initStates.selectedCustomerCode,
            projectCode: initStates.selectedProjectCode,
            batchNo: initStates.selectedBatchNo,
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

          setInitStates((prevState) => ({
            ...prevState,
            previewModal: true,
            viewScreenData: viewScreen,
          }));
        })
        .catch((error) => {
          setInitStates((prevState) => ({
            ...prevState,
            loading: false,
          }));
          console.log(error);
        });
    }
  };
  //   #ebdregion

  // #region table column
  const dynamicColumnHead = [
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
      minWidth: 120,
      cellClass: "dynamic-readOnly-field dynamic-readOnly-id",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      field: "Status",
      headerName: "Status",
      minWidth: 100,
      sortable: true,
      filter: "agTextColumnFilter",
      width: 100,
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
      minWidth: 160,
      cellClass: "dynamic-readOnly-field",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "LongDescription",
      headerName: "Long Description",
      minWidth: 160,
      cellClass: "dynamic-readOnly-field",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "UOM",
      headerName: "UOM",
      minWidth: 100,
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: 100,
    },
    {
      field: "NewShortDescription",
      headerName: "New Short Description",
      minWidth: 200,
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      field: "NewLongDescription",
      headerName: "New Long Description",
      minWidth: 200,
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: 200,
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
    },
    {
      field: "CustomColumnName1Value",
      headerName: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName1
      }`,
      minWidth: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName1
          ? "120"
          : "1"
      }`,
      cellClass: "dynamic-readOnly-field",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName1
          ? "200"
          : "1"
      }`,
    },
    {
      field: "CustomColumnName2Value",
      headerName: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName2
      }`,
      minWidth: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName2
          ? "120"
          : "1"
      }`,
      cellClass: "dynamic-readOnly-field",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName2
          ? "200"
          : "1"
      }`,
    },
    {
      field: "CustomColumnName3Value",
      headerName: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName3
      }`,
      minWidth: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName3
          ? "120"
          : "1"
      }`,
      cellClass: "dynamic-readOnly-field",
      resizable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      width: `${
        initStates.dynamicColumnBody.length !== 0 &&
        initStates.dynamicColumnBody[0].CustomColumnName3
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
  // #endregion

  // #region open modal

  const hidePreviewModal = () => {
    setInitStates((prevState) => ({ ...prevState, previewModal: false }));
  };
  // #endregion

  return (
    <div>
      {initStates.previewModal && (
        <GOPPreviewScreen
          showPreview={initStates.previewModal}
          closePreviewModal={hidePreviewModal}
          stateValue={initStates.viewScreenData}
        />
      )}
      <LoadingOverlay
        active={initStates.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader
              css={helpers.getcss()}
              color={"#38D643"}
              width={"350px"}
              height={"10px"}
              speedMultiplier={0.3}
            />
            <p style={{ color: "black", marginTop: "5px" }}>
              {/* {initStates.spinnerMessage} */}
            </p>
          </div>
        }
      >
        <div
          style={{ border: "1px solid #cdd4e0" }}
          className="mg-l-50 mg-r-25"
        >
          <div className="row row-sm  mg-r-15 mg-l-5 mg-t-5">
            <div className="col-md">
              <div className="row">
                <div className="col-md-6">
                  <b>Customer Code</b>{" "}
                  <span className="text-danger asterisk-size">*</span>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control"
                    tabIndex="1"
                    id="customerCode"
                    name="customerCode"
                    placeholder="--Select--"
                    value={initStates.customerCode}
                    onChange={onChangeCustomerCode}
                  >
                    <option value="">--Select--</option>
                    {initStates.customers.map((customer) => (
                      <option key={customer.CustomerID}>
                        {customer.CustomerCode} ({customer.NoOfProjects})
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {initStates.formErrors["customerCodeError"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md mg-t-10 mg-lg-t-0">
              <div className="row">
                <div className="col-md-5">
                  <b>Project Code</b>{" "}
                  <span className="text-danger asterisk-size">*</span>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control"
                    tabIndex="2"
                    id="projectCode"
                    name="projectCode"
                    placeholder="--Select--"
                    value={initStates.projectCode}
                    onChange={onChangeProjectCode}
                  >
                    <option value="">--Select--</option>
                    {initStates.projectCodes.map((projectCode) => (
                      <option key={projectCode.ProjectCode}>
                        {projectCode.ProjectCode} (
                        {projectCode.ProjectInputCount})
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {/* {initStates.formErrors["projectCodeError"]} */}
                  </div>
                </div>
              </div>
            </div>
            {/* {initStates.batches.length > 0 && ( */}
            <div className="col-md mg-t-10 mg-lg-t-0">
              <div className="row">
                <div className="col-md-5">
                  <b>Batch No.</b>{" "}
                  <span className="text-danger asterisk-size">*</span>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control"
                    tabIndex="3"
                    id="batchNo"
                    name="batchNo"
                    placeholder="--Select--"
                    value={initStates.selectedBatchNo}
                    onChange={onChangeBatchNo}
                  >
                    <option value="">--Select--</option>
                    {initStates.batches.map((batch) => (
                      <option key={batch.BatchNo}>{batch.BatchNo}</option>
                    ))}
                  </select>
                  <div className="error-message">
                    {initStates.formErrors["batchNoError"]}
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
          <br />
          <div className="row row-sm mg-r-15 mg-l-5 pd-b-5">
            <div className="col-md-4">
              <div className="row row-sm">
                <div className="col-md-6">
                  <b>Columns </b>
                </div>
                <div className="col-md-6">
                  <MultiSelect
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                  />
                </div>
              </div>
            </div>
            <div className="col-md mg-t-10 mg-lg-t-0">
              <div className="row row-sm">
                <div className="col-md-4 mg-t-10 mg-lg-t-0">
                  <span
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={findDuplicates}
                  >
                    Find Duplicate SKUs
                  </span>
                </div>
                <div className="col-md-4  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="28"
                    onClick={handleResetFilter}
                    id="Reset"
                  >
                    Reset
                  </span>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm mg-r-15 mg-l-5 pd-b-5">
            <div className="col-md-2">
              <b>Selected Columns:</b>
            </div>
            <div className="col-md">
              <p>{selected.map((column) => column.label).join(", ")}</p>
            </div>
          </div>
        </div>
        <div className="mg-l-50 mg-r-25 pd-t-10 duplicate-table">
          <div style={{ height: "100%" }}>
            {initStates.dynamicColumnBody.length !== 0 &&
              helpers.getUser().toLowerCase() === "vic" && (
                <div
                  className="status-bar-div"
                  style={{ height: "100%", backgroundColor: "#bfd4f1" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-end"
                    style={{ width: "100%" }}
                  >
                    <button onClick={onBtnExport}>
                      Download CSV export file
                    </button>
                  </div>
                </div>
              )}
            <div className="ag-theme-alpine production-theme-alpine">
              <AgGridReact
                ref={gridRef}
                pagination={initStates.dynamicColumnBody.length !== 0 && true}
                columnDefs={dynamicColumnHead}
                rowData={initStates.dynamicColumnBody}
                enterNavigatesVertically={true}
                suppressExcelExport={true}
                onCellClicked={onCellClicked}
                paginationPageSize={50}
                paginationAutoPageSize={true}
                paginationPageSizeSelector={[10, 20, 50, 100]}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
}

export default FindDuplicates;
