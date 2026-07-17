import React, { Component } from "react";
import productionAllocationTemplateService from "../../services/productionAllocationTemplate.service";
import {
  Button,
  Col,
  Form,
  Nav,
  OverlayTrigger,
  Row,
  Tab,
  Tooltip,
  Modal,
} from "react-bootstrap";
import productionTemplate from "../../services/productionTemplate.service";
import qcTemplate from "../../services/qcTemplate.service";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { withRouter } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css";
import "react-toastify/dist/ReactToastify.css";
import "./gopscreens.css";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import Select from "react-select";
import UnSpscModal from "../UNSPSC/UnSpscModal";
import MroDictionaryViewerModal from "../MRODictionary/MRODictionaryViewerModal";
import { connect } from "react-redux";
import { setNMUniqurVaue, rowDataPass } from "../../redux/action";
import projectService from "../../services/project.service";
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import QCNMAttributeTable from "./QCNMAttributeTable";
import QCEditableDropdownGop from "./QCEditableDropdownGop";
import qcTemplateService from "../../services/qcTemplate.service";
toast.configure();

class GOPQCEditScreen extends Component {
  //#region constructor
  constructor(props) {
    super(props);
    //#region Set State
    this.state = {
      qcItemID: 0,
      productionItemID: 0,
      qcTestNo: 1,
      activeTabKey: "NMAttribute",
      customerCode: "",
      projectCode: "",
      uniqueId: "",
      batchNo: "",
      productionUser: "",
      userName: "",
      shortDescription: "",
      longDescription: "",
      uOM: "",
      newShortDescription: "",
      newLongDescription: "",
      missingWords: "",
      mfrName: "",
      mfrPN: "",
      vendorName: "",
      vendorPN: "",
      customColumnName1: "",
      customColumnName1Value: "",
      customColumnName2: "",
      customColumnName2Value: "",
      customColumnName3: "",
      customColumnName3Value: "",
      selectedNounModifier: {},
      noun: "",
      modifier: "",
      qcNoun: "",
      qcModifier: "",
      nounModifierComments: "",
      qcStatus: "P",
      qcLevel: "",
      levelComments: "",
      selectedStatus: "",
      selectedQCStatus: "P",
      selectedLevel: "",
      selectedQCLevel: "",
      additionalInfoFromInput: "",
      qcAdditionalInfoFromInput: "",
      additionalInfoFromInputComments: "",
      additionalInfoFromWeb: "",
      additionalInfoFromWebComments: "",
      qcAdditionalInfoFromWeb: "",
      addWebInputInfo: "",
      unspscVersion: "",
      unspscCode: "",
      unspscCategory: "",
      qcUNSPSCVersion: "",
      qcUNSPSCCode: "",
      qcUNSPSCCategory: "",
      unspscComments: "",
      webRefURL1: "",
      qcWebRefURL1: "",
      webRefURL1Comments: "",
      webRefURL2: "",
      qcWebRefURL2: "",
      webRefURL2Comments: "",
      webRefURL3: "",
      qcWebRefURL3: "",
      webRefURL3Comments: "",
      webRefPdfURL: "",
      qcWebRefPDFURL: "",
      webRefPDFURLComments: "",
      remarks: "",
      qcRemarks: "",
      remarksComments: "",
      query: "",
      application: "",
      qcApplication: "",
      applicationComments: "",
      addOtherReferences: "",
      dwg: "",
      qcDWG: "",
      dwgComments: "",
      pos: "",
      qcPOS: "",
      posComments: "",
      itemNo: "",
      qcItemNo: "",
      itemNoComments: "",
      serialNo: "",
      qcSerialNo: "",
      serialNoComments: "",
      otherNo: "",
      qcOtherNo: "",
      otherNoComments: "",
      kksCode: "",
      qcKKSCode: "",
      kksCodeComments: "",
      assemblyOrPart: "",
      qcAssemblyOrPart: "",
      assemblyOrPartComments: "",
      bom: "",
      qcBOM: "",
      bomComments: "",
      greenItems: "",
      qcGreenItems: "",
      greenItemsComments: "",

      itemAttributes: [],
      projectSetting: {},
      userID: "",
      retriveValue: false,
      IsItemEdited: false,
      showUnspscModal: false,
      showMroDictionaryViewerModal: false,
      MFRNameOptions: [],
      MFRPNOptions: [],
      mfrName1: "",
      mfrName1Comments: "",
      mfrName2: "",
      mfrName2Comments: "",
      mfrName3: "",
      mfrName3Comments: "",
      qcMFRNames: {
        qcMFRName1: null,
        qcMFRName2: null,
        qcMFRName3: null,
      },
      mfrPN1: "",
      mfrPN1Comments: "",
      mfrPN2: "",
      mfrPN2Comments: "",
      mfrPN3: "",
      mfrPN3Comments: "",
      qcMFRPNs: {
        qcMFRPN1: null,
        qcMFRPN2: null,
        qcMFRPN3: null,
      },
      VendorNameOptions: [],
      VendorPNOptions: [],
      vendorName1: "",
      vendorName1Comments: "",
      vendorName2: "",
      vendorName2Comments: "",
      vendorName3: "",
      vendorName3Comments: "",
      vendorsNames: {
        vendorName1: null,
        vendorName2: null,
        vendorName3: null,
      },
      qcVendorNames: {
        qcVendorName1: null,
        qcVendorName2: null,
        qcVendorName3: null,
      },
      vendorPN1: "",
      vendorPN1Comments: "",
      vendorPN2: "",
      vendorPN2Comments: "",
      vendorPN3: "",
      vendorPN3Comments: "",
      vendorsPN: {
        vendorPN1: null,
        vendorPN2: null,
        vendorPN3: null,
      },
      qcVendorPNs: {
        qcVendorPN1: null,
        qcVendorPN2: null,
        qcVendorPN3: null,
      },
      UNSPSCOptions: [],
      UNSPSCMroDictOptions: [],
      selectedUNSPSCOption: {},
      selectedUNSPSCMroDictOption: {},
    };
    this.gridRef = React.createRef();
    this.textareaRef1 = React.createRef();
    this.textareaRef2 = React.createRef();
  }
  //#endregion

  //#region When the page load
  componentDidMount() {
    const user = helper.getUser();
    if (!user) {
      this.props.history.push({ pathname: "/" });
      return;
    }

    const selectedQCItemIDs = JSON.parse(
      sessionStorage.getItem("selectedQCItemIDs")
    );

    this.setState(
      {
        userName: user,
        customerCode: selectedQCItemIDs.CustomerCode,
        projectCode: selectedQCItemIDs.ProjectCode,
        batchNo: selectedQCItemIDs.BatchNo,
        qcItemID: selectedQCItemIDs.QCItemID,
        productionItemID: selectedQCItemIDs.ProductionItemID,
        spinnerMessage: "Please wait while fetching GOP Screens Details...!",
        loading: true,
      },
      () => {
        // Callback after state is updated
        this.fetchDynamicAGGrid();
      }
    );
  }
  //#endregion

  //#region Fetching ProductionUpdateList Data
  fetchDynamicAGGrid() {
    this.fetchGOPScreenDetails(
      this.state.qcItemID,
      this.state.productionItemID
    );
    this.fetchNounModifierDetails();
    this.fetchProjectSettings();
  }
  //#endregion

  //#region Fetching project settings
  fetchProjectSettings = () => {
    projectService
      .readProjectSettings(this.state.customerCode, this.state.projectCode)
      .then((resp) => {
        this.setState({
          ...this.state,
          projectSetting: resp.data,
        });
      })
      .catch((e) => {
        this.setState({
          ...this.state,
          projectSetting: {
            IsToIncludeAdditionalInfoInShortDesc: false,
            IsToIncludeAdditionalInfoInLongDesc: false,
            IsToIncludeAddOtherReferencesInfoInLongDesc: false,
            IsToIncludeMFRNameInShortDesc: false,
            IsToIncludeMFRNameInLongDesc: false,
            IsToIncludeMFRPNInShortDesc: false,
            IsToIncludeMFRPNInLongDesc: false,
            IsToIncludeVendorNameInShortDesc: false,
            IsToIncludeVendorNameInLongDesc: false,
            IsToIncludeVendorPNInShortDesc: false,
            IsToIncludeVendorPNInLongDesc: false,
            IsToConvertAttributeValueToUppercase: false,
          },
        });
      });
  };
  //#endregion

