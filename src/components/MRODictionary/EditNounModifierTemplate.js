import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from '@mui/material';
import "./EditNounModifierTemplate.scss";
import helper from "../../helpers/helpers";
import { Row, Col, Modal, Button } from 'react-bootstrap';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box } from '@mui/material';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import mroDictionaryService from "../../services/mroDictionary.service";
import { CSVLink } from 'react-csv';
import projectService from "../../services/project.service";

toast.configure();

class EditNounModifierTemplate extends Component {
  constructor(props) {
    super(props);
    const { VersionNameOrNo, Noun, Modifier } = props.location.state || {};
    this.state = {
      versionNameOrNo: VersionNameOrNo || '',
      noun: Noun || '',
      modifier: Modifier || '',
      nounDefinition: '',
      nounModifierDefinitionOrGuidelines: '',

      synonym: '',
      synonymDefinitionOrGuidelines: '',
      synonymColumns: this.synonymTable().synonymColumns,
      synonymData: this.synonymTable().synonymData,
      synonymModal: false,

      attribute: '',
      attributeGuidelines: '',
      priority: '',
      mandatoryOrOptional: '',
      attributeColumns: this.attributeTable().attributeColumns,
      attributeData: this.attributeTable().attributeData,
      attributeShowModal: false,

      enumeratedValidValue: '',
      attributeEvvColumns: this.attributeEvvTable().attributeEvvColumns,
      attributeEvvData: this.attributeEvvTable().attributeEvvData,
      attributeEvvModal: false,
      
      unspscVersions: [],
      unspscCategories: [],
      selectedUNSPSCVersion: "",
      selectedUNSPSCCategory: "",
      unspscColumns: this.unspscTable().unspscColumns,
      unspscData: this.unspscTable().unspscData,
      unspscshowModal: false,

      nounModifierImageColumns: this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData: this.nounModifierImageTable().nounModifierImageData,
      imageShowModal: false,
      uploadedImageFileName: '',
      selectedNounModifierImages: [],
      selectedNounModifierImage: "",

      spinnerMessage: "",
      loading: false,
      
      formErrors: {},
      activeRowId: null,
    }

    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.onChangeUNSPSCVersion = this.onChangeUNSPSCVersion.bind(this);
    this.onChangeUNSPSCCategory = this.onChangeUNSPSCCategory.bind(this);
    this.addImageToList = this.addImageToList.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.uploadImageFile = this.uploadImageFile.bind(this);
    this.fileInputRef = React.createRef();
    this.reset = this.reset.bind(this);

  }

  //#region Change UNSPSC Version
  onChangeUNSPSCVersion = (event) => {
    const selectedVersion = event.target.value;
    const { unspscData } = this.state;
    const isDuplicate = unspscData.some(
      item => item.UNSPSCVersion === selectedVersion
    );
    if (isDuplicate) {
      toast.error("This UNSPSC Version already exists.");
      return;
    }
    if (selectedVersion !== this.state.selectedUNSPSCVersion) {
      this.setState(
        {
          selectedUNSPSCVersion: selectedVersion,
          selectedUNSPSCCategory: "",
        },
        () => {
    this.fetchUNSPSCVersionCategoryData();
  }
      );
    }
  }
  //#endregion

  //#region Change UNSPSC Category
  onChangeUNSPSCCategory = (event) => {
    this.setState({ selectedUNSPSCCategory: event.target.value });
  }
  //#endregion

