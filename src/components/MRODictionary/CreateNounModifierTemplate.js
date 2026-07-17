import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@mui/material";
import "./CreateNounModifierTemplateNew.scss";
import helper from "../../helpers/helpers";
import { Row, Col, Modal, Button } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import mroDictionaryService from "../../services/mroDictionary.service";
import { CSVLink } from "react-csv";
import projectService from "../../services/project.service";

toast.configure();

class CreateNounModifierTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionNameOrNo: "",
      mrodictionaryversionslist: [],

      noun: "",
      modifier: "",
      nounDefinition: "",
      nounModifierDefinitionOrGuidelines: "",

      synonym: "",
      synonymDefinitionOrGuidelines: "",
      synonymColumns: this.synonymTable().synonymColumns,
      synonymData: this.synonymTable().synonymData,
      synonymModal: false,

      attributeName: "",
      attributeGuidelines: "",
      priority: "",
      mandatory: "",
      attributeColumns: this.attributeTable().attributeColumns,
      attributeData: [],
      attributeModal: false,

      enumeratedVaildValue: "",
      attributeValues: [],
      attributeEvvColumns: this.attributeEvvTable().attributeEvvColumns,
      attributeEvvData: this.attributeEvvTable().attributeEvvData,
      attributeEVVModal: false,

      unspscVersion: "",
      unspscCode: "",
      unspscCategory: "",
      unspscVersions: [],
      unspscCategories: [],
      selectedUNSPSCVersion: "",
      selectedCategory: "",
      selectedNounModifierImages: [],
      unspscColumns: this.unspscTable().unspscColumns,
      unspscData: this.unspscTable().unspscData,
      unspscModal: false,

      uploadedFileName: "",
      imageFileNamesList: [],
      nounModifierImageColumns:
        this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData:
        this.nounModifierImageTable().nounModifierImageData,
      nounModifierImageModal: false,

      loading: false,
      spinnerMessage: "",
      validationErrors: {
        noun: "",
        modifier: "",
        versionNameOrNo: "",
      },

      formErrors: {},
      UserID: helper.getUser(),
      activeRowId: null,
    };

    this.onChangeAttributeName = this.onChangeAttributeName.bind(this);
    this.onChangeUnspscVersion = this.onChangeUnspscVersion.bind(this);
    this.onChangeUnspscCategory = this.onChangeUnspscCategory.bind(this);
    this.onChangeMroDictionaryVersion = this.onChangeMroDictionaryVersion.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.addImageToList = this.addImageToList.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.fileInputRef = React.createRef();
    this.createNounModifierTemplateReset = this.createNounModifierTemplateReset.bind(this);
  }

  //#region createNounModifierTemplateReset the page
  createNounModifierTemplateReset() {
   
    this.setState({

      versionNameOrNo: "",
      noun: "",
      modifier: "",
      nounDefinition: "",
      nounModifierDefinitionOrGuidelines: "",
      synonym: "",
      synonymDefinitionOrGuidelines: "",
      synonymColumns: this.synonymTable().synonymColumns,
      synonymData: this.synonymTable().synonymData,
      synonymModal: false,
      attributeName: "",
      attributeGuidelines: "",
      priority: "",
      mandatory: "",
      attributeColumns: this.attributeTable().attributeColumns,
      attributeData: [],
      attributeModal: false,
      enumeratedVaildValue: "",
      attributeValues: [],
      attributeEvvColumns: this.attributeEvvTable().attributeEvvColumns,
      attributeEvvData: this.attributeEvvTable().attributeEvvData,
      attributeEVVModal: false,
      unspscVersion: "",
      unspscCode: "",
      unspscCategory: "",
      selectedUNSPSCVersion: "",
      selectedCategory: "",
      selectedNounModifierImages: [],
      addedNounModifierImages:[],
      unspscColumns: this.unspscTable().unspscColumns,
      unspscData: this.unspscTable().unspscData,
      uploadedFileName: "",
      imageFileNamesList: [],
      nounModifierImageColumns:
        this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData:
        this.nounModifierImageTable().nounModifierImageData,
      nounModifierImageModal: false,
      
      validationErrors: {
        noun: "",
        modifier: "",
        versionNameOrNo: "",
      },

    });
  }
  //#endregion

  // #region Method to handle input change
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    if (value) {
      this.setState((prevState) => ({
        validationErrors: {
          ...prevState.validationErrors,
          [name]: "",
        },
      }));
    }
  };
  //#endregion

  onChangeAttributeName = (e) => {
    this.setState({ attributeName: e.target.value });
  };

  onChangeUnspscVersion = (event) => {
    const selectedVersion = event.target.value;
    const { unspscData } = this.state;
    const isDuplicate = unspscData.some(
      item => item.UNSPSCVersion === selectedVersion
    );
    if (isDuplicate) {
      toast.error("This UNSPSC Version already exists.");
      return;
    }
    this.setState(
      {
        selectedUNSPSCVersion: selectedVersion,
        selectedCategory: "",
      },
      () => {
        this.fetchUnspscVersionCategoryData();
      }
    );
  };

  onChangeUnspscCategory = (event) => {
    this.setState({ selectedCategory: event.target.value });
  };

  // #region Synonym Table Columns
  synonymTable() {
    const synonymColumns = [
      {
        accessorKey: "synonym",
        header: "Synonym",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "20%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "synonymDefinitionOrGuidelines",
        header: "Synonym Definition / Guidelines",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "72%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
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
          align: "left",
        },
        Cell: ({ row }) => (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <i
              className="fa fa-close pointer"
              title="Delete Version"
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
              onClick={() => this.handleSynonymDelete(row.index)}
            ></i>
          </div>
        ),
      },
    ];
    const synonymData = [];
    return { synonymColumns, synonymData };
  }

  attributeTable() {
    const attributeColumns = [
      {
        accessorKey: "attributeName",
        header: "Attribute Name",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "20%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "attributeGuidelines",
        header: "Attribute Guidelines",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "60%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "mandatoryOrOptional",
        header: "Mandatory / Optional",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "30%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
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
          >
            <i
              className="fa fa-close pointer"
              title="Delete Attribute"
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
              onClick={() => this.handleAttributeDelete(row.index)}
            ></i>
          </div>
        ),
      },
    ];
    const attributeData = [];
    return { attributeColumns, attributeData };
  }

  attributeEvvTable() {
    const attributeEvvColumns = [
      {
        accessorKey: "attributeName",
        header: "Attribute Name",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "20%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "enumeratedVaildValue",
        header: "Enumerated Vaild Value (EVV)",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "60%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
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
          >
            <i
              className="fa fa-close pointer"
              title="Delete Attribute Value"
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
              onClick={() => this.handleAttributeEvvDelete(row.index)}
            ></i>
          </div>
        ),
      },
    ];
    const attributeEvvData = [];
    return { attributeEvvColumns, attributeEvvData };
  }

  unspscTable() {
    const unspscColumns = [
      {
        accessorKey: "UNSPSCVersion",
        header: "UNSPSC Version",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "20%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "UNSPSCCode",
        header: "UNSPSC Code",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "15%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "UNSPSCCategory",
        header: "UNSPSC Category",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "65%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
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
          >
            <i
              className="fa fa-close pointer"
              title="Delete UNSPSC Version"
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
              onClick={() => this.handleUnspscDelete(row.index)}
            ></i>
          </div>
        ),
      },
    ];

    const unspscData = [];
    return { unspscColumns, unspscData };
  }

  nounModifierImageTable = () => {
    const { addedNounModifierImages = [] } = this.state || {};
    const nounModifierImageColumns = [
      {
        accessorKey: "Data",
        header: "Image",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "90%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            width: "90%",
          },
        },
        Cell: ({ row }) => {
          const { Data, ImageTempFileName } = row.original;
          const imageSrc = Data ? `data:image/*;base64,${Data}` : "";
          const fileName = ImageTempFileName || "No File Name";
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={fileName}
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span>No Image Available</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "Delete",
        header: "Delete",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "10%",
          },
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
              this.handleDeleteImage(row.original.Data, row.original.Name)
            }
          >
            <i
              className="fa fa-close pointer"
              title="Delete Image"
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
    const nounModifierImageData = addedNounModifierImages.map((image) => ({
      Name: image.Name,
      Data: image.Data,
    }));
    return { nounModifierImageColumns, nounModifierImageData };
  };
  //#endregion

  // #region Synonym Data deletion
  handleSynonymDelete = (rowIndex) => {
    this.setState((prevState) => {
      const updatedData = prevState.synonymData.filter(
        (item, index) => index !== rowIndex
      );
      return { synonymData: updatedData };
    });
  };
  //#endregion

  // #region Attribute Data deletion
  handleAttributeDelete = (rowIndex) => {
    let isExist = this.state.attributeEvvData.some(
      (item, index) => index === rowIndex
    );

    if (isExist) {
      toast.error("Cannot delete Attribute when Attribute Value exists");
      return;
    }

    this.setState((prevState) => {
      const updatedData = prevState.attributeData.filter(
        (item, index) => index !== rowIndex
      );
      return { attributeData: updatedData };
    });
  };
  //#endregion

  // #region Attribute Evv Data deletion
  handleAttributeEvvDelete = (rowIndex) => {
    this.setState((prevState) => {
      const updatedData = prevState.attributeEvvData.filter(
        (item, index) => index !== rowIndex
      );
      return { attributeEvvData: updatedData };
    });
  };
  //#endregion

  // #region UNSPSC Data deletion
  handleUnspscDelete = (rowIndex) => {
    this.setState((prevState) => {
      const updatedData = prevState.unspscData.filter(
        (item, index) => index !== rowIndex
      );
      return { unspscData: updatedData };
    });
  };
  //#endregion

  //#region all modals Add To List methods
  addSynonym = () => {
    const { versionNameOrNo, noun, modifier } = this.state;
    if (!versionNameOrNo || !noun || !modifier) {
      toast.error(
        "Version Name / No., Noun, and Modifier are required fields.",
        {
          autoClose: false,
        }
      );
      return;
    }
    this.setState({ synonymModal: true });
  };

  addAttribute = () => {
    const { versionNameOrNo, noun, modifier } = this.state;
    if (!versionNameOrNo || !noun || !modifier) {
      toast.error(
        "Version Name / No., Noun, and Modifier are required fields.",
        {
          autoClose: false,
        }
      );
      return;
    }
    this.setState({ attributeModal: true });
  };

  addAttributeEVV = () => {
    const { versionNameOrNo, noun, modifier } = this.state;
    if (!versionNameOrNo || !noun || !modifier) {
      toast.error(
        "Version Name / No., Noun, and Modifier are required fields.",
        {
          autoClose: false,
        }
      );
      return;
    }
    this.setState({ attributeEVVModal: true });
  };

  addUNSPSC = () => {
    const { versionNameOrNo, noun, modifier } = this.state;
    if (!versionNameOrNo || !noun || !modifier) {
      toast.error(
        "Version Name / No., Noun, and Modifier are required fields.",
        {
          autoClose: false,
        }
      );
      return;
    }
    this.setState({ unspscModal: true });
  };

  addImage = () => {
    const { versionNameOrNo, noun, modifier } = this.state;
    if (!versionNameOrNo || !noun || !modifier) {
      toast.error(
        "Version Name / No., Noun, and Modifier are required fields.",
        {
          autoClose: false,
        }
      );
      return;
    }
    this.setState({ nounModifierImageModal: true });
  };
  //#endregion

  //#region all modals Cancel Add To List methods
  synonymCancel = () => {
    this.setState({
      synonymModal: false,
      synonym: "",
      synonymDefinitionOrGuidelines: "",
    });
  };

  attributeCancel = () => {
    this.setState({
      attributeModal: false,
      attributeName: "",
      attributeGuidelines: "",
      mandatoryOrOptional: "",
      priority: "",
    });
  };

  attributeEvvCancel = () => {
    this.setState({
      attributeEVVModal: false,
      attributeName: "",
      priority: "",
      enumeratedVaildValue: "",
    });
  };

  unspscCancel = () => {
    this.setState({
      unspscModal: false,
      selectedUNSPSCVersion: "",
      selectedCategory: "",
    });
  };

  nounModifierImageCancel = () => {
    this.setState({
      nounModifierImageModal: false,
    });
  };
  //#endregion

  //#region Component Did Mount
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      if (!helper.getUser()) {
        this.props.history.push({
          pathname: "/",
        });
        return;
      }

      window.scrollTo(0, 0);
      this.mrodictionaryVersionDropDown();
      this.fetchUnspscVersionData();
      this.fetchUnspscVersionCategoryData();
    }
  }
  //#endregion

  // #region Handle change event for the MRO Dictionary Version dropdown
  onChangeMroDictionaryVersion = (e) => {
    const { value } = e.target;
    this.setState({
      versionNameOrNo: value,
    });

    if (value) {
      this.setState((prevState) => ({
        validationErrors: {
          ...prevState.validationErrors,
          versionNameOrNo: "",
        },
      }));
    }
  };

  //#region Fetch the MRO Dictionary Versions
  mrodictionaryVersionDropDown = () => {
    this.setState({
      spinnerMessage: "Please wait while loading MRO Dictionary Versions...",
      loading: true,
    });

    mroDictionaryService
      .readMRODictionariesList()
      .then((response) => {
        this.setState({
          mrodictionaryversionslist: response.data,
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({ loading: false });
        toast.error(e.response?.data?.Message || "Failed to load data", {
          autoClose: false,
        });
      });
  };
  //#endregion

  //#region Add the Synonym data
  handleSynonymAddToList = () => {
    const { synonym, synonymDefinitionOrGuidelines, synonymData } = this.state;
    if (!synonym) {
      toast.error("Synonym is required.");
      return;
    }
    const SynonymDetails = synonymData.find(a => a.synonym.toLowerCase() === synonym.toLowerCase());
    if (SynonymDetails) {
      toast.error("This Synonym already exist.");
      return;
    }
    const newEntry = {
      id: synonymData.length + 1,
      synonym: synonym,
      synonymDefinitionOrGuidelines: synonymDefinitionOrGuidelines,
    };
    this.setState({
      synonymData: [...synonymData, newEntry],
      synonym: "",
      synonymDefinitionOrGuidelines: "",
      synonymModal: false,
    });
  };
  //#endregion

  //#region Add the Attribute data
  handleattributeAddToList = () => {
    const {
      attributeData,
      attributeName,
      attributeGuidelines,
      priority,
      mandatoryOrOptional,
    } = this.state;
    if (
      !attributeName ||
      !attributeGuidelines ||
      !priority ||
      !mandatoryOrOptional
    ) {
      toast.error(
        "Attribute, Attribute Guidelines, Priority and, Mandatory Or Optional are required."
      );
      return;
    }
    const AttributeDetails = attributeData.find(a => a.attributeName.toLowerCase() === attributeName.toLowerCase());
    if (AttributeDetails) {
      toast.error("This Attribute already exist.");
      return;
    }
    const newEntry = {
      id: attributeData.length + 1,
      attributeName: attributeName,
      attributeGuidelines: attributeGuidelines,
      priority: priority,
      mandatoryOrOptional: mandatoryOrOptional,
    };
    this.setState({
      attributeData: [...attributeData, newEntry],
      attributeName: "",
      attributeGuidelines: "",
      priority: "",
      mandatoryOrOptional: "",
      attributeModal: false,
    });
  };
  //#endregion

  //#region Add the Attribute Enumerated EVV data
  handleattributeevvAddToList = () => {
    const { attributeEvvData, attributeName, enumeratedVaildValue, priority } =
      this.state;
    if (!attributeName || !enumeratedVaildValue || !priority) {
      toast.error(
        "Attribute, Enumerated Vaild Value and, Priority are required."
      );
      return;
    }
    const AttributeEvvDetails = attributeEvvData.find(a => a.enumeratedVaildValue.toLowerCase() === enumeratedVaildValue.toLowerCase());
    if (AttributeEvvDetails) {
      toast.error("This Enumerated Vaild Value already exist.");
      return;
    }
    const newEntry = {
      id: attributeEvvData.length + 1,
      attributeName: attributeName,
      enumeratedVaildValue: enumeratedVaildValue,
      priority: priority,
    };
    this.setState({
      attributeEvvData: [...attributeEvvData, newEntry],
      attributeName: "",
      enumeratedVaildValue: "",
      priority: "",
      synonymModal: false,
      attributeModal: false,
      attributeEVVModal: false,
    });
  };
  //#endregion

  //#region Add the UNSPSC data
  handleUnspscAddToList = () => {
    const {
      selectedUNSPSCVersion,
      selectedCategory,
      unspscCategories,
      unspscData,
    } = this.state;
    if (!selectedUNSPSCVersion || !selectedCategory) {
      toast.error(
        "UNSPSCVersion, UNSPSCCode, and UNSPSCCategory are required."
      );
      return;
    }
    const selectedCategoryData = unspscCategories.find(
      (cat) => cat.Code === selectedCategory
    );
    if (selectedCategoryData) {
      const isDuplicate = unspscData.some(
        (item) => item.UNSPSCVersion === selectedUNSPSCVersion
      );
      if (isDuplicate) {
        toast.error("This UNSPSC Version already exist.");
        return;
      }
      const newData = {
        UNSPSCVersion: selectedUNSPSCVersion,
        UNSPSCCode: selectedCategoryData.Code,
        UNSPSCCategory: selectedCategoryData.Category,
      };
      this.setState((prevState) => ({
        unspscData: [...prevState.unspscData, newData],
        selectedUNSPSCVersion: "",
        selectedCategory: "",
        unspscModal: false,
      }));
    }
  };
  //#endregion

  //#region Fetch UNSPSC Versions
  fetchUnspscVersionData = () => {
    this.setState({
      loading: true,
      spinnerMessage: "Please wait while fetching UNSPSC version data...",
    });
    mroDictionaryService
      .readUNSPSCVersions()
      .then((resp) => {
        this.setState({
          unspscVersions: resp.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch UNSPSC Version Categories
  fetchUnspscVersionCategoryData = () => {
    const { selectedUNSPSCVersion } = this.state;
    if (!selectedUNSPSCVersion) return;

    this.setState({
      loading: true,
      spinnerMessage: "Please wait while fetching Version Category data...",
    });

    mroDictionaryService
      .readAllCategoriesOfSelecetdUNSPSCVersion(selectedUNSPSCVersion)
      .then((response) => {
        this.setState({
          unspscCategories: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching UNSPSC categories:", error);
        this.setState({
          loading: false,
          error: "Failed to load categories",
        });
      });
  };
  //#endregion

  //#region uplaod the image input file
  uploadInputFile = (e) => {
    let files = e.target.files;
    let currentFile = files[0];
    let fileName = currentFile.name;

    this.setState({
      messageForSelectedInputFile: true,
      uploadedFileName: fileName,
      spinnerMessage: "Please wait while reading file data...",
      loading: true,
    });

    let formData = new FormData();
    formData.append("File", currentFile);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        const uploadedFileName = response.data;
        let newEntry = [...this.state.selectedNounModifierImages];
        newEntry.push(uploadedFileName);
        this.setState({
          selectedNounModifierImages: newEntry,
        });
      })
      .catch((error) => {
        console.error("File upload failed:", error);
        toast.error(error.response?.data?.Message || "File upload failed");
      })
      .finally(() => {
        this.setState({
          messageForSelectedInputFile: false,
          loading: false,
        });
      });

    if (e.target.value) {
      this.setState((prevState) => ({
        formErrors: {
          ...prevState.formErrors,
          selectedInputFileError: "",
        },
      }));
    }
  };
  //#endregion

  //#region add the image to list
  addImageToList = () => {
    const { selectedNounModifierImages, uploadedFileName } = this.state;
    if (!uploadedFileName) {
      toast.error("Please select an image to upload.");
      return;
    }
    mroDictionaryService
      .readAllImagesFromTempFolder(selectedNounModifierImages)
      .then((response) => {
        this.setState({
          addedNounModifierImages: response.data,
          uploadedFileName: "",
          nounModifierImageModal: false,
        });
        if (this.fileInputRef.current) {
          this.fileInputRef.current.value = null;
        }
      })
      .catch((error) => {
        toast.error("Failed to upload image. Please try again.");
      });
  };
  //#endregion

  handleDeleteImage = (fileData, fileName) => {
    const filteredImages = this.state.addedNounModifierImages.filter(
      (img) => img.Data !== fileData
    );
    const filteredselectedImages = this.state.selectedNounModifierImages.filter(
      (img) => img !== fileName
    );

    this.setState({
      addedNounModifierImages: filteredImages,
      selectedNounModifierImages: filteredselectedImages,
    });
  };


  //#region Create Noun-Modifier Template
  handleSave = () => {
    const {
      versionNameOrNo,
      noun,
      modifier,
      nounDefinition,
      nounModifierDefinitionOrGuidelines,
      synonymData,
      attributeData,
      attributeEvvData,
      unspscData,
      addedNounModifierImages,
    } = this.state;
    const validationErrors = {};
    if (!versionNameOrNo) {
      validationErrors.versionNameOrNo =
        "MRO Dictionary Version Name / No. is required";
    }
    if (!noun) {
      validationErrors.noun = "Noun is required";
    }
    if (!modifier) {
      validationErrors.modifier = "Modifier is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      this.setState({ validationErrors });
      return;
    }

    this.setState({ validationErrors: {} });
    const sendData = Array.isArray(addedNounModifierImages)
      ? addedNounModifierImages.map((image) => ({
          Name: image.Name,
        }))
      : [];
    const data = {
      versionNameOrNo,
      noun,
      Modifier: modifier,
      NounDefinition: nounDefinition || "",
      NounModifierDefinitionOrGuidelines: nounModifierDefinitionOrGuidelines,
      NounSynonyms: synonymData.map((item) => ({
        Synonym: item.synonym,
        SynonymDefinitionOrGuidelines: item.synonymDefinitionOrGuidelines,
      })),
      NounModifierAttributes: attributeData.map((item) => ({
        Attribute: item.attributeName,
        AttributeGuidelines: item.attributeGuidelines,
        Priority: item.priority,
        MandatoryOrOptional: item.mandatoryOrOptional,
      })),
      NounModifierAttributeEVVs: attributeEvvData.map((item) => ({
        Attribute: item.attributeName,
        EnumeratedValidValue: item.enumeratedVaildValue,
        Priority: item.priority,
      })),
      NounModifierUNSPSCs: unspscData.map((item) => ({
        UNSPSCVersion: item.UNSPSCVersion,
        UNSPSCCode: item.UNSPSCCode,
        UNSPSCCategory: item.UNSPSCCategory,
      })),
      ImageFileNames: sendData.map((image) => image.Name),
      UserID: helper.getUser(),
    };
    mroDictionaryService
      .createNounModifierTemplate(data)
      .then((response) => {
        toast.success("Noun-Modifier Template Created successfully.");
        this.setState({
          versionNameOrNo: "",
          noun: "",
          modifier: "",
          nounDefinition: "",
          nounModifierDefinitionOrGuidelines: "",
          synonymData: [],
          attributeData: [],
          attributeEvvData: [],
          unspscData: [],
          addedNounModifierImages: [],
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Handle All CSV Export
  handleSynonymCSVExport = () => {
    if (this.csvLinkSynonym) {
      this.csvLinkSynonym.link.click();
    }
  };

  handleAttributeCSVExport = () => {
    if (this.csvLinkAttribute) {
      this.csvLinkAttribute.link.click();
    }
  };

  handleAttributeEVVCSVExport = () => {
    if (this.csvLinkAttributeEvv) {
      this.csvLinkAttributeEvv.link.click();
    }
  };

  handleUNSPSCCSVExport = () => {
    if (this.csvLinkUnspsc) {
      this.csvLinkUnspsc.link.click();
    }
  };
  //#endregion

  //#region All tables CSV Export Columns
  getTransformedSynonymDataForExport = () => {
    const { synonymData } = this.state;
    return synonymData.map((row) => ({
      synonym: row.synonym,
      synonymDefinitionOrGuidelines: row.synonymDefinitionOrGuidelines,
    }));
  };

  getTransformedAttributeDataForExport = () => {
    const { attributeData } = this.state;
    return attributeData.map((row) => ({
      attributeName: row.attributeName,
      attributeGuidelines: row.attributeGuidelines,
      priority: row.priority,
      mandatoryOrOptional: row.mandatoryOrOptional,
    }));
  };

  getTransformedAttributeEvvDataForExport = () => {
    const { attributeEvvData } = this.state;
    return attributeEvvData.map((row) => ({
      attributeName: row.attributeName,
      enumeratedVaildValue: row.enumeratedVaildValue,
      priority: row.priority,
    }));
  };

  getTransformedUnspscDataForExport = () => {
    const { unspscData } = this.state;
    return unspscData.map((row) => ({
      UNSPSCVersion: row.UNSPSCVersion,
      UNSPSCCode: row.UNSPSCCode,
      UNSPSCCategory: row.UNSPSCCategory,
    }));
  };
  //#endregion

  //#region Render
  render() {
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    const { versionNameOrNo, noun, modifier } = this.state;
    const {
      synonymModal,
      attributeModal,
      attributeEVVModal,
      unspscModal,
      nounModifierImageModal,
      synonym,
      synonymDefinitionOrGuidelines,
      attributeName,
      attributeGuidelines,
      priority,
      enumeratedVaildValue,
      unspscCategories,
      uploadedFileName,
      selectedCategory,
      selectedUNSPSCVersion,
    } = this.state;

    const {
      synonymColumns,
      synonymData,
      attributeColumns,
      attributeData,
      attributeEvvColumns,
      attributeEvvData,
      unspscColumns,
      unspscData,
    } = this.state;
    return (
      <div
        style={setHeight(93)}
        className="production-update-main createNounTemplateContent"
      >
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
          <Row className="mg-l-10 mg-r-15 prdupdlst mg-t-0">
            <Col
              lg={12}
              style={{
                maxWidth: "100%",
                paddingLeft: "15px",
                paddingRight: "10px",
              }}
            >
              <div className="production-update-header">
                {this.state.isStatusUpdating && (
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
              </div>
              <div
                style={{ border: "1px solid #cdd4e0" }}
                className="mg-l-0 mg-r-0 mg-t-5"
              >
                <div className="row mg-r-15 mg-l-5 mg-t-15 mg-b-0">
                  <div className="col-lg-4">
                    <div className="createnm mroDictionayViewrVersionSelected">
                      <FloatingLabel
                        label="MRO Dictionary Version Name / No."
                        className="float-hidden float-select"
                      >
                        <select
                          className="form-control"
                          id="version"
                          name="version"
                          value={versionNameOrNo || ""}
                          onChange={this.onChangeMroDictionaryVersion}
                        >
                          <option>
                            ---Select MRO Dictionary Version Name / No.---
                          </option>
                          {this.state.mrodictionaryversionslist.map((opt) => (
                            <option
                              key={opt.versionNameOrNo}
                              value={opt.versionNameOrNo}
                            >
                              {opt.VersionNameOrNo}
                            </option>
                          ))}
                        </select>
                      </FloatingLabel>
                      <span className="text-danger asterisk-size ml-2">*</span>
                    </div>
                    {this.state.validationErrors.versionNameOrNo && (
                      <div className="text-danger">
                        {this.state.validationErrors.versionNameOrNo}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-4">
                    <div className="createnm mroDictionaryInputDate">
                      <FloatingLabel
                        label="Noun"
                        className="float-hidden float-select"
                      >
                        <input
                          type="text"
                          className="react-select-container-list form-control form add-basefare-input synonymInput"
                          classNamePrefix="react-select-list"
                          placeholder="Enter noun maximum 50 characters"
                          name="noun"
                          value={noun}
                          onChange={this.handleInputChange}
                          maxLength={50}
                          required
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[_0-9]/g, '');
                          }}
                        />
                      </FloatingLabel>
                      <span className="text-danger asterisk-size ml-2">*</span>
                    </div>
                    {this.state.validationErrors.noun && (
                      <div className="text-danger">
                        {this.state.validationErrors.noun}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-4">
                    <div className="createnm mroDictionaryInputDate">
                      <FloatingLabel
                        label="Modifier"
                        className="float-hidden float-select"
                      >
                        <input
                          type="text"
                          className="react-select-container-list form-control form add-basefare-input synonymInput"
                          classNamePrefix="react-select-list"
                          placeholder="Enter modifier maximum 100 characters"
                          name="modifier"
                          value={modifier}
                          maxLength={100}
                          onChange={this.handleInputChange}
                          required
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[_0-9]/g, '');
                          }}
                        />
                      </FloatingLabel>
                      <span className="text-danger asterisk-size ml-2">*</span>
                    </div>
                    {this.state.validationErrors.modifier && (
                      <div className="text-danger">
                        {this.state.validationErrors.modifier}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mg-r-15 mg-l-5 mg-t-15 mg-b-10">
                  <div className="col-lg-6">
                    <div className="createnm mroDictionaryInputDate">
                      <FloatingLabel
                        label="Noun Definition"
                        className="float-hidden float-select"
                      >
                        <TextField
                          className="resizable-textfield nountextareadata mroDictionaryNounDefinition"
                          id="Details"
                          placeholder="Enter noun definition maximum 4000 characters"
                          inputProps={{ maxLength: 4000 }}
                          multiline
                          rows={3}
                          col={300}
                          variant="outlined"
                          size="small"
                          style={{ width: "100%", height: "80px" }}
                          value={this.state.nounDefinition}
                          onChange={(e) =>
                            this.setState({ nounDefinition: e.target.value })
                          }
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createnm mroDictionaryInputDate">
                      <FloatingLabel
                        label="Modifier Definition / Guidelines"
                        className="float-hidden float-select"
                      >
                        <TextField
                          className="resizable-textfield nountextareadata"
                          id="Details"
                          placeholder="Enter modifier definition / guidelines maximum 4000 characters"
                          inputProps={{ maxLength: 4000 }}
                          multiline
                          rows={3}
                          col={300}
                          variant="outlined"
                          size="small"
                          style={{ width: "100%" }}
                          value={this.state.nounModifierDefinitionOrGuidelines}
                          onChange={(e) =>
                            this.setState({
                              nounModifierDefinitionOrGuidelines:
                                e.target.value,
                            })
                          }
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="nmtemplatelist">
            <Col lg={9} style={{ paddingRight: "0px", paddingLeft: "40px" }}>
              <div
                style={{ border: "1px solid #cdd4e0", borderTop: "0px" }}
                className="mg-l-0 mg-r-0 mg-t-0"
              >
                <div className="col-md-12 pd-t-10 pd-b-10">
                  {this.state.synonymError && (
                    <div className="error">{this.state.synonymError}</div>
                  )}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable createnmtemp">
                          <MaterialReactTable
                            columns={synonymColumns}
                            data={synonymData}
                            enableColumnFilterModes={true}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={false}
                            enablePagination={false}
                            enableStickyHeader={true}
                            enableDensityToggle={false}
                            renderTopToolbarCustomActions={() => (
                              <Box
                                className="row evvcontent"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                }}
                              >
                                <span className="col-md-5">
                                  <b>Synonym</b>
                                </span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton
                                      onClick={this.handleSynonymCSVExport}
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
                                    data={this.getTransformedSynonymDataForExport()}
                                    headers={synonymColumns
                                      .filter(
                                        (col) => col.accessorKey !== "Delete"
                                      )
                                      .map((col) => ({
                                        label: col.header,
                                        key: col.accessorKey,
                                      }))}
                                    filename="NounSynonym_Data.csv"
                                    ref={(r) => (this.csvLinkSynonym = r)}
                                    style={{ display: "none" }}
                                  />
                                  <Button
                                    variant="secondary"
                                    onClick={this.addSynonym}
                                    className="vewsubmit-button"
                                    style={{ float: "right" }}
                                  >
                                    <i className="fa fa-plus mr-1"></i> Add New
                                    Synonym
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: {
                                backgroundColor:
                                  this.state.activeRowId === row.original.id
                                    ? "#e0e0e0"
                                    : "transparent",
                              },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
              <div
                style={{ border: "1px solid #cdd4e0", borderTop: "0px" }}
                className="mg-l-0 mg-r-0 mg-t-0"
              >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  {this.state.attributesError && (
                    <div className="error">{this.state.attributesError}</div>
                  )}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable createnmtemp">
                          <MaterialReactTable
                            columns={attributeColumns}
                            data={attributeData}
                            enableColumnFilterModes={true}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={false}
                            enablePagination={false}
                            enableStickyHeader={true}
                            enableDensityToggle={false}
                            renderTopToolbarCustomActions={() => (
                              <Box
                                className="row evvcontent"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                }}
                              >
                                <span className="col-md-5">
                                  <b>Attributes</b>
                                </span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton
                                      onClick={this.handleAttributeCSVExport}
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
                                    data={this.getTransformedAttributeDataForExport()}
                                    headers={attributeColumns
                                      .filter(
                                        (col) => col.accessorKey !== "Delete"
                                      )
                                      .map((col) => ({
                                        label: col.header,
                                        key: col.accessorKey,
                                      }))}
                                    filename="Attributes_Data.csv"
                                    ref={(r) => (this.csvLinkAttribute = r)}
                                    style={{ display: "none" }}
                                  />
                                  <Button
                                    variant="secondary"
                                    onClick={this.addAttribute}
                                    className="vewsubmit-button"
                                    style={{ float: "right" }}
                                  >
                                    <i className="fa fa-plus mr-1"></i> Add New
                                    Attribute
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: {
                                backgroundColor:
                                  this.state.activeRowId === row.original.id
                                    ? "#e0e0e0"
                                    : "transparent",
                              },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
              <div
                style={{ border: "1px solid #cdd4e0", borderTop: "0px" }}
                className="mg-l-0 mg-r-0 mg-t-0"
              >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  {this.state.attitudeevvError && (
                    <div className="error">{this.state.attitudeevvError}</div>
                  )}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable createnmtemp">
                          <MaterialReactTable
                            columns={attributeEvvColumns}
                            data={attributeEvvData}
                            enableColumnFilterModes={true}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={false}
                            enablePagination={false}
                            enableStickyHeader={true}
                            enableDensityToggle={false}
                            renderTopToolbarCustomActions={() => (
                              <Box
                                className="row evvcontent"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                }}
                              >
                                <span className="col-md-5">
                                  <b>Attribute Enumerated valid values(EVVs)</b>
                                </span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton
                                      onClick={this.handleAttributeEVVCSVExport}
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
                                    data={this.getTransformedAttributeEvvDataForExport()}
                                    headers={attributeEvvColumns
                                      .filter(
                                        (col) => col.accessorKey !== "Delete"
                                      )
                                      .map((col) => ({
                                        label: col.header,
                                        key: col.accessorKey,
                                      }))}
                                    filename="AttributesEVV_data.csv"
                                    ref={(r) => (this.csvLinkAttributeEvv = r)}
                                    style={{ display: "none" }}
                                  />
                                  <Button
                                    variant="secondary"
                                    onClick={this.addAttributeEVV}
                                    className="vewsubmit-button"
                                    style={{ float: "right" }}
                                  >
                                    <i className="fa fa-plus mr-1"></i> Add
                                    Attribute EVV
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: {
                                backgroundColor:
                                  this.state.activeRowId === row.original.id
                                    ? "#e0e0e0"
                                    : "transparent",
                              },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>

              <div
                style={{ border: "1px solid #cdd4e0", borderTop: "0px" }}
                className="mg-l-0 mg-r-0 mg-t-0"
              >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  {this.state.unspscError && (
                    <div className="error">{this.state.unspscError}</div>
                  )}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable createnmtemp">
                          <MaterialReactTable
                            columns={unspscColumns}
                            data={unspscData}
                            enableColumnFilterModes={true}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={false}
                            enablePagination={false}
                            enableStickyHeader={true}
                            enableDensityToggle={false}
                            renderTopToolbarCustomActions={() => (
                              <Box
                                className="row evvcontent"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                }}
                              >
                                <span className="col-md-5">
                                  <b>UNSPSC</b>
                                </span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton
                                      onClick={this.handleUNSPSCCSVExport}
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
                                    data={this.getTransformedUnspscDataForExport()}
                                    headers={unspscColumns
                                      .filter(
                                        (col) => col.accessorKey !== "Delete"
                                      )
                                      .map((col) => ({
                                        label: col.header,
                                        key: col.accessorKey,
                                      }))}
                                    filename="UNSPSC_data.csv"
                                    ref={(r) => (this.csvLinkUnspsc = r)}
                                    style={{ display: "none" }}
                                  />
                                  <Button
                                    variant="secondary"
                                    onClick={this.addUNSPSC}
                                    className="vewsubmit-button"
                                    style={{ float: "right" }}
                                  >
                                    <i className="fa fa-plus mr-1"></i> Assign
                                    UNSPSC
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: {
                                backgroundColor:
                                  this.state.activeRowId === row.original.id
                                    ? "#e0e0e0"
                                    : "transparent",
                              },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </Col>
            <Col lg={3} style={{ paddingLeft: "0px", paddingRight: "30px" }}>
              <div
                style={{
                  border: "1px solid #cdd4e0",
                  borderLeft: "0px",
                  borderTop: "0px",
                  height: "100%",
                }}
                className="mg-l-0 mg-r-0 mg-t-0"
              >
                <div
                  className="col-md-12 pd-t-10 pd-b-10  "
                  style={{ height: "100%" }}
                >
                  {this.state.nounModifierImagesError && (
                    <div className="error">
                      {this.state.nounModifierImagesError}
                    </div>
                  )}
                  <ToolkitProvider keyField="name">
                    {() => {
                      const {
                        nounModifierImageColumns,
                        nounModifierImageData,
                      } = this.nounModifierImageTable();
                      return (
                        <div className="mg-t-0">
                          <div className="pdqcmro masters-material-table nmtable unspcimg">
                            <MaterialReactTable
                              columns={nounModifierImageColumns}
                              data={nounModifierImageData}
                              enableColumnFilterModes={false}
                              enableColumnOrdering={false}
                              enableRowSelection={false}
                              enablePagination={false}
                              enableStickyHeader={true}
                              enableFullScreenToggle={false}
                              enableDensityToggle={false}
                              enableColumnVisibilityToggle={false}
                              enableColumnFilters={false}
                              enableGlobalFilter={false}
                              enableSorting={false}
                              enableColumnActions={false}
                              renderTopToolbarCustomActions={() => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <span>
                                    <b>Noun Modifier Images</b>
                                  </span>
                                  <Button
                                    variant="secondary"
                                    onClick={this.addImage}
                                    className="vewsubmit-button"
                                    style={{ float: "right" }}
                                  >
                                    <i className="fa fa-plus mr-1"></i> Add New
                                    Image
                                  </Button>
                                </Box>
                              )}
                              getRowProps={(row) => ({
                                style: {
                                  backgroundColor:
                                    this.state.activeRowId === row.original.name
                                      ? "#e0e0e0"
                                      : "transparent",
                                },
                              })}
                              style={{ height: "calc(100vh - 490px)" }}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </ToolkitProvider>
                </div>
              </div>
            </Col>
            <div className="nmsvntns">
              <Button
                variant="secondary"
                style={{ marginRight: "30px", width: "100px", backgroundColor: "#5b47fb", color: "#fff" }}
                onClick={this.handleSave}
              >
                <i className="fa fa-save mr-1"></i> Save
              </Button>
              <Button
                variant="secondary"
                className="vewsubmit-button"
                style={{ width: "100px" }}
                onClick={this.createNounModifierTemplateReset}
              >
                <i class="fa fa-refresh mr-1"></i>Reset
              </Button>
            </div>
          </Row>
        </LoadingOverlay>
        <Modal
          show={synonymModal}
          onHide={this.synonymCancel}
          className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Synonym to Noun</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Noun"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={noun}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Modifier"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={modifier}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="mydtlscnt mroDictionaryInputDate">
                  <FloatingLabel
                    label="Synonym"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15 synonymInputText"
                      maxLength="100"
                      placeholder="Enter synonym maximum 100 characters"
                      name="synonym"
                      value={synonym}
                      onChange={this.handleInputChange}
                      style={{ background: "#fff;" }}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="mroDictionaryInputDate">
                  <FloatingLabel
                    label="Synonym Definition / Guidelines"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield"
                      placeholder="Enter synonym definition / guidelines maximum 4000 characters"
                      inputProps={{ maxLength: 4000 }}
                      multiline
                      rows={3}
                      col={300}
                      variant="outlined"
                      size="small"
                      style={{ width: "100%" }}
                      name="synonymDefinitionOrGuidelines"
                      value={synonymDefinitionOrGuidelines}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="nmbtn"
              style={{ marginRight: "10px" }}
              onClick={this.handleSynonymAddToList}
            >
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button
              variant="secondary"
              onClick={this.synonymCancel}
              className="vewsubmit-button"
            >
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={attributeModal}
          onHide={this.attributeCancel}
          className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Attributes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Noun"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={noun}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Modifier"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={modifier}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="Attribute Name"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0"
                      maxLength="100"
                      placeholder="Enter attribute maximum 100 characters"
                      name="attributeName"
                      value={attributeName}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="Attribute Guidelines"
                    className="float-hidden float-select"
                  >
                    <TextField
                      className="resizable-textfield"
                      placeholder="Enter attribute guidelines maximum 4000 characters"
                      inputProps={{ maxLength: 4000 }}
                      multiline
                      rows={3}
                      col={300}
                      variant="outlined"
                      size="small"
                      style={{ width: "100%" }}
                      name="attributeGuidelines"
                      value={attributeGuidelines}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="Priority"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="1"
                      placeholder="Enter priority maximum 1 character"
                      name="priority"
                      value={priority}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <div className="mndatry">
                  <div>
                    <b>Mandatory / Optional :</b>{" "}
                    <span className="text-danger asterisk-size">*</span>
                  </div>
                  <label
                    style={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      marginBottom: "0px",
                    }}
                  >
                    <input
                      type="radio"
                      name="mandatoryOrOptional"
                      value="M"
                      checked={this.state.mandatoryOrOptional === "M"}
                      onChange={this.handleInputChange}
                    />{" "}
                    Mandatory
                  </label>
                  <label style={{ marginBottom: "0px" }}>
                    <input
                      type="radio"
                      name="mandatoryOrOptional"
                      value="O"
                      checked={this.state.mandatoryOrOptional === "O"}
                      onChange={this.handleInputChange}
                    />{" "}
                    Optional
                  </label>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="nmbtn"
              style={{ marginRight: "10px" }}
              onClick={this.handleattributeAddToList}
            >
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button
              variant="secondary"
              onClick={this.attributeCancel}
              className="vewsubmit-button"
            >
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={attributeEVVModal}
          onHide={this.attributeEvvCancel}
          className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Attribute EVVs</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Noun"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={noun}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Modifier"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={modifier}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="Attribute Name"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control"
                      tabIndex="1"
                      id="attributeName"
                      name="attributeName"
                      value={attributeName}
                      onChange={this.onChangeAttributeName}
                    >
                      <option value="">--Select Attribute Name--</option>
                      {attributeData.length > 0 ? (
                        attributeData.map((option, index) => (
                          <option key={index} value={option.attributeName}>
                            {option.attributeName}
                          </option>
                        ))
                      ) : (
                        <option value="">No attributes available</option>
                      )}
                    </select>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="Attribute Value"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="4000"
                      placeholder="Enter attribute value maximum 4000 characters"
                      name="enumeratedVaildValue"
                      value={enumeratedVaildValue}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="Priority"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-15"
                      maxLength="1"
                      placeholder="Enter priority maximum 1 character"
                      name="priority"
                      value={priority}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="nmbtn"
              style={{ marginRight: "10px" }}
              onClick={this.handleattributeevvAddToList}
            >
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button
              variant="secondary"
              onClick={this.attributeEvvCancel}
              className="vewsubmit-button"
            >
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={unspscModal}
          onHide={this.unspscCancel}
          className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl unspscmdl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add UNSPSC</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Noun"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={noun}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Modifier"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={modifier}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="UNSPSC Version"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control flex-grow-1"
                      tabIndex="9"
                      id="unspscversion"
                      name="unspscversion"
                      value={selectedUNSPSCVersion}
                      onChange={this.onChangeUnspscVersion}
                    >
                      <option>--Select UNSPSC Version--</option>
                      {this.state.unspscVersions.map((unspscversion) => (
                        <option key={unspscversion.Version}>
                          {unspscversion.Version}
                        </option>
                      ))}
                    </select>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryInputDate">
                  <FloatingLabel
                    label="UNSPSC Code - Category"
                    className="float-hidden float-select"
                  >
                    <select
                      className="form-control flex-grow-1"
                      id="unspsccategory"
                      name="unspsccategory"
                      value={selectedCategory}
                      onChange={this.onChangeUnspscCategory}
                    >
                      <option>--Select UNSPSC Code - Category--</option>
                      {unspscCategories.map((unspsccategory) => (
                        <option
                          key={unspsccategory.Code}
                          value={unspsccategory.Code}
                        >
                          {unspsccategory.Code} - {unspsccategory.Category}
                        </option>
                      ))}
                    </select>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="nmbtn"
              style={{ marginRight: "10px" }}
              onClick={this.handleUnspscAddToList}
            >
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button
              variant="secondary"
              onClick={this.unspscCancel}
              className="vewsubmit-button"
            >
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={nounModifierImageModal}
          onHide={this.nounModifierImageCancel}
          className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Noun - Modifier Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2">
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Noun"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={this.state.noun}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm mroDictionaryModelInput">
                  <FloatingLabel
                    label="Modifier"
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control mg-l-5 mg-r-0 myfrm"
                      maxLength="20"
                      value={this.state.modifier}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm mroDictionaryModelInput ImageData">
                  <FloatingLabel
                    label="Image"
                    className="float-hidden float-select"
                  >
                    <div className="custom-file-input create-nmimage">
                      <input
                        type="text"
                        className="form-control"
                        value={uploadedFileName}
                        readOnly
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control-file"
                        ref={this.fileInputRef}
                        onChange={this.uploadInputFile}
                      />
                    </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="nmbtn"
              style={{ marginRight: "10px" }}
              onClick={this.addImageToList}
            >
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button
              variant="secondary"
              onClick={this.nounModifierImageCancel}
              className="vewsubmit-button"
            >
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  //#endregion
}

export default CreateNounModifierTemplate;