  //#region fetching all the value in input fields
  fetchGOPScreenDetails(QCItemID, ProductionItemID) {
    if (QCItemID) {
      qcTemplateService
        .getQCItemDetails(QCItemID)
        .then((qcresp) => {
          var savedNounModifier = {};
          if (qcresp.data.Noun && qcresp.data.Modifier) {
            savedNounModifier = {
              value: qcresp.data.Noun + "_" + qcresp.data.Modifier,
              label: qcresp.data.Noun + "_" + qcresp.data.Modifier,
            };
          }

          let QCStatus = "";
          if (qcresp.data.QCStatus === "Pending") {
            QCStatus = "P";
          } else if (qcresp.data.QCStatus === "Rejected") {
            QCStatus = "R";
          } else if (qcresp.data.QCStatus === "Completed") {
            QCStatus = "C";
          }

          let QCLevel = "";
          if (qcresp.data.QCLevel === "Cleansed") {
            QCLevel = "C";
          } else if (qcresp.data.QCLevel === "Enriched") {
            QCLevel = "E";
          } else if (qcresp.data.QCLevel === "Exception") {
            QCLevel = "X";
          }

          let AssemblyOrPart = "";
          if (qcresp.data.AssemblyOrPart === "Assembly") {
            AssemblyOrPart = "A";
          } else if (qcresp.data.AssemblyOrPart === "Part") {
            AssemblyOrPart = "P";
          }

          let GreenItems = "";
          if (qcresp.data.GreenItems === "Yes") {
            GreenItems = "Y";
          } else if (qcresp.data.GreenItems === "Not Applicable") {
            GreenItems = "N";
          }

          if (ProductionItemID) {
            productionAllocationTemplateService
              .ProductionItemDetails(ProductionItemID)
              .then((resp) => {
                let editScreen = {
                  CustomerCode: resp.data.CustomerCode,
                  ProjectCode: resp.data.ProjectCode,
                  batchNo: resp.data.BatchNo,
                  ProductionItemID: resp.data.ProductionItemID,
                  productionUser: resp.data.ProductionUser,
                };

                sessionStorage.setItem(
                  "ProdItemData",
                  JSON.stringify(editScreen)
                );

                this.setState({
                  customerCode: resp.data.CustomerCode,
                  projectCode: resp.data.ProjectCode,
                  batchNo: resp.data.batchNo,
                  uniqueId: resp.data.UniqueID,
                  productionUser: resp.data.ProductionUser,
                  shortDescription: resp.data.ShortDescription,
                  longDescription: resp.data.LongDescription,
                  uOM: resp.data.UOM,
                  productionLevel: resp.data.Level,
                  mfrName: resp.data.MFRName,
                  mfrPN: resp.data.MFRPN,
                  vendorName: resp.data.VendorName,
                  vendorPN: resp.data.VendorPN,
                  customColumnName1: resp.data.CustomColumnName1,
                  customColumnName1Value: resp.data.CustomColumnName1Value,
                  customColumnName2: resp.data.CustomColumnName2,
                  customColumnName2Value: resp.data.CustomColumnName2Value,
                  customColumnName3: resp.data.CustomColumnName3,
                  customColumnName3Value: resp.data.CustomColumnName3Value,
                  noun: resp.data.Noun,
                  modifier: resp.data.Modifier,
                  mfrName1: resp.data.MFRName1,
                  mfrPN1: resp.data.MFRPN1,
                  mfrName2: resp.data.MFRName2,
                  mfrPN2: resp.data.MFRPN2,
                  mfrName3: resp.data.MFRName3,
                  mfrPN3: resp.data.MFRPN3,
                  vendorName1: resp.data.VendorName1,
                  vendorPN1: resp.data.VendorPN1,
                  vendorName2: resp.data.VendorName2,
                  vendorPN2: resp.data.VendorPN2,
                  vendorName3: resp.data.VendorName3,
                  vendorPN3: resp.data.VendorPN3,
                  additionalInfoFromWeb: resp.data.AdditionalInfoFromWeb,
                  additionalInfoFromInput: resp.data.AdditionalInfo,
                  unspscCode: resp.data.UNSPSCCode,
                  unspscCategory: resp.data.UNSPSCCategory,
                  unspscVersion: resp.data.UNSPSCVersion,
                  webRefURL1: resp.data.WebRefURL1,
                  webRefURL2: resp.data.WebRefURL2,
                  webRefURL3: resp.data.WebRefURL3,
                  webRefPdfURL: resp.data.PDFURL,
                  remarks: resp.data.Remarks,
                  query: resp.data.Query,
                  application: resp.data.Application,
                  dwg: resp.data.DWG,
                  pos: resp.data.POS,
                  itemNo: resp.data.ItemNo,
                  serialNo: resp.data.SerialNo,
                  otherNo: resp.data.OtherNo,
                  kksCode: resp.data.KKSCode,
                  assemblyOrPart: resp.data.AssemblyOrPart,
                  bom: resp.data.BOM,
                  greenItems: resp.data.GreenItems,
                });
              })
              .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
              });
          }

          this.setState({
            qcItemID: qcresp.data.QCItemID,
            productionItemID: qcresp.data.ProductionItemID,
            qcTestNo: qcresp.data.QCTestNo,
            newShortDescription: qcresp.data.NewShortDescription,
            newLongDescription: qcresp.data.NewLongDescription,
            missingWords: qcresp.data.MissingWords,
            qcNoun: qcresp.data.Noun,
            qcModifier: qcresp.data.Modifier,
            selectedNounModifier: savedNounModifier,
            nounModifierComments: qcresp.data.NounModifierComments,
            selectedQCStatus: QCStatus,
            selectedQCLevel: QCLevel,
            levelComments: qcresp.data.QCLevelComments,
            qcMFRNames: {
              qcMFRName1: qcresp.data.MFRName1,
              qcMFRName2: qcresp.data.MFRName2,
              qcMFRName3: qcresp.data.MFRName3,
            },
            qcMFRPNs: {
              qcMFRPN1: qcresp.data.MFRPN1,
              qcMFRPN2: qcresp.data.MFRPN2,
              qcMFRPN3: qcresp.data.MFRPN3,
            },
            mfrName1Comments: qcresp.data.MFRName1Comments,
            mfrPN1Comments: qcresp.data.MFRPN1Comments,
            mfrName2Comments: qcresp.data.MFRName2Comments,
            mfrPN2Comments: qcresp.data.MFRPN2Comments,
            mfrName3Comments: qcresp.data.MFRName3Comments,
            mfrPN3Comments: qcresp.data.MFRPN3Comments,
            qcVendorNames: {
              qcVendorName1: qcresp.data.VendorName1,
              qcVendorName2: qcresp.data.VendorName2,
              qcVendorName3: qcresp.data.VendorName3,
            },
            qcVendorPNs: {
              qcVendorPN1: qcresp.data.VendorPN1,
              qcVendorPN2: qcresp.data.VendorPN2,
              qcVendorPN3: qcresp.data.VendorPN3,
            },
            vendorName1Comments: qcresp.data.VendorName1Comments,
            vendorPN1Comments: qcresp.data.VendorPN1Comments,
            vendorName2Comments: qcresp.data.VendorName2Comments,
            vendorPN2Comments: qcresp.data.VendorPN2Comments,
            vendorName3Comments: qcresp.data.VendorName3Comments,
            vendorPN3Comments: qcresp.data.VendorPN3Comments,
            qcAdditionalInfoFromWeb: qcresp.data.AdditionalInfoFromWeb,
            additionalInfoFromWebComments:
              qcresp.data.AdditionalInfoFromWebComments,
            qcAdditionalInfoFromInput: qcresp.data.AdditionalInfoInput,
            additionalInfoFromInputComments:
              qcresp.data.AdditionalInfoInputComments,
            qcUNSPSCCode: qcresp.data.UNSPSCCode,
            qcUNSPSCCategory: qcresp.data.UNSPSCCategory,
            qcUNSPSCVersion: qcresp.data.UNSPSCVersion,
            unspscComments: qcresp.data.UNSPSCComments,
            qcWebRefURL1: qcresp.data.WebRefURL1,
            webRefURL1Comments: qcresp.data.WebRefURL1Comments,
            qcWebRefURL2: qcresp.data.WebRefURL2,
            webRefURL2Comments: qcresp.data.WebRefURL2Comments,
            qcWebRefURL3: qcresp.data.WebRefURL3,
            webRefURL3Comments: qcresp.data.WebRefURL3Comments,
            qcWebRefPDFURL: qcresp.data.PDFURL,
            webRefPDFURLComments: qcresp.data.PDFURLComments,
            qcRemarks: qcresp.data.Remarks,
            remarksComments: qcresp.data.RemarksComments,
            qcApplication: qcresp.data.Application,
            applicationComments: qcresp.data.ApplicationComments,
            qcDWG: qcresp.data.DWG,
            dwgComments: qcresp.data.DWGComments,
            qcItemNo: qcresp.data.ItemNo,
            itemNoComments: qcresp.data.ItemNoComments,
            qcOtherNo: qcresp.data.OtherNo,
            otherNoComments: qcresp.data.OtherNoComments,
            qcPOS: qcresp.data.POS,
            posComments: qcresp.data.POSComments,
            qcSerialNo: qcresp.data.SerialNo,
            serialNoComments: qcresp.data.SerialNoComments,
            qcKKSCode: qcresp.data.KKSCode,
            kksCodeComments: qcresp.data.KKSCodeComments,
            qcAssemblyOrPart: AssemblyOrPart,
            assemblyOrPartComments: qcresp.data.AssemblyOrPartComments,
            qcBOM: qcresp.data.BOM,
            bomComments: qcresp.data.BOMComments,
            qcGreenItems: GreenItems,
            greenItemsComments: qcresp.data.GreenItemsComments,
            itemAttributes: qcresp.data.ItemAttributes,
          });
          this.adjustTextareaHeight();
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    } else {
      if (ProductionItemID) {
        productionAllocationTemplateService
          .ProductionItemDetails(ProductionItemID)
          .then((resp) => {
            var savedNounModifier = {};
            if (resp.data.Noun && resp.data.Modifier) {
              savedNounModifier = {
                value: resp.data.Noun + "_" + resp.data.Modifier,
                label: resp.data.Noun + "_" + resp.data.Modifier,
              };
            }

            let editScreen = {
              CustomerCode: resp.data.CustomerCode,
              ProjectCode: resp.data.ProjectCode,
              batchNo: resp.data.BatchNo,
              ProductionItemID: resp.data.ProductionItemID,
              productionUser: resp.data.ProductionUser,
            };

            sessionStorage.setItem("ProdItemData", JSON.stringify(editScreen));

            let AssemblyOrPart = "";
            if (resp.data.AssemblyOrPart === "Assembly") {
              AssemblyOrPart = "A";
            } else if (resp.data.AssemblyOrPart === "Part") {
              AssemblyOrPart = "P";
            }

            let GreenItems = "";
            if (resp.data.GreenItems === "Yes") {
              GreenItems = "Y";
            } else if (resp.data.GreenItems === "Not Applicable") {
              GreenItems = "N";
            }

            this.setState({
              productionItemID: resp.data.ProductionItemID,
              customerCode: resp.data.CustomerCode,
              projectCode: resp.data.ProjectCode,
              batchNo: resp.data.batchNo,
              uniqueId: resp.data.UniqueID,
              productionUser: resp.data.ProductionUser,
              shortDescription: resp.data.ShortDescription,
              longDescription: resp.data.LongDescription,
              uOM: resp.data.UOM,
              newShortDescription: resp.data.NewShortDescription,
              newLongDescription: resp.data.NewLongDescription,
              missingWords: resp.data.MissingWords,
              noun: resp.data.Noun,
              qcNoun: resp.data.Noun,
              modifier: resp.data.Modifier,
              qcModifier: resp.data.Modifier,
              productionLevel: resp.data.Level,
              mfrName: resp.data.MFRName,
              mfrPN: resp.data.MFRPN,
              vendorName: resp.data.VendorName,
              vendorPN: resp.data.VendorPN,
              customColumnName1: resp.data.CustomColumnName1,
              customColumnName1Value: resp.data.CustomColumnName1Value,
              customColumnName2: resp.data.CustomColumnName2,
              customColumnName2Value: resp.data.CustomColumnName2Value,
              customColumnName3: resp.data.CustomColumnName3,
              customColumnName3Value: resp.data.CustomColumnName3Value,
              selectedStatus: resp.data.Status,
              mfrName1: resp.data.MFRName1,
              mfrName2: resp.data.MFRName2,
              mfrName3: resp.data.MFRName3,
              //assigning Production values default to QC fields when QC is not yet done
              qcMFRNames: {
                qcMFRName1: resp.data.MFRName1,
                qcMFRName2: resp.data.MFRName2,
                qcMFRName3: resp.data.MFRName3,
              },
              mfrPN1: resp.data.MFRPN1,
              mfrPN2: resp.data.MFRPN2,
              mfrPN3: resp.data.MFRPN3,
              qcMFRPNs: {
                qcMFRPN1: resp.data.MFRPN1,
                qcMFRPN2: resp.data.MFRPN2,
                qcMFRPN3: resp.data.MFRPN3,
              },
              vendorName1: resp.data.VendorName1,
              vendorName2: resp.data.VendorName2,
              vendorName3: resp.data.VendorName3,
              qcVendorNames: {
                qcVendorName1: resp.data.VendorName1,
                qcVendorName2: resp.data.VendorName2,
                qcVendorName3: resp.data.VendorName3,
              },
              vendorPN1: resp.data.VendorPN1,
              vendorPN2: resp.data.VendorPN2,
              vendorPN3: resp.data.VendorPN3,
              qcVendorPNs: {
                qcVendorPN1: resp.data.VendorPN1,
                qcVendorPN2: resp.data.VendorPN2,
                qcVendorPN3: resp.data.VendorPN3,
              },
              additionalInfoFromInput: resp.data.AdditionalInfo,
              qcAdditionalInfoFromInput: resp.data.AdditionalInfo,
              additionalInfoFromWeb: resp.data.AdditionalInfoFromWeb,
              qcAdditionalInfoFromWeb: resp.data.AdditionalInfoFromWeb,
              unspscCode: resp.data.UNSPSCCode,
              unspscCategory: resp.data.UNSPSCCategory,
              unspscVersion: resp.data.UNSPSCVersion,
              qcUNSPSCCode: resp.data.UNSPSCCode,
              qcUNSPSCCategory: resp.data.UNSPSCCategory,
              qcUNSPSCVersion: resp.data.UNSPSCVersion,
              webRefURL1: resp.data.WebRefURL1,
              webRefURL2: resp.data.WebRefURL2,
              webRefURL3: resp.data.WebRefURL3,
              webRefPdfURL: resp.data.PDFURL,
              qcWebRefURL1: resp.data.WebRefURL1,
              qcWebRefURL2: resp.data.WebRefURL2,
              qcWebRefURL3: resp.data.WebRefURL3,
              qcWebRefPDFURL: resp.data.PDFURL,
              remarks: resp.data.Remarks,
              qcRemarks: resp.data.Remarks,
              query: resp.data.Query,
              application: resp.data.Application,
              qcApplication: resp.data.Application,
              dwg: resp.data.DWG,
              qcDWG: resp.data.DWG,
              pos: resp.data.POS,
              qcPOS: resp.data.POS,
              itemNo: resp.data.ItemNo,
              qcItemNo: resp.data.ItemNo,
              serialNo: resp.data.SerialNo,
              qcSerialNo: resp.data.SerialNo,
              otherNo: resp.data.OtherNo,
              qcOtherNo: resp.data.OtherNo,
              kksCode: resp.data.KKSCode,
              qcKKSCode: resp.data.KKSCode,
              assemblyOrPart: resp.data.AssemblyOrPart,
              qcAssemblyOrPart: AssemblyOrPart,
              bom: resp.data.BOM,
              qcBOM: resp.data.BOM,
              greenItems: resp.data.GreenItems,
              qcGreenItems: GreenItems,
              itemAttributes: resp.data.ItemAttributes,
              userID: resp.data.UserID,
              selectedNounModifier: savedNounModifier,
              loading: false,
            });
            this.adjustTextareaHeight();
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.log(error);
          });
      }
    }
  }
  //#endregion

  //#region Selecting Tabs
  handleTabSelect = (tabKey) => {
    this.setState({ activeTabKey: tabKey });
  };
  //#endregion

