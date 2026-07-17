import React, { useEffect, useRef, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import { MultiSelect } from "react-multi-select-component";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import productionAllocationService from "../../services/productionAllocation.service";
import confirmDuplicatesService from "../../services/confirmDuplicates.service";
import projectService from "../../services/project.service";
import { toast } from "react-toastify";
toast.configure();

export default function ConfirmDuplicatesFromCIF() {
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
    formErrors: {},
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
  const [selected, setSelected] = useState([]);
  const [duplicateSetRemarks, setDuplicateSetRemarks] = useState([]);
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api); // This makes gridApi available to your filter function
  };

  // Extract keys for dynamic columns
  const keys =
    initStates.dynamicColumnBody && initStates.dynamicColumnBody.length > 0
      ? Object.keys(initStates.dynamicColumnBody[0])
      : [];

  const dynamicColumnHead = [
    {
      headerName: "Is Duplicate",
      field: "selection",
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: "left",
      lockPosition: true,
      suppressMenu: true,
    },
    ...keys.map((key) => ({
      field: key,
      headerName: key,
      minWidth: 150,
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true,
      cellClass: "dynamic-readOnly-field",
      // Hide technical columns from view
      hide:
        key.toLowerCase() === "id" ||
        key.toLowerCase() === "isduplicate" ||
        key.toLowerCase() === "selectedcolumns" ||
        key.toLowerCase() === "duplicate percentage",
    })),
  ];

  // useEffect(() => {
  //   fetchCustomers();
  // }, []);

  // 2. Use useEffect to trigger the fetch when the code changes
  useEffect(() => {
    fetchCustomers();
    if (initStates.selectedProjectCode) {
      fetchBatchNosOfProject(initStates.selectedProjectCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStates.selectedProjectCode]); // This runs only when selectedProjectCode updates

  // Syncing "IsDuplicate" value to Grid Selection
  const onRowDataUpdated = (params) => {
    params.api.forEachNode((node) => {
      // If the data from API has IsDuplicate true, check the checkbox
      if (node.data && node.data.IsDuplicate === true) {
        node.setSelected(true);
      }
    });
  };

  const fetchCustomers = () => {
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Customers...",
      loading: true,
    }));
    productionAllocationService
      .getCustomerCodes()
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          customers: response.data,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevState) => ({ ...prevState, loading: false }));
        toast.error(e.response?.data?.Message || "Error fetching customers");
      });
  };

  const onChangeCustomerCode = (e) => {
    const customerCode = e.target.value;
    setInitStates((prevState) => ({
      ...prevState,
      selectedCustomerCode: customerCode,
      customerCode: customerCode,
      selectedProjectCode: "",
      projectCode: "",
      batches: [],
      options: [],
      dynamicColumnBody: [],
    }));
    fetchProjectCodesOfCustomer(customerCode);
    setSelected([]);
  };

  const fetchProjectCodesOfCustomer = (customerCode) => {
    if (!customerCode) return;
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Project Codes...",
      loading: true,
    }));
    productionAllocationService
      .getProjectCodesOfCustomer(customerCode)
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          projectCodes: response.data,
          loading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevState) => ({ ...prevState, loading: false }));
        toast.error("Error loading projects");
      });
  };

  const onChangeProjectCode = (e) => {
    const projectCode = e.target.value;
    setInitStates((prevState) => ({
      ...prevState,
      selectedProjectCode: projectCode,
      projectCode: projectCode,
      selectedBatchNo: "",
      batches: [],
      options: [],
      dynamicColumnBody: [],
    }));
    //fetchBatchNosOfProject(projectCode);
    setSelected([]);
  };

  const fetchBatchNosOfProject = (projectCode) => {
    if (!projectCode) return;
    setInitStates((prevState) => ({
      ...prevState,
      loading: true,
    }));

    productionAllocationService
      .getBatchesOfProject(initStates.selectedCustomerCode, projectCode)
      .then((response) => {
        if (response.data.length !== 0) {
          setInitStates((prevState) => ({
            ...prevState,
            batches: response.data,
          }));
        } else {
          fetchColumns(projectCode, [], "");
          findDuplicates();
        }
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      })
      .catch(() =>
        setInitStates((prevState) => ({ ...prevState, loading: false })),
      );
  };

  const onChangeBatchNo = (e) => {
    const batch = e.target.value;
    setInitStates((prevState) => ({
      ...prevState,
      selectedBatchNo: batch,
      dynamicColumnBody: [],
    }));
    fetchColumns(initStates.selectedProjectCode, initStates.batches, batch);
    findDuplicates();
    setSelected([]);
  };

  const fetchColumns = (projectCode, batches, selectedBatch) => {
    projectService
      .readCustomColumnsNameswithBatch(
        initStates.selectedCustomerCode,
        projectCode,
        selectedBatch,
      )
      .then((resp) => {
        const options = resp.data.map((col) => ({ value: col, label: col }));
        setInitStates((prev) => ({ ...prev, options }));
      })
      .catch((e) => toast.error("Error fetching column metadata"));
  };

  const findDuplicates = () => {
    setInitStates((prevState) => ({ ...prevState, loading: true }));

    if (!initStates.selectedCustomerCode) {
      toast.error("Please select Customer Code");
      setInitStates((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    if (!initStates.selectedProjectCode) {
      toast.error("Please select Project Code");
      setInitStates((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    confirmDuplicatesService
      .areDuplicateSKUsAlreadySaved(
        initStates.selectedCustomerCode,
        initStates.selectedProjectCode,
        initStates.selectedBatchNo,
      )
      .then((response) => {
        if (response.data.toLowerCase() !== "yes" && selected.length === 0) {
          //toast.error("Please select Columns to find duplicates on");
          setInitStates((prevState) => ({ ...prevState, loading: false }));
          return;
        }
      })
      .catch(() => {
        toast.error("Failed to check already duplicate confirmed SKU details");
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });

    const searchData = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo || "",
      ColumnNames: selected.map((attr) => ({ ColumnName: attr.value })),
    };

    confirmDuplicatesService
      .readDuplicateSKUs(searchData)
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        if (data && data.length > 0) {
          const duplicateSetRemarks = [
            ...new Set(
              data
                .map((item) => item.DuplicateRemarks)
                .filter(
                  (remark) =>
                    remark !== null && remark !== undefined && remark !== "",
                ),
            ),
          ];

          // 1. Get the raw column data from the first record
          const rawSelectedColumns = data[0]["SelectedColumns"];

          // 2. Format it for MultiSelect (assuming it's a comma-separated string)
          const formattedSelected = rawSelectedColumns
            .split(", ")
            .map((col) => ({
              value: col,
              label: col,
            }));

          setInitStates((prevState) => ({
            ...prevState,
            dynamicColumnBody: data,
            loading: false,
          }));

          // 3. Update the 'selected' state (since it's a separate state variable)
          setSelected(formattedSelected);
          setDuplicateSetRemarks(duplicateSetRemarks);
        } else {
          setInitStates((prevState) => ({
            ...prevState,
            dynamicColumnBody: [],
            loading: false,
          }));
          setDuplicateSetRemarks([]);
        }
      })
      .catch((err) => {
        console.error(err);
        //toast.error("Failed to fetch duplicates.");
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const onBtnExport = () => {
    gridRef.current.api.exportDataAsCsv({
      fileName: `Duplicates_${initStates.selectedCustomerCode}.csv`,
    });
  };

  const writeCIFDataToDBAndUpdateSelectedSKUsAsDuplicates = () => {
    if (!initStates.selectedCustomerCode || !initStates.selectedProjectCode) {
      toast.error("Please complete the selection filters.");
      return;
    }

    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.error("Please select the duplicate SKUs");
      return;
    }

    var data = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo,
      SelectedColumns: selected.map((col) => col.label).join(", "),
      CIFIDs: selectedRows.map((row) => ({
        ID: row.ID,
        IsDuplicate: true,
        DuplicateSetRemarks: row.DuplicateRemarks || "",
      })),
    };

    setInitStates((prev) => ({ ...prev, loading: true }));

    confirmDuplicatesService
      .writeCIFDataToDatabase(
        initStates.selectedCustomerCode,
        initStates.selectedProjectCode,
        initStates.selectedBatchNo,
      )
      .then(() => confirmDuplicatesService.updateSelectedSKUsAsDuplicates(data))
      .then(() => {
        toast.success("Selected SKUs updated successfully");
        setInitStates(initialStates);
        setSelected([]);
        fetchCustomers();
      })
      .catch((err) => {
        toast.error(err.response.data.Message, { autoClose: false });
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const filterDuplicateSetRows = (event) => {
    const selectedValue = event.target.value;

    if (!gridApi) return;

    // 1. Get the filter instance for the specific column
    // Replace 'remarksColumnField' with the actual 'field' name in your columnDefs
    const filterInstance = gridApi.getFilterInstance("DuplicateRemarks");

    if (selectedValue === "") {
      // If "--Select--" is chosen, clear the filter
      filterInstance.setModel(null);
    } else {
      // Apply an 'equals' filter for the selected text
      filterInstance.setModel({
        filterType: "text",
        type: "equals",
        filter: selectedValue,
      });
    }

    // 2. Tell the grid to refresh the rows based on the new filter model
    gridApi.onFilterChanged();
  };

  return (
    <div className="p-4">
      <LoadingOverlay
        active={initStates.loading}
        spinner={<BarLoader color={"#38D643"} width={"350px"} />}
      >
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h6 className="mb-0 text-uppercase font-weight-bold">
              Duplicate SKU(s) Confirmation
            </h6>
          </div>
          <div className="card-body">
            <div className="row align-items-center mb-3">
              <div className="col-md-4">
                <label className="font-weight-bold mb-1">Customer Code</label>
                <select
                  className="form-control"
                  value={initStates.customerCode}
                  onChange={onChangeCustomerCode}
                >
                  <option value="">--Select--</option>
                  {initStates.customers.map((c) => (
                    <option key={c.CustomerID} value={c.CustomerCode}>
                      {c.CustomerCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="font-weight-bold mb-1">Project Code</label>
                <select
                  className="form-control"
                  value={initStates.projectCode}
                  onChange={onChangeProjectCode}
                >
                  <option value="">--Select--</option>
                  {initStates.projectCodes.map((p) => (
                    <option key={p.ProjectCode} value={p.ProjectCode}>
                      {p.ProjectCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                {initStates.batches.length > 0 && (
                  <>
                    <label className="font-weight-bold mb-1">Batch No.</label>
                    <select
                      className="form-control"
                      value={initStates.selectedBatchNo}
                      onChange={onChangeBatchNo}
                    >
                      <option value="">--Select--</option>
                      {initStates.batches.map((b) => (
                        <option key={b.BatchNo} value={b.BatchNo}>
                          {b.BatchNo}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>

            <div className="row align-items-end mb-3">
              <div className="col-md-4">
                <label className="font-weight-bold mb-1">Select Columns</label>
                <MultiSelect
                  options={initStates.options}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                  isDisabled={initStates.options.length === 0}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-block shadow-sm"
                  onClick={findDuplicates}
                  disabled={selected.length === 0}
                >
                  Find Duplicates
                </button>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary btn-block"
                  onClick={() => {
                    setInitStates(initialStates);
                    setSelected([]);
                    fetchCustomers();
                  }}
                >
                  Reset
                </button>
              </div>
              <div className="col-md-4 text-right">
                <div className="p-2 border rounded bg-light d-inline-block">
                  <small className="text-muted mr-2">
                    Duplicate Percentage:
                  </small>
                  <span className="h6 mb-0 text-danger">
                    {initStates.dynamicColumnBody.length !== 0 &&
                    typeof initStates.dynamicColumnBody[0][
                      "Duplicate Percentage"
                    ] === "number" &&
                    !isNaN(
                      initStates.dynamicColumnBody[0]["Duplicate Percentage"],
                    )
                      ? `${parseFloat(
                          initStates.dynamicColumnBody[0][
                            "Duplicate Percentage"
                          ],
                        ).toFixed(2)}%`
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Duplicate Set Selection */}
            <hr />
            <div className="row align-items-center">
              <div className="col-md-2">
                <b>Selected Columns:</b>
              </div>
              <div className="col-md-4">
                <p className="mg-l-5">
                  {selected.map((column) => column.label).join(", ")}
                </p>
              </div>
              <div className="col-md-auto">
                <label className="mb-0 font-weight-bold">
                  Select Duplicate Set:
                </label>
              </div>
              <div className="col-md-3">
                <select
                  className="form-control form-control-sm"
                  onChange={filterDuplicateSetRows}
                >
                  <option value="">--Select--</option>
                  {duplicateSetRemarks.map((remark, index) => (
                    <option key={index} value={remark}>
                      {remark}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          {initStates.dynamicColumnBody.length > 0 && (
            <div className="card-header d-flex justify-content-between align-items-center py-2 bg-white">
              <span className="text-muted small">Available Records</span>
              <button
                className="btn btn-sm btn-success px-3"
                onClick={onBtnExport}
              >
                <i className="fa fa-download mr-1"></i> Download CSV
              </button>
            </div>
          )}

          <div className="ag-theme-alpine w-100" style={{ height: "450px" }}>
            <AgGridReact
              ref={gridRef}
              pagination={true}
              columnDefs={dynamicColumnHead}
              rowData={initStates.dynamicColumnBody}
              onGridReady={onGridReady}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              animateRows={true}
              onRowDataUpdated={onRowDataUpdated} // Binds the IsDuplicate boolean to UI selection
            />
          </div>

          {initStates.dynamicColumnBody.length > 0 && (
            <div className="card-footer bg-white py-3">
              <div className="row justify-content-center">
                <div className="col-md-4">
                  <button
                    className="btn btn-primary btn-block shadow-sm"
                    onClick={writeCIFDataToDBAndUpdateSelectedSKUsAsDuplicates}
                  >
                    Update Selected SKU(s)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </LoadingOverlay>
    </div>
  );
}
