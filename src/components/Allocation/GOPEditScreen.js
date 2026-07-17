import React, { Component, createRef } from "react";
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
import NMAttributeTable from "./NMAttributeTable";
import EditableDropdownGop from "./EditableDropdownGop";
import GOPPreviewScreen from "./GOPPreviewScreen";
toast.configure();

class GOPEditScreen extends Component {
  //#region constructor
  constructor(props) {
    super(props);
    this.inputRefs = {
      refMFRName1: createRef(),
      refMFRPN1: createRef(),
      refMFRName2: createRef(),
      refMFRPN2: createRef(),
      refMFRName3: createRef(),
      refMFRPN3: createRef(),
      refVendorName1: createRef(),
      refVendorPN1: createRef(),
      refVendorName2: createRef(),
      refVendorPN2: createRef(),
      refVendorName3: createRef(),
      refVendorPN3: createRef(),
      refAddInfo: createRef(),
      refAddWebInfo: createRef(),
      refUNSPSCCode: createRef(),
      refUNSPSCCategory: createRef(),
      refUNSPSCVersion: createRef(),
      refWebURL1: createRef(),
      refWebURL2: createRef(),
      refWebURL3: createRef(),
      refWebPdfURL3: createRef(),
      refRemarks: createRef(),
      refQuery: createRef(),
      refApplication: createRef(),
      refDWG: createRef(),
      refPOS: createRef(),
      refITEMNO: createRef(),
      refSerialNo: createRef(),
      refOtherNumber: createRef(),
      refKksCode: createRef(),
      refBOM: createRef(),
    };

    this.state = {
      productionItemID: "",
      nextProductionItemID: "",
      previousProductionItemID: "",
      updateId: "",
      activeTabKey: "NMAttribute",
      selectedData: "",
      aggridData: [],
      customerCode: "",
      projectCode: "",
      uniqueId: "",
      batchNo: "",
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
      allResponseData: {
        Noun: "",
        Modifier: "",
      },
      selectedStatus: "",
      selectedLevel: "E",
      additionalInfo: "",
      additionalInfoFromWeb: "",
      addWebInputInfo: "",
      addPosRef: "",
      unspscCode: "",
      unspscCategory: "",
      unspscVersion: "",
      webRefURL1: "",
      webRefURL2: "",
      webRefURL3: "",
      webRefPdfURL: "",
      remarks: "",
      query: "",
      application: "",
      addOtherReferences: "",
      dwg: "",
      pos: "",
      itemNo: "",
      serialNo: "",
      otherNo: "",
      kksCode: "",
      assemblyOrPart: "",
      bom: "",
      greenItems: "",

      itemAttributes: [],
      projectSetting: {},
      userID: "",
      showConfirm: false,
      retriveValue: false,
      IsItemEdited: false,
      showUnspscModal: false,
      showMroDictionaryViewerModal: false,
      attributeShort: "",
      attributeLong: "",
      navigateBack: false,
      NMAttributeOptions: [],
      MFRNameOptions: [],
      MFRPNOptions: [],
      mfrName1: null,
      mfrName2: null,
      mfrName3: null,
      mfrNameDescription: "",
      MFRNames: {
        mfrName1: null,
        mfrName2: null,
        mfrName3: null,
      },
      mfrPN1: null,
      mfrPN2: null,
      mfrPN3: null,
      mfrPNDescription: "",
      MFRPNs: {
        mfrPN1: null,
        mfrPN2: null,
        mfrPN3: null,
      },
      VendorNameOptions: [],
      VendorPNOptions: [],
      vendorName1: null,
      vendorName2: null,
      vendorName3: null,
      vendorNameDescription: "",
      vendorsNames: {
        vendorName1: null,
        vendorName2: null,
        vendorName3: null,
      },
      vendorPN1: null,
      vendorPN2: null,
      vendorPN3: null,
      vendorPNDescription: "",
      vendorsPN: {
        vendorPN1: null,
        vendorPN2: null,
        vendorPN3: null,
      },
      UNSPSCOptions: [],
      UNSPSCMroDictOptions: [],
      selectedUNSPSCOption: {},
      selectedUNSPSCMroDictOption: {},
      previewModal: false,
    };
    this.gridRef = React.createRef();
    this.textareaRef1 = React.createRef();
    this.textareaRef2 = React.createRef();
    this.textareaRef3 = React.createRef();
    this.textareaRef4 = React.createRef();
    this.textareaRef5 = React.createRef();
  }
  //#endregion

  handleCopyLongDesc = () => {
    const inputElement = this.textareaRef2.current;
    inputElement.select();

    document.execCommand("copy");
  };

  handleCopyShortDesc = () => {
    const inputElement = this.textareaRef1.current;
    inputElement.select();

    document.execCommand("copy");
  };

  handleCopyNewShortDesc = () => {
    const inputElement = this.textareaRef3.current;
    inputElement.select();

    document.execCommand("copy");
  };

  handleCopyNewLongDesc = () => {
    const inputElement = this.textareaRef4.current;
    inputElement.select();

    document.execCommand("copy");
  };

  handleCopyMissingWords = () => {
    const inputElement = this.textareaRef5.current;
    inputElement.select();

    document.execCommand("copy");
  };

