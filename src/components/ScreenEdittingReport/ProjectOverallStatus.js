import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import BootstrapTable from "react-bootstrap-table-next";
import { BarLoader } from "react-spinners";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import "./screenEditingReport.scss";
import productionService from "../../services/production.service";
import productionAllocationService from "../../services/productionAllocation.service";
import { MaterialReactTable } from "material-react-table";
import Form from "react-bootstrap/Form";
import moment from "moment";

toast.configure();

const projectColumns = [
  {
    dataField: "ProjectCode",
    text: "Project Codes",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
  },
];

const batchColumns = [
  {
    dataField: "BatchNo",
    text: "Batch Nos.",
    headerStyle: {
      backgroundColor: "#f2f8fb",
    },
  },
];

const skusWithDatewiseDetailsListColDefs = [
  {
    accessorKey: "User",
    header: "User",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
  {
    accessorKey: "UpdatedOn",
    header: "Date",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
    Cell: ({ row }) => (
      <div>{moment(row.original.UpdatedOn).format("DD-MMM-YYYY")}</div>
    ),
  },
  {
    accessorKey: "Count",
    header: "Count",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
];

const skuDetailsListColDefs = [
  {
    accessorKey: "UniqueID",
    header: "Unique ID",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
  // {
  //   accessorKey: "Status",
  //   header: "Status",
  //   size: 140,
  //   muiTableHeadCellProps: {
  //     align: "center",
  //     style: {
  //       position: "sticky",
  //       left: 0,
  //       zIndex: 999,
  //     },
  //   },
  //   muiTableBodyCellProps: {
  //     align: "center",
  //     style: {
  //       position: "sticky",
  //       left: 0,
  //       zIndex: 1,
  //     },
  //   },
  // },
  {
    accessorKey: "Level",
    header: "Level",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
  {
    accessorKey: "User",
    header: "User",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
  {
    accessorKey: "UpdatedOn",
    header: "Date",
    size: 140,
    muiTableHeadCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 999,
      },
    },
    muiTableBodyCellProps: {
      align: "center",
      style: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
    Cell: ({ row }) => (
      <div>{moment(row.original.UpdatedOn).format("DD-MMM-YYYY")}</div>
    ),
  },
];

export default class ProjectOverallStatus extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.state = {
      loading: false,
      spinnerMessage: "",
      customers: [],
      customerCodeExpanded: [],
      selectedCustomerCode: "",
      projectCodes: [],
      projectCodeExpanded: [],
      selectedProjectCode: "",
      batches: [],
      selectedBatchNo: "",
      skusWithDatewiseDetailsList: [],
      skuDetailsList: [],
      customerCode: null,
      projectCode: null,
      batchNo: null,
      scope: null,
      productionCompletedCount: null,
      productionCompletedPercentage: null,
      qcCompletedPercentage: null,
      volume: null,
      allocatedCount: null,
      yetToAllocateCount: null,
      processedCount: null,
      qcApprovedCount: null,
      queryCount: null,
      selectedStatusLabel: "Processed",
      selectedStatus: "P",
    };
  }

  //#region page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
    this.fetchCustomers();
  }
  //#endregion

  //#region fetching customers from Web API
  fetchCustomers() {
    this.setState({
      spinnerMessage: "Please wait while fetching Customers...",
      loading: true,
    });

    productionAllocationService
      .getCustomerCodes()
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
        selectedProjectCode: "",
        projectCodeExpanded: [],
        batches: [],
        selectedBatchNo: "",
        customerCode: "",
        projectCode: "",
        batchNo: "",
        scope: "",
        skusWithDatewiseDetailsList: [],
        skuDetailsList: [],
        productionCompletedCount: null,
        productionCompletedPercentage: null,
        qcCompletedPercentage: null,
        volume: null,
        allocatedCount: null,
        yetToAllocateCount: null,
        processedCount: null,
        qcApprovedCount: null,
        queryCount: null,
        selectedStatusLabel: "Processed",
        selectedStatus: "P",
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Projects...",
      loading: true,
      skusWithDatewiseDetailsList: [],
      skuDetailsList: [],
      productionCompletedCount: null,
      productionCompletedPercentage: null,
      qcCompletedPercentage: null,
      volume: null,
      allocatedCount: null,
      yetToAllocateCount: null,
      processedCount: null,
      qcApprovedCount: null,
      queryCount: null,
      selectedStatusLabel: "Processed",
      selectedStatus: "P",
    });

    productionAllocationService
      .getProjectCodesOfCustomer(row.CustomerCode)
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

  //#region fetching Project Details of Selected Project or Batch No from Web API
  fetchProjectDetails(customerCode, projectCode, batchNo) {
    this.setState({
      spinnerMessage: "Please wait while fetching project details...",
      loading: true,
      skusWithDatewiseDetailsList: [],
      skuDetailsList: [],
      productionCompletedCount: null,
      productionCompletedPercentage: null,
      qcCompletedPercentage: null,
      volume: null,
      allocatedCount: null,
      yetToAllocateCount: null,
      processedCount: null,
      qcApprovedCount: null,
      queryCount: null,
      selectedStatusLabel: "Processed",
      selectedStatus: "P",
    });

    productionAllocationService
      .getProjectDetails(customerCode, projectCode, batchNo)
      .then((response) => {
        this.setState(
          {
            selectedBatchNo: batchNo,
            customerCode: response.data.CustomerCode,
            projectCode: response.data.ProjectCode,
            batchNo: response.data.BatchNo,
            scope: response.data.Scope,
            loading: false,
          },
          () => this.fetchProjectStatusCounts()
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
      }));
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Batches...",
      loading: true,
    });

    productionAllocationService
      .getBatchesOfProject(this.state.selectedCustomerCode, row.ProjectCode)
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
            loading: false,
            skusWithDatewiseDetailsList: [],
            skuDetailsList: [],
            productionCompletedCount: null,
            productionCompletedPercentage: null,
            qcCompletedPercentage: null,
            volume: null,
            allocatedCount: null,
            yetToAllocateCount: null,
            processedCount: null,
            qcApprovedCount: null,
            queryCount: null,
            selectedStatusLabel: "Processed",
            selectedStatus: "P",
          });
        } else {
          this.fetchProjectDetails(
            this.state.selectedCustomerCode,
            row.ProjectCode,
            ""
          );
          this.setState(
            {
              batches: [],
              selectedBatchNo: "",
              selectedProjectCode: row.ProjectCode,
              projectCodeExpanded: [row.ProjectCode],
              loading: false,
            },
            () =>
              this.fetchUserDatewiseCountsAndSKUDetails(
                this.state.selectedStatus
              )
          );
        }
      })
      .catch((e) => {
        this.setState({ loading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  selectCustomerRow = {
    mode: "radio",
    hideSelectColumn: true,
    clickToSelect: true,
    clickToExpand: true,
  };

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

  //#region Fetch Project Status Counts
  fetchProjectStatusCounts = () => {
    const {
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo,
      selectedStatus,
    } = this.state;

    this.setState({
      loading: true,
      spinnerMessage: "Please wait while fetching Project Status Counts...",
    });

    if (selectedCustomerCode && selectedProjectCode) {
      setTimeout(() => {
        productionService
          .getProjectOverallStatus(
            selectedCustomerCode,
            selectedProjectCode,
            selectedBatchNo,
            selectedStatus
          )
          .then((response) => {
            const data = response.data.projectOverallStatusCount;
            this.setState({
              volume: data.Volume,
              allocatedCount: data.AllocatedCount,
              yetToAllocateCount: data.YetToAllocate,
              processedCount: data.Processed,
              qcApprovedCount: data.QCApproved,
              queryCount: data.Query,
              productionCompletedPercentage: data.ProductionCompletedPercentage,
              qcCompletedPercentage: data.QCCompletedPercentage,
            });
          })
          .catch((e) => {
            toast.error(e.response?.data?.Message || "Error occurred.", {
              autoClose: false,
            });
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      });
    }
  };
  //#endregion

  //#region Fetch User Datewise Counts and SKU details
  fetchUserDatewiseCountsAndSKUDetails = (selectedStatus) => {
    const { selectedCustomerCode, selectedProjectCode, selectedBatchNo } =
      this.state;

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while fetching User Datewise Counts and SKU details...",
    });

    if (selectedCustomerCode && selectedProjectCode) {
      setTimeout(() => {
        productionService
          .getProjectOverallStatus(
            selectedCustomerCode,
            selectedProjectCode,
            selectedBatchNo,
            selectedStatus
          )
          .then((response) => {
            const statusUserDateCountList =
              response.data.projectStatusUserDateCountList;
            const projectStatusSKUsList = response.data.projectStatusSKUsList;

            if (statusUserDateCountList) {
              this.setState({
                skusWithDatewiseDetailsList: statusUserDateCountList,
              });
            } else {
              this.setState({
                skusWithDatewiseDetailsList: [],
              });
            }

            if (projectStatusSKUsList) {
              this.setState({
                skuDetailsList: projectStatusSKUsList,
              });
            } else {
              this.setState({
                skuDetailsList: [],
              });
            }
          })
          .catch((e) => {
            toast.error(e.response?.data?.Message || "Error occurred.", {
              autoClose: false,
            });
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      });
    }
  };
  //#endregion

  render() {
    const setWidth = (value) => {
      return { width: `${value}%` };
    };

    const customerColumns = [
      {
        dataField: "CustomerCode",
        text: "Customers and Projects",
        headerStyle: {
          backgroundColor: "#f2f8fb",
        },
      },
    ];

    //#region Expand customer code row and fetch projects of selected customer
    const expandRow = {
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

    //#region Expand Batch Row
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
        expandRow={expandRow}
        selectRow={this.selectCustomerRow}
        id="customer"
      />
    </div>;

    return (
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
          <div className="row mg-l-30">
            <div className="col-md-3 p-3 bg-light border rounded">
              <div
                className="table-responsive"
                style={{
                  height: this.state.customers.length > 10 ? "490px" : "auto",
                }}
              >
                <BootstrapTable
                  keyField="CustomerCode"
                  data={this.state.customers}
                  columns={customerColumns}
                  expandRow={expandRow}
                  selectRow={this.selectCustomerRow}
                  id="customer"
                />
              </div>
            </div>
            <div className="col-md-9 px-4 py-3 bg-light border rounded">
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Customer Code:</strong>
                </div>
                <div className="col-md-3">{this.state.customerCode}</div>
                <div className="col-md-3">
                  <strong>Project Code:</strong>
                </div>
                <div className="col-md-3">{this.state.projectCode}</div>
              </div>

              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Batch No.:</strong>
                </div>
                <div className="col-md-3">{this.state.batchNo}</div>
                <div className="col-md-3">
                  <strong>Scope:</strong>
                </div>
                <div className="col-md-3">{this.state.scope}</div>
              </div>
              {/* Progress Bar */}
              <div className="mb-2">
                <label className="large">
                  <strong>Processed</strong>
                </label>
                <div
                  className="progress"
                  style={{ height: "25px", borderRadius: "0" }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      ...setWidth(this.state.productionCompletedPercentage),
                      height: "25px",
                      borderRadius: "0",
                      backgroundColor: "#4472C4",
                    }}
                  >
                    {this.state.productionCompletedPercentage}%
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mb-2">
                <label className="large">
                  <strong>QC Approved</strong>
                </label>
                <div
                  className="progress"
                  style={{
                    height: "25px",
                    borderRadius: "0",
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      ...setWidth(this.state.qcCompletedPercentage),
                      height: "25px",
                      borderRadius: "0",
                      backgroundColor: "#B4C7E7",
                    }}
                  >
                    {this.state.qcCompletedPercentage}%
                  </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-between align-items-center text-white py-2 px-3 rounded mb-3"
                style={{ backgroundColor: "#4472C4" }}
              >
                <div className="col">
                  <strong>Volume</strong>
                  <br />
                  {this.state.volume}
                </div>
                <div className="col">
                  <strong>Allocated</strong>
                  <br />
                  {this.state.allocatedCount}
                </div>
                <div className="col">
                  <strong>Yet to Allocate</strong>
                  <br />
                  {this.state.yetToAllocateCount}
                </div>
                <div className="col">
                  <strong>Processed</strong>
                  <br />
                  {this.state.processedCount}
                </div>
                <div className="col">
                  <strong>QC Approved</strong>
                  <br />
                  {this.state.qcApprovedCount}
                </div>
                <div className="col">
                  <strong>Query</strong>
                  <br />
                  {this.state.queryCount}
                </div>
              </div>
              <div
                className="d-flex justify-content-between align-items-center text-white py-2 px-3 rounded mb-3"
                style={{ backgroundColor: "#4472C4" }}
              >
                {[
                  { label: "Processed", value: "P" },
                  { label: "QC Approved", value: "Q" },
                  { label: "Rejected", value: "R" },
                  { label: "Query", value: "U" },
                ].map(({ label, value }) => (
                  <Form.Check
                    inline
                    key={label}
                    label={label}
                    name="statusGroup"
                    type="radio"
                    className="text-white"
                    value={value}
                    checked={this.state.selectedStatus === value}
                    onChange={() => {
                      this.setState({
                        selectedStatusLabel: label,
                        selectedStatus: value,
                      });
                      this.fetchUserDatewiseCountsAndSKUDetails(value);
                    }}
                  />
                ))}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-2">
                    {this.state.selectedStatusLabel} SKUs - User & Datewise
                  </h6>
                  <MaterialReactTable
                    data={this.state.skusWithDatewiseDetailsList}
                    columns={skusWithDatewiseDetailsListColDefs}
                    enableStickyHeader
                    enablePagination={false}
                    muiTableContainerProps={{
                      sx: { height: "180px", border: "1px solid #ccc" },
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-2">SKU Details</h6>
                  <MaterialReactTable
                    data={this.state.skuDetailsList}
                    columns={skuDetailsListColDefs}
                    enableStickyHeader
                    enablePagination={false}
                    muiTableContainerProps={{
                      sx: { height: "180px", border: "1px solid #ccc" },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </>
    );
  }
}