  //#region Function For finding missing words
  findMissingWords = () => {
    let shortDescription = this.state.shortDescription.trim();
    let longDescription = this.state.longDescription.trim();
    let newShortDescription = this.state.newShortDescription.trim();
    let newLongDescription = this.state.newLongDescription.trim();
    let missingWords = "";
    let sdWithoutSpecialChars = shortDescription.replace(
      /[^a-zA-Z0-9. ]/g,
      " "
    );
    let nsdWithoutSpecialChars = newShortDescription.replace(
      /[^a-zA-Z0-9. ]/g,
      " "
    );
    let ldWithoutSpecialChars = longDescription.replace(/[^a-zA-Z0-9. ]/g, " ");
    let nldWithoutSpecialChars = newLongDescription.replace(
      /[^a-zA-Z0-9. ]/g,
      " "
    );

    //Form an array by splitting on space (including multiple consecutive spaces)
    let sdWordsArray = sdWithoutSpecialChars.trim().split(/\s+/);
    let ldWordsArray = ldWithoutSpecialChars.trim().split(/\s+/);
    let nsdWordsArray = nsdWithoutSpecialChars.trim().split(/\s+/);
    let nldWordsArray = nldWithoutSpecialChars.trim().split(/\s+/);

    // Combine source arrays
    let sourceWords = [...sdWordsArray, ...ldWordsArray];

    // Combine comparison arrays and normalize to lowercase in a Set
    let comparisonSet = new Set(
      [...nsdWordsArray, ...nldWordsArray].map((word) => word.toLowerCase())
    );

    // Find missing words (case-insensitive check)
    missingWords = sourceWords.filter(
      (word) => !comparisonSet.has(word.toLowerCase())
    );

    missingWords = missingWords.join(",").replace(/^,|,$/g, "");
    //return missingWords.join(",").replace(/^,|,$/g, "");

    const uniqueWords = this.getUniqueWords(missingWords);

    this.setState({
      missingWords: uniqueWords.join(","),
    });
  };
  //#endregion

  //#region get Unique Words
  getUniqueWords = (text) => {
    if (!text) return [];

    return [
      ...new Set(
        text
          .toLowerCase() // make case-insensitive
          .match(/\b\w+\b/g) || [] // extract words (a-z, 0-9)
      ),
    ];
  };
  //#endregion

  //#region Auto adjust height
  adjustTextareaHeight = () => {
    if (this.textareaRef1.current) {
      const textarea = this.textareaRef1.current;
      textarea.style.height = "inherit";
      if (this.state.shortDescription.length > 200) {
        textarea.style.height = `${textarea.scrollHeight}px`;
      } else {
        textarea.style.height = `30px`;
      }
    }
    if (this.textareaRef2.current) {
      const textarea2 = this.textareaRef2.current;
      textarea2.style.height = "inherit";
      if (this.state.longDescription.length > 200) {
        textarea2.style.height = `${textarea2.scrollHeight}px`;
      } else {
        textarea2.style.height = `30px`;
      }
    }
  };
  //#endregion

