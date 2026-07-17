import React, { useEffect, useState, useRef, useMemo } from "react";
import { Nav, Tab } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import helper from "../../helpers/helpers";
import productionAllocationService from "../../services/productionAllocation.service";
import projectService from "../../services/project.service";
import productionService from "../../services/production.service";
import onScreenProductionAllocationService from "../../services/onScreenProductionAllocation.service";
import { toast } from "react-toastify";
toast.configure();

// Move static columns OUTSIDE to prevent re-renders
const allocatedSKUsColumnDefs = [
  {
    headerName: "",
    minWidth: 50,
    maxWidth: 50,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    pinned: "left",
    suppressMenu: true,
    lockPosition: true,
  },
  {
    field: "ID",
    headerName: "ID",
    minWidth: 120,
    cellClass: "dynamic-readOnly-field",
    hide: true,
    lockPosition: true,
    pinned: "left",
  },
  {
    field: "ProductionUser",
    headerName: "Production User",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
    pinned: "left",
  },
  {
    field: "ShortDescription",
    headerName: "Short Description",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "LongDescription",
    headerName: "Long Description",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "UOM",
    headerName: "UOM",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "MFRName",
    headerName: "MFR Name",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "MFRPN",
    headerName: "MFR P/N.",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "VendorName",
    headerName: "Vendor Name",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "VendorPN",
    headerName: "Vendor P/N.",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "Status",
    headerName: "Status",
    minWidth: 170,
    cellClass: "dynamic-readOnly-field",
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
  },
];