  //#region When the page load
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }
    this.setState({ userName: helper.getUser() });
    this.fetchDynamicAGGrid();
    this.fetchNounModifierDetails();
    this.fetchProjectSettings();
  }
  //#endregion

  //#region Display navigate to previous page
  goBackNavigation = () => {
    if (this.state.IsItemEdited) {
      this.setState({
        showConfirm: !this.state.showConfirm,
        navigateBack: true,
      });
      return;
    }
    sessionStorage.removeItem("ProdItemData");
    this.props.history.push({
      pathname: "/Allocation/ProductionUpdateList",
    });
  };
  //#endregion

  //#region Fetching ProductionUpdateList Data
  fetchDynamicAGGrid() {
    const state = JSON.parse(sessionStorage.getItem("ProdItemData"));
    if (state) {
      this.setState((prevState) => ({
        ...prevState,
        spinnerMessage: "Please wait while fetching GOP Screens Details...!",
        loading: true,
      }));
      this.fetchGOPScreenDetails(state?.ProductionItemID);
      this.setState((prevState) => ({ ...prevState, aggridData: state }));
    } else {
      this.props.hideEdiModal();
    }
  }
  //#endregion

  //#region Fetching page setting
  fetchProjectSettings = () => {
    const state = JSON.parse(sessionStorage.getItem("ProdItemData"));
    if (!state) {
      this.props.hideEdiModal();
      return;
    }
    projectService
      .readProjectSettings(state?.CustomerCode, state?.ProjectCode)
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
        console.log(e);
      });
  };
  //#endregion

  //#region fetching all the value in input fields
  fetchGOPScreenDetails(ProductionItemID) {
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
          const state = JSON.parse(sessionStorage.getItem("ProdItemData"));
          let editScreen = {
            CustomerCode: state?.CustomerCode,
            ProjectCode: state?.ProjectCode,
            batchNo: state?.batchNo,
            ProductionItemID: resp.data.ProductionItemID,
            NextProductionItemID: resp.data.NextProductionItemID,
            AllocationId: state?.AllocationId,
            productionUser: helper.getUser(),
            PreviousProductionItemID: resp.data.PreviousProductionItemID,
          };

          sessionStorage.setItem("ProdItemData", JSON.stringify(editScreen));

          let modifiers = [];
          const formattedString = [];
          if (resp.data.ItemAttributes) {
            resp.data.ItemAttributes.forEach((item) => {
              if (
                item.AttributeValue !== "" &&
                item.AttributeValue !== undefined
              ) {
                if (
                  this.state.projectSetting.IsToConvertAttributeValueToUppercase
                ) {
                  modifiers.push(item.AttributeValue.toUpperCase());
                } else {
                  modifiers.push(item.AttributeValue);
                }
              }
            });

            resp.data.ItemAttributes.forEach((item) => {
              if (item.AttributeValue) {
                if (
                  this.state.projectSetting.IsToConvertAttributeValueToUppercase
                ) {
                  formattedString.push(
                    `${item.AttributeName}:${item.AttributeValue.toUpperCase()}`
                  );
                } else {
                  formattedString.push(
                    `${item.AttributeName}:${item.AttributeValue}`
                  );
                }
              }
            });
          }

          let attributeShort = "";
          let attributeLong = "";
          if (resp.data.Noun && resp.data.Modifier) {
            attributeShort =
              resp.data.Noun +
              "," +
              resp.data.Modifier +
              ": " +
              modifiers.join(", ");
            attributeLong =
              resp.data.Noun +
              "," +
              resp.data.Modifier +
              ": " +
              formattedString.join(", ");
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

          this.setState({
            attributeShort: attributeShort,
            attributeLong: attributeLong,
            productionItemID: resp.data.ProductionItemID,
            nextProductionItemID: resp.data.NextProductionItemID,
            previousProductionItemID: resp.data.PreviousProductionItemID,
            customerCode: state?.CustomerCode,
            projectCode: state?.ProjectCode,
            batchNo: state?.batchNo,
            uniqueId: resp.data.UniqueID,
            shortDescription: resp.data.ShortDescription,
            longDescription: resp.data.LongDescription,
            uOM: resp.data.UOM,
            newShortDescription: resp.data.NewShortDescription,
            newLongDescription: resp.data.NewLongDescription,
            missingWords: resp.data.MissingWords,
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
            selectedLevel: Level,
            mfrName1: { label: resp.data.MFRName1, value: resp.data.MFRName1 },
            mfrPN1: { label: resp.data.MFRPN1, value: resp.data.MFRPN1 },
            mfrName2: { label: resp.data.MFRName2, value: resp.data.MFRName2 },
            mfrPN2: { label: resp.data.MFRPN2, value: resp.data.MFRPN2 },
            mfrName3: { label: resp.data.MFRName3, value: resp.data.MFRName3 },
            mfrPN3: { label: resp.data.MFRPN3, value: resp.data.MFRPN3 },
            mfrNameDescription: `${
              resp.data.MFRName1 && resp.data.MFRName1 + ","
            }${resp.data.MFRName2 && resp.data.MFRName2 + ","}${
              resp.data.MFRName3 && resp.data.MFRName3
            }`,
            mfrPNDescription: `${resp.data.MFRPN1 && resp.data.MFRPN1 + ","}${
              resp.data.MFRPN2 && resp.data.MFRPN2 + ","
            }${resp.data.MFRPN3 && resp.data.MFRPN3}`,
            MFRNames: {
              mfrName1: resp.data.MFRName1,
              mfrName2: resp.data.MFRName2,
              mfrName3: resp.data.MFRName3,
            },
            MFRPNs: {
              mfrPN1: resp.data.MFRPN1,
              mfrPN2: resp.data.MFRPN2,
              mfrPN3: resp.data.MFRPN3,
            },
            vendorName1: {
              label: resp.data.VendorName1,
              value: resp.data.VendorName1,
            },
            vendorPN1: {
              label: resp.data.VendorPN1,
              value: resp.data.VendorPN1,
            },
            vendorName2: {
              label: resp.data.VendorName2,
              value: resp.data.VendorName2,
            },
            vendorPN2: {
              label: resp.data.VendorPN2,
              value: resp.data.VendorPN2,
            },
            vendorName3: {
              label: resp.data.VendorName3,
              value: resp.data.VendorName3,
            },
            vendorPN3: {
              label: resp.data.VendorPN3,
              value: resp.data.VendorPN3,
            },
            vendorNameDescription: `${
              resp.data.VendorName1 && resp.data.VendorName1 + ","
            }${resp.data.VendorName2 && resp.data.VendorName2 + ","}${
              resp.data.VendorName3 && resp.data.VendorName3
            }`,
            vendorPNDescription: `${
              resp.data.VendorPN1 && resp.data.VendorPN1 + ","
            }${resp.data.VendorPN2 && resp.data.VendorPN2 + ","}${
              resp.data.VendorPN3 && resp.data.VendorPN3
            }`,
            vendorsNames: {
              vendorName1: resp.data.VendorName1,
              vendorName2: resp.data.VendorName2,
              vendorName3: resp.data.VendorName3,
            },
            vendorsPN: {
              vendorPN1: resp.data.VendorPN1,
              vendorPN2: resp.data.VendorPN2,
              vendorPN3: resp.data.VendorPN3,
            },
            additionalInfo: resp.data.AdditionalInfo,
            additionalInfoFromWeb: resp.data.AdditionalInfoFromWeb,
            addWebInputInfo: `${
              (resp.data.AdditionalInfoFromWeb || resp.data.AdditionalInfo) &&
              resp.data.AdditionalInfoFromWeb + "," + resp.data.AdditionalInfo
            }`,
            addOtherReferences: `${
              (resp.data.DWG ||
                resp.data.POS ||
                resp.data.ItemNo ||
                resp.data.SerialNo ||
                resp.data.OtherNo ||
                resp.data.KKSCode ||
                resp.data.AssemblyOrPart ||
                resp.data.BOM ||
                resp.data.GreenItems) &&
              resp.data.DWG +
                "," +
                resp.data.POS +
                "," +
                resp.data.ItemNo +
                "," +
                resp.data.SerialNo +
                "," +
                resp.data.OtherNo +
                "," +
                resp.data.KKSCode +
                "," +
                resp.data.AssemblyOrPart +
                "," +
                resp.data.BOM +
                "," +
                resp.data.GreenItems
            }`,
            unspscCode: resp.data.UNSPSCCode,
            unspscCategory: resp.data.UNSPSCCategory,
            unspscVersion: resp.data.UNSPSCVersion,
            webRefURL1: resp.data.WebRefURL1,
            webRefURL2: resp.data.WebRefURL2,
            webRefURL3: resp.data.WebRefURL3,
            webRefPdfURL: resp.data.PDFURL,
            unspscVerion: resp.data.UNSPSCVersion,
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
            itemAttributes: resp.data.ItemAttributes,
            userID: resp.data.UserID,
            selectedNounModifier: savedNounModifier,
            allResponseData: resp.data,
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
  //#endregion

  //#region Selecting Tabs
  handleTabSelect = (tabKey) => {
    this.setState({ activeTabKey: tabKey });
  };
  //#endregion

  //#region Function For finding missing words
  findMissingWords = (compareDescription, outPutControlValues) => {
    let words1 = compareDescription
      .split(/[,:;&+$|\s- ]+/)
      .filter((word) => word.length > 0);
    let words2 = outPutControlValues
      .split(/[,:;&+$|\s- ]+/)
      .filter((word) => word.length > 0);

    const word1LowerCase = words1.map((word) => word.toLowerCase());
    const word2LowerCase = words2.map((word) => word.toLowerCase());

    const missingWords1 = word1LowerCase.filter(
      (word) => !word2LowerCase.includes(word)
    );
    const uniqueWords = new Set();
    const filteredWords = missingWords1.filter((word) => {
      if (!uniqueWords.has(word)) {
        uniqueWords.add(word);
        return true;
      }
      return false;
    });

    const missingWordsOriginalCase = filteredWords.map((word, index) => {
      const originalWord = words1.find(
        (original) => original.toLowerCase() === word
      );
      return originalWord || words2[index];
    });
    return missingWordsOriginalCase;
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

  //#region fetching Noun & Modifier List
  fetchNounModifierDetails = () => {
    const state = JSON.parse(sessionStorage.getItem("ProdItemData"));

    if (!state) {
      this.setState({
        spinnerMessage: "State not found. Please check your session data.",
        loading: false,
      });
      this.props.hideEdiModal();
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while fetching Noun & Modifier List...!",
      loading: true,
    });

    productionTemplate
      .getNounModifierList(state.CustomerCode, state.ProjectCode)
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

  //#region Update the valuse of Noun & Modifier
  handleChangeNounModifier = (
    selectedNounModifier,
    selectedUNSPSCOption,
    selectedUNSPSCMroDictOption
  ) => {
    console.log(selectedNounModifier);
    this.setState({
      selectedNounModifier,
      selectedUNSPSCOption: {},
      selectedUNSPSCMroDictOption: {},
      unspscCode: "",
      unspscCategory: "",
      unspscVersion: "",
    });
    let noun_Modifier = selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();
    if (
      noun === this.state.allResponseData.Noun &&
      modifier === this.state.allResponseData.Modifier
    ) {
      this.NMAttributeValues(selectedNounModifier);
      return;
    }
    if (!this.state.selectedNounModifier?.label) {
      this.NMAttributeValues(selectedNounModifier);
      return;
    }
    this.setState({ retriveValue: true });
  };

  NMAttributeValues = (selectedNounModifier, retriveOption) => {
    let noun_Modifier = selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();

    if (!this.state.allResponseData) {
      this.setState({
        attributeShort: noun + "," + modifier + ":",
        attributeLong: noun + "," + modifier + ":",
        IsItemEdited: true,
      });
      this.fetchAttributeList(noun, modifier, retriveOption);
    } else {
      if (
        noun === this.state.allResponseData.Noun &&
        modifier === this.state.allResponseData.Modifier
      ) {
        const state = JSON.parse(sessionStorage.getItem("ProdItemData"));
        if (state) {
          this.setState({ retriveValue: false });
          this.fetchGOPScreenDetails(state?.ProductionItemID);
        }
      } else {
        this.setState({
          attributeShort: noun + "," + modifier + ": ",
          attributeLong: noun + "," + modifier + ": ",
          IsItemEdited: true,
          retriveValue: false,
        });

        this.fetchAttributeList(noun, modifier, retriveOption);
      }
    }
  };

  RetriveNMValues = () => {
    let retriveOption = true;
    this.NMAttributeValues(this.state.selectedNounModifier, retriveOption);
  };

  hideRetriveValue = () => {
    let retriveOption = false;
    this.NMAttributeValues(this.state.selectedNounModifier, retriveOption);
  };
  //#endregion

  //#region Generating newShortDescription
  generateNewShortDescription = (
    NMAtributes,
    additionalInfo,
    MFRName,
    MFRPN,
    VendorName,
    VendorPN
  ) => {
    let projectSetting = this.state.projectSetting;
    let addInfo = "";
    const array1 = MFRName.split(",").filter((part) => part);
    const array2 = MFRPN.split(",").filter((part) => part);
    let combinedArray = "";
    if (
      projectSetting.IsToIncludeMFRNameInShortDesc &&
      !projectSetting.IsToIncludeMFRPNInShortDesc &&
      array1.length !== 0
    ) {
      const combinedArrayData = array1.map((element) => `${element}`);
      combinedArray = combinedArrayData.join(", ");
    } else if (
      !projectSetting.IsToIncludeMFRNameInShortDesc &&
      projectSetting.IsToIncludeMFRPNInShortDesc &&
      array2.length !== 0
    ) {
      const combinedArrayData = array2.map((element) => `${element}`);
      combinedArray = combinedArrayData.join(", ");
    } else if (
      projectSetting.IsToIncludeMFRNameInShortDesc &&
      projectSetting.IsToIncludeMFRPNInShortDesc &&
      (array1.length !== 0 || array2.length !== 0)
    ) {
      if (array1.length === 0) {
        const combinedArrayData = array2.map((element) => `${element}`);
        combinedArray = combinedArrayData.join(", ");
      } else {
        const combinedArrayData = array1.map(
          (element, index) =>
            `${element}:${array2[index] !== undefined ? array2[index] : ""}`
        );
        combinedArray = combinedArrayData.join(", ");
      }
    }

    if (projectSetting.IsToIncludeAdditionalInfoInShortDesc) {
      addInfo = additionalInfo;
    }

    const arrayVendor1 = VendorName.split(",").filter((part) => part);
    const arrayVendor2 = VendorPN.split(",").filter((part) => part);
    let combinedVendorArray = "";
    if (
      projectSetting.IsToIncludeVendorNameInShortDesc &&
      !projectSetting.IsToIncludeVendorPNInShortDesc &&
      arrayVendor1.length !== 0
    ) {
      const combinedArrayData = arrayVendor1.map((element) => `${element}`);
      combinedVendorArray = combinedArrayData.join(", ");
    } else if (
      !projectSetting.IsToIncludeVendorNameInShortDesc &&
      projectSetting.IsToIncludeVendorPNInShortDesc &&
      arrayVendor2.length !== 0
    ) {
      const combinedArrayData = arrayVendor2.map((element) => `${element}`);
      combinedVendorArray = combinedArrayData.join(", ");
    } else if (
      projectSetting.IsToIncludeVendorNameInShortDesc &&
      projectSetting.IsToIncludeVendorPNInShortDesc &&
      (arrayVendor1.length !== 0 || arrayVendor2.length !== 0)
    ) {
      if (arrayVendor1.length === 0) {
        const combinedArrayData = arrayVendor2.map((element) => `${element}`);
        combinedVendorArray = combinedArrayData.join(", ");
      } else {
        const combinedArrayData = arrayVendor1.map(
          (element, index) =>
            `${element}:${
              arrayVendor2[index] !== undefined ? arrayVendor2[index] : ""
            }`
        );
        combinedVendorArray = combinedArrayData.join(", ");
      }
    }
    let newShortValue = "";
    if (
      NMAtributes ||
      combinedArray.length !== 0 ||
      combinedVendorArray.length !== 0
    ) {
      newShortValue =
        NMAtributes +
        "," +
        addInfo +
        "," +
        combinedArray +
        "," +
        combinedVendorArray;
    }
    return newShortValue;
  };
  //#endregion

  //#region Generating newLongDescription
  generateNewLongDescription = (
    NMAtributes,
    additionalInfo,
    MFRName,
    MFRPN,
    VendorName,
    VendorPN,
    Application,
    ...otherRefs
  ) => {
    let projectSetting = this.state.projectSetting;
    let addInfo = "";
    let valuesArray = [];

    const array1 = MFRName.split(",").filter((part) => part);
    const array2 = MFRPN.split(",").filter((part) => part);
    let combinedArray = [];
    if (projectSetting.IsToIncludeMFRNameInLongDesc) {
      combinedArray.push(
        ...array1.map((el) => `${projectSetting.MFRNamePrefix}${el}`)
      );
    }
    if (projectSetting.IsToIncludeMFRPNInLongDesc) {
      combinedArray.push(
        ...array2.map((el) => `${projectSetting.MFRPNPrefix}${el}`)
      );
    }

    const arrayVendor1 = VendorName.split(",").filter((part) => part);
    const arrayVendor2 = VendorPN.split(",").filter((part) => part);
    let combinedVendorArray = [];

    if (projectSetting.IsToIncludeVendorNameInLongDesc) {
      combinedVendorArray.push(
        ...arrayVendor1.map((el) => `${projectSetting.VendorNamePrefix}${el}`)
      );
    }
    if (projectSetting.IsToIncludeVendorPNInLongDesc) {
      combinedVendorArray.push(
        ...arrayVendor2.map((el) => `${projectSetting.VendorPNPrefix}${el}`)
      );
    }

    if (projectSetting.IsToIncludeAdditionalInfoInLongDesc && additionalInfo) {
      addInfo = `${projectSetting.AdditionalInfoPrefix}${additionalInfo}`;
      valuesArray.push(addInfo);
    }

    if (NMAtributes) valuesArray.push(NMAtributes);
    if (combinedArray.length) valuesArray.push(combinedArray.join(", "));
    if (combinedVendorArray.length)
      valuesArray.push(combinedVendorArray.join(", "));
    if (Application) valuesArray.push(`Application: ${Application}`);

    otherRefs.forEach((ref, index) => {
      if (ref && ref.trim() !== "") {
        valuesArray.push(ref.trim());
      }
    });

    let newLongValue = valuesArray.join(", ").replace(/,+/g, ",").trim();
    return newLongValue;
  };
  //#endregion

  //#region Generating newShortDescription
  concatinateAllValuesForMissingWords = (
    NMAtributes,
    additionalInfo,
    MFRName,
    MFRPN,
    VendorName,
    VendorPN,
    Application,
    addOtherReferences
  ) => {
    let projectSetting = this.state.projectSetting;
    let addInfo = "";
    let mfrName = "";
    let mfrPN = "";
    let vendorName = "";
    let vendorPN = "";
    if (projectSetting.IsToIncludeAdditionalInfoInLongDesc) {
      if (additionalInfo && additionalInfo !== ",") {
        addInfo = additionalInfo;
      }
    }
    if (projectSetting.IsToIncludeMFRNameInLongDesc) {
      if (MFRName) {
        mfrName = MFRName;
      }
    }
    if (projectSetting.IsToIncludeMFRPNInLongDesc) {
      if (MFRPN) {
        mfrPN = MFRPN;
      }
    }
    if (projectSetting.IsToIncludeVendorNameInLongDesc) {
      if (VendorName) {
        vendorName = VendorName;
      }
    }
    if (projectSetting.IsToIncludeVendorPNInLongDesc) {
      if (VendorPN) {
        vendorPN = VendorPN;
      }
    }
    let newFindValue = "";
    if (
      NMAtributes ||
      addInfo ||
      mfrName ||
      mfrPN ||
      vendorName ||
      vendorPN ||
      Application ||
      addOtherReferences
    ) {
      newFindValue =
        NMAtributes +
        "," +
        addInfo +
        "," +
        mfrName +
        "," +
        mfrPN +
        "," +
        vendorName +
        "," +
        vendorPN +
        "," +
        Application +
        "," +
        addOtherReferences;
    }
    return newFindValue;
  };
  //#endregion

  //#region Fetch Attribute List by Noun & Modifier
  fetchAttributeList(noun, modifier, retriveOption) {
    productionTemplate
      .getNounModifierAttributeList(
        this.state.customerCode,
        this.state.projectCode,
        noun,
        modifier
      )
      .then((resp) => {
        if (resp.data.length !== 0) {
          let NMAttributes = [];
          if (retriveOption) {
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

          let modifiers = [];
          NMAttributes.forEach((item) => {
            if (
              item.AttributeValue !== "" &&
              item.AttributeValue !== undefined
            ) {
              if (
                this.state.projectSetting.IsToConvertAttributeValueToUppercase
              ) {
                modifiers.push(item.AttributeValue.toUpperCase());
              } else {
                modifiers.push(item.AttributeValue);
              }
            }
          });

          const formattedString = [];
          NMAttributes.forEach((item) => {
            if (item.AttributeValue) {
              if (
                this.state.projectSetting.IsToConvertAttributeValueToUppercase
              ) {
                formattedString.push(
                  `${item.AttributeName}:${item.AttributeValue.toUpperCase()}`
                );
              } else {
                formattedString.push(
                  `${item.AttributeName}:${item.AttributeValue}`
                );
              }
            }
          });

          let shortAttributeValue = `${noun},${modifier}: ${modifiers.join(
            ", "
          )}`;
          let newShortDescription = this.generateNewShortDescription(
            shortAttributeValue,
            this.state.addWebInputInfo,
            this.state.mfrNameDescription,
            this.state.mfrPNDescription,
            this.state.vendorNameDescription,
            this.state.vendorPNDescription
          );
          let trimmedShortString = newShortDescription.replace(/^,|,$/g, "");
          let normalizedShortString = trimmedShortString.replace(/,+/g, ",");

          let longAttributeValue = `${noun},${modifier}:${" "}${formattedString.join(
            ", "
          )}`;
          let newLongDescription = this.generateNewLongDescription(
            longAttributeValue,
            this.state.addWebInputInfo,
            this.state.mfrNameDescription,
            this.state.mfrPNDescription,
            this.state.vendorNameDescription,
            this.state.vendorPNDescription,
            this.state.application,
            this.state.addOtherReferences
          );
          let trimmedLongString = newLongDescription.replace(/^,|,$/g, "");
          let normalizedLongString = trimmedLongString.replace(/,+/g, ",");

          let missingValueDescription =
            this.concatinateAllValuesForMissingWords(
              longAttributeValue,
              this.state.addWebInputInfo,
              this.state.mfrNameDescription,
              this.state.mfrPNDescription,
              this.state.vendorNameDescription,
              this.state.vendorPNDescription,
              this.state.application,
              this.state.addOtherReferences
            );
          let trimmedMissingString = missingValueDescription.replace(
            /^,|,$/g,
            ""
          );
          let normalizedMissingString = trimmedMissingString.replace(
            /,+/g,
            ","
          );

          let compareDescription = "";
          compareDescription =
            this.state.longDescription + " " + this.state.shortDescription;
          let missingWords = this.findMissingWords(
            compareDescription,
            normalizedMissingString
          );

          this.setState({
            newShortDescription: normalizedShortString,
            newLongDescription: normalizedLongString,
            itemAttributes: NMAttributes,
            missingWords: missingWords.join(","),
            loading: false,
          });
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

    let modifiers = [];
    newItemAttributes.forEach((item) => {
      if (item.AttributeValue !== "" && item.AttributeValue !== undefined) {
        if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
          modifiers.push(item.AttributeValue.toUpperCase());
        } else {
          modifiers.push(item.AttributeValue);
        }
      }
    });

    const formattedString = [];
    newItemAttributes.forEach((item) => {
      if (item.AttributeValue) {
        if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
          formattedString.push(
            `${item.AttributeName}:${item.AttributeValue.toUpperCase()}`
          );
        } else {
          formattedString.push(`${item.AttributeName}:${item.AttributeValue}`);
        }
      }
    });
    let noun;
    let modifier;
    if (this.state.selectedNounModifier) {
      let noun_Modifier = this.state.selectedNounModifier.label.split("_");
      noun = noun_Modifier[0].trim();
      modifier = noun_Modifier[1].trim();
    }

    let shortAttributeValue = `${noun},${modifier}: ${modifiers.join(", ")}`;
    let newShortDescription = this.generateNewShortDescription(
      shortAttributeValue,
      this.state.addWebInputInfo,
      this.state.mfrNameDescription,
      this.state.mfrPNDescription,
      this.state.vendorNameDescription,
      this.state.vendorPNDescription
    );
    let trimmedShortString = newShortDescription.replace(/^,|,$/g, "");
    let normalizedShortString = trimmedShortString.replace(/,+/g, ",");

    let longAttributeValue = `${noun},${modifier}:${" "}${formattedString.join(
      ", "
    )}`;
    let newLongDescription = this.generateNewLongDescription(
      longAttributeValue,
      this.state.addWebInputInfo,
      this.state.mfrNameDescription,
      this.state.mfrPNDescription,
      this.state.vendorNameDescription,
      this.state.vendorPNDescription,
      this.state.application,
      this.state.addOtherReferences
    );
    let trimmedLongString = newLongDescription.replace(/^,|,$/g, "");
    let normalizedLongString = trimmedLongString.replace(/,+/g, ",");

    let missingValueDescription = this.concatinateAllValuesForMissingWords(
      longAttributeValue,
      this.state.addWebInputInfo,
      this.state.mfrNameDescription,
      this.state.mfrPNDescription,
      this.state.vendorNameDescription,
      this.state.vendorPNDescription,
      this.state.application,
      this.state.addOtherReferences
    );
    let trimmedMissingString = missingValueDescription.replace(/^,|,$/g, "");
    let normalizedMissingString = trimmedMissingString.replace(/,+/g, ",");

    let compareDescription =
      this.state.longDescription + " " + this.state.shortDescription;
    let missingWords = this.findMissingWords(
      compareDescription,
      normalizedMissingString
    );

    this.setState({
      ...this.state,
      itemAttributes: newItemAttributes,
      newShortDescription: normalizedShortString,
      attributeShort: noun + "," + modifier + ": " + modifiers.join(", "),
      newLongDescription: normalizedLongString,
      attributeLong: noun + "," + modifier + ": " + formattedString.join(", "),
      missingWords: missingWords.join(","),
      IsItemEdited: true,
      loading: false,
    });
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
      selectedLevel: value,
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

  isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (!inputValue) return false;
    return (
      selectOptions.findIndex((option) => option.label === inputValue) === -1
    );
  };

  getOptionLabel = (option) => {
    return option.label;
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
    let selectedOptions = {};
    let MFRValue = "";
    if (type === "MFR Name") {
      selectedOptions = {
        ...this.state.MFRNames,
        [selectId]: optionValue,
      };
      MFRValue = this.getAllSelectedLShortValues(selectedOptions);
      this.setState((prevState) => ({
        [selectId]: selectedOption,
        MFRNames: {
          ...prevState.MFRNames,
          [selectId]: optionValue,
        },
        mfrNameDescription: MFRValue,
        IsItemEdited: true,
      }));
    }
    this.includeMFRNewShort(MFRValue, type);
    this.includeMFRNewlong(MFRValue, type);
  };

  handleMFRBlur = (inputId, selectId, type) => {
    const inputRef = this.inputRefs[inputId];
    if (inputRef.current) {
      let inputValue = null;
      if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
        inputValue = inputRef.current.inputRef.value.toUpperCase();
      } else {
        inputValue = inputRef.current.inputRef.value.toLowerCase();
      }
      if (inputValue) {
        const newOption = { label: inputValue, value: inputValue };

        let selectedOptions = {};
        let MFRValue = "";
        if (type === "MFR Name") {
          selectedOptions = {
            ...this.state.MFRNames,
            [selectId]: inputValue,
          };
          MFRValue = this.getAllSelectedLShortValues(selectedOptions);
          this.setState((prevState) => ({
            [selectId]: newOption,
            MFRNames: {
              ...prevState.MFRNames,
              [selectId]: inputValue,
            },
            mfrNameDescription: MFRValue,
            IsItemEdited: true,
          }));
        }
        this.includeMFRNewShort(MFRValue, type);
        this.includeMFRNewlong(MFRValue, type);
      }
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

    let selectedOptions = {};
    let MFRValue = "";
    if (type === "MFR PN") {
      selectedOptions = {
        ...this.state.MFRPNs,
        [selectId]: optionValue,
      };
      MFRValue = this.getAllSelectedLShortValues(selectedOptions);
      this.setState((prevState) => ({
        [selectId]: e.target.value,
        MFRPNs: {
          ...prevState.MFRPNs,
          [selectId]: optionValue,
        },
        mfrPNDescription: MFRValue,
        IsItemEdited: true,
      }));
    }
    this.includeMFRNewShort(MFRValue, type);
    this.includeMFRNewlong(MFRValue, type);
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
    let selectedOptions = {};
    let vendorValue = "";
    if (type === "vendor Name") {
      selectedOptions = {
        ...this.state.vendorsNames,
        [selectId]: optionValue,
      };
      vendorValue = this.getAllSelectedLShortValues(selectedOptions);
      this.setState((prevState) => ({
        [selectId]: selectedOption,
        vendorsNames: {
          ...prevState.vendorsNames,
          [selectId]: optionValue,
        },
        vendorNameDescription: vendorValue,
        IsItemEdited: true,
      }));
    }
    this.includeNewShortVendor(vendorValue, type);
    this.includeNewlongVendor(vendorValue, type);
  };

  handleVendorBlur = (inputId, selectId, type) => {
    const inputRef = this.inputRefs[inputId];
    if (inputRef.current) {
      let inputValue = null;
      if (this.state.projectSetting.IsToConvertAttributeValueToUppercase) {
        inputValue = inputRef.current.inputRef.value.toUpperCase();
      } else {
        inputValue = inputRef.current.inputRef.value.toLowerCase();
      }
      if (inputValue) {
        const newOption = { label: inputValue, value: inputValue };

        let selectedOptions = {};
        let vendorValue = "";
        if (type === "vendor Name") {
          selectedOptions = {
            ...this.state.vendorsNames,
            [selectId]: inputValue,
          };
          vendorValue = this.getAllSelectedLShortValues(selectedOptions);

          this.setState((prevState) => ({
            [selectId]: newOption,
            vendorsNames: {
              ...prevState.vendorsNames,
              [selectId]: inputValue,
            },
            vendorNameDescription: vendorValue,
            IsItemEdited: true,
          }));
        }
        this.includeNewShortVendor(vendorValue, type);
        this.includeNewlongVendor(vendorValue, type);
      }
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
    let selectedOptions = {};
    let vendorValue = "";
    if (type === "vendor PN") {
      selectedOptions = {
        ...this.state.vendorsPN,
        [selectId]: optionValue,
      };
      vendorValue = this.getAllSelectedLShortValues(selectedOptions);
      this.setState((prevState) => ({
        [selectId]: e.target.value,
        vendorsPN: {
          ...prevState.vendorsPN,
          [selectId]: optionValue,
        },
        vendorPNDescription: vendorValue,
        IsItemEdited: true,
      }));
    }
    this.includeNewShortVendor(vendorValue, type);
    this.includeNewlongVendor(vendorValue, type);
  };
  //#endregion

  //#region Include new Short function for manufacture value
  includeMFRNewShort = (MFRValue, type) => {
    let MFRNameValue = "";
    let MFRPNValue = "";

    let newShortValue = "";
    if (type === "MFR Name") {
      MFRNameValue = MFRValue;
      MFRPNValue = this.state.mfrPNDescription;
      newShortValue = this.generateNewShortDescription(
        this.state.attributeShort,
        this.state.addWebInputInfo,
        MFRNameValue,
        MFRPNValue,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription
      );
    } else if (type === "MFR PN") {
      MFRNameValue = this.state.mfrNameDescription;
      MFRPNValue = MFRValue;
      newShortValue = this.generateNewShortDescription(
        this.state.attributeShort,
        this.state.addWebInputInfo,
        MFRNameValue,
        MFRPNValue,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription
      );
    }

    let trimmedString = newShortValue.replace(/^,|,$/g, "");
    let normalizedString = trimmedString.replace(/,+/g, ",");

    if (normalizedString.charAt(0) === ",") {
      normalizedString = normalizedString.slice(1);
    }

    if (normalizedString.charAt(normalizedString.length - 1) === ",") {
      normalizedString = normalizedString.slice(0, -1);
    }
    this.setState({
      newShortDescription: normalizedString,
      IsItemEdited: true,
    });
  };
  //#endregion

  //#region Include new Long function for manufacture value
  includeMFRNewlong = (MFRValue, type) => {
    let MFRNameValue = "";
    let MFRPNValue = "";

    let newLongValue = "";
    let missingValueDescription = "";
    if (type === "MFR Name") {
      MFRNameValue = MFRValue;
      MFRPNValue = this.state.mfrPNDescription;
      newLongValue = this.generateNewLongDescription(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        MFRNameValue,
        MFRPNValue,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription,
        this.state.application,
        this.state.addOtherReferences
      );
      missingValueDescription = this.concatinateAllValuesForMissingWords(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        MFRNameValue,
        MFRPNValue,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription,
        this.state.application,
        this.state.addOtherReferences
      );
    } else if (type === "MFR PN") {
      MFRNameValue = this.state.mfrNameDescription;
      MFRPNValue = MFRValue;
      newLongValue = this.generateNewLongDescription(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        MFRNameValue,
        MFRPNValue,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription,
        this.state.application,
        this.state.addOtherReferences
      );
      missingValueDescription = this.concatinateAllValuesForMissingWords(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        MFRNameValue,
        MFRPNValue,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription,
        this.state.application,
        this.state.addOtherReferences
      );
    }

    let trimmedString = newLongValue.replace(/^,|,$/g, "");
    let normalizedString = trimmedString.replace(/,+/g, ",");

    let trimmedMissingString = missingValueDescription.replace(/^,|,$/g, "");
    let normalizedMissingString = trimmedMissingString.replace(/,+/g, ",");

    let compareDescription =
      this.state.longDescription + " " + this.state.shortDescription;

    let missingWords = this.findMissingWords(
      compareDescription,
      normalizedMissingString
    );
    if (normalizedString.charAt(0) === ",") {
      normalizedString = normalizedString.slice(1);
    }

    if (normalizedString.charAt(normalizedString.length - 1) === ",") {
      normalizedString = normalizedString.slice(0, -1);
    }
    this.setState({
      newLongDescription: normalizedString,
      missingWords: missingWords.join(","),
      IsItemEdited: true,
    });
  };
  //#endregion

  //#region Include new Short function for Vendor value
  includeNewShortVendor = (vendorValue, type) => {
    let VendorNameValue = "";
    let VendorPNValue = "";

    let newShortValue = "";
    if (type === "vendor Name") {
      VendorNameValue = vendorValue;
      VendorPNValue = this.state.vendorPNDescription;
      newShortValue = this.generateNewShortDescription(
        this.state.attributeShort,
        this.state.addWebInputInfo,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        VendorNameValue,
        VendorPNValue
      );
    } else if (type === "vendor PN") {
      VendorNameValue = this.state.vendorNameDescription;
      VendorPNValue = vendorValue;
      newShortValue = this.generateNewShortDescription(
        this.state.attributeShort,
        this.state.addWebInputInfo,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        VendorNameValue,
        VendorPNValue
      );
    }

    let trimmedString = newShortValue.replace(/^,|,$/g, "");
    let normalizedString = trimmedString.replace(/,+/g, ",");
    if (normalizedString.charAt(0) === ",") {
      normalizedString = normalizedString.slice(1);
    }

    if (normalizedString.charAt(normalizedString.length - 1) === ",") {
      normalizedString = normalizedString.slice(0, -1);
    }
    this.setState({
      newShortDescription: normalizedString,
      IsItemEdited: true,
    });
  };
  //#endregion

  //#region Include new Long function for Vendor value
  includeNewlongVendor = (vendorValue, type) => {
    let VendorNameValue = "";
    let VendorPNValue = "";

    let newLongValue = "";
    let missingValueDescription = "";
    if (type === "vendor Name") {
      VendorNameValue = vendorValue;
      VendorPNValue = this.state.vendorPNDescription;
      newLongValue = this.generateNewLongDescription(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        VendorNameValue,
        VendorPNValue,
        this.state.application,
        this.state.addOtherReferences
      );
      missingValueDescription = this.concatinateAllValuesForMissingWords(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        VendorNameValue,
        VendorPNValue,
        this.state.application,
        this.state.addOtherReferences
      );
    } else if (type === "vendor PN") {
      VendorNameValue = this.state.vendorNameDescription;
      VendorPNValue = vendorValue;
      newLongValue = this.generateNewLongDescription(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        VendorNameValue,
        VendorPNValue,
        this.state.application,
        this.state.addOtherReferences
      );
      missingValueDescription = this.concatinateAllValuesForMissingWords(
        this.state.attributeLong,
        this.state.addWebInputInfo,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        VendorNameValue,
        VendorPNValue,
        this.state.application,
        this.state.addOtherReferences
      );
    }

    let trimmedString = newLongValue.replace(/^,|,$/g, "");
    let normalizedString = trimmedString.replace(/,+/g, ",");

    let trimmedMissingString = missingValueDescription.replace(/^,|,$/g, "");
    let normalizedMissingString = trimmedMissingString.replace(/,+/g, ",");

    if (normalizedString.charAt(0) === ",") {
      normalizedString = normalizedString.slice(1);
    }

    if (normalizedString.charAt(normalizedString.length - 1) === ",") {
      normalizedString = normalizedString.slice(0, -1);
    }

    if (normalizedMissingString.charAt(0) === ",") {
      normalizedMissingString = normalizedMissingString.slice(1);
    }

    if (
      normalizedMissingString.charAt(normalizedMissingString.length - 1) === ","
    ) {
      normalizedMissingString = normalizedMissingString.slice(0, -1);
    }

    let compareDescription =
      this.state.longDescription + " " + this.state.shortDescription;
    let missingWords = this.findMissingWords(
      compareDescription,
      normalizedMissingString
    );

    this.setState({
      newLongDescription: normalizedString,
      missingWords: missingWords.join(","),
      IsItemEdited: true,
    });
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
    let newLongValue = "";
    let missingValueDescription = "";
    let newShortValue = "";
    let addInfoValue = "";
    if (e.target.name === "additionalInfoFromWeb") {
      addInfoValue = enteredValue + "," + this.state.additionalInfo;
      newShortValue = this.generateNewShortDescription(
        this.state.attributeShort,
        addInfoValue,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription
      );
      let trimmedShortString = newShortValue.replace(/^,|,$/g, "");
      let normalizedShortString = trimmedShortString.replace(/,+/g, ",");

      if (normalizedShortString.charAt(0) === ",") {
        normalizedShortString = normalizedShortString.slice(1);
      }
      if (
        normalizedShortString.charAt(normalizedShortString.length - 1) === ","
      ) {
        normalizedShortString = normalizedShortString.slice(0, -1);
      }

      newLongValue = this.generateNewLongDescription(
        this.state.attributeLong,
        addInfoValue,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription,
        this.state.application
      );
      missingValueDescription = this.concatinateAllValuesForMissingWords(
        this.state.attributeLong,
        addInfoValue,
        this.state.mfrNameDescription,
        this.state.mfrPNDescription,
        this.state.vendorNameDescription,
        this.state.vendorPNDescription,
        this.state.application
      );
      let trimmedString = newLongValue.replace(/^,|,$/g, "");
      let normalizedString = trimmedString.replace(/,+/g, ",");
      if (normalizedString.charAt(0) === ",") {
        normalizedString = normalizedString.slice(1);
      }
      if (normalizedString.charAt(normalizedString.length - 1) === ",") {
        normalizedString = normalizedString.slice(0, -1);
      }

      let trimmedMissingString = missingValueDescription.replace(/^,|,$/g, "");
      let normalizedMissingString = trimmedMissingString.replace(/,+/g, ",");
      if (normalizedMissingString.charAt(0) === ",") {
        normalizedMissingString = normalizedMissingString.slice(1);
      }
      if (
        normalizedMissingString.charAt(normalizedMissingString.length - 1) ===
        ","
      ) {
        normalizedMissingString = normalizedMissingString.slice(0, -1);
      }

      let compareDescription =
        this.state.longDescription + " " + this.state.shortDescription;
      let missingWords = this.findMissingWords(
        compareDescription,
        normalizedMissingString
      );

      this.setState({
        additionalInfoFromWeb: enteredValue,
        IsItemEdited: true,
        newShortDescription: normalizedShortString,
        newLongDescription: normalizedString,
        missingWords: missingWords.join(","),
        addWebInputInfo: enteredValue + "," + this.state.additionalInfo,
      });
      return;
    }
    addInfoValue = this.state.additionalInfoFromWeb + "," + enteredValue;
    newShortValue = this.generateNewShortDescription(
      this.state.attributeShort,
      addInfoValue,
      this.state.mfrNameDescription,
      this.state.mfrPNDescription,
      this.state.vendorNameDescription,
      this.state.vendorPNDescription
    );
    let trimmedShortString = newShortValue.replace(/^,|,$/g, "");
    let normalizedShortString = trimmedShortString.replace(/,+/g, ",");

    if (normalizedShortString.charAt(0) === ",") {
      normalizedShortString = normalizedShortString.slice(1);
    }
    if (
      normalizedShortString.charAt(normalizedShortString.length - 1) === ","
    ) {
      normalizedShortString = normalizedShortString.slice(0, -1);
    }

    newLongValue = this.generateNewLongDescription(
      this.state.attributeLong,
      addInfoValue,
      this.state.mfrNameDescription,
      this.state.mfrPNDescription,
      this.state.vendorNameDescription,
      this.state.vendorPNDescription,
      this.state.application
    );
    let trimmedString = newLongValue.replace(/^,|,$/g, "");
    let normalizedString = trimmedString.replace(/,+/g, ",");
    if (normalizedString.charAt(0) === ",") {
      normalizedString = normalizedString.slice(1);
    }
    if (normalizedString.charAt(normalizedString.length - 1) === ",") {
      normalizedString = normalizedString.slice(0, -1);
    }

    missingValueDescription = this.concatinateAllValuesForMissingWords(
      this.state.attributeLong,
      addInfoValue,
      this.state.mfrNameDescription,
      this.state.mfrPNDescription,
      this.state.vendorNameDescription,
      this.state.vendorPNDescription,
      this.state.application
    );
    let trimmedMissingString = missingValueDescription.replace(/^,|,$/g, "");
    let normalizedMissingString = trimmedMissingString.replace(/,+/g, ",");
    if (normalizedMissingString.charAt(0) === ",") {
      normalizedMissingString = normalizedMissingString.slice(1);
    }
    if (
      normalizedMissingString.charAt(normalizedMissingString.length - 1) === ","
    ) {
      normalizedMissingString = normalizedMissingString.slice(0, -1);
    }

    let compareDescription =
      this.state.longDescription + " " + this.state.shortDescription;
    let missingWords = this.findMissingWords(
      compareDescription,
      normalizedMissingString
    );

    this.setState({
      additionalInfo: enteredValue,
      IsItemEdited: true,
      newShortDescription: normalizedShortString,
      newLongDescription: normalizedString,
      missingWords: missingWords.join(","),
      addWebInputInfo: this.state.additionalInfoFromWeb + "," + enteredValue,
    });
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
    if (Object.keys(this.state.selectedUNSPSCOption).length > 0) {
      let unspscVersion = this.state.selectedUNSPSCOption.label.split("-")[0].trim();
      //let unspscCode = this.state.selectedUNSPSCOption.label.substring(0, 8); 
      let unspscCode = this.state.selectedUNSPSCOption.label.split("-")[1].trim(); 
      // let unspscCategory = this.state.selectedUNSPSCOption.label
      //   .substring(8)
      //   .trim();
      let unspscCategory = this.state.selectedUNSPSCOption.label.split("-")[2].trim();
      this.setState(
        (prevState) => ({
          ...prevState,
          selectedUNSPSCMroDictOption: this.state.selectedUNSPSCOption,
          unspscVersion: unspscVersion,
          unspscCode: unspscCode,
          unspscCategory: unspscCategory,
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
      const unspscLabelParts = selectedUNSPSCMroDictOption.label.split(" ");

      let unspscCode = unspscLabelParts.slice(2, 3).join(" ");
      let unspscCategory = unspscLabelParts.slice(4).join(" ").trim();
      let unspscVersion = unspscLabelParts.slice(0, 1).join(" ");

      this.setState(
        {
          selectedUNSPSCOption: selectedUNSPSCMroDictOption,
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

  //#region onchange application
  onChangeApplication = (e) => {
    const { name, value } = e.target;

    let enteredValue = value;

    let updatedNewValues = { ...this.state };
    updatedNewValues[name] = enteredValue;

    if (enteredValue.trim() === "") {
      updatedNewValues.application = "";
    }

    let otherRefValue = [
      updatedNewValues.dwg && updatedNewValues.dwg.trim() !== ""
        ? `DWG: ${updatedNewValues.dwg}`
        : "",
      updatedNewValues.pos && updatedNewValues.pos.trim() !== ""
        ? `POS: ${updatedNewValues.pos}`
        : "",
      updatedNewValues.itemNo && updatedNewValues.itemNo.trim() !== ""
        ? `Item No: ${updatedNewValues.itemNo}`
        : "",
      updatedNewValues.serialNo && updatedNewValues.serialNo.trim() !== ""
        ? `Serial No: ${updatedNewValues.serialNo}`
        : "",
      updatedNewValues.otherNo && updatedNewValues.otherNo.trim() !== ""
        ? `Other Number: ${updatedNewValues.otherNo}`
        : "",
      updatedNewValues.kksCode && updatedNewValues.kksCode.trim() !== ""
        ? `KKS Code: ${updatedNewValues.kksCode}`
        : "",
      updatedNewValues.assemblyOrPart
        ? `AssemblyOrPart: ${
            updatedNewValues.assemblyOrPart === "A"
              ? "Assembly"
              : updatedNewValues.assemblyOrPart === "P"
              ? "Part"
              : updatedNewValues.assemblyOrPart
          }`
        : "",
      updatedNewValues.bom && updatedNewValues.bom.trim() !== ""
        ? `BOM: ${updatedNewValues.bom}`
        : "",
      updatedNewValues.greenItems
        ? `GreenItems: ${
            updatedNewValues.greenItems === "Y"
              ? "Yes"
              : updatedNewValues.greenItems === "N"
              ? "Not Applicable"
              : updatedNewValues.greenItems
          }`
        : "",
    ]
      .filter(Boolean)
      .join(" , ");

    let newLongValue = this.generateNewLongDescription(
      updatedNewValues.attributeLong,
      updatedNewValues.addWebInputInfo,
      updatedNewValues.mfrNameDescription,
      updatedNewValues.mfrPNDescription,
      updatedNewValues.vendorNameDescription,
      updatedNewValues.vendorPNDescription,
      updatedNewValues.application,
      otherRefValue
    );

    let missingValueDescription = this.concatinateAllValuesForMissingWords(
      updatedNewValues.attributeLong,
      updatedNewValues.addWebInputInfo,
      updatedNewValues.mfrNameDescription,
      updatedNewValues.mfrPNDescription,
      updatedNewValues.vendorNameDescription,
      updatedNewValues.vendorPNDescription,
      updatedNewValues.application,
      otherRefValue
    );

    const normalizeString = (str) =>
      str.replace(/^,|,$/g, "").replace(/,+/g, ",").trim();

    let normalizedLongDescription = normalizeString(newLongValue);
    let normalizedMissingWords = normalizeString(missingValueDescription);

    let compareDescription = `${updatedNewValues.longDescription} ${updatedNewValues.shortDescription}`;
    let missingWords = this.findMissingWords(
      compareDescription,
      normalizedMissingWords
    );

    this.setState({
      ...updatedNewValues,
      IsItemEdited: true,
      newLongDescription: normalizedLongDescription,
      missingWords: missingWords.join(","),
      otherRefValue: otherRefValue,
    });
  };
  //#endregion

  //#region onchange Other Reference
  onChangeOtherRef = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      let updatedState = { ...prevState };
      updatedState[name] = value;
      if (value.trim() === "") {
        updatedState[name] = "";
      }
      let otherRefValue = [
        updatedState.dwg && updatedState.dwg.trim() !== ""
          ? `DWG: ${updatedState.dwg}`
          : "",
        updatedState.pos && updatedState.pos.trim() !== ""
          ? `POS: ${updatedState.pos}`
          : "",
        updatedState.itemNo && updatedState.itemNo.trim() !== ""
          ? `Item No: ${updatedState.itemNo}`
          : "",
        updatedState.serialNo && updatedState.serialNo.trim() !== ""
          ? `Serial No: ${updatedState.serialNo}`
          : "",
        updatedState.otherNo && updatedState.otherNo.trim() !== ""
          ? `Other Number: ${updatedState.otherNo}`
          : "",
        updatedState.kksCode && updatedState.kksCode.trim() !== ""
          ? `KKS Code: ${updatedState.kksCode}`
          : "",
        name === "assemblyOrPart"
          ? value === ""
            ? ""
            : `AssemblyOrPart: ${
                value === "A" ? "Assembly" : value === "P" ? "Part" : value
              }`
          : updatedState.assemblyOrPart
          ? `AssemblyOrPart: ${
              updatedState.assemblyOrPart === "A"
                ? "Assembly"
                : updatedState.assemblyOrPart === "P"
                ? "Part"
                : updatedState.assemblyOrPart
            }`
          : "",
        updatedState.bom && updatedState.bom.trim() !== ""
          ? `BOM: ${updatedState.bom}`
          : "",
        name === "greenItems"
          ? value === ""
            ? ""
            : `GreenItems: ${
                value === "Y" ? "Yes" : value === "N" ? "Not Applicable" : value
              }`
          : updatedState.greenItems
          ? `GreenItems: ${
              updatedState.greenItems === "Y"
                ? "Yes"
                : updatedState.greenItems === "N"
                ? "Not Applicable"
                : updatedState.greenItems
            }`
          : "",
      ]
        .filter(Boolean)
        .join(" , ");
      let newLongValue = this.generateNewLongDescription(
        updatedState.attributeLong,
        updatedState.addWebInputInfo,
        updatedState.mfrNameDescription,
        updatedState.mfrPNDescription,
        updatedState.vendorNameDescription,
        updatedState.vendorPNDescription,
        updatedState.application,
        otherRefValue
      );

      let missingValueDescription = this.concatinateAllValuesForMissingWords(
        updatedState.attributeLong,
        updatedState.addWebInputInfo,
        updatedState.mfrNameDescription,
        updatedState.mfrPNDescription,
        updatedState.vendorNameDescription,
        updatedState.vendorPNDescription,
        updatedState.application,
        otherRefValue
      );

      const normalizeString = (str) =>
        str.replace(/^,|,$/g, "").replace(/,+/g, ",").trim();

      let normalizedLongDescription = normalizeString(newLongValue);
      let normalizedMissingWords = normalizeString(missingValueDescription);

      let compareDescription = `${updatedState.longDescription} ${updatedState.shortDescription}`;
      let missingWords = this.findMissingWords(
        compareDescription,
        normalizedMissingWords
      );

      return {
        ...updatedState,
        IsItemEdited: true,
        newLongDescription: normalizedLongDescription,
        missingWords: missingWords.join(","),
      };
    });
  };
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
      unspscVersion: " ",
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
    console.log(value);
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

    if (
      this.state.selectedStatus === "Completed" &&
      this.state.selectedLevel === ""
    ) {
      toast.error("Please select level...!");
      return;
    }

    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    const valuesMPN = [
      this.removeSpecialCharacters(this.state.MFRPNs.mfrPN1),
      this.removeSpecialCharacters(this.state.MFRPNs.mfrPN2),
      this.removeSpecialCharacters(this.state.MFRPNs.mfrPN3),
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
      productionItemID: this.state.productionItemID,
      uniqueId: this.state.uniqueId,
      shortDescription: this.state.shortDescription,
      longDescription: this.state.longDescription,
      uOM: this.state.uOM,
      //newShortDescription: this.state.newShortDescription,
      newShortDescription: this.state.newShortDescription.endsWith(',') ? this.state.newShortDescription.slice(0, -1) : this.state.newShortDescription,
      //newLongDescription: this.state.newLongDescription,
      newLongDescription: this.state.newLongDescription.toLowerCase().startsWith('additional info: ,') ? this.state.newLongDescription.replace(this.state.newLongDescription,"ADDITIONAL INFO: ,","ADDITIONAL INFO: ") : this.state.newLongDescription,
      missingWords: this.state.missingWords,
      mfrName: this.state.mfrName,
      mfrPN: this.state.mfrPN,
      vendorName: this.state.vendorName,
      vendorPN: this.state.vendorPN,
      status: this.state.selectedStatus,
      level: this.state.selectedLevel,
      mfrName1: this.state.MFRNames.mfrName1,
      mfrPN1: this.state.MFRPNs.mfrPN1,
      mfrName2: this.state.MFRNames.mfrName2,
      mfrPN2: this.state.MFRPNs.mfrPN2,
      mfrName3: this.state.MFRNames.mfrName3,
      mfrPN3: this.state.MFRPNs.mfrPN3,
      vendorName1: this.state.vendorsNames.vendorName1,
      vendorPN1: this.state.vendorsPN.vendorPN1,
      vendorName2: this.state.vendorsNames.vendorName2,
      vendorPN2: this.state.vendorsPN.vendorPN2,
      vendorName3: this.state.vendorsNames.vendorName3,
      vendorPN3: this.state.vendorsPN.vendorPN3,
      additionalInfo: this.state.additionalInfo,
      additionalInfoFromWeb: this.state.additionalInfoFromWeb,
      addOtherReferences: this.state.addOtherReferences,
      unspscCode: this.state.unspscCode,
      unspscCategory: this.state.unspscCategory,
      unspscVersion: this.state.unspscVersion,
      webRefURL1: this.state.webRefURL1,
      webRefURL2: this.state.webRefURL2,
      webRefURL3: this.state.webRefURL3,
      PDFURL: this.state.webRefPdfURL,
      remarks: this.state.remarks,
      query: this.state.query,
      application: this.state.application,
      dwg: this.state.dwg,
      pos: this.state.pos,
      itemNo: this.state.itemNo,
      serialNo: this.state.serialNo,
      otherNo: this.state.otherNo,
      kksCode: this.state.kksCode,
      assemblyOrPart: this.state.assemblyOrPart,
      bom: this.state.bom,
      greenItems: this.state.greenItems,
      CustomColumnName1: this.state.customColumnName1,
      CustomColumnName1Value: this.state.customColumnName1Value,
      CustomColumnName2: this.state.customColumnName2,
      CustomColumnName2Value: this.state.customColumnName2Value,
      CustomColumnName3: this.state.customColumnName3,
      CustomColumnName3Value: this.state.customColumnName3Value,
      userID: helper.getUser(),
    };
    console.log(data);

    if (Object.keys(this.state.selectedNounModifier).length !== 0) {
      let noun_Modifier = this.state.selectedNounModifier.label.split("_");
      data.noun = noun_Modifier[0].trim();
      data.modifier = noun_Modifier[1].trim();
      data.itemAttributes = this.state.itemAttributes;
    }

    let uniqueData = {
      CustomerCode: this.state.customerCode,
      ProjectCode: this.state.projectCode,
      BatchNo: this.state.batchNo ? this.state.batchNo : "",
      UniqueID: this.state.uniqueId,
      MFRPN1: this.state.MFRPNs.mfrPN1,
      MFRPN2: this.state.MFRPNs.mfrPN2,
      MFRPN3: this.state.MFRPNs.mfrPN3,
      VendorPN1: this.state.vendorsPN.vendorPN1,
      VendorPN2: this.state.vendorsPN.vendorPN2,
      VendorPN3: this.state.vendorsPN.vendorPN3,
    };

    productionTemplate
      .findDublicateUniqueId(uniqueData)
      .then((response) => {
        if (response.status === 200) {
          productionTemplate
            .productionItemUpdate(data)
            .then(() => {
              this.setState({ IsItemEdited: false });
              toast.success("GOP Edit Screen Saved Successfully...!");
            })
            .catch((error) => {
              this.setState({ loading: false });
              console.log(error);
            });
        }
      })
      .catch((error) => {
        toast.error("Dubplicate unique Id: " + error.response.data.Message);
      });
  };
  //#endregion

  //#region Check Is Duplicate Unique ID
  isDuplicateUniqueId = () => {
      const valuesMPN = [
        this.removeSpecialCharacters(this.state.MFRPNs.mfrPN1),
        this.removeSpecialCharacters(this.state.MFRPNs.mfrPN2),
        this.removeSpecialCharacters(this.state.MFRPNs.mfrPN3),
      ];

      const uniqueValues = new Set(
        valuesMPN.filter((value) => value.trim() !== "")
      );

      const isValid =
        uniqueValues.size ===
        valuesMPN.filter((value) => value.trim() !== "").length;

      if (!isValid) {
        toast.error("Manufacturer PN Should be unique...!");
        return false;
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

      let uniqueData = {
        CustomerCode: this.state.customerCode,
        ProjectCode: this.state.projectCode,
        BatchNo: this.state.batchNo ? this.state.batchNo : "",
        UniqueID: this.state.uniqueId,
        MFRPN1: this.state.MFRPNs.mfrPN1,
        MFRPN2: this.state.MFRPNs.mfrPN2,
        MFRPN3: this.state.MFRPNs.mfrPN3,
        VendorPN1: this.state.vendorsPN.vendorPN1,
        VendorPN2: this.state.vendorsPN.vendorPN2,
        VendorPN3: this.state.vendorsPN.vendorPN3,
      };

      productionTemplate
        .findDublicateUniqueId(uniqueData)
        .then((response) => {
          if (response.status === 200) {
            return true;
          }
        })
        .catch((error) => {
          toast.error("Duplicate unique Id: " + error.response.data.Message);
        
        });
  }
  //#endregion 

  //#region Save & Next/Previous GOP Screen Data
  savePrevNextItemDetails = (e, nextId) => {
    e.preventDefault();
    if (this.state.IsItemEdited) {
      this.setState({
        showConfirm: !this.state.showConfirm,
        updateId: nextId,
        selectedUNSPSCOption: {},
        selectedUNSPSCMroDictOption: {},
        unspscCode: "",
        unspscCategory: "",
      });
      return;
    }
    this.setState({
      selectedNounModifier: {},
      selectedUNSPSCOption: {},
      selectedUNSPSCMroDictOption: {},
      unspscCode: "",
      unspscCategory: "",
    });
    this.fetchGOPScreenDetails(nextId);
  };
  //#endregion

  //#region hide save confirm modal
  hideConfirmModal = () => {
    this.setState({ showConfirm: !this.state.showConfirm });
  };
  //#endregion

  //#region not confirming changes
  goToPrevNextItem = () => {
    this.setState({
      showConfirm: !this.state.showConfirm,
      IsItemEdited: false,
    });
    if (this.state.navigateBack) {
      sessionStorage.removeItem("ProdItemData");
      this.props.hideEdiModal();
      return;
    }
    this.fetchGOPScreenDetails(this.state.updateId);
  };
  //#endregion

  //#region confirming changes
  saveAndGoToNextItem = () => {
    if (
      this.state.selectedStatus === "Completed" &&
      this.state.selectedLevel === ""
    ) {
      toast.error("Please select level...!");
      this.setState({ showConfirm: !this.state.showConfirm });
      return;
    }
    this.saveAllItemDetails();
    this.setState({ showConfirm: !this.state.showConfirm });
    if (this.state.navigateBack) {
      sessionStorage.removeItem("ProdItemData");
      this.props.hideEdiModal();
      return;
    }
    this.fetchGOPScreenDetails(this.state.updateId);
  };
  //#endregion

  //#region Select All textbox value
  handleInputClick = (refName) => () => {
    if (this.inputRefs[refName].current) {
      this.inputRefs[refName].current.select();
    }
  };
  //#endregion

  //#region open preview modal
  openPreviewModal = () => {
    this.setState((prevState) => ({ ...prevState, previewModal: true }));
  };

  closePreviewModal = () => {
    this.setState((prevState) => ({ ...prevState, previewModal: false }));
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
    const { showEditModal, hideEdiModal } = this.props;

    //#region Close Edit Modal
    const closeEditModal = () => {
      if (this.state.IsItemEdited) {
        this.setState({
          showConfirm: !this.state.showConfirm,
          navigateBack: true,
        });
        return;
      }
      sessionStorage.removeItem("ProdItemData");
      hideEdiModal();
    };
    //#endregion

    //#region main return
    return (
      <Modal
        show={showEditModal}
        onHide={hideEdiModal}
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
            {this.state.previewModal && (
              <GOPPreviewScreen
                showPreview={this.state.previewModal}
                stateValue={this.state}
                closePreviewModal={this.closePreviewModal}
              />
            )}

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
            {this.state.showConfirm && (
              <Modal
                show={this.state.showConfirm}
                onHide={this.hideConfirmModal}
                className="confirm-save-modal"
              >
                <div className="save-changes-modal-div">
                  <div>
                    <div>
                      <h6>Do you want to save changes?</h6>
                    </div>
                    <div className="d-flex justify-content-center">
                      <Button
                        varinat="primary"
                        className="saveEditScreenData float-end mr-4"
                        onClick={this.saveAndGoToNextItem}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="primary"
                        className="saveEditScreenData float-end"
                        onClick={this.goToPrevNextItem}
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
                unspscVerion={this.state.unspscVerion}
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
                  <Col lg={2} className="ref-left-div" style={{ padding: "0" }}>
                    <Row style={{ marginTop: "5px" }}>
                      <Col lg={10}>
                        <h4 className="reference-head"> Reference Fields </h4>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={10} className="ref-right-div">
                    <div className="page-header-div">
                      <div className="page-header-sections">
                        <h6>Unique ID:</h6>&nbsp;
                        <p>{this.state.uniqueId}</p>
                      </div>
                      <div className="page-header-sections">
                        <h6>Customer Code:</h6>&nbsp;
                        <p>{this.state.customerCode}</p>
                      </div>
                      <div className="page-header-sections">
                        <h6>Project Code:</h6>&nbsp;
                        <p>{this.state.projectCode}</p>
                      </div>
                      {this.state.batchNo && (
                        <div className="page-header-sections">
                          <h6>Batch No:</h6>&nbsp;
                          <p>{this.state.batchNo}</p>
                        </div>
                      )}
                      <div className="page-header-sections">
                        <h6>Production User:</h6>&nbsp;
                        <p>{helper.getUser()}</p>
                      </div>
                    </div>
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
                        onChange={this.inputChangeHandler}
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
                        //type="text"
                        as="textarea"
                        className="pro-input input-gray hide-scrollbar"
                        name="shortDescription"
                        //defaultValue={this.state.shortDescription}
                        value={this.state.shortDescription}
                        onChange={this.inputChangeHandler}
                        ref={this.textareaRef1}
                        readOnly
                      />
                    </OverlayTrigger>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleCopyShortDesc}
                    >
                      <i className="fas fa-copy"></i>
                    </span>
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
                        //type="text"
                        as="textarea"
                        className="pro-input input-gray hide-scrollbar"
                        name="longDescription"
                        //defaultValue={this.state.longDescription}
                        value={this.state.longDescription}
                        onChange={this.inputChangeHandler}
                        ref={this.textareaRef2}
                        readOnly
                      />
                    </OverlayTrigger>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleCopyLongDesc}
                    >
                      <i className="fas fa-copy"></i>
                    </span>
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
                        //type="text"
                        as="textarea"
                        className="pro-input input-lightblue"
                        name="newShortDescription"
                        value={this.state.newShortDescription}
                        onChange={this.inputChangeHandler}
                        ref={this.textareaRef3}
                        readOnly
                      />
                    </OverlayTrigger>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleCopyNewShortDesc}
                    >
                      <i className="fas fa-copy"></i>
                    </span>
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
                        ref={this.textareaRef4}
                        readOnly
                      />
                    </OverlayTrigger>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleCopyNewLongDesc}
                    >
                      <i className="fas fa-copy"></i>
                    </span>
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
                        ref={this.textareaRef5}
                        readOnly
                      />
                    </OverlayTrigger>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.handleCopyMissingWords}
                    >
                      <i className="fas fa-copy"></i>
                    </span>
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
                          <Col lg={3} className="form-data-row">
                            <Form.Label className="readGOPHead">
                              Noun / Modifier
                            </Form.Label>
                          </Col>
                          <Col
                            lg={5}
                            style={{ paddingLeft: "0", ...setHeight(100) }}
                          >
                            <div className="pro-select" style={setHeight(100)}>
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
                          <Col
                            lg={4}
                            style={{ paddingLeft: "0", ...setHeight(100) }}
                          >
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
                        </Row>
                      </Col>
                      <Col lg={2}>
                        <Row>
                          <Col lg={2} className="form-data-row">
                            <Form.Label className="readGOPHead">
                              {" "}
                              Status{" "}
                            </Form.Label>
                          </Col>
                          <Col lg={10} style={{ paddingLeft: "0" }}>
                            <select
                              className="form-control"
                              style={{ height: "28px" }}
                              name="selectedStatus"
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
                          <Col lg={3}></Col>
                        </Row>
                      </Col>
                      <Col lg={4} className="flag-div">
                        {(this.state.selectedStatus === "Completed" ||
                          this.state.selectedStatus === "Query") && (
                          <div className="complete-status-flag-div">
                            <div>
                              <label
                                className="flag-label"
                                style={{ padding: "0 15px" }}
                              >
                                Level
                              </label>
                            </div>
                            <div>
                              <Form.Check
                                inline
                                label="Cleansed"
                                name="group10"
                                type="radio"
                                checked={this.state.selectedLevel === "C"}
                                onChange={() => this.selectLevel("C")}
                                id={`inline-radio-1`}
                              />
                              <Form.Check
                                inline
                                label="Enriched"
                                name="group10"
                                type="radio"
                                checked={this.state.selectedLevel === "E"}
                                onChange={() => this.selectLevel("E")}
                                id={`inline-radio-2`}
                              />
                              {this.state.selectedStatus === "Query" && (
                                <Form.Check
                                  inline
                                  label="Exception"
                                  name="group10"
                                  type="radio"
                                  checked={this.state.selectedLevel === "X"}
                                  onChange={() => this.selectLevel("X")}
                                  id={`inline-radio-3`}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
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
                              <NMAttributeTable
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
                        <div className="gd-tab-edit-screen grid-min-height">
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={2} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    MFR Name 1
                                  </Form.Label>
                                </Col>
                                <Col lg={10} className="gop-form-row">
                                  <EditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.mfrName1}
                                    Inputs="mfrName1"
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
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    name="mfrPN1"
                                    className="txt-pn"
                                    value={this.state.MFRPNs.mfrPN1}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "mfrPN1",
                                        "MFR PN"
                                      )
                                    }
                                    onBlur={(e) =>
                                      this.isDuplicateUniqueId()
                                    }
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
                                <Col lg={10} className="gop-form-row">
                                  <EditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.mfrName2}
                                    Inputs="mfrName2"
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
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    name="mfrPN2"
                                    className="txt-pn"
                                    value={this.state.MFRPNs.mfrPN2}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "mfrPN2",
                                        "MFR PN"
                                      )
                                    }
                                    onBlur={(e) =>
                                      this.isDuplicateUniqueId()
                                    }
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
                                <Col lg={10} className="gop-form-row">
                                  <EditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.MFRNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.mfrName3}
                                    Inputs="mfrName3"
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
                                <Col lg={10} className="gop-form-row">
                                  <Form.Control
                                    name="mfrPN3"
                                    className="txt-pn"
                                    value={this.state.MFRPNs.mfrPN3}
                                    onChange={(e) =>
                                      this.handleMFRPNChange(
                                        e,
                                        "mfrPN3",
                                        "MFR PN"
                                      )
                                    }
                                    onBlur={(e) =>
                                      this.isDuplicateUniqueId()
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="VendorInfo">
                        <div className="gd-tab-edit-screen grid-min-height ">
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={3} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    Vendor Name 1
                                  </Form.Label>
                                </Col>
                                <Col lg={9} className="gop-form-row">
                                  <EditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.vendorName1}
                                    Inputs="vendorName1"
                                    Types="vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={3} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    Vendor PN 1
                                  </Form.Label>
                                </Col>
                                <Col lg={9} className="gop-form-row">
                                  <Form.Control
                                    name="vendorPN1"
                                    className="txt-pn"
                                    value={this.state.vendorsPN.vendorPN1}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "vendorPN1",
                                        "vendor PN"
                                      )
                                    }
                                    onBlur={(e) =>
                                      this.isDuplicateUniqueId()
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={3} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    Vendor Name 2
                                  </Form.Label>
                                </Col>
                                <Col lg={9} className="gop-form-row">
                                  <EditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.vendorName2}
                                    Inputs="vendorName2"
                                    Types="vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={3} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    Vendor PN 2
                                  </Form.Label>
                                </Col>
                                <Col lg={9} className="gop-form-row">
                                  <Form.Control
                                    name="vendorPN2"
                                    className="txt-pn"
                                    value={this.state.vendorsPN.vendorPN2}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "vendorPN2",
                                        "vendor PN"
                                      )
                                    }
                                    onBlur={(e) =>
                                      this.isDuplicateUniqueId()
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="edit-grid-row">
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={3} className="gop-form-row">
                                  <Form.Label className="readGOPHead">
                                    Vendor Name 3
                                  </Form.Label>
                                </Col>
                                <Col lg={9} className="gop-form-row">
                                  <EditableDropdownGop
                                    handleFocus={this.handleFocus}
                                    Options={this.state.VendorNameOptions}
                                    projectSettings={this.state.projectSetting}
                                    selectValue={this.state.vendorName3}
                                    Inputs="vendorName3"
                                    Types="vendor Name"
                                    optionDataType="VendorName"
                                    handleVendorChange={this.handleVendorChange}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={6}>
                              <Row className="form-data-row">
                                <Col lg={3} className="gop-row-head">
                                  <Form.Label className="readGOPHead">
                                    Vendor PN 3
                                  </Form.Label>
                                </Col>
                                <Col lg={9} className="gop-form-row">
                                  <Form.Control
                                    name="vendorPN3"
                                    className="txt-pn"
                                    value={this.state.vendorsPN.vendorPN3}
                                    onChange={(e) =>
                                      this.handleVendorPNChange(
                                        e,
                                        "vendorPN3",
                                        "vendor PN"
                                      )
                                    }
                                    onBlur={(e) =>
                                      this.isDuplicateUniqueId()
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="AddInfo">
                        <div className="gd-tab-edit-screen grid-min-height">
                          <Row className="form-data-row pb-4">
                            <Col lg={1} className="gop-row-head">
                              <Form.Label className="readGOPHead">
                                From Web
                              </Form.Label>
                            </Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                ref={this.inputRefs.refAddWebInfo}
                                as="textarea"
                                rows={3}
                                name="additionalInfoFromWeb"
                                value={this.state.additionalInfoFromWeb}
                                onChange={this.onChangeAdditionalInfo}
                              />
                            </Col>
                          </Row>
                          <Row className="form-data-row ">
                            <Col lg={1} className="gop-row-head">
                              <Form.Label className="readGOPHead">
                                From Input
                              </Form.Label>
                            </Col>
                            <Col lg={11} className="gop-form-row">
                              <Form.Control
                                ref={this.inputRefs.refAddInfo}
                                as="textarea"
                                rows={3}
                                name="additionalInfo"
                                value={this.state.additionalInfo}
                                onChange={this.onChangeAdditionalInfo}
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
                                    UNSPSC Code
                                  </Form.Label>
                                </Col>
                                <Col lg={9} style={{ padding: "0" }}>
                                  <Form.Control
                                    ref={this.inputRefs.refUNSPSCCode}
                                    onClick={this.handleInputClick(
                                      "refUNSPSCCode"
                                    )}
                                    readOnly
                                    type="tel"
                                    className="pro-input input-gray"
                                    name="unspscCode"
                                    onKeyPress={(e) => {
                                      if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    value={this.state.unspscCode}
                                    onChange={this.inputChangeHandler}
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
                                    ref={this.inputRefs.refUNSPSCCategory}
                                    onClick={this.handleInputClick(
                                      "refUNSPSCCategory"
                                    )}
                                    readOnly
                                    type="text"
                                    className="pro-input input-gray"
                                    name="unspscCategory"
                                    value={this.state.unspscCategory}
                                    onChange={this.inputChangeHandler}
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
                                    ref={this.inputRefs.refUNSPSCVersion}
                                    onClick={this.handleInputClick(
                                      "refUNSPSCVersion"
                                    )}
                                    readOnly
                                    type="text"
                                    className="pro-input input-gray"
                                    name="unspscVersion"
                                    value={this.state.unspscVersion}
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
                                    ref={this.inputRefs.refWebURL1}
                                    onClick={this.handleInputClick(
                                      "refWebURL1"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL1"
                                    value={this.state.webRefURL1}
                                    maxLength={1000}
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
                                    ref={this.inputRefs.refWebURL2}
                                    onClick={this.handleInputClick(
                                      "refWebURL2"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL2"
                                    value={this.state.webRefURL2}
                                    maxLength={1000}
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
                                    ref={this.inputRefs.refWebURL3}
                                    onClick={this.handleInputClick(
                                      "refWebURL3"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="webRefURL3"
                                    value={this.state.webRefURL3}
                                    maxLength={1000}
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
                                    ref={this.inputRefs.refWebPdfURL3}
                                    onClick={this.handleInputClick(
                                      "refWebPdfURL3"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="webRefPdfURL"
                                    value={this.state.webRefPdfURL}
                                    maxLength={1000}
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
                        <div className="gd-tab-edit-screen grid-min-height">
                          <Form.Control
                            ref={this.inputRefs.refRemarks}
                            onClick={this.handleInputClick("refRemarks")}
                            as="textarea"
                            rows={8}
                            name="remarks"
                            value={this.state.remarks}
                            onChange={this.inputChangeHandler}
                          />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Query">
                        <div className="gd-tab-edit-screen grid-min-height">
                          <Form.Control
                            ref={this.inputRefs.refQuery}
                            onClick={this.handleInputClick("refQuery")}
                            as="textarea"
                            rows={8}
                            name="query"
                            value={this.state.query}
                            onChange={this.inputChangeHandler}
                          />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Application">
                        <div className="gd-tab-edit-screen grid-min-height">
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
                                    ref={this.inputRefs.refApplication}
                                    onClick={this.handleInputClick(
                                      "refApplication"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="application"
                                    value={this.state.application}
                                    maxLength={1000}
                                    onChange={this.onChangeApplication}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={1}></Col>
                          </Row>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="OtherReferences">
                        <div className="gd-tab-edit-screen grid-min-height">
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
                                    ref={this.inputRefs.refDWG}
                                    onClick={this.handleInputClick("refDWG")}
                                    type="text"
                                    className="pro-input"
                                    name="dwg"
                                    value={this.state.dwg}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    ref={this.inputRefs.refPOS}
                                    onClick={this.handleInputClick("refPOS")}
                                    type="text"
                                    className="pro-input"
                                    name="pos"
                                    value={this.state.pos}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    ref={this.inputRefs.refITEMNO}
                                    onClick={this.handleInputClick("refITEMNO")}
                                    type="text"
                                    className="pro-input"
                                    name="itemNo"
                                    value={this.state.itemNo}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    ref={this.inputRefs.refSerialNo}
                                    onClick={this.handleInputClick(
                                      "refSerialNo"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="serialNo"
                                    value={this.state.serialNo}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    ref={this.inputRefs.refOtherNumber}
                                    onClick={this.handleInputClick(
                                      "refOtherNumber"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="otherNo"
                                    value={this.state.otherNo}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    ref={this.inputRefs.refKksCode}
                                    onClick={this.handleInputClick(
                                      "refKksCode"
                                    )}
                                    type="text"
                                    className="pro-input"
                                    name="kksCode"
                                    value={this.state.kksCode}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    onChange={this.onChangeOtherRef}
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
                                <Col lg={2} className="form-data-row">
                                  <Form.Label className="readGOPHead">
                                    BOM
                                  </Form.Label>
                                </Col>
                                <Col lg={10} style={{ padding: "0" }}>
                                  <Form.Control
                                    ref={this.inputRefs.refBOM}
                                    onClick={this.handleInputClick("refBOM")}
                                    type="text"
                                    className="pro-input"
                                    name="bom"
                                    value={this.state.bom}
                                    maxLength={1000}
                                    onChange={this.onChangeOtherRef}
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
                                    onChange={this.onChangeOtherRef}
                                  >
                                    <option value="">--Select--</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">Not Applicable</option>
                                  </select>
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
              <div className="d-grid gap-2 d-md-flex justify-content-md-end mg-t-10 mg-b-10 mg-r-20">
                <Button
                  varinat="primary"
                  className="saveEditScreenData float-end mr-4"
                  onClick={this.saveAllItemDetails}
                >
                  Save
                </Button>
                <Button
                  varinat="primary"
                  className="saveEditScreenData float-end mr-4"
                  onClick={this.openPreviewModal}
                >
                  Preview
                </Button>
                <Button
                  varinat="primary"
                  className="saveEditScreenData float-end mr-4"
                  onClick={(e) =>
                    this.savePrevNextItemDetails(
                      e,
                      this.state.previousProductionItemID
                    )
                  }
                  disabled={this.state.previousProductionItemID === null}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  className="saveEditScreenData float-end mr-4"
                  onClick={(e) =>
                    this.savePrevNextItemDetails(
                      e,
                      this.state.nextProductionItemID
                    )
                  }
                  disabled={this.state.nextProductionItemID === null}
                >
                  Next
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
    // #endregion
  }
}

const mapStateToProps = (state) => ({
  data: state.productionsData,
});

export default withRouter(
  connect(mapStateToProps, { setNMUniqurVaue, rowDataPass })(GOPEditScreen)
);
