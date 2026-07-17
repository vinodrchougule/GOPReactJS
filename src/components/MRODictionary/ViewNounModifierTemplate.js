import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from '@mui/material';
import "./ViewNounModifierTemplate.scss";
import helper from "../../helpers/helpers";
import { Row, Col, Button, Modal } from 'react-bootstrap';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box } from '@mui/material';
import mroDictionaryService from "../../services/mroDictionary.service";
import { CSVLink } from 'react-csv';
import accessControlService from "../../services/accessControl.service";
import FloatingLabel from "react-bootstrap/FloatingLabel";

toast.configure();

class ViewNounModifierTemplate extends Component {
  constructor(props) {
    super(props);
    const { VersionNameOrNo, Noun, Modifier } = props.location.state || {};
    this.state = {
      loading: false,
      spinnerMessage: "",

      VersionNameOrNo: VersionNameOrNo || '',
      Noun: Noun || '',
      Modifier: Modifier || '',
      nounDefinition: '',
      nounModifierDefinitionOrGuidelines: '',

      synonymColumns: this.synonymTable().synonymColumns,
      synonymData: this.synonymTable().synonymData,

      attributeColumns: this.attributeTable().attributeColumns,
      attributeData: this.attributeTable().attributeData,

      attributeEvvColumns: this.attributeEvvTable().attributeEvvColumns,
      attributeEvvData: this.attributeEvvTable().attributeEvvData,

      unspscColumns: this.unspscTable().unspscColumns,
      unspscData: this.unspscTable().unspscData,

      nounModifierImageColumns: this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData: this.nounModifierImageTable().nounModifierImageData,

      isToShowDeleteModal: false,
      isToDeleteNounModifier: false,
      isToCancelDeleteNounModifier: false,
      canEdit: false,
      canDelete: false,
      canAccessEditNounModifierTemplate: false,
      canAccessDeleteNounModifierTemplate: false,
    }
  }
  
  //#region Component Did Mount
  componentDidMount() {
    this.fetchViewNounModifierTemplateData();
    this.canUserAccessPage("Edit Noun-Modifier Template");
    this.canUserAccessPage("Delete Noun-Modifier Template");
  }
  //#endregion

  //#region fetch View Noun-Modifier Template Data
  fetchViewNounModifierTemplateData = () => {
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
      this.fetchAttributesValuesData(VersionNameOrNo, Noun, Modifier);
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
  }
  //#endregion

