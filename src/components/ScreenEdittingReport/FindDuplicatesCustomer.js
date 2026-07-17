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
import GOPPreviewScreen from "../Allocation/GOPPreviewScreen";
import projectService from "../../services/project.service";
// import e from 'cors';

function FindDuplicatesCustomer() {
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
    options: [],
    selected: [],
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

  const [data] = useState([]);
  const onChangeCustomerCode = (e) => {
    const customerCode = e.target.value.split("(")[0].trim();

    // Update the state with the new customer code and reset related fields
    setInitStates((prevState) => ({
      ...prevState,
      selectedCustomerCode: customerCode,
      customerCode: e.target.value,
      selectedProjectCode: "",
      selected: [],
      batches: [],
      options: [],
      formErrors: {
        ...prevState.formErrors,
        customerCodeError: "",
        projectCodeError: "",
        batchNoError: "",
      },
    }));

    // Fetch project codes for the selected customer
    fetchProjectCodesOfCustomer(customerCode);

    const dynamicColumnBody = data.map((item) => ({}));

    setInitStates((prevState) => ({
      ...prevState,
      dynamicColumnBody,
    }));

    setSelected([]);
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

  const onChangeProjectCode = (e) => {
    let projectCode = e.target.value.split("(")[0].trim();

    setInitStates((prevState) => ({
      ...prevState,
      selectedProjectCode: projectCode,
      projectCode: e.target.value,
      selectedBatchNo: "",
      batches: [],
      options: [],
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

    const dynamicColumnBody = data.map((item) => ({
      // Assuming you have specific fields to map here
    }));

    setInitStates((prevState) => ({
      ...prevState,
      dynamicColumnBody,
    }));

    setSelected([]);
  };

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
        } else {
          fetchColumns(projectCode, [], "");
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

    return new Promise((resolve, reject) => {
      // Simulated async fetch
      setTimeout(() => {
        resolve(["Batch1", "Batch2", "Batch3"]); // Example response
      }, 1000); // Simulated delay
    });
  };

  const onChangeBatchNo = (e) => {
    // Extract the batch number from the input
    let batch = e.target.value.split("(")[0].trim();

    // Update the initial states with the new batch number and reset other fields
    setInitStates((prevState) => ({
      ...prevState,
      selectedBatchNo: batch,
      BatchNo: e.target.value,
      inputCount: "",
      receivedOn: "",
      deliveredOn: "",
      scope: "",
      projectStatus: [],
      options: [],
    }));
    // alert(initStates.selectedProjectCode)

    fetchColumns(initStates.selectedProjectCode, initStates.batches, batch);

    const dynamicColumnBody = data.map((item) => ({
      // Assuming you have specific fields to map here
    }));

    setInitStates((prevState) => ({
      ...prevState,
      // options,
      dynamicColumnBody,
    }));

    setSelected([]);

    // Clear the selected state
    setSelected([]);

    // Fetch the batch numbers of the project
  };

  //#endregion
  const [selected, setSelected] = useState([]);

  const findDuplicates = () => {
    if (!initStates.selectedCustomerCode || !initStates.selectedProjectCode) {
      toast.error("Please select customer code and project code");
      return;
    }
    if (selected.length === 0) {
      toast.error("Select at least one column");
      return;
    }
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading data...",
      loading: true,
    }));
    const selectAttributes = selected.map((attributes) => ({
      ColumnName: attributes.value,
    }));
    const searchData = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo || "",
      ColumnNames: selectAttributes,
    };
    productionService
      .findCustomerDuplicates(searchData)
      .then((resp) => {
        console.log(resp.data);
        setInitStates((prevState) => ({
          ...prevState,
          dynamicColumnBody: resp.data,
          loading: false,
        }));
      })
      .catch((err) => {
        console.error("Error fetching duplicates:", err);
        toast.error("Failed to fetch duplicates. Please try again later.");
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }));
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
  // #region table column
  let keys = [];
  if (initStates.dynamicColumnBody.length !== 0) {
    keys = Object.keys(initStates.dynamicColumnBody[0]);
  }
  const dynamicColumnHead = keys.map((key) => ({
    field: key,
    headerName: key,
    minWidth: 120,
    cellClass: "dynamic-readOnly-field",
  }));
  // #endregion

  // #region open modal
  const hidePreviewModal = () => {
    setInitStates((prevState) => ({ ...prevState, previewModal: false }));
  };
  // #endregion

  const fetchColumns = (projectCode, batches, selectedBatch) => {
    console.log(projectCode, batches.length, selectedBatch, "");
    if (
      batches.length === 0 &&
      (!initStates.selectedCustomerCode || !projectCode)
    ) {
      toast.error("Please select project code and customer code");
      return;
    }

    if (batches.length !== 0 && !selectedBatch) {
      toast.error("Please select batch number");
      return;
    }
    projectService
      .readCustomColumnsNameswithBatch(
        initStates.selectedCustomerCode,
        projectCode,
        selectedBatch,
      )
      .then((resp) => {
        console.log(resp, "resp");
        let options = resp.data.map((data) => ({
          value: data,
          label: data,
        }));
        setInitStates((prev) => ({ ...prev, options: options }));
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error fetching data");
      });
  };

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
              Please wait while fetching the result
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
          <div className="row row-sm  mg-r-15 mg-l-5 mg-t-10">
            <div className="col-md mg-t-10 mg-lg-t-0">
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
                  <div className="error-message"></div>
                </div>
              </div>
            </div>
            <div className="col-md mg-t-10 mg-lg-t-0">
              {initStates.batches.length > 0 && (
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
                        <option key={batch.BatchNo} value={batch.BatchNo}>
                          {batch.BatchNo}
                        </option>
                      ))}
                    </select>
                    <div className="error-message">
                      {initStates.formErrors["batchNoError"]}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row row-sm mg-r-15 mg-l-5 ">
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-6 mg-lg-t-10">
                  <b>Select Columns </b>
                </div>
                <div className="col-md-6 multiselect_drop">
                  <MultiSelect
                    options={initStates.options}
                    value={selected}
                    onChange={setSelected}
                    isDisabled={true}
                    labelledBy="Select"
                  />
                </div>
              </div>
            </div>
            <div className="col-md mg-t-10 mg-lg-t-0">
              <div className="row">
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

                <div className="col-md-4 mg-t-10 mg-lg-t-10">
                  <b>
                    Duplicate Percentage:{" "}
                    {initStates.dynamicColumnBody.length !== 0 &&
                    typeof initStates.dynamicColumnBody[0][
                      "Duplicate Percentage"
                    ] === "number" &&
                    !isNaN(
                      initStates.dynamicColumnBody[0]["Duplicate Percentage"],
                    )
                      ? `${parseFloat(initStates.dynamicColumnBody[0]["Duplicate Percentage"]).toFixed(2)}%`
                      : ""}
                  </b>
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
              <p className="mg-l-5">
                {selected.map((column) => column.label).join(", ")}
              </p>
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
                    <button
                      style={{
                        backgroundColor: "#5b47fb",
                        color: "#fff",
                        border: "1px solid #5b47fb",
                      }}
                      onClick={onBtnExport}
                    >
                      Download CSV export file
                    </button>
                  </div>
                </div>
              )}
            <div className="ag-theme-alpine production-theme-alpine">
              <AgGridReact
                ref={gridRef}
                pagination={initStates.dynamicColumnBody.length !== 0}
                columnDefs={dynamicColumnHead}
                rowData={initStates.dynamicColumnBody}
                enterNavigatesVertically={true}
                suppressExcelExport={true}
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
export default FindDuplicatesCustomer;