export default function AllocateSKUsOnScreenForProduction() {
  const initialStates = {
    customers: [],
    customerCode: "",
    projectCodes: [],
    selectedProjectCode: "",
    projectCode: "",
    batches: [],
    selectedBatchNo: "",
    CIFcolumns: [],
    selectedColumn: "",
    searchText: "",
    activeTab: 1,
    dynamicColumnBody: [],
    options: [],
    loading: false,
    spinnerMessage: "",
    defaultActiveKey: "",
    allocateToUsers: [],
    selectedAllocateToUser: "",
    selectedAllocateToUserName: "",
    allocatedSKUsColumnBody: [],
    skuAllocatedUserNames: [],
    reAllocationSKUsColumnBody: [],
    reAllocateFromUser: "",
    reAllocateFromUserName: "",
    reAllocateToUser: "",
    reAllocateToUserName: "",
  };

  const [initStates, setInitStates] = useState(initialStates);
  const gridRef = useRef();
  const gridRefA = useRef();
  const gridRefB = useRef();

  // Use Memo to prevent dynamic column headers from refreshing unless data keys change
  const dynamicColumnHead = useMemo(() => {
    const keys =
      initStates.dynamicColumnBody.length > 0
        ? Object.keys(initStates.dynamicColumnBody[0])
        : [];

    return [
      {
        headerName: "Select",
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
        hide: key.toLowerCase() === "id",
      })),
    ];
  }, [initStates.dynamicColumnBody]);

  useEffect(() => {
    fetchCustomers();
    fetchAllocateToUserNames();
  }, []);

  const toggle = (tab) => {
    if (initStates.activeTab !== tab) {
      setInitStates((prevState) => ({ ...prevState, activeTab: tab }));
    }
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
    fetchBatchNosOfProject(projectCode);
  };

  const fetchBatchNosOfProject = (projectCode) => {
    if (!projectCode) return;
    setInitStates((prevState) => ({ ...prevState, loading: true }));

    productionAllocationService
      .getBatchesOfProject(initStates.selectedCustomerCode, projectCode)
      .then((response) => {
        if (response.data.length !== 0) {
          setInitStates((prevState) => ({
            ...prevState,
            batches: response.data,
            loading: false,
          }));
        } else {
          fetchColumnsFromCIF(initStates.selectedCustomerCode, projectCode, "");
          setInitStates((prevState) => ({
            ...prevState,
            selectedBatchNo: "",
            batches: [],
            loading: false,
          }));
        }
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
    fetchColumnsFromCIF(
      initStates.selectedCustomerCode,
      initStates.selectedProjectCode,
      batch,
    );
  };

  const fetchColumnsFromCIF = (customerCode, projectCode, batchNo) => {
    if (!customerCode || !projectCode) return;
    setInitStates((prevState) => ({ ...prevState, loading: true }));

    if (initStates.batches.length !== 0 && !batchNo) return;

    projectService
      .readCustomColumnsNameswithBatch(customerCode, projectCode, batchNo)
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          CIFcolumns: response.data || [],
          loading: false,
        }));
      })
      .catch((error) => {
        console.log(error);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const fetchAllocateToUserNames = () => {
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while fetching user names...",
      loading: true,
    }));

    productionService
      .readProductionAndQCUniqueUserNames()
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.UserNamesList)
        ) {
          setInitStates((prevState) => ({
            ...prevState,
            allocateToUsers: response.data.UserNamesList,
            loading: false,
          }));
        } else {
          setInitStates((prevState) => ({
            ...prevState,
            allocateToUsers: [],
            loading: false,
          }));
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const fetchSKUAllocatedUserNames = () => {
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while fetching allocated user names...",
      loading: true,
    }));

    onScreenProductionAllocationService
      .getProjectAllocatedUserNames(
        initStates.selectedCustomerCode,
        initStates.selectedProjectCode,
        initStates.selectedBatchNo,
      )
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.UserNamesList)
        ) {
          setInitStates((prevState) => ({
            ...prevState,
            skuAllocatedUserNames: response.data.UserNamesList,
            loading: false,
          }));
          console.log(response.data.UserNamesList);
        } else {
          setInitStates((prevState) => ({
            ...prevState,
            skuAllocatedUserNames: [],
            loading: false,
          }));
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const fetchSKUsOfProject = () => {
    fetchPendingSKUsOfProject();
    fetchAllocatedSKUsOfProject();
    fetchSKUAllocatedUserNames();
  };

  const fetchPendingSKUsOfProject = () => {
    if (!initStates.selectedCustomerCode || !initStates.selectedProjectCode) {
      toast.error("Please select Customer and Project Code");
      return;
    }
    setInitStates((prevState) => ({ ...prevState, loading: true }));

    onScreenProductionAllocationService
      .getPendingToAllocateSKUsFromCIF(
        initStates.selectedCustomerCode,
        initStates.selectedProjectCode,
        initStates.selectedBatchNo || "",
        initStates.selectedColumn || "",
        initStates.searchText || "",
      )
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          dynamicColumnBody: response.data || [],
          loading: false,
        }));
      })
      .catch((err) => {
        console.log(err);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const fetchAllocatedSKUsOfProject = () => {
    if (!initStates.selectedCustomerCode || !initStates.selectedProjectCode)
      return;
    setInitStates((prevState) => ({ ...prevState, loading: true }));

    onScreenProductionAllocationService
      .getProductionAllocatedSKUsOfProject(
        initStates.selectedCustomerCode,
        initStates.selectedProjectCode,
        "",
        initStates.selectedBatchNo,
        "A",
      )
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          allocatedSKUsColumnBody: response.data || [],
          loading: false,
        }));
      })
      .catch((err) => {
        console.log(err);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const fetchReAllocateFromUserSKUsList = (e) => {
    const value = e.target.value;

    let arrReAllocateToUser = value.split("-");
    let reAllocateFromUserName = "";
    if (arrReAllocateToUser.length === 2)
      reAllocateFromUserName = arrReAllocateToUser[1].trim();
    else return;

    if (!initStates.selectedCustomerCode || !initStates.selectedProjectCode)
      return;

    setInitStates((prevState) => ({
      ...prevState,
      reAllocateFromUser: value,
      reAllocateFromUserName: reAllocateFromUserName,
      loading: true,
    }));

    onScreenProductionAllocationService
      .getProductionAllocatedSKUsOfProject(
        initStates.selectedCustomerCode,
        initStates.selectedProjectCode,
        reAllocateFromUserName,
        initStates.selectedBatchNo,
        "R",
      )
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          reAllocationSKUsColumnBody: response.data || [],
          loading: false,
        }));
      })
      .catch((err) => {
        console.log(err);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const onChangeAllocateToUser = (e) => {
    const allocateToUser = e.target.value;
    let allocateToUserName = "";
    let arrAllocateToUser = allocateToUser.split("-");
    if (arrAllocateToUser.length === 2) {
      allocateToUserName = arrAllocateToUser[1].trim();
    }

    setInitStates((prevState) => ({
      ...prevState,
      selectedAllocateToUser: allocateToUser,
      selectedAllocateToUserName: allocateToUserName,
    }));
  };

  const onChangeReAllocateToUser = (e) => {
    const reAllocateToUser = e.target.value;
    let reAllocateToUserName = "";
    let arrReAllocateToUser = reAllocateToUser.split("-");
    if (arrReAllocateToUser.length === 2) {
      reAllocateToUserName = arrReAllocateToUser[1].trim();
    }

    setInitStates((prevState) => ({
      ...prevState,
      reAllocateToUserName: reAllocateToUserName,
      reAllocateToUser: reAllocateToUser,
    }));
  };

  const validateAndAllocateSelecetdSKUsFromPendingToAllocateList = () => {
    const selectedRows = gridRef.current?.api?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select the pending to allocate SKUs");
      return;
    }
    if (!initStates.selectedAllocateToUser) {
      toast.error("Please select allocate to user");
      return;
    }

    const pendingSKUsData = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo || "",
      CIFIDs: selectedRows.map((attr) => ({ CIFID: attr.ID })),
      AllocateToUser: initStates.selectedAllocateToUserName,
      UserID: helper.getUser(),
    };

    onScreenProductionAllocationService
      .validateAndAllocateSelecetdSKUsFromPendingToAllocateList(pendingSKUsData)
      .then((response) => {
        toast.success(response.data);
        fetchSKUsOfProject(); // Refresh lists after success
      })
      .catch((err) => {
        console.log(err);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const validateAndReAllocateSKUs = () => {
    const selectedRows = gridRefB.current?.api?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select the SKUs to re-allocate");
      return;
    }

    if (!initStates.reAllocateToUserName) {
      toast.error("Please select re-allocate to user");
      return;
    }

    const reAllocateSKUsData = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo || "",
      CIFIDs: selectedRows.map((attr) => ({ CIFID: attr.ID })),
      AllocateToUser: initStates.reAllocateToUserName,
      UserID: helper.getUser(),
    };

    onScreenProductionAllocationService
      .validateAndReAllocateSKUs(reAllocateSKUsData)
      .then((response) => {
        toast.success(response.data);
        setInitStates((prevState) => ({
          ...prevState,
          reAllocationSKUsColumnBody: [],
          reAllocateFromUser: "",
          reAllocateToUser: "",
          loading: false,
        }));
        fetchSKUsOfProject(); // Refresh lists after success
      })
      .catch((err) => {
        console.log(err);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  const moveSelectedSKUsToPending = () => {
    const selectedRows = gridRefA.current?.api?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select the allocated SKUs");
      return;
    }

    const allocatedSKUsData = {
      CustomerCode: initStates.selectedCustomerCode,
      ProjectCode: initStates.selectedProjectCode,
      BatchNo: initStates.selectedBatchNo || "",
      CIFIDs: selectedRows.map((attr) => ({ CIFID: attr.ID })),
      AllocateToUser: "vic",
      UserID: helper.getUser(),
    };

    onScreenProductionAllocationService
      .validateAndMoveAllocatedSKUsToPending(allocatedSKUsData)
      .then((response) => {
        toast.success(response.data);
        fetchSKUsOfProject(); // Refresh lists after success
      })
      .catch((err) => {
        console.log(err);
        setInitStates((prevState) => ({ ...prevState, loading: false }));
      });
  };

  return (
    <div>
      <div className="p-4">
        <LoadingOverlay
          active={initStates.loading}
          spinner={<BarLoader color={"#38D643"} width={"350px"} />}
        >
          <div className="card shadow-sm mb-1">
            <div className="card-header bg-light">
              <h6 className="mb-0 text-uppercase font-weight-bold">
                Allocate SKU(s) for Production
              </h6>
            </div>
            <div className="card-body">
              {/* Form Selectors */}
              <div className="row align-items-center mb-3">
                <div className="col-md-4">
                  <label className="font-weight-bold mb-1">
                    Customer Code *
                  </label>
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
                  <label className="font-weight-bold mb-1">
                    Project Code *
                  </label>
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
              <div className="row align-items-center mb-3">
                <div className="col-md-4">
                  <label className="font-weight-bold mb-1">Search on</label>
                  <select
                    className="form-control"
                    value={initStates.selectedColumn}
                    onChange={(e) =>
                      setInitStates((p) => ({
                        ...p,
                        selectedColumn: e.target.value,
                      }))
                    }
                  >
                    <option value="">--Select--</option>
                    {initStates.CIFcolumns.map((col) => (
                      <option key={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="font-weight-bold mb-1">Search Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={initStates.searchText}
                    onChange={(e) =>
                      setInitStates((p) => ({
                        ...p,
                        searchText: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary btn-block shadow-sm mg-t-10"
                    onClick={fetchSKUsOfProject}
                  >
                    Search
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-secondary btn-block mt-2"
                    onClick={() => {
                      setInitStates(initialStates);
                      fetchCustomers();
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </div>

      <Tab.Container defaultActiveKey="pendingToAllocate">
        <Nav
          variant="pills"
          className="mg-l-20 mg-b-20 mg-t-5"
          style={{ cursor: "pointer" }}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="pendingToAllocate"
              onClick={() => toggle(1)}
              style={{ border: "1px solid #5E41FC" }}
            >
              Pending To Allocate
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="allocated"
              onClick={() => toggle(2)}
              style={{ border: "1px solid #5E41FC" }}
            >
              Allocated
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="reAllocate"
              onClick={() => toggle(3)}
              style={{ border: "1px solid #5E41FC" }}
            >
              Re-Allocate
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="card shadow-sm mg-l-15 mg-r-10">
          <Tab.Content>
            {/* Removed internal ternary checks to prevent grid destruction */}
            <Tab.Pane eventKey="pendingToAllocate">
              <div
                className="ag-theme-alpine w-100 mg-l-15 mg-t-10"
                style={{ height: "520px", maxWidth: "1310px" }}
              >
                <AgGridReact
                  ref={gridRef}
                  columnDefs={dynamicColumnHead}
                  rowData={initStates.dynamicColumnBody}
                  rowSelection="multiple"
                  pagination={true}
                  animateRows={true}
                  paginationPageSize={100}
                />
              </div>
              <div className="row align-items-center mb-3 ml-3">
                <label className="font-weight-bold mg-l-15 mg-t-5">
                  Allocate To User *
                </label>
                <div className="col-md-3 mg-t-5">
                  <select
                    className="form-control"
                    value={initStates.selectedAllocateToUser}
                    onChange={onChangeAllocateToUser}
                  >
                    <option value="">--Select--</option>
                    {initStates.allocateToUsers.map((u) => (
                      <option key={u.UserName} value={u.UserName}>
                        {u.UserName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary btn-block mg-t-5"
                    onClick={
                      validateAndAllocateSelecetdSKUsFromPendingToAllocateList
                    }
                  >
                    Save Allocation
                  </button>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="allocated">
              <div
                className="ag-theme-alpine w-100 mg-l-15 mg-t-10"
                style={{ height: "520px", maxWidth: "1310px" }}
              >
                <AgGridReact
                  ref={gridRefA}
                  columnDefs={allocatedSKUsColumnDefs}
                  rowData={initStates.allocatedSKUsColumnBody}
                  rowSelection="multiple"
                  pagination={true}
                  animateRows={true}
                  paginationPageSize={100}
                />
              </div>
              <div className="row align-items-center mb-3 ml-3">
                <div className="col-md-3">
                  <button
                    className="btn btn-primary btn-block mg-t-5"
                    onClick={moveSelectedSKUsToPending}
                  >
                    Move Selected SKUs To Pending
                  </button>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="reAllocate">
              <div className="row align-items-center mb-3 mg-l-10">
                <label className="font-weight-bold mg-l-15 mg-t-5">
                  Production User <span className="text-danger">*</span>
                </label>
                <div className="col-md-3 mg-t-5">
                  <select
                    className="form-control"
                    id="productionUser"
                    name="productionUser"
                    value={initStates.reAllocateFromUser}
                    onChange={fetchReAllocateFromUserSKUsList}
                  >
                    <option value="">--Select--</option>
                    {initStates.skuAllocatedUserNames.map((u) => (
                      <option key={u.UserName} value={u.UserName}>
                        {u.UserName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="ag-theme-alpine w-100 mg-l-15 mg-t-10"
                style={{ maxHeight: "520px", maxWidth: "1310px" }}
              >
                <AgGridReact
                  ref={gridRefB}
                  columnDefs={allocatedSKUsColumnDefs}
                  rowData={initStates.reAllocationSKUsColumnBody}
                  rowSelection="multiple"
                  pagination={true}
                  animateRows={true}
                  paginationPageSize={100}
                />
              </div>
              <div className="row align-items-center mb-3 mg-l-10">
                <label className="font-weight-bold mg-l-15 mg-t-5">
                  Re-Allocate To <span className="text-danger">*</span>
                </label>
                <div className="col-md-3 mg-t-5">
                  <select
                    className="form-control"
                    id="reAllocateToUser"
                    name="reAllocateToUser"
                    onChange={onChangeReAllocateToUser}
                  >
                    <option value="">--Select--</option>
                    {initStates.allocateToUsers.map((u) => (
                      <option key={u.UserName} value={u.UserName}>
                        {u.UserName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary btn-block shadow-sm mg-t-5"
                    onClick={validateAndReAllocateSKUs}
                  >
                    Save Re-Allocation
                  </button>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
    </div>
  );
}
