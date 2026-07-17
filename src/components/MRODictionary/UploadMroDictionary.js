import React, { Component } from "react";
import "../reports/report.scss";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import "../Allocation/ProductionAllocation.scss";
import "./UploadMroDictionaryNew.scss";
import helper from "../../helpers/helpers";
import {Row, Col, Modal, Button} from 'react-bootstrap';
import GOPEditScreen from "../Allocation/GOPEditScreen";
import GOPPreviewScreen from "../Allocation/GOPPreviewScreen";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { MaterialReactTable } from 'material-react-table';
// import { Box } from '@mui/material';
// import {IconButton,Tooltip} from '@mui/material';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
import mroDictionaryService from "../../services/mroDictionary.service";
import projectService from "../../services/project.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import moment from 'moment';
import accessControlService from "../../services/accessControl.service";

toast.configure();

class UploadMroDictionary extends Component {
  
    constructor(props) {
        super(props);
        
        this.state = {
          nounDefinitionsStatus: 'pending', 
          nounModifierDefinitionsStatus: 'pending',
          nounSynonymsStatus: 'pending',
          nounModifierAttributesStatus: 'pending',
          nounModifierAttributeValuesStatus: 'pending',
          nounModifierMappedToUNSPSCsStatus: 'pending',
          validateAndUpdateMRODictionaryStatus: 'pending',
          loading: false,
          spinnerMessage: "",
          formErrors: {},
          rowData: [],
          isStatusUpdating: false,
          editModal: false,
          viewScreenData: {},
          previewModal: false,
          fileName: '',
          showModal: false,
          mrodatashowModal: false,
          mrodataupdateshowModal: false,
          selectedData: null,
          versionNameOrNo: '',
          uploadedFileName: '',
          uploadedNewFileName: '',
          validationErrors: {
            fileName: '',
            versionName: '',
          },
          activeRowId: null,
          data: {},
          mroData: [],
          UserID: helper.getUser(),
          customerInputFileName: "",
          canAccessMroDictionary: false, 
          canUserAccessDownloadMRODictionaryPage: false,
          canUserAccessDeleteMRODictionaryPage: false,

        };
        
        this.uploadInputFile = this.uploadInputFile.bind(this);  
        this.downloadMRODictionaryTemplate = this.downloadMRODictionaryTemplate.bind(this); 
        this.handleClose = this.handleClose.bind(this);
        this.mrodataupdatehandleClose = this.mrodataupdatehandleClose.bind(this);
        this.triggerSuccess = this.triggerSuccess.bind(this);
        this.triggerError = this.triggerError.bind(this);
        this.fetchMROData = this.fetchMROData.bind(this);
        this.handleDownloadVersion = this.handleDownloadVersion.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleYes = this.handleYes.bind(this);
        this.handleNo = this.handleNo.bind(this);
        
        
      }
  //#region fetching Download MRO Dictionary Template from Web API
  
  downloadMRODictionaryTemplate = () => {
    this.setState({
      spinnerMessage: "Please wait while downloading all production Items...",
      modalLoading: true,
    });
  
    mroDictionaryService.DownloadMRODictionaryTemplate()
      .then(response => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MRODictionaryTemplate.xlsx'; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        this.setState({
          spinnerMessage: "",
          modalLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          spinnerMessage: "",
          modalLoading: false,
        });
        toast.error('Error downloading the file. Please try again.');
      });
  };
  
  //#endregion

//#region Download the Method to handle file download
 handleDownloadVersion(id, uploadedFileName) {
  const UserID = helper.getUser();
  this.setState({
    spinnerMessage: "Please wait while downloading all production Items...",
    modalLoading: true,
  });

  mroDictionaryService.downloadSelectedMRODictionaryVersionDataFile(id, uploadedFileName, UserID)
    .then(response => {
      
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          id + "-" + uploadedFileName
        );
        document.body.appendChild(fileLink);
        fileLink.click();

      this.setState({
        spinnerMessage: "",
        modalLoading: false,
      });
    })
    .catch(error => {

      this.setState({
        spinnerMessage: "",
        modalLoading: false,
      });
      toast.error('Access Denied.');
    });
}
//#endregion

