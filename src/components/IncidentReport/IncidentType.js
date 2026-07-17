import React, { useState, useEffect, useRef } from "react";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { CSVLink } from "react-csv";
import "../IncidentReport/IncidentType.scss";
import incidentTypeService from "../../services/incidentType.service";
import RegisterIncident from "./RegisterIncident";
import IncidentReport from "./IncidentReport";
import IncidentReportDashboard from "./IncidentReportDashboard";
import { useHistory, useLocation } from "react-router-dom";
import { FaFileExcel } from "react-icons/fa";

toast.configure();

function IncidentType(props) {
  const [activeTab, setActiveTab] = useState("incidentType");
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [incidentTypeData, setIncidentTypeData] = useState([]);
  const csvLink = useRef(null);
  const history = useHistory();
  const location = useLocation();

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchAllIncidentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  //#endregion

  //#region Tab toggle
  const toggle = (tab) => {
    setActiveTab(tab);
    if (
      tab === "incidentReport" ||
      tab === "registerIncident" ||
      tab === "incidentReportDashboard"
    ) {
      history.push("/IncidentReportMenu");
    }
  };
  //#endregion

  //#region Fetch All Incident Types Data
  const fetchAllIncidentTypes = () => {
    setLoading(true);
    incidentTypeService
      .ReadAllIncidentTypes(helper.getUser(), false)
      .then((response) => {
        if (response.data.Success === 1) {
          const incidentTypesWithSlNo = response.data.IncidentTypes.map(
            (item, index) => ({
              ...item,
              SlNo: index + 1,
            })
          );
          setIncidentTypeData(incidentTypesWithSlNo);
        } else {
          setIncidentTypeData([]);
        }
      })
      .catch(() => {
        //toast.error("Failed to fetch incident types.");
      })
      .finally(() => setLoading(false));
  };
  //#endregion

  //#region Incident Type Table columns and data
  const incidentTypeColumns = [
    {
      accessorKey: "SlNo",
      header: "Sl No.",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "IncidentTypeID",
      header: "Incident Type ID",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "IncidentType",
      header: "Incident Type",
      muiTableHeadCellProps: { align: "center", style: { width: "100%" } },
      muiTableBodyCellProps: { align: "left" },
      Cell: ({ row }) => {
        const { IncidentTypeID, IncidentType } = row.original;
        return (
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => navigateToView(IncidentTypeID)}
          >
            {IncidentType}
          </span>
        );
      },
    },
    {
      accessorKey: "IsActive",
      header: "Is Active",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => (row.original.IsActive ? "Yes" : "No"),
    },
  ];
  //#endregion

  //#region Export Incident Type List to Excel
  const exportIncidentTypeList = () => {
    setSpinnerMessage(
      "Please wait while exporting incident type list to excel..."
    );
    setLoading(true);
    let fileName = "Incident Type List.xlsx";
    incidentTypeService
      .exportIncidentTypeListToExcel()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Navigate to View Incident Type
  const navigateToView = (IncidentTypeID) => {
    history.push({
      pathname: "/ViewIncidentType",
      search: `?IncidentTypeID=${IncidentTypeID}`,
    });
  };
  //#endregion

  //#region Handle Incident Type CSV Export
  const handleIncidentTypeCSVExport = () => {
    if (csvLink.current) {
      csvLink.current.link.click();
    }
  };
  //#endregion

  //#region Get transformed Incident Type Data for CSV export
  const getTransformedIncidentTypeDataForExport = () => incidentTypeData;
  //#endregion

  //#region Navigate Add Incident Type Page
  const moveToCreateIncidentType = () => {
    history.push("/AddIncidentType");
  };
  //#endregion

  //#region return
  return (
    <div className="incidentTypeListMain">
      <LoadingOverlay
        active={loading}
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
            <p style={{ color: "black", marginTop: "5px" }}>{spinnerMessage}</p>
          </div>
        }
      >
        <div className="incidentTypeList">
          <Tab.Container
            id="left-tabs-example"
            activeKey={activeTab}
            onSelect={toggle}
          >
            <div
              className="row"
              style={{ marginRight: "15px", marginTop: "0px" }}
            >
              <div>
                <Nav
                  variant="pills"
                  className="mg-l-40 mg-b-10 mg-t-10"
                  style={{ cursor: "pointer" }}
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="incidentReportDashboard"
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Incident Report Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="registerIncident"
                      onClick={() => toggle(2, "registerIncident")}
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Register Incident
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="incidentReport"
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Incident Report
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="incidentType"
                      style={{ border: "1px solid #5E41FC" }}
                    >
                      Incident Type
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
              <div className="d-flex justify-content-end"></div>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="incidentReportDashboard">
                <IncidentReportDashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="registerIncident">
                <RegisterIncident />
              </Tab.Pane>
              <Tab.Pane eventKey="incidentReport">
                <IncidentReport />
              </Tab.Pane>
              <Tab.Pane eventKey="incidentType">
                <div
                  className="incidentTypeMainContent"
                  style={{ height: "100%", position: "relative" }}
                >
                  <Row className="mg-t-5 mg-l-25 mg-r-15">
                    <div className="incidentTypeMainContent">
                      <h4>
                        Incident Types List{" "}
                        <span className="icon-size mg-l-5">
                          <i
                            className="fa fa-plus text-primary pointer"
                            onClick={moveToCreateIncidentType}
                            title="Create Incident Type"
                          ></i>
                        </span>
                      </h4>
                    </div>
                  </Row>
                  <Row className="mg-t-5 mg-l-10 mg-r-15">
                    <Col lg={12} style={{ maxWidth: "100%" }}>
                      <div
                        style={{ border: "1px solid #cdd4e0" }}
                        className="mg-l-0 mg-r-0 mg-t-0 incidentTypeMainText"
                      >
                        <div className="col-md-12 pd-t-10 pd-b-10 ">
                          <div className="mg-t-0">
                            <div className="masters-material-table incidentTypeTable">
                              <MaterialReactTable
                                data={incidentTypeData}
                                columns={incidentTypeColumns}
                                muiPaginationProps={{
                                  color: "primary",
                                  shape: "rounded",
                                  showRowsPerPage: false,
                                  variant: "outlined",
                                  sx: {
                                    "& .MuiPaginationItem-root": {
                                      borderColor: "#5B47FB",
                                    },
                                    "& .Mui-selected": {
                                      backgroundColor: "#5B47FB",
                                      color: "white",
                                    },
                                    "& .MuiPaginationItem-ellipsis": {
                                      borderColor: "#5B47FB",
                                    },
                                    marginTop: "16px",
                                  },
                                }}
                                paginationDisplayMode="pages"
                                enableColumnFilterModes={false}
                                enableColumnOrdering={false}
                                enableStickyHeader={true}
                                enableDensityToggle={true}
                                enableGlobalFilter={true}
                                enableRowSelection={false}
                                initialState={{
                                  density: "compact",
                                  pagination: { pageIndex: 0, pageSize: 100 },
                                }}
                                renderTopToolbarCustomActions={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "16px",
                                      padding: "8px",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <Tooltip title="Download CSV">
                                      <IconButton
                                        onClick={handleIncidentTypeCSVExport}
                                      >
                                        <FileDownloadIcon
                                          style={{
                                            color: "rgba(0, 0, 0, 0.54)",
                                          }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                    <CSVLink
                                      data={getTransformedIncidentTypeDataForExport()}
                                      headers={[
                                        { label: "Sl No.", key: "SlNo" },
                                        {
                                          label: "IncidentType ID",
                                          key: "IncidentTypeID",
                                        },
                                        {
                                          label: "Incident Type",
                                          key: "IncidentType",
                                        },
                                        { label: "Is Active", key: "IsActive" },
                                      ]}
                                      filename="Incident Type Data List.csv"
                                      ref={csvLink}
                                      target="_blank"
                                      style={{ display: "none" }}
                                    />
                                    <Tooltip title="Export Excel">
                                      <IconButton
                                        onClick={exportIncidentTypeList}
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
                      </div>
                    </Col>
                  </Row>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default IncidentType;
