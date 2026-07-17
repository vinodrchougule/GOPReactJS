import React, { useState, useEffect, useCallback } from "react";
import projectService from "../../services/project.service";
import customerService from "../../services/customer.service";
import inputOutputFormatService from "../../services/inputOutputFormat.service";
import projectActivityService from "../../services/projectActivity.service";
import helper from "../../helpers/helpers";
import { Button, Modal } from "react-bootstrap";
import ModernDatepicker from "react-modern-datepicker";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnspscService from "../../services/Unspsc.service";
import userService from "../../services/user.service";
import mroDictionaryService from "../../services/mroDictionary.service";
import { useHistory } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { MaterialReactTable } from "material-react-table";

toast.configure();

function CreateProject() {

  //#region State management using useState hook
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [projectType, setProjectType] = useState("");
  const [selectedTypeOfInput, setSelectedTypeOfInput] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [selectedInputCountType, setSelectedInputCountType] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [InputOutputFormats, setInputOutputFormats] = useState([]);
  const [selectedReceivedFormat, setSelectedReceivedFormat] = useState("");
  const [selectedOutputFormat, setSelectedOutputFormat] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [selectedunspcVersion, setSelectedUnspcVersion] = useState("");
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("");
  const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");
  
  const [deliveryPlanFileName, setDeliveryPlanFileName] = useState("");
  const [DeliveryPlanFileUploadedName, setDeliveryPlanFileUploadedName] = useState("");
  const [waitingMessageForPlannedDeliveryFile, setWaitingMessageForPlannedDeliveryFile] = useState(false);
  const [deliveryPlanFileKey, setDeliveryPlanFileKey] = useState(Date.now());
  
  const [isResourceBased, setIsResourceBased] = useState(false);
  
  const [customerInputFileName, setCustomerInputFileName] = useState("");
  const [customerInputFileUploadedName, setCustomerInputFileUploadedName] = useState("");
  const [messageForCustomerInputFile, setMessageForCustomerInputFile] = useState(false);
  const [customerInputFileKey, setCustomerInputFileKey] = useState(Date.now());
  
  const [remarks, setRemarks] = useState("");
  
  const [scope, setScope] = useState("");
  const [scopeFileName, setScopeFileName] = useState("");
  const [scopeFileUploadedName, setScopeFileUploadedName] = useState("");
  const [messageForScopeFile, setMessageForScopeFile] = useState(false);
  const [scopeFileKey, setScopeFileKey] = useState(Date.now());
  
  const [guideline, setGuideline] = useState("");
  const [guidelineFileName, setGuidelineFileName] = useState("");
  const [guidelineFileUploadedName, setGuidelineFileUploadedName] = useState("");
  const [messageForGuidelineFile, setMessageForGuidelineFile] = useState(false);
  const [guidelineFileKey, setGuidelineFileKey] = useState(Date.now());
  
  const [checklist, setChecklist] = useState("");
  const [checklistFileName, setChecklistFileName] = useState("");
  const [checklistFileUploadedName, setChecklistFileUploadedName] = useState("");
  const [messageForChecklistFile, setMessageForChecklistFile] = useState(false);
  const [checklistFileKey, setChecklistFileKey] = useState(Date.now());
  
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
  const [projectActivityFormErrors, setProjectActivityFormErrors] = useState({});
  const [unspcVersions, setUnspcVersions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMroDictionaryVersion, setSelectedMroDictionaryVersion] = useState("");
  const [mrodictionaryversionslist, setMroDictionaryVersionsList] = useState([]);
  //#endregion
  
  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region Fetch Initial data
  const fetchInitialData = useCallback(() => {
    fetchCustomers();
    fetchInputOutputFormats();
    fetchUnspcVersionData();
    fetchProjectActivities();
    mrodictionaryVersionDropDown();
  }, []);
  //#endregion

  //#region fetching customers from Web API
  const fetchCustomers = () => {
    setSpinnerMessage("Please wait while loading customers...");
    setLoading(true);

    customerService
      .getAllCustomers(helper.getUser())
      .then((response) => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Fetch Unspc Version Data
  const fetchUnspcVersionData = () => {
    setSpinnerMessage('Please wait while fetching the data...!');
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
        console.log(error);
        setLoading(false);
        toast.error('An error occurred while fetching data!', { autoClose: false });
      });
  };
  // #endregion

  //#region fetching Input Output Formats from Web API
  const fetchInputOutputFormats = () => {
    setSpinnerMessage('Please wait while loading input output formats...');
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

  //#region fetching Project Activities from Web API
  const fetchProjectActivities = () => {
    setSpinnerMessage('Please wait while loading project activities...');
    setLoading(true);

    projectActivityService.getAllActivities(helper.getUser(), true)
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
    setSelectedProjectActivity('');
    setNoOfSKUs('');
    setProductionTarget('');
    setQCTarget('');
    setQATarget('');
    setProjectActivityFormErrors('');
  };
  //#endregion

  //#region On Change Selected Customer
  const onChangeCustomer = (e) => {
    const value = e.target.value;
    setSelectedCustomer(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({ ...prevErrors, customerCodeError: '' }));
    }
  };
  //#endregion

  //#region On Change Project Type
  const onChangeProjectType = (e) => {
    const value = e.target.value;
    setProjectType(value);
    if (value !== '' && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        projectTypeError: '',
      }));
    }
  };
  //#endregion

  //#region On Change Selected Type of Input
  const onChangeTypeOfInput = (e) => {
    setSelectedTypeOfInput(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        typeOfInputError: ""
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

  //#region On Change Selected Input Count Type
  const onChangeInputCountType = (e) => {
    const value = e.target.value;
    setSelectedInputCountType(value);

    if (value !== '' && value !== null) {
      const updatedFormErrors = { ...formErrors, inputCountTypeError: '' };
      setFormErrors(updatedFormErrors);
    }
  };
  //#endregion

  //#region  On Change Received Date
  const onChangeReceivedDate = (date) => {
    setReceivedDate(date);

    if (date !== '' && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receivedDateError: '',
      }));
    }
  };
  //#endregion

  //#region On Change Selected Received Format
  const onChangeReceivedFormat = (e) => {
    const value = e.target.value;
    setSelectedReceivedFormat(value);

    if (value !== '' && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receivedFormatError: '',
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
    setSpinnerMessage('Please wait while loading MRO Dictionary Versions...');
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

  //#region Get Selected Received Format
  const onChangeDepartment = (e) => {
    const value = e.target.value;
    setSelectedDepartment(value);

    if (value !== "" && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedDepartmentError: "",
      }));
    }
  };
  //#endregion

  //#region fetching Department from Web API
  const departmentDropDown = () => {
    setSpinnerMessage('Please wait while loading Departments...');
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

  //#region Get Selected UNSPSC Format
  const onChangeUNSPSCVersion = (e) => {
    setSelectedUnspcVersion(e.target.value);
  };
  //#endregion

  //#region Get Selected Output Format
  const onChangeOutputFormat = (e) => {
    const value = e.target.value;
    setSelectedOutputFormat(value);

    if (value !== '' && value !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        outputFormatError: '',
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

  //#region On Change Selected Delivery Mode
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

  //#region  On Change Planned Delivery Date
  const onChangePlannedDeliveryDate = (date) => {
    setPlannedDeliveryDate(date);

    if (date !== '' && date !== null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        plannedDeliveryDateError: '',
      }));
    }
  };
  //#endregion

  //#region Downloading Delivery Plan File
  const downloadDeliveryPlanFile = () => {
    setSpinnerMessage('Please wait while downloading delivery plan file...');
    setLoading(true);

    projectService
      .downloadFile(deliveryPlanFileName, 'deliveryPlanFile')
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', DeliveryPlanFileUploadedName);
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
        setCustomerInputFileName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForCustomerInputFile(false);
        setCustomerInputFileName("");
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
      .downloadFile(customerInputFileName, "customerInputFile")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", customerInputFileUploadedName);
        document.body.appendChild(fileLink);
        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Deleting Customer Input File
  const deleteCustomerInputFile = () => {
    setSpinnerMessage("Please wait while deleting customer file...");
    setLoading(true);

    projectService
      .deleteFile(customerInputFileName)
      .then((response) => {
        setCustomerInputFileKey(Date.now());
        setCustomerInputFileName("");
        setCustomerInputFileUploadedName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, { autoClose: false });
        setCustomerInputFileName("");
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
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;
    setScopeFileUploadedName(fileNameUploaded);

    let formData = new FormData();
    formData.append("File", currentFile);

    setSpinnerMessage("Please wait while uploading scope file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForScopeFile(false);
        setScopeFileName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForScopeFile(false);
        setScopeFileName("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const updatedFormErrors = { ...formErrors, scopeError: "" };
      setFormErrors(updatedFormErrors);
    }
  };
  //#endregion

  //#region Downloading Scope File
  const downloadScopeFile = () => {
    setSpinnerMessage("Please wait while downloading scope file...");
    setLoading(true);

    projectService.downloadFile(scopeFileName, "scope")
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", scopeFileUploadedName);
        document.body.appendChild(fileLink);

        fileLink.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Deleting Scope File
  const deleteScopeFile = () => {
    setSpinnerMessage('Please wait while deleting scope file...');
    setLoading(true);

    projectService
      .deleteFile(scopeFileName)
      .then((response) => {
        setScopeFileKey(Date.now());
        setScopeFileName('');
        setScopeFileUploadedName('');
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setScopeFileName('');
        setLoading(false);
      });
  };
  //#endregion

  //#region On Change Guideline value
  const onChangeGuideline = (e) => {
    const newGuideline = e.target.value;
    setGuideline(newGuideline);

    if (newGuideline !== "" && newGuideline !== null) {
      const updatedFormErrors = { ...formErrors, guidelineError: "" };
      setFormErrors(updatedFormErrors);
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

    let formData = new FormData();
    formData.append("File", currentFile);

    setSpinnerMessage("Please wait while uploading guideline file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForGuidelineFile(false);
        setGuidelineFileName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForGuidelineFile(false);
        setGuidelineFileName("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const newFormErrors = { ...formErrors, guidelineError: "" };
      setFormErrors(newFormErrors);
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
        toast.error(e.response?.data?.Message, { autoClose: false });
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
    const { value } = e.target;
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
    let currentFile = files[0];
    let fileNameUploaded = files[0].name;
    setChecklistFileUploadedName(fileNameUploaded);
    let formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading checklist file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setMessageForChecklistFile(false);
        setChecklistFileName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.Message, { autoClose: false });
        setMessageForChecklistFile(false);
        setChecklistFileName("");
        setLoading(false);
      });

    if (e.target.value !== "" && e.target.value !== null) {
      const updatedFormErrors = { ...formErrors, checklistError: "" };
      setFormErrors(updatedFormErrors);
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
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.Message, { autoClose: false });
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
        toast.error(error.response.data.Message, { autoClose: false });
        setChecklistFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region  On Change Received Date
  const onChangeEmailDate = (date) => {
    setEmailDate(date);
  };
  //#endregion

  //#region On Change Email Description value
  const onChangeEmailDescription = (e) => {
    setEmailDescription(e.target.value);
  };
  //#endregion

  //#region On Change Project Activity
  const onChangeProjectActivity = (e) => {
    const value = e.target.value;
    setSelectedProjectActivity(value);

    if (value !== "" && value !== null) {
      setProjectActivityFormErrors({
        projectActivityError: "",
        duplicateProjectActivityError: "",
      });
    }
  };
  //#endregion

  //#region On Change No. of SKUs
  const onChangeNoOfSKUs = (e) => {
    const value = e.target.value;
    setNoOfSKUs(value);

    if (value !== "" && value !== null) {
      const formErrors = {
        ...projectActivityFormErrors,
        NoOfSKUsError: "",
      };
      setProjectActivityFormErrors(formErrors);
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
    setQCTarget(e.target.value);

    if (e.target.value !== "" && e.target.value !== null) {
      setProjectActivityFormErrors((prevErrors) => ({
        ...prevErrors,
        QCTargetError: "",
      }));
    }
  };
  //#endregion

  //#region On Change QA Target value
  const onChangeQATarget = (e) => {
    const value = e.target.value;
    setQATarget(value);
    if (value !== "" && value !== null) {
      const formErrors = {
        ...projectActivityFormErrors,
        QATargetError: "",
      };
      setProjectActivityFormErrors(formErrors);
    }
  };
  //#endregion

  //#region Add to Project Activities List
  const AddToProjectActivityList = (e) => {
    e.preventDefault();

    if (handleProjectActivityFormValidation()) {
      const newProjectActivity = {
        Activity: selectedProjectActivity,
        NoOfSKUs: parseInt(NoOfSKUs, 10),
        ProductionTarget: parseInt(productionTarget, 10),
        QCTarget: parseInt(QCTarget, 10),
        QATarget: parseInt(QATarget, 10),
      };
      const updatedProjectActivityDetails = [
        ...projectActivityDetails,
        newProjectActivity,
      ];
      const updatedFormErrors = {
        ...formErrors,
        projectActivityTargetError: "",
      };
      setProjectActivityDetails(updatedProjectActivityDetails);
      setFormErrors(updatedFormErrors);
      setShowModal(false);
      setSelectedProjectActivity("");
      setNoOfSKUs("");
      setProductionTarget("");
      setQCTarget("");
      setQATarget("");
    }
  };
  //#endregion

  //#region Uploading Delivery Plan File
  const uploadDeliveryPlanFile = (e) => {
    setWaitingMessageForPlannedDeliveryFile(true);
    const files = e.target.files;
    const currentFile = files[0];
    const fileNameUploaded = files[0].name;
    setDeliveryPlanFileUploadedName(fileNameUploaded);
    const formData = new FormData();
    formData.append("File", currentFile);
    setSpinnerMessage("Please wait while uploading delivery plan file...");
    setLoading(true);
    projectService
      .saveFileupload(formData)
      .then((response) => {
        setWaitingMessageForPlannedDeliveryFile(false);
        setDeliveryPlanFileName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message, {
          autoClose: false,
        });
        setWaitingMessageForPlannedDeliveryFile(false);
        setDeliveryPlanFileName("");
        setLoading(false);
      });
  };
  //#endregion

  //#region Delete Specific Project Activity Row
  const deleteProjectActivityRow = (rowData) => {
    console.log("Attempting to delete row:", rowData);
    const index = projectActivityDetails.findIndex(
      (item) => item.Activity === rowData.Activity
    );
    console.log("Found index:", index);

    if (index >= 0 && index < projectActivityDetails.length) {
      const updatedProjectActivityDetails = [...projectActivityDetails];
      updatedProjectActivityDetails.splice(index, 1);
      setProjectActivityDetails(updatedProjectActivityDetails);
      console.log(
        "Row deleted successfully. Updated projectActivityDetails:",
        updatedProjectActivityDetails
      );
    } else {
      console.error(`Invalid index: ${index}. Cannot delete project activity row.`);
    }
  };
  //#endregion

  //#region Validating the project Activity Target data
  const handleProjectActivityFormValidation = () => {
    const projectActivity = selectedProjectActivity.trim();
    const NoOfSKUsValue = NoOfSKUs;
    const productionTargetValue = productionTarget;
    const QCTargetValue = QCTarget;
    const QATargetValue = QATarget;

    let formErrors = {};
    let isValidForm = true;

    if (!projectActivity) {
      isValidForm = false;
      formErrors["projectActivityError"] = "Project Activity is required";
    }

    if (!NoOfSKUsValue) {
      isValidForm = false;
      formErrors["NoOfSKUsError"] = "No. of SKUs is required";
    } else if (parseInt(NoOfSKUsValue, 10) > parseInt(inputCount, 10)) {
      isValidForm = false;
      formErrors["NoOfSKUsError"] = "No. of SKUs cannot be more than input count";
    }

    if (!productionTargetValue) {
      isValidForm = false;
      formErrors["productionTargetError"] = "Production Target is required";
    }

    if (!QCTargetValue) {
      isValidForm = false;
      formErrors["QCTargetError"] = "QC Target is required";
    }

    if (!QATargetValue) {
      isValidForm = false;
      formErrors["QATargetError"] = "QA Target is required";
    }

    if (
      projectActivityDetails.some(
        (details) => details.Activity === projectActivity
      )
    ) {
      isValidForm = false;
      formErrors["duplicateProjectActivityError"] = "Project Activity already exists";
    }

    setProjectActivityFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const formErrors = {};
    let isValidForm = true;

    if (!selectedCustomer.trim()) {
      isValidForm = false;
      formErrors["customerCodeError"] = "Customer Code is required";
    }

    if (!projectType.trim()) {
      isValidForm = false;
      formErrors["projectTypeError"] = "Project Type is required";
    }

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

    if (!selectedDepartment.trim()) {
      isValidForm = false;
      formErrors["selectedDepartmentError"] = "Department is required";
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

    if (selectedDeliveryMode === "S" && (!plannedDeliveryDate || new Date(plannedDeliveryDate) < new Date(plannedStartDate))) {
      isValidForm = false;
      formErrors["plannedDeliveryDateError"] =
        "Planned Delivery Date is required and cannot be earlier than Planned Start Date";
    }

    if (!customerInputFileName) {
      isValidForm = false;
      formErrors["customerInputFileError"] = "Customer Input File is required";
    }

    if (!scope.trim() && !scopeFileName.trim()) {
      isValidForm = false;
      formErrors["scopeError"] = "Either Scope or Scope File is required";
    }

    if (!guideline.trim() && !guidelineFileName.trim()) {
      isValidForm = false;
      formErrors["guidelineError"] = "Either Guideline or Guideline File is required";
    }

    if (!checklist.trim() && !checklistFileName.trim()) {
      isValidForm = false;
      formErrors["checklistError"] = "Either Checklist or Checklist File is required";
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

  //#region Save Project
  // const saveProject = (e) => {
  //   e.preventDefault();

  //   if (!helper.getUser()) {
  //     history.push({ pathname: "/" });
  //     return;
  //   }

  //   if (handleFormValidation()) {
  //     setSpinnerMessage("Please wait while Saving Project...");
  //     setLoading(true);

  //     const data = {
  //       ProjectID: 0,
  //       CustomerCode: selectedCustomer,
  //       ProjectCode: "",
  //       ProjectType: projectType,
  //       LocationCode: "JPN",
  //       TypeOfInput: selectedTypeOfInput,
  //       InputCount: parseInt(inputCount),
  //       InputCountType: selectedInputCountType,
  //       ReceivedDate: receivedDate,
  //       ReceivedFormat: selectedReceivedFormat,
  //       OutputFormat: selectedOutputFormat,
  //       PlannedStartDate: plannedStartDate,
  //       DeliveryMode: selectedDeliveryMode,
  //       PlannedDeliveryDate: plannedDeliveryDate,
  //       DeliveryPlanFileName: deliveryPlanFileName,
  //       IsResourceBased: isResourceBased,
  //       Remarks: remarks,
  //       CustomerInputFileName: customerInputFileName,
  //       Scope: scope,
  //       ScopeFileName: scopeFileName,
  //       Guideline: guideline,
  //       GuidelineFileName: guidelineFileName,
  //       Checklist: checklist,
  //       ChecklistFileName: checklistFileName,
  //       EmailDate: emailDate,
  //       EmailDescription: emailDescription,
  //       UNSPSCVersion: selectedunspcVersion,
  //       MRODictionaryVersion: selectedMroDictionaryVersion,
  //       Department: selectedDepartment,
  //       NoOfBatches: 0,
  //       Status: "InProcess",
  //       Activities: projectActivityDetails,
  //       UserID: helper.getUser(),
  //     };

  //     projectService
  //       .createProject(data)
  //       .then((response) => {
  //         setLoading(false);
  //         toast.success(
  //           `Project Created Successfully, Customer Code: ${selectedCustomer}, Project Code: ${response.data}`
  //         );
  //         setSelectedCustomer("");
  //         history.push({ pathname: "/Projects" });
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         toast.error(error.response.data.Message, { autoClose: false });
  //       });
  //   }
  // };
  const saveProject = (e) => {
    e.preventDefault();
  
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
  
    if (handleFormValidation()) {
      setSpinnerMessage("Please wait while Saving Project...");
      setLoading(true);
  
      const data = {
        ProjectID: 0,
        CustomerCode: selectedCustomer,
        ProjectCode: "",
        ProjectType: projectType,
        LocationCode: "JPN",
        TypeOfInput: selectedTypeOfInput,
        InputCount: parseInt(inputCount),
        InputCountType: selectedInputCountType,
        ReceivedDate: receivedDate,
        ReceivedFormat: selectedReceivedFormat,
        OutputFormat: selectedOutputFormat,
        PlannedStartDate: plannedStartDate,
        DeliveryMode: selectedDeliveryMode,
        PlannedDeliveryDate: plannedDeliveryDate,
        DeliveryPlanFileName: deliveryPlanFileName,
        IsResourceBased: isResourceBased,
        Remarks: remarks,
        CustomerInputFileName: customerInputFileName,
        Scope: scope,
        ScopeFileName: scopeFileName,
        Guideline: guideline,
        GuidelineFileName: guidelineFileName,
        Checklist: checklist,
        ChecklistFileName: checklistFileName,
        EmailDate: emailDate,
        EmailDescription: emailDescription,
        UNSPSCVersion: selectedunspcVersion,
        MRODictionaryVersion: selectedMroDictionaryVersion,
        Department: selectedDepartment,
        NoOfBatches: 0,
        Status: "InProcess",
        Activities: projectActivityDetails,
        UserID: helper.getUser(),
      };
  
      projectService
        .createProject(data)
        .then((response) => {
          setLoading(false);
          toast.success(
            `Project Created Successfully, Customer Code: ${selectedCustomer}, Project Code: ${response.data}`
          );
          setSelectedCustomer("");
          history.push({
            pathname: "/Projects",
            state: { activeTab: 3 }, 
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
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
        accessorKey: "Delete",
        header: "Delete",
        muiTableHeadCellProps: {
          align: "center",
          style: { width: "10%" }
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            width: "10%",
          }
        },
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

          return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <i
                className="fa fa-close"
                onClick={() => deleteProjectActivityRow(row.original)}
                style={deleteIconStyle}
              ></i>
            </div>
          );
        },
      },

    ];
  };
  //#endregion

  //#region Reset the page
  const reset = () => {
    setDeliveryPlanFileKey(Date.now());
    setCustomerInputFileKey(Date.now());
    setScopeFileKey(Date.now());
    setGuidelineFileKey(Date.now());
    setChecklistFileKey(Date.now());
    setLoading(false);
    setSpinnerMessage("");
    setCustomers([]);
    setSelectedCustomer("");
    setProjectType("");
    setSelectedTypeOfInput("");
    setInputCount(0);
    setSelectedInputCountType("");
    setReceivedDate("");
    setInputOutputFormats([]);
    setSelectedReceivedFormat("");
    setSelectedOutputFormat("");
    setPlannedStartDate("");
    setSelectedUnspcVersion("");
    setSelectedDeliveryMode("");
    setPlannedDeliveryDate("");
    setDeliveryPlanFileName("");
    setDeliveryPlanFileUploadedName("");
    setWaitingMessageForPlannedDeliveryFile(false);
    setIsResourceBased(false);
    setCustomerInputFileName("");
    setCustomerInputFileUploadedName("");
    setMessageForCustomerInputFile(false);
    setRemarks("");
    setScope("");
    setScopeFileName("");
    setScopeFileUploadedName("");
    setMessageForScopeFile(false);
    setGuideline("");
    setGuidelineFileName("");
    setGuidelineFileUploadedName("");
    setMessageForGuidelineFile(false);
    setChecklist("");
    setChecklistFileName("");
    setChecklistFileUploadedName("");
    setMessageForChecklistFile(false);
    setEmailDate("");
    setEmailDescription("");
    setProjectActivities([]);
    setSelectedProjectActivity("");
    setNoOfSKUs(0);
    setProductionTarget(0);
    setQCTarget(0);
    setQATarget(0);
    setProjectActivityDetails([]);
    setFormErrors({});
    setProjectActivityFormErrors({});
    setUnspcVersions([]);
    setSelectedDepartment("");
    setDepartmentList([]);
    setShowModal(false);
    setSelectedMroDictionaryVersion("");
    setMroDictionaryVersionsList([]);
    fetchCustomers();
    fetchInputOutputFormats();
    mrodictionaryVersionDropDown();
    fetchUnspcVersionData();
  };
  //#endregion

  //#region Clearing Dates
  const clearEmailDate = () => {
    setEmailDate("");
  };
  const clearPlannedDeliveryDate = () => {
    setPlannedDeliveryDate("");
  }
  const clearPlannedStartDate = () => {
    setPlannedStartDate("");
  }
  const clearReceivedDate = () => {
    setReceivedDate("");
  };
  //#endregion

  let control;
  let DeliveryFileButtons;

  const isDeliveryModeEmptyOrS = selectedDeliveryMode === "" || selectedDeliveryMode === "S";

  if (isDeliveryModeEmptyOrS) {
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
            <div className="form-control date-field-width" style={{ width: "100%" }}>
              <ModernDatepicker
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
            >
              <i
                className="far fa-window-close"
                title="Clear Planned Delivery Date"
              ></i>
            </span>
          </div>
          {formErrors["plannedDeliveryDateError"] && (
            <div className="error-message">
              {formErrors["plannedDeliveryDateError"]}
            </div>
          )}
        </FloatingLabel>
      </div>
    );

    DeliveryFileButtons = null;
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
              className="form-control"
              tabIndex="13"
              id="DeliveryPlanFile"
              name="DeliveryPlanFile"
              key={deliveryPlanFileKey}
              onChange={uploadDeliveryPlanFile}
              accept=".xls, .xlsx, .doc, .docx, .pdf"
            />
          </FloatingLabel>
        </div>
        <div className="d-flex align-items-center gap-2">
          {waitingMessageForPlannedDeliveryFile && (
            <p className="mb-0">Please Wait...</p>
          )}
          {deliveryPlanFileName && (
            <>
              <button
                className="btn btn-secondary mg-l-10"
                onClick={downloadDeliveryPlanFile}
                title="Download File"
                style={{ height: "42px" }}
              >
                <i className="fas fa-download"></i>
              </button>
              <button
                className="btn btn-secondary mg-l-10"
                onClick={deleteDeliveryPlanFile}
                title="Delete File"
                style={{ height: "42px" }}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  //#region main return
  return (
    <div
      className="create-project-page createProjectMainContent"
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
        <div className="cp-main-div">
          <form onSubmit={saveProject} className="cp-form createProject-data">
            <div className="cp-breadcome-header">
              <div className="az-content-breadcrumb mg-t-20">
                <span>Project</span>
                <span>Create Project</span>
              </div>
              <h4
                className="d-flex align-items-center"
                style={{ width: "25%" }}
              >
                Create Project{" "}
                <span className="icon-size mg-l-5">
                  <i
                    className="far fa-arrow-alt-circle-left text-primary pointer"
                    tabIndex="1"
                    onClick={() => history.goBack()}
                    title="Back to List"
                  ></i>
                </span>
              </h4>
            </div>
            <div id="Add_Project" className="cp-container">
              <div className="row row-sm">
                <div className="col-lg-6">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          Customer Code <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="2"
                        id="CustomerCode"
                        name="CustomerCode"
                        value={selectedCustomer}
                        onChange={onChangeCustomer}
                        placeholder="--Select--"
                      >
                        <option value="">--Select--</option>
                        {customers.map((customers) => (
                          <option key={customers.CustomerCode}>
                            {customers.CustomerCode}
                          </option>
                        ))}
                      </select>
                    </FloatingLabel>
                    <div className="error-message">
                      {formErrors.customerCodeError}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
                  <div className="form-field-div">
                    <label>
                      Project Type{" "}
                      <span className="text-danger asterisk-size">*</span>
                    </label>
                    <div className="form-field-div flex-grow-1">
                      <input
                        type="radio"
                        value="P"
                        tabIndex="3"
                        id="ProjectType"
                        name="ProjectType"
                        checked={projectType === "P"}
                        onChange={onChangeProjectType}
                      />
                      <label className="checkbox-inline mg-l-10">Pilot</label>
                      <input
                        type="radio"
                        value="R"
                        className="mg-l-20"
                        tabIndex="4"
                        id="ProjectType"
                        name="ProjectType"
                        checked={projectType === "R"}
                        onChange={onChangeProjectType}
                      />
                      <label className="checkbox-inline mg-l-10">Regular</label>
                    </div>
                  </div>
                  <div className="error-message">
                    {formErrors["projectTypeError"]}
                  </div>
                </div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6 mg-b-5">
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={<>Location</>}
                      className="float-hidden float-select"
                    >
                      <input
                        type="text"
                        className="form-control flex-grow-1"
                        value="JPN"
                        readOnly
                        onChange={() => ""}
                      />
                      <div className="error-message"></div>
                    </FloatingLabel>
                  </div>
                </div>
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
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
                        tabIndex="5"
                        id="TypeOfInput"
                        name="TypeOfInput"
                        value={selectedTypeOfInput}
                        onChange={onChangeTypeOfInput}
                      >
                        <option value="">--Select--</option>
                        <option key="Single" value="S">
                          Single
                        </option>
                        <option key="Recurring" value="R">
                          Recurring
                        </option>
                      </select>
                      <div className="error-message">
                        {formErrors["typeOfInputError"]}
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
                          Input Count <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <input
                        type="number"
                        className="form-control flex-grow-1"
                        tabIndex="6"
                        id="InputCount"
                        name="InputCount"
                        value={inputCount}
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
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
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
                        tabIndex="7"
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
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
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
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
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
                        tabIndex="9"
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
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
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
                        tabIndex="10"
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
                <div className="col-lg-6 mg-t-10 mg-lg-t-0">
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
                <div className="col-lg mg-t-10 mg-lg-t-0"></div>
              </div>
              <br />
              <div className="row row-sm">
                <div className="col-lg-6">
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
                        tabIndex="12"
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
                <div className="col-lg-6 mg-t-10 mg-lg-t-0 ">
                  <div className="">
                    {control}
                    <div className="">{DeliveryFileButtons}</div>
                  </div>
                </div>
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
                        label={
                          <>
                            Customer Input File{" "}
                            <span className="text-danger">*</span>
                          </>
                        }
                        className="float-hidden float-select"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="15"
                          id="CustomerInputFile"
                          name="CustomerInputFile"
                          key={customerInputFileKey}
                          onChange={uploadCustomerInputFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
                        <div className="error-message">
                          {formErrors["customerInputFileError"]}
                        </div>
                      </FloatingLabel>
                    </div>
                    <div className="d-flex">
                      {messageForCustomerInputFile && <p>Please Wait...</p>}
                      {customerInputFileName && (
                        <>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={downloadCustomerInputFile}
                          >
                            <i className="fas fa-download"></i>
                          </span>
                          <span
                            className="btn btn-secondary mg-l-10"
                            style={{ height: "42px" }}
                            onClick={deleteCustomerInputFile}
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
                      label={<>Remarks</>}
                      className="float-hidden float-select"
                    >
                      <textarea
                        className="form-control flex-grow-1"
                        rows="2"
                        tabIndex="16"
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
                  <div className="createProjectFloatingInput">
                    <FloatingLabel
                      label={
                        <>
                          MRO Dictionary Version{" "}
                          <span className="text-danger">*</span>
                        </>
                      }
                      className="float-hidden float-select"
                    >
                      <select
                        className="form-control flex-grow-1"
                        tabIndex="9"
                        id="ReceivedFormat"
                        name="ReceivedFormat"
                        value={selectedMroDictionaryVersion || ""}
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
                    </FloatingLabel>
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
                        tabIndex="17"
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
                        className="float-hidden float-select"
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="18"
                          id="ScopeFile"
                          name="ScopeFile"
                          key={scopeFileKey}
                          onChange={uploadScopeFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
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
                        tabIndex="19"
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
                        className="float-hidden float-select"
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="20"
                          id="GuidelineFile"
                          name="GuidelineFile"
                          key={guidelineFileKey}
                          onChange={uploadGuidelineFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
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
                        tabIndex="21"
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
                        className="float-hidden float-select"
                      >
                        <input
                          type="file"
                          className="form-control flex-grow-1"
                          tabIndex="22"
                          id="ChecklistFile"
                          name="ChecklistFile"
                          key={checklistFileKey}
                          onChange={uploadChecklistFile}
                          accept=".xls, .xlsx,.doc,.docx,.pdf"
                        />
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
                        tabIndex="24"
                        id="emailDescription"
                        name="emailDescription"
                        maxLength="4000"
                        value={emailDescription}
                        onChange={onChangeEmailDescription}
                      ></textarea>
                    </FloatingLabel>
                  </div>
                </div>
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
                      label={
                        <>
                          Department <span className="text-danger">*</span>
                        </>
                      }
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
                        {formErrors["selectedDepartmentError"]}
                      </div>
                    </FloatingLabel>
                  </div>
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
                    tabIndex="25"
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
                    tabIndex="27"
                    value="Save"
                  />
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-2  mg-t-10 mg-lg-t-0">
                  <span
                    className="btn btn-gray-700 btn-block"
                    tabIndex="28"
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
                            tabIndex="2"
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
                            className="form-control"
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
                            className="form-control"
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
                />
                <Button variant="secondary" onClick={handleNo}>
                  Cancel
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}
export default CreateProject;