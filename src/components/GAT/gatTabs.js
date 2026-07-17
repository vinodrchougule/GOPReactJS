import React, { useState, useEffect } from "react";
import { Tab, Container, Row, Col } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import helper from "../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";

// --- Import Icons ---
import { IoIosArrowDown } from "react-icons/io";
import {
  FaExchangeAlt,
  FaFileCode,
  FaFileMedicalAlt,
  FaSearch,
  FaCog,
  FaCoins,
  FaFileAlt,
  FaSortAlphaDown,
  FaLevelUpAlt,
  FaPercent,
  FaEye,
  FaPenFancy,
  FaDraftingCompass,
  FaRegCheckCircle,
  FaCompressAlt,
  FaExpandAlt,
  FaBarcode,
  FaPencilAlt,
  FaSearchPlus,
  FaBroom,
  FaClipboardList,
  FaClone,
  FaMicroscope,
  FaRegCalendarCheck,
  FaRulerCombined,
  FaFileExcel,
} from "react-icons/fa";

// --- Import all utility components ---
import TransposeHtoV from "./TransposeHtoV";
import TransposeVtoH from "./TransposeVtoH";
import FindMissingWords from "./FindMissingWords";
import AbbreviateFile from "./AbbreviateFile";
import CalculateAttributeValueFillPercentage from "./CalculateAttributeValueFillPercentage";
import DescriptionGenerator from "./DescriptionGenerator";
import HighlightMandatoryAttributes from "./HighlightMandatoryAttributes";
import DictionaryCheck from "./DictionaryCheck";
import MapUNSPSCLevels from "./MapUNSPSCLevels";
import NumberSearch from "./NumberSearch";
import ReOrderColumnValues from "./ReOrderColumnValues";
import FuzzyValueFixer from "./FuzzyValueFixer";
import SamplingSelection from "./SamplingSelection";
import MRODictionaryAttributeValues from "./MRODictionaryAttributeValues";
import StrengthAndFormExtraction from "./StrengthAndFormExtraction";
import NMAutoClassifier from "./NMAutoClassifier";
import FindSameDrugs from "./FindSameDrugs";
import OEMDescriptionGenerator from "./OEMDescriptionGenerator";
import STPSplitAttributeValue from "./STPSplitAttributeValue";
import STPInputFormatConversion from "./STPInputFormatConversion";
import STPDescriptionGenerator from "./STPDescriptionGenerator";
import CharacterLengthSplitter from "./CharacterLengthSplitter";
import TextReplacer from "./TextReplacer";
import TermAnalysis from "./TermAnalysis";
import ItemSpendAnalysis from "./ItemSpendAnalysis.js";
import RemoveDuplicateWords from "./RemoveDuplicateWords";
import PETGuidelines from "./PETGuidelines.js";
import DuplicatesCheckOnNMAndAttributes from "./DuplicatesCheckOnNMAndAttributes.js";
import DuplicatesCheckOnAttributes from "./DuplicatesCheckOnAttributes.js";
import DuplicatesCheckOnMultipleColumns from "./DuplicatesCheckOnMultipleColumns.js";
import ProductionVsQACheck from "./ProductionVsQACheck.js";
import DuplicatesCheckGeneric from "./DuplicatesCheckGeneric.js";
import AttributeValueConsistencyCheck from "./AttributeValueConsistencyCheck.js";
import MergeMultipleWorksheets from "./MergeMultipleWorksheets.js";
import TXTtoXLSXConverter from "./TXTtoXLSXConverter.js";
import XLSXToVAMSConverter from "./ConvertXlsxDataToVAMSTemplate.js";
import XLSXtoTXTConverter from "./XLSXtoTXTConverter.js";
import XLSXtoCSVConverterForVAMS from "./XLSXtoCSVforVAMS.js"