  //#region Synonym Table Columns
  synonymTable() {
    const synonymColumns = [
      {
        accessorKey: "Synonym",
        header: "Synonym",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: '20%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "SynonymDefinitionOrGuidelines",
        header: "Synonym Definition / Guidelines",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '72%',
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
          <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
            <i
              className="fa fa-close pointer"
              title="Delete Version"
              style={{
                background: 'red',
                color: '#fff',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
  //#endregion
  
  //#region Attribute Table Columns
  attributeTable() {
    const attributeColumns = [
      {
        accessorKey: "Attribute",
        header: "Attribute Name",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: '20%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "AttributeGuidelines",
        header: "Attribute Guidelines",
        textAlign: "left",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '60%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "Priority",
        header: "Priority",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "MandatoryOrOptional",
        header: "Mandatory / Optional",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '30%',
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
          <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
            <i
              className="fa fa-close pointer"
              title="Delete Version"
              style={{
                background: 'red',
                color: '#fff',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => this.handleAttributeDelete(row.index, row.original.Attribute)}
            ></i>
          </div>
        ),
      },
    ];
    const attributeData = [];
    return { attributeColumns, attributeData };
  }
  //#endregion

  //#region Attribute EVV Table Columns
  attributeEvvTable() {
    const attributeEvvColumns = [
      {
        accessorKey: "Attribute",
        header: "Attribute Name",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: '20%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            textAlign: 'left'
          },
        },
      },
      {
        accessorKey: "EnumeratedValidValue",
        header: "Enumerated Vaild Value (EVV)",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '60%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "Priority",
        header: "Priority",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '20%',
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
          <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
            <i
              className="fa fa-close pointer"
              title="Delete Version"
              style={{
                background: 'red',
                color: '#fff',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
  //#endregion

  //#region UNSPSC Table Columns
  unspscTable() {
    const unspscColumns = [
      {
        accessorKey: "UNSPSCVersion",
        header: "UNSPSC Version",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: '20%',
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
            width: '15%',
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
            width: '65%',
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
          <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
            <i
              className="fa fa-close pointer"
              title="Delete Version"
              style={{
                background: 'red',
                color: '#fff',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
  //#endregion

  //#region Noun-Modifier Image Table Columns
  nounModifierImageTable = () => {
    const { addedNounModifierImages = [] } = this.state || {};
    const nounModifierImageColumns = [
      {
        accessorKey: "Data",
        header: "Image",
        enableSorting: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '90%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            width: '90%',
          },
        },
        Cell: ({ row }) => {
          const { Data, ImageTempFileName } = row.original;
          const imageSrc = Data
            ? `data:image/*;base64,${Data}`
            : '';

          const fileName = ImageTempFileName || 'No File Name';

          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={fileName}
                  style={{ width: '130px', height: '130px', objectFit: 'cover' }}
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
        enableSorting: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '10%',
          },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ row }) => (
          <div
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
            onClick={() => this.handleDeleteImage(row.original.Data, row.original.Name)}
          >
            <i
              className="fa fa-close pointer"
              title="Delete Image"
              style={{
                background: 'red',
                color: '#fff',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

  //#region all modals Cancel Add To List methods
  synonymCancel = () => {
    this.setState({
      synonymModal: false,
      Synonym: '',
      SynonymDefinitionOrGuidelines: '',
    });
  }

  attributeCancel = () => {
    this.setState({
      attributeShowModal: false,
      Attribute: '',
      AttributeGuidelines: '',
      Priority: '',
      MandatoryOrOptional: ''
    });
  }

  attributeEvvCancel = () => {
    this.setState({
      attributeEVVModal: false,
      Attribute: '',
      EnumeratedValidValue: '',
      Priority: ''
      
    });
  }

  unspscCancel = () => {
    this.setState({
      unspscshowModal: false,
      selectedUNSPSCVersion: '',
      selectedUNSPSCCategory: '',
    });
  }

  attributeEvvModalData = () => {
    this.setState({ attributeEVVModal: true });
  }

  nounModifierImageCancel = () => {
    this.setState({
      imageShowModal: false,
    });
  }
  //#endregion

  // #region Synonym Data deletion
  handleSynonymDelete = (rowIndex) => {
    this.setState(prevState => {
      const updatedData = prevState.synonymData.filter((item, index) => index !== rowIndex);
      return { synonymData: updatedData };
    });
  };
  //#endregion

  // #region Attribute Data deletion
  handleAttributeDelete = (rowIndex, AttributeName) => {
    const AttributeDetails = this.state.attributeEvvData.find(v => v.Attribute === AttributeName);
    if (AttributeDetails) {
      toast.error("Cannot delete Attribute when Attribute Value exists");
      return;
    }
    this.setState(prevState => {
      const updatedData = prevState.attributeData.filter((item, index) => index !== rowIndex);
      return { attributeData: updatedData };
    });
  };
  //#endregion

  // #region Attribute Evv Data deletion
  handleAttributeEvvDelete = (rowIndex) => {
    this.setState(prevState => {
      const updatedData = prevState.attributeEvvData.filter((item, index) => index !== rowIndex);
      return { attributeEvvData: updatedData };
    });
  };
  //#endregion

  // #region UNSPSC Data deletion
  handleUnspscDelete = (rowIndex) => {
    this.setState(prevState => {
      const updatedData1 = prevState.unspscData.filter((item, index) => index !== rowIndex);
      return { unspscData: updatedData1 };
    });
  };
  //#endregion

  // #region Image Data deletion
  handleDeleteImage = (fileData, fileName) => {
    this.setState(prevState => {
      const filteredImages = prevState.addedNounModifierImages.filter(
        img => img.Data !== fileData 
      );
      const filteredselectedImages = this.state.selectedNounModifierImages.filter(
        (img) => img !== fileName
      );
      return {
        addedNounModifierImages: filteredImages,
        selectedNounModifierImages: filteredselectedImages,
      };
    });
  };
  //#endregion

  //#region Add the Synonym data
  handleSynonymAddToList = () => {
    const { Synonym, SynonymDefinitionOrGuidelines, synonymData } = this.state;
    if (!Synonym) {
      toast.error("Synonym is required.");
      return;
    }
    const SynonymDetails = synonymData.find(s => s.Synonym === Synonym);
    if (SynonymDetails) {
      toast.error("This Synonym already exist.");
      return;
    }
    const newEntry = {
      id: synonymData.length + 1,
      Synonym: Synonym,
      SynonymDefinitionOrGuidelines: SynonymDefinitionOrGuidelines,

    };
    this.setState({
      synonymData: [...synonymData, newEntry],
      Synonym: '',
      SynonymDefinitionOrGuidelines: '',
      synonymModal: false
    });
  };
  //#endregion

  //#region  Uplaod Attribute data
  handleAttributeAddToList = () => {
    const { Attribute, AttributeGuidelines, Priority, MandatoryOrOptional, attributeData } = this.state;
    if (!Attribute || !AttributeGuidelines || !Priority || !MandatoryOrOptional) {
      toast.error("Please Enter all required fields.");
      return;
    }
    const AttributeDetails = attributeData.find(a => a.Attribute.toLowerCase() === Attribute.toLowerCase());
    if (AttributeDetails) {
      toast.error("This Attribute already exist.");
      return;
    }
    const newEntry = {
      id: attributeData.length + 1,
      Attribute: Attribute,
      AttributeGuidelines: AttributeGuidelines,
      Priority: Priority,
      MandatoryOrOptional: MandatoryOrOptional
    };
    this.setState({
      attributeData: [...attributeData, newEntry],
      Attribute: '',
      AttributeGuidelines: '',
      Priority: '',
      MandatoryOrOptional: '',
      attributeShowModal: false,
    });
  };
  //#endregion

  //#region Uplaod Attribute Evv data
  handleAttributeEvvAddToList = () => {
    const { attributeEvvData, Attribute, EnumeratedValidValue, Priority } = this.state;
    if (!Attribute || !EnumeratedValidValue || !Priority) {
      toast.error("Please Enter all required fields.");
      return;
    }
    const AttributeEvvDetails = attributeEvvData.find(a => a.Attribute.toLowerCase() === Attribute.toLowerCase() && a.EnumeratedValidValue.toLowerCase() === EnumeratedValidValue.toLowerCase());
    if (AttributeEvvDetails) {
      toast.error("This Enumerated Vaild Value already exist.");
      return;
    }
    const newEntry = {
      id: attributeEvvData.length + 1, 
      Attribute: Attribute,
      EnumeratedValidValue: EnumeratedValidValue,
      Priority: Priority,
    };
    this.setState({
      attributeEvvData: [...attributeEvvData, newEntry],
      Attribute: '',
      EnumeratedValidValue: '',
      Priority: '',
      attributeEVVModal: false,
    });
  }
  //#endregion

  //#region Uplaod UNSPSC data
  handleUNSPSCAddToList = () => {
    const { selectedUNSPSCVersion, selectedUNSPSCCategory, unspscCategories, unspscData } = this.state;
    if (!selectedUNSPSCVersion || !selectedUNSPSCCategory) {
      toast.error("UNSPSCVersion, UNSPSCCode, and UNSPSCCategory are required.");
      return;
    }
    const selectedCategoryData = unspscCategories.find(cat => cat.Code === selectedUNSPSCCategory);
    if (selectedCategoryData) {
      const isDuplicate = unspscData.some(
        item =>
          item.UNSPSCVersion === selectedUNSPSCVersion
      );
      if (isDuplicate) {
        toast.error("This UNSPSC Version already exists.");
        return;
      }
      const newData = {
        UNSPSCVersion: selectedUNSPSCVersion,
        UNSPSCCode: selectedCategoryData.Code,
        UNSPSCCategory: selectedCategoryData.Category,
      };
      this.setState(prevState => ({
        unspscData: [...prevState.unspscData, newData],
        selectedUNSPSCVersion: '',
        selectedUNSPSCCategory: '',
        unspscshowModal: false
      }));
    }
  };
  //#endregion

  //#region Uplaod the image input file
  uploadImageFile = (e) => {
    let files = e.target.files;
    let currentFile = files[0];
    this.setState({
      uploadedImageFileName: currentFile.name,
      spinnerMessage: "Please wait while reading file data...",
      loading: true,
    });
    let formData = new FormData();
    formData.append("File", currentFile);
    projectService.saveFileupload(formData)
      .then((response) => {
        const uploadedImageTempFileName = response.data;
        
        let newEntry = [...this.state.selectedNounModifierImages]
        newEntry.push(uploadedImageTempFileName)
        this.setState({
          selectedNounModifierImages: newEntry
        });
      })
      .catch((error) => {
        console.error("File upload failed:", error);
        toast.error(error.response?.data?.Message || "File upload failed");
      })
      .finally(() => {
        this.setState({
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

  //#region add the image in list
  addImageToList = () => {
    const { selectedNounModifierImages, uploadedImageFileName } = this.state;
    if (!uploadedImageFileName) {
      toast.error('Please select an image to upload.');
      return;
    }
    mroDictionaryService.readAllImagesFromTempFolder(selectedNounModifierImages)
      .then(response => {
        this.setState({
          addedNounModifierImages: response.data,
          uploadedImageFileName: '',
          imageShowModal: false
        });
        if (this.fileInputRef.current) {
          this.fileInputRef.current.value = null;
        }
      })
      .catch(error => {
        toast.error('Failed to upload image. Please try again.');
      });
  };
  //#endregion

  //#region all modals Add To List methods
  addNewSynonym = () => {
    this.setState({ synonymModal: true });
  }

  addNewAttribute = () => {
    this.setState({ attributeShowModal: true });
  }

  addNewAttributeEVV = () => {
    this.setState({ attributeEVVModal: true });
  }

  addNewUNSPSC = () => {
    this.setState({ unspscshowModal: true });
  }
  
  addNewImage = () => {
    this.setState({ imageShowModal: true });
  }
  //#endregion

  //#region Component Did Mount
  componentDidMount() {
    this.fetchEditNounModifierTemplateData();
  }
  //#endregion

   //#region Reset the page
   reset() {
    this.fetchEditNounModifierTemplateData();
  }
  //#endregion

  //#region fetch Edit Noun Modifier Template Data
  fetchEditNounModifierTemplateData = () => {
    const { location } = this.props; 
    const state = location?.state || {}; 
    if (Object.keys(state).length === 0 || state === null || state === undefined) {
      this.props.history.push("/MRODictionary");
      return;
    }
    const { VersionNameOrNo, Noun, Modifier } = state;    
    if (VersionNameOrNo && Noun && Modifier) {
      mroDictionaryService.readNounModifierDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier)
        .then(response => {
          const { NounDefinition, NounModifierDefinitionOrGuidelines } = response.data || {};
          this.setState({
            nounDefinition: NounDefinition || '',
            nounModifierDefinitionOrGuidelines: NounModifierDefinitionOrGuidelines || '',
            VersionNameOrNo, 
            Noun, 
            Modifier,
          });
        })
        .catch(error => {
          console.error('Error fetching noun modifier details:', error);
        });
    } else {
      console.error('Missing state parameters: VersionNameOrNo, Noun, or Modifier is undefined');
    }

    if (VersionNameOrNo && Noun) {
      this.fetchSynonymData(VersionNameOrNo, Noun);
    } else {
      console.error('Missing state parameters: VersionNameOrNo or Noun is undefined');
    }

    if (VersionNameOrNo && Noun && Modifier) {
      this.fetchAttributesData(VersionNameOrNo, Noun, Modifier);
    } else {
      console.error('Missing state parameters: VersionNameOrNo, Noun, or Modifier is undefined');
    }

    if (VersionNameOrNo && Noun && Modifier) {
      this.fetchAttributesEvvData(VersionNameOrNo, Noun, Modifier);
    } else {
      console.error('Missing state parameters: VersionNameOrNo, Noun, or Modifier is undefined');
    }

    if (VersionNameOrNo && Noun && Modifier) {
      this.fetchUnspscData(VersionNameOrNo, Noun, Modifier);
    } else {
      console.error('Missing state parameters: VersionNameOrNo, Noun, or Modifier is undefined');
    }

    if (Noun && Modifier) {
      this.fetchNounMidifierImageData(Noun, Modifier);
    } else {
      console.error('Missing state parameters: Noun or Modifier is undefined');
    }

    this.fetchUNSPSCVersionData();
  }
  //#endregion

  //#region Fetch Synonym Data
  fetchSynonymData = (VersionNameOrNo, Noun) => {
    this.setState({
      spinnerMessage: "Please wait while loading Noun Synonym Details...",
      loading: true
    });

    mroDictionaryService
      .readNounSynonymDetailsFromSelectedVersion(VersionNameOrNo, Noun)
      .then((response) => {
        const { data: synonymData } = response;
        this.setState({
          synonymData,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error fetching noun Synonym data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Attributes Data
  fetchAttributesData = (VersionNameOrNo, Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Details...",
      loading: true
    });

    mroDictionaryService
      .readNounModifierAttributeDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier)
      .then((response) => {
        const { data: attributeData } = response;
       
        this.setState({
          attributeData,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error fetching attribute data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Attributes EVV Data
  fetchAttributesEvvData = (VersionNameOrNo, Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading Attribute EVV Details...",
      loading: true
    });

    mroDictionaryService
      .readNounModifierAttributeValuesDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier)
      .then((response) => {
        const { data: attributeEvvData } = response;
        this.setState({
          attributeEvvData,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error while fetching attribute values data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch UNSPSC Data
  fetchUnspscData = (VersionNameOrNo, Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading UNSPSC Details...",
      loading: true
    });

    mroDictionaryService
      .readNounModifierUNSPSCDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier)
      .then((response) => {
        const { data: unspscData } = response;
        this.setState({
          unspscData,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error while fetching UNSPSC data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch UNSPSC Versions
  fetchUNSPSCVersionData = () => {
    this.setState({ loading: true, spinnerMessage: "Please wait while fetching UNSPSC version data..." });
    mroDictionaryService.readUNSPSCVersions()
      .then(resp => {
        this.setState({
          unspscVersions: resp.data,
          loading: false,
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch UNSPSC Version Categories
  fetchUNSPSCVersionCategoryData = () => {
    const { selectedUNSPSCVersion } = this.state;
    if (!selectedUNSPSCVersion) return;

    this.setState({ loading: true, spinnerMessage: "Please wait while fetching Version Category data..." });

    mroDictionaryService.readAllCategoriesOfSelecetdUNSPSCVersion(selectedUNSPSCVersion)
      .then(response => {
        this.setState({
          unspscCategories: response.data,
          loading: false,
        });
      })
      .catch(error => {
        console.error("Error while fetching UNSPSC categories:", error);
        this.setState({
          loading: false,
          error: "Failed to load categories",
        });
      });
  };
  //#endregion

  //#region Fetch Noun-Midifier Image Data
  fetchNounMidifierImageData = (Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Details...",
      loading: true
    });
    mroDictionaryService
      .readNounModifierImages(Noun, Modifier, false)
      .then((response) => {
        const { data: nounModifierImageData } = response;
        const tempFileName = nounModifierImageData.map(item => {
          return item.ImageTempFileName
        })
        this.setState({
          addedNounModifierImages: nounModifierImageData,
          selectedNounModifierImages: tempFileName,
          loading: false,
        });
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
  }

  handleAttributeEVVCSVExport = () => {
    if (this.csvLinkAttributeEvv) {
      this.csvLinkAttributeEvv.link.click();
    }
  }

  handleUNSPSCCSVExport = () => {
    if (this.csvLinkUnspsc) {
      this.csvLinkUnspsc.link.click();
    }
  }
  //#endregion

  //#region Transform data for CSV export
  getTransformedSynonymDataForExport = () => {
    const { synonymData } = this.state;
    return synonymData.map(row => ({
      Synonym: row.Synonym,
      SynonymDefinitionOrGuidelines: row.SynonymDefinitionOrGuidelines,
    }));
  };

  getTransformedAttributeDataForExport = () => {
    const { attributeData } = this.state;
    return attributeData.map(row => ({
      Attribute: row.Attribute,
      AttributeGuidelines: row.AttributeGuidelines,
      Priority: row.Priority,
      MandatoryOrOptional: row.MandatoryOrOptional,
    }));
  };

  getTransformedAttributeEvvDataForExport = () => {
    const { attributeEvvData } = this.state;
    return attributeEvvData.map(row => ({
      Attribute: row.Attribute,
      EnumeratedValidValue: `${row.EnumeratedValidValue} `,
      Priority: row.Priority,
    }));
  };

  getTransformedUnspscDataForExport = () => {
    const { unspscData } = this.state;
    return unspscData.map(row => ({
      UNSPSCVersion: row.UNSPSCVersion,
      UNSPSCCode: row.UNSPSCCode,
      UNSPSCCategory: row.UNSPSCCategory,
    }));
  };
  //#endregion
 
  // #region Method to handle input change
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  //#endregion

  // #region Method to handle Attribute change
  handleAttributeChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  //#endregion

  //#region Edit Noun-Modifier Template
  handleSave = () => {
    const { VersionNameOrNo, Noun, Modifier, nounDefinition, nounModifierDefinitionOrGuidelines, synonymData, attributeData, attributeEvvData, unspscData, addedNounModifierImages } = this.state;
    const sendData = Array.isArray(addedNounModifierImages) ?
      addedNounModifierImages.map((image) => ({
        Name: image.ImageTempFileName,
        Data: image.Data
      }))
      : [];
    const data = {
      VersionNameOrNo,
      Noun,
      Modifier: Modifier,
      NounDefinition: nounDefinition || '',
      NounModifierDefinitionOrGuidelines: nounModifierDefinitionOrGuidelines,
      NounSynonyms: synonymData.map(item => ({
        Synonym: item.Synonym,
        SynonymDefinitionOrGuidelines: item.SynonymDefinitionOrGuidelines
      })),
      NounModifierAttributes: attributeData.map(item => ({
        Attribute: item.Attribute,
        AttributeGuidelines: item.AttributeGuidelines,
        Priority: item.Priority,
        MandatoryOrOptional: item.MandatoryOrOptional
      })),
      NounModifierAttributeEVVs: attributeEvvData.map(item => ({
        Attribute: item.Attribute,
        EnumeratedValidValue: item.EnumeratedValidValue,
        Priority: item.Priority
      })),
      NounModifierUNSPSCs: unspscData.map(item => ({
        UNSPSCVersion: item.UNSPSCVersion,
        UNSPSCCode: item.UNSPSCCode,
        UNSPSCCategory: item.UNSPSCCategory
      })),
      ImageFileNames: sendData.map(image => image.Name),
      UserID: helper.getUser()
    };
    mroDictionaryService.editNounModifierTemplate(data)
      .then(response => {
        this.setState({
          VersionNameOrNo: '',
          Noun: '',
          Modifier: '',
          nounDefinition: '',
          nounModifierDefinitionOrGuidelines: '',
          synonymData: [],
          attributeData: [],
          attributeEvvData: [],
          unspscData: [],
          addedNounModifierImages: [],
        });
        toast.success("Noun-Modifier Template edited successfully.");
        setTimeout(() => {
          sessionStorage.setItem("activeMroDictionaryTab", "nounModifierTemplateList");
          this.props.history.goBack();
        }, 1000); 
      })
      .catch(error => {
        toast.error(error.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Render
  render() {
    const { VersionNameOrNo, Noun, Modifier } = this.state;
    const { nounDefinition, nounModifierDefinitionOrGuidelines } = this.state;
    const { Synonym, SynonymDefinitionOrGuidelines, Attribute, AttributeGuidelines, uploadedImageFileName, Priority, EnumeratedValidValue, selectedUNSPSCVersion, selectedUNSPSCCategory, unspscCategories, synonymColumns, synonymData, attributeColumns, attributeData, attributeEvvColumns, attributeEvvData, unspscColumns, unspscData } = this.state;
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    const { synonymModal, attributeShowModal, attributeEVVModal, unspscshowModal, imageShowModal } = this.state;
    return (
      <div style={setHeight(100)} className="production-update-main editnounmodifiertemplate">
        <LoadingOverlay active={this.state.loading} className="custom-loader"
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
            <Col lg={12} style={{ maxWidth: "100%" }}>
              <div className="production-update-header">
                <h4 style={{ marginBottom: "0", fontSize: "18px" }}>
                  Edit Noun - Modifier Template{" "}
                  <span className="icon-size">

                      <i
                        className="far fa-arrow-alt-circle-left text-primary pointer"
                        tabIndex="1"
                      title="Back to List" onClick={() => {
                        sessionStorage.setItem("activeMroDictionaryTab", "nounModifierTemplateList");
                        this.props.history.goBack();
                      }}
                      ></i>
                  </span>
                </h4>
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
                <button
                  className="down-item-link mg-l-15 mg-b-10"
                  onClick={this.downloadMRODictionaryTemplate}
                  style={{ textDecoration: "underline" }}
                >
                </button>
              </div>
            </Col>
          </Row>
          <Row className="mg-l-10 mg-r-15 prdupdlst mg-t-0">
            <Col lg={12} style={{ maxWidth: "100%", paddingLeft: "15px", paddingRight: "10px" }}>
              <div className="production-update-header">
                {this.state.isStatusUpdating && (
                  <h6 style={{ marginBottom: "0", fontSize: "13px", color: "green" }}>
                    Please wait while updating the status...
                  </h6>
                )}
              </div>
              <div style={{ border: "1px solid #cdd4e0" }} className="mg-l-0 mg-r-0 mg-t-5" >
                <div className="row mg-r-15 mg-l-5 mg-t-10">
                  <div className="col-lg-4">
                    <div className="createnm editNounModifierTemplateInput">
                      <FloatingLabel label="MRO Dictionary Version Name / No." className="float-hidden float-select">
                        <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={VersionNameOrNo || ''} readOnly />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="createnm editNounModifierTemplateInput">
                      <FloatingLabel label="Noun" className="float-hidden float-select">
                        <input type="text" className="form-control mg-l-5 myfrm" maxLength="50" value={Noun || ''} readOnly />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="createnm editNounModifierTemplateInput">
                      <FloatingLabel label="Modifier" className="float-hidden float-select">
                        <input type="text" className="form-control mg-l-5 myfrm" maxLength="50" value={Modifier || ''} readOnly />
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
                <div className="row mg-r-15 mg-l-5 mg-t-15 mg-b-10">
                  <div className="col-lg-6">
                    <div className="createnm editNounModifierTemplateInput">
                    <FloatingLabel
                        label="Noun Definition"
                      className="float-hidden float-select">
                      <TextField
                        className="resizable-textfield"
                        id="Details"
                        inputProps={{ maxLength: 4000 }}
                        multiline
                        rows={3}
                        col={300}
                        variant="outlined"
                        size="small"
                        style={{ width: '100%' }}
                        value={nounDefinition}
                        onChange={(e) => this.setState({ nounDefinition: e.target.value })}
                      />
                    </FloatingLabel>
                  </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createnm editNounModifierTemplateInput">
                    <FloatingLabel
                        label="Modifier Definition / Guidelines"
                      className="float-hidden float-select">
                      <TextField
                        className="resizable-textfield"
                        id="Details"
                        inputProps={{ maxLength: 4000 }}
                        multiline
                        rows={3}
                        col={300}
                        variant="outlined"
                        size="small"
                        style={{ width: '100%' }}
                        value={nounModifierDefinitionOrGuidelines}
                        onChange={(e) => this.setState({ nounModifierDefinitionOrGuidelines: e.target.value })}
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
              <div style={{ border: "1px solid #cdd4e0", borderTop: "0px" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10">
                  {this.state.synonymError && <div className="error">{this.state.synonymError}</div>}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable editnounmodifier">
                          <MaterialReactTable
                            columns={synonymColumns}
                            data={synonymData}
                            renderTopToolbarCustomActions={() => (
                              <Box className="row evvcontent" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span className="col-md-5"><b>Synonym</b></span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton onClick={this.handleSynonymCSVExport}>
                                      <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                    </IconButton>
                                  </Tooltip>
                                  <CSVLink
                                    data={this.getTransformedSynonymDataForExport()}
                                    headers={synonymColumns
                                      .filter(col => col.accessorKey !== "Delete")
                                      .map(col => ({ label: col.header, key: col.accessorKey }))}
                                    filename="NounSynonym_Data.csv"
                                    ref={(r) => (this.csvLinkSynonym = r)}
                                    style={{ display: 'none' }}
                                  />
                                  <Button variant="secondary" onClick={this.addNewSynonym} className="vewsubmit-button" style={{ float: "right" }}>
                                    <i className="fa fa-plus mr-1"></i> Add New Synonym
                                  </Button>
                                </div>
                              </Box>
                            )}
                            enableColumnFilterModes={true}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}
                            enablePagination={false}
                            enableStickyHeader={true}
                            getRowProps={(row) => ({
                              style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent', },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
              <div style={{ border: "1px solid #cdd4e0", borderTop: "0px" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  {this.state.attributesError && <div className="error">{this.state.attributesError}</div>}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable">
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
                              <Box className="row evvcontent" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span className="col-md-5"><b>Attributes</b></span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton onClick={this.handleAttributeCSVExport}>
                                      <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                    </IconButton>
                                  </Tooltip>
                                  <CSVLink
                                    data={this.getTransformedAttributeDataForExport()}
                                    headers={attributeColumns
                                      .filter(col => col.accessorKey !== "Delete")
                                      .map(col => ({ label: col.header, key: col.accessorKey }))}
                                    filename="Attributes_Data.csv"
                                    ref={(r) => (this.csvLinkAttribute = r)}
                                    style={{ display: 'none' }}
                                  />
                                  <Button variant="secondary" onClick={this.addNewAttribute} className="vewsubmit-button" style={{ float: "right" }}>
                                    <i className="fa fa-plus mr-1"></i> Add New Attribute
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent' },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
              <div style={{ border: "1px solid #cdd4e0", borderTop: "0px" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  {this.state.attributeevvError && <div className="error">{this.state.attributeevvError}</div>}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable">
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
                              <Box className="row evvcontent" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span className="col-md-5"><b>Attribute Enumerated valid values(EVVs)</b></span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton onClick={this.handleAttributeEVVCSVExport}>
                                      <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                    </IconButton>
                                  </Tooltip>
                                  <CSVLink
                                    data={this.getTransformedAttributeEvvDataForExport()}
                                    headers={[
                                      { label: 'Attribute', key: 'Attribute' },
                                      { label: 'Enumerated Valid Value', key: 'EnumeratedValidValue' },
                                      { label: 'Priority', key: 'Priority' }
                                    ]}
                                    filename="AttributesEVV_data.csv"
                                    ref={(r) => (this.csvLinkAttributeEvv = r)}
                                    style={{ display: 'none' }}
                                  />

                                  <Button variant="secondary" onClick={this.addNewAttributeEVV} className="vewsubmit-button" style={{ float: "right" }}>
                                    <i className="fa fa-plus mr-1"></i> Add Attribute EVV
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent', },
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>

              <div style={{ border: "1px solid #cdd4e0", borderTop: "0px" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  {this.state.unspscError && <div className="error">{this.state.unspscError}</div>}
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmtable">
                          <MaterialReactTable
                            columns={unspscColumns}
                            data={unspscData}
                            enableColumnFilterModes={true}
                            enableColumnOrdering={false}
                            enableRowSelection={false}
                            enableFullScreenToggle={false}
                            enablePagination={false}
                            enableDensityToggle={false}
                            enableStickyHeader={true}
                            renderTopToolbarCustomActions={() => (
                              <Box className="row evvcontent" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span className="col-md-5"><b>UNSPSC</b></span>
                                <div className="synontmdnldtext col-md-7">
                                  <Tooltip title="Download CSV">
                                    <IconButton onClick={this.handleUNSPSCCSVExport}>
                                      <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                    </IconButton>
                                  </Tooltip>
                                  <CSVLink
                                    data={this.getTransformedUnspscDataForExport()}
                                    headers={unspscColumns
                                      .filter(col => col.accessorKey !== "Delete")
                                      .map(col => ({ label: col.header, key: col.accessorKey }))}
                                    filename="UNSPSC_data.csv"
                                    ref={(r) => (this.csvLinkUnspsc = r)}
                                    style={{ display: 'none' }}
                                  />
                                  <Button variant="secondary" onClick={this.addNewUNSPSC} className="vewsubmit-button" style={{ float: "right" }}>
                                    <i className="fa fa-plus mr-1"></i> Assign UNSPSC
                                  </Button>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent', },
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
              <div style={{ border: "1px solid #cdd4e0", borderLeft: "0px", borderTop: "0px", height: "100%" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10  " style={{ height: "100%" }}>
                  {this.state.nounModifierImagesError && <div className="error">{this.state.nounModifierImagesError}</div>}
                  <ToolkitProvider keyField="id">
                    {() => {
                      const { nounModifierImageColumns, nounModifierImageData } = this.nounModifierImageTable();
                      return (
                        <div className="mg-t-0 viewmaincontent editnountble">
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
                              renderTopToolbarCustomActions={() => (
                                <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
                                  <span><b>Noun Modifier Images</b></span>
                                  <Button variant="secondary" onClick={this.addNewImage} className="vewsubmit-button" style={{ float: "right" }}>
                                    <i className="fa fa-plus mr-1"></i> Add New Image
                                  </Button>
                                </Box>
                              )}
                              getRowProps={(row) => ({
                                style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent' },
                              })}
                              style={{ height: "calc(100vh - 490px)" }}
                            />
                          </div>
                        </div>
                      )
                    }}
                  </ToolkitProvider>
                </div>
              </div>
            </Col>
            <div className="nmsvntnsview">
              <Button variant="secondary" className="nmbtn" style={{ marginRight: "30px", width: "100px" }} onClick={this.handleSave}>
                <i className="fa fa-save mr-1"></i> Save
              </Button>
              <Button variant="secondary" className="vewsubmit-button" style={{ width: "100px" }} onClick={this.reset}>
                <i class="fa fa-refresh mr-1"></i>Reset
              </Button>
            </div>
          </Row>
        </LoadingOverlay>
        <Modal show={synonymModal} onHide={this.synonymCancel} className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl" backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add Synonym to Noun</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Noun" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Noun || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Modifier" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Modifier || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Synonym" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-15" maxLength="100" placeholder="Enter Synonym max. 100 characters" name="Synonym" value={Synonym} onChange={this.handleInputChange} />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Synonym Definition / Guidelines" className="float-hidden float-select">
                  <TextField
                    className="resizable-textfield"
                      placeholder="Enter Synonym Definition / Guidelines max. 4000 characters"
                    inputProps={{ maxLength: 4000 }}
                    multiline
                    rows={3}
                    col={300}
                    variant="outlined"
                    size="small"
                    style={{ width: '100%' }}
                    name="SynonymDefinitionOrGuidelines"
                    value={SynonymDefinitionOrGuidelines}
                    onChange={this.handleInputChange}
                  />
                </FloatingLabel>
              </div>
            </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="nmbtn" style={{ marginRight: "10px" }} onClick={this.handleSynonymAddToList}>
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button variant="secondary" onClick={this.synonymCancel} className="vewsubmit-button">
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={attributeShowModal} onHide={this.attributeCancel} className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl" backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add Attributes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Noun" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Noun || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Modifier" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Modifier || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Attribute" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0" maxLength="100" placeholder="Enter Attribute max. 4000 characters" name="Attribute" value={Attribute} onChange={this.handleInputChange} />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Attribute Guidelines" className="float-hidden float-select">
                    <TextField
                      className="resizable-textfield"
                      placeholder="Enter Attribute Guidelines max. 4000 characters"
                      inputProps={{ maxLength: 4000 }}
                      multiline
                      rows={3}
                      col={300}
                      variant="outlined"
                      size="small"
                      style={{ width: '100%' }}
                      name="AttributeGuidelines"
                      value={AttributeGuidelines}
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Priority" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-15" maxLength="1" placeholder="Enter Priority max. 1 character" name="Priority" value={Priority} onChange={this.handleInputChange} />
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
                  <label style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '0px' }}>
                    <input
                      type="radio"
                      name="MandatoryOrOptional"
                      value="M"
                      checked={this.state.MandatoryOrOptional === "M"}
                      onChange={this.handleInputChange}
                    /> Mandatory
                  </label>
                  <label style={{ marginBottom: '0px' }}>
                    <input
                      type="radio"
                      name="MandatoryOrOptional"
                      value="O"
                      checked={this.state.MandatoryOrOptional === "O"}
                      onChange={this.handleInputChange}
                    /> Optional
                  </label>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="nmbtn" style={{ marginRight: "10px" }} onClick={this.handleAttributeAddToList}>
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button variant="secondary" onClick={this.attributeCancel} className="vewsubmit-button">
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={attributeEVVModal} onHide={this.attributeEvvCancel} className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl" backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add Attribute EVVs</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Noun" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Noun || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Modifier" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Modifier || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Attribute Name" className="float-hidden float-select">
                    <select
                      className="form-control"
                      tabIndex="1"
                      name="Attribute"
                      value={Attribute}
                      onChange={this.handleAttributeChange}
                    >
                      <option value="">--Select Attribute Name--</option>
                      {attributeData.length > 0 ? (
                        attributeData.map((option, index) => (
                          <option key={index} value={option.Attribute}>
                            {option.Attribute}
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
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Attribute Value" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-15" maxLength="4000" placeholder="Enter Enumerated Valid Value max. 4000 characters" name="EnumeratedValidValue" value={EnumeratedValidValue} onChange={this.handleInputChange} />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Priority" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-15" maxLength="1" placeholder="Enter Priority max. 1 character" name="Priority" value={Priority} onChange={this.handleInputChange} />
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="nmbtn" style={{ marginRight: "10px" }} onClick={this.handleAttributeEvvAddToList}>
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button variant="secondary" onClick={this.attributeEvvCancel} className="vewsubmit-button">
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={unspscshowModal} onHide={this.unspscCancel} className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl" backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add UNSPSC</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Noun" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Noun || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Modifier" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Modifier || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="UNSPSC Version" className="float-hidden float-select">
                    <select
                      className="form-control flex-grow-1"
                      tabIndex="9"
                      id="unspscversion"
                      name="unspscversion"
                      value={selectedUNSPSCVersion}
                      onChange={this.onChangeUNSPSCVersion}
                    >
                      <option>--Select UNSPSC Version--</option>
                      {this.state.unspscVersions.map((unspscversion) => (
                        <option key={unspscversion.Version}>{unspscversion.Version}</option>
                      ))}
                    </select>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="UNSPSC Code - Category" className="float-hidden float-select">
                    <select
                      className="form-control flex-grow-1"
                      id="category"
                      name="category"
                      value={selectedUNSPSCCategory}
                      onChange={this.onChangeUNSPSCCategory}
                    >
                      <option>--Select UNSPSC Code - Category--</option>
                      {unspscCategories.map(category => (
                        <option key={category.Code} value={category.Code}>
                          {category.Code} - {category.Category}
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
            <Button variant="secondary" className="nmbtn" style={{ marginRight: "10px" }} onClick={this.handleUNSPSCAddToList}>
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button variant="secondary" onClick={this.unspscCancel} className="vewsubmit-button">
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={imageShowModal} onHide={this.nounModifierImageCancel} className="edit-gop-modal mymnmdl viewsug mrdictionary nmmdl" backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add Noun - Modifier Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 ">
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Noun" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Noun || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="createnm editNounModifierModelInput">
                  <FloatingLabel label="Modifier" className="float-hidden float-select">
                    <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={Modifier || ''} readOnly />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <div className="createnm editNounModifierModelInput editImageData">
                  <FloatingLabel label="Image" className="float-hidden float-select">
                  <div className="custom-file-input create-nmimage">
                    <input type="text" className="form-control" value={uploadedImageFileName} readOnly />
                    <input type="file" accept="image/*" className="form-control-file" ref={this.fileInputRef} onChange={this.uploadImageFile} />
                  </div>
                  </FloatingLabel>
                  <span className="text-danger asterisk-size ml-2">*</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="nmbtn" style={{ marginRight: "10px" }} onClick={this.addImageToList}>
              <i className="fa fa-plus mr-1"></i> Add to List
            </Button>
            <Button variant="secondary" onClick={this.nounModifierImageCancel} className="vewsubmit-button">
              <i className="fa fa-close mr-1"></i> Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  //#endregion
}

export default EditNounModifierTemplate;