  //#region Input change handler
  inputChangeHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value, IsItemEdited: true });
  };
  //#endregion

  //#region on Change Green Items
  onChangeGreenItems = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value, IsItemEdited: true });
  };
  //#endregion

  //#region on Change Assembly or Part
  onChangeAssemblyOrPart = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value, IsItemEdited: true });
  };
  //#endregion

  //#region fetching Noun & Modifier List
  fetchNounModifierDetails = () => {
    this.setState({
      spinnerMessage: "Please wait while fetching Noun & Modifier List...!",
      loading: true,
    });

    productionTemplate
      .getNounModifierList(this.state.customerCode, this.state.projectCode)
      .then((resp) => {
        const nounModifierOptions = resp.data.map((item) => ({
          value: `${item.Noun}_${item.Modifier}`,
          label: `${item.Noun}_${item.Modifier}`,
        }));
        this.setState({
          nounModifierOptions,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.error("Error fetching Noun & Modifier list:", error);
      });
  };
  //#endregion

  //#region Update the values of Noun & Modifier
  handleChangeNounModifier = (selectedNounModifier) => {
    let noun_Modifier = selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();
    this.setState({
      selectedNounModifier,
      qcNoun: noun,
      qcModifier: modifier,
    });

    this.setState({ retriveValue: true });
  };

  RetriveNMValues = () => {
    this.setState({
      IsItemEdited: true,
      retriveValue: false,
    });
    this.fetchAttributeList(true);
  };

  hideRetriveValue = () => {
    this.setState({
      IsItemEdited: true,
      retriveValue: false,
    });
    this.fetchAttributeList(false);
  };
  //#endregion

  generateNewShortAndLongDescriptionAndFindMissingWords = async () => {
    await this.generateNewShortDescription();
    await this.generateNewLongDescription();
    this.findMissingWords();
  };

  //#region Generating new Short Description
  generateNewShortDescription = async () => {
    let projectSetting = this.state.projectSetting;
    let itemAttributes = this.state.itemAttributes;
    let newShortDescription = this.state.qcNoun + "," + this.state.qcModifier;
    let attributeValueString = "";
    let MFRNameString = "";
    let MFRName1 = this.state.qcMFRNames.qcMFRName1;
    let MFRName2 = this.state.qcMFRNames.qcMFRName2;
    let MFRName3 = this.state.qcMFRNames.qcMFRName3;
    let VendorNameString = "";
    let VendorName1 = this.state.qcVendorNames.qcVendorName1;
    let VendorName2 = this.state.qcVendorNames.qcVendorName2;
    let VendorName3 = this.state.qcVendorNames.qcVendorName3;
    let MFRPN1 = this.state.qcMFRPNs.qcMFRPN1;
    let MFRPN2 = this.state.qcMFRPNs.qcMFRPN2;
    let MFRPN3 = this.state.qcMFRPNs.qcMFRPN3;
    let VendorPN1 = this.state.qcVendorPNs.qcVendorPN1;
    let VendorPN2 = this.state.qcVendorPNs.qcVendorPN2;
    let VendorPN3 = this.state.qcVendorPNs.qcVendorPN3;
    let MFRPNString = "";
    let MFRNamePNString = "";
    let VendorPNString = "";
    let VendorNamePNString = "";
    let AdditionalInfoFromWeb = this.state.qcAdditionalInfoFromWeb;
    let AdditionalInfoFromInput = this.state.qcAdditionalInfoFromInput;
    let AdditionalInfoString = "";

    //#region Generate Attribute Name and QC Attribute Value string
    itemAttributes.forEach((item) => {
      if (attributeValueString) {
        if (item.QCAttributeValue && item.QCAttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeValueString +=
              "," + item.QCAttributeValue.trim().toUpperCase();
          else attributeValueString += "," + item.QCAttributeValue.trim();
        }
      } else {
        if (item.QCAttributeValue && item.QCAttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeValueString = item.QCAttributeValue.trim().toUpperCase();
          else attributeValueString = item.QCAttributeValue.trim();
        }
      }
    });

    if (newShortDescription && newShortDescription.length > 0) {
      if (attributeValueString && attributeValueString.length > 0) {
        newShortDescription += ": " + attributeValueString;
      }
    } else {
      if (attributeValueString && attributeValueString.length > 0) {
        newShortDescription = attributeValueString;
      }
    }
    //#endregion

    //#region Generate MFR Name and PN string and Concatenate it to new short desc
    //#region MFRName1
    if (projectSetting.IsToIncludeMFRNameInShortDesc) {
      if (MFRName1 && MFRName1.length > 0) {
        MFRNameString = MFRName1;
        MFRNamePNString = MFRNameString;
      }
    }
    //#endregion

    //#region MFRPN1
    if (projectSetting.IsToIncludeMFRPNInShortDesc) {
      if (MFRPN1 && MFRPN1.length > 0) {
        MFRPNString = MFRPN1;
      }

      if (MFRNamePNString && MFRNamePNString.length > 0)
        MFRNamePNString += "," + MFRPNString;
      else MFRNamePNString = MFRPNString;
    }
    //#endregion

    //#region MFRName2
    if (projectSetting.IsToIncludeMFRNameInShortDesc) {
      if (MFRName2 && MFRName2.length > 0) {
        MFRNameString = MFRName2;
      }

      if (MFRNamePNString && MFRNamePNString.length > 0)
        MFRNamePNString += "," + MFRNameString;
      else MFRNamePNString = MFRNameString;
    }
    //#endregion

    //#region MFRPN2
    if (projectSetting.IsToIncludeMFRPNInShortDesc) {
      if (MFRPN2 && MFRPN2.length > 0) {
        MFRPNString = MFRPN2;
      }

      if (MFRNamePNString && MFRNamePNString.length > 0)
        MFRNamePNString += "," + MFRPNString;
      else MFRNamePNString = MFRPNString;
    }
    //#endregion

    //#region MFRName3
    if (projectSetting.IsToIncludeMFRNameInShortDesc) {
      if (MFRName3 && MFRName3.length > 0) {
        MFRNameString = MFRName3;
      }

      if (MFRNamePNString && MFRNamePNString.length > 0)
        MFRNamePNString += "," + MFRNameString;
      else MFRNamePNString = MFRNameString;
    }
    //#endregion

    //#region MFRPN3
    if (projectSetting.IsToIncludeMFRPNInShortDesc) {
      if (MFRPN3 && MFRPN3.length > 0) {
        MFRPNString = MFRPN3;
      }

      if (MFRNamePNString && MFRNamePNString.length > 0)
        MFRNamePNString += "," + MFRPNString;
      else MFRNamePNString = MFRPNString;
    }
    //#endregion

    if (
      projectSetting.IsToIncludeMFRNameInShortDesc ||
      projectSetting.IsToIncludeMFRPNInShortDesc
    ) {
      if (MFRNamePNString && MFRNamePNString.length > 0) {
        newShortDescription += "," + MFRNamePNString;
      }
    }
    //#endregion

    //#region Generate Vendor Name and PN string and Concatenate it to new short desc
    //#region VendorName1
    if (projectSetting.IsToIncludeVendorNameInShortDesc) {
      if (VendorName1 && VendorName1.length > 0) {
        VendorNameString = VendorName1;
        VendorNamePNString = VendorNameString;
      }
    }
    //#endregion

    //#region VendorPN1
    if (projectSetting.IsToIncludeVendorPNInShortDesc) {
      if (VendorPN1 && VendorPN1.length > 0) {
        VendorPNString = VendorPN1;
      }

      if (VendorNamePNString && VendorNamePNString.length > 0)
        VendorNamePNString += "," + VendorPNString;
      else VendorNamePNString = VendorPNString;
    }
    //#endregion

    //#region VendorName2
    if (projectSetting.IsToIncludeVendorNameInShortDesc) {
      if (VendorName2 && VendorName2.length > 0) {
        VendorNameString = VendorName2;
      }

      if (VendorNamePNString && VendorNamePNString.length > 0)
        VendorNamePNString += "," + VendorNameString;
      else VendorNamePNString = VendorNameString;
    }
    //#endregion

    //#region VendorPN2
    if (projectSetting.IsToIncludeVendorPNInShortDesc) {
      if (VendorPN2 && VendorPN2.length > 0) {
        VendorPNString = VendorPN2;
      }

      if (VendorNamePNString && VendorNamePNString.length > 0)
        VendorNamePNString += "," + VendorPNString;
      else VendorNamePNString = VendorPNString;
    }
    //#endregion

    //#region VendorName3
    if (projectSetting.IsToIncludeVendorNameInShortDesc) {
      if (VendorName3 && VendorName3.length > 0) {
        VendorNameString = VendorName3;
      }

      if (VendorNamePNString && VendorNamePNString.length > 0)
        VendorNamePNString += "," + VendorNameString;
      else VendorNamePNString = VendorNameString;
    }
    //#endregion

    //#region VendorPN3
    if (projectSetting.IsToIncludeVendorPNInShortDesc) {
      if (VendorPN3 && VendorPN3.length > 0) {
        VendorPNString = VendorPN3;
      }

      if (VendorNamePNString && VendorNamePNString.length > 0)
        VendorNamePNString += "," + VendorPNString;
      else VendorNamePNString = VendorPNString;
    }
    //#endregion

    if (
      projectSetting.IsToIncludeVendorNameInShortDesc ||
      projectSetting.IsToIncludeVendorPNInShortDesc
    ) {
      if (VendorNamePNString && VendorNamePNString.length > 0) {
        newShortDescription += "," + VendorNamePNString;
      }
    }
    //#endregion

    //#region Generate Additional Info string and Concatenate it to new short desc
    if (projectSetting.IsToIncludeAdditionalInfoInShortDesc) {
      if (AdditionalInfoFromWeb && AdditionalInfoFromWeb.length > 0) {
        AdditionalInfoString = AdditionalInfoFromWeb;
      }

      if (AdditionalInfoString && AdditionalInfoString.length > 0) {
        if (AdditionalInfoFromInput && AdditionalInfoFromInput.length > 0) {
          AdditionalInfoString += "," + AdditionalInfoFromInput;
        }
      } else {
        if (AdditionalInfoFromInput && AdditionalInfoFromInput.length > 0) {
          AdditionalInfoString = AdditionalInfoFromInput;
        }
      }

      if (AdditionalInfoString && AdditionalInfoString.length > 0)
        newShortDescription += "," + AdditionalInfoString;
    }
    //#endregion

    //console.log(newShortDescription);
    this.setState({
      newShortDescription: newShortDescription,
    });
  };
  //#endregion

  //#region Generating new Long Description
  generateNewLongDescription = async () => {
    let projectSetting = this.state.projectSetting;
    let itemAttributes = this.state.itemAttributes;
    let newLongDescription = this.state.qcNoun + "," + this.state.qcModifier;
    let attributeNameValueString = "";
    let MFRNameString = "";
    let MFRName1 = this.state.qcMFRNames.qcMFRName1;
    let MFRName2 = this.state.qcMFRNames.qcMFRName2;
    let MFRName3 = this.state.qcMFRNames.qcMFRName3;
    let VendorNameString = "";
    let VendorName1 = this.state.qcVendorNames.qcVendorName1;
    let VendorName2 = this.state.qcVendorNames.qcVendorName2;
    let VendorName3 = this.state.qcVendorNames.qcVendorName3;
    let MFRPN1 = this.state.qcMFRPNs.qcMFRPN1;
    let MFRPN2 = this.state.qcMFRPNs.qcMFRPN2;
    let MFRPN3 = this.state.qcMFRPNs.qcMFRPN3;
    let VendorPN1 = this.state.qcVendorPNs.qcVendorPN1;
    let VendorPN2 = this.state.qcVendorPNs.qcVendorPN2;
    let VendorPN3 = this.state.qcVendorPNs.qcVendorPN3;
    let MFRPNString = "";
    let MFRNamePNString = "";
    let MFRNamePrefix = "";
    let MFRPNPrefix = "";
    let VendorPNString = "";
    let VendorNamePNString = "";
    let VendorNamePrefix = "";
    let VendorPNPrefix = "";
    let AdditionalInfoFromWeb = this.state.qcAdditionalInfoFromWeb;
    let AdditionalInfoFromInput = this.state.qcAdditionalInfoFromInput;
    let AdditionalInfoString = "";
    let AdditionalInfoPrefix = "";

    //#region Generate Attribute Name and QC Attribute Value string
    itemAttributes.forEach((item) => {
      if (attributeNameValueString) {
        if (item.QCAttributeValue && item.QCAttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeNameValueString +=
              "," +
              item.AttributeName +
              ":" +
              item.QCAttributeValue.trim().toUpperCase();
          else
            attributeNameValueString +=
              "," + item.AttributeName + ":" + item.QCAttributeValue.trim();
        }
      } else {
        if (item.QCAttributeValue && item.QCAttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeNameValueString =
              item.AttributeName +
              ":" +
              item.QCAttributeValue.trim().toUpperCase();
          else
            attributeNameValueString =
              item.AttributeName + ":" + item.QCAttributeValue.trim();
        }
      }
    });

    if (attributeNameValueString && attributeNameValueString.length > 0)
      newLongDescription += ": " + attributeNameValueString;
    //#endregion

    //#region Generate MFR Name and PN string and Concatenate it to new long desc
    //#region MFRName1
    if (projectSetting.IsToIncludeMFRNameInLongDesc) {
      if (
        projectSetting.MFRNamePrefix &&
        projectSetting.MFRNamePrefix.length > 0
      ) {
        MFRNamePrefix = projectSetting.MFRNamePrefix;
      }

      if (MFRNamePrefix && MFRNamePrefix.length > 0) {
        if (MFRName1 && MFRName1.length > 0) {
          MFRNameString = MFRNamePrefix + MFRName1;
        }
      } else {
        if (MFRName1 && MFRName1.length > 0) {
          MFRNameString = MFRName1;
        }
      }

      MFRNamePNString = MFRNameString;
    }
    //#endregion

    //#region MFRPN1
    if (projectSetting.IsToIncludeMFRPNInLongDesc) {
      if (projectSetting.MFRPNPrefix && projectSetting.MFRPNPrefix.length > 0)
        MFRPNPrefix = projectSetting.MFRPNPrefix;

      if (MFRPNPrefix && MFRPNPrefix.length > 0) {
        if (MFRPN1 && MFRPN1.length > 0) MFRPNString = MFRPNPrefix + MFRPN1;
      } else {
        if (MFRPN1 && MFRPN1.length > 0) MFRPNString = MFRPN1;
      }

      MFRNamePNString += "," + MFRPNString;
    }
    //#endregion

    //#region MFRName2
    if (projectSetting.IsToIncludeMFRNameInLongDesc) {
      if (MFRNamePrefix && MFRNamePrefix.length > 0) {
        if (MFRName2 && MFRName2.length > 0) {
          MFRNameString = MFRNamePrefix + MFRName2;
        }
      } else {
        if (MFRName2 && MFRName2.length > 0) {
          MFRNameString = MFRName2;
        }
      }

      MFRNamePNString += "," + MFRNameString;
    }
    //#endregion

    //#region MFRPN2
    if (projectSetting.IsToIncludeMFRPNInLongDesc) {
      if (MFRPNPrefix && MFRPNPrefix.length > 0) {
        if (MFRPN2 && MFRPN2.length > 0) MFRPNString = MFRPNPrefix + MFRPN2;
      } else {
        if (MFRPN2 && MFRPN2.length > 0) MFRPNString = MFRPN2;
      }

      MFRNamePNString += "," + MFRPNString;
    }
    //#endregion

    //#region MFRName3
    if (projectSetting.IsToIncludeMFRNameInLongDesc) {
      if (MFRNamePrefix && MFRNamePrefix.length > 0) {
        if (MFRName3 && MFRName3.length > 0) {
          MFRNameString = MFRNamePrefix + MFRName3;
        }
      } else {
        if (MFRName3 && MFRName3.length > 0) {
          MFRNameString = MFRName3;
        }
      }

      MFRNamePNString += "," + MFRNameString;
    }
    //#endregion

    //#region MFRPN3
    if (projectSetting.IsToIncludeMFRPNInLongDesc) {
      if (MFRPNPrefix && MFRPNPrefix.length > 0) {
        if (MFRPN3 && MFRPN3.length > 0) MFRPNString = MFRPNPrefix + MFRPN3;
      } else {
        if (MFRPN3 && MFRPN3.length > 0) MFRPNString = MFRPN3;
      }

      MFRNamePNString += "," + MFRPNString;
    }
    //#endregion

    if (
      projectSetting.IsToIncludeMFRNameInLongDesc ||
      projectSetting.IsToIncludeMFRPNInLongDesc
    )
      newLongDescription += "," + MFRNamePNString;
    //#endregion

    //#region Generate Vendor Name and PN string and Concatenate it to new long desc
    //#region VendorName1
    if (projectSetting.IsToIncludeVendorNameInLongDesc) {
      if (
        projectSetting.VendorNamePrefix &&
        projectSetting.VendorNamePrefix.length > 0
      ) {
        VendorNamePrefix = projectSetting.VendorNamePrefix;
      }

      if (VendorNamePrefix && VendorNamePrefix.length > 0) {
        if (VendorName1 && VendorName1.length > 0) {
          VendorNameString = VendorNamePrefix + VendorName1;
        }
      } else {
        if (VendorName1 && VendorName1.length > 0) {
          VendorNameString = VendorName1;
        }
      }

      VendorNamePNString = VendorNameString;
    }
    //#endregion

    //#region VendorPN1
    if (projectSetting.IsToIncludeVendorPNInLongDesc) {
      if (
        projectSetting.VendorPNPrefix &&
        projectSetting.VendorPNPrefix.length > 0
      )
        VendorPNPrefix = projectSetting.VendorPNPrefix;

      if (VendorPNPrefix && VendorPNPrefix.length > 0) {
        if (VendorPN1 && VendorPN1.length > 0)
          VendorPNString = VendorPNPrefix + VendorPN1;
      } else {
        if (VendorPN1 && VendorPN1.length > 0) VendorPNString = VendorPN1;
      }

      VendorNamePNString += "," + VendorPNString;
    }
    //#endregion

    //#region VendorName2
    if (projectSetting.IsToIncludeVendorNameInLongDesc) {
      if (VendorNamePrefix && VendorNamePrefix.length > 0) {
        if (VendorName2 && VendorName2.length > 0) {
          VendorNameString = VendorNamePrefix + VendorName2;
        }
      } else {
        if (VendorName2 && VendorName2.length > 0) {
          VendorNameString = VendorName2;
        }
      }

      VendorNamePNString += "," + VendorNameString;
    }
    //#endregion

    //#region VendorPN2
    if (projectSetting.IsToIncludeVendorPNInLongDesc) {
      if (VendorPNPrefix && VendorPNPrefix.length > 0) {
        if (VendorPN2 && VendorPN2.length > 0)
          VendorPNString = VendorPNPrefix + VendorPN2;
      } else {
        if (VendorPN2 && VendorPN2.length > 0) VendorPNString = VendorPN2;
      }

      VendorNamePNString += "," + VendorPNString;
    }
    //#endregion

    //#region VendorName3
    if (projectSetting.IsToIncludeVendorNameInLongDesc) {
      if (VendorNamePrefix && VendorNamePrefix.length > 0) {
        if (VendorName3 && VendorName3.length > 0) {
          VendorNameString = VendorNamePrefix + VendorName3;
        }
      } else {
        if (VendorName3 && VendorName3.length > 0) {
          VendorNameString = VendorName3;
        }
      }

      VendorNamePNString += "," + VendorNameString;
    }
    //#endregion

    //#region VendorPN3
    if (projectSetting.IsToIncludeVendorPNInLongDesc) {
      if (VendorPNPrefix && VendorPNPrefix.length > 0) {
        if (VendorPN3 && VendorPN3.length > 0)
          VendorPNString = VendorPNPrefix + VendorPN3;
      } else {
        if (VendorPN3 && VendorPN3.length > 0) VendorPNString = VendorPN3;
      }

      VendorNamePNString += "," + VendorPNString;
    }
    //#endregion

    if (
      projectSetting.IsToIncludeVendorNameInLongDesc ||
      projectSetting.IsToIncludeVendorPNInLongDesc
    )
      newLongDescription += "," + VendorNamePNString;
    //#endregion

    //#region Generate Additional Info string and Concatenate it to new long desc
    if (projectSetting.IsToIncludeAdditionalInfoInLongDesc) {
      if (
        projectSetting.AdditionalInfoPrefix &&
        projectSetting.AdditionalInfoPrefix.length > 0
      ) {
        AdditionalInfoPrefix = projectSetting.AdditionalInfoPrefix;
      }

      if (AdditionalInfoFromWeb && AdditionalInfoFromWeb.length > 0) {
        if (AdditionalInfoPrefix && AdditionalInfoPrefix.length > 0)
          AdditionalInfoString = AdditionalInfoPrefix + AdditionalInfoFromWeb;
        else AdditionalInfoString = AdditionalInfoFromWeb;
      }

      if (AdditionalInfoString && AdditionalInfoString.length > 0) {
        if (AdditionalInfoFromInput && AdditionalInfoFromInput.length > 0) {
          AdditionalInfoString += "," + AdditionalInfoFromInput;
        }
      } else {
        if (AdditionalInfoFromInput && AdditionalInfoFromInput.length > 0) {
          AdditionalInfoString = AdditionalInfoPrefix + AdditionalInfoFromInput;
        }
      }

      if (AdditionalInfoString && AdditionalInfoString.length > 0)
        newLongDescription += "," + AdditionalInfoString;
    }

    //#endregion

    this.setState({
      newLongDescription: newLongDescription,
    });
  };
  //#endregion

  //#region Fetch Attribute List by Noun & Modifier
  fetchAttributeList(retrieveOption) {
    productionTemplate
      .getNounModifierAttributeList(
        this.state.customerCode,
        this.state.projectCode,
        this.state.qcNoun,
        this.state.qcModifier
      )
      .then((resp) => {
        if (resp.data.length !== 0) {
          let NMAttributes = [];
          if (retrieveOption) {
            const attributeValueMap = {};
            this.state.itemAttributes.forEach((item) => {
              attributeValueMap[item.AttributeName] = item.QCAttributeValue;
            });

            resp.data.forEach((item) => {
              if (attributeValueMap.hasOwnProperty(item.AttributeName)) {
                item.QCAttributeValue = attributeValueMap[item.AttributeName];
              }
            });

            NMAttributes = resp.data;
          } else {
            NMAttributes = resp.data;
          }

          this.setState(
            {
              itemAttributes: NMAttributes,
              loading: false,
            },
            () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }
  //#endregion

  //#region Handle Comment Change
  handleCommentChange = (index, value) => {
    const updatedAttributes = [...this.state.itemAttributes];
    updatedAttributes[index].QCAttributeValueComments = value;
    this.setState({ itemAttributes: updatedAttributes, IsItemEdited: true });
  };
  //#endregion

  //#region table cell onchange function
  getValueToPass = (selectedValue) => {
    let newItemAttributes = this.state.itemAttributes;
    newItemAttributes.forEach((item) => {
      if (item.AttributeName === selectedValue.name) {
        item.QCAttributeValue = selectedValue.value;
      }
    });

    this.setState(
      {
        ...this.state,
        itemAttributes: newItemAttributes,
        IsItemEdited: true,
        loading: false,
      },
      () => {
        this.generateNewShortAndLongDescriptionAndFindMissingWords();
      }
    );
  };
  //#endregion

  //#region Change QC Status
  onChangeStatus = (e) => {
    this.setState({
      IsItemEdited: true,
      selectedQCStatus: e.target.value,
    });
  };
  //#endregion

  //#region Select QC Level
  selectLevel = (value) => {
    this.setState({
      IsItemEdited: true,
      selectedQCLevel: value,
    });
  };
  //#endregion

  //#region MFR and Vendor onFocus Function
  handleFocus = (type) => {
    const state = JSON.parse(sessionStorage.getItem("ProdItemData"));
    if (type === "MFRName") {
      productionTemplate
        .productionMFRVendorsName(state?.CustomerCode, state?.ProjectCode, "M")
        .then((resp) => {
          let options = resp.data.map((item) => {
            return { label: item, value: item };
          });
          this.setState({ MFRNameOptions: options });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    } else if (type === "VendorName") {
      productionTemplate
        .productionMFRVendorsName(state?.CustomerCode, state?.ProjectCode, "V")
        .then((resp) => {
          let options = resp.data.map((item) => {
            return { label: item, value: item };
          });
          this.setState({ VendorNameOptions: options });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    }
  };
  //#endregion

  //#region handle MFR Name and PN Change Functions
  handleMFRChange = (selectedOption, selectId, type) => {
    let optionValue = null;
    if (selectedOption) {
      if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
        optionValue = selectedOption.value.toUpperCase();
      } else {
        optionValue = selectedOption.value.toLowerCase();
      }
    }

    if (type === "MFR Name") {
      this.setState(
        (prevState) => ({
          [selectId]: selectedOption,
          qcMFRNames: {
            ...prevState.qcMFRNames,
            [selectId]: optionValue,
          },
          IsItemEdited: true,
        }),
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
    }
  };

  handleMFRPNChange = (e, selectId, type) => {
    let optionValue = "";
    if (e.target.value) {
      if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
        optionValue = e.target.value.toUpperCase();
      } else {
        optionValue = e.target.value.toLowerCase();
      }
    }

    if (type === "MFR PN") {
      this.setState(
        (prevState) => ({
          [selectId]: e.target.value,
          qcMFRPNs: {
            ...prevState.qcMFRPNs,
            [selectId]: optionValue,
          },
          IsItemEdited: true,
        }),
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
    }
  };
  //#endregion

  //#region Vendor Name, PN Change Functions
  handleVendorChange = (selectedOption, selectId, type) => {
    let optionValue = "";
    if (selectedOption) {
      if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
        optionValue = selectedOption.value.toUpperCase();
      } else {
        optionValue = selectedOption.value.toLowerCase();
      }
    }

    if (type === "Vendor Name") {
      this.setState(
        (prevState) => ({
          [selectId]: selectedOption,
          qcVendorNames: {
            ...prevState.qcVendorNames,
            [selectId]: optionValue,
          },
          IsItemEdited: true,
        }),
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
    }
  };

  handleVendorPNChange = (e, selectId, type) => {
    let optionValue = "";
    if (e.target.value) {
      if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
        optionValue = e.target.value.toUpperCase();
      } else {
        optionValue = e.target.value.toLowerCase();
      }
    }

    if (type === "Vendor PN") {
      this.setState(
        (prevState) => ({
          [selectId]: e.target.value,
          qcVendorPNs: {
            ...prevState.qcVendorPNs,
            [selectId]: optionValue,
          },
          IsItemEdited: true,
        }),
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
    }
  };
  //#endregion

  //#region on change QC Additional Info
  onChangeQCAdditionalInfo = (e) => {
    let enteredValue = "";
    if (this.state.projectSetting.IsToConvertAttributeValueToUppercase)
      enteredValue = e.target.value.toUpperCase();
    else enteredValue = e.target.value.toLowerCase();

    if (e.target.name === "qcAdditionalInfoFromWeb") {
      this.setState(
        {
          qcAdditionalInfoFromWeb: enteredValue,
          IsItemEdited: true,
        },
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
      return;
    }

    this.setState(
      {
        qcAdditionalInfoFromInput: enteredValue,
        IsItemEdited: true,
      },
      () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
    );
  };
  //#endregion

  //#region Functions For UNSPSC
  fetchUNSPSCOptionData = () => {
    if (Object.keys(this.state.selectedNounModifier).length === 0) {
      toast.warning("Noun Modifier not selected...");
      return;
    }
    let noun_Modifier = this.state.selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();
    productionTemplate
      .UNSPSCcodeCategoryDropDown(
        this.state.customerCode,
        this.state.projectCode,
        noun,
        modifier
      )
      .then((resp) => {
        let options = resp.data.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        this.setState((prevState) => ({
          ...prevState,
          UNSPSCOptions: options,
        }));
      })
      .catch((err) => console.log(err));
  };

  handleChangeUNSPSC = (selectedOption) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedUNSPSCOption: selectedOption,
    }));
  };

  assignCodeCategory = () => {
    if (Object.keys(this.state.selectedUNSPSCOption).length === 0) {
      toast.warning("UNSPSC not selected...");
      return;
    }

    if (Object.keys(this.state.selectedUNSPSCOption).length > 0) {
      const unspscLabelParts = this.state.selectedUNSPSCOption.label.split("-");
      let unspscVersion = unspscLabelParts[0].trim();
      let unspscCode = unspscLabelParts[1].trim();
      let unspscCategory = unspscLabelParts[2].trim();
      this.setState(
        (prevState) => ({
          ...prevState,
          selectedUNSPSCMroDictOption: this.state.selectedUNSPSCOption,
          qcUNSPSCCode: unspscCode,
          qcUNSPSCCategory: unspscCategory,
          qcUNSPSCVersion: unspscVersion,
          IsItemEdited: true,
        }),
        () => {
          this.setState({
            selectedUNSPSCMroDictOption: null,
          });
        }
      );
    }
  };
  //#endregion

  //#region Functionas For UNSPSCs from MRO Dictionary
  fetchUNSPSCMroDictOptionData = () => {
    if (Object.keys(this.state.selectedNounModifier).length === 0) {
      toast.warning("Noun Modifier not selected...");
      return;
    }
    let noun_Modifier = this.state.selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();

    productionTemplate
      .UNSPSCMroDictionaryCategoryDropDown(
        this.state.customerCode,
        this.state.projectCode,
        noun,
        modifier
      )
      .then((resp) => {
        let options = resp.data.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        this.setState((prevState) => ({
          ...prevState,
          UNSPSCMroDictOptions: options,
        }));
      })
      .catch((err) => console.log(err));
  };

  handleChangeUNSPSCMroDict = (selectedOption) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedUNSPSCMroDictOption: selectedOption,
    }));
  };

  assignUNSPSCMroDictCodeCategory = () => {
    const { selectedUNSPSCMroDictOption } = this.state;

    if (
      selectedUNSPSCMroDictOption &&
      Object.keys(selectedUNSPSCMroDictOption).length > 0
    ) {
      const unspscLabelParts = selectedUNSPSCMroDictOption.label.split("-");

      let unspscVersion = unspscLabelParts[0].trim();
      let unspscCode = unspscLabelParts[1].trim();
      let unspscCategory = unspscLabelParts[2].trim();

      this.setState(
        {
          selectedUNSPSCOption: selectedUNSPSCMroDictOption,
          qcUNSPSCCode: unspscCode,
          qcUNSPSCCategory: unspscCategory,
          qcUNSPSCVersion: unspscVersion,
          IsItemEdited: true,
        },
        () => {
          this.setState({
            selectedUNSPSCOption: null,
          });
        }
      );
    }
  };
  //#endregion

  //#region AssignCategoryValue
  AssignCategoryValue(value) {
    this.toggleUnspscModal(value);
  }
  //#endregion

  //#region Assign MRODictionary Value
  AssignDictionaryValue = (value) => {
    if (value && value.length !== 0) {
      this.setState(
        {
          qcNoun: value[0],
          qcModifier: value[1],
          selectedNounModifier: {
            value: `${value[0]}_${value[1]}`,
            label: `${value[0]}_${value[1]}`,
          },
          IsItemEdited: true,
          retriveValue: true,
        },
        () => {
          this.toggleMroDictionaryViewerModal([value[0], value[1]]);
        }
      );
    } else {
      this.toggleMroDictionaryViewerModal();
    }
  };
  //#endregion

  //#region Clear UNSPSC Code Category
  clearUNSPSCCodeCategory = () => {
    this.setState((prevState) => ({
      ...prevState,
      selectedUNSPSCOption: {},
      selectedUNSPSCMroDictOption: {},
      qcUNSPSCCode: "",
      qcUNSPSCCategory: "",
      qcUNSPSCVersion: "",
      IsItemEdited: true,
    }));
  };
  //#endregion

  //#region Unspsc Modal Toggle
  toggleUnspscModal = (value) => {
    if (value && value.length !== 0) {
      this.setState({
        ...this.state,
        qcUNSPSCCode: value[0],
        qcUNSPSCCategory: value[1],
        IsItemEdited: true,
      });
    }
    this.setState({ showUnspscModal: !this.state.showUnspscModal });
  };
  //#endregion

  //#region MRO Dictionary Viewer Modal Toggle
  toggleMroDictionaryViewerModal = (
    value = [this.state.qcNoun, this.state.qcModifier]
  ) => {
    if (value && value.length === 2) {
      this.setState({
        qcNoun: value[0],
        qcModifier: value[1],
        selectedNounModifier: {
          value: `${value[0]}_${value[1]}`,
          label: `${value[0]}_${value[1]}`,
        },
        IsItemEdited: true,
      });
    }
    this.setState((prevState) => ({
      showMroDictionaryViewerModal: !prevState.showMroDictionaryViewerModal,
    }));
  };
  //#endregion

  //#region Remove Special Characters
  removeSpecialCharacters = (str) => {
    if (str) {
      return str.replace(/[^a-zA-Z0-9]/g, "");
    }
    return "";
  };
  //#endregion

  //#region Save All Item Details
  saveAllItemDetails = () => {
    if (this.gridRef.current) {
      this.gridRef.current.api.stopEditing();
    }

    if (!this.state.IsItemEdited) {
      toast.warning("No changes have been done to save...!");
      return;
    }

    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    const valuesMPN = [
      this.removeSpecialCharacters(this.state.mfrPN1),
      this.removeSpecialCharacters(this.state.mfrPN2),
      this.removeSpecialCharacters(this.state.mfrPN3),
    ];

    const uniqueValues = new Set(
      valuesMPN.filter((value) => value.trim() !== "")
    );
    const isValid =
      uniqueValues.size ===
      valuesMPN.filter((value) => value.trim() !== "").length;

    if (!isValid) {
      toast.error("Manufacturer PN Should be unique...!");
      return;
    }
    const valuesVPN = [
      this.removeSpecialCharacters(this.state.vendorsPN.vendorPN1),
      this.removeSpecialCharacters(this.state.vendorsPN.vendorPN2),
      this.removeSpecialCharacters(this.state.vendorsPN.vendorPN3),
    ];

    const uniqueValuesVPN = new Set(
      valuesVPN.filter((value) => value.trim() !== "")
    );
    const isValidVPN =
      uniqueValuesVPN.size ===
      valuesVPN.filter((value) => value.trim() !== "").length;

    if (!isValidVPN) {
      toast.error("Vendor PN Should be unique...!");
      return;
    }

    var data = {
      qcItemID: this.state.qcItemID,
      productionItemID: this.state.productionItemID,
      newShortDescription: this.state.newShortDescription,
      newLongDescription: this.state.newLongDescription,
      missingWords: this.state.missingWords,
      noun: this.state.qcNoun,
      modifier: this.state.qcModifier,
      nounModifierComments: this.state.nounModifierComments,
      qcStatus: this.state.selectedQCStatus,
      qcLevel: this.state.selectedQCLevel,
      qcLevelComments: this.state.levelComments,
      mfrName1: this.state.qcMFRNames.qcMFRName1,
      mfrName1Comments: this.state.mfrName1Comments,
      mfrPN1: this.state.qcMFRPNs.qcMFRPN1,
      mfrPN1Comments: this.state.mfrPN1Comments,
      mfrName2: this.state.qcMFRNames.qcMFRName2,
      mfrName2Comments: this.state.mfrName2Comments,
      mfrPN2: this.state.qcMFRPNs.qcMFRPN2,
      mfrPN2Comments: this.state.mfrPN2Comments,
      mfrName3: this.state.qcMFRNames.qcMFRName3,
      mfrName3Comments: this.state.mfrName3Comments,
      mfrPN3: this.state.qcMFRPNs.qcMFRPN3,
      mfrPN3Comments: this.state.mfrPN3Comments,
      vendorName1: this.state.qcVendorNames.qcVendorName1,
      vendorName1Comments: this.state.vendorName1Comments,
      vendorPN1: this.state.qcVendorPNs.qcVendorPN1,
      vendorPN1Comments: this.state.vendorPN1Comments,
      vendorName2: this.state.qcVendorNames.qcVendorName2,
      vendorName2Comments: this.state.vendorName2Comments,
      vendorPN2: this.state.qcVendorPNs.qcVendorPN2,
      vendorPN2Comments: this.state.vendorPN2Comments,
      vendorName3: this.state.qcVendorNames.qcVendorName3,
      vendorName3Comments: this.state.vendorName3Comments,
      vendorPN3: this.state.qcVendorPNs.qcVendorPN3,
      vendorPN3Comments: this.state.vendorPN3Comments,
      additionalInfoFromWeb: this.state.qcAdditionalInfoFromWeb,
      additionalInfoFromWebComments: this.state.additionalInfoFromWebComments,
      additionalInfoInput: this.state.qcAdditionalInfoFromInput,
      additionalInfoInputComments: this.state.additionalInfoFromInputComments,
      unspscCode: this.state.qcUNSPSCCode,
      unspscCategory: this.state.qcUNSPSCCategory,
      unspscComments: this.state.unspscComments,
      webRefURL1: this.state.qcWebRefURL1,
      webRefURL1Comments: this.state.webRefURL1Comments,
      webRefURL2: this.state.qcWebRefURL2,
      webRefURL2Comments: this.state.webRefURL2Comments,
      webRefURL3: this.state.qcWebRefURL3,
      webRefURL3Comments: this.state.webRefURL3Comments,
      pdfURL: this.state.qcWebRefPDFURL,
      pdfURLComments: this.state.webRefPDFURLComments,
      remarks: this.state.qcRemarks,
      remarksComments: this.state.remarksComments,
      application: this.state.qcApplication,
      applicationComments: this.state.applicationComments,
      qcUser: helper.getUser(),
      dwg: this.state.qcDWG,
      dwgComments: this.state.dwgComments,
      itemNo: this.state.qcItemNo,
      itemNoComments: this.state.itemNoComments,
      otherNo: this.state.qcOtherNo,
      otherNoComments: this.state.otherNoComments,
      pos: this.state.qcPOS,
      posComments: this.state.posComments,
      serialNo: this.state.qcSerialNo,
      serialNoComments: this.state.serialNoComments,
      kksCode: this.state.qcKKSCode,
      kksCodeComments: this.state.kksCodeComments,
      assemblyOrPart: this.state.qcAssemblyOrPart,
      assemblyOrPartComments: this.state.assemblyOrPartComments,
      bom: this.state.qcBOM,
      bomComments: this.state.bomComments,
      greenItems: this.state.qcGreenItems,
      greenItemsComments: this.state.greenItemsComments,
      userID: helper.getUser(),
    };

    if (Object.keys(this.state.selectedNounModifier).length !== 0) {
      let noun_Modifier = this.state.selectedNounModifier.label.split("_");
      data.noun = noun_Modifier[0].trim();
      data.modifier = noun_Modifier[1].trim();
      data.itemAttributes = this.state.itemAttributes;
    }

    qcTemplate
      .qcItemUpdate(data)
      .then((response) => {
        this.setState({ IsItemEdited: false });
        toast.success("QC Item details Saved Successfully...!");
      })
      .catch((error) => {
        this.setState({ loading: false });
        toast.error(error.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  render() {
    //#region defining state values
    const {
      activeTabKey,
      itemAttributes,
      nounModifierOptions,
      UNSPSCOptions,
      UNSPSCMroDictOptions,
      selectedNounModifier,
      selectedUNSPSCOption,
      selectedUNSPSCMroDictOption,
    } = this.state;
    //#endregion

    //#region Tooltip for Long & New Long Description
    const newLongDescriptionToolTip = (
      <Tooltip id="tooltip" className="new-long-tooltip">
        {this.state.newLongDescription}
      </Tooltip>
    );
    const newshortDescriptionToolTip = (
      <Tooltip id="tooltip" className="new-long-tooltip">
        {this.state.newShortDescription}
      </Tooltip>
    );
    const longDescriptionToolTip = (
      <Tooltip id="tooltip" className="new-long-tooltip">
        {this.state.longDescription}
      </Tooltip>
    );
    const shortDescriptionToolTip = (
      <Tooltip id="tooltip" className="new-long-tooltip">
        {this.state.shortDescription}
      </Tooltip>
    );
    const missingWOrdToolTip = (
      <Tooltip id="tooltip" className="new-long-tooltip">
        {this.state.missingWords}
      </Tooltip>
    );
    //#endregion
    //#region style for setting div height
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    //#endregion
    const { showEditModal, hideEditModal } = this.props;

    //#region Close Edit Modal
    const closeEditModal = () => {
      sessionStorage.removeItem("selectedQCItemIDs");
      hideEditModal();
    };
    //#endregion

    //#region main return
    return (
      <Modal
        show={showEditModal}
        onHide={hideEditModal}
        className="edit-gop-modal"
      >
        <div style={{ height: "93%" }}>
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
            {this.state.retriveValue && (
              <Modal
                show={this.state.retriveValue}
                onHide={this.hideRetriveValue}
                className="confirm-save-modal"
              >
                <div className="save-changes-modal-div">
                  <div>
                    <div>
                      <h6>whether to retain the values??</h6>
                    </div>
                    <div className="d-flex justify-content-center">
                      <Button
                        varinat="primary"
                        className="saveEditScreenData float-end mr-4"
                        onClick={this.RetriveNMValues}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="primary"
                        className="saveEditScreenData float-end"
                        onClick={this.hideRetriveValue}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            {this.state.showUnspscModal && (
              <UnSpscModal
                showUnspscModal={this.state.showUnspscModal}
                toggleUnspscModal={this.toggleUnspscModal}
                AssignCategoryValue={this.AssignCategoryValue}
                unspscVerion={this.state.unspscVersion}
              />
            )}

            {this.state.showMroDictionaryViewerModal && (
              <MroDictionaryViewerModal
                showMroDictionaryViewerModal={
                  this.state.showMroDictionaryViewerModal
                }
                toggleMroDictionaryViewerModal={
                  this.toggleMroDictionaryViewerModal
                }
                AssignDictionaryValue={this.AssignDictionaryValue}
              />
            )}

            <div style={{ height: "100%" }}>
              <div className="gd-read-screen" style={{ minHeight: "35%" }}>
                <Row
                  className="border-screen reference-field-div"
                  style={{ height: "10%" }}
                >
                  <Col
                    className="ref-left-div col-md-2"
                    style={{ padding: "0" }}
                  >
                    <Row>
                      <Col lg={10}>
                        <h4 className="reference-head"> Reference Fields </h4>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="ref-right-div col-md-10">
                    <Row>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            Unique ID: {this.state.uniqueId}
                          </h6>
                        </div>
                      </Col>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            Customer Code: {this.state.customerCode}
                          </h6>
                        </div>
                      </Col>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            Project Code: {this.state.projectCode}
                          </h6>
                        </div>
                      </Col>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            Batch No.:
                            {this.state.batchNo ? this.state.batchNo : " N/A"}
                          </h6>
                        </div>
                      </Col>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            QC User: {this.state.userName}
                          </h6>
                        </div>
                      </Col>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            QC Test No.: {this.state.qcTestNo}
                          </h6>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div className="border-screen" style={{ height: "90%" }}>
                  <div className="gop-mfr-row-section">
                    <Form.Label className="readGOPHead"></Form.Label>
                    <div className="gop-mfr-row">
                      <Form.Label className="gop-mfr-label"> MFR </Form.Label>
                      &nbsp;
                      <div className="gop-mfr-value input-gray">
                        {this.state.mfrName}
                      </div>
                    </div>
                    &nbsp;&nbsp;
                    <div className="gop-mfr-row">
                      <Form.Label className="gop-mfr-label">
                        {" "}
                        MFR PN{" "}
                      </Form.Label>
                      &nbsp;
                      <div className="gop-mfr-value input-gray">
                        {this.state.mfrPN}
                      </div>
                    </div>
                    &nbsp;&nbsp;
                    <div className="gop-mfr-row">
                      <Form.Label className="gop-mfr-label">
                        {" "}
                        Vendor{" "}
                      </Form.Label>
                      &nbsp;
                      <div className="gop-mfr-value input-gray">
                        {this.state.vendorName}
                      </div>
                    </div>
                    &nbsp;&nbsp;
                    <div className="gop-mfr-row">
                      <Form.Label className="gop-mfr-label">
                        Vendor PN
                      </Form.Label>
                      &nbsp;
                      <div className="gop-mfr-value  input-gray">
                        {this.state.vendorPN}
                      </div>
                    </div>
                    &nbsp;&nbsp;
                    <div className="gop-mfr-row">
                      <Form.Label className="gop-mfr-label"> UOM </Form.Label>
                      &nbsp;
                      <Form.Control
                        type="text"
                        className="pro-input"
                        style={{ height: "100%", padding: "2% 6px" }}
                        name="uOM"
                        value={this.state.uOM}
                      />
                    </div>
                  </div>

                  <div className="gop-mfr-row-section">
                    <Form.Label className="readGOPHead"></Form.Label>
                    <div className="custom-input-div">
                      <Row className="mr-0">
                        {this.state.customColumnName1 && (
                          <Col md={4}>
                            <div className="gop-mfr-row">
                              <Form.Label className="gop-mfr-label">
                                {" "}
                                {this.state.customColumnName1}{" "}
                              </Form.Label>
                              &nbsp;
                              <Form.Control
                                type="text"
                                className="pro-input input-gray"
                                style={{ height: "100%", padding: "1% 6px" }}
                                name="uOM"
                                value={this.state.customColumnName1Value}
                                readOnly
                              />
                            </div>
                          </Col>
                        )}
                        {this.state.customColumnName2 && (
                          <Col md={4}>
                            <div className="gop-mfr-row">
                              <Form.Label className="gop-mfr-label">
                                {" "}
                                {this.state.customColumnName2}{" "}
                              </Form.Label>
                              &nbsp;
                              <Form.Control
                                type="text"
                                className="pro-input input-gray"
                                style={{ height: "100%", padding: "1% 6px" }}
                                name="uOM"
                                value={this.state.customColumnName2Value}
                                readOnly
                              />
                            </div>
                          </Col>
                        )}
                        {this.state.customColumnName3 && (
                          <Col md={4}>
                            <div className="gop-mfr-row">
                              <Form.Label className="gop-mfr-label">
                                {" "}
                                {this.state.customColumnName3}{" "}
                              </Form.Label>
                              &nbsp;
                              <Form.Control
                                type="text"
                                className="pro-input input-gray"
                                style={{ height: "100%", padding: "1% 6px" }}
                                name="uOM"
                                value={this.state.customColumnName3Value}
                                readOnly
                              />
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </div>

                  <div className="form-row-div">
                    <Form.Label className="readGOPHead">
                      Short Description
                    </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={shortDescriptionToolTip}
                    >
                      <Form.Control
                        type="text"
                        as="textarea"
                        className="pro-input input-gray hide-scrollbar"
                        name="shortDescription"
                        defaultValue={this.state.shortDescription}
                        onChange={this.inputChangeHandler}
                        ref={this.textareaRef1}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                  <div className="form-row-div">
                    <Form.Label className="readGOPHead">
                      Long Description
                    </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={longDescriptionToolTip}
                    >
                      <Form.Control
                        type="text"
                        as="textarea"
                        className="pro-input input-gray hide-scrollbar"
                        name="longDescription"
                        defaultValue={this.state.longDescription}
                        onChange={this.inputChangeHandler}
                        ref={this.textareaRef2}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                  <hr className="differ-input-output" />
                  <div className="form-row-div">
                    <Form.Label className="readGOPHead">
                      New Short Description
                    </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={newshortDescriptionToolTip}
                    >
                      <Form.Control
                        type="text"
                        className="pro-input input-lightblue"
                        name="newShortDescription"
                        value={this.state.newShortDescription}
                        onChange={this.inputChangeHandler}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                  <div className="form-row-div">
                    <Form.Label className="readGOPHead">
                      New Long Description
                    </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={newLongDescriptionToolTip}
                    >
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="pro-input input-lightblue"
                        name="newLongDescription"
                        value={this.state.newLongDescription}
                        style={{ overflow: "hidden" }}
                        onChange={this.inputChangeHandler}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                  <div className="form-row-div">
                    <Form.Label className="readGOPHead">
                      Missing Words
                    </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={missingWOrdToolTip}
                    >
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="pro-input input-lightblue"
                        name="missingWords"
                        value={this.state.missingWords}
                        onChange={this.inputChangeHandler}
                        style={{ overflow: "hidden", color: "#ff0000" }}
                        readOnly
                      />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
              <div className="tab-content-div" style={{ minHeight: "6%" }}>
                <Row className="edit-grid-row" style={setHeight(100)}>
                  <Col lg={2} sm={12}></Col>
                  <Col
                    lg={10}
                    style={{ paddingLeft: "5px", ...setHeight(100) }}
                  >
                    <Row style={{ marginLeft: "0", ...setHeight(100) }}>
                      <Col lg={6} style={setHeight(100)}>
                        <Row style={setHeight(100)}>
                          <Col lg={2} className="form-data-row">
                            <Form.Label className="readGOPHead">
                              Noun / Modifier
                            </Form.Label>
                          </Col>
                          <Col lg={4} className="form-data-row">
                            <div
                              className="pro-select"
                              style={{ width: "170px" }}
                            >
                              <Select
                                styles={helper.customStyles}
                                options={nounModifierOptions}
                                value={selectedNounModifier}
                                onChange={this.handleChangeNounModifier}
                                isSearchable={true}
                                className="custom-select-div"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="form-data-row">
                            <div className="pro-select" style={setHeight(100)}>
                              <Button
                                varinat="primary"
                                className="saveEditScreenData float-end mr-1"
                                onClick={this.toggleMroDictionaryViewerModal}
                              >
                                View Dictionary
                              </Button>
                            </div>
                          </Col>
                          <Col lg={3} className="form-data-row">
                            <div
                              className="pro-select"
                              style={{ paddingRight: "5px", ...setHeight(100) }}
                            >
                              <Form.Control
                                className="txt-pn"
                                value={
                                  this.state.noun + " / " + this.state.modifier
                                }
                                style={{ height: "28px" }}
                                readOnly
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2}>
                        <Row>
                          <Col lg={2} className="form-data-row">
                            <Form.Label className="readGOPHead">
                              QC Status
                            </Form.Label>
                          </Col>
                          <Col lg={10}>
                            <select
                              className="form-control"
                              style={{
                                marginLeft: "5px",
                                width: "120px",
                                height: "28px",
                              }}
                              name="QCStatus"
                              value={this.state.selectedQCStatus}
                              onChange={this.onChangeStatus}
                            >
                              <option key="P" value="P">
                                Pending
                              </option>
                              <option key="C" value="C">
                                Completed
                              </option>
                              <option key="R" value="R">
                                Rejected
                              </option>
                            </select>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Col lg={9} className="form-data-row">
                            <div className="complete-status-flag-div">
                              <label
                                className="flag-label"
                                style={{ padding: "0 15px" }}
                              >
                                QC Level
                              </label>
                              <div
                                className="pro-select"
                                style={setHeight(100)}
                              >
                                <Form.Check
                                  inline
                                  label="Cleansed"
                                  name="group1"
                                  type="radio"
                                  checked={this.state.selectedQCLevel === "C"}
                                  onChange={() => this.selectLevel("C")}
                                  id={`inline-radio-1`}
                                />
                                <Form.Check
                                  inline
                                  label="Enriched"
                                  name="group1"
                                  type="radio"
                                  checked={this.state.selectedQCLevel === "E"}
                                  onChange={() => this.selectLevel("E")}
                                  id={`inline-radio-2`}
                                />
                                <Form.Check
                                  inline
                                  label="Exception"
                                  name="group1"
                                  type="radio"
                                  checked={this.state.selectedQCLevel === "X"}
                                  onChange={() => this.selectLevel("X")}
                                  id={`inline-radio-3`}
                                />
                              </div>
                            </div>
                          </Col>
                          <Col lg={3} className="form-data-row">
                            <div className="pro-select" style={setHeight(100)}>
                              <Form.Control
                                name="mfrPN1"
                                className="txt-pn"
                                value={this.state.productionLevel}
                                style={{ height: "28px" }}
                                readOnly
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="edit-grid-row" style={setHeight(100)}>
                  <Col lg={2} sm={12}></Col>
                  <Col lg={5} style={{ paddingLeft: "5px", ...setHeight(100) }}>
                    <Form.Control
                      style={{ marginTop: "5px", height: "28px" }}
                      name="nounModifierComments"
                      className="txt-pn"
                      placeholder="Enter Noun / Modifier QC Comments here"
                      value={this.state.nounModifierComments || ""}
                      onChange={this.inputChangeHandler}
                    />
                  </Col>
                  <Col lg={5} style={{ paddingLeft: "5px", ...setHeight(100) }}>
                    <Form.Control
                      style={{ marginTop: "5px", height: "28px" }}
                      name="levelComments"
                      className="txt-pn"
                      placeholder="Enter Level QC Comments here"
                      value={this.state.levelComments || ""}
                      onChange={this.inputChangeHandler}
                    />
                  </Col>
                </Row>
              </div>
              <div className="tab-content-div">
                <Tab.Container
                  id="left-tabs-example"
                  activeKey={activeTabKey}
                  style={{ height: "90%" }}
                  onSelect={this.handleTabSelect}
                >
                  <div className="gop-tab-section" style={{ height: "100%" }}>
                    <div className="tab-column">
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                          <Nav.Link
                            eventKey="NMAttribute"
                            className="gop-edit-tab"
                          >
                            NM Attributes
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="ManufactureInfo"
                            className="gop-edit-tab"
                          >
                            Manufacturer Info
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="VendorInfo"
                            className="gop-edit-tab"
                          >
                            Vendor Info
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="AddInfo" className="gop-edit-tab">
                            Additional Info
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="UNSPSC" className="gop-edit-tab">
                            UNSPSC
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="WebRef" className="gop-edit-tab">
                            Web Reference
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="Remarks" className="gop-edit-tab">
                            Remarks
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="Query" className="gop-edit-tab">
                            Query
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="Application"
                            className="gop-edit-tab"
                          >
                            Application
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="OtherReferences"
                            className="gop-edit-tab"
                          >
                            Other References
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>

                    <Tab.Content
                      className="display-tab-screen gop-tab-grid"
                      style={{ height: "100%" }}
                    >
                      <Tab.Pane eventKey="NMAttribute">
                        <div className="gd-tab-edit-screen grid-min-height">
                          <div style={{ height: "100%" }}>
                            <div className="ag-theme-alpine gop-theme-alpine">
                              <QCNMAttributeTable
                                itemAttributes={itemAttributes}
                                selectedNounModifier={
                                  this.state.selectedNounModifier
                                }
                                getValueToPass={this.getValueToPass}
                                projectSettings={this.state.projectSetting}
                                handleCommentChange={this.handleCommentChange}
                              />
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="ManufactureInfo">
                        <div className="gd-tab-edit-screen">
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    MFR Name 1
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{ marginTop: "5px", height: "28px" }}
                                    className="txt-pn"
                                    value={this.state.mfrName1 || ""}
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <QCEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.qcMFRNames.qcMFRName1
                                    }
                                    Inputs="qcMFRName1"
                                    Types="MFR Name"
                                    optionDataType="MFRName"
                                    handleVendorChange={this.handleMFRChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    MFR PN 1
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="mfrPN1"
                                    value={this.state.mfrPN1 || ""}
                                    style={{ marginTop: "5px", height: "28px" }}
                                    className="txt-pn"
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <Form.Control
                                    name="qcMFRPN1"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    className="txt-pn"
                                    placeholder="Enter MFR P/N1 QC Value here"
                                    value={this.state.qcMFRPNs.qcMFRPN1}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "qcMFRPN1",
                                        "MFR PN"
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrName1Comments"
                                    className="txt-pn"
                                    placeholder="Enter MFR Name1 QC Comments here"
                                    value={this.state.mfrName1Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrPN1Comments"
                                    className="txt-pn"
                                    placeholder="Enter MFR PN1 QC Comments here"
                                    value={this.state.mfrPN1Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    MFR Name 2
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="mfrName2"
                                    value={this.state.mfrName2 || ""}
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <QCEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.qcMFRNames.qcMFRName2
                                    }
                                    Inputs="qcMFRName2"
                                    Types="MFR Name"
                                    optionDataType="MFRName"
                                    handleVendorChange={this.handleMFRChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    MFR PN 2
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="mfrPN2"
                                    value={this.state.mfrPN2 || ""}
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <Form.Control
                                    name="qcMFRPN2"
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    placeholder="Enter MFR P/N2 value here"
                                    value={this.state.qcMFRPNs.qcMFRPN2}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "qcMFRPN2",
                                        "MFR PN"
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrName2Comments"
                                    className="txt-pn"
                                    placeholder="Enter MFR Name2 QC Comments here"
                                    value={this.state.mfrName2Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrPN2Comments"
                                    className="txt-pn"
                                    placeholder="Enter MFR PN2 QC Comments here"
                                    value={this.state.mfrPN2Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    MFR Name 3
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    value={this.state.mfrName3 || ""}
                                    name="qcMFRName3Comments"
                                    className="txt-pn"
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <QCEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.qcMFRNames.qcMFRName3
                                    }
                                    Inputs="qcMFRName3"
                                    Types="MFR Name"
                                    optionDataType="MFRName"
                                    handleVendorChange={this.handleMFRChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    MFR PN 3
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrPN3"
                                    value={this.state.mfrPN3 || ""}
                                    className="txt-pn"
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="qcMFRPN3"
                                    className="txt-pn"
                                    placeholder="Enter MFR P/N3 QC Value here"
                                    value={this.state.qcMFRPNs.qcMFRPN3}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "qcMFRPN3",
                                        "MFR PN"
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrName3Comments"
                                    className="txt-pn"
                                    placeholder="Enter MFR Name3 QC Comments here"
                                    value={this.state.mfrName3Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="mfrPN3Comments"
                                    className="txt-pn"
                                    placeholder="Enter MFR P/N3 QC Comments here"
                                    value={this.state.mfrPN3Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="VendorInfo">
                        <div className="gd-tab-edit-screen">
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    Vendor Name 1
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorName1"
                                    value={this.state.vendorName1 || ""}
                                    className="txt-pn"
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <QCEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.qcVendorNames.qcVendorName1
                                    }
                                    Inputs="qcVendorName1"
                                    Types="Vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    Vendor PN 1
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="vendorPN1"
                                    value={this.state.vendorPN1 || ""}
                                    className="txt-pn"
                                    style={{ height: "28px" }}
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <Form.Control
                                    name="qcVendorPN1"
                                    className="txt-pn"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Vendor P/N1 QC Value here"
                                    value={this.state.qcVendorPNs.qcVendorPN1}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "qcVendorPN1",
                                        "Vendor PN"
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorName1Comments"
                                    className="txt-pn"
                                    placeholder="Enter Vendor Name1 QC Comments here"
                                    value={this.state.vendorName1Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorPN1Comments"
                                    className="txt-pn"
                                    placeholder="Enter Vendor PN1 QC Comments here"
                                    value={this.state.vendorPN1Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    Vendor Name 2
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorName2"
                                    value={this.state.vendorName2 || ""}
                                    className="txt-pn"
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <QCEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.qcVendorNames.qcVendorName2
                                    }
                                    Inputs="qcVendorName2"
                                    Types="Vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    Vendor PN 2
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="vendorPN2"
                                    value={this.state.vendorPN2 || ""}
                                    className="txt-pn"
                                    style={{ height: "28px" }}
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <Form.Control
                                    name="qcVendorPN2"
                                    className="txt-pn"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Vendor P/N2 value here"
                                    value={this.state.qcVendorPNs.qcVendorPN2}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "qcVendorPN2",
                                        "Vendor PN"
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorName2Comments"
                                    className="txt-pn"
                                    placeholder="Enter Vendor Name2 QC Comments here"
                                    value={this.state.vendorName2Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorPN2Comments"
                                    className="txt-pn"
                                    placeholder="Enter Vendor PN2 QC Comments here"
                                    value={this.state.vendorPN2Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    Vendor Name 3
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorName3"
                                    value={this.state.vendorName3 || ""}
                                    className="txt-pn"
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <QCEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.qcVendorNames.qcVendorName3
                                    }
                                    Inputs="qcVendorName3"
                                    Types="Vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    Vendor PN 3
                                  </Form.Label>
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="vendorPN3"
                                    value={this.state.vendorPN3 || ""}
                                    className="txt-pn"
                                    style={{ height: "28px" }}
                                    readOnly
                                  />
                                </Col>
                                <Col
                                  lg={5}
                                  style={{ paddingLeft: "10px" }}
                                  className="gop-form-row"
                                >
                                  <Form.Control
                                    name="qcVendorPN3"
                                    className="txt-pn"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Vendor P/N3 QC Value here"
                                    value={this.state.qcVendorPNs.qcVendorPN3}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "qcVendorPN3",
                                        "Vendor PN"
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorName3Comments"
                                    className="txt-pn"
                                    placeholder="Enter Vendor Name3 QC Comments here"
                                    value={this.state.vendorName3Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    name="vendorPN3Comments"
                                    className="txt-pn"
                                    placeholder="Enter Vendor PN3 QC Comments here"
                                    value={this.state.vendorPN3Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="AddInfo">
                        <div className="gd-tab-edit-screen">
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head">
                              <Form.Label className="readGOPHead">
                                From Web
                              </Form.Label>
                            </Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                value={this.state.additionalInfoFromWeb || ""}
                                as="textarea"
                                rows={3}
                                readOnly
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head"></Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter Additional Info from Web QC Value here"
                                name="qcAdditionalInfoFromWeb"
                                value={this.state.qcAdditionalInfoFromWeb}
                                onChange={this.onChangeQCAdditionalInfo}
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head"></Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                style={{ height: "28px" }}
                                name="additionalInfoFromWebComments"
                                className="txt-pn"
                                placeholder="Enter Additional Info from web QC Comments here"
                                value={
                                  this.state.additionalInfoFromWebComments || ""
                                }
                                onChange={this.inputChangeHandler}
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head">
                              <Form.Label className="readGOPHead">
                                From Input
                              </Form.Label>
                            </Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                value={this.state.additionalInfoFromInput || ""}
                                as="textarea"
                                rows={3}
                                readOnly
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head"></Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter Additional Info from input QC Value here"
                                name="qcAdditionalInfoFromInput"
                                value={this.state.qcAdditionalInfoFromInput}
                                onChange={this.onChangeQCAdditionalInfo}
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head"></Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                style={{ height: "28px" }}
                                name="additionalInfoFromInputComments"
                                className="txt-pn"
                                placeholder="Enter Additional Info from input QC Comments here"
                                value={
                                  this.state.additionalInfoFromInputComments ||
                                  ""
                                }
                                onChange={this.inputChangeHandler}
                              />
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="UNSPSC">
                        <div className="gd-tab-edit-screen grid-min-height">
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    UNSPSC Code
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    readOnly
                                    type="tel"
                                    className="pro-input input-gray"
                                    name="unspscCode"
                                    value={this.state.unspscCode || ""}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    UNSPSC Category
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    readOnly
                                    type="text"
                                    className="pro-input input-gray"
                                    name="unspscCategory"
                                    value={this.state.unspscCategory || ""}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    UNSPSC Version
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    readOnly
                                    type="text"
                                    className="pro-input input-gray"
                                    name="unspscVersion"
                                    value={this.state.unspscVersion || ""}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    UNSPSCs from MRO Dictionary
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Select
                                    styles={helper.customStyles}
                                    options={UNSPSCMroDictOptions}
                                    value={selectedUNSPSCMroDictOption}
                                    onChange={this.handleChangeUNSPSCMroDict}
                                    isSearchable={true}
                                    onFocus={this.fetchUNSPSCMroDictOptionData}
                                    className="custom-select-div"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={2} className="btn-search">
                              <Button
                                varinat="primary"
                                className="saveEditScreenData mr-4"
                                onClick={this.assignUNSPSCMroDictCodeCategory}
                              >
                                Assign
                              </Button>
                            </Col>
                          </Row>
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    UNSPSCs of this NM
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Select
                                    styles={helper.customStyles}
                                    options={UNSPSCOptions}
                                    value={selectedUNSPSCOption}
                                    onChange={this.handleChangeUNSPSC}
                                    isSearchable={true}
                                    onFocus={this.fetchUNSPSCOptionData}
                                    className="custom-select-div"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={2} className="btn-search">
                              <Button
                                varinat="primary"
                                className="saveEditScreenData mr-4"
                                onClick={this.assignCodeCategory}
                              >
                                Assign
                              </Button>
                            </Col>
                          </Row>
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    QC UNSPSC Code
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="tel"
                                    className="pro-input input-gray"
                                    name="qcUNSPSCCode"
                                    value={this.state.qcUNSPSCCode}
                                    placeholder="Assign QC UNSPSC Code here"
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    QC UNSPSC Category
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input input-gray"
                                    name="qcUNSPSCCategory"
                                    value={this.state.qcUNSPSCCategory}
                                    placeholder="Assign QC UNSPSC Category here"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={2} className="btn-search">
                              <Button
                                varinat="primary"
                                className="saveEditScreenData mr-4"
                                onClick={this.toggleUnspscModal}
                              >
                                Search
                              </Button>
                              <Button
                                variant="primary"
                                className="saveEditScreenData float-end"
                                onClick={this.clearUNSPSCCodeCategory}
                              >
                                Clear
                              </Button>
                            </Col>
                          </Row>
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    QC UNSPSC Version
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input input-gray"
                                    name="qcUNSPSCVersion"
                                    value={this.state.qcUNSPSCVersion}
                                    placeholder="Assign QC UNSPSC Version here"
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-data-row">
                            <Col lg={1}></Col>
                            <Col lg={9}>
                              <Row className="edit-grid-row">
                                <Col lg={3} className="form-data-row"></Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    name="unspscComments"
                                    placeholder="Enter UNSPSC Version or Code or Category QC Comments here"
                                    value={this.state.unspscComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="WebRef">
                        <div className="gd-tab-edit-screen grid-min-height">
                          <Row>
                            <Col lg={1}></Col>
                            <Col lg={10}>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    URL 1
                                  </Form.Label>
                                </Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL1"
                                    value={this.state.webRefURL1 || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="qcWebRefURL1"
                                    placeholder="Enter URL1 QC Value here"
                                    value={this.state.qcWebRefURL1 || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL1Comments"
                                    placeholder="Enter URL1 QC Comments here"
                                    value={this.state.webRefURL1Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    URL 2
                                  </Form.Label>
                                </Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL2"
                                    value={this.state.webRefURL2 || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="qcWebRefURL2"
                                    placeholder="Enter URL2 QC Value here"
                                    value={this.state.qcWebRefURL2 || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL2Comments"
                                    placeholder="Enter URL2 QC Comments here"
                                    value={this.state.webRefURL2Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    URL 3
                                  </Form.Label>
                                </Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL3"
                                    value={this.state.webRefURL3 || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="qcWebRefURL3"
                                    placeholder="Enter URL3 QC Value here"
                                    value={this.state.qcWebRefURL3 || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL3Comments"
                                    placeholder="Enter URL3 QC Comments here"
                                    value={this.state.webRefURL3Comments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    PDF URL
                                  </Form.Label>
                                </Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="PdfURL"
                                    value={this.state.webRefPdfURL || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="qcWebRefPDFURL"
                                    placeholder="Enter PDF URL QC Value here"
                                    value={this.state.qcWebRefPDFURL || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefPDFURLComments"
                                    placeholder="Enter PDF URL QC Comments here"
                                    value={
                                      this.state.webRefPDFURLComments || ""
                                    }
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={1}></Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Remarks">
                        <div className="gd-tab-edit-screen">
                          <Form.Control
                            as="textarea"
                            rows={6}
                            name="remarks"
                            value={this.state.remarks || ""}
                            readOnly
                          />
                          <Form.Control
                            style={{ marginTop: "5px" }}
                            as="textarea"
                            rows={6}
                            name="qcRemarks"
                            placeholder="Enter QC Remarks here"
                            value={this.state.qcRemarks || ""}
                            onChange={this.inputChangeHandler}
                          />
                          <div>
                            <Form.Control
                              style={{ marginTop: "5px", height: "28px" }}
                              name="remarksComments"
                              className="txt-pn"
                              placeholder="Enter Remarks QC Comments here"
                              value={this.state.remarksComments || ""}
                              onChange={this.inputChangeHandler}
                            />
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Query">
                        <div className="gd-tab-edit-screen">
                          <Form.Control
                            as="textarea"
                            rows={12}
                            name="query"
                            value={this.state.query || ""}
                            readOnly
                          />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Application">
                        <div className="gd-tab-edit-screen">
                          <Row>
                            <Col lg={1}></Col>
                            <Col lg={10}>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    Value
                                  </Form.Label>
                                </Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="application"
                                    value={this.state.application || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={1}></Col>
                          </Row>
                          <Row>
                            <Col lg={1}></Col>
                            <Col lg={10}>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcApplication"
                                    placeholder="Enter application QC Value here"
                                    value={this.state.qcApplication || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={1}></Col>
                          </Row>
                          <Row>
                            <Col lg={1}></Col>
                            <Col lg={10}>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="applicationComments"
                                    placeholder="Enter application QC Comments here"
                                    value={this.state.applicationComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={1}></Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="OtherReferences">
                        <div className="gd-tab-edit-screen">
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    DWG:
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="dwg"
                                    value={this.state.dwg || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcDWG"
                                    style={{ height: "28px" }}
                                    placeholder="Enter DWG QC Value here"
                                    value={this.state.qcDWG || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="dwgComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter DWG QC Comments here"
                                    value={this.state.dwgComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    POS:
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="pos"
                                    value={this.state.pos || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcPOS"
                                    style={{ height: "28px" }}
                                    placeholder="Enter POS QC Value here"
                                    value={this.state.qcPOS || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="posComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter POS QC Comments here"
                                    value={this.state.posComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    ITEM NO:
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="itemNo"
                                    value={this.state.itemNo || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcItemNo"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Item No. QC Value here"
                                    value={this.state.qcItemNo || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="itemNoComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Item No. QC Comments here"
                                    value={this.state.itemNoComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    SERIAL NO:
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="serialNo"
                                    value={this.state.serialNo || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcSerialNo"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Serial No. QC Value here"
                                    value={this.state.qcSerialNo || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="serialNoComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Serial No. QC Comments here"
                                    value={this.state.serialNoComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    OTHER NUMBER:
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="otherNo"
                                    value={this.state.otherNo || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcOtherNo"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Other No. QC Value here"
                                    value={this.state.qcOtherNo || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="otherNoComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Other No. QC Comments here"
                                    value={this.state.otherNoComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    KKS Code
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="kksCode"
                                    value={this.state.kksCode || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcKKSCode"
                                    style={{ height: "28px" }}
                                    placeholder="Enter KKS Code QC Value here"
                                    value={this.state.qcKKSCode || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="kksCodeComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter KKS Code QC Comments here"
                                    value={this.state.kksCodeComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    Assembly/Part?
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="assemblyOrPart"
                                    value={this.state.assemblyOrPart || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <select
                                    className="form-control"
                                    style={{ height: "38px" }}
                                    name="qcAssemblyOrPart"
                                    value={this.state.qcAssemblyOrPart}
                                    onChange={this.onChangeAssemblyOrPart}
                                  >
                                    <option value="">--Select--</option>
                                    <option value="A">Assembly</option>
                                    <option value="P">Part</option>
                                  </select>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="assemblyOrPartComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Assembly or Part QC Comments here"
                                    value={
                                      this.state.assemblyOrPartComments || ""
                                    }
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    BOM
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="bom"
                                    value={this.state.bom || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="qcBOM"
                                    style={{ height: "28px" }}
                                    placeholder="Enter BOM QC Value here"
                                    value={this.state.qcBOM || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="bomComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter BOM QC Comments here"
                                    value={this.state.bomComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    Green Items (Yes / Not Applicable)
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="greenItems"
                                    value={this.state.greenItems || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <select
                                    className="form-control"
                                    style={{ height: "38px" }}
                                    name="qcGreenItems"
                                    value={this.state.qcGreenItems}
                                    onChange={this.onChangeGreenItems}
                                  >
                                    <option value="">--Select--</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">Not Applicable</option>
                                  </select>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <Row className="edit-grid-row">
                                <Col lg={2} className="form-data-row"></Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input"
                                    name="greenItemsComments"
                                    style={{ height: "28px" }}
                                    placeholder="Enter Green Items QC Comments here"
                                    value={this.state.greenItemsComments || ""}
                                    onChange={this.inputChangeHandler}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </Tab.Container>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end mg-t-5 mg-b-15 mg-r-20">
                <Button
                  varinat="primary"
                  className="saveEditScreenData float-end mr-4"
                  onClick={this.saveAllItemDetails}
                >
                  Save
                </Button>
                <Button
                  varinat="primary"
                  className="saveEditScreenData float-end"
                  onClick={closeEditModal}
                >
                  Close
                </Button>
              </div>
            </div>
          </LoadingOverlay>
        </div>
      </Modal>
    );
    //#endregion
  }
}

const mapStateToProps = (state) => ({
  data: state.productionsData,
});

export default withRouter(
  connect(mapStateToProps, { setNMUniqurVaue, rowDataPass })(GOPQCEditScreen)
);
