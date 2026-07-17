import React, { useEffect, useState } from "react";
import "../../home.scss";
import helper from "../../helpers/helpers";
import helpers from "../../helpers/helpers";
import loginService from "../../services/login.service";
import accessControlService from "../../services/accessControl.service";
import dashboardService from "../../services/dashboard.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useHistory } from "react-router-dom";
import projectService from "../../services/project.service";
import ReactApexChart from "react-apexcharts";
import Moment from "moment";
import { Col, Row } from "react-bootstrap";
import "./dashboardstyles.scss";
import UserProfile from "../Profile/UserProfile";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material"; //, IconButton, Tooltip
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { CSVLink } from "react-csv";
toast.configure();

function DashboardDetails(props) {
  const [firstName, setFirstName] = useState("");
  const [canAccessViewProject, setCanAccessViewProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);

  // const csvLink = useRef(null);
  const [activeRowId] = useState(null);
  const [canAccessProjectList] = useState(null);
  const [canAccessCustomerList] = useState(null);
  const [noOfProjects, setNoOfProjects] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    NoOfCustomers: null,
    NoOfProjects: null,
    NoOfOnGoingProjects: null,
    NoOfCompletedProjects: null,
    NoOfPendingProjects: null,
    NoOfCompletedProjectsPercentage: null,
    NoOfPendingProjectsPercentage: null,
    NoOfBatches: null,
    NoOfCompletedBatches: null,
    NoOfPendingBatches: null,
    NoOfCompletedBatchesPercentage: null,
    NoOfPendingBatchesPercentage: null,
    NoOfActiveTasks: null,
    NoOfActiveResources: null,
  });

  const history = useHistory();

  //#region useEffect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    canUserAccessPage("View Project");
    fetchProjects();
    fetchUsername();
    fetchProjectsCompletionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  // #region functions for UserProfile Modal
  const openProfileModal = () => setOpenProfile(true);
  const closeProfileModal = () => setOpenProfile(false);
  // #endregion

  // //#region Dashboard Details Export to CSV
  // const dashboardDetailsDataCSVExport = () => {
  //   csvLink.current.link.click();
  // };
  // //#endregion

  // //#region Transformed Dashboard Details Data CSV For Export
  // const getTransformedDashboardDataForExport = () => {
  //   return projects.map((row, index) => ({
  //     "Sl No.": index + 1,
  //     "Project ID": row.ProjectID,
  //     "Customer Code": row.CustomerCode,
  //     "Project Code": row.ProjectCode,
  //     "Input Count": row.InputCount,
  //     "Production Allocated Count": row.ProductionAllocatedCount,
  //     "Production Completed Count": row.ProductionCompletedCount,
  //     "QC Allocated Count": row.QCAllocatedCount,
  //     "QC Completed Count": row.QCCompletedCount,
  //     Status: row.Status,
  //   }));
  // };
  // //#endregion

  //#region Fetching selected User details
  const fetchUsername = () => {
    setSpinnerMessage("Please wait while fetching logged in user details...");
    setLoading(true);
    const user = helpers.getUser();

    loginService
      .getUsername(user)
      .then((response) => {
        setFirstName(response.data.FirstName);
        setLoading(false);
        fetchDashboardDetails();
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetching Project details
  const fetchProjects = () => {
    setSpinnerMessage("Please wait while loading Project List...");
    setLoading(true);
    const toDate = Moment(new Date()).format("DD-MMM-yyyy");
    const data = {
      CustomerCode: "(All)",
      ProjectCode: "(All)",
      ProjectType: "(All)",
      FromDate: "01-Apr-2011",
      ToDate: toDate,
      UserID: helper.getUser(),
    };

    projectService
      .readOnGoingProjectsList(data)
      .then((response) => {
        const formattedArray = response.data.map((obj) => {
          delete obj.UserID;
          return obj;
        });

        setProjects(formattedArray);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching dashboard details from Web API
  const fetchDashboardDetails = () => {
    setSpinnerMessage("Please wait while fetching dashboard details...");
    setLoading(true);

    dashboardService
      .ReadDashboardDetails()
      .then((response) => {
        setDashboardData({
          NoOfCustomers: response.data.NoOfCustomers,
          NoOfProjects: response.data.NoOfProjects,
          NoOfOnGoingProjects: response.data.NoOfOnGoingProjects,
          NoOfCompletedProjects: response.data.NoOfCompletedProjects,
          NoOfPendingProjects: response.data.NoOfPendingProjects,
          NoOfCompletedProjectsPercentage:
            response.data.NoOfCompletedProjectsPercentage,
          NoOfPendingProjectsPercentage:
            response.data.NoOfPendingProjectsPercentage,
          NoOfBatches: response.data.NoOfBatches,
          NoOfCompletedBatches: response.data.NoOfCompletedBatches,
          NoOfPendingBatches: response.data.NoOfPendingBatches,
          NoOfCompletedBatchesPercentage:
            response.data.NoOfCompletedBatchesPercentage,
          NoOfPendingBatchesPercentage:
            response.data.NoOfPendingBatchesPercentage,
          NoOfActiveTasks: response.data.NoOfActiveTasks,
          NoOfActiveResources: response.data.NoOfActiveResources,
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetch Projects Completion Status
  const fetchProjectsCompletionStatus = () => {
    dashboardService
      .ReadProjectsCompletionStatus()
      .then((response) => {
        setStatus(response.data.map((a) => a.Status));
        setNoOfProjects(response.data.map((a) => a.NoOfProjects));
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Display Duration Details
  const displayDurationDetails = () => history.push("/Dashboard/Duration");
  //#endregion

  //#region Display Active Resources
  const displayActiveResources = () =>
    history.push("/Dashboard/ActiveResources");
  //#endregion

  //#region Display Active Tasks
  const displayActiveTasks = () => history.push("/Dashboard/ActiveTasks");
  //#endregion

  //#region Display Active Projects
  const displayActiveProjects = () => history.push("/Projects");
  //#endregion

  //#region fetching Project page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "View Project") {
          setCanAccessViewProject(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Project List Table Columns
  const projectListColumns = [
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
      accessorKey: "ProjectID",
      header: "Project ID",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      isHidden: true,
    },
    {
      accessorKey: "CustomerCode",
      header: "Customer Code",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "ProjectCode",
      header: "Project Code",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const onClickNavigate = (e) => {
          e.stopPropagation();
          if (canAccessViewProject) {
            props.history.push({
              pathname: "/Projects/ViewProject",
              state: { ProjectID: row.original.ProjectID },
            });
          }
        };

        return (
          <Box className="d-flex justify-content-center">
            <div
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={onClickNavigate}
            >
              {row.getValue("ProjectCode")}
            </div>
          </Box>
        );
      },
    },
    {
      accessorKey: "InputCount",
      header: "Input Count",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "ProductionAllocatedCount",
      header: "Production Allocated",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "ProductionCompletedCount",
      header: "Production Completed",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "QCAllocatedCount",
      header: "QC Allocated",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "QCCompletedCount",
      header: "QC Completed",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ];
  //#endregion

  //#region New Radial Bar Chart
  const RadialBarCharts = {
    series: noOfProjects,
    options: {
      chart: { height: 100, type: "radialBar" },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "40%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: { show: false },
            value: { show: false },
          },
        },
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E"],
      labels: status || [],
      legend: {
        show: true,
        floating: true,
        fontSize: "13px",
        position: "left",
        offsetX: 60,
        offsetY: 15,
        labels: { useSeriesColors: true },
        markers: { size: 0 },
        formatter: (seriesName, opts) =>
          `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`,
        itemMargin: { vertical: 3 },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: { show: false },
          },
        },
      ],
    },
  };
  //#endregion

  //#region return
  return (
    <div
      className="main-data"
      style={{
        height: "100%",
        paddingBottom: "20px",
        overflow: "auto",
        paddingLeft: "0px",
        paddingRight: "0px",
      }}
    >
      {openProfile && (
        <UserProfile
          openProfile={openProfile}
          closeProfileModal={closeProfileModal}
        />
      )}
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
        <div
          className="az-content az-content-dashboard"
          style={{
            height: "100%",
          }}
        >
          <div
            className="container-fluid"
            style={{
              height: "100%",
            }}
          >
            <div
              className="az-content-body"
              style={{
                height: "100%",
              }}
            >
              <Row
                className="row-sm"
                style={{
                  minHeight: "4%",
                }}
              >
                <Col lg={8}>
                  <h2 className="az-dashboard-title">
                    Hi{" "}
                    <span className="user-name" onClick={openProfileModal}>
                      {firstName}
                    </span>
                    , welcome back!
                  </h2>
                </Col>
                <Col lg={4}></Col>
              </Row>
              <div
                className="card-header"
                style={{
                  minHeight: "5%",
                  padding: "4px 0",
                }}
              >
                <h6 className="card-title m-0">Projects Status</h6>
              </div>
              <div className="row row-sm mg-b-20 card-row-section">
                <div className="col-lg-7">
                  <div
                    className="card card-dashboard-one"
                    style={{ height: "100%" }}
                  >
                    <div className="card-body project-cards p-0">
                      <div className="card-body-top">
                        <div className="card-div">
                          <label className="mg-b-0">Projects</label>
                          <h2 className="text-center">
                            {dashboardData.NoOfProjects}
                          </h2>
                        </div>
                        <div className="card-div">
                          <label className="mg-b-0">Completed</label>
                          <h2 className="text-center">
                            {dashboardData.NoOfCompletedProjectsPercentage !==
                              null &&
                              `${dashboardData.NoOfCompletedProjectsPercentage}%`}
                          </h2>
                        </div>
                        <div className="card-div">
                          <label className="mg-b-0">Pending</label>
                          <h2 className="text-center">
                            {dashboardData.NoOfPendingProjectsPercentage !==
                              null &&
                              `${dashboardData.NoOfPendingProjectsPercentage}%`}
                          </h2>
                        </div>
                      </div>
                      <div className="card-body-top">
                        <div className="card-div">
                          <label className="mg-b-0">Batches</label>
                          <h2 className="text-center">
                            {dashboardData.NoOfBatches}
                          </h2>
                        </div>
                        <div className="card-div">
                          <label className="mg-b-0">Completed</label>
                          <h2 className="text-center">
                            {dashboardData.NoOfCompletedBatchesPercentage !==
                              null &&
                              `${dashboardData.NoOfCompletedBatchesPercentage}%`}
                          </h2>
                        </div>
                        <div className="card-div">
                          <label className="mg-b-0">Pending</label>
                          <h2 className="text-center">
                            {dashboardData.NoOfPendingBatchesPercentage !==
                              null &&
                              `${dashboardData.NoOfPendingBatchesPercentage}%`}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 mg-t-20 mg-lg-t-0">
                  <div className="row row-sm p-0" style={{ height: "100%" }}>
                    <div className="col-sm-6 project-data">
                      <Link to="/Projects" className="card-link-div">
                        <div
                          className="card card-dashboard-two pointer"
                          style={{ height: "100%" }}
                        >
                          <div className="card-header">
                            <label>
                              Projects{" "}
                              {canAccessProjectList && (
                                <i
                                  className="fas fa-list"
                                  style={{ color: "blue" }}
                                ></i>
                              )}
                            </label>
                            <h5 className="data-count">
                              {dashboardData.NoOfOnGoingProjects !== null && (
                                <>
                                  {dashboardData.NoOfOnGoingProjects}/
                                  {dashboardData.NoOfProjects}
                                </>
                              )}
                            </h5>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-sm-6 mg-t-20 mg-sm-t-0 costomer-data">
                      <Link to="/Masters/Customers" className="card-link-div">
                        <div
                          className="card card-dashboard-two pointer"
                          style={{ height: "100%" }}
                        >
                          <div className="card-header">
                            <label>
                              Customers{" "}
                              {canAccessCustomerList && (
                                <i
                                  className="fas fa-list"
                                  style={{ color: "blue" }}
                                ></i>
                              )}
                            </label>
                            <h5 className="data-count">
                              {dashboardData.NoOfCustomers}
                            </h5>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row row-sm mg-b-20 main-table-div">
                <div className="col-lg-7" style={{ height: "100%" }}>
                  <div className="card card-dashboard-one table-header-card">
                    <div
                      className="project-card-body"
                      style={{ height: "100%" }}
                    >
                      <span
                        className="demo-key-row1"
                        onClick={displayActiveProjects}
                      >
                        <b>
                          Active Projects ({dashboardData.NoOfOnGoingProjects})
                        </b>
                      </span>
                      <span
                        className="demo-key-row1"
                        onClick={displayActiveTasks}
                      >
                        <b>Active Tasks ({dashboardData.NoOfActiveTasks})</b>
                      </span>
                      <span
                        className="demo-key-row1"
                        onClick={displayActiveResources}
                      >
                        <b>
                          Active Resources ({dashboardData.NoOfActiveResources})
                        </b>
                      </span>
                      <span
                        className="demo-key-row1"
                        onClick={displayDurationDetails}
                      >
                        <b>Duration</b>
                      </span>
                    </div>
                  </div>
                  <div className="dashboard-table-section">
                    <div
                      className="card card-dashboard-one"
                      style={{ height: "100%" }}
                    >
                      <div className="masters-material-table dashboardDetailsTableContent">
                        <MaterialReactTable
                          data={projects}
                          columns={projectListColumns.filter(
                            (column) => !column.isHidden,
                          )}
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
                          enableColumnFilterModes={true}
                          enableColumnOrdering={false}
                          enableStickyHeader={true}
                          enableDensityToggle={true}
                          enableGlobalFilter={true}
                          enableRowSelection={false}
                          enablePagination={true}
                          initialState={{
                            density: "compact",
                            pagination: { pageIndex: 0, pageSize: 100 },
                          }}
                          getRowProps={(row) => ({
                            style: {
                              backgroundColor:
                                activeRowId === row.original.id
                                  ? "#e0e0e0"
                                  : "transparent",
                            },
                          })}
                          // renderTopToolbarCustomActions={() => (
                          //   <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                          //     <Tooltip title="Download CSV">
                          //       <IconButton onClick={dashboardDetailsDataCSVExport}>
                          //         <FileDownloadIcon
                          //           title="Export to CSV"
                          //           style={{ color: "rgba(0, 0, 0, 0.54)", width: "1em", height: "1em" }}
                          //         />
                          //       </IconButton>
                          //     </Tooltip>
                          //     <CSVLink
                          //       data={getTransformedDashboardDataForExport()}
                          //       filename="Dashboard Details.csv"
                          //       ref={csvLink}
                          //     />
                          //   </Box>
                          // )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-5 mg-t-20 mg-lg-t-0"
                  style={{ height: "100%" }}
                >
                  <div
                    className="card card-dashboard-two radialBarDashBoardDetails"
                    style={{ padding: "2px" }}
                  >
                    <h1
                      style={{
                        textAlign: "center",
                        padding: "1%",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#666666",
                      }}
                    >
                      Projects Status
                    </h1>
                    <ReactApexChart
                      options={RadialBarCharts.options}
                      series={RadialBarCharts.series}
                      type="radialBar"
                      className="custom-radial"
                      height={"100%"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default DashboardDetails;