// --- Define and SORT the Flat List of All Tools ---
const allTools = [
  {
    key: "transposeHtoV",
    label: "Transpose H to V",
    Component: TransposeHtoV,
    category: "Engineering",
    Icon: FaExchangeAlt,
    color: "#007bff",
  },
  {
    key: "transposeVtoH",
    label: "Transpose V to H",
    Component: TransposeVtoH,
    category: "Engineering",
    Icon: FaExchangeAlt,
    color: "#17a2b8",
  },
  {
    key: "reOrderColumnValues",
    label: "Re-Order Column Values",
    Component: ReOrderColumnValues,
    category: "Engineering",
    Icon: FaSortAlphaDown,
    color: "#28a745",
  },
  {
    key: "characterLengthSplitter",
    label: "Character Length Splitter",
    Component: CharacterLengthSplitter,
    category: "Engineering",
    Icon: FaCompressAlt,
    color: "#dc3545",
  },
  {
    key: "stpSplitAttributeValue",
    label: "STP Split Attribute Value",
    Component: STPSplitAttributeValue,
    category: "Engineering",
    Icon: FaExpandAlt,
    color: "#ffc107",
  },
  {
    key: "abbreviateFile",
    label: "Abbreviate File",
    Component: AbbreviateFile,
    category: "Engineering",
    Icon: FaFileAlt,
    color: "#6f42c1",
  },
  {
    key: "fuzzyValueFixer",
    label: "Fuzzy Value Fixer",
    Component: FuzzyValueFixer,
    category: "Engineering",
    Icon: FaPenFancy,
    color: "#fd7e14",
  },
  {
    key: "samplingSelection",
    label: "Sampling Selection",
    Component: SamplingSelection,
    category: "Engineering",
    Icon: FaEye,
    color: "#20c997",
  },
  {
    key: "stpInputFormatConversion",
    label: "STP Input Format Conversion",
    Component: STPInputFormatConversion,
    category: "Engineering",
    Icon: FaFileCode,
    color: "#e83e8c",
  },
  {
    key: "findMissingWords",
    label: "Find Missing, Repeated, and New Words",
    Component: FindMissingWords,
    category: "Engineering",
    Icon: FaSearch,
    color: "#6c757d",
  },
  {
    key: "dictionaryCheck",
    label: "Dictionary Check",
    Component: DictionaryCheck,
    category: "Engineering",
    Icon: FaRegCheckCircle,
    color: "#00adb5",
  },
  {
    key: "calculateAttributeValueFillPercentage",
    label: "Calculate Attribute Fill Percentage",
    Component: CalculateAttributeValueFillPercentage,
    category: "Engineering",
    Icon: FaPercent,
    color: "#343a40",
  },
  {
    key: "highlightMandatoryAttributes",
    label: "Highlight Mandatory Attributes",
    Component: HighlightMandatoryAttributes,
    category: "Engineering",
    Icon: FaEye,
    color: "#18978F",
  },
  {
    key: "numberSearch",
    label: "Number Search",
    Component: NumberSearch,
    category: "Engineering",
    Icon: FaSearch,
    color: "#FF7B54",
  },
  {
    key: "mroDictionaryAttValues",
    label: "MRO Dictionary Attribute Values",
    Component: MRODictionaryAttributeValues,
    category: "Engineering",
    Icon: FaBarcode,
    color: "#3C40C6",
  },
  {
    key: "descriptionGenerator",
    label: "Description Generator",
    Component: DescriptionGenerator,
    category: "Engineering",
    Icon: FaDraftingCompass,
    color: "#7FBC41",
  },
  {
    key: "oemDescriptionGenerator",
    label: "OEM Description Generator",
    Component: OEMDescriptionGenerator,
    category: "Engineering",
    Icon: FaDraftingCompass,
    color: "#F7A325",
  },
  {
    key: "stpDescriptionGenerator",
    label: "STP Description Generator",
    Component: STPDescriptionGenerator,
    category: "Engineering",
    Icon: FaDraftingCompass,
    color: "#D91C8B",
  },
  {
    key: "mapUNSPSCLevels",
    label: "Map UNSPSC Levels",
    Component: MapUNSPSCLevels,
    category: "Engineering",
    Icon: FaLevelUpAlt,
    color: "#2E7C31",
  },
  {
    key: "nmAutoClassifier",
    label: "Noun-Modifier Auto. Classifier",
    Component: NMAutoClassifier,
    category: "Engineering",
    Icon: FaCog,
    color: "#FF5722",
  },
  {
    key: "petGuidelines",
    label: "PET Guidelines",
    Component: PETGuidelines,
    category: "Engineering",
    Icon: FaClipboardList,
    color: "#eb164bff",
  },
  {
    key: "duplicatesCheckOnNMAndAttributes",
    label: "Duplicates Check on NM and Attributes",
    Component: DuplicatesCheckOnNMAndAttributes,
    category: "Engineering",
    Icon: FaClone,
    color: "#1b18c9ff",
  },
  {
    key: "duplicatesCheckOnAttributes",
    label: "Duplicates Check on Attributes",
    Component: DuplicatesCheckOnAttributes,
    category: "Engineering",
    Icon: FaClone,
    color: "#1b18c9ff",
  },
  {
    key: "duplicatesCheckOnMultipleColumns",
    label: "Duplicates Check on Multiple Columns",
    Component: DuplicatesCheckOnMultipleColumns,
    category: "Engineering",
    Icon: FaClone,
    color: "#1b18c9ff",
  },
  {
    key: "attributeValueConsistencyCheck",
    label: "Attribute Value Consistency Check",
    Component: AttributeValueConsistencyCheck,
    category: "Engineering",
    Icon: FaRegCalendarCheck,
    color: "rgb(201, 130, 24)",
  },
  {
    key: "duplicatesCheckGeneric",
    label: "Duplicates Check Generic",
    Component: DuplicatesCheckGeneric,
    category: "Engineering",
    Icon: FaClone,
    color: "#1b18c9ff",
  },
  {
    key: "productionVsQACheck",
    label: "Production v/s QA Check",
    Component: ProductionVsQACheck,
    category: "Engineering",
    Icon: FaMicroscope,
    color: "rgba(218, 95, 38, 0.6)",
  },
  {
    key: "mergeMultipleWorksheets",
    label: "Merge Multiple Worksheets",
    Component: MergeMultipleWorksheets,
    category: "Engineering",
    Icon: FaRulerCombined,
    color: "rgba(218, 98, 38, 0.6)",
  },
  {
    key: "strengthAndFormExtraction",
    label: "Strength and Form Extraction",
    Component: StrengthAndFormExtraction,
    category: "Healthcare",
    Icon: FaFileMedicalAlt,
    color: "#9c27b0",
  },
  {
    key: "findSameDrugs",
    label: "Find Same Drugs",
    Component: FindSameDrugs,
    category: "Healthcare",
    Icon: FaFileMedicalAlt,
    color: "#e91e63",
  },
  {
    key: "textReplacer",
    label: "Text Replacer",
    Component: TextReplacer,
    category: "Healthcare",
    Icon: FaPencilAlt,
    color: "#e91e63",
  },
  {
    key: "termAnalysis",
    label: "Term Analysis",
    Component: TermAnalysis,
    category: "Healthcare",
    Icon: FaSearchPlus,
    color: "#e91e63",
  },
  {
    key: "itemSpendAnalysis",
    label: "Item Spend Analysis",
    Component: ItemSpendAnalysis,
    category: "Healthcare",
    Icon: FaCoins,
    color: "#ad329dff",
  },
  {
    key: "removeDuplicateWords",
    label: "Remove Duplicate Words",
    Component: RemoveDuplicateWords,
    category: "Healthcare",
    Icon: FaBroom,
    color: "#b3b6b3ff",
  },
  {
    key: "txtToxlsxConverter",
    label: "txt / csv To xlsx Converter",
    Component: TXTtoXLSXConverter,
    category: "Healthcare",
    Icon: FaFileExcel,
    color: "#b3b6b3ff",
  },
  {
    key: "xlsxToVAMSConverter",
    label: "xlsx to VAMS Template Converter",
    Component: XLSXToVAMSConverter,
    category: "Healthcare",
    Icon: FaFileExcel,
    color: "#b3b6b3ff",
  },
  {
    key: "xlsxTotxtConverter",
    label: "xlsx to txt Converter",
    Component: XLSXtoTXTConverter,
    category: "Healthcare",
    Icon: FaFileExcel,
    color: "#b3b6b3ff",
  },
  {
    key: "xlsxTocsvConverterForVAMS",
    label: "xlsx to csv Converter for VAMS",
    Component: XLSXtoCSVConverterForVAMS,
    category: "Healthcare",
    Icon: FaFileExcel,
    color: "#b3b6b3ff",
  },
].sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())); // Alphabetical sort by Label

