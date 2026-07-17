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
import QCFNMAttributeTable from "./QCFNMAttributeTable";
import QCFEditableDropdownGop from "./QCFEditableDropdownGop";
import qcTemplateService from "../../services/qcTemplate.service";
toast.configure();

class GOPProdItemEditWithQCRef extends Component {
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
      qcUser: "",
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
      nounModifierArray: [],
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
      showConfirm: false,
      retriveValue: false,
      IsItemEdited: false,
      showUnspscModal: false,
      showMroDictionaryViewerModal: false,
      MFRNameOptions: [],
      MFRPNOptions: [],
      qcMFRName1: "",
      mfrName1Comments: "",
      qcMFRName2: "",
      mfrName2Comments: "",
      qcMFRName3: "",
      mfrName3Comments: "",
      mfrNameDescription: "",
      mfrNames: {
        mfrName1: null,
        mfrName2: null,
        mfrName3: null,
      },
      qcMFRPN1: "",
      mfrPN1Comments: "",
      qcMFRPN2: "",
      mfrPN2Comments: "",
      qcMFRPN3: "",
      mfrPN3Comments: "",
      mfrPNDescription: "",
      mfrPNs: {
        mfrPN1: null,
        mfrPN2: null,
        mfrPN3: null,
      },
      VendorNameOptions: [],
      VendorPNOptions: [],
      qcVendorName1: "",
      vendorName1Comments: "",
      qcVendorName2: "",
      vendorName2Comments: "",
      qcVendorName3: "",
      vendorName3Comments: "",
      vendorNameDescription: "",
      vendorNames: {
        vendorName1: null,
        vendorName2: null,
        vendorName3: null,
      },
      qcVendorPN1: "",
      vendorPN1Comments: "",
      qcVendorPN2: "",
      vendorPN2Comments: "",
      qcVendorPN3: "",
      vendorPN3Comments: "",
      vendorPNDescription: "",
      vendorPNs: {
        vendorPN1: null,
        vendorPN2: null,
        vendorPN3: null,
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

    const selectedProdItemIDs = JSON.parse(
      sessionStorage.getItem("selectedProdItemIDs")
    );

    this.setState(
      {
        customerCode: selectedProdItemIDs.CustomerCode,
        projectCode: selectedProdItemIDs.ProjectCode,
        batchNo: selectedProdItemIDs.BatchNo,
        qcItemID: selectedProdItemIDs.QCItemID,
        productionItemID: selectedProdItemIDs.ProductionItemID,
        spinnerMessage:
          "Please wait while fetching QC Feedback Item Details...!",
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
          nounModifierArray: resp.data,
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

  //#region Fetching page setting
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

                var savedNounModifier = {};
                if (resp.data.Noun && resp.data.Modifier) {
                  savedNounModifier = {
                    value: resp.data.Noun + "_" + resp.data.Modifier,
                    label: resp.data.Noun + "_" + resp.data.Modifier,
                  };
                }

                let Status = "";
                if (resp.data.Status === "Pending") {
                  Status = "P";
                } else if (resp.data.Status === "Rejected") {
                  Status = "R";
                } else if (resp.data.Status === "Completed") {
                  Status = "C";
                }

                let Level = "";
                if (resp.data.Level === "Cleansed") {
                  Level = "C";
                } else if (resp.data.Level === "Enriched") {
                  Level = "E";
                } else if (resp.data.Level === "Exception") {
                  Level = "X";
                }

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

                //Production
                this.setState({
                  customerCode: resp.data.CustomerCode,
                  projectCode: resp.data.ProjectCode,
                  batchNo: resp.data.batchNo,
                  uniqueId: resp.data.UniqueID,
                  productionUser: resp.data.ProductionUser,
                  shortDescription: resp.data.ShortDescription,
                  longDescription: resp.data.LongDescription,
                  newShortDescription: resp.data.NewShortDescription,
                  newLongDescription: resp.data.NewLongDescription,
                  missingWords: resp.data.MissingWords,
                  noun: resp.data.Noun,
                  modifier: resp.data.Modifier,
                  selectedNounModifier: savedNounModifier,
                  uOM: resp.data.UOM,
                  mfrName: resp.data.MFRName,
                  mfrPN: resp.data.MFRPN,
                  vendorName: resp.data.VendorName,
                  vendorPN: resp.data.VendorPN,
                  selectedStatus: Status,
                  productionLevel: Level,
                  customColumnName1: resp.data.CustomColumnName1,
                  customColumnName1Value: resp.data.CustomColumnName1Value,
                  customColumnName2: resp.data.CustomColumnName2,
                  customColumnName2Value: resp.data.CustomColumnName2Value,
                  customColumnName3: resp.data.CustomColumnName3,
                  customColumnName3Value: resp.data.CustomColumnName3Value,
                  mfrNames: {
                    mfrName1: resp.data.MFRName1,
                    mfrName2: resp.data.MFRName2,
                    mfrName3: resp.data.MFRName3,
                  },
                  mfrPNs: {
                    mfrPN1: resp.data.MFRPN1,
                    mfrPN2: resp.data.MFRPN2,
                    mfrPN3: resp.data.MFRPN3,
                  },
                  vendorNames: {
                    vendorName1: resp.data.VendorName1,
                    vendorName2: resp.data.VendorName2,
                    vendorName3: resp.data.VendorName3,
                  },
                  vendorPNs: {
                    vendorPN1: resp.data.VendorPN1,
                    vendorPN2: resp.data.VendorPN2,
                    vendorPN3: resp.data.VendorPN3,
                  },
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
                  assemblyOrPart: AssemblyOrPart,
                  bom: resp.data.BOM,
                  greenItems: GreenItems,
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
            qcNoun: qcresp.data.Noun,
            qcModifier: qcresp.data.Modifier,
            nounModifierComments: qcresp.data.NounModifierComments,
            selectedQCStatus: qcresp.data.QCStatus,
            selectedQCLevel: qcresp.data.QCLevel,
            levelComments: qcresp.data.QCLevelComments,
            qcMFRName1: qcresp.data.MFRName1,
            qcMFRName2: qcresp.data.MFRName2,
            qcMFRName3: qcresp.data.MFRName3,
            qcMFRPN1: qcresp.data.MFRPN1,
            qcMFRPN2: qcresp.data.MFRPN2,
            qcMFRPN3: qcresp.data.MFRPN3,
            mfrName1Comments: qcresp.data.MFRName1Comments,
            mfrPN1Comments: qcresp.data.MFRPN1Comments,
            mfrName2Comments: qcresp.data.MFRName2Comments,
            mfrPN2Comments: qcresp.data.MFRPN2Comments,
            mfrName3Comments: qcresp.data.MFRName3Comments,
            mfrPN3Comments: qcresp.data.MFRPN3Comments,
            qcVendorName1: qcresp.data.VendorName1,
            qcVendorName2: qcresp.data.VendorName2,
            qcVendorName3: qcresp.data.VendorName3,
            qcVendorPN1: qcresp.data.VendorPN1,
            qcVendorPN2: qcresp.data.VendorPN2,
            qcVendorPN3: qcresp.data.VendorPN3,
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
            qcAssemblyOrPart: qcresp.data.AssemblyOrPart,
            assemblyOrPartComments: qcresp.data.AssemblyOrPartComments,
            qcBOM: qcresp.data.BOM,
            bomComments: qcresp.data.BOMComments,
            qcGreenItems: qcresp.data.GreenItems,
            greenItemsComments: qcresp.data.GreenItemsComments,
            qcUser: qcresp.data.QCUser,
            itemAttributes: qcresp.data.ItemAttributes,
          });

          this.adjustTextareaHeight();
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
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

  //#region Update the valuse of Noun & Modifier
  handleChangeNounModifier = (selectedNounModifier) => {
    let noun_Modifier = selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();
    this.setState({
      selectedNounModifier,
      noun: noun,
      modifier: modifier,
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
    let newShortDescription = this.state.noun + "," + this.state.modifier;
    let attributeValueString = "";
    let MFRNameString = "";
    let MFRName1 = this.state.mfrNames.mfrName1;
    let MFRName2 = this.state.mfrNames.mfrName2;
    let MFRName3 = this.state.mfrNames.mfrName3;
    let VendorNameString = "";
    let VendorName1 = this.state.vendorNames.vendorName1;
    let VendorName2 = this.state.vendorNames.vendorName2;
    let VendorName3 = this.state.vendorNames.vendorName3;
    let MFRPN1 = this.state.mfrPNs.mfrPN1;
    let MFRPN2 = this.state.mfrPNs.mfrPN2;
    let MFRPN3 = this.state.mfrPNs.mfrPN3;
    let VendorPN1 = this.state.vendorPNs.vendorPN1;
    let VendorPN2 = this.state.vendorPNs.vendorPN2;
    let VendorPN3 = this.state.vendorPNs.vendorPN3;
    let MFRPNString = "";
    let MFRNamePNString = "";
    let VendorPNString = "";
    let VendorNamePNString = "";
    let AdditionalInfoFromWeb = this.state.additionalInfoFromWeb;
    let AdditionalInfoFromInput = this.state.additionalInfoFromInput;
    let AdditionalInfoString = "";

    //#region Generate Attribute Name and Attribute Value string
    itemAttributes.forEach((item) => {
      if (attributeValueString) {
        if (item.AttributeValue && item.AttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeValueString +=
              "," + item.AttributeValue.trim().toUpperCase();
          else attributeValueString += "," + item.AttributeValue.trim();
        }
      } else {
        if (item.AttributeValue && item.AttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeValueString = item.AttributeValue.trim().toUpperCase();
          else attributeValueString = item.AttributeValue.trim();
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
    let newLongDescription = this.state.noun + "," + this.state.modifier;
    let attributeNameValueString = "";
    let MFRNameString = "";
    let MFRName1 = this.state.mfrNames.mfrName1;
    let MFRName2 = this.state.mfrNames.mfrName2;
    let MFRName3 = this.state.mfrNames.mfrName3;
    let VendorNameString = "";
    let VendorName1 = this.state.vendorNames.vendorName1;
    let VendorName2 = this.state.vendorNames.vendorName2;
    let VendorName3 = this.state.vendorNames.vendorName3;
    let MFRPN1 = this.state.mfrPNs.mfrPN1;
    let MFRPN2 = this.state.mfrPNs.mfrPN2;
    let MFRPN3 = this.state.mfrPNs.mfrPN3;
    let VendorPN1 = this.state.vendorPNs.vendorPN1;
    let VendorPN2 = this.state.vendorPNs.vendorPN2;
    let VendorPN3 = this.state.vendorPNs.vendorPN3;
    let MFRPNString = "";
    let MFRNamePNString = "";
    let MFRNamePrefix = "";
    let MFRPNPrefix = "";
    let VendorPNString = "";
    let VendorNamePNString = "";
    let VendorNamePrefix = "";
    let VendorPNPrefix = "";
    let AdditionalInfoFromWeb = this.state.additionalInfoFromWeb;
    let AdditionalInfoFromInput = this.state.additionalInfoFromInput;
    let AdditionalInfoString = "";
    let AdditionalInfoPrefix = "";

    //#region Generate Attribute Name and Attribute Value string
    itemAttributes.forEach((item) => {
      if (attributeNameValueString) {
        if (item.AttributeValue && item.AttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeNameValueString +=
              "," +
              item.AttributeName +
              ":" +
              item.AttributeValue.trim().toUpperCase();
          else
            attributeNameValueString +=
              "," + item.AttributeName + ":" + item.AttributeValue.trim();
        }
      } else {
        if (item.AttributeValue && item.AttributeValue.length > 0) {
          if (projectSetting.IsToConvertAttributeValueToUppercase)
            attributeNameValueString =
              item.AttributeName +
              ":" +
              item.AttributeValue.trim().toUpperCase();
          else
            attributeNameValueString =
              item.AttributeName + ":" + item.AttributeValue.trim();
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
        this.state.noun,
        this.state.modifier
      )
      .then((resp) => {
        if (resp.data.length !== 0) {
          let NMAttributes = [];
          if (retrieveOption) {
            const attributeValueMap = {};
            this.state.itemAttributes.forEach((item) => {
              attributeValueMap[item.AttributeName] = item.AttributeValue;
            });

            resp.data.forEach((item) => {
              if (attributeValueMap.hasOwnProperty(item.AttributeName)) {
                item.AttributeValue = attributeValueMap[item.AttributeName];
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

  //#region table cell onchange function
  getValueToPass = (selectedValue) => {
    let newItemAttributes = this.state.itemAttributes;
    newItemAttributes.forEach((item) => {
      if (item.AttributeName === selectedValue.name) {
        item.AttributeValue = selectedValue.value;
      }
    });

    this.setState(
      {
        ...this.state,
        itemAttributes: newItemAttributes,
        IsItemEdited: true,
        loading: false,
      },
      () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
    );
  };
  //#endregion

  //#region Change Status
  onChangeStatus = (e) => {
    this.setState({
      IsItemEdited: true,
      selectedStatus: e.target.value,
    });
  };

  selectLevel = (value) => {
    this.setState({
      IsItemEdited: true,
      productionLevel: value,
    });
  };
  //#endregion

  //#region Functions For Newshort and newLong Description
  fetchInputShortValues = (inputs) => {
    let shortDescription = "";
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].selectedValue) {
        if (shortDescription) {
          shortDescription = shortDescription + "," + inputs[i].selectedValue;
        } else {
          shortDescription = inputs[i].selectedValue;
        }
      }
    }
    return shortDescription;
  };
  //#endregion

  //#region function for newlongdescription
  fetchInputLongValues = (inputs) => {
    let longDescription = "";
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].selectedValue) {
        if (longDescription) {
          longDescription =
            longDescription +
            "," +
            inputs[i].selectId +
            ":" +
            inputs[i].selectedValue;
        } else {
          longDescription = inputs[i].selectId + ":" + inputs[i].selectedValue;
        }
      }
    }
    return longDescription;
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

  getAllSelectedLShortValues = (selectedOptions) => {
    const result = Object.entries(selectedOptions).map(([key, value]) => ({
      selectId: key,
      selectedValue: value,
    }));
    let manufactureData = this.fetchInputShortValues(result);
    return manufactureData;
  };
  //#endregion

  //#region MFR Function
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
          mfrNames: {
            ...prevState.mfrNames,
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
      this.setState((prevState) => ({
        [selectId]: e.target.value,
        mfrPNs: {
          ...prevState.mfrPNs,
          [selectId]: optionValue,
        },
        IsItemEdited: true,
      }));
    }
  };
  //#endregion

  //#region MFR Function
  handleVendorChange = (selectedOption, selectId, type) => {
    let optionValue = null;
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
          vendorNames: {
            ...prevState.vendorNames,
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
          vendorPNs: {
            ...prevState.vendorPNs,
            [selectId]: optionValue,
          },
          IsItemEdited: true,
        }),
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
    }
  };
  //#endregion

  //#region Additional Info
  onChangeAdditionalInfo = (e) => {
    let enteredValue = "";
    if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
      enteredValue = e.target.value.toUpperCase();
    } else {
      enteredValue = e.target.value.toLowerCase();
    }

    if (e.target.name === "additionalInfoFromWeb") {
      this.setState(
        {
          additionalInfoFromWeb: enteredValue,
          IsItemEdited: true,
        },
        () => this.generateNewShortAndLongDescriptionAndFindMissingWords()
      );
      return;
    }

    this.setState(
      {
        additionalInfoFromInput: enteredValue,
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
          unspscCode: unspscCode,
          unspscCategory: unspscCategory,
          unspscVersion: unspscVersion,
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
          unspscCode: unspscCode,
          unspscCategory: unspscCategory,
          unspscVersion: unspscVersion,
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
          noun: value[0],
          modifier: value[1],
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
      unspscCode: "",
      unspscCategory: "",
      unspscVersion: "",
      IsItemEdited: true,
    }));
  };
  //#endregion

  //#region Unspsc Modal Toggle
  toggleUnspscModal = (value) => {
    if (value && value.length !== 0) {
      this.setState({
        ...this.state,
        unspscCode: value[0],
        unspscCategory: value[1],
        IsItemEdited: true,
      });
    }
    this.setState({ showUnspscModal: !this.state.showUnspscModal });
  };
  //#endregion

  //#region MRO Dictionary Viewer Modal Toggle
  toggleMroDictionaryViewerModal = (
    value = [this.state.noun, this.state.modifier]
  ) => {
    if (value && value.length === 2) {
      this.setState({
        noun: value[0],
        modifier: value[1],
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

  //#region Save GOP Screen Data
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
      this.removeSpecialCharacters(this.state.mfrNames.mfrPN1),
      this.removeSpecialCharacters(this.state.mfrNames.mfrPN2),
      this.removeSpecialCharacters(this.state.mfrNames.mfrpn3),
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
      this.removeSpecialCharacters(this.state.vendorPNs.vendorPN1),
      this.removeSpecialCharacters(this.state.vendorPNs.vendorPN2),
      this.removeSpecialCharacters(this.state.vendorPNs.vendorPN3),
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
      ProductionItemID: this.state.productionItemID,
      UniqueID: this.state.uniqueId,
      ShortDescription: this.state.shortDescription,
      LongDescription: this.state.longDescription,
      UOM: this.state.uOM,
      NewShortDescription: this.state.newShortDescription,
      NewLongDescription: this.state.newLongDescription,
      MissingWords: this.state.missingWords,
      MFRName: this.state.mfrName,
      MFRPN: this.state.mfrPN,
      VendorName: this.state.vendorName,
      VendorPN: this.state.vendorPN,
      Status: this.state.selectedStatus,
      Level: this.state.productionLevel,
      MFRName1: this.state.mfrNames.mfrName1,
      MFRPN1: this.state.mfrPNs.mfrPN1,
      MFRName2: this.state.mfrNames.mfrName2,
      MFRPN2: this.state.mfrPNs.mfrPN2,
      MFRName3: this.state.mfrNames.mfrName3,
      MFRPN3: this.state.mfrPNs.mfrPN3,
      VendorName1: this.state.vendorNames.vendorName1,
      VendorPN1: this.state.vendorPNs.vendorPN1,
      VendorName2: this.state.vendorNames.vendorName2,
      VendorPN2: this.state.vendorPNs.vendorPN2,
      VendorName3: this.state.vendorNames.vendorName3,
      VendorPN3: this.state.vendorPNs.vendorPN3,
      AdditionalInfo: this.state.additionalInfoFromInput,
      AdditionalInfoFromWeb: this.state.additionalInfoFromWeb,
      UNSPSCCode: this.state.unspscCode,
      UNSPSCCategory: this.state.unspscCategory,
      UNSPSCVersion: this.state.unspscVersion,
      ProductionUser: helper.getUser(),
      WebRefURL1: this.state.webRefURL1,
      WebRefURL2: this.state.webRefURL2,
      WebRefURL3: this.state.webRefURL3,
      PDFURL: this.state.webRefPdfURL,
      Remarks: this.state.remarks,
      Query: this.state.query,
      Application: this.state.application,
      DWG: this.state.dwg,
      POS: this.state.pos,
      ItemNo: this.state.itemNo,
      SerialNo: this.state.serialNo,
      OtherNo: this.state.otherNo,
      KKSCode: this.state.kksCode,
      AssemblyOrPart: this.state.assemblyOrPart,
      BOM: this.state.bom,
      GreenItems: this.state.greenItems,
      UserID: helper.getUser(),
    };

    if (Object.keys(this.state.selectedNounModifier).length !== 0) {
      let noun_Modifier = this.state.selectedNounModifier.label.split("_");
      data.Noun = noun_Modifier[0].trim();
      data.Modifier = noun_Modifier[1].trim();
      data.itemAttributes = this.state.itemAttributes;
    }

    productionTemplate
      .productionItemUpdate(data)
      .then(() => {
        this.setState({ IsItemEdited: false });
        toast.success("QC Feedback Item Edited details Saved Successfully...!");
      })
      .catch((error) => {
        this.setState({ loading: false });
        toast.error(error.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region hide save confirm modal
  hideConfirmModal = () => {
    this.setState({ showConfirm: !this.state.showConfirm });
  };
  //#endregion

  //#region Select All textbox value
  handleInputClick = (refName) => () => {
    if (this.inputRefs[refName].current) {
      this.inputRefs[refName].current.select();
    }
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
      sessionStorage.removeItem("selectedProdItemIDs");
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
                            {this.state.batchNo ? this.state.batchNo : " N / A"}
                          </h6>
                        </div>
                      </Col>
                      <Col className="ref-right-div col-md-2">
                        <div className="page-header-sections-new">
                          <h6 className="reference-head">
                            QC User: {this.state.qcUser}
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
                      <Col lg={5} style={setHeight(100)}>
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
                                style={{ marginLeft: "5px", width: "120px" }}
                                onClick={this.toggleMroDictionaryViewerModal}
                              >
                                View Dictionary
                              </Button>
                            </div>
                          </Col>
                          <Col lg={3} className="form-data-row">
                            <Form.Control
                              className="txt-pn"
                              value={
                                this.state.qcNoun +
                                " / " +
                                this.state.qcModifier
                              }
                              style={{
                                marginLeft: "15px",
                                width: "120px",
                                height: "28px",
                              }}
                              readOnly
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={3}>
                        <Row>
                          <Col lg={1} className="form-data-row">
                            <Form.Label
                              className="readGOPHead"
                              style={{
                                marginLeft: "25px",
                              }}
                            >
                              Status
                            </Form.Label>
                          </Col>
                          <Col lg={7}>
                            <select
                              className="form-control"
                              style={{
                                marginLeft: "25px",
                                width: "100px",
                                height: "28px",
                              }}
                              name="Status"
                              value={this.state.selectedStatus}
                              onChange={this.onChangeStatus}
                            >
                              <option key="In Process" value="In Process">
                                {" "}
                                In Process{" "}
                              </option>
                              <option key="Completed" value="Completed">
                                {" "}
                                Completed{" "}
                              </option>
                              <option key="Query" value="Query">
                                {" "}
                                Query{" "}
                              </option>
                            </select>
                          </Col>
                          <Col lg={3} className="form-data-row">
                            <Form.Control
                              name="mfrPN1"
                              className="txt-pn"
                              value={this.state.selectedQCStatus}
                              style={{ width: "100px", height: "28px" }}
                              readOnly
                            />
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
                                Level
                              </label>
                              <div
                                className="pro-select"
                                style={setHeight(100)}
                              >
                                <Form.Check
                                  inline
                                  label="Cleansed"
                                  name="group20"
                                  type="radio"
                                  checked={this.state.productionLevel === "C"}
                                  onChange={() => this.selectLevel("C")}
                                  id={`inline-radio-1`}
                                />
                                <Form.Check
                                  inline
                                  label="Enriched"
                                  name="group20"
                                  type="radio"
                                  checked={this.state.productionLevel === "E"}
                                  onChange={() => this.selectLevel("E")}
                                  id={`inline-radio-2`}
                                />
                                <Form.Check
                                  inline
                                  label="Exception"
                                  name="group20"
                                  type="radio"
                                  checked={this.state.productionLevel === "X"}
                                  onChange={() => this.selectLevel("X")}
                                  id={`inline-radio-3`}
                                />
                              </div>
                            </div>
                          </Col>
                          <Col lg={3} className="form-data-row">
                            <div className="pro-select" style={setHeight(100)}>
                              <Form.Control
                                name="qcLevel"
                                className="txt-pn"
                                value={this.state.selectedQCLevel}
                                style={{ width: "90px", height: "28px" }}
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
                      style={{ marginTop: "5px", height: "28px", color: "red" }}
                      name="nounModifierComments"
                      value={this.state.nounModifierComments || ""}
                      readOnly
                    />
                  </Col>
                  <Col lg={5} style={{ paddingLeft: "5px", ...setHeight(100) }}>
                    <Form.Control
                      style={{
                        width: "540px",
                        marginTop: "5px",
                        height: "28px",
                        color: "red",
                      }}
                      name="levelComments"
                      value={this.state.levelComments}
                      readOnly
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
                              <QCFNMAttributeTable
                                itemAttributes={itemAttributes}
                                selectedNounModifier={
                                  this.state.selectedNounModifier
                                }
                                getValueToPass={this.getValueToPass}
                                projectSettings={this.state.projectSetting}
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
                                  <QCFEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.mfrNames.mfrName1}
                                    Inputs="mfrName1"
                                    Types="MFR Name"
                                    optionDataType="MFRName"
                                    handleVendorChange={this.handleMFRChange}
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    className="txt-pn"
                                    name="qcMFRName1"
                                    value={this.state.qcMFRName1 || ""}
                                    readOnly
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
                                    className="txt-pn"
                                    style={{
                                      marginTop: "5px",
                                      height: "28px",
                                    }}
                                    placeholder="Enter MFR P/N1 value here"
                                    value={this.state.mfrPNs.mfrPN1}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "mfrPN1",
                                        "MFR PN"
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcMFRPN1"
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    value={this.state.qcMFRPN1 || ""}
                                    readOnly
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
                                    style={{ height: "28px", color: "red" }}
                                    name="mfrName1Comments"
                                    className="txt-pn"
                                    value={this.state.mfrName1Comments || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    name="mfrPN1Comments"
                                    className="txt-pn"
                                    value={this.state.mfrPN1Comments || ""}
                                    readOnly
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
                                  <QCFEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.mfrNames.mfrName2}
                                    Inputs="mfrName2"
                                    Types="MFR Name"
                                    optionDataType="MFRName"
                                    handleVendorChange={this.handleMFRChange}
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcMFRName2"
                                    value={this.state.qcMFRName2 || ""}
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    placeholder="Enter MFR P/N2 value here"
                                    value={this.state.mfrPNs.mfrPN2}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "mfrPN2",
                                        "MFR PN"
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcMFRPN2"
                                    value={this.state.qcMFRPN2 || ""}
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    style={{ height: "28px", color: "red" }}
                                    name="mfrName2Comments"
                                    className="txt-pn"
                                    value={this.state.mfrName2Comments || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    name="mfrPN2Comments"
                                    className="txt-pn"
                                    value={this.state.mfrPN2Comments || ""}
                                    readOnly
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
                                  <QCFEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.mfrNames.mfrName3}
                                    Inputs="mfrName3"
                                    Types="MFR Name"
                                    optionDataType="MFRName"
                                    handleVendorChange={this.handleMFRChange}
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcMFRName3"
                                    className="txt-pn"
                                    value={this.state.qcMFRName3 || ""}
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    name="mfrPN3"
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    placeholder="Enter MFR P/N3 QC Value here"
                                    value={this.state.mfrPNs.mfrPN3}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "mfrPN3",
                                        "MFR PN"
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcMFRPN3"
                                    value={this.state.qcMFRPN3 || ""}
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    style={{ height: "28px", color: "red" }}
                                    name="mfrName3Comments"
                                    className="txt-pn"
                                    value={this.state.mfrName3Comments || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    name="mfrPN3Comments"
                                    className="txt-pn"
                                    value={this.state.mfrPN3Comments || ""}
                                    readOnly
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
                                  <QCFEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.vendorNames.vendorName1
                                    }
                                    Inputs="vendorName1"
                                    Types="Vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    className="txt-pn"
                                    name="qcVendorName1"
                                    value={this.state.qcVendorName1 || ""}
                                    readOnly
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
                                    className="txt-pn"
                                    style={{
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    placeholder="Enter Vendor P/N1 QC Value here"
                                    value={this.state.vendorPNs.vendorPN1}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "vendorPN1",
                                        "Vendor PN"
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcVendorPN1"
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    value={this.state.qcVendorPN1 || ""}
                                    readOnly
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
                                    style={{ height: "28px", color: "red" }}
                                    name="vendorName1Comments"
                                    className="txt-pn"
                                    value={this.state.vendorName1Comments || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    name="vendorPN1Comments"
                                    className="txt-pn"
                                    value={this.state.vendorPN1Comments || ""}
                                    readOnly
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
                                  <QCFEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.vendorNames.vendorName2
                                    }
                                    Inputs="vendorName2"
                                    Types="Vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcVendorName2"
                                    value={this.state.qcVendorName2 || ""}
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    placeholder="Enter Vendor P/N2 value here"
                                    value={this.state.vendorPNs.vendorPN2}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "vendorPN2",
                                        "Vendor PN"
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcVendorPN2"
                                    value={this.state.qcVendorPN2 || ""}
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    style={{ height: "28px", color: "red" }}
                                    name="vendorName2Comments"
                                    className="txt-pn"
                                    value={this.state.vendorName2Comments || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    name="vendorPN2Comments"
                                    className="txt-pn"
                                    value={this.state.vendorPN2Comments || ""}
                                    readOnly
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
                                  <QCFEditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={
                                      this.state.vendorNames.vendorName3
                                    }
                                    Inputs="vendorName3"
                                    Types="Vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcVendorName3"
                                    className="txt-pn"
                                    value={this.state.qcVendorName3 || ""}
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    className="txt-pn"
                                    style={{ marginTop: "5px", height: "28px" }}
                                    placeholder="Enter Vendor P/N3 QC Value here"
                                    value={this.state.vendorPNs.vendorPN3}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "vendorPN3",
                                        "Vendor PN"
                                      )
                                    }
                                  />
                                </Col>
                                <Col lg={5} className="gop-form-row">
                                  <Form.Control
                                    name="qcVendorPN3"
                                    value={this.state.qcVendorPN3 || ""}
                                    className="txt-pn"
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "5px",
                                      height: "28px",
                                      width: "190px",
                                    }}
                                    readOnly
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
                                    style={{ height: "28px", color: "red" }}
                                    name="vendorName3Comments"
                                    className="txt-pn"
                                    value={this.state.vendorName3Comments || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-row-head"></Col>
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    name="vendorPN3Comments"
                                    className="txt-pn"
                                    value={this.state.vendorPN3Comments || ""}
                                    readOnly
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
                                as="textarea"
                                rows={3}
                                placeholder="Enter Additional Info from Web Value here"
                                name="additionalInfoFromWeb"
                                value={this.state.additionalInfoFromWeb || ""}
                                onChange={this.onChangeAdditionalInfo}
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head"></Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                name="qcAdditionalInfoFromWeb"
                                value={this.state.qcAdditionalInfoFromWeb || ""}
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
                                style={{ height: "28px", color: "red" }}
                                name="additionalInfoFromWebComments"
                                className="txt-pn"
                                value={
                                  this.state.additionalInfoFromWebComments || ""
                                }
                                readOnly
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
                                as="textarea"
                                rows={3}
                                placeholder="Enter Additional Info from input Value here"
                                name="additionalInfoFromInput"
                                value={this.state.additionalInfoFromInput}
                                onChange={this.onChangeAdditionalInfo}
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row pb-2">
                            <Col lg={1} className="gop-row-head"></Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                name="qcAdditionalInfoFromInput"
                                value={
                                  this.state.qcAdditionalInfoFromInput || ""
                                }
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
                                style={{ height: "28px", color: "red" }}
                                name="additionalInfoFromInputComments"
                                className="txt-pn"
                                value={
                                  this.state.additionalInfoFromInputComments ||
                                  ""
                                }
                                readOnly
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
                                    placeholder="Assign UNSPSC Code here"
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
                                    placeholder="Assign UNSPSC Category here"
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
                                    UNSPSC Version
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input input-gray"
                                    name="unspscVersion"
                                    value={this.state.unspscVersion || ""}
                                    placeholder="Assign UNSPSC Version here"
                                    readOnly
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
                                    QC UNSPSC Version
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    type="text"
                                    className="pro-input input-gray"
                                    name="qcUNSPSCVersion"
                                    value={this.state.qcUNSPSCVersion}
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
                                    style={{ color: "red" }}
                                    value={this.state.unspscComments || ""}
                                    readOnly
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
                                    placeholder="Enter URL1 Value here"
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
                                    name="qcWebRefURL1"
                                    value={this.state.qcWebRefURL1 || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL1Comments"
                                    value={this.state.webRefURL1Comments || ""}
                                    readOnly
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
                                    placeholder="Enter URL2 Value here"
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
                                    name="qcWebRefURL2"
                                    value={this.state.qcWebRefURL2 || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL2Comments"
                                    value={this.state.webRefURL2Comments || ""}
                                    readOnly
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
                                    placeholder="Enter URL3 Value here"
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
                                    name="qcWebRefURL3"
                                    value={this.state.qcWebRefURL3 || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL3Comments"
                                    value={this.state.webRefURL3Comments || ""}
                                    readOnly
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
                                    name="webRefPdfURL"
                                    value={this.state.webRefPdfURL || ""}
                                    placeholder="Enter PDF URL QC Value here"
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
                                    name="qcWebRefPDFURL"
                                    value={this.state.qcWebRefPDFURL || ""}
                                    readOnly
                                  />
                                </Col>
                              </Row>
                              <Row className="edit-grid-row">
                                <Col lg={1} className="form-data-row"></Col>
                                <Col lg={11} style={{ padding: "0" }}>
                                  <Form.Control
                                    style={{ height: "28px", color: "red" }}
                                    type="text"
                                    className="pro-input"
                                    name="webRefPDFURLComments"
                                    value={
                                      this.state.webRefPDFURLComments || ""
                                    }
                                    readOnly
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
                            placeholder="Enter Remarks here"
                            onChange={this.inputChangeHandler}
                          />
                          <Form.Control
                            style={{ marginTop: "5px" }}
                            as="textarea"
                            rows={6}
                            name="qcRemarks"
                            value={this.state.qcRemarks || ""}
                            readOnly
                          />
                          <div>
                            <Form.Control
                              style={{
                                marginTop: "5px",
                                height: "28px",
                                color: "red",
                              }}
                              name="remarksComments"
                              className="txt-pn"
                              value={this.state.remarksComments || ""}
                              readOnly
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
                            placeholder="Enter Query here"
                            onChange={this.inputChangeHandler}
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
                                    placeholder="Enter application Value here"
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
                                    name="qcApplication"
                                    value={this.state.qcApplication || ""}
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
                                    style={{ color: "red" }}
                                    name="applicationComments"
                                    value={this.state.applicationComments || ""}
                                    readOnly
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
                                    placeholder="Enter DWG Value here"
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
                                    name="qcDWG"
                                    style={{ height: "28px" }}
                                    value={this.state.qcDWG || ""}
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
                                    name="dwgComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.dwgComments || ""}
                                    readOnly
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
                                    placeholder="Enter POS Value here"
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
                                    name="qcPOS"
                                    style={{ height: "28px" }}
                                    value={this.state.qcPOS || ""}
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
                                    name="posComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.posComments || ""}
                                    readOnly
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
                                    placeholder="Enter Item No. Value here"
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
                                    name="qcItemNo"
                                    style={{ height: "28px" }}
                                    value={this.state.qcItemNo || ""}
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
                                    name="itemNoComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.itemNoComments || ""}
                                    readOnly
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
                                    placeholder="Enter Serial No. Value here"
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
                                    name="qcSerialNo"
                                    style={{ height: "28px" }}
                                    value={this.state.qcSerialNo || ""}
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
                                    name="serialNoComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.serialNoComments || ""}
                                    readOnly
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
                                    placeholder="Enter Other No. Value here"
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
                                    name="qcOtherNo"
                                    style={{ height: "28px" }}
                                    value={this.state.qcOtherNo || ""}
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
                                    name="otherNoComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.otherNoComments || ""}
                                    readOnly
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
                                    placeholder="Enter KKS Code Value here"
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
                                    name="qcKKSCode"
                                    style={{ height: "28px" }}
                                    value={this.state.qcKKSCode || ""}
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
                                    name="kksCodeComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.kksCodeComments || ""}
                                    readOnly
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
                                  <select
                                    className="form-control"
                                    style={{ height: "38px" }}
                                    name="assemblyOrPart"
                                    value={this.state.assemblyOrPart}
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
                                    name="qcAssemblyOrPart"
                                    value={this.state.qcAssemblyOrPart || ""}
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
                                    name="assemblyOrPartComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={
                                      this.state.assemblyOrPartComments || ""
                                    }
                                    readOnly
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
                                    placeholder="Enter BOM Value here"
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
                                    name="qcBOM"
                                    style={{ height: "28px" }}
                                    value={this.state.qcBOM || ""}
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
                                    name="bomComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.bomComments || ""}
                                    readOnly
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
                                  <select
                                    className="form-control"
                                    style={{ height: "38px" }}
                                    name="greenItems"
                                    value={this.state.greenItems}
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
                                    name="qcGreenItems"
                                    value={this.state.qcGreenItems || ""}
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
                                    name="greenItemsComments"
                                    style={{ height: "28px", color: "red" }}
                                    value={this.state.greenItemsComments || ""}
                                    readOnly
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
  connect(mapStateToProps, { setNMUniqurVaue, rowDataPass })(
    GOPProdItemEditWithQCRef
  )
);