//#region fetching Project page access
 canUserAccessPage(pageName) {
  accessControlService
    .CanUserAccessPage(helper.getUser(), pageName)
    .then((response) => {
      if (pageName === "Download MRO Dictionary") {
        this.setState({
          canUserAccessDownloadMRODictionaryPage: response.data,
        });
      }else if (pageName === "Delete MRO Dictionary") {
        this.setState({
          canUserAccessDeleteMRODictionaryPage: response.data,
        });
      }


    })
    .catch((e) => {
      toast.error(e.response.data.Message, { autoClose: false });
    });
}
//#endregion

//#region Show Confirmation Modal
handleDelete = (id, UploadedFileName) => {
  this.setState({
    mrodatashowModal: true,
    deleteId: id,
    deleteUploadedFileName: UploadedFileName,
  });
};
//#endregion

//#region Confirm Deletion
handleYes = () => {
  const { deleteId, deleteUploadedFileName } = this.state; 

  const UserID = helper.getUser();
  
  this.setState({
    spinnerMessage: "Please wait while deleting Customer...",
    loading: true,
  });

  mroDictionaryService
    .deleteSelectedMRODictionaryVersion(deleteId, deleteUploadedFileName, UserID)
    .then((response) => {
      this.setState({
        mrodatashowModal: false,
        loading: false,
        mroData: this.state.mroData.filter(item => item.MRODictionaryID !== deleteId),
      });
      toast.success("MRO Dictionary Version deleted successfully.");
    })
    .catch((e) => {
      this.setState({ loading: false });
      toast.error(e.response.data.Message, { autoClose: false });
      this.handleNo();
    });
};
//#endregion

handleNo = () => {
  this.setState({ mrodatashowModal: false });
}

