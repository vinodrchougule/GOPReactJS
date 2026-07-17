import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import projectService from "../../services/project.service";
import accessControlService from "../../services/accessControl.service";
import helper from "../../helpers/helpers";
import Moment from "moment";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
import { CSVLink } from "react-csv";
import Draggable from "react-draggable";
import { useHistory, useLocation } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

function ViewProject(props) {
  //#region State management using useState hook
  const location = useLocation();
  const state = props?.location?.state ?? location?.state ?? {};

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [
    isToShowProjectUpdateDetailsViewModal,
    setIsToShowProjectUpdateDetailsViewModal,
  ] = useState(false);
  const [customerCode, setCustomerCode] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [canAccessChangeProjectCode, setCanAccessChangeProjectCode] =
    useState(false);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [locationCode, setLocationCode] = useState("");
  const [deliveredDate, setDeliveredDate] = useState(null);
  const [projectType, setProjectType] = useState("");
  const [typeOfInput, setTypeOfInput] = useState("");
  const [status, setStatus] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [inputCountType, setInputCountType] = useState("");
  const [receivedDate, setReceivedDate] = useState(null);
  const [receivedFormat, setReceivedFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState("");
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState(null);
  const [deliveryPlanFileName, setDeliveryPlanFileName] = useState("");
  const [isResourceBased, setIsResourceBased] = useState(false);
  const [customerInputFileName, setCustomerInputFileName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [scope, setScope] = useState("");
  const [scopeFileName, setScopeFileName] = useState("");
  const [guideline, setGuideline] = useState("");
  const [guidelineFileName, setGuidelineFileName] = useState("");
  const [checklist, setChecklist] = useState("");
  const [checklistFileName, setChecklistFileName] = useState("");
  const [emailDate, setEmailDate] = useState(null);
  const [emailDescription, setEmailDescription] = useState("");
  const [unspscVersion, setUnspscVersion] = useState("");
  const [mrodictionaryVersion, setMRODictionaryVersion] = useState("");
  const [department, setDepartment] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [canAccessEditProject, setCanAccessEditProject] = useState(false);
  const [projectID, setProjectID] = useState(null);
  const [canAccessDeleteProject, setCanAccessDeleteProject] = useState(false);
  const [isProjectSettingsExist, setIsProjectSettingsExist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [changedProjectCode, setChangedProjectCode] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [viewProjectDetailsData, setViewProjectDetailsData] = useState([]);
  const [showChangeProjectCodeModal, setShowChangeProjectCodeModal] =
    useState(false);
  const [activities, setActivities] = useState([]);

  //#region View Project Details Table
  const viewProjectDetailsColumns = [
    {
      accessorKey: "Subject",
      header: "Subject",
      muiTableHeadCellProps: {
        align: "center",
        style: {
          width: "20%",
        },
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "Details",
      header: "Details / Description",
      muiTableHeadCellProps: {
        align: "center",
        style: {
          width: "80%",
        },
      },
      muiTableBodyCellProps: {
        align: "left",
      },
    },
    {
      accessorKey: "UserUploadedFileName",
      header: "File Name",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "Download",
      header: "Download Document",
      enableSorting: false,
      enableColumnActions: false,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => {
        const fileName = row.original.UserUploadedFileName;
        return (
          <div
            style={{
              cursor: fileName ? "pointer" : "not-allowed",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() =>
              fileName &&
              handleDownloadProjectUpdateViewDetails(
                row.original.ProjectUpdateDetailsID,
                fileName
              )
            }
          >
            {fileName ? (
              <i
                className="fa fa-download pointer"
                style={{
                  width: "16px",
                  height: "16px",
                  color: "#3366ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></i>
            ) : null}
          </div>
        );
      },
    },
  ];
  //#endregion

  //#region Handle Fetch Project Update Details View Data
  const fetchProjectUpdateDetailsViewData = () => {
    setSpinnerMessage("Please wait while fetching Project Update Details...");
    setLoading(true);

    projectService
      .readProjectUpdateDetails(customerCode, projectCode)
      .then((response) => {
        const { data: viewProjectDetailsData } = response;
        setViewProjectDetailsData(viewProjectDetailsData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    fetchProjectDetails();
    canUserAccessPage("Edit Project");
    canUserAccessPage("Delete Project");
    canUserAccessPage("Change Project Code");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Handle Download the Method to file download
  const handleDownloadProjectUpdateViewDetails = (
    projectUpdateDetailsID,
    fileName
  ) => {
    setLoading(true);
    setModalLoading(true);

    projectService
      .downloadProjectUpdateDetailsUploadedDocument(
        projectUpdateDetailsID,
        fileName
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const downloadFileName = fileName || "";

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = downloadFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSpinnerMessage("");
        setLoading(false);
        setModalLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message || "An error occurred", {
          autoClose: false,
        });
        setSpinnerMessage("");
        setLoading(false);
        setModalLoading(false);
      });
  };
  //#endregion

  //#region Fetching selected Project details
  const fetchProjectDetails = () => {
    if (!state?.ProjectID) {
      return;
    }
    const projectIdFromState = state.ProjectID;
    setProjectID(projectIdFromState);
    setSpinnerMessage("Please wait while loading Project Details...");
    setLoading(true);

    projectService
      .getProjectDetailsByID(projectIdFromState, helper.getUser())
      .then((response) => {
        const data = response?.data;
        if (!data) {
          throw new Error("Invalid response data.");
        }

        setProjectID(data.ProjectID ?? "");
        setCustomerCode(data.CustomerCode ?? "");
        setProjectCode(data.ProjectCode ?? "");
        setProjectType(data.ProjectType ?? "");
        setLocationCode(data.LocationCode ?? "");
        setTypeOfInput(data.TypeOfInput ?? "");
        setInputCount(data.InputCount ?? 0);
        setInputCountType(data.InputCountType ?? "");
        setReceivedDate(data.ReceivedDate ?? null);
        setReceivedFormat(data.ReceivedFormat ?? "");
        setOutputFormat(data.OutputFormat ?? "");
        setPlannedStartDate(data.PlannedStartDate ?? null);
        setDeliveryMode(data.DeliveryMode ?? "");
        setPlannedDeliveryDate(data.PlannedDeliveryDate ?? null);
        setDeliveryPlanFileName(data.DeliveryPlanFileName ?? "");
        setIsResourceBased(data.IsResourceBased ?? false);
        setRemarks(data.Remarks ?? "");
        setUnspscVersion(data.UNSPSCVersion ?? "");
        setMRODictionaryVersion(data.MRODictionaryVersion ?? "");
        setDepartment(data.Department ?? "");
        setCreatedBy(data.CreatedByEmployeeName ?? "");
        setCustomerInputFileName(data.CustomerInputFileName ?? "");
        setScope(data.Scope ?? "");
        setScopeFileName(data.ScopeFileName ?? "");
        setGuideline(data.Guideline ?? "");
        setGuidelineFileName(data.GuidelineFileName ?? "");
        setChecklist(data.Checklist ?? "");
        setChecklistFileName(data.ChecklistFileName ?? "");
        setEmailDate(data.EmailDate ?? null);
        setEmailDescription(data.EmailDescription ?? "");
        setActivities(data.Activities ?? []);
        setDeliveredCount(data.DeliveredCount ?? 0);
        setDeliveredDate(data.DeliveredOn ?? null);
        setStatus(data.Status ?? "");
        setIsProjectSettingsExist(data.IsProjectSettingsExist ?? false);
        setActiveTab(state.activeTab ?? "default");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        const errorMessage =
          e.response?.data?.Message ??
          "An error occurred while fetching project details.";
        toast.error(errorMessage, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Project page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Project") {
          setCanAccessEditProject(response.data);
        } else if (pageName === "Delete Project") {
          setCanAccessDeleteProject(response.data);
        } else if (pageName === "Change Project Code") {
          setCanAccessChangeProjectCode(response.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Downloading Delivery Plan File
  const downloadDeliveryPlanFile = () => {
    setSpinnerMessage("Please wait while downloading delivery plan file...");
    setLoading(true);

    projectService
      .downloadFile(deliveryPlanFileName, "deliveryplanfile")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", deliveryPlanFileName);
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

  //#region Downloading Customer Input File
  const downloadCustomerInputFile = () => {
    setSpinnerMessage("Please wait while downloading customer input file...");
    setLoading(true);

    projectService
      .downloadFile(customerInputFileName, "customerinputfile")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", customerInputFileName);
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

  //#region Downloading Scope File
  const downloadScopeFile = () => {
    setSpinnerMessage("Please wait while downloading scope file...");
    setLoading(true);

    projectService
      .downloadFile(scopeFileName, "scope")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", scopeFileName);
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

  //#region Downloading Guideline File
  const downloadGuidelineFile = () => {
    setSpinnerMessage("Please wait while downloading guideline file...");
    setLoading(true);

    projectService
      .downloadFile(guidelineFileName, "guidelines")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", guidelineFileName);
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

  //#region Downloading Checklist File
  const downloadChecklistFile = () => {
    setSpinnerMessage("Please wait while downloading checklist file...");
    setLoading(true);

    projectService
      .downloadFile(checklistFileName, "checklist")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", checklistFileName);
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

  //#region Create Project List Data Table
  const createProjectListDataTable = () => {
    return [
      {
        accessorKey: "Activity",
        header: "Activity",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "NoOfSKUs",
        header: "No Of SKUs",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "ProductionTarget",
        header: "Production Target",
        muiTableHeadCellProps: { align: "center", style: { width: "20%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "QCTarget",
        header: "QC Target",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "QATarget",
        header: "QA Target",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "AllocatedCount",
        header: "Allocated Count",
        muiTableHeadCellProps: {
          align: "center",
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            width: "10%",
          },
        },
      },
    ];
  };
  //#endregion

  //#region Close modal Pop Up
  const handleNo = () => {
    setShowModal(false); // Close the modal
  };
  //#endregion

  //#region Display Modal Pop up
  const showPopUp = () => {
    setShowModal(true);
  };
  //#endregion

  //#region Delete Project
  const handleYes = () => {
    if (!helper.getUser()) {
      history.push("/");
      return;
    }
    setSpinnerMessage("Please wait while deleting the project...");
    setLoading(true);

    projectService
      .deleteProject(projectID, helper.getUser())
      .then(() => {
        setShowModal(false);
        toast.success("Project Deleted Successfully");
        history.push("/Projects");
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
        handleNo();
      });
  };
  //#endregion

  //#region Display the Project Update Details Modal
  const viewUpdateProjectDetailsFromClient = () => {
    setIsToShowProjectUpdateDetailsViewModal(true);
    fetchProjectUpdateDetailsViewData();
  };
  //#endregion

  //#region Close the Project Update Details Modal
  const handleCloseProjectUpdateDetailsViewModal = () => {
    setIsToShowProjectUpdateDetailsViewModal(false);
  };
  //#endregion

  //#region Handle CSV Export
  const csvLinkProjectDetails = useRef(null);
  const handleProjectUpdateViewDetailsCSVExport = () => {
    if (csvLinkProjectDetails.current) {
      // Check if the reference is set
      csvLinkProjectDetails.current.link.click(); // Trigger click on the link
    } else {
      console.error("CSV link reference is not available.");
    }
  };

  //#endregion

  //#region Transform data for CSV export
  const getTransformedProjectUpdateViewDetailsForExport = () => {
    return viewProjectDetailsData.map((row) => ({
      Subject: row.Subject,
      Details: row.Details,
      File: row.File,
    }));
  };
  //#endregion

  //#region Show Change Project Code Modal
  const showChangeProjectCodeModalHandler = () => {
    setShowChangeProjectCodeModal(true);
    setChangedProjectCode("");
    setFormErrors({});
  };
  //#endregion

  //#region On Change Project Code
  const onChangeProjectCode = (e) => {
    setChangedProjectCode(e.target.value);
    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors({});
    }
  };
  //#endregion

  //#region Validating the input data
  const handleProjectValidation = () => {
    const trimmedCode = changedProjectCode.trim();
    let errors = {};
    let isValidForm = true;
    const re = /^\d+$/;

    if (!trimmedCode) {
      isValidForm = false;
      errors["projectCodeError"] = "Project Code is required";
    }

    if (trimmedCode === projectCode) {
      isValidForm = false;
      errors["projectCodeError"] =
        "Change To Project Code cannot be the same as existing Project Code";
    }

    if (trimmedCode) {
      let upperCaseChanged = trimmedCode.toUpperCase();
      let upperCaseCurrent = projectCode.toUpperCase();

      if (upperCaseCurrent.startsWith("PL")) {
        if (!upperCaseChanged.startsWith("PL")) {
          isValidForm = false;
          errors["projectCodeError"] =
            "Project Code should start with PL for Pilot Projects";
        } else if (trimmedCode.length !== 5) {
          isValidForm = false;
          errors["projectCodeError"] =
            "Project Code must be 5 Characters for Pilot Projects";
        } else if (upperCaseChanged === "PL000") {
          isValidForm = false;
          errors["projectCodeError"] = "Invalid Change To Project Code";
        }
      } else if (!re.test(trimmedCode)) {
        isValidForm = false;
        errors["projectCodeError"] = "Project Code should contain only numbers";
      } else if (trimmedCode.length !== 3) {
        isValidForm = false;
        errors["projectCodeError"] = "Project Code must have 3 Characters";
      } else if (trimmedCode === "000") {
        isValidForm = false;
        errors["projectCodeError"] = "Invalid Change To Project Code";
      }
    }
    setFormErrors(errors);
    return isValidForm;
  };
  //#endregion

  //#region Save Project Code
  const changeProjectCode = () => {
    if (handleProjectValidation()) {
      setSpinnerMessage("Please wait while changing Project Code...");
      setModalLoading(true);

      projectService
        .changeProjectCode(
          customerCode,
          projectCode,
          changedProjectCode,
          helper.getUser()
        )
        .then(() => {
          setModalLoading(false);
          toast.success("Project Code Changed Successfully");
          history.push("/projects");
        })
        .catch((e) => {
          setModalLoading(false);
          toast.error(e.response?.data?.Message, {
            autoClose: false,
          });
        });
    }
  };
  //#endregion

  //#region main return
  return (
    <div className="viewProjectMainContent">
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
        <div className="container-fluid">
          <div className="az-content-breadcrumb mg-t-20 mg-l-15">
            <span>Projects</span>
            <span>View Project</span>
          </div>
          <h4
            className="mg-l-15 d-flex align-items-center"
            style={{ width: "25%" }}
          >
            View Project{" "}
            <span className="icon-size">
              <Link
                to={{
                  pathname: "/Projects",
                  state: {
                    activeTab: activeTab,
                  },
                }}
              >
                <i
                  className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                  tabIndex="1"
                  title="Back to List"
                ></i>
              </Link>
            </span>
          </h4>
          <div className="viewProjectMainContent">
            <div className="col-md-12">
              <div className="card mb-3">
                <div className="card-body" style={{ overflowX: "hidden" }}>
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Customer Code</label>
                    </div>
                    <div className="col-sm-9">
                      <label>{customerCode}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Project Code</label>
                    </div>
                    <div className="col-sm-4">
                      <label>{projectCode}</label>
                    </div>
                    <div className="col-sm-4">
                      {canAccessChangeProjectCode && deliveredCount === 0 && (
                        <button
                          className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                          onClick={showChangeProjectCodeModalHandler}
                        >
                          Change Project Code
                        </button>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Location </label>
                    </div>
                    <div className="col-sm-4">
                      <label>{locationCode}</label>
                    </div>
                    <div className="col-sm-5 row">
                      {deliveredCount > 0 && (
                        <>
                          <label className="mg-r-70">Delivered Date</label>
                          <label>
                            {Moment(deliveredDate).format("DD-MMM-yyyy")}
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Project Type </label>
                    </div>
                    <div className="col-sm-4">
                      <label>{projectType}</label>
                    </div>
                    <div className="col-sm-5 row">
                      {deliveredCount > 0 && (
                        <>
                          <label className="mg-r-70">Delivered Count</label>
                          <label>{deliveredCount}</label>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Type of Input</label>
                    </div>
                    <div className="col-sm-4">
                      <label>{typeOfInput}</label>
                    </div>
                    <div className="col-sm-5 row">
                      <>
                        <label className="mg-r-120">Status</label>
                        <label>{status}</label>
                      </>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Input Count</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{inputCount}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Input Count Type</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{inputCountType}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Received Date</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>
                        {receivedDate &&
                          Moment(receivedDate).format("DD-MMM-yyyy")}{" "}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Received Format</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{receivedFormat}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Output Format</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{outputFormat}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Planned Start Date</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>
                        {plannedStartDate &&
                          Moment(plannedStartDate).format("DD-MMM-yyyy")}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Delivery Mode</label>
                    </div>
                    <div className="col-sm-9 ">
                      <label>{deliveryMode}</label>
                    </div>
                  </div>
                  <hr />
                  {deliveryMode === "Single" ? (
                    <div className="row">
                      <div className="col-sm-3">
                        <label>Planned Delivery Date</label>
                      </div>
                      <div className="col-sm-9">
                        <label>
                          {plannedDeliveryDate !== null
                            ? Moment(plannedDeliveryDate).format("DD-MMM-yyyy")
                            : ""}
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="row align-items-center">
                      <div className="col-sm-3">
                        <label>Delivery Plan File</label>
                      </div>
                      <div className="col-sm-9">
                        <label>
                          <Link to="#/" onClick={downloadDeliveryPlanFile}>
                            {deliveryPlanFileName}
                          </Link>
                        </label>
                      </div>
                    </div>
                  )}
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Is Resource Based?</label>
                    </div>
                    <div className="col-sm-9">
                      <label>{isResourceBased === true ? "Yes" : "No"}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Customer Input File</label>
                    </div>
                    <div className="col-sm-9">
                      <label>
                        <Link to="#/" onClick={downloadCustomerInputFile}>
                          {customerInputFileName}
                        </Link>
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Remarks</label>
                    </div>
                    <div className="col-sm-9">
                      <label>{remarks}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Scope</label>
                    </div>
                    <div className="col-sm-5">
                      <label style={{ textAlign: "justify" }}>{scope}</label>
                    </div>
                    <div className="col-sm-4">
                      <Link to="#/" onClick={downloadScopeFile}>
                        {scopeFileName}
                      </Link>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>GuideLine</label>
                    </div>
                    <div className="col-sm-5">
                      <label>{guideline}</label>
                    </div>
                    <div className="col-sm-4">
                      <Link to="#/" onClick={downloadGuidelineFile}>
                        {guidelineFileName}
                      </Link>
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-center">
                    <div className="col-sm-3">
                      <label>Checklist</label>
                    </div>
                    <div className="col-sm-5">
                      <label>{checklist}</label>
                    </div>
                    <div className="col-sm-4">
                      <Link to="#/" onClick={downloadChecklistFile}>
                        {checklistFileName}
                      </Link>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Email Date</label>
                    </div>
                    <div className="col-sm-9">
                      <label>
                        {emailDate !== null
                          ? Moment(emailDate).format("DD-MMM-yyyy")
                          : ""}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Email Desription</label>
                    </div>
                    <div className="col-sm-9">
                      <label>{emailDescription}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>UNSPSC Version</label>
                    </div>
                    <div className="col-sm-3">
                      <label>{unspscVersion}</label>
                    </div>
                    <div className="col-sm-3">
                      <label>MRO Dictionary Version</label>
                    </div>
                    <div className="col-sm-3">
                      <label>{mrodictionaryVersion}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Department</label>
                    </div>
                    <div className="col-sm-9">
                      <label>{department}</label>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <label>Created By</label>
                    </div>
                    <div className="col-sm-3">
                      <label>{createdBy}</label>
                    </div>
                    <div className="col-sm-6">
                      <Button
                        variant="secondary"
                        className=" mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        onClick={viewUpdateProjectDetailsFromClient}
                      >
                        Project Updated Details from Client
                      </Button>
                    </div>
                  </div>
                  <hr />
                  <div className="viewProjectListTable">
                    <MaterialReactTable
                      columns={createProjectListDataTable()}
                      data={activities}
                      enablePagination={false}
                      initialState={{ density: "compact" }}
                      enableStickyHeader
                      enableDensityToggle={false}
                      enableFilters={false}
                      enableFullScreenToggle={false}
                      enableColumnActions={false}
                      enableSorting={false}
                      enableMultiRemove={false}
                      renderTopToolbar={false}
                    />
                  </div>

                  <div className="row mg-t-20">
                    <div className="col-sm-1"></div>
                    {canAccessEditProject && deliveredCount === 0 && (
                      <div className="col-md-4">
                        <Link
                          to={{
                            pathname: "/Projects/EditProject",
                            state: projectID,
                          }}
                          className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                    <div className="col-sm-1"></div>
                    {canAccessDeleteProject && deliveredCount === 0 && (
                      <div className="col-md-4">
                        <button
                          className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                          onClick={showPopUp}
                          disabled={isProjectSettingsExist}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={showModal}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleNo}
            backdrop="static"
            enforceFocus={false}
            className="viewRoleDeleteModal"
          >
            <Modal.Header>
              <Modal.Title>Delete Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Are you sure to delete this Project?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleYes}>
                Yes
              </Button>
              <Button variant="primary" onClick={handleNo}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showChangeProjectCodeModal}
            onHide={() => setShowChangeProjectCodeModal(false)}
            dialogClassName="modal-width-produpload"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            enforceFocus={false}
          >
            <LoadingOverlay
              active={modalLoading}
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
              <Modal.Header>
                <Modal.Title id="changeProjectCodeModal">
                  Change Project Code
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row row-sm">
                  <div className="col-md-6 text-nowrap">
                    <label htmlFor="CustomerCode">
                      <b>Customer Code</b>
                    </label>
                  </div>
                  <div className="col-md-5 mg-t-7 mg-l-2">
                    <p id="CustomerCode" name="CustomerCode">
                      {customerCode}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-6 text-nowrap">
                    <label htmlFor="ProjectCode">
                      <b>Project Code</b>
                    </label>
                  </div>
                  <div className="col-md-5 mg-t-7 mg-l-2">
                    <p id="ProjectCode" name="ProjectCode">
                      {projectCode}
                    </p>
                  </div>
                </div>
                <div className="row row-sm">
                  <div className="col-md-7">
                    <div className="createProjectFloatingInput">
                      <FloatingLabel
                        label={
                          <>
                            <b>Change To Project Code</b>
                            <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select"
                      >
                        <input
                          type="text"
                          className="form-control"
                          id="newProjectCode"
                          name="newProjectCode"
                          value={changedProjectCode}
                          onChange={onChangeProjectCode}
                          maxLength="5"
                          min="1"
                        />
                        <div className="error-message">
                          {formErrors["projectCodeError"]}
                        </div>
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
                <div className="row row-sm mg-t-30">
                  <div className="col-md-3"></div>
                  <div className="col-md-3 mg-t-10 mg-lg-t-0">
                    <span
                      className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                      onClick={changeProjectCode}
                    >
                      Change
                    </span>
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-3  mg-t-10 mg-lg-t-0">
                    <span
                      className="btn btn-gray-700 btn-block"
                      tabIndex="28"
                      onClick={() => setShowChangeProjectCodeModal(false)}
                      id="Cancel"
                    >
                      Cancel
                    </span>
                  </div>
                </div>
              </Modal.Body>
            </LoadingOverlay>
          </Modal>

          <Draggable handle=".modal-header">
            <Modal
              className="updateProjectDetailsModalContent"
              show={isToShowProjectUpdateDetailsViewModal}
              aria-labelledby="contained-modal-title-vcenter"
              onHide={handleCloseProjectUpdateDetailsViewModal}
              backdrop="static"
              enforceFocus={false}
              centered
            >
              <div style={{ cursor: "move" }}>
                <Modal.Header closeButton className="modal-header">
                  <Modal.Title>Project Update Details</Modal.Title>
                </Modal.Header>
              </div>
              <Modal.Body>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="updateProjectDetailsModalLabel">
                      <div className="updateProjectDetailsLabelContent">
                        <label>Customer Code:</label>
                        <p id="CustomerCode" name="CustomerCode">
                          {customerCode}
                        </p>
                      </div>
                      <div className="updateProjectDetailsLabelContent">
                        <label>Project Code:</label>
                        <p id="ProjectCode" name="ProjectCode">
                          {projectCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="updateProjectDetailsTable mg-t-10">
                  <div className="pdqcmro masters-material-table nmtable mrodicttble mroDictionaryListTable">
                    <MaterialReactTable
                      columns={viewProjectDetailsColumns}
                      data={viewProjectDetailsData}
                      initialState={{ density: "compact" }}
                      enableColumnFilterModes={true}
                      enableColumnOrdering={false}
                      enableRowSelection={false}
                      enableFullScreenToggle={false}
                      enablePagination={false}
                      enableStickyHeader={true}
                      renderTopToolbarCustomActions={() => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <Tooltip title="Download CSV">
                              <IconButton
                                onClick={
                                  handleProjectUpdateViewDetailsCSVExport
                                }
                              >
                                <FileDownloadIcon
                                  title="Export to CSV"
                                  style={{
                                    color: "#5B47FB",
                                    width: "1em",
                                    height: "1em",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            <CSVLink
                              data={getTransformedProjectUpdateViewDetailsForExport()}
                              headers={viewProjectDetailsColumns
                                .filter(
                                  (col) =>
                                    col.accessorKey !==
                                      "UserUploadedFileName" &&
                                    col.accessorKey !== "Download" &&
                                    col.accessorKey !== "Delete"
                                )
                                .map((col) => ({
                                  label: col.header,
                                  key: col.accessorKey,
                                }))}
                              filename="ProjectUpdateDetails.csv"
                              ref={csvLinkProjectDetails}
                              style={{ display: "none" }}
                            />
                          </div>
                        </Box>
                      )}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={handleCloseProjectUpdateDetailsViewModal}
                >
                  <i className="fa fa-close mr-1"></i>Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Draggable>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default ViewProject;
