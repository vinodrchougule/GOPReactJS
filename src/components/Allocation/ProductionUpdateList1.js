import React, { useEffect, useState, useRef } from "react";
import helpers from "../../helpers/helpers";
import accessControlService from "../../services/accessControl.service";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv } from "export-to-csv";
import { useCallback } from "react";
import { darken, lighten, useTheme } from "@mui/material";
import productionAllocationTemplateService from "../../services/productionAllocationTemplate.service";
import { Col, Row } from "react-bootstrap";
import GOPEditScreen from "./GOPEditScreen";
import productionTemplateService from "../../services/productionTemplate.service";
import GOPPreviewScreen from "./GOPPreviewScreen";
toast.configure();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

function ProductionUpdateList1() {
  const user = helpers.getUser();
  let history = useHistory();
  const tableContainerRef = useRef(null);
  const theme = useTheme();

  const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));

  const [initStates, setInitStates] = useState({
    loading: false,
    modalLoading: false,
    spinnerMessage: "",
    customers: [],
    customerCodeExpanded: [],
    selectedCustomerCode: state?.CustomerCode,
    projectCodes: [],
    projectCodeExpanded: [],
    selectedProjectCode: state?.ProjectCode,
    batches: [],
    selectedBatchNo: state?.batchNo,
    disableViewExistingProductionAllocation: true,
    customerCode: state?.CustomerCode,
    projectCode: state?.ProjectCode,
    batchNo: state?.batchNo,
    scope: state?.scope,
    allocationId: state?.AllocationId,
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
    rowData: [],
    projectSettings: {},
    selectedStatus: { rowId: "", status: "" },
    selectedLevel: { rowId: "", level: "" },
    isStatusUpdating: false,
    editModal: false,
    viewScreenData: {},
    previewModal: false,
  });

  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("Production Download-Upload");
    fetchDynamicAGGridData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#region fetching customers from Web API
  const fetchDynamicAGGridData = () => {
    const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
    setInitStates((prevStates) => ({
      ...prevStates,
      spinnerMessage: "Please wait while loading Customer List...",
      loading: true,
    }));

    productionAllocationTemplateService
      .ProductionItemDetailsOfProductionUserFromAllocation(
        state?.CustomerCode,
        state?.ProjectCode,
        state?.AllocationId,
        helpers.getUser(),
        state?.batchNo
      )
      .then((resp) => {
        const updatedData = resp.data.map((item) => ({
          ...item,
          [item.CustomColumnName1]: item.CustomColumnName1Value,
          [item.CustomColumnName2]: item.CustomColumnName2Value,
          [item.CustomColumnName3]: item.CustomColumnName3Value,
        }));
        setInitStates((prevStates) => ({
          ...prevStates,
          dynamicColumnBody: updatedData,
          modalLoading: false,
          loading: false,
          rowData: updatedData,
        }));
      })
      .catch((e) => {
        setInitStates((prevStates) => ({
          ...prevStates,
          modalLoading: false,
          loading: false,
        }));
        // toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Customer page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helpers.getUser(), pageName)
      .then((response) => {
        this.setState({
          canAccessProductionDownloadOrUpload: response.data,
        });
        if (!response.data) {
          toast.error("Access Denied");
        }
      })
      .catch((e) => {
        // toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Scroll to Top
  const scrollToTop = () => {
    tableContainerRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  //#endregion
  //#endregion

  let data = [];
  if (initStates?.dynamicColumnBody.length !== 0) {
    data = initStates?.dynamicColumnBody;
  }

  const fetchMoreOnBottomReached = useCallback(
    (event) => {
      if (event) {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        var currentHeight = scrollTop;
        var maxScrollPosition = scrollHeight - clientHeight;

        setInitStates((prevStates) => ({
          ...prevStates,
          position: currentHeight,
        }));

        if ((currentHeight / maxScrollPosition) * 100 > 90) {
          let curIndex = initStates.index + 20;
          setInitStates((prevStates) => ({
            ...prevStates,
            index: curIndex,
          }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [editCell, setEditCell] = useState(null);

  // const displayEditField = (cell, row, isEditing) => {
  //   return isEditing ? (
  //     <input
  //       type="text"
  //       defaultValue={cell.getValue()}
  //       onBlur={(e) => {
  //         const updatedData = [...data];
  //         updatedData[row.index][cell.column.id] = e.target.value;
  //         console.log(updatedData[row.index])
  //         setInitStates((prevState) => ({...prevState, dynamicColumnBody : updatedData}));
  //         handleSaveEditData(updatedData[row.index])
  //         setEditCell(null);
  //       }}
  //       autoFocus
  //     />
  //   ) : (
  //     <div onDoubleClick={() => setEditRowData(cell)}>
  //       {cell.getValue()}
  //     </div>
  //   );
  // }

  const setEditRowData = (cell) => {
    setEditCell({
      id: cell.row.original.ProductionItemID,
      accessorKey: cell.column.id,
    });
  };

  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#f4f6f8" : "rgba(255, 255, 255, 255)";

  const columns = useMemo(() => {
    let initialColumns = [
      // {
      //   accessorKey: "ProductionAllocationID",
      //   header: "Production Allocation ID",
      // },
      // {
      //   accessorKey: "ProductionItemID",
      //   header: "Production Item ID",
      // },
      {
        accessorKey: "UniqueID",
        header: "Unique ID",
        cellClass: "dynamic-readOnly-field dynamic-readOnly-id fixed-column",
        Cell: ({ row }) => (
          <div>
            <Button className="uniqueid-btn" onClick={() => onCellClicked(row)}>
              {row.original.UniqueID}
            </Button>
          </div>
        ),
        muiTableHeadCellProps: {
          align: "center",
          sx: {
            backgroundColor: "#f2f8fb",
            border: "1px solid #eee",
            minWidth: 140,
            maxWidth: 140,
          },
        },
        muiTableBodyCellProps: {
          align: "center",
          sx: {
            border: "1px solid #eee",
            minWidth: 140,
            maxWidth: 140,
          },
        },
      },
      {
        id: "actions",
        header: "Edit",
        cellClass: "actions fixed-column",
        Cell: ({ row }) => {
          return (
            <div>
              <Button className="action-btn" onClick={() => handleEdit(row)}>
                <i className="fa fa-edit"></i>
              </Button>
            </div>
          );
        },
        disableFilters: true,
        muiTableHeadCellProps: {
          align: "center",
          sx: {
            backgroundColor: "#f2f8fb",
            maxWidth: 100,
            minWidth: 60,
            border: "1px solid #eee",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
          sx: {
            border: "1px solid #eee",
            maxWidth: 100,
            minWidth: 60,
          },
        },
      },
      {
        accessorKey: "Status",
        header: "Status",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: (props) => {
          const { cell, row } = props;
          const isEditing =
            editCell?.id === row.original.ProductionItemID &&
            editCell?.accessorKey === cell.column.id;
          return isEditing ? (
            <div>
              <select
                className="form-control"
                tabIndex="1"
                id="department"
                name="status"
                placeholder="--Select--"
                value={cell.getValue()}
                onChange={(e) =>
                  handleStatusValueChanged(
                    row.original.ProductionItemID,
                    "Status",
                    e.target.value
                  )
                }
                onBlur={(e) => {
                  const updatedData = [...data];
                  updatedData[row.index][cell.column.id] = e.target.value;
                  updatedData[row.index]["Level"] = "";
                  setInitStates((prevState) => ({
                    ...prevState,
                    dynamicColumnBody: updatedData,
                  }));
                  handleSaveEditData(updatedData[row.index]);
                  setEditCell(null);
                }}
              >
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
                <option value="Query">Query</option>
              </select>
            </div>
          ) : (
            <div
              onDoubleClick={() => setEditRowData(cell)}
              style={{
                minHeight: "24px", // Ensure the div is interactable even if empty
                padding: "4px",
                cursor: "pointer", // Visual cue for interactability
              }}
            >
              {cell.getValue() || (
                <span style={{ color: "#ccc" }}>Double-click to edit</span>
              )}
            </div>
          );
        },
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
        Cell: (props) => {
          const { cell, row } = props;
          const isEditing =
            editCell?.id === row.original.ProductionItemID &&
            editCell?.accessorKey === cell.column.id;
          return isEditing && row.original.Status !== "In Process" ? (
            <div>
              <select
                className="form-control"
                tabIndex="1"
                id="department"
                name="status"
                placeholder="--Select--"
                value={cell.getValue()}
                onChange={(e) =>
                  handleStatusValueChanged(
                    row.original.ProductionItemID,
                    "Level",
                    e.target.value
                  )
                }
                onBlur={(e) => {
                  const updatedData = [...data];
                  updatedData[row.index][cell.column.id] = e.target.value;
                  setInitStates((prevState) => ({
                    ...prevState,
                    dynamicColumnBody: updatedData,
                  }));
                  handleSaveEditData(updatedData[row.index]);
                  setEditCell(null);
                }}
              >
                <option value="C">Cleansed</option>
                <option value="E">Enriched</option>
                {row.original.Status === "Query" && (
                  <option value="X">Exception</option>
                )}
              </select>
            </div>
          ) : (
            <div
              onDoubleClick={() => setEditRowData(cell)}
              style={{
                minHeight: "24px", // Ensure the div is interactable even if empty
                padding: "4px",
                cursor: "pointer", // Visual cue for interactability
              }}
            >
              {cell.getValue() || <span style={{ color: "#ccc" }}></span>}
            </div>
          );
        },
      },
      {
        accessorKey: "ShortDescription",
        header: "Short Description",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "LongDescription",
        header: "Long Description",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "UOM",
        header: "UOM",
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // }
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NewShortDescription",
        header: "New Short Description",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NewLongDescription",
        header: "New Long Description",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "MFRName",
        header: "MFR Name",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "MFRPN",
        header: "MFR PN",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "VendorName",
        header: "Vendor Name",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "VendorPN",
        header: "Vendor PN",
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "CustomColumnName1Value",
        header: `${
          initStates.dynamicColumnBody.length !== 0 &&
          initStates.dynamicColumnBody[0].CustomColumnName1
        }`,
        muiTableHeadCellProps: {
          align: "center",

          sx: {
            backgroundColor: "#f2f8fb",
            maxWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName1
                ? 200
                : 2,
            minWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName1
                ? 200
                : 2,
          },
        },
        muiTableBodyCellProps: {
          align: "center",
          sx: {
            maxWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName1
                ? 200
                : 2,
            minWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName1
                ? 200
                : 2,
          },
        },
      },
      {
        accessorKey: "CustomColumnName2Value",
        header: `${
          initStates.dynamicColumnBody.length !== 0 &&
          initStates.dynamicColumnBody[0].CustomColumnName2
        }`,
        muiTableHeadCellProps: {
          align: "center",
          sx: {
            backgroundColor: "#f2f8fb",
            maxWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName2
                ? 200
                : 2,
            minWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName2
                ? 200
                : 2,
          },
        },
        muiTableBodyCellProps: {
          align: "center",
          sx: {
            maxWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName2
                ? 200
                : 2,
            minWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName2
                ? 200
                : 2,
          },
        },
      },
      {
        accessorKey: "CustomColumnName3Value",
        header: `${
          initStates.dynamicColumnBody.length !== 0 &&
          initStates.dynamicColumnBody[0].CustomColumnName3
        }`,
        muiTableHeadCellProps: {
          align: "center",
          backgroundColor: "#f2f8fb",
          sx: {
            maxWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName3
                ? 200
                : 2,
            minWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName3
                ? 200
                : 2,
          },
        },
        muiTableBodyCellProps: {
          align: "center",
          sx: {
            maxWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName3
                ? 200
                : 2,
            minWidth:
              initStates.dynamicColumnBody.length !== 0 &&
              initStates.dynamicColumnBody[0].CustomColumnName3
                ? 200
                : 2,
          },
        },
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
      },
      {
        accessorKey: "MFRName1",
        header: "MFR Name 1",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "MFRPN1",
        header: "MFR PN 1",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "MFRName2",
        header: "MFR Name 2",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "MFRPN2",
        header: "MFR PN 2",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "MFRName3",
        header: "MFR Name 3",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "MFRPN3",
        header: "MFR PN 3",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "VendorName1",
        header: "Vendor Name 1",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "VendorPN1",
        header: "Vendor PN 1",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "VendorName2",
        header: "Vendor Name 2",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "VendorPN2",
        header: "Vendor PN 2",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "VendorName3",
        header: "Vendor Name 3",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "VendorPN3",
        header: "Vendor PN 3",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "AdditionalInfoFromWeb",
        header: "Additional Info From Web",
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
        muiTableHeadCellProps: {
          align: "center",
          sx: {
            backgroundColor: "#f2f8fb",
            minWidth: 300,
            border: "1px solid #eee",
          },
        },
        muiTableBodyCellProps: {
          sx: {
            minWidth: 300,
            overflow: "hidden",
            border: "1px solid #eee",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "AdditionalInfo",
        header: "Additional Info From Input",
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
        muiTableHeadCellProps: {
          align: "center",
          sx: {
            backgroundColor: "#f2f8fb",
            minWidth: 300,
            border: "1px solid #eee",
          },
        },
        muiTableBodyCellProps: {
          sx: {
            minWidth: 300,
            border: "1px solid #eee",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
      },
      {
        accessorKey: "UNSPSCCode",
        header: "UNSPSC Code",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "UNSPSCCategory",
        header: "UNSPSC Category",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "WebRefURL1",
        header: "URL 1",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "WebRefURL2",
        header: "URL 2",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "WebRefURL3",
        header: "URL 3",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "PDFURL",
        header: "PDF URL",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
        minWidth: 160,
      },
      {
        accessorKey: "Remarks",
        header: "Remarks",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      {
        accessorKey: "Query",
        header: "Query",
        muiTableHeadCellProps: {
          align: "center",
        },
        // Cell: (props) => {
        //   const { cell, row } = props;
        //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
        //   return displayEditField(cell, row, isEditing)

        // },
      },
      // {
      //   accessorKey: "AttributeName1",
      //   header: "Attribute Name1",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue1",
      //   header: "Attribute Value1",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName2",
      //   header: "Attribute Name2",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue2",
      //   header: "Attribute Value2",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName3",
      //   header: "Attribute Name3",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue3",
      //   header: "Attribute Value3",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName4",
      //   header: "Attribute Name4",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue4",
      //   header: "Attribute Value4",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName5",
      //   header: "Attribute Name5",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue5",
      //   header: "Attribute Value5",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName6",
      //   header: "Attribute Name6",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue6",
      //   header: "Attribute Value6",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName7",
      //   header: "Attribute Name7",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue7",
      //   header: "Attribute Value7",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName8",
      //   header: "Attribute Name8",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue8",
      //   header: "Attribute Value8",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName9",
      //   header: "Attribute Name9",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue9",
      //   header: "Attribute Value9",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName10",
      //   header: "Attribute Name10",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue10",
      //   header: "Attribute Value10",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName11",
      //   header: "Attribute Name11",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue11",
      //   header: "Attribute Value11",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName12",
      //   header: "Attribute Name12",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue12",
      //   header: "Attribute Value12",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName13",
      //   header: "Attribute Name13",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue13",
      //   header: "Attribute Value13",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName14",
      //   header: "Attribute Name14",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue14",
      //   header: "Attribute Value14",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName15",
      //   header: "Attribute Name15",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue15",
      //   header: "Attribute Value15",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName16",
      //   header: "Attribute Name16",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue16",
      //   header: "Attribute Value16",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName17",
      //   header: "Attribute Name17",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue17",
      //   header: "Attribute Value17",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName18",
      //   header: "Attribute Name18",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue18",
      //   header: "Attribute Value18",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName19",
      //   header: "Attribute Name19",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue19",
      //   header: "Attribute Value19",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName20",
      //   header: "Attribute Name20",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue20",
      //   header: "Attribute Value20",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName21",
      //   header: "Attribute Name21",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue21",
      //   header: "Attribute Value21",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName22",
      //   header: "Attribute Name22",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue22",
      //   header: "Attribute Value22",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName23",
      //   header: "Attribute Name23",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue23",
      //   header: "Attribute Value23",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName24",
      //   header: "Attribute Name24",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue24",
      //   header: "Attribute Value24",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName25",
      //   header: "Attribute Name25",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue25",
      //   header: "Attribute Value25",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // }
      // },
      // {
      //   accessorKey: "AttributeName26",
      //   header: "Attribute Name26",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue26",
      //   header: "Attribute Value26",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName27",
      //   header: "Attribute Name27",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue27",
      //   header: "Attribute Value27",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName28",
      //   header: "Attribute Name28",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue28",
      //   header: "Attribute Value28",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName29",
      //   header: "Attribute Name29",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue29",
      //   header: "Attribute Value29",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName30",
      //   header: "Attribute Name30",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue30",
      //   header: "Attribute Value30",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName31",
      //   header: "Attribute Name31",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue31",
      //   header: "Attribute Value31",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName32",
      //   header: "Attribute Name32",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue32",
      //   header: "Attribute Value32",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName33",
      //   header: "Attribute Name33",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue33",
      //   header: "Attribute Value33",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName34",
      //   header: "Attribute Name34",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue34",
      //   header: "Attribute Value34",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName35",
      //   header: "Attribute Name35",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue35",
      //   header: "Attribute Value35",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName36",
      //   header: "Attribute Name36",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue36",
      //   header: "Attribute Value36",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName37",
      //   header: "Attribute Name37",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue37",
      //   header: "Attribute Value37",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName38",
      //   header: "Attribute Name38",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue38",
      //   header: "Attribute Value38",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName39",
      //   header: "Attribute Name39",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue39",
      //   header: "Attribute Value39",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName40",
      //   header: "Attribute Name40",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue40",
      //   header: "Attribute Value40",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName41",
      //   header: "Attribute Name41",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue41",
      //   header: "Attribute Value41",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName42",
      //   header: "Attribute Name42",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue42",
      //   header: "Attribute Value42",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName43",
      //   header: "Attribute Name43",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue43",
      //   header: "Attribute Value43",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName44",
      //   header: "Attribute Name44",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue44",
      //   header: "Attribute Value44",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName45",
      //   header: "Attribute Name45",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue45",
      //   header: "Attribute Value45",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName46",
      //   header: "Attribute Name46",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue46",
      //   header: "Attribute Value46",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName47",
      //   header: "Attribute Name47",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue47",
      //   header: "Attribute Value47",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName48",
      //   header: "Attribute Name48",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue48",
      //   header: "Attribute Value48",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName49",
      //   header: "Attribute Name49",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue49",
      //   header: "Attribute Value49",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
      // {
      //   accessorKey: "AttributeName50",
      //   header: "Attribute Name50",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      // },
      // {
      //   accessorKey: "AttributeValue50",
      //   header: "Attribute Value50",
      //   muiTableHeadCellProps: {
      //     align: "center",
      //   },
      //   // Cell: (props) => {
      //   //   const { cell, row } = props;
      //   //   const isEditing = editCell?.id === row.original.ProductionItemID && editCell?.accessorKey === cell.column.id;
      //   //   return displayEditField(cell, row, isEditing)

      //   // },
      // },
    ];

    return initialColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editCell, initStates]);

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.download = "Customers List.csv";
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const table = useMaterialReactTable({
    data,
    columns,
    enableColumnFilterModes: true,
    initialState: { density: "compact" },
    enableColumnOrdering: false,
    enableRowSelection: false,
    enablePagination: false,
    enableStickyHeader: true,
    enableRowNumbers: true,
    rowNumberDisplayMode: "static",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={handleExportData}
          startIcon={<FileDownloadIcon title="Export to CSV" />}
        ></Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={downloadAllProductionItems}
          startIcon={
            <i
              className="fas fa-file-excel mg-l-10 pointer"
              style={{ color: "green" }}
              title="Export to Excel"
            ></i>
          }
        ></Button>
      </Box>
    ),
    muiTablePaperProps: {
      className: "customer-table-paper list-custom-table",
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      className: "customer-table-body",
      onScroll: (event) => fetchMoreOnBottomReached(event),
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: "rgba(244, 246, 248, 1)",
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: lighten(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
      }),
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid #eee",
        backgroundColor: "#f2f8fb",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid #eee",
      },
    },
  });

  const setHeight = (value) => {
    return { height: `${value}%` };
  };

  const handleEdit = (row) => {
    const user = helpers.getUser();
    const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
    let editScreen = {
      CustomerCode: state?.CustomerCode,
      ProjectCode: state?.ProjectCode,
      batchNo: state?.batchNo,
      ProductionItemID: row.original.ProductionItemID,
      NextProductionItemID: "",
      PreviousProductionItemID: "",
      AllocationId: state?.AllocationId,
      productionUser: user,
    };
    sessionStorage.setItem("ProdItemData", JSON.stringify(editScreen));
    setInitStates((prevStates) => ({ ...prevStates, editModal: true }));
  };

  const onCellClicked = (row) => {
    const state = JSON.parse(sessionStorage.getItem("prodUpdateData"));
    let viewScreen = {};
    productionAllocationTemplateService
      .ProductionItemDetails(row.original.ProductionItemID)
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
                `${item.AttributeName}:${item.AttributeValue}`
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
          vendorPN1: { label: resp.data.VendorPN1, value: resp.data.VendorPN1 },
          vendorName2: {
            label: resp.data.VendorName2,
            value: resp.data.VendorName2,
          },
          vendorPN2: { label: resp.data.VendorPN2, value: resp.data.VendorPN2 },
          vendorName3: {
            label: resp.data.VendorName3,
            value: resp.data.VendorName3,
          },
          vendorPN3: { label: resp.data.VendorPN3, value: resp.data.VendorPN3 },
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

        setInitStates((prevStates) => ({
          ...prevStates,
          previewModal: true,
          viewScreenData: viewScreen,
        }));
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  };

  const handleStatusValueChanged = useCallback(
    (rowId, columnId, newValue) => {
      setInitStates((prevState) => {
        const rowIndex = prevState.dynamicColumnBody.findIndex(
          (row) => row.ProductionItemID === rowId
        );

        if (rowIndex > -1) {
          const newDynamicColumnBody = [...prevState.dynamicColumnBody];
          if (columnId === "Status") {
            newDynamicColumnBody[rowIndex] = {
              ...newDynamicColumnBody[rowIndex],
              [columnId]: newValue,
              Level: "",
            };
          } else {
            newDynamicColumnBody[rowIndex] = {
              ...newDynamicColumnBody[rowIndex],
              [columnId]: newValue,
            };
          }

          return {
            ...prevState,
            dynamicColumnBody: newDynamicColumnBody,
          };
        }

        return prevState;
      });
    },
    [
      /* dependencies */
    ]
  );

  // const handleRowInputs = (rowId, columnId, newValue) => {
  //   setInitStates(prevState => {
  //     const rowIndex = prevState.dynamicColumnBody.findIndex(row => row.ProductionItemID === rowId);

  //     if (rowIndex > -1) {
  //       const newDynamicColumnBody = [...prevState.dynamicColumnBody];
  //       newDynamicColumnBody[rowIndex] = {
  //         ...newDynamicColumnBody[rowIndex],
  //         [columnId]: newValue,
  //       };

  //       return {
  //         ...prevState,
  //         dynamicColumnBody: newDynamicColumnBody,
  //       };
  //     }

  //     return prevState;
  //   });
  // };

  const removeObjectAttributes = (obj) => {
    const filteredObject = Object.keys(obj).reduce((acc, key) => {
      if (
        !key.startsWith("AttributeName") &&
        !key.startsWith("AttributeValue") &&
        key !== ""
      ) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});

    return filteredObject;
  };

  //#region Save GOP Screen Data
  const handleSaveEditData = useCallback((rowData) => {
    
    if (
      (rowData.Status === "Completed" || rowData.Status === "Query") &&
      rowData.Level === ""
    ) {
      toast.error("Please select level...!");
      return;
    }

    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    const newAttributes = [];

    for (let i = 1; i <= 50; i++) {
      const attributeNameKey = `AttributeName${i}`;
      const attributeValueKey = `AttributeValue${i}`;

      if (rowData[attributeNameKey] || rowData[attributeValueKey]) {
        const attributeName = rowData[attributeNameKey];
        const attributeValue = rowData[attributeValueKey];

        newAttributes.push({
          AttributeName: attributeName,
          AttributeValue: attributeValue,
        });
      }
    }
    const newData = removeObjectAttributes(rowData);

    newData.ItemAttributes = newAttributes;
    newData.userID = helpers.getUser();
    newData.UserID = helpers.getUser();

    productionTemplateService
      .productionItemUpdate(newData)
      .then(() => {
        fetchDynamicAGGridData();
        // toast.success("Row Data Saved Successfully...!");
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  const hideEdiModal = () => {
    fetchDynamicAGGridData();
    setInitStates((prevState) => ({ ...prevState, editModal: false }));
  };

  const hidePreviewModal = () => {
    setInitStates((prevState) => ({ ...prevState, previewModal: false }));
  };

  //#region fetching Batch Nos. of Selected Project from Web API
  const downloadAllProductionItems = () => {
    setInitStates((prevStates) => ({
      ...prevStates,
      spinnerMessage: "Please wait while downloading all production Items...",
      modalLoading: true,
    }));

    const user = helpers.getUser();
    let sendBatchNo = "";
    let fileName = "";
    if (
      initStates.selectedBatchNo !== undefined &&
      initStates.selectedBatchNo !== ""
    ) {
      sendBatchNo = initStates.selectedBatchNo;
      fileName =
        "ProductionItemDetails_" +
        initStates.customerCode +
        "_" +
        initStates.projectCode +
        "_" +
        initStates.allocationId +
        "_" +
        initStates.batchNo +
        "_" +
        user +
        ".xlsx";
    } else {
      sendBatchNo = "";
      fileName =
        "ProductionItemDetails_" +
        initStates.customerCode +
        "_" +
        initStates.projectCode +
        "_" +
        initStates.allocationId +
        "_" +
        user +
        ".xlsx";
    }

    productionAllocationTemplateService
      .downloadAllProductionItemFiles(
        initStates.customerCode,
        initStates.projectCode,
        initStates.allocationId,
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

        setInitStates((prevStates) => ({
          ...prevStates,
          modalLoading: false,
        }));
      })
      .catch((e) => {
        setInitStates((prevStates) => ({
          ...prevStates,
          modalLoading: false,
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Display navigate to previous page
  const goBackNavigation = () => {
    sessionStorage.removeItem("prodUpdateData");
    history.push({
      pathname: "/Allocation",
    });
  };
  //#endregion

  return (
    <div className="pro-main-display">
      {/* open edit modal */}
      {initStates.editModal && (
        <GOPEditScreen
          showEditModal={initStates.editModal}
          hideEdiModal={hideEdiModal}
        />
      )}
      {/* open edit modal */}
      {/* open preview modal */}
      {initStates.previewModal && (
        <GOPPreviewScreen
          showPreview={initStates.previewModal}
          closePreviewModal={hidePreviewModal}
          stateValue={initStates.viewScreenData}
        />
      )}
      {/* open preview modal */}

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
              {initStates.spinnerMessage}
            </p>
          </div>
        }
      >
        <div
          style={{ height: "100%", position: "relative", paddingLeft: "20px" }}
        >
          <div className="az-content-breadcrumb">
            <span>Project</span>
            <span>List</span>
          </div>
          <Row className="mg-l-30 mg-r-15" style={setHeight(95)}>
            <Col lg={12} style={{ maxWidth: "100%" }}>
              <div style={setHeight(6)} className="production-update-header">
                <h4 style={{ marginBottom: "0", fontSize: "18px" }}>
                  <i
                    className="far fa-arrow-alt-circle-left pointer mb-1"
                    style={{ fontSize: "15px" }}
                    onClick={goBackNavigation}
                  ></i>
                  &nbsp;&nbsp; Production Update List
                </h4>
                {initStates.isStatusUpdating && (
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
                {/* <button
                  className="down-item-link mg-l-15"
                  onClick={downloadAllProductionItems}
                  disabled={!initStates.customerCode}
                >
                  Download Item Details
                </button> */}
              </div>
              <div style={setHeight(94)}>
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
                      {initStates.customerCode}
                    </p>
                  </div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
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
                      {initStates.projectCode}
                    </p>
                  </div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
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
                      {initStates.allocationId}
                    </p>
                  </div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
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
                  &nbsp;&nbsp;&nbsp;&nbsp;
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
                      {initStates.batchNo ? initStates.batchNo : "N/A"}
                    </p>
                  </div>
                  &nbsp;&nbsp;&nbsp;&nbsp;
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
                      className="scopeOverflowProduction m-0"
                      title={initStates.scope}
                    >
                      {initStates.scope}
                    </p>
                  </div>
                </div>
                <div style={{ paddingTop: "10px", ...setHeight(97) }}>
                  <LoadingOverlay
                    active={initStates.modalLoading}
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
                          {initStates.spinnerMessage}
                        </p>
                      </div>
                    }
                  >
                    <div style={setHeight(100)}>
                      <ToolkitProvider keyField="CustomerID">
                        {(props) => (
                          <div className="mg-t-10">
                            <div
                              style={{
                                borderBottom: "1px solid #cdd4e0",
                              }}
                              className="masters-material-table"
                            >
                              <MaterialReactTable
                                className=""
                                table={table}
                                getRowId={(row) => row.id}
                              />
                            </div>
                          </div>
                        )}
                      </ToolkitProvider>
                      {initStates.position > 600 && (
                        <div
                          className="scroll-top-div"
                          style={{ textAlign: "end" }}
                        >
                          <button
                            className="scroll-top"
                            onClick={scrollToTop}
                            title="Go To Top"
                          >
                            <div className="arrow up"></div>
                          </button>
                        </div>
                      )}
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

export default ProductionUpdateList1;
