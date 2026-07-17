import React, { useEffect, useState, useMemo } from "react";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import helpers from "../../helpers/helpers";
import { toast } from "react-toastify";
import "./screenEditingReport.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import GOPPreviewScreen from "../Allocation/GOPPreviewScreen";
import productionService from "../../services/production.service";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { MaterialReactTable } from "material-react-table";
//import { Box } from "@mui/material";
import { GlobalStyles } from "@mui/material"; //IconButton, Tooltip,
//import FileDownloadIcon from "@mui/icons-material/FileDownload";

function PendingforQC() {
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
    qccreateColumns: [],
    previewModal: false,
    viewScreenData: [],
    options: [],
    selected: [],
    qclist: [],
  };
  const [initStates, setInitStates] = useState(initialStates);

  useEffect(() => {
    fetchCustomers();
  }, []);

  //#region fetching customers from Web API
  const fetchCustomers = () => {
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Data...",
      loading: true,
    }));

    productionService
      .getqcCustomerCodes()
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
        toast.error(e.response?.data?.Message || "An error occurred", {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Get Selected Customer Code
  const onChangeCustomerCode = (e) => {
    const customerCode = e.target.value;

    setInitStates((prevState) => ({
      ...prevState,
      selectedCustomerCode: customerCode,
      customerCode,
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
      formErrors: {
        ...prevState.formErrors,
        customerCodeError: "",
        projectCodeError: "",
        batchNoError: "",
      },
    }));

    setQclist([]);

    if (customerCode) {
      fetchProjectCodesOfCustomer(customerCode);
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

    productionService
      .ReadOnGoingProjectCodesOfCustomer(customerCode)
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
        toast.error(e.response?.data?.Message || "An error occurred", {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Get Selected Project Code
  const onChangeProjectCode = (e) => {
    const projectCode = e.target.value;

    setInitStates((prevState) => ({
      ...prevState,
      selectedProjectCode: projectCode,
      projectCode,
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

    setQclist([]);

    if (projectCode) {
      fetchBatchNosOfProject(projectCode);
    }

    const formErrors = {
      ...initStates.formErrors,
      projectCodeError: "",
      batchNoError: "",
    };
    setInitStates((prevState) => ({ ...prevState, formErrors }));
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

    productionService
      .ReadOnGoingBatchesOfProject(initStates.selectedCustomerCode, projectCode)
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

  const [qclist, setQclist] = useState([]);

  // #region Read AllSKUs Pending Fo rQC From Selected Project Or Batch(searchData)
  const qcDetails = () => {
    if (!initStates.selectedCustomerCode) {
      toast.error("Please select customer code");
      return;
    }

    if (!initStates.selectedProjectCode) {
      toast.error("Please select project code");
      return;
    }
    if (initStates.batches.length > 0 && !initStates.selectedBatchNo) {
      toast.error("Please select batch number");
      return;
    }

    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading data...",
      loading: true,
    }));

    const searchData = {
      customerCode: initStates.selectedCustomerCode,
      projectCode: initStates.selectedProjectCode,
    };

    productionService
      .ReadAllSKUsPendingForQCFromSelectedProjectOrBatch(searchData)
      .then((response) => {
        const data = response.data;

        if (data.length > 0) {
          setQclist(data);
        } else {
          setQclist([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  const handleResetFilter = () => {
    setInitStates(initialStates);
    fetchCustomers();
    setQclist([]);
  };

  // #endregion

  // #region columns data
  const qccreateColumns = useMemo(
    () => [
      {
        accessorKey: "UniqueID",
        header: "Unique ID",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            position: "sticky",
            left: 0,
            zIndex: 999,
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            position: "sticky",
            left: 0,
            zIndex: 1,
          },
        },
      },
      {
        accessorKey: "Level",
        header: "Level",
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "ProductionUser",
        header: "Production User",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "ShortDescription",
        header: "Short Description",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },

      {
        accessorKey: "LongDescription",
        header: "Long Description",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "UOM",
        header: "UOM",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },

      {
        accessorKey: "NewShortDescription",
        header: "New Short Description",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "100%",
            minWidth: "100%",
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            width: "100%",
            minWidth: "100%",
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "NewLongDescription",
        header: "New Long Description",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "ProductionAllocationID",
        header: "Production Allocation ID",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRName",
        header: "MFR Name",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRPN",
        header: "MFR PN",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorName",
        header: "Vendor Name",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorPN",
        header: "Vendor PN",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "BISMT",
        header: "BISMT",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "Noun",
        header: "Noun",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "Modifier",
        header: "Modifier",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRName1",
        header: "MFR Name 1",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRPN1",
        header: "MFR PN 1",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRName2",
        header: "MFR Name 2",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRPN2",
        header: "MFR PN 2",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRName3",
        header: "MFR Name 3",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",

          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "MFRPN3",
        header: "MFR PN 3",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorName1",
        header: "Vendor Name 1",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorPN1",
        header: "Vendor PN 1",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorName2",
        header: "Vendor Name 2",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorPN2",
        header: "Vendor PN 2",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorName3",
        header: "Vendor Name 3",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "VendorPN3",
        header: "Vendor PN 3",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "AdditionalInfoFromWeb",
        header: "Additional Info From Web",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "AdditionalInfo",
        header: "Additional Info From Input",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "UNSPSCCode",
        header: "UNSPSC Code",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "UNSPSCCategory",
        header: "UNSPSC Category",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "WebRefURL1",
        header: "URL 1",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "50%",
            minWidth: "50%",
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            width: "50%",
            minWidth: "50%",
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "WebRefURL2",
        header: "URL 2",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "WebRefURL3",
        header: "URL 3",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "PDFURL",
        header: "PDF URL",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "Remarks",
        header: "Remarks",

        muiTableHeadCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            whiteSpace: "nowrap",
          },
        },
      },
    ],
    [],
  );

  // #endregion

  // #region to expoer csv file
  // const generateCsv = (columns) => (data) => {
  //   const csvRows = [];
  //   // Get headers from columns configuration
  //   const headers = columns.map((col) => col.header);
  //   csvRows.push(headers.join(","));

  //   // Generate rows
  //   for (const row of data) {
  //     const values = columns.map((col) => {
  //       const value = row[col.accessorKey] || "";
  //       const escaped = ("" + value).replace(/"/g, '""');
  //       return `"${escaped}"`;
  //     });
  //     csvRows.push(values.join(","));
  //   }

  //   return csvRows.join("\n");
  // };

  // const handleExport = () => {
  //   const csvString = generateCsv(qccreateColumns)(qclist);
  //   const blob = new Blob([csvString], { type: "text/csv" });
  //   const a = document.createElement("a");
  //   a.download = "PendingforQCData.csv";
  //   a.href = window.URL.createObjectURL(blob);
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  // #endregion

  // #region open modal

  const hidePreviewModal = () => {
    setInitStates((prevState) => ({ ...prevState, previewModal: false }));
  };
  // #endregion

  const globalStyles = (
    <GlobalStyles
      styles={{
        ".MuiTableRow-root": {
          backgroundColor: "#D5E1F5 !important",
        },
      }}
    />
  );

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
            <p style={{ color: "black", marginTop: "5px" }}>
              Please wait while fetching the data
            </p>
            <BarLoader
              css={helpers.getcss()}
              color={"#38D643"}
              width={"350px"}
              height={"10px"}
              speedMultiplier={0.3}
            />
          </div>
        }
      >
        <div
          style={{ border: "1px solid #cdd4e0" }}
          className="mg-l-50 mg-r-25"
        >
          <div className="row mg-r-15 mg-l-5 mg-t-10 pndgqc-cnt">
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="row">
                <div className="col-md-4">
                  <b>Customer Code</b> <span className="text-danger">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className="form-control"
                    tabIndex="1"
                    id="customerCode"
                    name="customerCode"
                    placeholder="--Select--"
                    value={initStates.selectedCustomerCode}
                    onChange={onChangeCustomerCode}
                  >
                    <option value="">--Select--</option>
                    {initStates.customers.map((customer) => (
                      <option
                        key={customer.CustomerID}
                        value={customer.CustomerCode}
                      >
                        {customer.CustomerCode}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {initStates.formErrors["customerCodeError"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="row">
                <div className="col-md-4">
                  <b>Project Code</b> <span className="text-danger">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className="form-control"
                    tabIndex="2"
                    id="projectCode"
                    name="projectCode"
                    placeholder="--Select--"
                    value={initStates.selectedProjectCode}
                    onChange={onChangeProjectCode}
                  >
                    <option value="">--Select--</option>
                    {initStates.projectCodes.map((projectCode) => (
                      <option
                        key={projectCode.ProjectCode}
                        value={projectCode.ProjectCode}
                      >
                        {projectCode.ProjectCode}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {initStates.formErrors["projectCodeError"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div
                className="row"
                style={{
                  display: initStates.batches.length === 0 ? "none" : "flex",
                }}
              >
                <div className="col-md-4">
                  <b>Batch No.</b> <span className="text-danger">*</span>
                </div>
                <div className="col-md-8">
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
                      <option key={batch.BatchNo} value={batch.BatchNo}>
                        {batch.BatchNo}
                      </option>
                    ))}
                  </select>
                  <div className="error-message">
                    {initStates.formErrors.batchNoError}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <button
                    className="btn btn-gray-700 btn-block"
                    onClick={qcDetails}
                  >
                    View
                  </button>
                </div>
                <div className="col-md-6 col-sm-12">
                  <button
                    className="btn btn-gray-700 btn-block"
                    tabIndex="28"
                    onClick={handleResetFilter}
                    id="Reset"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mg-l-50 mg-r-25 pd-t-10 duplicate-table">
          {globalStyles}
          <ToolkitProvider>
            {() => (
              <div className="mg-t-0">
                <div className="pdqc masters-material-table">
                  <MaterialReactTable
                    data={qclist}
                    columns={qccreateColumns}
                    enableColumnFilterModes={true}
                    enableColumnOrdering={false}
                    enableRowSelection={false}
                    enablePagination={false}
                    enableStickyHeader={true}
                    // renderTopToolbarCustomActions={() => (
                    //   <Box
                    //     sx={{
                    //       display: 'flex',
                    //       gap: '16px',
                    //       padding: '8px',
                    //       flexWrap: 'wrap',
                    //     }}
                    //   >
                    //     <Tooltip title="Download Csv">
                    //       <IconButton onClick={handleExport}>
                    //         <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                    //       </IconButton>
                    //     </Tooltip>
                    //   </Box>
                    // )}
                  />
                </div>
              </div>
            )}
          </ToolkitProvider>
        </div>
      </LoadingOverlay>
    </div>
  );
}

export default PendingforQC;
