import { Component } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { MaterialReactTable } from "material-react-table";
import productionService from "../../services/production.service";
import { Box } from "@mui/material";
import moment from "moment";
import { IconButton, Tooltip } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import { toast } from "react-toastify";

toast.configure();

//#region SKUs List Col Defs
const SKUsListColDefs = [
  {
    accessorKey: "Date",
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
    accessorKey: "ProductionUser",
    header: "Production User",
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
    accessorKey: "QCUser",
    header: "QC User",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "CustomerCode",
    header: "Customer Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "ProjectCode",
    header: "Project Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "BatchNo",
    header: "Batch No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "UniqueID",
    header: "Unique ID",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "ShortDescription",
    header: "Short Description",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "LongDescription",
    header: "Long Description",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "UOM",
    header: "UOM",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "NewShortDescription",
    header: "New Short Description",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "NewLongDescription",
    header: "New Long Description",
    size: 800,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "800px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "MissingWords",
    header: "Missing Words",
    size: 400,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "400px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "MFRName",
    header: "MFR Name",
    size: 120,
  },
  {
    accessorKey: "MFRPN",
    header: "MFR P/N",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName",
    header: "Vendor Name",
    size: 120,
  },
  {
    accessorKey: "VendorPN",
    header: "Vendor P/N",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "Noun",
    header: "Noun",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "Modifier",
    header: "Modifier",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "Level",
    header: "Level",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "MFRName1",
    header: "MFR Name1",
    size: 120,
  },
  {
    accessorKey: "MFRPN1",
    header: "MFR P/N 1",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "MFRName2",
    header: "MFR Name2",
    size: 120,
  },
  {
    accessorKey: "MFRPN2",
    header: "MFR P/N 2",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "MFRName3",
    header: "MFR Name3",
    size: 120,
  },
  {
    accessorKey: "MFRPN3",
    header: "MFR P/N 3",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName1",
    header: "Vendor Name1",
    size: 120,
  },
  {
    accessorKey: "VendorPN1",
    header: "Vendor P/N 1",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName2",
    header: "Vendor Name2",
    size: 120,
  },
  {
    accessorKey: "VendorPN2",
    header: "Vendor P/N 2",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "VendorName3",
    header: "Vendor Name3",
    size: 120,
  },
  {
    accessorKey: "VendorPN3",
    header: "Vendor P/N 3",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "AdditionalInfoFromInput",
    header: "Additional Info From Input",
    size: 800,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "800px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "AdditionalInfoFromWeb",
    header: "Additional Info From Web",
    size: 800,
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal", // allow text to wrap
        wordBreak: "break-word", // break long words
        maxWidth: "800px", // or any desired limit
      },
    },
  },
  {
    accessorKey: "UNSPSCCode",
    header: "UNSPSC Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 100,
  },
  {
    accessorKey: "UNSPSCCategory",
    header: "UNSPSC Category",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "WebRefURL1",
    header: "Web Ref URL1",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "WebRefURL2",
    header: "Web Ref URL2",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "WebRefURL3",
    header: "Web Ref URL3",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "PDFURL",
    header: "PDF URL",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "Remarks",
    header: "Remarks",
    muiTableHeadCellProps: {
      align: "left",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    size: 120,
  },
  {
    accessorKey: "Query",
    header: "Query",
    muiTableHeadCellProps: {
      align: "left",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    size: 120,
  },
  {
    accessorKey: "Application",
    header: "Application",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "DWG",
    header: "DWG",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "ItemNo",
    header: "Item No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "OtherNo",
    header: "Other No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "POS",
    header: "POS",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "SerialNo",
    header: "Serial No.",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "KKSCode",
    header: "KKS Code",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "AssemblyOrPart",
    header: "Assembly / Part",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "BOM",
    header: "BOM",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
  {
    accessorKey: "GreenItems",
    header: "Green Items",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 120,
  },
];
//#endregion

export default class UserBasedStatusReport extends Component {
  //#region constructor
  constructor(props) {
    super(props);

    this.state = {
      userNames: [],
      selectedUserName: "",
      selectedStatus: "A",
      allocatedCount: null,
      processedCount: null,
      pendingCount: null,
      qcApprovedCount: null,
      rejectedCount: null,
      queryCount: null,
      userSKUsListData: [],
      loading: false,
      spinnerMessage: "",
    };

    this.initialState = this.state;

    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.exportUserBasedStatusListToExcel =
      this.exportUserBasedStatusListToExcel.bind(this);
    this.resetComponent = this.resetComponent.bind(this);
  }
  //#endregion

  //#region component did mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    this.fetchUserNames();
  }
  //#endregion

  //#region fetching user names from Web API
  fetchUserNames = () => {
    this.setState({
      spinnerMessage: "Please wait while fetching user names...",
      loading: true,
    });

    productionService
      .readProductionAndQCUniqueUserNames()
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.UserNamesList)
        ) {
          this.setState({
            userNames: response.data.UserNamesList,
          });
        } else {
          this.setState({
            userNames: [],
          });
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };
  //#endregion

  //#region On Change User Name
  onChangeUserName = (e) => {
    this.setState(
      {
        selectedUserName: e.target.value,
      },
      () => this.fetchSKUsListOfUser(),
    );
  };
  //#endregion

  //#region Fetch SKUs List of User
  fetchSKUsListOfUser = () => {
    let userName = "";
    const { selectedUserName, selectedStatus } = this.state;

    let userNameArray = selectedUserName.split("-");

    if (userNameArray.length === 2) {
      userName = userNameArray[1].trim();
    }

    this.setState({
      loading: true,
      spinnerMessage: "Please wait while fetching User Based Status...",
    });

    setTimeout(() => {
      productionService
        .readUserBasedStatus(userName, selectedStatus)
        .then((response) => {
          if (
            response.data.Success === 1 &&
            Array.isArray(response.data.ProductionItemsList)
          ) {
            const data = response.data.ProductionItemsList;
            this.setState({
              userSKUsListData: data || [],
              allocatedCount: response.data.AllocatedCount || 0,
              processedCount: response.data.ProcessedCount || 0,
              pendingCount: response.data.PendingCount || 0,
              qcApprovedCount: response.data.QCApprovedCount || 0,
              rejectedCount: response.data.RejectedCount || 0,
              queryCount: response.data.QueryCount || 0,
            });
          } else {
            this.setState({
              userSKUsListData: [],
              allocatedCount: null,
              processedCount: null,
              pendingCount: null,
              qcApprovedCount: null,
              rejectedCount: null,
              queryCount: null,
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
  };
  //#endregion

  //#region Export User Based Status List to Excel
  exportUserBasedStatusListToExcel = () => {
    let userName = "";
    const { selectedUserName, selectedStatus } = this.state;

    let userNameArray = selectedUserName.split("-");

    if (userNameArray.length === 2) {
      userName = userNameArray[1].trim();
    }

    this.setState({
      loading: true,
      spinnerMessage:
        "Please wait while exporting User Based Status List to excel...",
    });

    let fileName = "User Based Status List.xlsx";

    productionService
      .exportUserBasedStatusListToExcel(
        userName,
        helper.getUser(),
        selectedStatus,
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Reset Component
  resetComponent = () => {
    this.setState({
      spinnerMessage: "Please wait while reloading...",
      loading: true,
    });
    this.setState(this.initialState);
    this.componentDidMount();
  };
  //#endregion

  //#region render
  render() {
    return (
      <div>
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
          <div className="mg-l-50 mg-r-25 mg-b-10">
            <div
              className="d-flex justify-content-center align-items-center text-white py-2 px-3 mb-3"
              style={{ backgroundColor: "#4472C4" }}
            >
              <div className="d-flex align-items-center gap-2">
                <label
                  className="form-check-label text-white me-2 mg-r-10"
                  htmlFor="userName"
                  style={{ "font-size": "0.875rem" }}
                >
                  User
                </label>
                <select
                  className="form-control"
                  tabIndex="1"
                  id="userName"
                  name="userName"
                  style={{
                    minWidth: "300px",
                    minHeight: "15px",
                    fontSize: "14px",
                  }}
                  placeholder="--Select--"
                  value={this.state.selectedUserName}
                  onChange={this.onChangeUserName}
                >
                  <option value="">--Select--</option>
                  {this.state.userNames.map((user) => (
                    <option key={user.UserName} value={user.UserName}>
                      {user.UserName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-end mg-l-50">
                <button
                  onClick={this.resetComponent}
                  className="btn btn-gray-700 btn-block"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="mg-l-50 mg-r-25 mg-b-10">
            <div
              className="d-flex justify-content-between align-items-center text-white py-2 px-3 mb-3"
              style={{ backgroundColor: "#4472C4" }}
            >
              <div className="col">
                <strong>Allocated</strong>
                <br />
                {this.state.allocatedCount}
              </div>
              <div className="col">
                <strong>Processed</strong>
                <br />
                {this.state.processedCount}
              </div>
              <div className="col">
                <strong>Pending</strong>
                <br />
                {this.state.pendingCount}
              </div>
              <div className="col">
                <strong>QC Approved</strong>
                <br />
                {this.state.qcApprovedCount}
              </div>
              <div className="col">
                <strong>Rejected</strong>
                <br />
                {this.state.rejectedCount}
              </div>
              <div className="col">
                <strong>Query</strong>
                <br />
                {this.state.queryCount}
              </div>
            </div>
          </div>
          <div
            style={{ border: "1px solid #cdd4e0", backgroundColor: "#4472C4" }}
            className="mg-l-50 mg-r-25 mg-b-10 text-white"
          >
            <div className="row row-sm mg-r-15 mg-l-5 mg-t-10 mg-b-10">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <div className="row" style={{ width: "100%" }}>
                  <div style={{ marginLeft: "40px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-allocated"
                      value="A"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "A"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUsListOfUser(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-allocated"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Allocated
                    </label>
                  </div>
                  <div style={{ marginLeft: "10px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-processed"
                      value="P"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "P"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUsListOfUser(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-processed"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Processed
                    </label>
                  </div>
                  <div style={{ marginLeft: "12px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-pending"
                      value="I"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "I"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUsListOfUser(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-pending"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Pending
                    </label>
                  </div>
                  <div style={{ marginLeft: "15px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-qcapproved"
                      value="Q"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "Q"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUsListOfUser(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-qcapproved"
                      style={{ "font-size": "0.875rem" }}
                    >
                      QC Approved
                    </label>
                  </div>
                  <div style={{ marginLeft: "5px", width: "16%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-rejected"
                      value="R"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "R"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUsListOfUser(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-rejected"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Rejected
                    </label>
                  </div>
                  <div style={{ marginLeft: "10px", width: "10%" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="group1"
                      id="radio-query"
                      value="U"
                      style={{ "margin-top": "5px" }}
                      checked={this.state.selectedStatus === "U"}
                      onChange={(e) => {
                        this.setState(
                          { selectedStatus: e.target.value },
                          () => {
                            this.fetchSKUsListOfUser(); // Called only after state is updated
                          },
                        );
                      }}
                    />
                    <label
                      className="form-check-label mg-t-5"
                      htmlFor="radio-query"
                      style={{ "font-size": "0.875rem" }}
                    >
                      Query
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ border: "1px solid #cdd4e0" }}
            className="mg-l-50 mg-r-25 mg-b-10"
          >
            <MaterialReactTable
              columns={SKUsListColDefs}
              data={this.state.userSKUsListData}
              className="onGoingProjectListTable"
              initialState={{ density: "compact" }}
              enableRowVirtualization={true}
              enableRowExpansion={false}
              enableColumnFilterModes
              enableColumnOrdering={false}
              enableRowSelection={false}
              enableFullScreenToggle={true}
              enablePagination={false}
              enableStickyHeader={true}
              muiTableContainerProps={{
                sx: {
                  height: {
                    xs: "calc(100vh - 180px)", // mobile
                    sm: "calc(100vh - 160px)", // small devices
                    md: "calc(100vh - 140px)", // tablets/small laptops
                    lg: "calc(100vh - 120px)", // desktops
                    xl: "calc(100vh - 100px)", // large screens
                  },
                  maxHeight: {
                    xs: "calc(100vh - 180px)",
                    sm: "calc(100vh - 160px)",
                    md: "calc(100vh - 140px)",
                    lg: "calc(100vh - 120px)",
                    xl: "calc(100vh - 100px)",
                  },
                  overflowY: "auto",
                  width: "100%",
                },
              }}
              muiTableBodyRowProps={({ row }) => ({
                sx: {
                  backgroundColor:
                    row.index % 2 === 0
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(244, 246, 248, 1)",
                },
              })}
              renderTopToolbarCustomActions={() => (
                <Box
                  sx={{
                    display: "flex",
                    gap: "16px",
                    padding: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip title="Export Excel">
                    <IconButton onClick={this.exportUserBasedStatusListToExcel}>
                      <FaFileExcel
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          fontSize: "1.3rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
          </div>
        </LoadingOverlay>
      </div>
    );
  }
  //#endregion
}