// Render the Modal

  //#region fetching MRO Dictionary Template from Web API

  uploadInputFile = (e) => {
   
    let files = e.target.files;
    let currentFile = files[0];
    let fileName = currentFile.name; 
    console.log(fileName, "fileName")
    
    this.setState({
      messageForSelectedInputFile: true,
      spinnerMessage: "Please wait while reading file data...",
      loading: true,
    });
  
    let formData = new FormData();
    formData.append("File", currentFile);
  
    projectService.saveFileupload(formData)
      .then((response) => {
          
        const uploadedFileName = response.data; 
  
        this.setState({
          uploadedFileName: fileName,
          uploadedNewFileName: uploadedFileName,
          validationErrors: {
            ...this.state.validationErrors,
            uploadedFileName: "", 
          },
        });
  
        return mroDictionaryService.validateCorrectFileUpload(uploadedFileName);
      })
      .then((response) => {
        if (response && response.data) {
         
        } else {
          
        }
  
        return mroDictionaryService.readCountOfAllDataFromFile(this.state.uploadedNewFileName);
      })
      .then((response) => {
       
        this.setState({
          data: response.data,
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.Message || "An error occurred", { autoClose: false });
      })
      .finally(() => {
        this.setState({
          messageForSelectedInputFile: false,
          loading: false,
        });
        e.target.value = null;
      });
  
    if (e.target.value) {
      this.setState(prevState => ({
        formErrors: {
          ...prevState.formErrors,
          selectedInputFileError: "",
        }
      }));
    }
  }
  
  //#endregion

  handleRowClick = (rowData) => {
    console.log(rowData); 
    this.setState({
      showModal: true,
      selectedData: rowData,
      activeRowId: rowData.id
    });
  };
  //#region Close the modal and reset selected data
  mrodataupdatehandleClose = () =>{
    this.setState({
      showModal:false,
      mrodatashowModal:false,
      mrodataupdateshowModal:false,

    })
  }
  handleClose = () => {
    this.setState({
      showModal: false,
      selectedData: null,
      uploadedFileName: '',  
      versionName: '', 
      successMessage: '',
      errorMessage: '', 
      loading: false,
      showCloseButton: false,
      nounDefinitionsStatus: 'pending',
      nounModifierDefinitionsStatus: 'pending',
      nounSynonymsStatus: 'pending',
      nounModifierAttributesStatus: 'pending',
      nounModifierAttributeValuesStatus:'pending',
      nounModifierMappedToUNSPSCsStatus:'pending',
      nounTableName: '',
      nounModifierTableName: '',
      nounSynonymsTableName: '',
      nounModifierAttributesTableName: '',
      nounModifierAttributeValuesTableName: '',
      nounModifierMappedToUNSPSCsTableName: '',
      validateAndUpdateMRODictionaryStatus:'pending', 
      data:{},
    }, () => {
      this.fetchMROData();
    });
};

//#endregion

   // Method to trigger a success message
   triggerSuccess() {
    this.setState({
      successMessage: false,
      errorMessage: '',
      showCloseButton: true, 
    });
  }

  // Method to trigger an error message
  triggerError() {
    this.setState({
      successMessage: false,
      errorMessage: 'An error occurred.',
      showCloseButton: true, 
    });
  }

  handleOpenModal = (data) => {
    this.setState({ modalData: data, showModal: true });
  };
  // #endregion

  // #region Table Columns
  mrodataColumns() {
    const columns = [  
      {
        accessorKey: "UpdatedOn",
        header: "Updated Date",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal',
          },
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal',
          },
        },
        Cell: ({ row }) => (
          <div>
            {moment(row.original.UpdatedOn).format('DD-MMM-YYYY')}
          </div>
        ),
      },
      {
        accessorKey: "UpdatedBy", 
        header: "Updated By",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '300px',
            whiteSpace: 'normal', 
            wordWrap: 'break-word',
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },
      {
        accessorKey: "VersionNameOrNo", 
        header: "Version Name / No.",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '180px',
            minWidth: '180px',
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },                
      {
        accessorKey: "NoOfNouns", 
        header: "No. of Nouns",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },
      {
        accessorKey: "NoOfNounModifiers", 
        header: "No. of Noun Modifiers",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '180px',
            minWidth: '180px',
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },
      {
        accessorKey: "NoOfNounSynonyms", 
        header: "No. of Noun Synonyms",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '180px',
            minWidth: '180px',
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },
      {
        accessorKey: "NoOfNounModifierAttributes", 
        header: "No. of Noun Modifier Attributes",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word',
            width: '230px',
            minWidth: '230px'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },
      {
        accessorKey: "NoOfNounModifierAttributeEVVs", 
        header: "No. of Noun Modifier EVVs",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word',
            width: '230px',
            minWidth: '230px'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      },
      {
        accessorKey: "NoOfNounModifiersMappedToUNSPSC", 
        header: "No. of Noun Modifiers Mapped to UNSPSC",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word',
            width: '230px',
            minWidth: '230px'
          },      
        },
        muiTableBodyCellProps: {
          align: "center",
          style: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word'
          },    
        },
      }
    ];
  
    if (this.state.canUserAccessDownloadMRODictionaryPage) {
      columns.push(
        {
          accessorKey: 'DownloadData',
          header: 'Download Data',
          muiTableHeadCellProps: {
            align: 'center',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' },
          },
          muiTableBodyCellProps: {
            align: 'center',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' },
          },
          Cell: ({ row }) => (
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i
                className="fa fa-download"
                title="Download Data"
                style={{ color: '#5b47fb', fontSize: '16px' }}
                onClick={() => this.handleDownloadVersion(row.original.MRODictionaryID, row.original.UploadedFileName)}
              ></i>
            </div>
          ),
        },
      );
    }
    if (this.state.canUserAccessDeleteMRODictionaryPage) {
      columns.push(
        {
          accessorKey: "Delete", 
          header: "Delete",
          muiTableHeadCellProps: {
            align: "center",
            style: {
              whiteSpace: 'normal', 
              wordWrap: 'break-word'
            },    
          },
          muiTableBodyCellProps: {
            align: "center",
            style: {
              whiteSpace: 'normal', 
              wordWrap: 'break-word'
            },    
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
                onClick={() => this.handleDelete(row.original.MRODictionaryID, row.original.UploadedFileName, row.original.UserID)}
              ></i>
            </div>
          ),
        }
      );
    }
  
    return columns;
  }

  