  //#region fetch Synonym Data
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
        console.error('Error fetching noun synonym data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region fetch Attributes Data
  fetchAttributesData = (VersionNameOrNo, Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Details...",
      loading: true
    });
    mroDictionaryService
      .readNounModifierAttributeDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier)
      .then((response) => {
        const { data: attributeData } = response;
        const AttributeNameValue = attributeData.map(attr => ({
          code: attr.id ? attr.id.toString() : '',
          value: attr.Attribute || ''
        }));
        this.setState({
          attributeData,
          AttributeNameValue,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error fetching attribute data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region fetch Attributes Values Data
  fetchAttributesValuesData = (VersionNameOrNo, Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Values Details...",
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
        console.error('Error fetching attribute values data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region fetch UNSPSC Data
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
        console.error('Error fetching attribute UNSPSC data:', error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region fetch Noun-Midifier Image Data
  fetchNounMidifierImageData = (Noun, Modifier) => {
    this.setState({
      spinnerMessage: "Please wait while loading Noun-Modifier images...",
      loading: true
    });
    mroDictionaryService
      .readNounModifierImages(Noun, Modifier)
      .then((response) => {
        const { data: nounModifierImageData } = response;
        this.setState({
          nounModifierImageData,
          loading: false,
        });
      });

  };
  //#endregion

  //#region Delete Noun-Modifier Data
  isToDeleteNounModifier = (VersionNameOrNo, Noun, Modifier) => {
    this.setState({ isToShowDeleteModal: false });
    const UserID = helper.getUser();
    this.setState({
      spinnerMessage: "Please wait while loading data...",
      loading: true
    });
    mroDictionaryService
      .deleteNounModifierTemplate(VersionNameOrNo, Noun, Modifier, UserID)
      .then((response) => {
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
        toast.success("Noun - Modifier Template Details from the selected Version deleted successfully");
        setTimeout(() => {
          sessionStorage.setItem("activeMroDictionaryTab", 3);
          this.props.history.push("/MRODictionary");
        }, 1000); 
      })
      .catch((error) => {
        toast.error("Failed to delete data!", error);
      })
      .finally(() => {
        this.setState({ loading: false });
      });                   
  };
  //#endregion

  //#region Noun-ModifierDelete Data
  nounModifierDelete = () => {
    this.setState({
      isToShowDeleteModal: true,
    });
  };
  //#endregion

  //#region Is Cancel Delete Noun-Modifier
  isToCancelDeleteNounModifier = () => {
    this.setState({ isToShowDeleteModal: false });
  };
  //#endregion

  //#region Handle CSV Export
  handleViewNounModifierSynonymCSVExport = () => {
    if (this.csvLinkSynonym) {
      this.csvLinkSynonym.link.click();
    }
  };

  handleViewNounModifierAttributeCSVExport = () => {
    if (this.csvLinkAttribute) {
      this.csvLinkAttribute.link.click();
    }
  }

  handleViewNounModifierAttributeEVVCSVExport = () => {
    if (this.csvLinkAttributeEvv) {
      this.csvLinkAttributeEvv.link.click();
    }
  }

  handleViewNounModifierUNSPSCDataCSVExport = () => {
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

  getTransformedAttributeEVVDataForExport = () => {
    const { attributeEvvData } = this.state;
    return attributeEvvData.map(row => ({
      Attribute: row.Attribute,
      EnumeratedValidValue: row.EnumeratedValidValue,
      Priority: row.Priority,
    }));
  };

  getTransformedUNSPSCDataForExport = () => {
    const { unspscData } = this.state;
    return unspscData.map(row => ({
      UNSPSCVersion: row.UNSPSCVersion,
      UNSPSCCode: row.UNSPSCCode,
      UNSPSCCategory: row.UNSPSCCategory,
    }));
  };
  //#endregion

  //#region Synonym Table Columns
  synonymTable() {
    const synonymColumns = [
      {
        accessorKey: "Synonym",
        header: "Synonym",
        textAlign: "left",
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
        textAlign: "left",
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
        textAlign: "center",
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
        textAlign: "center",
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
        textAlign: "center",
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
        textAlign: "center",
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
        accessorKey: "EnumeratedValidValue",
        header: "Enumerated Vaild Value (EVV)",
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
        textAlign: "center",
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
        textAlign: "center",
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
        textAlign: "left",
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
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: '65%',
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
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
        textAlign: "left",
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
      
    ];
    const nounModifierImageData = addedNounModifierImages.map((image) => ({
      Name: image.Name,
      Data: image.Data,
    }));
    return { nounModifierImageColumns, nounModifierImageData };
  };
  //#end region

  //#region Noun-Modifier Edit Page Navigation
  nounModifierEdit = () => {
    const { Noun, Modifier, VersionNameOrNo } = this.state;
    if (Noun && Modifier && VersionNameOrNo) {
      this.props.history.push({
        pathname: '/EditNounModifierTemplate',
        state: { Noun, Modifier, VersionNameOrNo }
      });
    } else {
      console.error('Values are missing:', { Noun, Modifier, VersionNameOrNo });
    }
  };
  //#end region

  //#region User Access
  canUserAccessPage(pageName) {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        const stateUpdates = {};
        if (pageName === "Edit Noun-Modifier Template") {
          stateUpdates.canAccessEditNounModifierTemplate = response.data;
          stateUpdates.canEdit = response.data; 
        }
        if (pageName === "Delete Noun-Modifier Template") {
          stateUpdates.canAccessDeleteNounModifierTemplate = response.data;
          stateUpdates.canDelete = response.data; 
        }
        if (Object.keys(stateUpdates).length > 0) {
          this.setState(stateUpdates);
        }
      })
      .catch((e) => {
        console.error("Error occurred:", e);
        toast.error(e.response?.data?.Message || "An error occurred", { autoClose: false });
      });
  }
  //#end region

  //#region Render
  render() {
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    const { VersionNameOrNo, Noun, Modifier, isToShowDeleteModal } = this.state;
    const { nounDefinition, nounModifierDefinitionOrGuidelines } = this.state;
    const { synonymColumns, synonymData, attributeColumns, attributeData, attributeEvvColumns, attributeEvvData, unspscColumns, unspscData, nounModifierImageColumns, nounModifierImageData } = this.state;
    return (
      <div style={setHeight(93)} className="production-update-main vewnm viewnounmodifiertemplate">
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
                  View Noun - Modifier Template{" "}
                  <span className="icon-size">


                    <i className="far fa-arrow-alt-circle-left text-primary pointer" tabIndex="1" title="Back to List" onClick={() => {
                      sessionStorage.setItem("activeMroDictionaryTab", "nounModifierTemplateList");
                      this.props.history.goBack();
                    }}></i>

                  </span>
                </h4>
                {this.state.isStatusUpdating && (
                  <h6 style={{ marginBottom: "0", fontSize: "13px", color: "green" }}>
                    Please wait while updating the status...
                  </h6>
                )}
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
                    <div className="createnm viewNounModifierTemplateInput">
                      <FloatingLabel
                        label="MRO Dictionary Version Name / No."
                        className="float-hidden float-select"
                      >
                        <input type="text" className="form-control mg-l-5 mg-r-0 myfrm" maxLength="20" value={VersionNameOrNo || ''} readOnly />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="createnm viewNounModifierTemplateInput">
                      <FloatingLabel
                        label="Noun"
                        className="float-hidden float-select"
                      >
                        <input type="text" className="form-control mg-l-5 myfrm" maxLength="50" value={Noun || ''} readOnly />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="createnm viewNounModifierTemplateInput">
                      <FloatingLabel label="Modifier" className="float-hidden float-select">
                        <input type="text" className="form-control mg-l-5 myfrm" maxLength="50" value={Modifier || ''} readOnly />
                      </FloatingLabel>
                  </div>
                </div>
                </div>
                <div className="row mg-r-15 mg-l-5 mg-t-15 mg-b-10">
                  <div className="col-lg-6">
                    <div className="createnm viewNounModifierTemplateInput">
                      <FloatingLabel label="Noun Definition" className="float-hidden float-select">
                        <TextField className="resizable-textfield myfrm" id="Details" inputProps={{ maxLength: 4000 }} value={nounDefinition}
                      onChange={(e) => this.setState({ nounDefinition: e.target.value })} multiline rows={3} col={300} variant="outlined" size="small" style={{ width: '100%' }}
                      disabled InputProps={{ style: { color: '#000' }, sx: { '&::placeholder': { color: '#999', opacity: 1 } } }}
                    />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createnm viewNounModifierTemplateInput">
                      <FloatingLabel label="Modifier Definition / Guidelines" className="float-hidden float-select">
                        <TextField className="resizable-textfield myfrm" id="Details" inputProps={{ maxLength: 4000 }} value={nounModifierDefinitionOrGuidelines}
                      onChange={(e) => this.setState({ nounModifierDefinitionOrGuidelines: e.target.value })} multiline rows={3} col={300} variant="outlined" size="small" style={{ width: '100%' }}
                      disabled
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
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table viewnounmodifiertable">
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
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="ViewTableContent">
                                <span><b>Synonym</b></span>
                                <div>
                                  <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleViewNounModifierSynonymCSVExport}>
                                      <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                    </IconButton>
                                  </Tooltip>
                                  <CSVLink
                                      data={this.getTransformedSynonymDataForExport()}
                                    headers={synonymColumns
                                      .map(col => ({ label: col.header, key: col.accessorKey }))}
                                    filename="NounSynonym_Data.csv"
                                    ref={(r) => (this.csvLinkSynonym = r)}
                                    style={{ display: 'none' }}
                                  />
                                </div>
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
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table viewnounmodifiertable">
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
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="ViewTableContent">
                                  <span><b>Attributes</b></span>
                                  <div>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleViewNounModifierAttributeCSVExport}>
                                        <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <CSVLink
                                      data={this.getTransformedAttributeDataForExport()}
                                      headers={attributeColumns
                                        .map(col => ({ label: col.header, key: col.accessorKey }))}
                                      filename="Attributes_Data.csv"
                                      ref={(r) => (this.csvLinkAttribute = r)}
                                      style={{ display: 'none' }}
                                    />
                                  </div>
                                </div>
                               
                              </Box>
                            )}
                            getRowProps={(row) => ({ style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent' }, })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>

              <div style={{ border: "1px solid #cdd4e0", borderTop: "0px" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table viewnounmodifiertable">
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
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="ViewTableContent">
                                  <span><b>Attribute Enumerated valid values(EVVs)</b></span>
                                  <div>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleViewNounModifierAttributeEVVCSVExport}>
                                        <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <CSVLink
                                      data={this.getTransformedAttributeEVVDataForExport()}
                                      headers={attributeEvvColumns.map(col => ({ label: col.header, key: col.accessorKey }))}
                                      filename="AttributesEvv_data.csv"
                                      ref={(r) => (this.csvLinkAttributeEvv = r)}
                                      style={{ display: 'none' }}
                                    />
                                  </div>
                                </div>
                              </Box>
                            )}
                            getRowProps={(row) => ({ style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent', }, })}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>

              <div style={{ border: "1px solid #cdd4e0", borderTop: "0px" }} className="mg-l-0 mg-r-0 mg-t-0" >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table viewnounmodifiertable">
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
                              <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="ViewTableContent">
                                  <span><b>UNSPSC</b></span>
                                  <div>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleViewNounModifierUNSPSCDataCSVExport}>
                                        <FileDownloadIcon title="Export to CSV" style={{ color: '#5B47FB', width: '1em', height: '1em' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <CSVLink
                                      data={this.getTransformedUNSPSCDataForExport()}
                                      headers={unspscColumns.map(col => ({ label: col.header, key: col.accessorKey }))}
                                      filename="UNSPSC_data.csv"
                                      ref={(r) => (this.csvLinkUnspsc = r)}
                                      style={{ display: 'none' }}
                                    />
                                  </div>
                                </div>
                                
                              </Box>
                            )}
                            getRowProps={(row) => ({ style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent', }, })}
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
                <div className="col-md-12 pd-t-10 pd-b-10 " style={{ height: "100%" }}>
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0 viewmaincontent">
                        <div className="pdqcmro masters-material-table nmtable unspcimg viewNounModifierTemplateImageTable">
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
                              <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
                                <span><b>Noun Modifier Images</b></span>
                              </Box>
                            )}
                            getRowProps={(row) => ({
                              style: { backgroundColor: this.state.activeRowId === row.original.id ? '#e0e0e0' : 'transparent' },
                            })}
                            style={{ height: "calc(100vh - 490px)" }}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </Col>
            
            <div className="nmsvntnsview mg-b-10">
              {this.state.canEdit && (
                  <Button
                    variant="secondary"
                    className="vewsubmit-button"
                    style={{ marginRight: "30px", width: "100px" }}
                  onClick={this.nounModifierEdit}
                  >
                <i className="fa fa-pencil mr-1"></i>Edit
              </Button>
              )}
              {this.state.canDelete && (
                  <Button
                    variant="secondary"
                    className="vewsubmit-button"
                    style={{ width: "100px", marginRight: "30px" }}
                  onClick={this.nounModifierDelete}
                  >
                    <i className="fa fa-close mr-1"></i>Delete
              </Button>         
              )}
            </div>


          </Row>
        </LoadingOverlay>
        <Modal show={isToShowDeleteModal} className="edit-gop-modal deletemodalcontent mymnmdl viewsug mrdictionary nmmdl">
          <Modal.Header>
            <Modal.Title>Delete Noun - Modifier Template</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure, to delete all the details of this Noun-Modifier from the selected version?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" style={{ marginRight: "10px" }} onClick={() => this.isToDeleteNounModifier(VersionNameOrNo, Noun, Modifier)}>
              Yes
            </Button>
            <Button variant="secondary" onClick={this.isToCancelDeleteNounModifier} className="vewsubmit-button">
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  //#endregion
}

export default ViewNounModifierTemplate;
