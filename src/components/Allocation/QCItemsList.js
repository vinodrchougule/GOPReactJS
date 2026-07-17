import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import "./QCItemsList.scss";
import GOPQCEditScreen from "./GOPQCEditScreen";
import QCService from "../../services/QC.service";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
toast.configure();

export default function QCItemsList() {
  //#region Component Level constants
  const currentPageRef = useRef(1); // start at page 1
  const refCustomerCode = useRef(null);
  const refProjectCode = useRef(null);
  const refBatchNo = useRef(null);
  const [projectScope, setProjectScope] = useState("");
  const [totalCountOfItems, setTotalCountOfItems] = useState("");
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [qcItemsList, setQCItemsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerCodes, setcustomerCodes] = useState([]);
  const [selectedCustomerCode, setSelectedCustomerCode] = useState("");
  const [projectCodes, setProjectCodes] = useState([]);
  const [selectedProjectCode, setSelectedProjectCode] = useState("");
  const [batchNos, setBatchNos] = useState([]);
  const [selectedBatchNo, setSelectedBatchNo] = useState("");
  const [isBatchExist, setIsBatchExist] = useState(true);
  const [nounModifiersList, setNounModifiersList] = useState([]);
  const [noun, setNoun] = useState("");
  const [modifier, setModifier] = useState("");
  const [isNMListMinimized, setIsNMListMinimized] = useState(false);
  const [nmTableWidth, setNMTableWidth] = useState();
  const [itemTableWidth, setItemTableWidth] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  //const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRowCount, setTotalRowCount] = useState(0);
  //#endregion

  //#region useEffect Hook
  useEffect(() => {
    setPageSize(100);
    fetchCustomerCodes();
    setWidthOfBothTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Set width of both tables
  const setWidthOfBothTables = () => {
    const screenWidth = window.innerWidth;

    setNMTableWidth(300);
    switch (screenWidth) {
      case 1920:
        setItemTableWidth(screenWidth * 0.7718);
        return;
      case 1680:
        setItemTableWidth(screenWidth * 0.7559);
        return;
      case 1600:
        setItemTableWidth(screenWidth * 0.7437);
        return;
      case 1440:
        setItemTableWidth(screenWidth * 0.7291);
        return;
      case 1400:
        setItemTableWidth(screenWidth * 0.7214);
        return;
      case 1366:
        setItemTableWidth(screenWidth * 0.7174);
        return;
      case 1360:
        setItemTableWidth(screenWidth * 0.7174);
        return;
      case 1280:
        setItemTableWidth(screenWidth * 0.7031);
        return;
      case 1152:
        setItemTableWidth(screenWidth * 0.677);
        return;
      case 1024:
        setItemTableWidth(screenWidth * 0.6347);
        return;
      default:
        setItemTableWidth(screenWidth * 0.535);
        return;
    }
  };
  //#endregion

  //#region set Height
  const setHeight = (value) => {
    return { height: `${value}%` };
  };
  //#endregion

  //#region Noun-Modifier Col Definitions
  const nmColDefs = [
    {
      accessorKey: "NounModifier",
      header: "Noun / Modifier",
      minSize: 100, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 140, //medium column
    },
    {
      accessorKey: "CountOfNMItems",
      header: "Count of Items",
      minSize: 100, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 80, //medium column
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ];
  //#endregion

  //#region Handle Edit Item
  const handleEditItem = (QCItemID, ProductionItemID) => {
    setShowEditModal(true);
    let selectedQCItemIDs = {
      CustomerCode: selectedCustomerCode,
      ProjectCode: selectedProjectCode,
      BatchNo: selectedBatchNo,
      QCItemID: QCItemID,
      ProductionItemID: ProductionItemID,
    };

    sessionStorage.setItem(
      "selectedQCItemIDs",
      JSON.stringify(selectedQCItemIDs)
    );
  };
  //#endregion

  //#region QC Items List Col Definitions
  const qcItemsListColDefs = [
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
      accessorKey: "Edit",
      header: "Edit",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      enableColumnFilterModes: false,
      enableSorting: false,
      size: 10,
      enableColumnActions: false,
      Cell: ({ row }) =>
        row.original.IsQCEditable ? (
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
      accessorKey: "QCTestNo",
      header: "QC Test No.",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 110,
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
      accessorKey: "ProductionUser",
      header: "Production User",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 130,
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
      accessorKey: "QCLevel",
      header: "Level",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      size: 100,
    },
  ];
  //#endregion

  //#region Fetch Customer Codes
  const fetchCustomerCodes = () => {
    setSpinnerMessage("Please wait while loading Customer Codes...");
    setIsLoading(true);
    QCService.getMovedToQCCustomerCodes()
      .then((response) => {
        if (
          response.data.Success === 1 &&
          Array.isArray(response.data.QCCustomerCodes)
        ) {
          setcustomerCodes(response.data.QCCustomerCodes);
        } else {
          setcustomerCodes([]);
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Project Codes Of Customer
  const fetchProjectCodesOfCustomer = (customerCode) => {
    if (!customerCode) {
      setProjectCodes([]);
      setSelectedProjectCode("");
      return;
    }

    setSpinnerMessage("Please wait while loading Project Codes...");
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

  //#region Fetch Batch Nos. of Project
  const fetchBatchNosOfProject = (customerCode, projectCode) => {
    if (!customerCode || !projectCode) {
      setBatchNos([]);
      setSelectedBatchNo("");
      setIsBatchExist(false);
      fetchNounModifiersList();
      return;
    }

    setSpinnerMessage("Please wait while loading Batch Nos...");
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
          fetchNounModifiersList();
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
    setTotalCountOfItems("");
    setNounModifiersList([]);
    setQCItemsList([]);
    fetchProjectCodesOfCustomer(e.target.value);
  };
  //#endregion

  //#region On Change Project Code
  const onChangeProjectCode = (e) => {
    setSelectedProjectCode(e.target.value);
    setProjectScope("");
    setTotalCountOfItems("");
    setNounModifiersList([]);
    setQCItemsList([]);
    fetchBatchNosOfProject(selectedCustomerCode, e.target.value);
  };
  //#endregion

  //#region On Change Batch No.
  const onChangeBatchNo = (e) => {
    setSelectedBatchNo(e.target.value);
    setNounModifiersList([]);
    fetchNounModifiersList();
  };
  //#endregion

  //#region Fetch Noun/Modifiers List
  const fetchNounModifiersList = () => {
    let selectedRefCustomerCode = refCustomerCode.current.value;
    let selectedRefProjectCode = refProjectCode.current.value;
    let selectedRefBatchNo = "";

    if (refBatchNo.current) selectedRefBatchNo = refBatchNo.current.value;

    setIsLoading(true);
    setSpinnerMessage("Please wait while fetching Noun / Modifiers List...");
    QCService.getMovedToQCNounModifiers(
      selectedRefCustomerCode,
      selectedRefProjectCode,
      selectedRefBatchNo
    )
      .then((response) => {
        const { data } = response;

        if (data.Success === 1 && Array.isArray(data.NounModifiers)) {
          setProjectScope(data.ProjectScope);
          setTotalCountOfItems(data.TotalCountOfItems);
          setNounModifiersList([]);
          setNounModifiersList(data.NounModifiers); //vinod
          fetchItemsList(
            selectedRefCustomerCode,
            selectedRefProjectCode,
            selectedRefBatchNo,
            "",
            "",
            1,
            () => {
              setIsLoading(false); // hide spinner only after both APIs complete
            }
          );
        } else {
          setProjectScope("");
          setTotalCountOfItems("");
          setNounModifiersList([]);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Items List
  const fetchItemsList = (
    customerCode,
    projectCode,
    batchNo,
    noun,
    modifier,
    pageNo
  ) => {
    setIsLoading(true);
    setSpinnerMessage("Please wait while fetching Items List...");

    setTimeout(() => {
      QCService.getMovedToQCProjectItems(
        customerCode,
        projectCode,
        batchNo,
        noun,
        modifier,
        pageNo,
        pageSize
      )
        .then((response) => {
          const data = response.data;
          setQCItemsList(data);
          let totalRowCount = data.length > 0 ? data[0].TotalRowsCount : 0;
          setTotalPages(Math.ceil(totalRowCount / pageSize));
          setTotalRowCount(totalRowCount);
          // if (
          //   response.data.Success === 1 &&
          //   Array.isArray(response.data.ItemsList)
          // ) {
          //   setQCItemsList(response.data.ItemsList);
          // } else {
          //   setQCItemsList([]);
          // }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          toast.error(e.response.data.Message, { autoClose: false });
        });
    });
  };
  //#endregion

  //#region Export Moved To QC Noun / Modifers List To Excel
  const exportMovedToQCNounModifersListToExcel = () => {
    let selectedRefCustomerCode = refCustomerCode.current.value;
    let selectedRefProjectCode = refProjectCode.current.value;
    let selectedRefBatchNo = "";

    if (refBatchNo.current) selectedRefBatchNo = refBatchNo.current.value;

    setSpinnerMessage(
      "Please wait while exporting Moved To QC Noun / Modifers List to excel..."
    );
    setIsLoading(true);

    let fileName = "Moved To QC Noun-Modifers List.xlsx";

    QCService.exportMovedToQCNounModifiersListToExcel(
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

  //#region Export Moved To QC Items List To Excel
  const exportMovedToQCItemsListToExcel = () => {
    let selectedRefCustomerCode = refCustomerCode.current.value;
    let selectedRefProjectCode = refProjectCode.current.value;
    let selectedRefBatchNo = "";

    if (refBatchNo.current) selectedRefBatchNo = refBatchNo.current.value;

    setSpinnerMessage(
      "Please wait while exporting Moved To QC Items List to excel..."
    );
    setIsLoading(true);

    let fileName = "Moved To QC Items List.xlsx";

    QCService.exportMovedToQCItemsListToExcel(
      selectedRefCustomerCode,
      selectedRefProjectCode,
      selectedRefBatchNo,
      noun,
      modifier
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

  //#region fetch Moved To QC Items of This Noun / Modifier
  const fetchMovedToQCItemsOfThisNM = (nounModifier) => {
    const nounModifierArray = nounModifier.split("/");
    const noun = nounModifierArray[0].trim();
    const modifier = nounModifierArray[1].trim();
    setNoun(noun);
    setModifier(modifier);

    let selectedRefCustomerCode = refCustomerCode.current.value;
    let selectedRefProjectCode = refProjectCode.current.value;
    let selectedRefBatchNo = "";

    if (refBatchNo.current) selectedRefBatchNo = refBatchNo.current.value;

    fetchItemsList(
      selectedRefCustomerCode,
      selectedRefProjectCode,
      selectedRefBatchNo,
      noun,
      modifier,
      1
    );
  };
  //#endregion

  //#region Handle change width of NM and Items List tables
  const handleChangeWidth = () => {
    const screenWidth = window.innerWidth;

    if (isNMListMinimized) {
      // Set widths for expanded NM list
      // setNMTableWidth(screenWidth * 0.2); // 20% of screen width
      // setItemTableWidth(screenWidth * 0.7); // 70% of screen width
      setWidthOfBothTables();
    } else {
      // Set widths for minimized NM list
      setNMTableWidth(screenWidth * 0.03); // 3% of screen width
      setItemTableWidth(screenWidth * 0.88); // 88% of screen width
    }

    setIsNMListMinimized(!isNMListMinimized);
  };
  //#endregion

  //#region Refresh Noun / Modifiers List and QC Items List
  const refreshNMAndItemsList = () => {
    setRowSelection({});
    setNoun("");
    setModifier("");
    setNounModifiersList([]);
    fetchNounModifiersList();
  };
  //#endregion

  //#region Reload page
  const reloadPage = () => {
    setcustomerCodes([]);
    setProjectCodes([]);
    setBatchNos([]);
    setIsBatchExist(true);
    setProjectScope("");
    setTotalCountOfItems("");
    setNounModifiersList([]);
    setQCItemsList([]);
    setSelectedCustomerCode("");
    setSelectedProjectCode("");
    setSelectedBatchNo("");
    setNoun("");
    setModifier("");
    setRowSelection({});
    setIsNMListMinimized(false);
    fetchCustomerCodes();
  };
  //#endregion

  //#region Hide Edit Modal
  const hideEditModal = () => {
    setShowEditModal(false);
    fetchMovedToQCItemsOfThisNM(noun + "/" + modifier);
  };
  //#endregion

  // //#region on Page Change
  // const onPageChange = (e) => {
  //   if (e.target.value) {
  //     //setCurrentPage(e.target.value);
  //     if (+e.target.value === 0 || Number(e.target.value) > totalPages) {
  //       toast.warning("Please enter valid page number");
  //       return;
  //     }
  //     fetchItemsList(
  //       selectedCustomerCode,
  //       selectedProjectCode,
  //       selectedBatchNo,
  //       noun,
  //       modifier,
  //       e.target.value,
  //       () => {
  //         setIsLoading(false);
  //       }
  //     );
  //   }
  // };
  // //#endregion

  //#region handle Pagination
  const handlePagination = (val) => {
    if (val) {
      //setCurrentPage(val);
      currentPageRef.current = val; // ✅ update the input value
      setIsLoading(true); // Optional: if you want to show loader
      fetchItemsList(
        selectedCustomerCode,
        selectedProjectCode,
        selectedBatchNo,
        noun,
        modifier,
        val,
        () => {
          setIsLoading(false);
        }
      );
    }
  };
  //#endregion

  //#region main return
  return (
    <div>
      {showEditModal && (
        <GOPQCEditScreen
          showEditModal={showEditModal}
          hideEditModal={hideEditModal}
        />
      )}
      <Row className="mg-l-30 mg-r-15">
        <Col lg={12} style={{ maxWidth: "100%" }}>
          <div style={setHeight(6)} className="production-update-header">
            <h4 style={{ marginBottom: "0", fontSize: "18px" }}>
              QC Items List
            </h4>
          </div>
          <br />
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
                  label="Total Count of Items"
                  className="float-hidden float-select"
                >
                  <input
                    type="text"
                    className="form-control"
                    style={{ textAlign: "center" }}
                    value={totalCountOfItems || ""}
                    readOnly
                  />
                </FloatingLabel>
              </div>
              <div className="col-md-1">
                <Button
                  variant="secondary"
                  className="vewsubmit-button"
                  style={{ width: "75px" }}
                  onClick={reloadPage}
                >
                  <i class="fa fa-refresh mr-1"></i>Refresh
                </Button>
              </div>
            </div>
            <div>
              <div style={{ paddingTop: "10px" }}>
                <div className="row">
                  <div
                    style={{
                      width: `${nmTableWidth}px`,
                      marginLeft: "13px",
                    }}
                  >
                    <div>
                      <MaterialReactTable
                        columns={nmColDefs}
                        data={nounModifiersList}
                        enableRowSelection={true}
                        enablePagination={false} // ✅ disables pagination
                        enableRowVirtualization // ✅ good for large datasets
                        enableMultiRowSelection={false}
                        enableToolbarAlertBanner={false} // ✅ Fully disables selection alert
                        state={{ rowSelection }}
                        onRowSelectionChange={setRowSelection}
                        displayColumnDefOptions={{
                          "mrt-row-select": {
                            size: 0,
                            header: () => null,
                            Cell: () => null,
                          },
                        }}
                        muiTableBodyRowProps={({ row }) => ({
                          onClick: () => {
                            setRowSelection({ [row.id]: true });
                            fetchMovedToQCItemsOfThisNM(
                              row.original.NounModifier
                            );
                          },
                          style: {
                            cursor: "pointer",
                            backgroundColor: rowSelection[row.id]
                              ? "#e0f7fa"
                              : "transparent",
                          },
                        })}
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
                        muiTopToolbarProps={{
                          sx: {
                            ".MuiAlert-message": {
                              display: "none",
                            },
                          },
                        }}
                        enableStickyHeader
                        initialState={{ density: "compact" }}
                        localization={{ noRecordsToDisplay: "" }}
                        renderTopToolbarCustomActions={() => (
                          <Box sx={{ display: "flex" }}>
                            {isNMListMinimized ? (
                              <div
                                className="circle-arrow"
                                style={{ marginTop: "5px" }}
                                onClick={handleChangeWidth}
                              >
                                <FiArrowRightCircle />
                              </div>
                            ) : (
                              <div
                                className="circle-arrow"
                                style={{ marginTop: "5px" }}
                                onClick={handleChangeWidth}
                              >
                                <FiArrowLeftCircle />
                              </div>
                            )}
                            <Tooltip title="Export Excel">
                              <IconButton
                                onClick={exportMovedToQCNounModifersListToExcel}
                              >
                                <FaFileExcel
                                  style={{
                                    color: "rgba(0, 0, 0, 0.54)",
                                    fontSize: "1.3rem",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Refresh">
                              <IconButton onClick={refreshNMAndItemsList}>
                                <i className="fas fa-sync"></i>
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      width: `${itemTableWidth}px`,
                      marginLeft: "13px",
                    }}
                  >
                    <div>
                      <MaterialReactTable
                        columns={qcItemsListColDefs}
                        data={qcItemsList}
                        initialState={{
                          density: "compact",
                          pagination: {
                            pageSize: pageSize, // ✅ Set initial page size to 100
                          },
                        }}
                        enableColumnResizing
                        //enablePagination={false}
                        // enableColumnVirtualization={true}
                        enableRowVirtualization={true}
                        muiTableBodyRowProps={({ row }) => ({
                          sx: {
                            backgroundColor:
                              row.index % 2 === 0 ? "white" : "#f5f5f5", // or any color
                          },
                        })}
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
                        enableStickyHeader
                        localization={{
                          noRecordsToDisplay: "",
                        }}
                        renderTopToolbarCustomActions={() => (
                          <Box sx={{ display: "flex" }}>
                            <Tooltip title="Export Excel">
                              <IconButton
                                onClick={exportMovedToQCItemsListToExcel}
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
                            onClick={() => handlePagination(1)}
                          />
                          <img
                            src="../../../Icons/left-arrow.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() =>
                              handlePagination(
                                currentPageRef.current === 1
                                  ? ""
                                  : currentPageRef.current - 1
                              )
                            }
                          />

                          <div className="pagination-search">Page:</div>
                          <div className="pagination-search">
                            <input
                              type="text"
                              value={currentPageRef.current}
                              className="unspsc-page-input"
                              onChange={(e) => {
                                const val = parseInt(e.target.value, pageSize);
                                if (!isNaN(val) && val > 0) {
                                  currentPageRef.current = val;
                                }
                              }}
                              onBlur={() => {
                                handlePagination(currentPageRef.current);
                              }}
                            />
                          </div>
                          <div className="pagination-search">
                            of {qcItemsList.length === 0 ? 1 : totalPages}
                          </div>
                          <img
                            src="../../../Icons/right-arrow.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() =>
                              handlePagination(
                                currentPageRef.current === totalPages
                                  ? ""
                                  : currentPageRef.current + 1
                              )
                            }
                          />
                          <img
                            src="../../../Icons/step-forward.png"
                            className="pagination-icon"
                            alt=""
                            onClick={() => handlePagination(totalPages)}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-end"
                        style={{ width: "100%" }}
                      >
                        Total SKUs: &nbsp;
                        <b>{totalRowCount}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LoadingOverlay>
        </Col>
      </Row>
    </div>
  );
  //#endregion
} //#endregion