// #region to export csv file  
  generateCsv = (columns) => (data) => {
    const csvRows = [];
    const headers = columns.map(col => col.header);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = columns.map(col => {
        const value = row[col.accessorKey] || '';
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
  
    return csvRows.join('\n');
  };
  
  handleExport = () => {
    const { mroData } = this.state; 
    const columns = this.mrodataColumns(); 
    const csv = this.generateCsv(columns)(mroData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MRO Dictionary Data.csv'); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

// #endregion 

//#region validate input fields
validateInputs = () => {
  const { uploadedFileName, versionName } = this.state;
  let isValid = true;
  const validationErrors = {};
  if (!uploadedFileName) {
    validationErrors.uploadedFileName = 'Please select a file.';
    isValid = false;
  } else {
    isValid = true;
    validationErrors.uploadedFileName = ''; 
  }
  if (!versionName || versionName.length > 20) {
    validationErrors.versionName = 'Please enter a valid version name or no.';
    isValid = false;
  } else {
    validationErrors.versionName = ''; 
  }

  this.setState({ validationErrors });
  return isValid;
};

// #endregion 

componentDidMount() {
  this.fetchMROData();
  this.canUserAccessPage("Download MRO Dictionary");
  this.canUserAccessPage("Delete MRO Dictionary");
}

//#region fetch the Upload file count through web API
fetchMROData() {
  this.setState({ loading: true, spinnerMessage: "Please wait while reloading MRO Dictionary Versions list..." });

  mroDictionaryService.readMRODictionariesList()
    .then((response) => {
      const data = response.data;

      if (data.length > 0) {
        this.setState({ mroData: data });
      } else {
        this.setState({ mroData: [] });
      }
    })
    .catch((error) => {
      toast.error('Failed to fetch data. Please try again later.');
    })
    .finally(() => {
      this.setState((prevState) => ({
        ...prevState,
        loading: false,
        spinnerMessage: ""
      }));
    });
}

// #endregion 

knowTheValidations = () =>{

  this.setState({
    mrodataupdateshowModal: true,})

}

//#region Validate And Update MRO Dictionary
handleValidate = () => {
  
  const isValid = this.validateInputs();

  if (!isValid) {
    this.setState({
      showModal: false,
      successMessage: '',
      errorMessage: 'Validation failed. Please fix the errors before proceeding.',
    });
    return;
  }

  const { uploadedNewFileName, versionName } = this.state;

  if (!uploadedNewFileName) {
  
    return;
  }

  if (!versionName) {
    
    this.setState({
      loading: false,
      errorMessage: 'Version name is required.',
      showCloseButton: true,
    });
    return;
  }

  const updateStatus = (statusField, tableNameField, response) => {
    this.setState({
      [statusField]: 'success',
      [tableNameField]: response.data,
    });
  };

  this.setState({
    showModal: true,
    successMessage: '',
    errorMessage: '',
    loading: true,
    showCloseButton: false,
    nounDefinitionsStatus: 'loading',
    nounModifierDefinitionsStatus: '',
    nounSynonymsStatus: '',
    nounModifierAttributesStatus: '',
    nounTableName: '',
    nounModifierTableName: '',
    nounSynonymsTableName: '',
    nounModifierAttributesTableName: '',
    nounModifierAttributeValuesTableName: '',
    nounModifierMappedToUNSPSCsTableName: '',
    validateAndUpdateMRODictionaryStatus:'', 
  });

  mroDictionaryService.validateAndUploadNounDefinitions(uploadedNewFileName)
    .then((response) => {
      
      updateStatus('nounDefinitionsStatus', 'nounTableName', response);
      this.setState({ nounModifierDefinitionsStatus: 'loading' });
      return mroDictionaryService.validateAndUploadNounModifierDefinitions(uploadedNewFileName);
    })
    .then((response) => {
     
      updateStatus('nounModifierDefinitionsStatus', 'nounModifierTableName', response);
      this.setState({ nounSynonymsStatus: 'loading' });
      return mroDictionaryService.validateAndUploadNounSynonyms(uploadedNewFileName);
    })
    .then((response) => {
      
      updateStatus('nounSynonymsStatus', 'nounSynonymsTableName', response);
      this.setState({ nounModifierAttributesStatus: 'loading' });
      return mroDictionaryService.validateAndUploadNounModifierAttributes(uploadedNewFileName);
    })
    .then((response) => {
      
      updateStatus('nounModifierAttributesStatus', 'nounModifierAttributesTableName', response);
      this.setState({ nounModifierAttributeValuesStatus: 'loading' });
      return mroDictionaryService.validateAndUploadNounModifierAttributeEVVs(uploadedNewFileName);
    })
    .then((response) => {
      
      updateStatus('nounModifierAttributeValuesStatus', 'nounModifierAttributeValuesTableName', response);
      this.setState({ nounModifierMappedToUNSPSCsStatus: 'loading' });
      return mroDictionaryService.validateAndUploadNounModifierMappedUNSPSCs(uploadedNewFileName);
    })
    .then((response) => {
      
      updateStatus('nounModifierMappedToUNSPSCsStatus', 'nounModifierMappedToUNSPSCsTableName', response);
      this.setState({
        validateAndUpdateMRODictionaryStatus: 'loading',
      });

      const {
        uploadedFileName,
        uploadedNewFileName,
        versionName,
        nounTableName,
        nounModifierTableName,
        nounSynonymsTableName,
        nounModifierAttributesTableName,
        nounModifierAttributeValuesTableName,
        nounModifierMappedToUNSPSCsTableName,
      } = this.state;

      const modelData = {
        uploadedFileName: uploadedFileName,
        uploadedTempFileName: uploadedNewFileName,
        versionNameOrNo: versionName,
        NounTableName: nounTableName,
        NounModifierTableName: nounModifierTableName,
        NounSynonymTableName: nounSynonymsTableName,
        NounModifierAttributeTableName: nounModifierAttributesTableName,
        NounModifierAttributeValuesTableName: nounModifierAttributeValuesTableName,
        NounModifierMappedUNSPSCs: nounModifierMappedToUNSPSCsTableName,
        UserID: helper.getUser(),
      };

      return mroDictionaryService.validateAndUpdateMRODictionary(modelData);
    })
    .then((response) => {
      
      updateStatus('validateAndUpdateMRODictionaryStatus', 'validateAndUpdateMRODictionaryTable', response);
      this.setState({
        successMessage: 'MRO dictionary data from selected file uploaded successfully.',
        loading: false,
        showCloseButton: true,
        data:response,
      });
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      const errorMessage = error.response?.data?.Message || "An error occurred";

      this.setState((prevState) => {
        const statuses = [
          'validateAndUpdateMRODictionaryStatus',
          'nounDefinitionsStatus',
          'nounModifierDefinitionsStatus',
          'nounSynonymsStatus',
          'nounModifierAttributesStatus',
          'nounModifierAttributeValuesStatus',
          'nounModifierMappedToUNSPSCsStatus',
        ];

        const updatedState = { loading: false, errorMessage, showCloseButton: true };

        statuses.forEach((status) => {
          if (prevState[status] === 'loading') {
            updatedState[status] = 'error';
          }
        });

        return updatedState;
      });

      toast.error(errorMessage, {
        autoClose: false,
        className: 'Toastify',
        style: { display: 'none' },
      });
    });
};

  // #endregion 
  
  render() {
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    const { showModal, mrodatashowModal, mrodataupdateshowModal } = this.state;
    const { data } = this.state;
    let props = this.props;
    const {uploadedFileName, versionName } = this.state;
    
    return (
    <div style={setHeight(93)} className="production-update-main">
      {this.state.editModal && (
        <GOPEditScreen
          showEditModal={this.state.editModal}
          hideEdiModal={this.hideEdiModal}
          {...props}  
        />
      )}
      
      {this.state.previewModal && (
        <GOPPreviewScreen
          showPreview={this.state.previewModal}
          closePreviewModal={this.hidePreviewModal}
          stateValue={this.state.viewScreenData}
          {...props}  
        />
      )}

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
                style={{textDecoration:"underline"}}
              >
                Download Template
              </button>
            </div>
            <div style={{ border: "1px solid #cdd4e0" }} className="mg-l-0 mg-r-0 mg-t-15" >
              <div className="row mg-r-0 mg-l-0 mg-t-20 pndgqc-cnt">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-md-12">
                      Select file containing data to be uploaded to MRO Dictionary and click on 'Validate & Update MRO Dictionary' button to Update the MRO Dictionary.
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mg-r-0 mg-l-0 mg-t-20 pndgqc-cnt mg-b-10">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <div className="row">
                    <div className="col-md-5">
                      <b>Select file</b> <span className="text-danger">*</span>
                    </div>
                    <div className="col-md-7">
                      <div className="custom-file-input">
                        <input type="text" className="form-control" value={uploadedFileName}  readOnly />
                        <input type="file" accept=".xlsx" className="form-control-file" onChange={this.uploadInputFile} />
                      </div>
                      {this.state.validationErrors.uploadedFileName && (<div className="text-danger">{this.state.validationErrors.uploadedFileName}</div>)}
                    </div>
                  </div>
                </div>
                <div className="col-md-1 col-sm-6 col-xs-12">

                </div>
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <div className="row">
                    <div className="col-md-5">
                      <b>Version Name / No.</b> <span className="text-danger">*</span>
                    </div>
                    <div className="col-md-7">
                      <input
                          type="text"
                          className="form-control"
                          placeholder="Enter maximum 20 characters"
                          value={versionName}
                          maxLength={20}
                          onChange={(e) => {
                            this.setState({
                              versionName: e.target.value,
                              validationErrors: {
                                ...this.state.validationErrors,
                                versionName: "", 
                              }
                            });
                          }}
                      />
                      {this.state.validationErrors.versionName && (
                          <div className="text-danger">{this.state.validationErrors.versionName}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <span><b>File Data Summary</b></span>
                </div>
              </div> 
              <div className="row mg-r-0 mg-l-0 mg-t-0 pndgqc-cnt mg-b-15">
                <div className="col-md-12 col-sm-6 col-xs-12 ">
                  <div className="row mrodict">
                    <table className="table table-borderless">
                      <tbody className="row">
                        <tr className="col-md-4">
                          <td className="col-md-8 mrcnt">
                            <span><b>No. of Nouns :</b></span>
                            <span className="nnsdta">{data.NoOfNouns}</span>
                          </td>
                        </tr>
                        <tr className="col-md-4">
                          <td className="col-md-8 mrcnt">
                            <span><b>No. of Noun Modifiers :</b></span>
                            <span className="nnmdrs">{data.NoOfNounModifiers}</span>
                          </td>                               
                        </tr>
                        <tr className="col-md-4">
                          <td className="col-md-8 mrcnt">
                            <span><b>No. of Noun Synonyms :</b> </span>
                            <span className="nnsyns">{data.NoOfNounSynonyms}</span>
                          </td>                              
                        </tr>
                        <tr className="col-md-4">
                          <td className="col-md-8 mrcnt">
                            <span><b>No. of Noun Modifier Attributes :</b> </span>
                            <span className="ml-0">{data.NoOfNounModifierAttributes}</span>
                          </td>                                 
                        </tr>
                        <tr className="col-md-4">
                          <td className="col-md-8 mrcnt">
                            <span><b>No. of Noun Modifier Attribute EVVs :</b></span>
                            <span className="ml-0">{data.NoOfNounModifierAttributeEVVs}</span>
                          </td>                             
                        </tr>
                        <tr className="col-md-4">
                          <td className="col-md-8 mrcnt">
                            <span><b>No. of Noun Modifiers Mapped to UNSPSC :</b></span>
                            <span className="ml-0">{data.NoOfNounModifiersMappedToUNSPSC}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>    
                  </div>
                </div>  
              </div>
              <div className="vldt-dta">
                <button
                  className="down-item-link mg-l-15"
                  onClick={this.knowTheValidations}
                  style={{textDecoration:"underline"}}
                >
                  View the Validations applied on data
                </button>
                <div className="mrodictbtn">
              
                  <button className="btn btn-gray-700 btn-block mg-b-15" onClick={this.handleValidate}>
                    Validate and Upload Dictionary
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mg-t-20 mg-l-10 mg-r-15">
          <Col lg={12} style={{ maxWidth: "100%" }}>
            <ToolkitProvider keyField="id">
              {() => (
                <div className="mg-t-0">
                  <div className="pdqcmro masters-material-table upldmrodiction">
                    <MaterialReactTable
                      data={this.state.mroData}
                      columns={this.mrodataColumns()}
                      enableColumnFilterModes={true}
                        enableColumnOrdering={false}
                        enableRowSelection={false}
                        enablePagination={false}
                        enableStickyHeader={true}
                        // renderTopToolbarCustomActions={() => (
                        //   <Box sx={{display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap'}}>
                        //     <Tooltip title="Download CSV">
                        //       <IconButton onClick={this.handleExport}>
                        //         <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                        //       </IconButton>
                        //     </Tooltip>
                        //   </Box>
                        // )}
                        getRowProps={(row) => ({
                          style: {backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent', },
                        })}
                    />
                  </div>
                </div>
              )}          
            </ToolkitProvider>
          </Col>
        </Row>  
        
             
      </LoadingOverlay>
      

      <Modal show={showModal} onHide={this.handleClose} className="edit-gop-modal mymnmdl viewsug mrdictionary" backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Validating and Uploading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mymdldata" style={{ paddingBottom: '0px', width: '100%' }}>
            <table className="table table-bordered">
              <tbody className="mrodicttblebdy">
                {[
                  { status: this.state.nounDefinitionsStatus, label: 'Noun Definitions' },
                  { status: this.state.nounModifierDefinitionsStatus, label: 'Noun Modifier Definitions' },
                  { status: this.state.nounSynonymsStatus, label: 'Noun Synonyms' },
                  { status: this.state.nounModifierAttributesStatus, label: 'Noun Modifier Attributes' },
                  { status: this.state.nounModifierAttributeValuesStatus, label: 'Noun Modifier Attribute EVVs' },
                  { status: this.state.nounModifierMappedToUNSPSCsStatus, label: 'Noun Modifier Mapped to UNSPSCs' },
                  { status: this.state.validateAndUpdateMRODictionaryStatus, label: 'Inserting data to MRO Dictionary data Model' },
                ].map((item, index) => (
                  <tr className="txt-plce mrodictcnt mt-2 mb-2" key={index}>
                    <td style={{ width: '25px', textAlign:'center', visibility: 'hidden' }}>
                      {this.state.validateAndUpdateMRODictionaryStatus === 'success' && <img src={checkmarkIcon} alt="checkmark" style={{ width: '23px', height: '23px' }} />}
                    </td>
                    <td style={{ width: '25px', textAlign:'center' }}>
                      {item.status === 'loading' && <img src={loaderIcon} alt="loadericon" style={{ width: '23px', height: '23px' }} />}
                      {item.status === 'success' && <img src={checkmarkIcon} alt="checkmark" style={{ width: '23px', height: '23px' }} />}
                      {item.status === 'error' && <img src={errorIcon} alt="erroricon" style={{ width: '23px', height: '23px' }} />}
                      {item.status !== 'success' && item.status !== 'loading' && item.status !== 'error' && <span className="reptimg">Pending</span>}
                    </td>
                    <td><b>{index + 1}. {item.label}</b></td>
                    <td style={{ width: '25px', textAlign:'center', visibility: 'hidden' }}>
                      {this.state.validateAndUpdateMRODictionaryStatus === 'success' && <img src={checkmarkIcon} alt="checkmark" style={{ width: '23px', height: '23px' }} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <span className="insttxt"><b></b></span>
                    <div className="mt-2 mysgtdta successmsg">
                      {(this.state.successMessage || this.state.errorMessage) && (
                        <div className="mt-2 mysgtdta successmsg">
                          {this.state.successMessage && (
                            <div className="alert alert-success">
                              {this.state.successMessage}
                            </div>
                          )}
                          {this.state.errorMessage && (
                            <div className="mrodta alert alert-danger">
                              {this.state.errorMessage}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
                  {this.state.showCloseButton && (
                    <Button variant="secondary" onClick={this.handleClose} className="vewsubmit-button">
                      <i className="fa fa-close mr-1"></i> Close
                    </Button>
                  )}
                </Modal.Footer>
      </Modal>

      <Modal
        show={mrodatashowModal}
        onHide={this.handleNo}
        backdrop="static"
        enforceFocus={false}
        className="mrodatamodel"
      >
        <Modal.Header>
          <Modal.Title>MRO Dictionary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Are you sure to delete this MRO Dictionary Version?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.handleYes}>
            Yes
          </Button>
          <Button variant="primary" onClick={this.handleNo}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={mrodataupdateshowModal}
        onHide={this.mrodataupdatehandleClose}
        backdrop="static"
        enforceFocus={false}
        className="mrodatamodel myvlddta"
      >
        <Modal.Header closeButton>
          <Modal.Title>Validations applied on input file data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>The input file data is checked by following conditions before updating to MRO Dictionary data model in database</p>
          </div>
          <table className="table table-bordered">
              <thead>
              <tr className="txt-plce mt-2 mb-2">
                    <th style={{ width: '10%', textAlign:'center' }}>
                      Sl. No.
                    </th>
                    
                    <th style={{ width: '90%', textAlign:'center' }}>
                    Validation
                    </th>
                  </tr>
              </thead>
              <tbody>
                  
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    1
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is input file successfully uploaded to server?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    2
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is uploaded workbook has 6 worksheets as per template?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    3
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is uploaded workbook has noun data in first worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    4
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Has uploaded workbook all worksheet's have columns as per template?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    5
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is Sl. No. column from each worksheet has a blank/empty value and is it exceeding 10 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    6
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is Noun column from each worksheet has a blank/empty value and is it exceeding 50 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    7
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Noun Definition' column value from Noun worksheet exceeding 4000 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    8
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Modifier' column from each worksheet has a blank/empty value and is it exceeding 100 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    9
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'Noun - Modifier Definition / Guidelines' column value from Noun-Modifier worksheet exceeding 4000 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    10
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Synonym' column from 'Noun-Synonym' worksheet has a blank/empty value and is it exceeding 100 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    11
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Synonym Definition / Guidelines' column value from 'Noun-Synonym' worksheet exceeding 4000 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    12
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Attribute' column from 'Noun-Modifier Attribute' worksheet has a blank/empty value and is it exceeding 100 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    13
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'Priority' column from 'Noun-Modifier Attribute' worksheet has a blank/empty value and is it exceeding 1 character?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    14
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Mandatory / Optional' column from 'Noun-Modifier Attribute' worksheet has a blank/empty value and is it exceeding 1 character?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    15
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'Attribute Guidelines' column from 'Noun-Modifier Attribute' worksheet exceeding 4000 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    16
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'Enumerated Valid Value (EVV)' column value is empty/blank in 'Noun-Modifier Attribute EVVs' worksheet and is it exceeding 4000 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    17
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Priority' column from 'Noun-Modifier Attribute EVVs' worksheet has a blank/empty value and is it exceeding 1 character?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    18
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'UNSPSC Version' column from 'Noun-Modifier Mapped UNSPSC' worksheet has a blank/empty value and is it exceeding 50 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    19
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'UNSPSC Code' column from 'Noun-Modifier Mapped UNSPSC' worksheet has a blank/empty value and is it not equal to 8 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    20
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'UNSPSC Category' column from 'Noun-Modifier Mapped UNSPSC' worksheet has a blank/empty value and is it exceeding 255 characters?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    21
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is MRO Dictionary Version No. already exist?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    22
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'Noun' column has unique values from 'Noun' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    23
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Noun' from 'Noun-Modifier' worksheet exists in 'Noun' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    24
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Are all 'Noun' and 'Modifier' columns have unique values in 'Noun-Modifier' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    25
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Noun' from 'Noun-Synonym' worksheet exists in 'Noun' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    26
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left'}}>
                    Is 'Noun' and 'Modifier' from 'Noun-Modifier Attribute' worksheet exists in 'Noun-Modifier' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    27
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Are all 'Noun' and 'Modifier' and 'Attribute' columns have unique values in 'Noun-Modifier Attribute' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    28
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Noun' and 'Modifier' and 'Attribute' columns values from 'Noun-Modifier Attribute EVVs' worksheet exists in 'Noun-Modifier Attribute' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    29
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'Noun' and 'Modifier' from 'Noun-Modifier UNSPSC' worksheet exists in 'Noun-Modifier' worksheet?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    30
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'UNSPSC Version' from 'Noun-Modifier Mapped UNSPSC' worksheet exists in UNSPSC Versions from UNSPSC Searcher?
                    </td>
                  </tr>
                  <tr className="txt-plce mrodictcnt mt-2 mb-2">
                    <td style={{ width: '10%', textAlign:'center' }}>
                    31
                    </td>
                    
                    <td style={{ width: '90%', textAlign:'left' }}>
                    Is 'UNSPSC Code' and 'UNSPSC Category' exists in the version of UNSPSC Searcher?
                    </td>
                  </tr>
                
              </tbody>
            </table>

        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={this.mrodataupdatehandleClose} className="vewsubmit-button myvldtbtn">
                      <i className="fa fa-close mr-1"></i> Close
                    </Button>
        </Modal.Footer>
      </Modal>
    </div>
    );
  }
}

export default UploadMroDictionary;
