import React, { useRef, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import QCService from "../../services/QC.service";
import productionAllocationService from "../../services/production.service";
import { FaFileExcel } from "react-icons/fa";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row } from "react-bootstrap";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import "./QCItemsList.scss";
import GOPProdItemEditWithQCRef from "./GOPProdItemEditWithQCRef";
import productionService from "../../services/production.service";
toast.configure();

export default function QCFeedbacks() {
  //#region Component Level constants
  const refCustomerCode = useRef(null);
  const refProjectCode = useRef(null);
  const refBatchNo = useRef(null);
  const [customerCodes, setCustomerCodes] = useState([]);
  const [selectedCustomerCode, setSelectedCustomerCode] = useState("");
  const [projectCodes, setProjectCodes] = useState([]);
  const [selectedProjectCode, setSelectedProjectCode] = useState("");
  const [isBatchExist, setIsBatchExist] = useState(true);
  const [batchNos, setBatchNos] = useState([]);
  const [selectedBatchNo, setSelectedBatchNo] = useState("");
  const [projectScope, setProjectScope] = useState("");
  const [qcFeedbacksItemsList, setQCFeedbacksItemsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  //#endregion

  //#region useEffect Hook
  useEffect(() => {
    const user = helper.getUser();
    if (!user) {
      this.props.history.push({ pathname: "/" });
      return;
    }

    fetchCustomerCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region set Height
  const setHeight = (value) => {
    return { height: `${value}%` };
  };
  //#endregion

  //#region Fetch Customer Codes
  const fetchCustomerCodes = () => {
    setSpinnerMessage("Please wait while fetching Customer Codes...");
    setIsLoading(true);
    QCService.getMovedToQCCustomerCodes()
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.QCCustomerCodes)
        ) {
          setCustomerCodes(response.data.QCCustomerCodes);
        } else {
          setCustomerCodes([]);
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Change Customer Code
  const onChangeCustomerCode = (e) => {
    setSelectedCustomerCode(e.target.value);
    setIsBatchExist(true);
    setBatchNos([]);
    setProjectScope("");
    setQCFeedbacksItemsList([]);
    fetchProjectCodesOfCustomer(e.target.value);
  };
  //#endregion

  //#region Fetch Project Codes Of Customer
  const fetchProjectCodesOfCustomer = (customerCode) => {
    if (!customerCode) {
      setProjectCodes([]);
      setSelectedProjectCode("");
      return;
    }

    setSpinnerMessage("Please wait while fetching Project Codes...");
    setIsLoading(true);
    QCService.getMovedToQCProjectCodes(customerCode)
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.QCProjectCodes)
        ) {
          setProjectCodes(response.data.QCProjectCodes);
        } else {
          setProjectCodes([]);
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Change Project Code
  const onChangeProjectCode = (e) => {
    setSelectedProjectCode(e.target.value);
    setProjectScope("");
    setQCFeedbacksItemsList([]);
    fetchBatchNosOfProject(selectedCustomerCode, e.target.value);
    fetchProjectScope(selectedCustomerCode, e.target.value);
  };
  //#endregion

  //#region Fetch Batch Nos. of Project
  const fetchBatchNosOfProject = (customerCode, projectCode) => {
    if (!customerCode || !projectCode) {
      setBatchNos([]);
      setSelectedBatchNo("");
      setIsBatchExist(false);
      return;
    }

    setSpinnerMessage("Please wait while fetching Batch Nos...");
    setIsLoading(true);
    QCService.getMovedToQCBatchNosOfProject(customerCode, projectCode)
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.QCBatchNos)
        ) {
          setBatchNos(response.data.QCBatchNos);
          setIsBatchExist(true);
        } else {
          setIsBatchExist(false);
          setBatchNos([]);
          fetchProductionRejectedItemsList(customerCode, projectCode, "");
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Change Batch No.
  const onChangeBatchNo = (e) => {
    setSelectedBatchNo(e.target.value);
    fetchProductionRejectedItemsList(
      selectedCustomerCode,
      selectedProjectCode,
      e.target.value
    );
  };
  //#endregion

  //#region Fetch Project Scope.
  const fetchProjectScope = (customerCode, projectCode) => {
    productionAllocationService
      .getProjectDetails(customerCode, projectCode, null)
      .then((response) => {
        setProjectScope(response.data.Scope);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Production Rejected Items (QC Feedbacks)
  const fetchProductionRejectedItemsList = (
    customerCode,
    projectCode,
    batchNo
  ) => {
    setIsLoading(true);
    setSpinnerMessage("Please wait while fetching Rejected Items List...");

    productionAllocationService
      .getProductionRejectedProjectItems(
        helper.getUser(),
        customerCode,
        projectCode,
        batchNo
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          setQCFeedbacksItemsList(response.data);
          if (response.data.length === 0) {
            setQCFeedbacksItemsList([]);
            toast.error("No data found", { autoClose: true });
          }
        } else {
          setQCFeedbacksItemsList([]);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Handle Edit Item
  const handleEditItem = (QCItemID, ProductionItemID) => {
    let selectedProdItemIDs = {
      CustomerCode: selectedCustomerCode,
      ProjectCode: selectedProjectCode,
      BatchNo: selectedBatchNo,
      QCItemID: QCItemID,
      ProductionItemID: ProductionItemID,
    };

    sessionStorage.setItem(
      "selectedProdItemIDs",
      JSON.stringify(selectedProdItemIDs)
    );

    setShowEditModal(true);
  };
  //#endregion

  //#region Hide Edit Modal
  const hideEditModal = () => {
    setShowEditModal(false);
    fetchProductionRejectedItemsList(
      selectedCustomerCode,
      selectedProjectCode,
      selectedBatchNo
    );
  };
  //#endregion

  //#region QC Feedback Items Col Defs
  const qcFeedbackItemsColDefs = [
    {
      accessorKey: "UniqueID",
      header: "Unique ID",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 120,
    },
    {
      accessorKey: "ShortDescription",
      header: "Short Description",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
        sx: {
          whiteSpace: "normal", // allow text to wrap
          wordBreak: "break-word", // break long words
          maxWidth: "800px", // or any desired limit
        },
      },
      size: 200,
    },
    {
      accessorKey: "LongDescription",
      header: "Long Description",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
        sx: {
          whiteSpace: "normal", // allow text to wrap
          wordBreak: "break-word", // break long words
          maxWidth: "400px", // or any desired limit
        },
      },
      size: 400,
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
      accessorKey: "Edit",
      header: "Edit",
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      enableColumnFilterModes: false,
      enableSorting: false,
      size: 10,
      enableColumnActions: false,
      Cell: ({ row }) =>
        row.original.IsMovedToQC === "No" ? (
          <IconButton
            onClick={() =>
              handleEditItem(
                row.original.QCItemID,
                row.original.ProductionItemID
              )
            }
            sx={{ color: "#5B47FB" }}
          >
            <i class="fas fa-edit"></i>
          </IconButton>
        ) : null,
    },
    {
      accessorKey: "Status",
      header: "Production Status",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 100,
    },
    {
      accessorKey: "IsMovedToQC",
      header: "Is Moved To QC",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 130,
    },
    {
      accessorKey: "QCStatus",
      header: "QC Status",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 100,
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
      accessorKey: "NewShortDescription",
      header: "New Short Description",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
        sx: {
          whiteSpace: "normal", // allow text to wrap
          wordBreak: "break-word", // break long words
          maxWidth: "400px", // or any desired limit
        },
      },
      size: 400,
    },
    {
      accessorKey: "NewLongDescription",
      header: "New Long Description",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
        sx: {
          whiteSpace: "normal", // allow text to wrap
          wordBreak: "break-word", // break long words
          maxWidth: "800px", // or any desired limit
        },
      },
      size: 800,
    },
    {
      accessorKey: "MFRName",
      header: "MFR Name",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
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
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
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
      accessorKey: "MFRName1",
      header: "MFR Name1",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 120,
    },
    {
      accessorKey: "MFRPN1",
      header: "MFR PN1",
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
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 120,
    },
    {
      accessorKey: "MFRPN2",
      header: "MFR PN2",
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
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 120,
    },
    {
      accessorKey: "MFRPN3",
      header: "MFR PN3",
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
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 120,
    },
    {
      accessorKey: "VendorPN1",
      header: "Vendor PN1",
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
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 120,
    },
    {
      accessorKey: "VendorPN2",
      header: "Vendor PN2",
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
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 120,
    },
    {
      accessorKey: "VendorPN3",
      header: "Vendor PN3",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 100,
    },
    {
      accessorKey: "AdditionalInfoFromWeb",
      header: "Additional Info From Web",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
        sx: {
          whiteSpace: "normal", // allow text to wrap
          wordBreak: "break-word", // break long words
          maxWidth: "400px", // or any desired limit
        },
      },
      size: 400,
    },
    {
      accessorKey: "AdditionalInfo",
      header: "Additional Info From Input",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
        sx: {
          whiteSpace: "normal", // allow text to wrap
          wordBreak: "break-word", // break long words
          maxWidth: "400px", // or any desired limit
        },
      },
      size: 400,
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
      size: 120,
    },
    {
      accessorKey: "UNSPSCCategory",
      header: "UNSPSC Category",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 200,
    },
    {
      accessorKey: "WebRefURL1",
      header: "Web Ref URL1",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 200,
    },
    {
      accessorKey: "WebRefURL2",
      header: "Web Ref URL2",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 200,
    },
    {
      accessorKey: "WebRefURL3",
      header: "Web Ref URL3",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 200,
    },
    {
      accessorKey: "PDFURL",
      header: "PDF URL",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 200,
    },
    {
      accessorKey: "Remarks",
      header: "Remarks",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 400,
    },
    {
      accessorKey: "Query",
      header: "Query",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      size: 200,
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
      size: 130,
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
      header: "Green Items (Yes / Not Applicable)",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 130,
    },
  ];
  //#endregion

  //#region Export Production Rejected Items List To Excel
  const exportProductionRejectedItemsListToExcel = () => {
    const user = helper.getUser();
    let selectedRefCustomerCode = refCustomerCode.current.value;
    let selectedRefProjectCode = refProjectCode.current.value;
    let selectedRefBatchNo = "";

    if (refBatchNo.current) selectedRefBatchNo = refBatchNo.current.value;

    setSpinnerMessage(
      "Please wait while exporting Production Rejected Items List to excel..."
    );
    setIsLoading(true);

    let fileName;

    if (selectedRefBatchNo) {
      fileName =
        "Production Rejected Items List " +
        selectedRefCustomerCode +
        "-" +
        selectedRefProjectCode +
        "-" +
        selectedRefBatchNo +
        "-" +
        user +
        ".xlsx";
    } else {
      fileName =
        "Production Rejected Items List " +
        selectedRefCustomerCode +
        "-" +
        selectedRefProjectCode +
        "-" +
        user +
        ".xlsx";
    }

    productionService
      .exportProductionRejectedItemsListToExcel(
        user,
        selectedRefCustomerCode,
        selectedRefProjectCode,
        selectedRefBatchNo
      )
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region main return
  return (
    <div>
      {showEditModal && (
        <GOPProdItemEditWithQCRef
          showEditModal={showEditModal}
          hideEditModal={hideEditModal}
        />
      )}
      <Row className="mg-l-30 mg-r-15">
        <Col lg={12} style={{ maxWidth: "100%" }}>
          <div style={setHeight(6)} className="production-update-header">
            <h4 style={{ marginBottom: "0", fontSize: "18px" }}>
              QC Feedbacks
            </h4>
          </div>
          <br />
          <div className="row reportIncidentSelectText">
            <div className="col-md-2">
              <FloatingLabel
                label="Customer Code"
                className="float-hidden float-select"
              >
                <select
                  className="form-control"
                  tabIndex="1"
                  id="customerCode"
                  name="customerCode"
                  value={selectedCustomerCode}
                  onChange={onChangeCustomerCode}
                  ref={refCustomerCode}
                >
                  <option value="">---Select Customer Code---</option>
                  {customerCodes.map((c) => (
                    <option key={c.CustomerCode} value={c.CustomerCode}>
                      {c.CustomerCode}
                    </option>
                  ))}
                </select>
              </FloatingLabel>
            </div>
            <div className="col-md-2">
              <FloatingLabel
                label="Project Code"
                className="float-hidden float-select"
              >
                <select
                  className="form-control"
                  tabIndex="1"
                  id="projectCode"
                  name="projectCode"
                  value={selectedProjectCode}
                  onChange={onChangeProjectCode}
                  ref={refProjectCode}
                >
                  <option value="">---Select Project Code---</option>
                  {projectCodes.map((pc) => (
                    <option key={pc.ProjectCode} value={pc.ProjectCode}>
                      {pc.ProjectCode}
                    </option>
                  ))}
                </select>
              </FloatingLabel>
            </div>
            <div className="col-md-2">
              {isBatchExist ? (
                <FloatingLabel
                  label="Batch No."
                  className="float-hidden float-select"
                >
                  <select
                    className="form-control"
                    tabIndex="1"
                    id="batchNo"
                    name="batchNo"
                    value={selectedBatchNo}
                    onChange={onChangeBatchNo}
                    ref={refBatchNo}
                  >
                    <option value="">---Select Batch No.---</option>
                    {batchNos.map((bn) => (
                      <option key={bn.BatchNo} value={bn.BatchNo}>
                        {bn.BatchNo}
                      </option>
                    ))}
                  </select>
                </FloatingLabel>
              ) : (
                <FloatingLabel
                  label="Batch No."
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    style={{ textAlign: "center" }}
                    value="N / A"
                    readOnly
                  />
                </FloatingLabel>
              )}
            </div>
            <div className="col-md-3">
              <FloatingLabel
                label="Scope"
                className="float-hidden float-select"
              >
                <input
                  type="text"
                  className="form-control"
                  value={projectScope || ""}
                  readOnly
                />
              </FloatingLabel>
            </div>
            <div className="col-md-2">
              <FloatingLabel
                label="Production User"
                className="float-hidden float-select"
              >
                <input
                  type="text"
                  className="form-control"
                  style={{ textAlign: "center", fontSize: "16px" }}
                  value={helper.getUser() || ""}
                  readOnly
                />
              </FloatingLabel>
            </div>
          </div>
          <div>
            <div style={{ paddingTop: "10px" }}>
              <LoadingOverlay
                active={isLoading}
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
                      {spinnerMessage}
                    </p>
                  </div>
                }
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="masters-material-table usersListTable">
                      <MaterialReactTable
                        columns={qcFeedbackItemsColDefs}
                        data={qcFeedbacksItemsList}
                        enablePagination={false}
                        initialState={{ density: "compact" }}
                        enableStickyHeader
                        enableColumnResizing
                        muiTableBodyRowProps={({ row }) => ({
                          sx: {
                            backgroundColor:
                              row.index % 2 === 0 ? "white" : "#f5f5f5", // or any color
                          },
                        })}
                        localization={{
                          noRecordsToDisplay: "",
                        }}
                        renderTopToolbarCustomActions={() => (
                          <Box sx={{ display: "flex" }}>
                            <Tooltip title="Export Excel">
                              <IconButton
                                onClick={
                                  exportProductionRejectedItemsListToExcel
                                }
                              >
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
                  </div>
                </div>
              </LoadingOverlay>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
  //#endregion
}
