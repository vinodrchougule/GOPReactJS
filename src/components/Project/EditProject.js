import React, { useState, useEffect, useRef } from "react";
import projectService from "../../services/project.service";
import inputOutputFormatService from "../../services/inputOutputFormat.service";
import projectActivityService from "../../services/projectActivity.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import ModernDatepicker from "react-modern-datepicker";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import Moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import UnspscService from "../../services/Unspsc.service";
import userService from "../../services/user.service";
import mroDictionaryService from "../../services/mroDictionary.service";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, TextField } from "@mui/material";
import { CSVLink } from "react-csv";
import { useHistory, useLocation } from "react-router-dom";

toast.configure();

function EditProject(props) {
  //#region State management using useState hook
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [projectID, setProjectID] = useState(0);
  const [customerCode, setCustomerCode] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectType, setProjectType] = useState("");
  const [selectedTypeOfInput, setSelectedTypeOfInput] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [selectedInputCountType, setSelectedInputCountType] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isResourceBased, setIsResourceBased] = useState(false);
  const [customerInputFile, setCustomerInputFile] = useState("");
  const [locationCode, setLocation] = useState("");
  const [selectedunspcVersion, setSelectedUnspcVersion] = useState("");
  const [customerInputFileUploadedName, setCustomerInputFileUploadedName] =
    useState("");
  const [messageForCustomerInputFile, setMessageForCustomerInputFile] =
    useState(false);
  const [customerInputFileKey, setCustomerInputFileKey] = useState(Date.now());
  const [showCustomerInputFileLabel, setShowCustomerInputFileLabel] =
    useState(true);
  const [receivedDate, setReceivedDate] = useState("");
  const [InputOutputFormats, setInputOutputFormats] = useState([]);
  const [selectedReceivedFormat, setSelectedReceivedFormat] = useState("");
  const [selectedOutputFormat, setSelectedOutputFormat] = useState("");
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("");
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");
  const [deliveryPlanFileName, setDeliveryPlanFileName] = useState("");
  const [DeliveryPlanFileUploadedName, setDeliveryPlanFileUploadedName] =
    useState("");
  const [
    waitingMessageForPlannedDeliveryFile,
    setWaitingMessageForPlannedDeliveryFile,
  ] = useState(false);
  const [deliveryPlanFileKey, setDeliveryPlanFileKey] = useState(Date.now());
  const [showDeliverPlanFileLabel, setShowDeliverPlanFileLabel] =
    useState(true);
  const [scope, setScope] = useState("");
  const [scopeFileName, setScopeFileName] = useState("");
  const [scopeFileUploadedName, setScopeFileUploadedName] = useState("");
  const [messageForScopeFile, setMessageForScopeFile] = useState(false);
  const [messageForProjectUpdateFile, setMessageForProjectUpdateFile] =
    useState(false);
  const [scopeFileKey, setScopeFileKey] = useState(Date.now());
  const [showScopeFileLabel, setShowScopeFileLabel] = useState(true);
  const [guideline, setGuideline] = useState("");
  const [guidelineFileName, setGuidelineFileName] = useState("");
  const [guidelineFileUploadedName, setGuidelineFileUploadedName] =
    useState("");
  const [messageForGuidelineFile, setMessageForGuidelineFile] = useState(false);
  const [guidelineFileKey, setGuidelineFileKey] = useState(Date.now());
  const [showGuidelineFileLabel, setShowGuidelineFileLabel] = useState(true);
  const [checklist, setChecklist] = useState(true);
  const [checklistFileName, setChecklistFileName] = useState("");
  const [checklistFileUploadedName, setChecklistFileUploadedName] =
    useState("");
  const [messageForChecklistFile, setMessageForChecklistFile] = useState(false);
  const [checklistFileKey, setChecklistFileKey] = useState(Date.now());
  const [showChecklistFileLabel, setShowChecklistFileLabel] = useState(true);
  const [emailDate, setEmailDate] = useState("");
  const [emailDescription, setEmailDescription] = useState("");
  const [ProjectActivities, setProjectActivities] = useState([]);
  const [selectedProjectActivity, setSelectedProjectActivity] = useState("");
  const [NoOfSKUs, setNoOfSKUs] = useState(0);
  const [productionTarget, setProductionTarget] = useState(0);
  const [QCTarget, setQCTarget] = useState(0);
  const [QATarget, setQATarget] = useState(0);
  const [projectActivityDetails, setProjectActivityDetails] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [projectActivityFormErrors, setProjectActivityFormErrors] = useState(
    {}
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedActivityRow, setSelectedActivityRow] = useState([]);
  const [editNoOfSKUs, setEditNoOfSKUs] = useState(0);
  const [editDailyProductionTarget, setEditDailyProductionTarget] = useState(0);
  const [editDailyQCTarget, setEditDailyQCTarget] = useState(0);
  const [editDailyQATarget, setEditDailyQATarget] = useState(0);
  const [AllocatedCount, setAllocatedCount] = useState(0);
  const [editableRowIndex, setEditableRowIndex] = useState(0);
  const [
    showEditProjectActivityTagetModal,
    setShowEditProjectActivityTagetModal,
  ] = useState(false);
  const [editProjectActivityFormErrors, setEditProjectActivityFormErrors] =
    useState({});
  const [unspcVersions, setUnspcVersions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [isProjectSettingsExist, setIsProjectSettingsExist] = useState(false);
  const [showProjectUpdateDeleteModal, setShowProjectUpdateDeleteModal] =
    useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [uploadedProjectUpdateFileName, setUploadedProjectUpdateFileName] =
    useState("");
  const [editProjectUpdateDetailsData, setEditProjectUpdateDetailsData] =
    useState([]);
  const [
    isToShowProjectUpdateDetailsModal,
    setIsToShowProjectUpdateDetailsModal,
  ] = useState(false);
  const [
    isToShowAddProjectUpdateDetailsModal,
    setIsToShowAddProjectUpdateDetailsModal,
  ] = useState(false);
  const [validationProjectUpdateErrors, setValidationProjectUpdateErrors] =
    useState({});
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [userUploadedFileName, setUserUploadedFileName] = useState("");
  const [userUploadedTempFileName, setUserUploadedTempFileName] = useState("");
  const [projectUpdateFileKey, setProjectUpdateFileKey] = useState(0);
  const [existingFileNames, setExistingFileNames] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMroDictionaryVersion, setSelectedMroDictionaryVersion] =
    useState("");
  const [mrodictionaryversionslist, setMroDictionaryVersionsList] = useState(
    []
  );
  const fileInputRef = useRef(null);
  //#endregion

  //#region Display the Add Project Update Details Modal
  const addProjectUpdateDetailsFromClient = () => {
    setIsToShowAddProjectUpdateDetailsModal(true);
  };
  //#endregion

  //#region Close the Project Update Details Modal
  const handleCloseAddNewProjectUpdateDetailsModal = () => {
    setIsToShowAddProjectUpdateDetailsModal(false);
    setSubject("");
    setDetails("");
    setValidationProjectUpdateErrors({});
    setUserUploadedFileName("");
  };
  //#endregion

  //#region Close the Add Project Update Details Modal
  const handleProjectUpdateDetailsRowDelete = (id, UploadedFileName) => {
    setShowProjectUpdateDeleteModal(true);
    setDeleteId(id);
    setUploadedProjectUpdateFileName(UploadedFileName);
  };
  //#endregion

  //#region Delete the Project Update Details Yes Clicked
  const handleProjectUpdateDetailsDeleteYes = () => {
    const UserID = helper.getUser();
    setLoading(true);
    projectService
      .deleteProjectUpdateDetails(
        deleteId,
        uploadedProjectUpdateFileName,
        UserID
      )
      .then(() => {
        setEditProjectUpdateDetailsData((prevData) =>
          prevData.filter(
            (detail) => detail.ProjectUpdateDetailsID !== deleteId
          )
        );
        setLoading(false);
        setShowProjectUpdateDeleteModal(false);
        toast.success("Project update details deleted successfully!");
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setLoading(false);
      });
  };
  //#endregion

  //#region Handle Project Update Details Delete No
  const handleProjectUpdateDetailsDeleteNo = () => {
    setShowProjectUpdateDeleteModal(false);
  };
  //#endregion

  //#region Handle Project Update Details Input Changes
  const handleProjectUpdateDetailsInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "subject") {
      setSubject(value);
    } else if (name === "details") {
      setDetails(value);
    }
    if (name === "subject" && validationProjectUpdateErrors.subject) {
      setValidationProjectUpdateErrors((prevErrors) => ({
        ...prevErrors,
        subject: "",
      }));
    }
    if (name === "details" && validationProjectUpdateErrors.details) {
      setValidationProjectUpdateErrors((prevErrors) => ({
        ...prevErrors,
        details: "",
      }));
    }
  };
  //#endregion

  //#region Handle Save Project Update Details
  const handleSaveProjectUpdateDetails = () => {
    let validationProjectUpdateErrors = {};

    if (!subject.trim()) {
      validationProjectUpdateErrors.subject = "Subject is required";
    }

    if (!details.trim()) {
      validationProjectUpdateErrors.details =
        "Details / Description is required";
    }

    if (Object.keys(validationProjectUpdateErrors).length > 0) {
      setValidationProjectUpdateErrors(validationProjectUpdateErrors);
      return;
    }
    const data = {
      ProjectUpdateDetailsID: 0,
      CustomerCode: customerCode,
      ProjectCode: projectCode,
      Subject: subject,
      Details: details,
      UserUploadedFileName: userUploadedFileName,
      UserUploadedTempFileName: userUploadedTempFileName,
      UserID: helper.getUser(),
    };
    setLoading(true);

    projectService
      .saveProjectUpdateDetails(data)
      .then(() => {
        setSubject("");
        setDetails("");
        setValidationProjectUpdateErrors({});
        setUserUploadedFileName("");
        setUserUploadedTempFileName("");
        setIsToShowAddProjectUpdateDetailsModal(false);
        setLoading(false);
        fetchProjectUpdateDetailsData();
        toast.success("Project Update details saved successfully!", {
          autoClose: 3000,
        });
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Handle Project Update Details CSV Export
  const csvLinkProjectUpdateDetails = useRef(null);
  const handleProjectUpdateDetailsCSVExport = () => {
    if (csvLinkProjectUpdateDetails.current) {
      csvLinkProjectUpdateDetails.current.link.click();
    } else {
      console.error("CSV link reference is not available.");
    }
  };

  //#endregion

  //#region Handle Transform data for CSV export
  const getTransformedProjectUpdateDetailsForExport = () => {
    return editProjectUpdateDetailsData.map((row) => ({
      Subject: row.Subject,
      Details: row.Details,
    }));
  };
  //#endregion

  //#region Project Details Table
  const editProjectDetailsColumnsData = [
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
        align: "center",
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
              handleDownloadProjectUpdateDetails(
                row.original.ProjectUpdateDetailsID,
                fileName
              )
            }
          >
            {fileName ? (
              <div
                style={{
                  cursor: modalLoading || !fileName ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={() =>
                  !modalLoading &&
                  fileName &&
                  handleDownloadProjectUpdateDetails(
                    row.original.ProjectUpdateDetailsID,
                    fileName
                  )
                }
              >
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
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "Delete",
      header: "Delete",
      enableSorting: false,
      enableColumnActions: false,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) => (
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() =>
            handleProjectUpdateDetailsRowDelete(
              row.original.ProjectUpdateDetailsID,
              row.original.UserUploadedFileName
            )
          }
        >
          <i
            className="fa fa-close pointer"
            style={{
              background: "red",
              color: "#fff",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></i>
        </div>
      ),
    },
  ];
  //#endregion

  //#region Uploading Project Update File
  const uploadProjectUpdateFile = (e) => {
    setMessageForProjectUpdateFile(true);
    const files = e.target.files;
    if (!files.length) return;
    const currentFile = files[0];
    const fileNameUploaded = currentFile.name;
    if (existingFileNames.includes(fileNameUploaded)) {
      toast.error("File already updated.", { autoClose: false });
      setMessageForProjectUpdateFile(false);
      return;
    }
    setSpinnerMessage("Please wait while uploading Project file...");
    setLoading(true);
    const formData = new FormData();
    formData.append("File", currentFile);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForProjectUpdateFile(false);
        setUserUploadedFileName(fileNameUploaded);
        setUserUploadedTempFileName(response.data);
        setLoading(false);
        setProjectUpdateFileKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForProjectUpdateFile(false);
        setUserUploadedTempFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region Download the Method to handle file download
  const handleDownloadProjectUpdateDetails = (
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
        setLoading(false);
        setModalLoading(false);
        setSpinnerMessage("");
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, { autoClose: false });
        setLoading(false);
        setModalLoading(false);
        setSpinnerMessage("");
      });
  };
  //#endregion

  //#region Fetch Project Update Details Data
  const fetchProjectUpdateDetailsData = () => {
    setSpinnerMessage("Please wait while fetching Project Update Details...");
    setLoading(true);
    projectService
      .readProjectUpdateDetails(customerCode, projectCode)
      .then((response) => {
        const { data: editProjectUpdateDetailsData } = response;
        const existingFileNames = editProjectUpdateDetailsData.map(
          (item) => item.UserUploadedFileName
        );
        setEditProjectUpdateDetailsData(editProjectUpdateDetailsData);
        setExistingFileNames(existingFileNames);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      props.history.push({
        pathname: "/",
      });
      return;
    }
    window.scrollTo(0, 0);
    fetchProjectDetails();
    fetchInputOutputFormats();
    fetchUnspcVersionData();
    departmentDropDown();
    mrodictionaryVersionDropDown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region fetching project Details from Web API
  const fetchProjectDetails = () => {
    const projectID = location.state;
    if (!projectID) {
      props.history.push("/Projects");
      return;
    }
    setSpinnerMessage("Please wait while loading Project Details...");
    setLoading(true);

    projectService
      .getProjectDetailsByID(projectID, helper.getUser())
      .then((response) => {
        const data = response.data;

        setProjectID(data.ProjectID);
        setCustomerCode(data.CustomerCode);
        setProjectCode(data.ProjectCode);
        setLocation(data.LocationCode);
        setInputCount(data.InputCount);
        setSelectedReceivedFormat(data.ReceivedFormat);
        setSelectedOutputFormat(data.OutputFormat);
        setDeliveryPlanFileName(data.DeliveryPlanFileName);
        setDeliveryPlanFileUploadedName(data.DeliveryPlanFileName);
        setIsResourceBased(data.IsResourceBased);
        setRemarks(data.Remarks);
        setCustomerInputFile(data.CustomerInputFileName);
        setCustomerInputFileUploadedName(data.CustomerInputFileName);
        setScope(data.Scope);
        setScopeFileName(data.ScopeFileName);
        setScopeFileUploadedName(data.ScopeFileName);
        setGuideline(data.Guideline);
        setGuidelineFileName(data.GuidelineFileName);
        setGuidelineFileUploadedName(data.GuidelineFileName);
        setChecklist(data.Checklist);
        setChecklistFileName(data.ChecklistFileName);
        setChecklistFileUploadedName(data.ChecklistFileName);
        setEmailDescription(data.EmailDescription);
        setSelectedUnspcVersion(data.UNSPSCVersion);
        setSelectedMroDictionaryVersion(data.MRODictionaryVersion);
        setSelectedDepartment(data.Department);
        setProjectActivityDetails(data.Activities);
        setIsProjectSettingsExist(data.IsProjectSettingsExist);
        setLoading(false);

        setProjectType(data.ProjectType === "Regular" ? "R" : "P");
        setSelectedTypeOfInput(data.TypeOfInput === "Single" ? "S" : "R");
        setSelectedInputCountType(
          data.InputCountType === "Items / Lines" ? "I" : "D"
        );
        setSelectedDeliveryMode(data.DeliveryMode === "Single" ? "S" : "M");
        setReceivedDate(
          data.ReceivedDate
            ? Moment(data.ReceivedDate).format("DD-MMM-yyyy")
            : ""
        );
        setPlannedStartDate(
          data.PlannedStartDate
            ? Moment(data.PlannedStartDate).format("DD-MMM-yyyy")
            : ""
        );
        setPlannedDeliveryDate(
          data.PlannedDeliveryDate
            ? Moment(data.PlannedDeliveryDate).format("DD-MMM-yyyy")
            : ""
        );
        setEmailDate(
          data.EmailDate ? Moment(data.EmailDate).format("DD-MMM-yyyy") : ""
        );
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  // #region Fetch Unspc Version Data
  const fetchUnspcVersionData = () => {
    setSpinnerMessage("Please wait while fetching the data...!");
    setLoading(true);
    UnspscService.UNSPSCVersionData()
      .then((resp) => {
        if (resp.data.length === 0) {
          setLoading(false);
          return;
        }
        setUnspcVersions(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  //#region fetching Input Output Formats from Service
  const fetchInputOutputFormats = () => {
    setSpinnerMessage("Please wait while loading input output formats...");
    setLoading(true);

    inputOutputFormatService
      .getAllInputOutputFormats(helper.getUser(), true)
      .then((response) => {
        setInputOutputFormats(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region fetching Project Activities from Service
  const fetchProjectActivities = () => {
    setSpinnerMessage("Please wait while loading project activities...");
    setLoading(true);

    projectActivityService
      .getAllActivities(helper.getUser(), true)
      .then((response) => {
        setProjectActivities(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Close Modal Pop Up
  const handleNo = () => {
    setShowModal(false);
  };
  //#endregion

  //#region Display Modal Pop up
  const handleYes = () => {
    setShowModal(true);
    setSelectedProjectActivity("");
    setNoOfSKUs("");
    setProductionTarget("");
    setQCTarget("");
    setQATarget("");
    setProjectActivityFormErrors("");
  };
  //#endregion

  //#region On Change Type of Input
  const onChangeTypeOfInput = (e) => {
    const value = e.target.value;
    setSelectedTypeOfInput(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        typeOfInputError: "",
      }));
    }
  };
  //#endregion

  //#region On Change Input Count value
  const onChangeInputCount = (e) => {
    const value = e.target.value;
    setInputCount(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        inputCountError: "",
      }));
    }
  };
  //#endregion

  //#region On Change Input Count Type
  const onChangeInputCountType = (e) => {
    const value = e.target.value;
    setSelectedInputCountType(value);
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        inputCountTypeError: "",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        inputCountTypeError: "Input Count Type is required",
      }));
    }
  };
  //#endregion

  //#region  On Change Received Date
  const onChangeReceivedDate = (date) => {
    setReceivedDate(date);
    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receivedDateError: "",
      }));
    }
  };
  //#endregion

  //#region On Change Received Format
  const onChangeReceivedFormat = (e) => {
    const value = e.target.value;
    setSelectedReceivedFormat(value);
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receivedFormatError: "",
      }));
    }
  };
  //#endregion

  //#region On Change UNSPSC Version
  const onChangeUNSPSCVersion = (e) => {
    const newSelectedVersion = e.target.value;
    setSelectedUnspcVersion(newSelectedVersion);
    if (newSelectedVersion !== "" && newSelectedVersion !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        unspscFormatError: "",
      }));
    }
  };
  //#endregion

  //#region Handle change event for the MRO Dictionary Version dropdown
  const onChangeMroDictionaryVersion = (e) => {
    const value = e.target.value;
    setSelectedMroDictionaryVersion(value);
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedMroDictionaryVersionError: "",
      }));
    }
  };
  //#endregion

  //#region Fetch the MRO Dictionary Versions
  const mrodictionaryVersionDropDown = () => {
    setSpinnerMessage("Please wait while loading MRO Dictionary Versions...");
    setLoading(true);
    mroDictionaryService
      .readMRODictionariesList()
      .then((response) => {
        setMroDictionaryVersionsList(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region On Change Department
  const onChangeDepartment = (e) => {
    const newSelectedDepartment = e.target.value;
    setSelectedDepartment(newSelectedDepartment);
    if (newSelectedDepartment !== "" && newSelectedDepartment !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedDepartmentError: "",
      }));
    }
  };
  //#endregion

  //#region Dropdown Department
  const departmentDropDown = () => {
    setSpinnerMessage("Please wait while loading Departments...");
    setLoading(true);
    userService
      .readDepartmentsHcNMro(true)
      .then((response) => {
        setDepartmentList(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Get Selected Output Format
  const onChangeOutputFormat = (e) => {
    const value = e.target.value;
    setSelectedOutputFormat(value);
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        outputFormatError: "",
      }));
    }
  };
  //#endregion

  //#region  Get Selected Planned Start Date
  const onChangePlannedStartDate = (date) => {
    setPlannedStartDate(date);
    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        plannedStartDateError: "",
      }));
    }
  };
  //#endregion

  //#region Get Selected Delivery Mode
  const onChangeDeliveryMode = (e) => {
    const value = e.target.value;
    setSelectedDeliveryMode(value);
    if (value === "S") {
      setDeliveryPlanFileName("");
      setDeliveryPlanFileKey(Date.now());
      setDeliveryPlanFileUploadedName("");
    } else {
      setPlannedDeliveryDate("");
    }
    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        deliveryModeError: "",
      }));
    }
  };
  //#endregion

  //#region  Get Selected Planned Delivery Date
  const onChangePlannedDeliveryDate = (date) => {
    setPlannedDeliveryDate(date);
    if (date !== "" && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        plannedDeliveryDateError: "",
      }));
    }
  };
  //#endregion

  //#region Uploading Delivery Plan File
  const uploadDeliveryPlanFile = (e) => {
    setWaitingMessageForPlannedDeliveryFile(true);
    const files = e.target.files;
    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
    setDeliveryPlanFileUploadedName(fileNameUploaded);
    let formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading delivery plan file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setWaitingMessageForPlannedDeliveryFile(false);
        setDeliveryPlanFileName(response.data);
        setShowDeliverPlanFileLabel(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setWaitingMessageForPlannedDeliveryFile(false);
        setDeliveryPlanFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region Downloading Delivery Plan File
  const downloadDeliveryPlanFile = (e) => {
    setSpinnerMessage("Please wait while downloading delivery plan file...");
    setLoading(true);

    projectService
      .downloadFile(deliveryPlanFileName, "deliveryPlanFile")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", deliveryPlanFileName);
        document.body.appendChild(fileLink);

        setLoading(false);
        fileLink.click();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Deleting Delivery Plan File
  const deleteDeliveryPlanFile = () => {
    setSpinnerMessage("Please wait while deleting delivery plan file...");
    setLoading(true);

    projectService
      .deleteFile(deliveryPlanFileName)
      .then((response) => {
        setDeliveryPlanFileKey(Date.now());
        setDeliveryPlanFileName("");
        setDeliveryPlanFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setDeliveryPlanFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region get Is Resource Based value
  const onChangeIsResourceBased = (e) => {
    setIsResourceBased(e.target.checked);
  };
  //#endregion

  //#region Uploading CustomerInput File
  const uploadCustomerInputFile = (e) => {
    setMessageForCustomerInputFile(true);
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;
    setCustomerInputFileUploadedName(fileNameUploaded);
    const formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading customer file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForCustomerInputFile(false);
        setCustomerInputFile(response.data);
        setShowCustomerInputFileLabel(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForCustomerInputFile(false);
        setCustomerInputFile("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        customerInputFileError: "",
      }));
    }
  };
  //#endregion

  //#region Downloading customer Input File
  const downloadCustomerInputFile = (e) => {
    setSpinnerMessage("Please wait while downloading customer file...");
    setLoading(true);

    projectService
      .downloadFile(customerInputFile, "customerInputFile")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", customerInputFileUploadedName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Delete Customer Input File
  const deleteCustomerInputFile = () => {
    setSpinnerMessage("Please wait while deleting customer file...");
    setLoading(true);

    projectService
      .deleteFile(customerInputFile)
      .then(() => {
        setCustomerInputFileKey(Date.now());
        setCustomerInputFile("");
        setCustomerInputFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, { autoClose: false });
        setCustomerInputFile("");
        setLoading(false);
      });
  };
  //#endregion

  //#region On Change Remarks value
  const onChangeRemarks = (e) => {
    setRemarks(e.target.value);
  };
  //#endregion

  //#region On Change Scope value
  const onChangeScope = (e) => {
    const newScope = e.target.value;
    setScope(newScope);
    if (newScope !== "" && newScope !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        scopeError: "",
      }));
    }
  };
  //#endregion

  //#region Uploading Scope File
  const uploadScopeFile = (e) => {
    setMessageForScopeFile(true);
    setSpinnerMessage("Please wait while uploading scope file...");
    setLoading(true);
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;
    setScopeFileUploadedName(fileNameUploaded);
    const formData = new FormData();
    formData.append("File", currentFile);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForScopeFile(false);
        setScopeFileName(response.data);
        setShowScopeFileLabel(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForScopeFile(false);
        setScopeFileName("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        scopeError: "",
      }));
    }
  };
  //#endregion

  //#region Downloading Scope File
  const downloadScopeFile = (e) => {
    setSpinnerMessage("Please wait while downloading scope file...");
    setLoading(true);

    projectService
      .downloadFile(scopeFileName, "scope")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", scopeFileUploadedName);
        document.body.appendChild(fileLink);

        fileLink.click();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Deleting Scope File
  const deleteScopeFile = () => {
    setSpinnerMessage("Please wait while deleting scope file...");
    setLoading(true);

    projectService
      .deleteFile(scopeFileName)
      .then((response) => {
        setScopeFileKey(Date.now());
        setScopeFileName("");
        setScopeFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setScopeFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region On Change Guideline value
  const onChangeGuideline = (e) => {
    const { value } = e.target;
    setGuideline(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        guidelineError: "",
      }));
    }
  };
  //#endregion

  //#region Uploading Guideline File
  const uploadGuidelineFile = (e) => {
    setMessageForGuidelineFile(true);
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;
    setGuidelineFileUploadedName(fileNameUploaded);
    console.log(currentFile, "response.data");
    const formData = new FormData();
    formData.append("File", currentFile);

    setSpinnerMessage("Please wait while uploading guideline file...");
    setLoading(true);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForGuidelineFile(false);
        setGuidelineFileName(response.data);
        setShowGuidelineFileLabel(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForGuidelineFile(false);
        setGuidelineFileName("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevState) => ({
        ...prevState,
        guidelineError: "",
      }));
    }
  };
  //#endregion

  //#region Downloading Guideline File
  const downloadGuidelineFile = (e) => {
    setSpinnerMessage("Please wait while downloading guideline file...");
    setLoading(true);

    projectService
      .downloadFile(guidelineFileName, "guidelines")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", guidelineFileUploadedName);
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

  //#region Deleting guideline File
  const deleteGuidelineFile = () => {
    setSpinnerMessage("Please wait while deleting guideline file...");
    setLoading(true);

    projectService
      .deleteFile(guidelineFileName)
      .then((response) => {
        setGuidelineFileKey(Date.now());
        setGuidelineFileName("");
        setGuidelineFileUploadedName("");
        setLoading(false);
        toast.success("Guideline file deleted successfully!");
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, { autoClose: false });
        setGuidelineFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region On Change Checklist value
  const onChangeChecklist = (e) => {
    const value = e.target.value;
    setChecklist(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        checklistError: "",
      }));
    }
  };
  //#endregion

  //#region Uploading Checlist File
  const uploadChecklistFile = (e) => {
    setMessageForChecklistFile(true);
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;
    setChecklistFileUploadedName(fileNameUploaded);
    const formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading checklist file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForChecklistFile(false);
        setChecklistFileName(response.data);
        setShowChecklistFileLabel(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForChecklistFile(false);
        setChecklistFileName("");
        setLoading(false);
      });
    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        checklistError: "",
      }));
    }
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
        fileLink.setAttribute("download", checklistFileUploadedName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.Message, {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Deleting Checklist File
  const deleteChecklistFile = () => {
    setSpinnerMessage("Please wait while deleting checklist file...");
    setLoading(true);
    projectService
      .deleteFile(checklistFileName)
      .then((response) => {
        setChecklistFileKey(Date.now());
        setChecklistFileName("");
        setChecklistFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, { autoClose: false });
        setChecklistFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region On Change Email Date
  const onChangeEmailDate = (date) => {
    setEmailDate(date);
  };
  //#endregion

  //#region On Change Email Description value
  const onChangeEmailDescription = (e) => {
    setEmailDescription(e.target.value);
  };
  //#endregion

  //#region Handle Close Project Update Details Modal
  const handleCloseProjectUpdateDetailsModal = () => {
    setIsToShowProjectUpdateDetailsModal(false);
  };
  //#endregion

  //#region Table Data
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
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center", style: { width: "10%" } },
      },
      {
        accessorKey: "Edit",
        header: "Edit",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const index = row.index;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fas fa-pencil-alt pointer"
                onClick={() => showModalToEditProjectActivityRow(index)}
                style={{ color: "rgb(51, 102, 255)" }}
              ></i>
            </div>
          );
        },
      },
      {
        accessorKey: "Delete",
        header: "Delete",
        muiTableHeadCellProps: { align: "center", style: { width: "10%" } },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => {
          const deleteIconStyle = {
            color: "#fff",
            backgroundColor: "red",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          };
          const index = row.index;
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <i
                className="fa fa-close pointer"
                onClick={() => deleteProjectActivityRow(index)}
                style={deleteIconStyle}
              ></i>
            </div>
          );
        },
      },
    ];
  };
  //#endregion

  //#region On Change Project Activity
  const onChangeProjectActivity = (e) => {
    const value = e.target.value;
    setSelectedProjectActivity(value);
    if (value !== "" && value !== null) {
      setProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        projectActivityError: "",
        duplicateProjectActivityError: "",
      }));
    }
  };
  //#endregion

  //#region On Change No. of SKUs
  const onChangeNoOfSKUs = (e) => {
    const value = e.target.value;
    setNoOfSKUs(value);
    if (value !== "" && value !== null) {
      setProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        NoOfSKUsError: "",
      }));
    }
  };
  //#endregion

  //#region On Change Production Target value
  const onChangeProductionTarget = (e) => {
    const value = e.target.value;
    setProductionTarget(value);
    if (value !== "" && value !== null) {
      setProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        productionTargetError: "",
      }));
    }
  };
  //#endregion

  //#region On Change QC Target value
  const onChangeQCTarget = (e) => {
    const value = e.target.value;
    setQCTarget(value);
    setProjectActivityFormErrors((prevErrors) => ({
      ...prevErrors,
      QCTargetError:
        value !== "" && value !== null ? "" : prevErrors.QCTargetError,
    }));
  };
  //#endregion

  //#region On Change QA Target value
  const onChangeQATarget = (e) => {
    const newValue = e.target.value;
    setQATarget(newValue);
    if (newValue !== "" && newValue !== null) {
      setProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        QATargetError: "",
      }));
    }
  };
  //#endregion

  //#region Add to Project Activities List
  const AddToProjectActivityList = (e) => {
    e.preventDefault();

    if (handleProjectActivityFormValidation()) {
      const updatedProjectActivityDetails = [...projectActivityDetails];
      updatedProjectActivityDetails.push({
        Activity: selectedProjectActivity,
        NoOfSKUs: parseInt(NoOfSKUs),
        ProductionTarget: parseInt(productionTarget),
        QCTarget: parseInt(QCTarget),
        QATarget: parseInt(QATarget),
        AllocatedCount: 0,
        IsActivityAllocated: 0,
      });
      const updatedFormErrors = {
        ...formErrors,
        projectActivityTargetError: "",
      };
      setProjectActivityDetails(updatedProjectActivityDetails);
      setFormErrors(updatedFormErrors);
      setShowModal(false);
      setSelectedProjectActivity("");
    }
  };
  //#endregion

  //#region Validating the project Activity Target data
  const handleProjectActivityFormValidation = () => {
    const projectActivity = selectedProjectActivity.trim();
    const formErrors = {};
    let isValidForm = true;
    if (!projectActivity) {
      isValidForm = false;
      formErrors["projectActivityError"] = "Project Activity is required";
    }
    if (!NoOfSKUs) {
      isValidForm = false;
      formErrors["NoOfSKUsError"] = "No. of SKUs is required";
    }
    if (parseInt(NoOfSKUs) > parseInt(inputCount)) {
      isValidForm = false;
      formErrors["NoOfSKUsError"] =
        "No. of SKUs cannot be more than input count";
    }
    if (!productionTarget) {
      isValidForm = false;
      formErrors["productionTargetError"] = "Production Target is required";
    }
    if (!QCTarget) {
      isValidForm = false;
      formErrors["QCTargetError"] = "QC Target is required";
    }
    if (!QATarget) {
      isValidForm = false;
      formErrors["QATargetError"] = "QA Target is required";
    }
    if (
      projectActivityDetails.some(
        (details) => details.Activity === projectActivity
      )
    ) {
      isValidForm = false;
      formErrors["duplicateProjectActivityError"] =
        "Project Activity already exists";
    }
    setProjectActivityFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Delete Specific Project Activity Row
  const deleteProjectActivityRow = (index) => {
    const updatedProjectActivityDetails = [...projectActivityDetails];
    updatedProjectActivityDetails.splice(index, 1);
    setProjectActivityDetails(updatedProjectActivityDetails);
  };
  //#endregion

  //#region Show Pop Up to View Project Activity Row
  const showModalToEditProjectActivityRow = (index) => {
    if (projectActivityDetails && projectActivityDetails[index]) {
      const selectedActivityRow = Object.values(projectActivityDetails[index]);

      setSelectedActivityRow(selectedActivityRow);
      setEditNoOfSKUs(selectedActivityRow[1]);
      setEditDailyProductionTarget(selectedActivityRow[2]);
      setEditDailyQCTarget(selectedActivityRow[3]);
      setEditDailyQATarget(selectedActivityRow[4]);
      setAllocatedCount(selectedActivityRow[5]);
      setEditableRowIndex(index);
      setShowEditProjectActivityTagetModal(true);
      setEditProjectActivityFormErrors({});
    } else {
      console.error("Selected row is undefined or invalid");
    }
  };
  //#endregion

  //#region On Edit No of SKUs
  const onEditNoOfSKUs = (e) => {
    const value = e.target.value;
    setEditNoOfSKUs(value);
    if (value !== "" && value !== null) {
      setEditProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        NoOfSKUsError: "",
      }));
    }
  };
  //#endregion

  //#region On Edit Production Target
  const onEditProductionTarget = (e) => {
    const value = e.target.value;
    setEditDailyProductionTarget(value);

    if (value !== "" && value !== null) {
      setEditProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        productionTargetError: "",
      }));
    }
  };
  //#endregion

  //#region On Edit QC Target
  const onEditQCTarget = (e) => {
    const value = e.target.value;
    setEditDailyQCTarget(value);
    if (value !== "" && value !== null) {
      setEditProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        QCTargetError: "",
      }));
    }
  };
  //#endregion

  //#region On Edit QA Target
  const onEditQATarget = (e) => {
    const value = e.target.value;
    setEditDailyQATarget(value);

    if (value !== "" && value !== null) {
      setEditProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        QATargetError: "",
      }));
    }
  };
  //#endregion

  //#region Validating the Edit Project Activity Target data
  const handleEditProjectActivityFormValidation = () => {
    let formErrors = {};
    let isValidForm = true;

    if (!editNoOfSKUs) {
      isValidForm = false;
      formErrors["NoOfSKUsError"] = "No. of SKUs is required";
    }

    if (parseInt(editNoOfSKUs) > parseInt(inputCount)) {
      isValidForm = false;
      formErrors["NoOfSKUsError"] =
        "No. of SKUs cannot be more than input count";
    }

    if (AllocatedCount > 0) {
      if (parseInt(editNoOfSKUs) < parseInt(AllocatedCount)) {
        isValidForm = false;
        formErrors["NoOfSKUsError"] =
          "No. of SKUs cannot be less than allocated count";
      }
    }

    if (!editDailyProductionTarget) {
      isValidForm = false;
      formErrors["productionTargetError"] = "Production Target is required";
    }

    if (!editDailyQCTarget) {
      isValidForm = false;
      formErrors["QCTargetError"] = "QC Target is required";
    }

    if (!editDailyQATarget) {
      isValidForm = false;
      formErrors["QATargetError"] = "QA Target is required";
    }
    setEditProjectActivityFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Edit Project Activity Target Details function
  const EditProjectActivityTargetDetails = (e) => {
    e.preventDefault();
    if (handleEditProjectActivityFormValidation()) {
      const updatedProjectActivityDetails = [...projectActivityDetails];
      updatedProjectActivityDetails[editableRowIndex].NoOfSKUs = editNoOfSKUs;
      updatedProjectActivityDetails[editableRowIndex].ProductionTarget =
        editDailyProductionTarget;
      updatedProjectActivityDetails[editableRowIndex].QCTarget =
        editDailyQCTarget;
      updatedProjectActivityDetails[editableRowIndex].QATarget =
        editDailyQATarget;
      setProjectActivityDetails(updatedProjectActivityDetails);
      setShowEditProjectActivityTagetModal(false);
    }
  };
  //#endregion

  //#region Close Edit Project Activity Taget Modal
  const closeEditProjectActivityTagetModal = () => {
    setShowEditProjectActivityTagetModal(false);
  };
  //#endregion

  //#region Reset the page
  const reset = () => {
    setLoading(false);
    setSpinnerMessage("");
    setScopeFileKey(Date.now());
    setShowScopeFileLabel(true);
    setGuidelineFileKey(Date.now());
    setShowGuidelineFileLabel(true);
    setChecklistFileKey(Date.now());
    setShowChecklistFileLabel(true);
    fetchProjectDetails();
  };
  //#endregion

  //#region Clearing Dates
  const clearEmailDate = () => {
    setEmailDate("");
  };

  const clearPlannedDeliveryDate = () => {
    setPlannedDeliveryDate("");
  };

  const clearPlannedStartDate = () => {
    setPlannedStartDate("");
  };

  const clearReceivedDate = () => {
    setReceivedDate("");
  };
  //#endregion

  //#region Update Project Details From Client
  const updateProjectDetailsFromClient = () => {
    setIsToShowProjectUpdateDetailsModal(true);
    fetchProjectUpdateDetailsData();
  };
  //#endregion

  //#region Save Project
  const saveProject = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while Saving Project...");
      setLoading(true);

      const data = {
        ProjectID: projectID,
        CustomerCode: customerCode || "",
        ProjectCode: projectCode || "",
        ProjectType: projectType || "",
        LocationCode: locationCode || "",
        TypeOfInput: selectedTypeOfInput || "",
        InputCount: inputCount || 0,
        InputCountType: selectedInputCountType || "",
        ReceivedDate: receivedDate || "",
        ReceivedFormat: selectedReceivedFormat || "",
        OutputFormat: selectedOutputFormat || "",
        PlannedStartDate: plannedStartDate || "",
        DeliveryMode: selectedDeliveryMode || "",
        PlannedDeliveryDate: plannedDeliveryDate || "",
        DeliveryPlanFileName: deliveryPlanFileName || "",
        IsResourceBased: isResourceBased || false,
        Remarks: remarks || "",
        CustomerInputFileName: customerInputFile || "",
        Scope: scope || "",
        ScopeFileName: scopeFileName || "",
        Guideline: guideline || "",
        GuidelineFileName: guidelineFileName || "",
        Checklist: checklist || "",
        ChecklistFileName: checklistFileName || "",
        EmailDate: emailDate || "",
        UNSPSCVersion: selectedunspcVersion || "",
        MRODictionaryVersion: selectedMroDictionaryVersion || "",
        Department: selectedDepartment || "",
        EmailDescription: emailDescription || "",
        Activities: projectActivityDetails || [],
        NoOfBatches: 0,
        Status: "In Progress",
        UserID: helper.getUser() || "",
      };

      projectService
        .updateProject(projectID, data)
        .then(() => {
          setLoading(false);
          toast.success("Project Updated Successfully");
          setProjectID(0);
          setCustomerCode("");
          setProjectCode("");
          setProjectType("");
          setLocation("");
          setSelectedTypeOfInput("");
          setInputCount(0);
          setSelectedInputCountType("");
          setReceivedDate("");
          setSelectedReceivedFormat("");
          setSelectedOutputFormat("");
          setPlannedStartDate("");
          setSelectedDeliveryMode("");
          setPlannedDeliveryDate("");
          setDeliveryPlanFileName("");
          setIsResourceBased(false);
          setRemarks("");
          setCustomerInputFile("");
          setScope("");
          setScopeFileName("");
          setGuideline("");
          setGuidelineFileName("");
          setChecklist("");
          setChecklistFileName("");
          setEmailDate("");
          setSelectedUnspcVersion("");
          setSelectedMroDictionaryVersion("");
          setSelectedDepartment("");
          setEmailDescription("");
          setProjectActivityDetails([]);
          props.history.push({
            pathname: "/Projects",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response?.data?.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    let formErrors = {};
    let isValidForm = true;

    if (!selectedTypeOfInput.trim()) {
      isValidForm = false;
      formErrors["typeOfInputError"] = "Type of Input is required";
    }

    if (!inputCount) {
      isValidForm = false;
      formErrors["inputCountError"] = "Input Count is required";
    }

    if (!selectedInputCountType.trim()) {
      isValidForm = false;
      formErrors["inputCountTypeError"] = "Input Count Type is required";
    }

    if (!receivedDate) {
      isValidForm = false;
      formErrors["receivedDateError"] = "Received Date is required";
    }

    if (!selectedReceivedFormat.trim()) {
      isValidForm = false;
      formErrors["receivedFormatError"] = "Received Format is required";
    }

    if (!selectedOutputFormat.trim()) {
      isValidForm = false;
      formErrors["outputFormatError"] = "Output Format is required";
    }

    if (!plannedStartDate) {
      isValidForm = false;
      formErrors["plannedStartDateError"] = "Planned Start Date is required";
    } else if (new Date(plannedStartDate) < new Date(receivedDate)) {
      isValidForm = false;
      formErrors["plannedStartDateError"] =
        "Planned Start Date cannot be earlier than Received Date";
    }

    if (!selectedDeliveryMode.trim()) {
      isValidForm = false;
      formErrors["deliveryModeError"] = "Delivery Mode is required";
    }

    if (selectedDeliveryMode === "S") {
      if (!plannedDeliveryDate) {
        isValidForm = false;
        formErrors["plannedDeliveryDateError"] =
          "Planned Delivery Date is required";
      } else if (new Date(plannedDeliveryDate) < new Date(plannedStartDate)) {
        isValidForm = false;
        formErrors["plannedDeliveryDateError"] =
          "Planned Delivery Date cannot be earlier than Planned Start Date";
      }
    }

    if (!customerInputFile) {
      isValidForm = false;
      formErrors["customerInputFileError"] = "Customer Input File is required";
    }

    if (!scope.trim() && !scopeFileName.trim()) {
      isValidForm = false;
      formErrors["scopeError"] = "Either Scope or Scope File is required";
    }

    if (!guideline.trim() && !guidelineFileName.trim()) {
      isValidForm = false;
      formErrors["guidelineError"] =
        "Either Guideline or Guideline File is required";
    }

    if (!checklist.trim() && !checklistFileName.trim()) {
      isValidForm = false;
      formErrors["checklistError"] =
        "Either Checklist or Checklist File is required";
    }

    if (projectActivityDetails.length === 0) {
      isValidForm = false;
      formErrors["projectActivityTargetError"] =
        "At least one Project Activity is required";
    }
    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  let control;
  let DeliveryFileButtons;

  if (selectedDeliveryMode === "" || selectedDeliveryMode === "S") {
    control = (
      <div className="createProjectFloatingInput" style={{ width: "100%" }}>
        <FloatingLabel
          label={
            <>
              Planned Delivery Date <span className="text-danger">*</span>
            </>
          }
          className="float-hidden float-select"
        >
          <div className="form-field-div d-flex align-items-center">
            <div
              className="form-control date-field-width"
              style={{ width: "100%" }}
            >
              <ModernDatepicker
                tabIndex="10"
                id="plannedDeliveryDate"
                name="plannedDeliveryDate"
                date={plannedDeliveryDate}
                format={"DD-MMM-YYYY"}
                onChange={onChangePlannedDeliveryDate}
                placeholder={"Select a date"}
                className="color"
                minDate={new Date(1900, 1, 1)}
              />
            </div>
            <span
              className="btn btn-secondary"
              onClick={clearPlannedDeliveryDate}
              style={{ minHeight: "38px" }}
            >
              <i
                className="far fa-window-close"
                title="Clear Planned Delivery Date"
              ></i>
            </span>
          </div>
          <div className="error-message">
            {formErrors["plannedDeliveryDateError"]}
          </div>
        </FloatingLabel>
      </div>
    );
    DeliveryFileButtons = <></>;
  } else {
    control = (
      <div className="d-flex align-items-center gap-3 w-100">
        <div className="createProjectFloatingChooseFileInput flex-grow-1">
          <FloatingLabel
            label={
              <>
                Delivery Plan File <span className="text-danger">*</span>
              </>
            }
            className="float-hidden float-select"
          >
            <input
              type="file"
              className="form-control flex-grow-1"
              tabIndex="10"
              id="DeliveryPlanFile"
              name="DeliveryPlanFile"
              key={deliveryPlanFileKey}
              onChange={uploadDeliveryPlanFile}
              accept=".xls, .xlsx,.doc,.docx,.pdf"
            />
            {showDeliverPlanFileLabel && (
              <label
                htmlFor="DeliveryPlanFile"
                style={{ position: "absolute", right: "5px" }}
              >
                {DeliveryPlanFileUploadedName}
              </label>
            )}
          </FloatingLabel>
        </div>
      </div>
    );
    DeliveryFileButtons = (
      <>
        {waitingMessageForPlannedDeliveryFile && <p>Please Wait...</p>}
        {deliveryPlanFileName && (
          <>
            <span
              className="btn btn-secondary"
              onClick={downloadDeliveryPlanFile}
            >
              <i className="fas fa-download"></i>
            </span>
            <span
              className="btn btn-secondary mg-l-5"
              onClick={deleteDeliveryPlanFile}
            >
              <i className="fas fa-trash-alt"></i>
            </span>
          </>
        )}
      </>
    );
  }

  //#region main return
  return (
    <div
      className="create-project-page editProjectMainContent"
      style={{ height: "93%" }}
    >
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
        <div className="cp-main-div" style={{ padding: "30px" }}>
          <form onSubmit={saveProject} className="cp-form editProject-data">
            <div className="cp-breadcome-header" style={{ paddingLeft: "0px" }}>
              <div className="az-content-breadcrumb mg-t-20">
                <span>Project</span>
                <span>Edit Project</span>
              </div>
              <h4
                className="d-flex align-items-center"
                style={{ width: "25%" }}
              >
                Edit Project{" "}
                <span className="icon-size mg-l-5">
                  <Link
                    className="far fa-arrow-alt-circle-left text-primary pointer"
                    tabIndex="1"
                    to="/Projects"
                    title="Back to List"
                  ></Link>
                </span>
              </h4>
            </div>
            <div id="Add_Project" className="cp-container">
              <div className="row row-sm pb-2">
                <div className="col-lg-6">
                  <div className="form-field-div">
                    <label htmlFor="CustomerCode">
                      Customer Code{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="CustomerCode" name="CustomerCode">
                        {customerCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="form-field-div">
                    <label htmlFor="ProjectCode">
                      Project Code{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="ProjectCode" name="ProjectCode">
                        {projectCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-sm pb-2">
                <div className="col-lg-6">
                  <div className="form-field-div">
                    <label htmlFor="ProjectType">
                      Project Type{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="ProjectType" name="ProjectType">
                        {projectType === "R" ? "Regular" : "Pilot"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="form-field-div">
                    <label htmlFor="Location">
                      Location{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div>
                      <p id="Location" name="Location">
                        {locationCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Type of Input <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="1"
                        id="TypeOfInput"
                        name="TypeOfInput"
                        value={selectedTypeOfInput}
                        onChange={onChangeTypeOfInput}
                      >
                        <option value="">--Select--</option>
                        <option key="S" value="S">
                          Single
                        </option>
                        <option key="R" value="R">
                          Recurring
                        </option>
                      </select>
                      <div className="error-message">
                        {formErrors["typeOfInputError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Input Count <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <input
                        type="number"
                        className="form-control flex-grow-1"
                        tabIndex="2"
                        id="InputCount"
                        name="InputCount"
                        value={inputCount || ""}
                        onChange={onChangeInputCount}
                        max="9999999"
                        min="1"
                      />
                      <div className="error-message">
                        {formErrors["inputCountError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Input Count Type{" "}
                          <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="3"
                        id="InputCountType"
                        name="InputCountType"
                        value={selectedInputCountType}
                        onChange={onChangeInputCountType}
                      >
                        <option value="">--Select--</option>
                        <option key="Items/Lines" value="I">
                          Items / Lines
                        </option>
                        <option key="Document" value="D">
                          Document
                        </option>
                      </select>
                      <div className="error-message">
                        {formErrors["inputCountTypeError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Received Date <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <div className="form-field-div flex-grow-1">
                        <div
                          className="form-control date-field-width"
                          style={{ width: "100%" }}
                        >
                          <ModernDatepicker
                            tabIndex="4"
                            id="ReceivedDate"
                            name="ReceivedDate"
                            date={receivedDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) => onChangeReceivedDate(date)}
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span
                          className="btn btn-secondary"
                          onClick={clearReceivedDate}
                        >
                          <i
                            className="far fa-window-close"
                            title="Clear Received Date"
                          ></i>
                        </span>
                      </div>
                      <div className="error-message">
                        {formErrors["receivedDateError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Received Format <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="5"
                        id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedReceivedFormat}
                        onChange={onChangeReceivedFormat}
                      >
                        <option value="">--Select--</option>
                        {InputOutputFormats.map((formats) => (
                          <option key={formats.Format}>{formats.Format}</option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["receivedFormatError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Output Format <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="6"
                        id="OutputFormat"
                        name="OutputFormat"
                        value={selectedOutputFormat}
                        onChange={onChangeOutputFormat}
                      >
                        <option value="">--Select--</option>
                        {InputOutputFormats.map((formats) => (
                          <option key={formats.Format}>{formats.Format}</option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["outputFormatError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Planned Start Date{" "}
                          <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <div className="form-field-div">
                        <div
                          className="form-control date-field-width"
                          style={{ width: "100%" }}
                        >
                          <ModernDatepicker
                            tabIndex="7"
                            id="PlannedStartDate"
                            name="PlannedStartDate"
                            date={plannedStartDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) => onChangePlannedStartDate(date)}
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span
                          className="btn btn-secondary"
                          onClick={clearPlannedStartDate}
                        >
                          <i
                            className="far fa-window-close"
                            title="Clear Planned Start Date"
                          ></i>
                        </span>
                      </div>
                      <div className="error-message">
                        {formErrors["plannedStartDateError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Delivery Mode<span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="8"
                        id="DeliveryMode"
                        name="DeliveryMode"
                        value={selectedDeliveryMode}
                        onChange={onChangeDeliveryMode}
                      >
                        <option value="">--Select--</option>
                        <option key="Single" value="S">
                          Single
                        </option>
                        <option key="Multiple" value="M">
                          Multiple
                        </option>
                      </select>
                      <div className="error-message">
                        {formErrors["deliveryModeError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="resourceBased-slide-checkbox">
                    <label className="mg-r-5">Is Resource Based?</label>
                    <div>
                      <label className="switch ">
                        <input
                          type="checkbox"
                          id="IsResourceBased"
                          value={isResourceBased}
                          onChange={onChangeIsResourceBased}
                          checked={isResourceBased}
                          name="IsResourceBased"
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">{control}</div>
                <div className="col-lg mg-t-10 mg-lg-t-0">
                  {DeliveryFileButtons}
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Remarks</>}
                      className="float-hidden float-select"
                    >
                      <textarea
                        className="form-control flex-grow-1"
                        rows="2"
                        tabIndex="11"
                        id="Remarks"
                        name="Remarks"
                        maxLength="500"
                        value={remarks}
                        onChange={onChangeRemarks}
                      ></textarea>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile custInptFile"
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={
                          <>
                            Customer Input File{" "}
                            <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select mainLblFle"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="12"
                          id="CustomerInputFile"
                          name="CustomerInputFile"
                          key={customerInputFileKey}
                          onChange={uploadCustomerInputFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                          disabled={isProjectSettingsExist}
                        />
                        <div className="error-message">
                          {formErrors["customerInputFileError"]}
                        </div>
                        {showCustomerInputFileLabel && (
                          <label
                            className="lblFile customLblFile"
                            htmlFor="CustomerInputFile"
                            style={{
                              position: "absolute",
                              right: "5px",
                              width: "50%",
                              zIndex: "111",
                            }}
                          >
                            {customerInputFileUploadedName}
                          </label>
                        )}
                      </FloatingLabel>
                    </div>
                    <div className="d-flex">
                      {messageForCustomerInputFile && <p>Please Wait...</p>}
                      {customerInputFile && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={downloadCustomerInputFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          {!isProjectSettingsExist && (
                            <span
                              className="btn btn-secondary mg-l-10"
                              style={{ height: "42px" }}
                              onClick={deleteCustomerInputFile}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Scope</>}
                      className="float-hidden float-select"
                    >
                      <textarea
                        className="form-control flex-grow-1"
                        rows="2"
                        tabIndex="13"
                        id="Scope"
                        maxLength="500"
                        name="Scope"
                        value={scope}
                        onChange={onChangeScope}
                      ></textarea>
                      <div className="error-message">
                        {formErrors["scopeError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile"
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={<>Scope File</>}
                        className="float-hidden float-select mainLblFle"
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="14"
                          id="ScopeFile"
                          name="ScopeFile"
                          key={scopeFileKey}
                          onChange={uploadScopeFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
                        {showScopeFileLabel && (
                          <label
                            className="lblFile"
                            htmlFor="ScopeFile"
                            style={{
                              position: "absolute",
                              right: "5px",
                              width: "50%",
                              zIndex: "111",
                            }}
                          >
                            {scopeFileUploadedName}
                          </label>
                        )}
                      </FloatingLabel>
                    </div>
                    <div className=" d-flex">
                      {messageForScopeFile && <p>Please Wait...</p>}
                      {scopeFileName && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={downloadScopeFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={deleteScopeFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Guideline</>}
                      className="float-hidden float-select"
                    >
                      <textarea
                        className="form-control flex-grow-1"
                        rows="2"
                        tabIndex="15"
                        id="Guideline"
                        name="Guideline"
                        maxLength="500"
                        value={guideline}
                        onChange={onChangeGuideline}
                      ></textarea>
                      <div className="error-message">
                        {formErrors["guidelineError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile"
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={<>Guideline File</>}
                        className="float-hidden float-select mainLblFle"
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="16"
                          id="GuidelineFile"
                          name="GuidelineFile"
                          key={guidelineFileKey}
                          onChange={uploadGuidelineFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
                        {showGuidelineFileLabel && (
                          <label className="lblFile" htmlFor="GuidelineFile">
                            {guidelineFileUploadedName}
                          </label>
                        )}
                      </FloatingLabel>
                    </div>
                    <div className="d-flex">
                      {messageForGuidelineFile && <p>Please Wait...</p>}
                      {guidelineFileName && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={downloadGuidelineFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={deleteGuidelineFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Checklist</>}
                      className="float-hidden float-select"
                    >
                      <textarea
                        className="form-control flex-grow-1"
                        rows="2"
                        tabIndex="17"
                        id="Checklist"
                        name="Checklist"
                        maxLength="500"
                        value={checklist}
                        onChange={onChangeChecklist}
                      ></textarea>
                      <div className="error-message">
                        {formErrors["checklistError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="createProjectFloatingChooseFileInput gdlInputFile"
                      style={{ width: "100%" }}
                    >
                      <FloatingLabel
                        label={<>Checklist File</>}
                        className="float-hidden float-select mainLblFle"
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="18"
                          id="ChecklistFile"
                          name="ChecklistFile"
                          key={checklistFileKey}
                          onChange={uploadChecklistFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
                        {showChecklistFileLabel && (
                          <label
                            className="lblFile"
                            htmlFor="ChecklistFile"
                            style={{
                              position: "absolute",
                              right: "5px",
                              width: "50%",
                              zIndex: "111",
                            }}
                          >
                            {checklistFileUploadedName}
                          </label>
                        )}
                      </FloatingLabel>
                    </div>
                    <div className="d-flex">
                      {messageForChecklistFile && <p>Please Wait...</p>}
                      {checklistFileName && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={downloadChecklistFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={deleteChecklistFile}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Email Date</>}
                      className="float-hidden float-select"
                    >
                      <div className="form-field-div flex-grow-1">
                        <div
                          className="form-control date-field-width"
                          style={{ width: "100%" }}
                        >
                          <ModernDatepicker
                            tabIndex="19"
                            name="EmailDate"
                            id="EmailDate"
                            date={emailDate}
                            format={"DD-MMM-YYYY"}
                            onChange={(date) => onChangeEmailDate(date)}
                            placeholder={"Select a date"}
                            className="color"
                            minDate={new Date(1900, 1, 1)}
                          />
                        </div>
                        <span
                          className="btn btn-secondary"
                          onClick={clearEmailDate}
                        >
                          <i
                            className="far fa-window-close"
                            title="Clear Email Date"
                          ></i>
                        </span>
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Description</>}
                      className="float-hidden float-select"
                    >
                      <textarea
                        className="form-control flex-grow-1"
                        rows="3"
                        tabIndex="20"
                        id="emailDescription"
                        name="emailDescription"
                        maxLength="4000"
                        value={emailDescription}
                        onChange={onChangeEmailDescription}
                      ></textarea>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>UNSPSC Version</>}
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="9"
                        id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedunspcVersion}
                        onChange={onChangeUNSPSCVersion}
                      >
                        <option value="">--Select--</option>
                        {unspcVersions.map((version) => (
                          <option key={version.Version}>
                            {version.Version}
                          </option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["unspscFormatError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>MRO Dictionary Version</>}
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="9"
                        id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedMroDictionaryVersion}
                        onChange={onChangeMroDictionaryVersion}
                      >
                        <option value="">--Select--</option>
                        {mrodictionaryversionslist.map((dpt) => (
                          <option
                            key={dpt.VersionNameOrNo}
                            value={dpt.VersionNameOrNo}
                          >
                            {dpt.VersionNameOrNo}
                          </option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["selectedMroDictionaryVersionError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Department</>}
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="9"
                        id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedDepartment}
                        onChange={onChangeDepartment}
                        onFocus={departmentDropDown}
                      >
                        <option value="">--Select--</option>
                        {departmentList.map((dpt) => (
                          <option key={dpt.DepartmentID}>{dpt.Name}</option>
                        ))}
                      </select>
                      <div className="error-message">
                        {formErrors["receivedFormatError"]}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <Button
                    variant="secondary"
                    className=" mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    onClick={updateProjectDetailsFromClient}
                    style={{ minHeight: "42px" }}
                  >
                    Update Project Details from Client
                  </Button>
                </div>
              </div>
              <br />
              <h4 className="project-activity-heading">
                Project Activity Targets{" "}
                <span className="icon-size">
                  <i
                    className="fa fa-plus text-primary pointer"
                    onClick={handleYes}
                    title="Add New Project Activity"
                    tabIndex="21"
                  ></i>
                </span>
              </h4>
              <div className="error-message">
                {formErrors["projectActivityTargetError"]}
              </div>
              <div className="mg-l-10 mg-r-10">
                <MaterialReactTable
                  columns={createProjectListDataTable()}
                  data={projectActivityDetails}
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
              <div className="row row-sm mg-t-30">
                <div className="col-md-3"></div>
                <div className="col-md-2 mg-t-10 mg-lg-t-0">
                  <input
                    type="submit"
                    id="Save"
                    className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                    tabIndex="31"
                    value="Save"
                  />
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-2  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="32"
                    onClick={reset}
                    id="Reset"
                  >
                    Reset
                  </span>
                </div>
              </div>
              <div className="mg-b-10"></div>
            </div>
          </form>
          <Modal
            className="cp-add-project-activity-modal"
            show={showModal}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleNo}
            backdrop="static"
            enforceFocus={false}
            centered
          >
            <form onSubmit={AddToProjectActivityList}>
              <Modal.Header>
                <Modal.Title>Add New Project Activity</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div className="row row-sm">
                    <div className="col-lg">
                      <div className="createProjectFloatingInput">
                        <FloatingLabel
                          label={
                            <>
                              Project Activity{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <select
                            className="form-control"
                            tabIndex="25"
                            id="ProjectActivity"
                            name="ProjectActivity"
                            value={selectedProjectActivity}
                            onChange={onChangeProjectActivity}
                            onFocus={fetchProjectActivities}
                            placeholder="--Select--"
                          >
                            <option value="">--Select--</option>
                            {ProjectActivities.map((projectActivities) => (
                              <option key={projectActivities.Activity}>
                                {projectActivities.Activity}
                              </option>
                            ))}
                          </select>
                          <div className="error-message">
                            {projectActivityFormErrors["projectActivityError"]}
                          </div>
                        </FloatingLabel>
                      </div>

                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              No. of SKUs <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            tabIndex="27"
                            className="form-control"
                            value={NoOfSKUs}
                            onChange={onChangeNoOfSKUs}
                            min="1"
                            max="9999999"
                          />
                          <div className="error-message">
                            {projectActivityFormErrors["NoOfSKUsError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              Daily Production Target{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            tabIndex="28"
                            className="form-control"
                            id="ProductionTarget"
                            name="ProductionTarget"
                            value={productionTarget}
                            onChange={onChangeProductionTarget}
                            min="0"
                            max="9999"
                          />
                          <div className="error-message">
                            {projectActivityFormErrors["productionTargetError"]}
                          </div>
                        </FloatingLabel>
                      </div>

                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              Daily QC Target{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            tabIndex="29"
                            className="form-control"
                            id="QCTarget"
                            name="QCTarget"
                            maxLength="4"
                            value={QCTarget}
                            onChange={onChangeQCTarget}
                            min="0"
                            max="9999"
                          />
                          <div className="error-message">
                            {projectActivityFormErrors["QCTargetError"]}
                          </div>
                        </FloatingLabel>
                      </div>

                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              Daily QA Target{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            className="form-control"
                            maxLength="4"
                            tabIndex="30"
                            id="QATarget"
                            name="QATarget"
                            value={QATarget}
                            onChange={onChangeQATarget}
                            min="0"
                            max="9999"
                          />
                          <div className="error-message">
                            {projectActivityFormErrors["QATargetError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <div className="error-message mg-l-25">
                {projectActivityFormErrors["duplicateProjectActivityError"]}
              </div>
              <Modal.Footer>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Add To List"
                  tabIndex="31"
                />
                <Button variant="secondary" onClick={handleNo} tabIndex="30">
                  Cancel
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Modal
            className="cp-add-project-activity-modal"
            show={showEditProjectActivityTagetModal}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={closeEditProjectActivityTagetModal}
            backdrop="static"
            enforceFocus={false}
            centered
          >
            <form onSubmit={EditProjectActivityTargetDetails}>
              <Modal.Header>
                <Modal.Title>Edit Project Activity Target Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div className="row row-sm">
                    <div className="col-lg">
                      <label htmlFor="ProjectActivity">
                        <b>Project Activity</b>
                      </label>
                      <p id="ProjectActivity" name="ProjectActivity">
                        {selectedActivityRow[0]}
                      </p>
                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              No. of SKUs <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            tabIndex="27"
                            className="form-control"
                            value={editNoOfSKUs}
                            onChange={onEditNoOfSKUs}
                            min="1"
                            max="9999999"
                          />
                          <div className="error-message">
                            {editProjectActivityFormErrors["NoOfSKUsError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              Daily Production Target{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            tabIndex="28"
                            className="form-control"
                            id="ProductionTarget"
                            name="ProductionTarget"
                            value={editDailyProductionTarget}
                            onChange={onEditProductionTarget}
                            min="0"
                            max="9999"
                          />
                          <div className="error-message">
                            {
                              editProjectActivityFormErrors[
                                "productionTargetError"
                              ]
                            }
                          </div>
                        </FloatingLabel>
                      </div>
                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              Daily QC Target{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            tabIndex="29"
                            className="form-control"
                            id="QCTarget"
                            name="QCTarget"
                            maxLength="4"
                            value={editDailyQCTarget}
                            onChange={onEditQCTarget}
                            min="0"
                            max="9999"
                          />
                          <div className="error-message">
                            {editProjectActivityFormErrors["QCTargetError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                      <div className="createProjectFloatingInput mg-t-5">
                        <FloatingLabel
                          label={
                            <>
                              Daily QA Target{" "}
                              <span className="text-danger">*</span>
                            </>
                          }
                          className="float-hidden float-select"
                        >
                          <input
                            type="number"
                            className="form-control"
                            maxLength="4"
                            tabIndex="30"
                            id="QATarget"
                            name="QATarget"
                            value={editDailyQATarget}
                            onChange={onEditQATarget}
                            min="0"
                            max="9999"
                          />
                          <div className="error-message">
                            {editProjectActivityFormErrors["QATargetError"]}
                          </div>
                        </FloatingLabel>
                      </div>
                      <label htmlFor="AllocatedCount">
                        <b>Allocated Count</b>
                      </label>
                      <p id="AllocatedCount" name="AllocatedCount">
                        {AllocatedCount}
                      </p>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <input type="submit" className="btn btn-primary" value="Save" />
                <Button
                  variant="secondary"
                  onClick={closeEditProjectActivityTagetModal}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          <Modal
            className="updateProjectDetailsModalContent"
            show={isToShowProjectUpdateDetailsModal}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleCloseProjectUpdateDetailsModal}
            backdrop="static"
            enforceFocus={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Update the Project Details like MOM, Scope Updates, Feedback
                etc.., from the Client
              </Modal.Title>
            </Modal.Header>
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
                <div className="col-lg-6">
                  <Button
                    className="addUpdateProjectDetailsButton"
                    variant="secondary"
                    onClick={addProjectUpdateDetailsFromClient}
                  >
                    <i className="fa fa-plus mg-r-5"></i>
                    Add New Update
                  </Button>
                </div>
              </div>
              <div className="updateProjectDetailsTable mg-t-10">
                <div className="masters-material-table">
                  <MaterialReactTable
                    columns={editProjectDetailsColumnsData}
                    data={editProjectUpdateDetailsData}
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
                              onClick={handleProjectUpdateDetailsCSVExport}
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
                            data={getTransformedProjectUpdateDetailsForExport()}
                            headers={editProjectDetailsColumnsData
                              .filter(
                                (col) =>
                                  col.accessorKey !== "UserUploadedFileName" &&
                                  col.accessorKey !== "Download" &&
                                  col.accessorKey !== "Delete"
                              )
                              .map((col) => ({
                                label: col.header,
                                key: col.accessorKey,
                              }))}
                            filename="eidtProjectUpdateDetails.csv"
                            ref={csvLinkProjectUpdateDetails}
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
                onClick={handleCloseProjectUpdateDetailsModal}
              >
                <i className="fa fa-close mr-1"></i>Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            className="addUpdateProjectDetailsModalContent"
            show={isToShowAddProjectUpdateDetailsModal}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleCloseAddNewProjectUpdateDetailsModal}
            backdrop="static"
            enforceFocus={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Project Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mg-b-10">
                <div className="col-lg-6">
                  <div className="addUpdateProjectDetailsModalProjectCodeLabel">
                    <label>Customer Code:</label>
                    <div className="updateProjectDetailsCustomerCode">
                      <p id="CustomerCode" name="CustomerCode">
                        {customerCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="addUpdateProjectDetailsModalProjectCodeLabel">
                    <label>Project Code:</label>
                    <div className="updateProjectDetailsProjectCode">
                      <p id="ProjectCode" name="ProjectCode">
                        {projectCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="createnm updateProjectDetailsModalText mg-t-5">
                    <FloatingLabel
                      label="Subject"
                      className="float-hidden float-select"
                    >
                      <input
                        type="text"
                        className="form-control mg-l-5 mg-r-0"
                        maxLength="100"
                        placeholder="Enter the Subject max. 100 charecters"
                        name="subject"
                        value={subject}
                        onChange={handleProjectUpdateDetailsInputChange}
                      />
                    </FloatingLabel>
                    <span className="text-danger asterisk-size ml-2">*</span>
                  </div>
                  {validationProjectUpdateErrors.subject && (
                    <div className="text-danger">
                      {validationProjectUpdateErrors.subject}
                    </div>
                  )}
                  <div className="createnm updateProjectDetailsModalText mg-t-15">
                    <FloatingLabel
                      label="Details / Description"
                      className="float-hidden float-select"
                    >
                      <TextField
                        className="resizable-textfield"
                        placeholder="Enter the Details / Description max. 4000 charecters"
                        inputProps={{ maxLength: 4000 }}
                        multiline
                        rows={1}
                        col={100}
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        name="details"
                        value={details}
                        onChange={handleProjectUpdateDetailsInputChange}
                      />
                    </FloatingLabel>
                    <span className="text-danger asterisk-size ml-2">*</span>
                  </div>
                  {validationProjectUpdateErrors.details && (
                    <div className="text-danger">
                      {validationProjectUpdateErrors.details}
                    </div>
                  )}
                  <div className="form-field-div mg-t-10">
                    <input
                      type="file"
                      ref={fileInputRef}
                      id="AddProjectUpdateFile"
                      name="AddProjectUpdateFile"
                      key={projectUpdateFileKey}
                      onChange={uploadProjectUpdateFile}
                      className="form-control flex-grow-1"
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="AddProjectUpdateFile"
                      className="updateProject custom-file-upload"
                    >
                      <i className="fas fa-paperclip"></i>
                      {userUploadedFileName || "Upload the File"}
                    </label>
                    {messageForProjectUpdateFile && <p>Please Wait...</p>}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleSaveProjectUpdateDetails}
              >
                <i className="fa fa-save mr-1"></i> Save Project Update
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseAddNewProjectUpdateDetailsModal}
              >
                <i className="fa fa-close mr-1"></i> Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Modal
          className="updateProjectDetailsDeleteConfirmationModal"
          show={showProjectUpdateDeleteModal}
          onHide={handleProjectUpdateDetailsDeleteNo}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header>
            <Modal.Title>Delete Project Updated Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>Are you sure, to delete this Project Updated Details?</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={handleProjectUpdateDetailsDeleteYes}
            >
              Yes
            </Button>
            <Button
              variant="primary"
              onClick={handleProjectUpdateDetailsDeleteNo}
            >
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default EditProject;
