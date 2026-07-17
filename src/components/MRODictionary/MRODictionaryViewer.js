import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@mui/material";
import "./MRODictionaryViewer.scss";
import helper from "../../helpers/helpers";
import { Row, Col, Button } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import mroDictionaryService from "../../services/mroDictionary.service";
import { Autocomplete } from "@mui/material";

toast.configure();

class MroDictionaryViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserID: helper.getUser(),
      mroDictionaryVersionsList: [],
      selectedVersionNameOrNo: "",
      releaseDate: "",

      nounList: [],
      nounDefinition: "",
      nounModifierDefinitionOrGuidelines: "",
      selectedNoun: "",
      selectedModifier: "",

      modifiersList: [],
      modifierColumns: this.modifierTable().modifierColumns,
      modifierData: this.modifierTable().modifierData,

      synonymColumns: this.synonymTable().synonymColumns,
      synonymList: [],
      synonymDefinitionOrGuidelines: "",
      selectedSynonym: "",

      attributeColumns: this.attributeTable().attributeColumns,
      attributeData: this.attributeTable().attributeData,
      selectedAttribute: "",

      attributeEVVColumns: this.attributeEVVTable().attributeEVVColumns,
      attributeEVVData: this.attributeEVVTable().attributeEVVData,
      attributeEVVList: [],
      selectedEnumeratedValidValue: "",

      unspscColumns: this.unspscTable().unspscColumns,
      unspscData: this.unspscTable().unspscData,
      selectedUNSPSC: "",
      unspscVersion: " ",

      nounModifierImageColumns: this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData: this.nounModifierImageTable().nounModifierImageData,
      
      loading: false,
      spinnerMessage: "",
      activeRowId: null,
      isToHideRefresh:false,
    };
    this.onChangeMRODictionaryVersion = this.onChangeMRODictionaryVersion.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  //#region Refresh the page
  refreshData() {
    this.setState({
      selectedVersionNameOrNo: "",
      releaseDate: "",
      nounList: [],
      nounDefinition: "",
      nounModifierDefinitionOrGuidelines: "",
      selectedNoun: "",
      selectedModifier: "",

      modifiersList: [],
      modifierColumns: this.modifierTable().modifierColumns,
      modifierData: this.modifierTable().modifierData,

      synonymColumns: this.synonymTable().synonymColumns,
      synonymList: [],
      synonymDefinitionOrGuidelines: "",
      selectedSynonym: "",

      attributeColumns: this.attributeTable().attributeColumns,
      attributeData: this.attributeTable().attributeData,
      attributeGuidelines: "",
      selectedAttribute: "",

      attributeEVVColumns: this.attributeEVVTable().attributeEVVColumns,
      attributeEVVData: this.attributeEVVTable().attributeEVVData,
      attributeEVVList: [],
      selectedEnumeratedValidValue: "",

      unspscColumns: this.unspscTable().unspscColumns,
      unspscData: this.unspscTable().unspscData,
      unspscVersion: " ",

      nounModifierImageColumns:this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData:this.nounModifierImageTable().nounModifierImageData,

      loading: false,
      spinnerMessage: "",
      activeRowId: null,
    }, () => {
      setTimeout(() => {
        sessionStorage.setItem("activeMroDictionaryTab", 3);
        this.props.history.push("/MRODictionary");
      }, 1000); 
    });
  }
  //#endregion

  //#region Change MRO Dictionary Version
  onChangeMRODictionaryVersion = (e) => {
    this.setState({
      selectedVersionNameOrNo: e.target.value,
    });
    this.setState(
      {
        selectedNoun: "",
        nounDefinition: "",
        nounModifierDefinitionOrGuidelines: "",
        attributeGuidelines: "",
        modifiersList: [],
        modifierColumns: this.modifierTable().modifierColumns,
        modifierData: this.modifierTable().modifierData,
        synonymColumns: this.synonymTable().synonymColumns,
        synonymList: [],
        synonymDefinitionOrGuidelines: "",
        selectedSynonym: "",
        attributeColumns: this.attributeTable().attributeColumns,
        attributeData: this.attributeTable().attributeData,
        selectedAttribute: "",
        attributeEVVColumns: this.attributeEVVTable().attributeEVVColumns,
        attributeEVVData: this.attributeEVVTable().attributeEVVData,
        attributeEVVList: [],
        selectedEnumeratedValidValue: "",
        unspscColumns: this.unspscTable().unspscColumns,
        unspscData: this.unspscTable().unspscData,
        nounModifierImageColumns: this.nounModifierImageTable().nounModifierImageColumns,
        nounModifierImageData: this.nounModifierImageTable().nounModifierImageData,
      }
    );
    this.fetchNounModifiersData();

  };
  //#endregion

  //#region Component Mount
  componentDidMount() {
    this.fetchMRODictionaryVersion();
    this.setState({
      isToHideRefresh: this.props.hideRefresh
    });

  }
  //#endregion

  //#region Fetch MRO Dictionary Versions
  fetchMRODictionaryVersion = () => {
    this.setState({
      spinnerMessage: "Please wait while loading MRO Dictionary Versions...",
      loading: true,
    });
    mroDictionaryService
      .readMRODictionariesList()
      .then((response) => {
        this.setState({
          mroDictionaryVersionsList: response.data,
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

  //#region Fetch Noun Modifiers Data
  fetchNounModifiersData = () => {
  const UserID = helper.getUser();
  const VersionNameOrNo = this.state.selectedVersionNameOrNo;
    this.setState({
      spinnerMessage: "Loading Noun-Modifier Template List...",
      loading: true,
    });
    mroDictionaryService
    .readNounModifiersTemplateList(UserID, VersionNameOrNo)
      .then((response) => {
        const distinctNouns = [
          ...new Set(response.data.map((item) => item.Noun)),
        ];
        this.setState({
          nounList: distinctNouns,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching nouns:", error);
      toast.error("Failed to load Noun - Modifier Template List.", {
        autoClose: false,
      });
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Method to handle change the Noun select dropdown
  onChangeNoun = (newValue) => {
    const Noun = newValue;
    if (!this.state.selectedVersionNameOrNo) {
      toast.error(
        "Version name or number is mandatory before selecting a noun.",
        { autoClose: false }
      );
      return;
    }

    this.setState(
      {
        selectedNoun: Noun,
        nounDefinition: "",
        nounModifierDefinitionOrGuidelines: "",
        attributeGuidelines: "",
        modifiersList: [],
        modifierColumns: this.modifierTable().modifierColumns,
        modifierData: this.modifierTable().modifierData,
        synonymColumns: this.synonymTable().synonymColumns,
        synonymList: [],
        synonymDefinitionOrGuidelines: "",
        selectedSynonym: "",
        attributeColumns: this.attributeTable().attributeColumns,
        attributeData: this.attributeTable().attributeData,
        selectedAttribute: "",
        attributeEVVColumns: this.attributeEVVTable().attributeEVVColumns,
        attributeEVVData: this.attributeEVVTable().attributeEVVData,
        attributeEVVList: [],
        selectedEnumeratedValidValue: "",
        unspscColumns: this.unspscTable().unspscColumns,
        unspscData: this.unspscTable().unspscData,
      nounModifierImageColumns: this.nounModifierImageTable().nounModifierImageColumns,
      nounModifierImageData: this.nounModifierImageTable().nounModifierImageData,
      },
      () => {
        this.fetchModifiersOfSelectedVersionAndNoun();
      }
    );
  };
  //#endregion

  //#region change the Modifier method
  onChangeModifier = (Modifier) => {
    this.setState(
      (prevState) => ({
        nounDefinition: "",
        nounModifierDefinitionOrGuidelines: "",
        attributeGuidelines: "",
        modifiersList: prevState.modifiersList.map((mod) =>
          mod.Modifier === Modifier
            ? { ...mod, selected: true }
            : { ...mod, selected: false }
        ),
        modifierColumns: this.modifierTable().modifierColumns,
        modifierData: this.modifierTable().modifierData,
        synonymDefinitionOrGuidelines: "",
        selectedSynonym: "",
        attributeColumns: this.attributeTable().attributeColumns,
        attributeData: this.attributeTable().attributeData,
        selectedAttribute: "",
        attributeEVVColumns: this.attributeEVVTable().attributeEVVColumns,
        attributeEVVData: this.attributeEVVTable().attributeEVVData,
        attributeEVVList: [],
        selectedEnumeratedValidValue: "",
        unspscColumns: this.unspscTable().unspscColumns,
        unspscData: this.unspscTable().unspscData,
        nounModifierImageColumns:
          this.nounModifierImageTable().nounModifierImageColumns,
        nounModifierImageData:
          this.nounModifierImageTable().nounModifierImageData,
        selectedModifier: Modifier,
      }),
      () => {
        this.fetchModifiersOfSelectedVersionAndNoun();
      }
    );
  };
  //#endregion

  //#region Fetch Modifiers Of Selected Version And Noun
  fetchModifiersOfSelectedVersionAndNoun = () => {
    const UserID = helper.getUser();
    const VersionNameOrNo = this.state.selectedVersionNameOrNo;
    this.setState({
      spinnerMessage: "Loading Noun-Modifier Template List...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifiersTemplateList(UserID, VersionNameOrNo)
      .then((response) => {
        let filteredModifiers = response.data
          .filter(
            (data) =>
              data.VersionNameOrNo === this.state.selectedVersionNameOrNo &&
              data.Noun.toLowerCase() === this.state.selectedNoun.toLowerCase()
          )
          .map((data) => ({ Modifier: data.Modifier }));
        const createdOnEntry = response.data.find(
          (data) =>
            data.VersionNameOrNo === this.state.selectedVersionNameOrNo &&
            data.Noun === this.state.selectedNoun
        );
        const formatDate = (dateString) => {
          const options = { day: "2-digit", month: "short", year: "numeric" };
          const date = new Date(dateString);
          return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
        };
        const releaseDate = createdOnEntry
          ? formatDate(createdOnEntry.CreatedOn)
          : "";
        this.setState({
          modifiersList: filteredModifiers,
          releaseDate: releaseDate,
          loading: false,
        });
        this.fetchSynonymData();
      })
      .catch((error) => {
        console.error("Error fetching nouns:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Synonym Data
  fetchSynonymData = () => {
    this.setState({
      spinnerMessage: "Please wait while loading Noun Synonym Details...",
      loading: true,
    });
    mroDictionaryService
      .readNounSynonymDetailsFromSelectedVersion(
        this.state.selectedVersionNameOrNo,
        this.state.selectedNoun
      )
      .then((response) => {
        this.setState({
          synonymList: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching noun synonym data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Synonym Guidelines Data
  fetchSynonymGuidelines = () => {
    this.setState({
      spinnerMessage: "Please wait while loading Noun Synonym Guidelines...",
      loading: true,
    });
    const { selectedVersionNameOrNo, selectedNoun } = this.state;
    mroDictionaryService
      .readNounSynonymDetailsFromSelectedVersion(
        selectedVersionNameOrNo,
        selectedNoun
      )
      .then((response) => {
        let filteredSynonym = response.data
          .filter((data) => data.Synonym === this.state.selectedSynonym)
          .map((data) => data.SynonymDefinitionOrGuidelines);
        this.setState({
          synonymDefinitionOrGuidelines: filteredSynonym,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching noun synonym data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Attribute Data
  fetchAttributeDetails = () => {
    const { selectedVersionNameOrNo, selectedNoun, selectedModifier } =
      this.state;
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Details...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifierAttributeDetailsFromSelectedVersion(
        selectedVersionNameOrNo,
        selectedNoun,
        selectedModifier
      )
      .then((response) => {
        const { AttributeGuidelines } = response.data || {};
        this.setState({
          attributeData: response.data,
          attributeGuidelines: AttributeGuidelines || "",
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching attribute data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Attribute Data
  fetchAttributeGudelines = () => {
    const { selectedVersionNameOrNo, selectedNoun, selectedModifier } =
      this.state;
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Guidelines...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifierAttributeDetailsFromSelectedVersion(
        selectedVersionNameOrNo,
        selectedNoun,
        selectedModifier
      )
      .then((response) => {
        let filteredAttributeGuidelines = response.data
          .filter((data) => data.Attribute === this.state.selectedAttribute)
          .map((data) => data.AttributeGuidelines);
        this.setState({
          attributeGuidelines: filteredAttributeGuidelines,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching attribute data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Attribute Data
  fetchNounModifierDetails = () => {
    const { selectedVersionNameOrNo, selectedNoun, selectedModifier } =
      this.state;
    this.setState({
      spinnerMessage: "Please wait while loading Noun Definition Details...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifierDetailsFromSelectedVersion(
        selectedVersionNameOrNo,
        selectedNoun,
        selectedModifier
      )
      .then((response) => {
        const { NounDefinition, NounModifierDefinitionOrGuidelines } =
          response.data || {};
        this.setState({
          nounDefinition: NounDefinition || "",
          nounModifierDefinitionOrGuidelines:
            NounModifierDefinitionOrGuidelines || "",
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching attribute data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Fetch Attribute Values Data
  fetchAttributeValuesData = () => {
    const { selectedVersionNameOrNo, selectedNoun, selectedModifier } =
      this.state;
    this.setState({
      spinnerMessage: "Please wait while loading Attribute Values Details...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifierAttributeValuesDetailsFromSelectedVersion(
        selectedVersionNameOrNo,
        selectedNoun,
        selectedModifier
      )
      .then((response) => {
        let filteredAttributeValues = response.data
          .filter((data) => data.Attribute === this.state.selectedAttribute)
          .map((data) => ({
            EnumeratedValidValue: data.EnumeratedValidValue,
            Priority: data.Priority,
          }));
        this.setState({
          attributeEVVList: filteredAttributeValues,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching attribute data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region Select the Modifier
  handleModifierSelect = (modifier) => {
    if (this.props.showMroDictionaryViewerModal) {
      this.props.AssignNounModifier(this.state.selectedNoun, modifier);
    }
    this.setState({ selectedModifier: modifier }, () => {
      this.fetchAttributeDetails();
      this.fetchUNSPSCData();
      this.fetchNounMidifierImageData();
      this.fetchNounModifierDetails();
    });
  };
  //#endregion

  //#region Select the Synonym
  handleSynonymSelect = (synonym) => {
    this.setState({ selectedSynonym: synonym }, () => {
      this.fetchSynonymGuidelines();
    });
  };
  //#endregion

  //#region Select the Attribute
  handleAttributeSelect = (attribute, rowId) => {
    this.setState(
      {
        selectedAttribute: attribute,
        activeRowId: rowId,
      },
      () => {
        this.fetchAttributeValuesData();
        this.fetchAttributeGudelines();
      }
    );
  };
  //#endregion

  //#region Select the Attribute EVV
  handleAttributeEVVSelect = (enumeratedValidValue) => {
    this.setState(
      { selectedEnumeratedValidValue: enumeratedValidValue },
      () => { }
    );
  };
  //#endregion

  //#region Select the Synonym Action
  handleSynonymAction = (synonym) => {
    if (!this.state.selectedVersionNameOrNo) {
      toast.error(
        "Version name or number is mandatory before selecting a noun.",
        { autoClose: false }
      );
      return;
    }
    this.setState(
      {
        selectedSynonym: synonym,
        selectedNoun: synonym,
        nounDefinition: "",
        nounModifierDefinitionOrGuidelines: "",
        attributeGuidelines: "",
        modifiersList: [],
        modifierColumns: this.modifierTable().modifierColumns,
        modifierData: this.modifierTable().modifierData,
        synonymColumns: this.synonymTable().synonymColumns,
        synonymList: [],
        synonymDefinitionOrGuidelines: "",
        attributeColumns: this.attributeTable().attributeColumns,
        attributeData: this.attributeTable().attributeData,
        selectedAttribute: "",
        attributeEVVColumns: this.attributeEVVTable().attributeEVVColumns,
        attributeEVVData: this.attributeEVVTable().attributeEVVData,
        attributeEVVList: [],
        selectedEnumeratedValidValue: "",
        unspscColumns: this.unspscTable().unspscColumns,
        unspscData: this.unspscTable().unspscData,
        nounModifierImageColumns:
          this.nounModifierImageTable().nounModifierImageColumns,
        nounModifierImageData:
          this.nounModifierImageTable().nounModifierImageData,
      },
      () => {
        this.fetchModifiersOfSelectedVersionAndNoun();
      }
    );
  };
  //#endregion

  //#region Select the UNSPSC
  handleUNSPSCSelect = (unspscVersion) => {
    this.setState({ selectedUNSPSC: unspscVersion }, () => { });
  };
  //#endregion

  //#region Fetch Attribute Data
  fetchUNSPSCData = () => {
    const { selectedVersionNameOrNo, selectedNoun, selectedModifier } =
      this.state;
    this.setState({
      spinnerMessage: "Please wait while loading UNSPSC Details...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifierUNSPSCDetailsFromSelectedVersion(
        selectedVersionNameOrNo,
        selectedNoun,
        selectedModifier
      )
      .then((response) => {
        this.setState({
          unspscData: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching attribute data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  //#region fetch Noun-Midifier Image Data
  fetchNounMidifierImageData = () => {
    this.setState({
      spinnerMessage: "Please wait while loading Noun-Modifier images...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifierImages(
        this.state.selectedNoun,
        this.state.selectedModifier
      )
      .then((response) => {
        const { data: nounModifierImageData } = response;
        this.setState({
          nounModifierImageData,
          loading: false,
        });
      });
  };
  //#endregion

  //#region Modifier Table
  modifierTable = () => {
    const modifierColumns = [
      {
        accessorKey: "Modifier",
        header: "Modifier",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "20%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },

        Cell: ({ row }) => (
          <div
            className={
              this.state.selectedModifier === row.original.Modifier
                ? "selected-modifier"
                : ""
            }
            onClick={() => this.onChangeModifier(row.original.Modifier)}
          >
            {row.original.Modifier}
          </div>
        ),
      },
    ];
    const modifierData = this.state ? this.state.modifiersList || [] : [];
    return { modifierColumns, modifierData };
  };
  //#endregion

  //#region Synonym Table
  synonymTable() {
    const synonymColumns = [
      {
        accessorKey: "Synonym",
        header: "Synonym",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "80%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
        Cell: ({ row }) => (
          <div onClick={() => this.handleSynonymSelect(row.original.Synonym)}>
            {row.original.Synonym}
          </div>
        ),
      },
      {
        accessorKey: "Action",
        header: "Action",
        enableSorting: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "20%",
          },
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
            onClick={() => this.handleSynonymAction(row.original.Synonym)}
          >
            <i
              className="fa fa-arrow-down pointer"
              style={{
                color: "green",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></i>
          </div>
        ),
      },
    ];
    const synonymList = [];
    return { synonymColumns, synonymList };
  }
  //#endregion

  //#region Attribute Table
  attributeTable() {
    const attributeColumns = [
      {
        accessorKey: "Attribute",
        header: "Attribute Name",
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
        Cell: ({ row }) => (
          <div
            onClick={() =>
              this.handleAttributeSelect(
                row.original.Attribute,
                row.original.id
              )
            }
          >
            {row.original.Attribute}
          </div>
        ),
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
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
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

  //#region Attribute EVV Table
  attributeEVVTable() {
    const attributeEVVColumns = [
      {
        accessorKey: "EnumeratedValidValue",
        header: "Enumerated Vaild Value (EVV)",
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: "60%",
          },
        },
        muiTableBodyCellProps: {
          align: "left",
        },
        Cell: ({ row }) => (
          <div
            onClick={() =>
              this.handleAttributeEVVSelect(
                row.original.EnumeratedValidValue,
                row.original.id
              )
            }
          >
            {row.original.EnumeratedValidValue}
          </div>
        ),
      },
      {
        accessorKey: "Priority",
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
    ];
    const attributeEVVData = this.state
      ? this.state.attributeEVVList || []
      : [];
    return { attributeEVVColumns, attributeEVVData };
  }
  //#endregion

  //#region UNSPSC Table
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
        Cell: ({ row }) => (
          <div
            onClick={() =>
              this.handleUNSPSCSelect(row.original.UNSPSCVersion, row.original.id)
            }
          >
            {row.original.UNSPSCVersion}
          </div>
        ),
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
          align: "left",
        },
      },
    ];
    const unspscData = [];
    return { unspscColumns, unspscData };
  }
  //#endregion

  //#region Noun-Modifier Image table
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
    ];
    const nounModifierImageData = addedNounModifierImages.map((image) => ({
      Name: image.Name,
      Data: image.Data,
    }));
    return { nounModifierImageColumns, nounModifierImageData };
  };
  //#endregion

  //#region Render
  render() {
    const {
      synonymColumns,
      synonymList,
      attributeColumns,
      attributeData,
      unspscColumns,
      unspscData,
      nounModifierImageColumns,
      nounModifierImageData,
    } = this.state;
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    return (
      <div
        style={setHeight(93)}
        className="production-update-main vewnm mrodictvew mroDictionaryViewerMainContent"
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
                paddingLeft: "0px",
                paddingRight: "0px",
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
                <div className="row mg-r-15 mg-l-0 mg-t-15 mg-b-0">
                  <div className="col-lg-6">
                    <div className="createnm mroDictionayViewrVersionSelected">
                      <FloatingLabel
                        label="MRO Dictionary Version Name / No."
                        className="float-hidden float-select"
                      >
                        <select
                          className="form-control"
                          id="version"
                          name="version"
                          value={this.state.selectedVersionNameOrNo || ""}
                          onChange={this.onChangeMRODictionaryVersion}
                        >
                          <option>
                            ---Select MRO Dictionary Version Name / No.---
                          </option>
                          {this.state.mroDictionaryVersionsList.map((opt) => (
                            <option
                              key={opt.versionNameOrNo}
                              value={opt.versionNameOrNo}
                            >
                              {opt.VersionNameOrNo}
                            </option>
                          ))}
                        </select>
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createnm mroDictionaryInputDate mroViewer releaseDate">
                      <FloatingLabel
                        label="Release Date"
                        className="float-hidden float-select"
                      >
                        <input
                          type="text"
                          className="react-select-container-list form-control form add-basefare-input myfrm"
                          classNamePrefix="react-select-list"
                          value={this.state.releaseDate}
                          disabled
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
                <div className="row mg-r-15 mg-l-0 mg-t-15 mg-b-10 mroDictionaryTextareaContent">
                  <div className="col-lg-6">
                    <div className="createnm mroDictionarySelectNoun">
                      <FloatingLabel
                        label="Noun"
                        className="float-hidden float-select"
                      >
                        <Autocomplete
                          freeSolo
                          id="noun"
                          name="noun"
                          className="autocomplete-custom selectNounText"
                          options={this.state.nounList.map((nounItem) =>
                            nounItem.toUpperCase()
                          )}
                          value={
                            this.state.selectedNoun
                              ? this.state.selectedNoun.toUpperCase()
                              : null
                          }
                          onChange={(event, newValue) => {
                            this.onChangeNoun(
                              newValue ? newValue.toUpperCase() : ""
                            );
                          }}
                          inputValue={
                            this.state.selectedNoun
                              ? this.state.selectedNoun.toUpperCase()
                              : ""
                          }
                          onInputChange={(event, newInputValue) => {
                            this.setState({
                              selectedNoun: newInputValue.toUpperCase(),
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                this.state.selectedNoun ? "" : "Select Noun"
                              }
                              fullWidth
                            />
                          )}
                          renderOption={(props, nounItem) => (
                            <li {...props} key={nounItem}>
                              {nounItem.toUpperCase()}
                            </li>
                          )}
                          style={{ width: "100%", padding: "0px" }}
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createnm mroDictionaryInputDate mroViewer nounDefinitionText">
                      <FloatingLabel
                        label="Noun Definition"
                        className="float-hidden float-select"
                      >
                        <TextField
                          className="resizable-textfield mroDictionaryNounDefinition"
                          id="Details"
                          value={this.state.nounDefinition}
                          inputProps={{ maxLength: 4000 }}
                          multiline
                          rows={1}
                          col={100}
                          variant="outlined"
                          disabled
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            style: {
                              color: "#999",
                            },
                            sx: {
                              "&::placeholder": {
                                color: "#999",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mroDictionaryViewerContent">
            <Col lg={9} style={{ paddingLeft: "25px" }}>
              <Row>
                <Col lg={4} style={{ paddingRight: "0px", overflow: "auto" }}>
                  <div
                    style={{
                      border: "1px solid #cdd4e0",
                      borderTop: "0px",
                      borderRight: "0px",
                      borderRightColor: "#fff",
                    }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-10 pd-b-10">
                      <ToolkitProvider keyField="modifier">
                        {() => (
                          <div className="mg-t-0">
                            <div className="pdqcmro masters-material-table nmtable mrodicttble mroDictionaryListTable">
                              <MaterialReactTable
                                columns={this.modifierTable().modifierColumns}
                                data={this.modifierTable().modifierData}
                                enableColumnFilterModes={true}
                                enableColumnOrdering={false}
                                enableRowSelection={false}
                                enableFullScreenToggle={false}
                                enablePagination={false}
                                enableStickyHeader={true}
                                muiTableBodyRowProps={({ row }) => ({
                                  className:
                                    this.state.selectedModifier ===
                                    row.original.Modifier
                                      ? "row-active"
                                      : "",
                                  onClick: () =>
                                    this.handleModifierSelect(
                                      row.original.Modifier
                                    ),
                                })}
                                renderTopToolbarCustomActions={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "15px",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span>
                                      <b>Modifier</b>
                                    </span>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleExport}>
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
                                  </Box>
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                  </div>
                  <div
                    style={{
                      border: "1px solid #cdd4e0",
                      borderTop: "0px",
                      borderRight: "0px",
                      borderRightColor: "#fff",
                    }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-10 pd-b-10 ">
                      <ToolkitProvider keyField="id">
                        {() => (
                          <div className="mg-t-0">
                            <div className="pdqcmro masters-material-table nmtable mrodicttble mroDictionaryListTable">
                              <MaterialReactTable
                                columns={attributeColumns}
                                data={attributeData}
                                enableColumnFilterModes={true}
                                enableColumnOrdering={false}
                                enableRowSelection={false}
                                enableFullScreenToggle={false}
                                enablePagination={false}
                                enableStickyHeader={true}
                                muiTableBodyRowProps={({ row }) => ({
                                  className:
                                    this.state.selectedAttribute ===
                                    row.original.Attribute
                                      ? "row-active"
                                      : "",
                                  onClick: () =>
                                    this.handleAttributeSelect(
                                      row.original.Attribute
                                    ),
                                })}
                                renderTopToolbarCustomActions={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "15px",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span>
                                      <b>Attributes</b>
                                    </span>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleExport}>
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
                                  </Box>
                                )}
                                getRowProps={(row) => ({
                                  style: {
                                    backgroundColor:
                                      this.state.activeRowId === row.original.id
                                        ? "#e0e0e0"
                                        : "transparent",
                                    cursor: "pointer",
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
                <Col lg={4} style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                  <div
                    style={{
                      border: "1px solid #cdd4e0",
                      borderTop: "0px",
                      borderRight: "0px",
                      borderRightColor: "#fff",
                    }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-10 pd-b-10">
                      <ToolkitProvider keyField="id">
                        {() => (
                          <div className="mg-t-0">
                            <div className="pdqcmro masters-material-table nmtable mrodicttble mroDictionaryListTable">
                              <MaterialReactTable
                                columns={synonymColumns}
                                data={synonymList}
                                enableColumnFilterModes={true}
                                enableColumnOrdering={false}
                                enableRowSelection={false}
                                enableFullScreenToggle={false}
                                enablePagination={false}
                                enableStickyHeader={true}
                                muiTableBodyRowProps={({ row }) => ({
                                  className:
                                    this.state.selectedSynonym ===
                                    row.original.Synonym
                                      ? "row-active"
                                      : "",
                                  onClick: () =>
                                    this.handleSynonymSelect(
                                      row.original.Synonym
                                    ),
                                })}
                                renderTopToolbarCustomActions={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "15px",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span>
                                      <b>Synonym</b>
                                    </span>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleExport}>
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
                    style={{
                      border: "1px solid #cdd4e0",
                      borderTop: "0px",
                      borderRight: "0px",
                      borderRightColor: "#fff",
                    }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-10 pd-b-10 ">
                      <ToolkitProvider keyField="attribute">
                        {() => (
                          <div className="mg-t-0">
                            <div className="pdqcmro masters-material-table nmtable mrodicttble mroDictionaryListTable">
                              <MaterialReactTable
                                columns={
                                  this.attributeEVVTable().attributeEVVColumns
                                }
                                data={this.attributeEVVTable().attributeEVVData}
                                enableColumnFilterModes={true}
                                enableColumnOrdering={false}
                                enableRowSelection={false}
                                enableFullScreenToggle={false}
                                enablePagination={false}
                                enableStickyHeader={true}
                                muiTableBodyRowProps={({ row }) => ({
                                  className:
                                    this.state.selectedEnumeratedValidValue ===
                                    row.original.EnumeratedValidValue
                                      ? "row-active"
                                      : "",
                                  onClick: () =>
                                    this.handleAttributeEVVSelect(
                                      row.original.EnumeratedValidValue
                                    ),
                                })}
                                renderTopToolbarCustomActions={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "16px",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span>
                                      <b>Enumerated valid value</b>
                                    </span>
                                    <Tooltip title="Download CSV">
                                      <IconButton onClick={this.handleExport}>
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
                <Col
                  lg={4}
                  style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    overflow: "auto",
                    border: "1px solid #cdd4e0",
                    borderTop: "0px",
                  }}
                  className="mroDictionaryViewerTextarea  nounModifierDefinitionText"
                >
                  <div
                    style={{ border: "none" }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-10 pd-b-10">
                      <FloatingLabel
                        label="Noun Modifier Definition / Guidelines"
                        className="float-hidden float-select"
                      >
                        <TextField
                          className="resizable-textfield"
                          id="Details"
                          value={this.state.nounModifierDefinitionOrGuidelines}
                          inputProps={{ maxLength: 4000 }}
                          multiline
                          rows={3}
                          col={300}
                          variant="outlined"
                          size="small"
                          style={{ width: "100%" }}
                          disabled
                          InputProps={{
                            style: {
                              color: "#999",
                            },
                            sx: {
                              "&::placeholder": {
                                color: "#999",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div
                    style={{
                      border: "none",
                      borderTop: "0px",
                      borderBottom: "0px",
                    }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-15 pd-b-10">
                      <FloatingLabel
                        label="Synonym Definition / Guidelines"
                        className="float-hidden float-select"
                      >
                        <TextField
                          className="resizable-textfield"
                          id="Details"
                          inputProps={{ maxLength: 4000 }}
                          value={this.state.synonymDefinitionOrGuidelines}
                          multiline
                          rows={3}
                          col={300}
                          variant="outlined"
                          disabled
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            style: {
                              color: "#999",
                            },
                            sx: {
                              "&::placeholder": {
                                color: "#999",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div
                    style={{ border: "none", borderTop: "0px" }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-15 pd-b-10">
                      <FloatingLabel
                        label="Attribute Guidelines"
                        className="float-hidden float-select"
                      >
                        <TextField
                          className="resizable-textfield"
                          id="Details"
                          inputProps={{ maxLength: 4000 }}
                          value={this.state.attributeGuidelines}
                          multiline
                          rows={3}
                          col={300}
                          variant="outlined"
                          disabled
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            style: {
                              color: "#999",
                              background: "#fff",
                            },
                            sx: {
                              "&::placeholder": {
                                color: "#999",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                </Col>
                <Col lg={12} style={{ paddingRight: "0px" }}>
                  <div
                    style={{ border: "1px solid #cdd4e0", borderTop: "0px" }}
                    className="mg-l-0 mg-r-0 mg-t-0"
                  >
                    <div className="col-md-12 pd-t-10 pd-b-10 ">
                      <ToolkitProvider keyField="id">
                        {() => (
                          <div className="mg-t-0">
                            <div className="pdqcmro masters-material-table mroDictionaryViewerTable mroDictionaryListTable">
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
                                muiTableBodyRowProps={({ row }) => ({
                                  className:
                                    this.state.selectedUNSPSC ===
                                    row.original.UNSPSCVersion
                                      ? "row-active"
                                      : "",
                                  onClick: () =>
                                    this.handleUNSPSCSelect(
                                      row.original.UNSPSCVersion
                                    ),
                                })}
                                renderTopToolbarCustomActions={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "15px",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className="ViewTableContent">
                                      <span>
                                        <b>UNSPSC</b>
                                      </span>
                                      <div>
                                        <Tooltip title="Download CSV">
                                          <IconButton
                                            onClick={
                                              this.unspscDatahandleExport
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
                                      </div>
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
              </Row>
            </Col>
            <Col lg={3} style={{ paddingLeft: "0px", paddingRight: "20px" }}>
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
                  <ToolkitProvider keyField="id">
                    {() => (
                      <div className="mg-t-0 viewmaincontent">
                        <div className="pdqcmro masters-material-table nmtable unspcimg mroDictionaryViewerTableImages">
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
                            style={{ height: "calc(100vh - 490px)" }}
                          />
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </Col>
            <div className="nmsvntnsview">
              {!this.state.isToHideRefresh && 
              <Button
                variant="secondary"
                className="vewsubmit-button"
                style={{ width: "100px" }}
                  onClick={() => {
                    this.setState({ activeMroDictionaryTab: "nounModifierTemplateList" }, () => {
                      this.refreshData(); 
                    });
                  }}
              >
                <i class="fa fa-refresh mr-1"></i>Refresh
              </Button>
              }
            </div>
          </Row>
        </LoadingOverlay>
      </div>
    );
  }
}

export default withRouter(MroDictionaryViewer);
