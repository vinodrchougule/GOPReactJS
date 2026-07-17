import React, { useEffect, useState, useRef } from 'react'
import helpers from '../../helpers/helpers';
import accessControlService from '../../services/accessControl.service';
import { toast } from 'react-toastify';
import customerService from '../../services/customer.service';
import { Link, useHistory } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { CSVLink } from "react-csv";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { FaFileExcel } from "react-icons/fa";
import { mkConfig, generateCsv } from 'export-to-csv';
import { useCallback } from 'react';
import { darken, lighten, useTheme } from '@mui/material';
toast.configure();

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

function CustomerList() {
  let history = useHistory();
  const tableContainerRef = useRef(null);
  const theme = useTheme();

  //#region Initial State
  const [initStates, setInitStates] = useState({
    customers: [],
    loading: false,
    spinnerMessage: "",
    index: 30,
    position: 0,
    columns: [],
    filtervalue: ""
  })
  //#endregion
  
  const [canAccessCreateCustomer, setCanAccessCreateCustomer] = useState(false)
  const [canAccessViewCustomer, setCanAccessViewCustomer] = useState(false)

  const csvLink = useRef(null);

  //#region Use effect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    canUserAccessPage("Create Customer");
    canUserAccessPage("View Customer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  //#region fetching customers from Web API
  const fetchCustomers = () => {
    setInitStates((prevStates) => ({
      ...prevStates,
      spinnerMessage: "Please wait while loading Customer List...",
      loading: true
    }));

    customerService
      .getAllCustomers(helpers.getUser())
      .then((response) => {
        let formattedArray = response.data;
        formattedArray = formattedArray.map((obj) => {
          delete obj.UserID;
          return obj;
        });
        setInitStates((prevStates) => ({
          ...prevStates,
          customers: formattedArray,
          loading: false
        }));
      })
      .catch((e) => {
        setInitStates((prevStates) => ({
          ...prevStates,
          loading: false
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region fetching Customer page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helpers.getUser(), pageName)
      .then((response) => {
        if (pageName === "Create Customer") {
          setCanAccessCreateCustomer(response.data);
        } else if (pageName === "View Customer") {
          setCanAccessViewCustomer(response.data);
        }

        fetchCustomers();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Redirect to Add Customer Page
  const moveToAddCustomer = () => {
    history.push("/Masters/AddCustomer");
  }
  //#endregion

  //#region Export Customers List to Excel
  const exportCustomerListToExcel = () => {
    setInitStates((prevStates) => ({
      ...prevStates,
      spinnerMessage: "Please wait while exporting Customer List to excel...",
      loading: true
    }));

    let fileName = "Customers List.xlsx";
    customerService
      .exportCustomersListToExcel()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setInitStates((prevStates) => ({
          ...prevStates,
          loading: false
        }));
      })
      .catch((e) => {
        setInitStates((prevStates) => ({
          ...prevStates,
          loading: false
        }));
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Scroll to Top
  const scrollToTop = () => {
    tableContainerRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  //#endregion

  let data = [];
  if (initStates?.customers.length !== 0) {
    data = initStates?.customers
  }

  const fetchMoreOnBottomReached = useCallback(
    (event) => {
      if (event) {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        var currentHeight = scrollTop;
        var maxScrollPosition = scrollHeight - clientHeight;

        setInitStates((prevStates) => ({
          ...prevStates,
          position: currentHeight
        }));

        if ((currentHeight / maxScrollPosition) * 100 > 90) {
          let curIndex = initStates.index + 20;
          setInitStates((prevStates) => ({
            ...prevStates,
            index: curIndex
          }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const baseBackgroundColor =
    theme.palette.mode === 'dark'
      ? '#f4f6f8'
      : 'rgba(255, 255, 255, 255)';

  //#region Table Data
  const columns = useMemo(
    () => [
      {
        accessorKey: "CustomerID",
        header: "Customer ID",
        columnFilterModeOptions: [
          "between",
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "notEquals",
        ],
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "CustomerCode",
        header: "Customer Code",
        textAlign: "center",
        columnFilterModeOptions: [
          "fuzzy",
          "contains",
          "startsWith",
          "endsWith",
          "notEmpty",
          "empty",
        ],
        Cell: ({ row }) => (
          <div>
            {canAccessViewCustomer ? (
              <Link
                to={{
                  pathname: "/Masters/ViewCustomer",
                  state: row.original.CustomerID,
                }}
              >
                {row.original.CustomerCode}
              </Link>
            ) : (
              <div>{row.original.CustomerCode}</div>
            )}
          </div>
        ),
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NoOfProjects",
        header: "No. Of Projects",
        columnFilterModeOptions: [
          "between",
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "notEquals",
        ],
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "InputCount",
        header: "Input Count",
        columnFilterModeOptions: [
          "between",
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "notEquals",
        ],
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [canAccessViewCustomer]
  );
  //#endregion

  //#region Transformed Project Sub Activity Data CSV For Export
  const getTransformedCustomerListDataForExport = () => {
    return columns.map((row) => ({
      "Customer ID": row.CustomerID,
      "Customer Code": row.CustomerCode,
      "No Of Projects": row.NoOfProjects,
      "Input Count": row.InputCount,
    }));
  };
  //#endregion

  //#region Export Data
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.download = 'Customers List.csv';
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  //#endregion

  //#region Material React Table Data
  const table = useMaterialReactTable({
    data,
    columns,
    enableColumnFilterModes: true,
    initialState: { density: 'compact' },
    enableColumnOrdering: false,
    enableRowSelection: false,
    enablePagination: false,
    enableStickyHeader: true,
    enableRowNumbers: true,
    rowNumberDisplayMode: 'static',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Tooltip title="Export CSV">
          <IconButton onClick={handleExportData}>
            <FileDownloadIcon style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.5rem" }} />
          </IconButton>
        </Tooltip>
        <CSVLink data={getTransformedCustomerListDataForExport()} filename="Customer List.csv" ref={csvLink} />
        <Tooltip title="Export Excel">
          <IconButton onClick={exportCustomerListToExcel}>
            <FaFileExcel style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }} />
          </IconButton>
        </Tooltip>

      </Box>
    ),
    muiTablePaperProps: {
      className: "customer-table-paper"
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
        border: '1px solid #eee',
        backgroundColor: "#f2f8fb"
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid #eee',
      },
    },
  });
  //#endregion

  //#region Return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initStates.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader css={helpers.getcss()} color={"#38D643"} width={"350px"} height={"10px"} speedMultiplier={0.3} />
            <p style={{ color: "black", marginTop: "5px" }}>
              {initStates.spinnerMessage}
            </p>
          </div>
        }
      >
        <div style={{ height: "100%", position: "relative", paddingLeft: "10px" }}>
          <div className="az-content-breadcrumb">
            <span>Master</span>
            <span>Customers</span>
          </div>
          <h4 className="d-flex align-items-center">
            Customers List{" "}
            {canAccessCreateCustomer && (
              <span className="icon-size">
                <i className="fa fa-plus text-primary pointer mg-l-5" onClick={moveToAddCustomer} title="Add New Customer"></i>
              </span>
            )}
          </h4>
          <ToolkitProvider
            keyField="CustomerID"
          >
            {(props) => (
              <div className="mg-t-10">

                <div
                  style={{
                    borderBottom: "1px solid #cdd4e0",
                  }}
                  className="masters-material-table"
                >
                  <MaterialReactTable className="custom-material-table" table={table}
                  />
                </div>
              </div>
            )}
          </ToolkitProvider>
          {initStates.position > 600 && (
            <div className='scroll-top-div' style={{ textAlign: "end" }}>
              <button className="scroll-top" onClick={scrollToTop} title="Go To Top">
                <div className="arrow up"></div>
              </button>
            </div>
          )}
        </div>
      </LoadingOverlay>
    </div>
  )
  //#endregion
}

export default CustomerList