// --- Mega Menu Dropdown Component ---
const MegaMenuContent = ({
  toolsToDisplay,
  activeKey,
  toggle,
  navLeftOffset,
}) => {
  const linkStyle = (isCurrentActive) => ({
    cursor: "pointer",
    padding: "6px 12px",
    color: isCurrentActive ? "#5E41FC" : "#333",
    backgroundColor: "transparent",
    borderRadius: "4px",
    whiteSpace: "normal",
    transition: "color 0.2s, background-color 0.2s",
    fontWeight: isCurrentActive ? "600" : "400",
    width: "100%",
    textAlign: "left",
    textDecoration: "none",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    border: "none",
  });

  const liStyle = { marginBottom: "0.1rem" };

  const megaMenuDropdownStyle = {
    position: "absolute",
    left: `-${navLeftOffset}px`,
    width: "100vw",
    zIndex: 1000,
    backgroundColor: "white",
    top: "100%",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    borderTop: "1px solid #ddd",
    padding: "30px 60px",
    minHeight: "150px",
    display: "flex",
  };

  const numColumns = 4;
  const colWidth = 12 / numColumns;
  const toolsPerCol = Math.ceil(toolsToDisplay.length / numColumns);

  const distributedColumns = Array(numColumns)
    .fill()
    .map((_, i) => ({
      tools: toolsToDisplay.slice(i * toolsPerCol, (i + 1) * toolsPerCol),
    }));

  const handleMouseEnter = (e) => {
    const button = e.currentTarget.querySelector("button");
    if (button) {
      button.style.backgroundColor = "#007bff";
      button.style.color = "#ffffff";
      button.querySelector("svg").style.color = "#ffffff";
    }
  };

  const handleMouseLeave = (e, item) => {
    const button = e.currentTarget.querySelector("button");
    if (button) {
      const isCurrentActive = activeKey === item.key;
      button.style.backgroundColor = "transparent";
      button.style.color = isCurrentActive ? "#5E41FC" : "#333";
      button.querySelector("svg").style.color = item.color;
    }
  };

  const renderTools = (tools) => (
    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
      {tools.map((item) => {
        const isCurrentActive = activeKey === item.key;
        const IconComponent = item.Icon;
        return (
          <li
            key={item.key}
            style={liStyle}
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseLeave={(e) => handleMouseLeave(e, item)}
          >
            <button
              onClick={() => toggle(item.key)}
              style={linkStyle(isCurrentActive)}
            >
              <IconComponent
                style={{
                  marginRight: "10px",
                  fontSize: "1.2em",
                  color: item.color,
                }}
              />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="mega-menu-dropdown" style={megaMenuDropdownStyle}>
      <Row className="w-100">
        {distributedColumns.map(
          (column, index) =>
            column.tools.length > 0 && (
              <Col key={index} md={colWidth}>
                {renderTools(column.tools)}
              </Col>
            ),
        )}
      </Row>
    </div>
  );
};

// --- Main Component ---
export default function GATNavigation() {
  const [loading] = useState(false);
  const [spinnerMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Set default active component (using key, but it will be found in sorted list)
  const [activeKey, setActiveKey] = useState("transposeHtoV");

  const [navLeftOffset, setNavLeftOffset] = useState(0);

  const toggle = (key) => {
    setActiveKey(key);
    setShowDropdown(false);
  };

  // Memoize components object to avoid re-renders
  // const allComponents = useMemo(() => {
  //   let components = {};
  //   allTools.forEach((item) => {
  //     components[item.key] = item.Component;
  //   });
  //   return components;
  // }, []);

  useEffect(() => {
    const topBar = document.getElementById("gat-top-menu-bar");
    if (topBar) {
      setNavLeftOffset(topBar.getBoundingClientRect().left);
    }
  }, []);

  return (
    <div>
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
        <Container fluid>
          <Row>
            <Col xs={12}>
              <div
                className="top-menu-bar-container"
                onMouseLeave={() => setShowDropdown(false)}
                id="gat-top-menu-bar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderBottom: "1px solid #ddd",
                  position: "relative",
                  height: "50px",
                  padding: "0 20px",
                }}
              >
                <div
                  className="gat-dropdown-trigger"
                  onClick={() => setShowDropdown(!showDropdown)}
                  onMouseEnter={() => setShowDropdown(true)}
                  style={{
                    cursor: "pointer",
                    padding: "10px 15px",
                    fontWeight: showDropdown ? "600" : "400",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: showDropdown ? "2px solid #5E41FC" : "none",
                    marginBottom: "-1px",
                  }}
                >
                  GAT
                  <IoIosArrowDown
                    style={{ marginLeft: "5px", fontSize: "0.8em" }}
                  />
                </div>

                {showDropdown && (
                  <MegaMenuContent
                    toolsToDisplay={allTools}
                    activeKey={activeKey}
                    toggle={toggle}
                    navLeftOffset={navLeftOffset}
                  />
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Tab.Container activeKey={activeKey}>
                <Tab.Content className="mt-4">
                  {allTools.map((item) => {
                    const Component = item.Component;
                    return (
                      <Tab.Pane key={item.key} eventKey={item.key}>
                        <Component />
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>
    </div>
  );
}
