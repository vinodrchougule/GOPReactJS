import React, { useState } from "react";
import WorkflowHeader from "../../../src/assets/petGuidelinesImages/Workflow Header.png";
import ModelNumbers from "../../../src/assets/petGuidelinesImages/Model Numbers.png";
import NounModifierSpecificRules from "../../../src/assets/petGuidelinesImages/Noun-Modifier Specific Rules.png";
import ManufacturerName1 from "../../../src/assets/petGuidelinesImages/Manufacturer name 1.png";
import ManufacturerName2 from "../../../src/assets/petGuidelinesImages/Manufacturer name 2.png";
import ManufacturerName3 from "../../../src/assets/petGuidelinesImages/Manufacturer name 3.png";
import ABB from "../../../src/assets/petGuidelinesImages/ABB.png";
import Weidmuller from "../../../src/assets/petGuidelinesImages/Weidmuller.png";
import PepperlFuchs1 from "../../../src/assets/petGuidelinesImages/PepperlFuchs1.png";
import PepperlFuchs2 from "../../../src/assets/petGuidelinesImages/PepperlFuchs2.png";
import PepperlFuchs3 from "../../../src/assets/petGuidelinesImages/PepperlFuchs3.png";
import PepperlFuchs4 from "../../../src/assets/petGuidelinesImages/PepperlFuchs4.png";

const boldTextStyle = {
  fontFamily: '"Arial", sans-serif',
  color: "black",
  fontSize: "10.0pt",
  fontWeight: "bold",
};

const textStyle = {
  fontFamily: '"Arial", sans-serif',
  fontSize: "10.0pt",
};

const data1 = [
  { poles: 2, f50: 3000, f60: 3600 },
  { poles: 4, f50: 1500, f60: 1800 },
  { poles: 6, f50: 1000, f60: 1200 },
  { poles: 8, f50: 750, f60: 900 },
  { poles: 10, f50: 600, f60: 720 },
  { poles: 12, f50: 500, f60: 600 },
];

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  maxWidth: "500px",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
  margin: "20px auto",
};

const headerCellStyle = {
  backgroundColor: "#e1f5fe",
  color: "#333",
  padding: "10px",
  borderBottom: "1px solid #f0f0f0",
  fontWeight: "bold",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #f0f0f0",
  color: "#444",
};

const polesCellStyle = {
  ...cellStyle,
  fontWeight: "bold",
  backgroundColor: "#f9f9f9", // Slight tint for the poles column
};

const data = [
  { metric: "6", imperial: "1/8" },
  { metric: "8", imperial: "1/4" },
  { metric: "10", imperial: "3/8" },
  { metric: "15", imperial: "1/2" },
  { metric: "20", imperial: "3/4" },
  { metric: "25", imperial: "1" },
  { metric: "32", imperial: "1-1/4" },
  { metric: "40", imperial: "1-1/2" },
  { metric: "50", imperial: "2" },
  { metric: "65", imperial: "2-1/2" },
  { metric: "80", imperial: "3" },
  { metric: "90", imperial: "3-1/2" },
  { metric: "100", imperial: "4" },
  { metric: "150", imperial: "6" },
  { metric: "200", imperial: "8" },
  { metric: "250", imperial: "10" },
  { metric: "300", imperial: "12" },
  { metric: "350", imperial: "14" },
  { metric: "400", imperial: "16" },
  { metric: "450", imperial: "18" },
  { metric: "500", imperial: "20" },
  { metric: "550", imperial: "22" },
  { metric: "600", imperial: "24" },
  { metric: "650", imperial: "26" },
  { metric: "700", imperial: "28" },
  { metric: "750", imperial: "30" },
  { metric: "800", imperial: "32" },
  { metric: "900", imperial: "36" },
  { metric: "1000", imperial: "40" },
  { metric: "1050", imperial: "42" },
  { metric: "1100", imperial: "44" },
  { metric: "1200", imperial: "48" },
  { metric: "1300", imperial: "52" },
  { metric: "1400", imperial: "56" },
  { metric: "1500", imperial: "60" },
  { metric: "1600", imperial: "64" },
  { metric: "1700", imperial: "68" },
  { metric: "1800", imperial: "72" },
  { metric: "1900", imperial: "76" },
  { metric: "2000", imperial: "80" },
  { metric: "2200", imperial: "88" },
];

const tolerances = [
  { unit: 'Plus 0.003"', ex: "(+0.003IN)" },
  { unit: "Minus 0.003", ex: "(-0.003IN)" },
  { unit: 'Plus or Minus 0.003"', ex: "(+/-0.003IN)" },
  { unit: 'Plus 0.003" or Minus 0.005"', ex: "(+0.003/-0.005IN)" },
];

const fractionStyleData = [
  { f1: "1/64", d1: "0.016", f2: "33/64", d2: "0.516" },
  { f1: "1/32", d1: "0.031", f2: "17/32", d2: "0.531" },
  { f1: "3/64", d1: "0.047", f2: "35/64", d2: "0.547" },
  { f1: "1/16", d1: "0.063", f2: "9/16", d2: "0.563" },
  { f1: "5/64", d1: "0.078", f2: "37/64", d2: "0.578" },
  { f1: "3/32", d1: "0.094", f2: "19/32", d2: "0.594" },
  { f1: "7/64", d1: "0.109", f2: "39/64", d2: "0.609" },
  { f1: "1/8", d1: "0.125", f2: "5/8", d2: "0.625" },
  { f1: "9/64", d1: "0.141", f2: "41/64", d2: "0.641" },
  { f1: "5/32", d1: "0.156", f2: "21/32", d2: "0.656" },
  { f1: "11/64", d1: "0.172", f2: "43/64", d2: "0.672" },
  { f1: "3/16", d1: "0.188", f2: "11/16", d2: "0.688" },
  { f1: "13/64", d1: "0.203", f2: "45/64", d2: "0.703" },
  { f1: "7/32", d1: "0.219", f2: "23/32", d2: "0.719" },
  { f1: "15/64", d1: "0.234", f2: "47/64", d2: "0.734" },
  { f1: "1/4", d1: "0.250", f2: "3/4", d2: "0.750" },
  { f1: "17/64", d1: "0.266", f2: "49/64", d2: "0.766" },
  { f1: "9/32", d1: "0.281", f2: "25/32", d2: "0.781" },
  { f1: "19/64", d1: "0.297", f2: "51/64", d2: "0.797" },
  { f1: "5/16", d1: "0.313", f2: "13/16", d2: "0.813" },
  { f1: "21/64", d1: "0.328", f2: "53/64", d2: "0.828" },
  { f1: "11/32", d1: "0.344", f2: "27/32", d2: "0.844" },
  { f1: "23/64", d1: "0.359", f2: "55/64", d2: "0.859" },
  { f1: "3/8", d1: "0.375", f2: "7/8", d2: "0.875" },
  { f1: "25/64", d1: "0.391", f2: "57/64", d2: "0.891" },
  { f1: "13/32", d1: "0.406", f2: "29/32", d2: "0.906" },
  { f1: "27/64", d1: "0.422", f2: "59/64", d2: "0.922" },
  { f1: "7/16", d1: "0.438", f2: "15/16", d2: "0.938" },
  { f1: "29/64", d1: "0.453", f2: "61/64", d2: "0.953" },
  { f1: "15/32", d1: "0.469", f2: "31/32", d2: "0.969" },
  { f1: "31/64", d1: "0.484", f2: "63/64", d2: "0.984" },
];

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div style={{ marginBottom: "4px", fontFamily: "sans-serif" }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          backgroundColor: "#b1302e", // Deep red from image
          color: "white",
          padding: "12px 20px",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textTransform: "uppercase",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: "25px",
            border: "2px solid #f9a825", // Orange border
            borderRadius: "8px",
            marginTop: "10px",
            backgroundColor: "#fff",
            lineHeight: "1.6",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const styles = {
  accordionHeader: {
    width: "100%",
    backgroundColor: "#b1302e",
    color: "white",
    padding: "12px 20px",
    border: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    fontFamily: '"Arial", sans-serif',
    fontWeight: "bold",
    fontSize: "14px",
  },
  contentContainer: {
    padding: "25px",
    border: "2px solid #f9a825",
    borderRadius: "0 0 8px 8px",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
  },
  table: {
    width: "100%",
    maxWidth: "400px",
    borderCollapse: "collapse",
    fontFamily: '"Arial", sans-serif',
    fontSize: "10.0pt", // Requested size
    color: "black",
  },
  th: {
    borderTop: "1pt solid rgb(228, 246, 255)",
    borderBottom: "1pt solid rgb(228, 246, 255)",
    padding: "8px 10px",
    textAlign: "left",
    fontWeight: "bold",
  },
  td: {
    padding: "8px 10px",
    borderBottom: "1pt solid rgb(228, 246, 255)",
    verticalAlign: "top",
  },
  shadedRow: {
    backgroundColor: "rgb(246, 252, 255)", // Light blue shade from source
  },
};

// Data extracted from the provided HTML
const diameterData = [
  { label: "DN (mm)", value: "Value include UoM", isHeader: true },
  { label: "6", value: "DN6" },
  { label: "8", value: "DN8" },
  { label: "10", value: "DN10" },
  { label: "15", value: "DN15" },
  { label: "20", value: "DN20" },
  { label: "25", value: "DN25" },
  { label: "32", value: "DN32" },
  { label: "40", value: "DN40" },
  { label: "50", value: "DN50" },
  { label: "65", value: "DN65" },
  { label: "80", value: "DN80" },
  { label: "100", value: "DN100" },
  { label: "150", value: "DN150" },
  { label: "200", value: "DN200" },
  { label: "250", value: "DN250" },
  { label: "300", value: "DN300" },
  { label: "350", value: "DN350" },
  { label: "400", value: "DN400" },
  { label: "450", value: "DN450" },
  { label: "500", value: "DN500" },
  { label: "550", value: "DN550" },
  { label: "600", value: "DN600" },
  { label: "650", value: "DN650" },
  { label: "700", value: "DN700" },
  { label: "750", value: "DN750" },
  { label: "800", value: "DN800" },
  { label: "900", value: "DN900" },
  { label: "1000", value: "DN1000" },
  { label: "1050", value: "DN1050" },
];

const PETGuidelines = () => {
  const [openSection, setOpenSection] = useState("");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
      {/* CLEANING LEVELS */}
      <AccordionItem
        title="CLEANING LEVELS"
        isOpen={openSection === "CLEANING LEVELS"}
        onClick={() => toggleSection("CLEANING LEVELS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={{ margin: "0 0 5px 0" }}>
            3.1 Cleaning Level - Origin approval
          </h4>
          <p style={{ margin: "0 0 20px 0" }}>
            This project will have a blended cleaning level approach. This means
            that the default cleaning will be dependent on the quality of data
            provided and if the data cleaning team can enhance this data.&nbsp;
          </p>
          <p style={{ margin: "0 0 20px 0" }}>
            The following describes the range of possible cleaning levels that
            could be specified if required.
          </p>
          <h4>
            <span>3.2 Level 1: Classify and Match</span>
          </h4>
          <ul>
            <li>
              <span style={textStyle}>Extract noun-modifier pairs;</span>
            </li>
            <li>
              <span style={textStyle}>
                Map noun-modifier pairs to a global classification standard
                and/or Customer classification;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Extract and standardize manufacturer names into a separate
                manufacturer name field;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Extract manufacturer&rsquo;s part number into a separate
                manufacturer part number field;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Generate short and long item master descriptions, per the
                defined rules;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Identify suspected duplicates based on manufacturer name and
                part number;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Word analysis and dictionary enhancement;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Review results via Quality Assurance process.
              </span>
            </li>
          </ul>
          <br />
          <h4>
            <span>
              3.3 Level 2: Normalisation and Attribute Value Extraction
            </span>
          </h4>
          <ul>
            <li style={textStyle}>
              <span>Level 1 above, plus:</span>
            </li>
            <li>
              <span style={textStyle}>
                Extract available attribute values into appropriate attribute
                label fields, with their related units of measure;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Review new attribute values to ensure naming conventions and
                units of measure are correct and consistent. New attribute
                values are approved, corrected, or merged into previously
                existing values;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Data outside standard attribute fields are added to a notes
                field;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Identify functional duplicates based on the noun, modifier, and
                attribute values.
              </span>
            </li>
          </ul>
          <br />
          <h4>
            <span>3.4 Level 3: Enhance and Research</span>
          </h4>
          <ul>
            <li>
              <span style={textStyle}>Level 2 above, plus:</span>
            </li>
            <li>
              <span style={textStyle}>
                Use the information provided by the manufacturer and supplier
                name and part numbers to conduct web-based and/or catalogue
                research to investigate items and:
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Identify ambiguous or missing noun-modifiers,&nbsp;
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Identify ambiguous or missing attribute values,&nbsp;
              </span>
            </li>
            <li>
              <span style={textStyle}>Resolve suspected duplicates,</span>
            </li>
            <li>
              <span style={textStyle}>
                Attempt to complete missing attribute information.
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Update manufacturer name and part number
              </span>
            </li>
          </ul>
          <br />
          <h4>
            <span style={textStyle}> 3.5 Level 3: Commodity materials</span>
          </h4>
          <p>
            For commodity materials such as Stud Bolts, Gaskets, Piping &amp;
            Pipe Fittings the manufacturer &amp; part number should not be
            included in the long description where there is sufficient
            information to build a full technical description.&nbsp;
          </p>
          <h4>
            <span style={textStyle}>3.6 Web research</span>
          </h4>
          <p>
            All research lines require a reference (web or otherwise) to confirm
            where the additional information was found. Please indicate where it
            can be found for example the page number of a PDF or Catalogue and
            the URL of a webpage.
          </p>
          <p>
            If two URL&rsquo;s are considered necessary, add the second one to
            research notes. If no reference is found, indicate this by adding
            &ldquo;No Further Information&rdquo; in the research panel.
          </p>
          For multi-page references, the Page Number should be indicated in
          Research Notes
          <br />
          <br />
          <h4>
            <span style={{ background: "yellow" }}>3.7 Level 4: Walk-down</span>
          </h4>
          <p>
            <span style={{ background: "yellow" }}>
              This involves the physical inspection of the item to determine the
              manufacturer and technical information.
            </span>
          </p>
          <p>
            <span style={{ background: "yellow" }}>
              Define where cleaners are to flag a line for level 4
            </span>
          </p>
        </section>
      </AccordionItem>
      {/* PROJECT WORKFLOW */}
      <AccordionItem
        title="PROJECT WORKFLOW"
        isOpen={openSection === "PROJECT WORKFLOW"}
        onClick={() => toggleSection("PROJECT WORKFLOW")}
      >
        <h4>
          <span>4.1 Masterpiece workflow</span>
        </h4>
        <br />
        <p>
          <span>
            <img
              src={WorkflowHeader}
              alt="Workflow Header"
              style={{ marginRight: "5px" }}
            />
          </span>
        </p>
        <ul>
          <li>
            <span style={textStyle}>
              The Data Cleaning Production team will take the line from
              &ldquo;Scanned&rdquo; or &ldquo;In Progress&rdquo; to
              &ldquo;Checked&rdquo;.&nbsp;
            </span>
          </li>
          <li>
            <span style={textStyle}>
              Data Cleaning Production QC takes the line from
              &ldquo;Checked&rdquo; to &ldquo;Quality Controlled&rdquo;.
            </span>
          </li>
          <li>
            <span style={textStyle}>
              Petrofac QA takes the line from &ldquo;Quality Controlled&rdquo;
              to &ldquo;Quality Approved&rdquo;.&nbsp;
            </span>
          </li>
          <li>
            <span style={textStyle}>
              Origin takes the line from &ldquo;Quality Approved&rdquo; to
              &ldquo;Accepted&rdquo;.
            </span>
          </li>
        </ul>
        <h4>
          <span>4.2 Pending</span>
        </h4>
        <p style={textStyle}>
          If the original data has conflicting information or cannot be
          understood, the line should be sent to Pending via the C-Screen or
          Mass Assign for further clarification or more information. This is
          known as raising an issue.
        </p>

        <ul>
          <li>
            <span style={textStyle}>
              In both cases, when the Pending status is selected a box will
              appear which must be completed with details of the problem.
            </span>
          </li>
          <li>
            <span style={textStyle}>
              This will raise an email to SparesFinder QA who will escalate the
              issue to Petrofac via the agreed escalation process.
            </span>
          </li>
        </ul>
        <br />
        <h4>
          <span>4.3 Rejections/ Rework</span>
        </h4>
        <p>
          <span style={textStyle}>
            If a line is rejected though the Petrofac QA process, it will be
            sent to rework through the Masterpiece tool. Clarifications will be
            sent to Origin to help resolve the lines where input is required.
          </span>
        </p>
      </AccordionItem>
      {/* DICTIONARY */}
      <AccordionItem
        title="DICTIONARY"
        isOpen={openSection === "DICTIONARY"}
        onClick={() => toggleSection("DICTIONARY")}
      >
        <h4>
          <span style={boldTextStyle}>
            5.1 NOUNS, MODIFIFIERS, ATTRIBUTE &amp; ATTRIBUTE VALUES
          </span>
        </h4>
        <p style={textStyle}>
          Nouns and modifiers used together as a noun-modifier pair are the key
          elements of a catalogued item. Noun-modifier pairings enable the
          allocation of a range of specific attributes unique to that pairing.
        </p>
        <br />
        <p style={textStyle}>
          A noun is defined as a word that is used to name a Family, Class, or
          Commodity. The noun can function as the subject or object to identify
          services and materials. The noun may comprise of more than one word to
          clearly define the object catalogued.
        </p>
        <br />
        <p style={textStyle}>
          A modifier is defined as a word that qualifies or limits the sense of
          the noun. The modifier may comprise of more than one word to clearly
          define the object being catalogued.
        </p>
        <br />
        <p style={textStyle}>
          An attribute is a feature or specification that defines a
          characteristic of a product. Attributes shall have a logical
          relationship to the noun-modifier pair they describe. Attributes are
          classified as either preferred (need to have), or non-preferred (nice
          to have).
        </p>
        <br />
        <p style={textStyle}>
          If cleaners require new nouns, modifiers or attribute labels, an email
          should be sent to Petrofac including the noun, modifier, or attribute
          label required, including a sample line. The request will be reviewed
          and approved with Origin.
        </p>
        <br />
        <h4>
          <span style={boldTextStyle}>5.2 UNAPPROVED ATTRIBUTE VALUES</span>
        </h4>
        <p style={textStyle}>
          Consistency in the attribute data is imperative for search
          functionality. Accuracy is the MOST important factor when entering
          catalogue data.&nbsp;
        </p>
        <br />
        <p>
          <span style={textStyle}>
            New attribute values added to the dictionary will be reviewed
            regularly to ensure consistency in the attribute values.
          </span>
        </p>
      </AccordionItem>
      {/* OUTPUT SETTINGS */}
      <AccordionItem
        title="OUTPUT SETTINGS"
        isOpen={openSection === "OUTPUT SETTINGS"}
        onClick={() => toggleSection("OUTPUT SETTINGS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={{ margin: "0 0 5px 0" }}>6.1 ABBREVIATIONS</h4>
          <p style={{ margin: "0 0 20px 0" }}>
            Abbreviations are generated automatically based on the output
            setting, therefore attribute values (i.e. 316 stainless steel,
            spiral wound, printed circuit board) shall be written in full and
            abbreviated as per the approved Origin abbreviations.
          </p>

          <h4 style={{ margin: "0 0 5px 0" }}>6.2 LETTER CASE</h4>
          <p style={{ margin: "0 0 20px 0" }}>
            The letter case for all entries in the Item Master and associated
            tables shall be UPPER Case, output settings can adjust as required.
          </p>

          <h4 style={{ margin: "0 0 5px 0" }}>6.3 DELIMITERS</h4>
          <p style={{ margin: "0 0 20px 0" }}>
            Delimiters are generated by the output settings for each of the
            description components i.e. prefix & Postfix for the Noun, Modifier,
            attributes, and attribute values.
          </p>

          <h4 style={{ margin: "0 0 5px 0" }}>6.4 SPACES</h4>
          <p style={{ margin: "0" }}>
            No leading or trailing spaces are to be entered in the Description
            Value field. The spaces between values and UoM are defined in
            Delimiter settings.
          </p>
        </section>
      </AccordionItem>
      {/* LANGUAGE */}
      <AccordionItem
        title="LANGUAGE"
        isOpen={openSection === "LANGUAGE"}
        onClick={() => toggleSection("LANGUAGE")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>
              7.1 ALL DATA TO BE CLEANSED IN UK ENGLISH.
            </span>
          </h4>
          <br />
          <span style={textStyle}>
            UK English is the language that shall be used for both the
            dictionary and the attributes.
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Example 1: Colour:
            Grey (UK English)
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Not Colour: Gray (US
            English)
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Example 2: Noun:
            Gauge (UK English)
          </span>
          <br />
          <span style={textStyle}>
            &bull; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Not Noun: Gage (US
            English)
          </span>
        </section>
      </AccordionItem>
      {/* UOM & COMPANY MAPPING */}
      <AccordionItem
        title="UOM & COMPANY MAPPING"
        isOpen={openSection === "UOM & COMPANY MAPPING"}
        onClick={() => toggleSection("UOM & COMPANY MAPPING")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={boldTextStyle}>8.1 MATERIAL UNIT OF VALUE</h4>
          <p style={textStyle}>
            A Unit of Measure (UoM) is a definite magnitude of a physical
            quantity. UoM&rsquo;s should reflect the minimum measurement a
            physical item can be purchased as. UoM&rsquo;s are standardised and
            shall conform to the current Origin.
          </p>
          <p style={textStyle}>
            The clean UoM are generated via a UoM mapping table linking the old
            ERP UoM to the new ERP UoM value
          </p>
          <h4>
            <span style={boldTextStyle}>8.2 THE COMPANY NAMES</span>
          </h4>
          <p style={textStyle}>
            Company names (manufacturer &amp; supplier) are automatically mapped
            from the original ERP names in Oracle &amp; Ellipse to a
            standardised clean name. &nbsp;
          </p>
          <p style={textStyle}>
            Refer to section 11 for management of change for company names; new
            names, changing names, updating name type;
            manufacturer/vendor/alternate.
          </p>
        </section>
      </AccordionItem>
      {/* PART NUMBERS */}
      <AccordionItem
        title="PART NUMBERS"
        isOpen={openSection === "PART NUMBERS"}
        onClick={() => toggleSection("PART NUMBERS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <p style={textStyle}>
            A key goal of data cleaning is to populate the actual manufacturer
            part number for all materials except commodity materials that can be
            ordered via technical description; pipe gaskets, stud bolts, piping
            etc.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>9.1 BLANK PART NUMBERS</span>
          </h4>
          <p style={textStyle}>
            Where the part number field is blank and the OEM part number is
            visible in the short description, this part number is to be inserted
            into the part number field.
          </p>
          <h4>
            <span style={boldTextStyle}>9.2 DELETIONS</span>
          </h4>
          <p style={textStyle}>
            Where the part number appears to be wrong and no correct part number
            can be found, an issue should be raised to Petrofac for
            clarification and escalation to the client as required.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>9.3 ADDITIONAL PART NUMBERS</span>
          </h4>
          <p style={textStyle}>
            If the part number field is populated and an additional part number
            is provided in the short and/or long description, the cleaner will
            attempt to verify the correct part number and insert the other
            number in the clean supplier details of the C-Screen.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              9.4 SYSTEM-GENERATED AND/OR SMART PART NUMBERS
            </span>
          </h4>
          <p style={textStyle}>
            System-generated and/or smart part numbers are to be excluded from
            the manufacturer part number field. If cleaners identify these
            numbers, they are to be queried with sparesFinder for further
            analysis.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>9.5 REPLACEMENTS/SUPERSESSIONS</span>
          </h4>
          <p style={textStyle}>
            Where there is a reference to &ldquo;replaced by&rdquo; or
            &ldquo;superseded by&rdquo;, the old original part number will be
            added as a superseded part number&nbsp;
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>9.6 LENGTH</span>
          </h4>
          <p style={textStyle}>
            Manufacturer part-numbers should not be less than 3 characters in
            length.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              9.7 ITEMS WITHOUT UNIQUE PART NUMBERS
            </span>
          </h4>
          <p style={textStyle}>
            Where the parts are known to have different dimensions but
            traditionally have the same part number, add an extension to the
            part number to make it unique i.e. size reference of the item using
            the format &ndash; XL, 2 e.g.
          </p>
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Gloves 1234-XL
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Gloves 1234-L
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Gloves 1234-M
          </span>
          <br />
          <span style={textStyle}>
            The parts below are likely to fall into this category:
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;PPE - shoes, boots,
            clothing
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Taper lock bushings
            (SK x 1-1/2)
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Sprockets with bores
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Pulleys with bores
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Drive couplings that
            use trade size as the &nbsp; part number will need bore size
          </span>
          <br />
          <span style={textStyle}>
            If there is uncertainty, then any issues should be raised through
            Masterpiece and sent to Petrofac for clarification or escalation to
            Origin for resolution.
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>9.8 LEGACY PART NUMBERS</span>
          </h4>
          <span style={textStyle}>
            Type, Model or Series numbers shall not be loaded as a part
            number.&emsp;
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>
              9.9 MANUFACTURERS WITH MULTIPLE PART NUMBERS
            </span>
          </h4>
          <br />
          <span style={textStyle}>
            The following manufacturers include multiple identifiers, the
            following guidelines must be followed for ABB, Weidmuller &amp;
            Pepperl + Fuchs
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>9.9.1 ABB</span>
          </h4>
          <ul>
            <li>
              <span style={textStyle}>
                The Manufacturer P/N is the Product ID
              </span>
            </li>
            <li>
              <span style={textStyle}>
                The Model Number is the Extended Product Type
              </span>
            </li>
            <li>
              <span style={textStyle}>Do not use the EAN!</span>
            </li>
          </ul>
          <br />
          <img width="513" src={ABB} alt="ABB" style={{ marginRight: "5px" }} />
          <br />
          <h4>
            <span style={boldTextStyle}>9.9.2 Weidmuller</span>
          </h4>
          <ul>
            <li>
              <span style={textStyle}>
                The Manufacturer P/N is the Order No.
              </span>
            </li>
            <li>
              <span style={textStyle}>the Model Number is the Type</span>
            </li>
            <li>
              <span style={textStyle}>Do not use the GTIN (EAN)!</span>
            </li>
          </ul>
          <br />
          <img
            width="358"
            src={Weidmuller}
            alt="Weidmuller"
            style={{ marginRight: "5px" }}
          />
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>9.9.3 Pepperl+Fuchs</span>
          </h4>
          <ul>
            <li>
              <span style={textStyle}>
                The Manufacturer P/N is the TYPE i.e.
                <strong>KCD2-STC-1</strong>
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Do not use the Eng. number: <strong>202927</strong>
              </span>
            </li>
          </ul>
          <img
            width="255"
            src={PepperlFuchs1}
            alt="PepperlFuchs1"
            style={{ marginRight: "5px" }}
          />
          <img
            width="29"
            src={PepperlFuchs2}
            alt="PepperlFuchs2"
            style={{ marginRight: "5px" }}
          />
          <img
            width="300"
            src={PepperlFuchs3}
            alt="PepperlFuchs3"
            style={{ marginRight: "5px" }}
          />
          <img
            width="120"
            src={PepperlFuchs4}
            alt="PepperlFuchs4"
            style={{ marginRight: "5px" }}
          />
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>9.10 Amending Part Numbers - PSV</span>
          </h4>
          <br />
          <br />
          <span style={textStyle}>
            Where a PSV has a specific set pressure in the description, this
            information should be added to the clean part number
          </span>
          <br />
          <br />
          <span>
            <span style={{ fontFamily: "Courier New" }}>
              VALVE_PRESSURE RELIEF_CONVENTIONAL_TYPE
              06205_1/2IN_MBSPP_12MM_BRASS_ASTM B249_BRASS_TWIST LIFTING
              DEVICE_VITON_BRASS_STEEL_AIR_<strong>1175KPAG</strong>_AS1271_W/
              SET PRESSURE TEST CERTIFICATE_HEROSE_PN#_
              <strong>06205.0400.0000&nbsp;</strong>
            </span>
          </span>
          <ul>
            <li>
              <b>
                <span style={boldTextStyle}>06205.0400.0000/1175KPAG</span>
              </b>
            </li>
          </ul>
          <h4>
            <span style={boldTextStyle}>
              9.11 AMENDING PART NUMBERS &ndash; PACK SIZE
            </span>
          </h4>
          <br />
          <p>
            Where a material includes a pack size, this information should be
            included in the cleaned Part Number.
          </p>
          <span style={{ fontFamily: "Courier New" }}>
            CHEMICAL_BIOCIDE_KINETIC
            <strong> 550</strong>_LIQUID_<strong>20L</strong>
            \CUBE_KINETIC_PN#_550
          </span>
          <ul>
            <li>
              <b>
                <span style={boldTextStyle}>550/20L</span>
              </b>
            </li>
          </ul>
          <span style={{ fontFamily: "Courier New" }}>
            CHEMICAL_BIOCIDE_KINETIC
            <strong> 550</strong>_LIQUID_<strong>1000L</strong>
            \IBC_KINETIC_PN#_550
          </span>
          <ul>
            <li>
              <b>
                <span style={boldTextStyle}>550/1000L</span>
              </b>
            </li>
          </ul>
          <h4>
            <span style={boldTextStyle}>
              9.12 ITEMS WITHOUT P/N WITH DRAWING &amp; POSITION/ITEM NO
            </span>
          </h4>
          <span style={textStyle}>
            Where an item does not include a manufacturer and the item includes
            a drawing and position number.
          </span>
          <br />
          <span style={textStyle}>
            This can be added to the P/N field as follows:
          </span>
          <p>
            <span style={{ fontFamily: "Courier New" }}>
              SHAFT, STRAIGHT: TO SUIT AUXILIARY OIL PUMP, TO TOSHIBA DWG
              <strong>TA086900</strong>,ITEM <strong>302</strong>.&nbsp;
            </span>
          </p>
          <ul>
            <li>
              <span style={textStyle}>DWG TA086900/302</span>
            </li>
          </ul>
          <h4>
            <span style={boldTextStyle}>
              9.13 TELEMECANIQUE, SQUARE D, MERLIN G - SCHNEIDER
            </span>
          </h4>
          <br />
          <p>
            <span style={textStyle}>
              As Telemecanique, Square D &amp; Merlin Gerin brands were
              purchased by Schneider, any reference to these 3 brands should
              retain these 3 brands as the superseded manufacturer and the clean
              part as Schneider.
            </span>
          </p>
        </section>
      </AccordionItem>
      {/* MODEL NUMBERS */}
      <AccordionItem
        title="MODEL NUMBERS"
        isOpen={openSection === "MODEL NUMBERS"}
        onClick={() => toggleSection("MODEL NUMBERS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={boldTextStyle}>
            <span>10.1 MODEL/FIGURE NUMBERS vs PART-NUMBERS</span>
          </h4>
          <p style={textStyle}>
            Do not enter model numbers or figure numbers in the part number
            field unless it acts as the part number.
          </p>
          <p style={textStyle}>
            These should be entered in part number field with the size, if
            necessary, to prevent incorrect matching.
          </p>
          <p style={textStyle}>
            If there is uncertainty, then any issues should be raised through
            Masterpiece and sent to Petrofac for clarification or escalation to
            Origin for resolution.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>10.2 MODEL NUMBER</span>
          </h4>
          <p style={textStyle}>
            Where the model number is not used as a part number, enter model
            numbers in the Extra Data Tab in the Model Number field:
          </p>
          <p style={textStyle}>
            <img
              src={ModelNumbers}
              alt="Model Numbers"
              style={{ marginRight: "5px" }}
            />
          </p>
          <br />
        </section>
      </AccordionItem>
      {/* MANUFACTURERS */}
      <AccordionItem
        title="MANUFACTURERS"
        isOpen={openSection === "MANUFACTURERS"}
        onClick={() => toggleSection("MANUFACTURERS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <p>
            A key goal of data cleaning is to populate the actual manufacturer
            for all materials where possible, except for commodity materials
            that can be ordered via technical description; pipe gaskets, stud
            bolts, piping etc.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              11.1 MANUFACTURER / DISTRIBUTOR NAME
            </span>
          </h4>
          <p>
            The Manufacturer name is critical to identify and categorise
            material data. &nbsp; It is imperative where a wholesaler name is
            provided that the actual manufacturer number is added.
          </p>
          <p>
            For example, Blackwood&rsquo;s is an MRO wholesaler with its part
            numbers, Blackwood&rsquo;s is a distributor not the manufacturer of
            parts, and the cleaned manufacturer name must reflect that.
          </p>
          <p>Example: Blackwood&rsquo;s Part: &nbsp;03667078, website below:</p>
          <p>
            <img
              width="606"
              src={ManufacturerName1}
              alt="Manufacturer name 1"
              style={{ marginRight: "5px" }}
            />
          </p>
          <p>Is Manufactured by CRC, Part Number 3017</p>
          <br />
          <p>
            <img
              width="54"
              src={ManufacturerName2}
              alt="Manufacturer name 2"
              style={{ marginRight: "5px" }}
            />
            <img
              width="482"
              src={ManufacturerName3}
              alt="Manufacturer name 3"
              style={{ marginRight: "5px" }}
            />
          </p>
          <br />
          <p>
            Known wholesalers will be flagged in Masterpiece for ease of
            identification. &nbsp;
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>11.2 BLANK MANUFACTURERS</span>
          </h4>
          <p>
            Where the manufacturer field is blank and a manufacturer is visible
            in the short and/or long description, this manufacturer is to be
            inserted into the manufacturer field.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>11.3 DELETIONS</span>
          </h4>
          <p>
            Where the manufacturer appears to be wrong and no correct
            manufacturer can be found, any issues should be raised through
            Masterpiece and sent to Petrofac for clarification or escalation to
            Origin for resolution. &ndash; LEVEL 4
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>11.4 ADDITIONAL MANUFACTURERS</span>
          </h4>
          <p>
            If the manufacturer field is populated and an additional
            manufacturer is provided in the short and/or long description, this
            should be captured in the clean supplier details of the
            C-Screen.&nbsp;
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>11.5 NEW MANUFACTURERS</span>
          </h4>
          <p>
            Where a new manufacturer is required an email should be sent to
            Petrofac for validation including the Manufacturer Name required,
            material number, description and URL.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>11.6 LEGACY MANUFACTURER NAMES</span>
          </h4>
          <p>
            UNKNOWN, TBA, TBD, or TBC shall not be loaded as a manufacturer, in
            instances such as these the field shall be left blank or null.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>11.7 MANUFACTURERS vs SUPPLIERS</span>
          </h4>
          <p>
            Ensure that all part numbers and / or names in the manufacturer name
            and part number fields relate to manufacturers and not suppliers. If
            they are supplier details, remove them from the manufacturer fields
            and captured in the clean supplier details of the C-Screen.&nbsp;
          </p>
          <p>
            If the part number is indicated as superseded, then the above
            instruction needs to be followed and the preface of &quot;Superseded
            with&rdquo; added.
          </p>
          <p>
            If the legacy line only contains the vendor or OEM or wholesaler
            details for the manufacturer name and part number. An issue should
            be raised and sent to Petrofac for clarification. &nbsp;
          </p>
        </section>
      </AccordionItem>
      {/* LEGACY DATA INFORMATION */}
      <AccordionItem
        title="LEGACY DATA INFORMATION"
        isOpen={openSection === "LEGACY DATA INFORMATION"}
        onClick={() => toggleSection("LEGACY DATA INFORMATION")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>12.1 SERIES</span>
          </h4>
          <p style={textStyle}>
            Unless otherwise advised put into Purchase Notes.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>12.2 EQUIPMENT TAG NUMBER</span>
          </h4>
          <p style={textStyle}>
            Unless otherwise advised put into Equipment Notes.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>12.3 SERIAL NUMBER</span>
          </h4>
          <p style={textStyle}>
            It is common for suppliers of rotating equipment (pumps, compressors
            and engines) and specialist valves (PSV and complex control valves)
            to request the serial number of the equipment when a spare part or
            replacement unit is ordered. The serial number is used by the
            supplier/distributor to validate the item being ordered is an exact
            match to the original equipment.
          </p>
          <p style={textStyle}>
            To expedite ordering the serial number, model number, drawing number
            and item number (if available) shall be included in the purchasing
            notes for rotating equipment and specialist valves.
          </p>
          <p style={textStyle}>
            For spare parts and replacement units the information will be
            recorded as follows:
          </p>
          <p style={textStyle}>Serial Number #######</p>
          <br />
          <h4>
            <span style={boldTextStyle}>12.4 OLD PART NUMBER</span>
          </h4>
          <p style={textStyle}>
            Include the old part number in the Superseded part number field
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>12.5 ORDER NUMBER</span>
          </h4>
          <p>Unless otherwise advised put into Purchase Notes.</p>
          <br />
          <h4>
            <span style={boldTextStyle}>12.6 LOT NUMBER</span>
          </h4>
          <p style={textStyle}>
            Unless otherwise advised put into Purchase Notes.
          </p>
          <h4>
            <span style={boldTextStyle}>12.7 JOB NUMBER</span>
          </h4>
          <p style={textStyle}>
            Unless otherwise advised put into Purchase Notes.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>12.8 STOCK NUMBER</span>
          </h4>
          <p>
            <span style={textStyle}>
              Unless otherwise advised put into Purchase Notes
            </span>
          </p>
        </section>
      </AccordionItem>
      {/* MODIFIER “ANY” */}
      <AccordionItem
        title="MODIFIER “ANY”"
        isOpen={openSection === "MODIFIER “ANY”"}
        onClick={() => toggleSection("MODIFIER “ANY”")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={boldTextStyle}>
            <span>13.1 ALLOWABLE</span>
          </h4>
          <p style={textStyle}>
            Where possible always assign a modifier to an item to avoid Modifier
            ANY.
          </p>
          <p style={textStyle}>
            If the modifier cannot be determined from the original description
            or part number these lines may be flagged for level 4 to walkdown
            and establish&nbsp;
          </p>
          <p style={textStyle}>
            There are some exceptions, such as O-Ring, Boots, Pants. It is
            acceptable to have the modifier of ANY in these instances
          </p>
        </section>
      </AccordionItem>
      {/* TYPE */}
      <AccordionItem
        title="TYPE"
        isOpen={openSection === "TYPE"}
        onClick={() => toggleSection("TYPE")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>14.1 FUNCTION</span>
          </h4>
          <p style={textStyle}>
            It is important to eliminate potential confusion between Type and
            Function.
          </p>
          <p style={textStyle}>
            The application or function of an item shall form part of the link
            between the spare part and the equipment through the link to the
            Bills of Material, the function of the item is not to be placed in
            the item description.
          </p>
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Example: LAMP_HALOGEN
            not LAMP_HEADLIGHT
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;HEADLIGHT is a
            function and HALOGEN is a type of lamp.
          </span>
          <br />
          <p style={textStyle}>
            Type should not be used to describe the function of the item. There
            are some exceptions, e.g. GASKET, ANY &ndash; with a TYPE of Head,
            Cover etc. When in doubt ask for assistance from Petrofac.
          </p>
          <p style={textStyle}>
            It also should not be used to describe the functional location (Top,
            Bottom, Front ) These should be captured in Construction
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>14.2 GENERIC</span>
          </h4>
          <p style={textStyle}>
            Generic terms such as Complete, Standard and Generic should not be
            used in Type.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              14.3 MANUFACTURER-SPECIFIC INFORMATION
            </span>
          </h4>
          <p>
            <span style={textStyle}>
              The Type attribute is for descriptive information only and not
              Manufacturer or Vendor types such as MS109, or Models or Model
              Numbers.
            </span>
          </p>
        </section>
      </AccordionItem>
      {/* INTERNATIONAL STANDARDS */}
      <AccordionItem
        title="INTERNATIONAL STANDARDS"
        isOpen={openSection === "INTERNATIONAL STANDARDS"}
        onClick={() => toggleSection("INTERNATIONAL STANDARDS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <p style={textStyle}>
            Where international standards (i.e. ASME, ASTM, and API etc.) are
            required these will be stated clearly in the description data and
            shall be entered as follows:
          </p>
          <ul>
            <li>
              <span style={textStyle}>
                When the industry standard is followed by a class rating in
                numerical value then the industry standard and class rating will
                be entered without any spaces e.g. CL600
              </span>
            </li>
            <li>
              <span style={textStyle}>
                When the industry standard is followed by an alphanumeric number
                then the industry standard and class rating will be separated by
                a space e.g. ASTM A105N
              </span>
            </li>
            <li>
              <span style={textStyle}>
                In certain cases, an industry standard and class can also have a
                grade attached. In this case, the industry standard and class
                rating will be separated by a space and the class rating and
                grade joined by a hyphen e.g. ASTM A216-WCB
              </span>
            </li>
            <li>
              <span style={textStyle}>
                In cases where the International standard requires the format
                ASTM A216-WCB, this information must be captured within the
                Material Specification field only and grade will be left blank.
                Ensuring that there is a hyphen between the specification and
                the grade.
              </span>
            </li>
          </ul>
        </section>
      </AccordionItem>
      {/* CONNECTION */}
      <AccordionItem
        title="CONNECTION"
        isOpen={openSection === "CONNECTION"}
        onClick={() => toggleSection("CONNECTION")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <p style={textStyle}>
            Where more than one related physical property needs to be recorded,
            they shall be separated into different attributes separated by a
            delimiter, e.g. 1/2IN BSPF X 1/2IN JICM shall be recorded as 1/2IN
            BSPF X 1/2IN JICM.
          </p>
          <p style={textStyle}>
            If the connection is repetitive (e.g. MNPT X MNPT, MALE X MALE) only
            enter the connection value once (e.g. MNPT, MALE).
          </p>
          <p style={textStyle}>
            If an item has the same industry-standard thread series for both
            ends; e.g. 1/2IN BSPF X 1/2IN BSPF, then the property will be
            encoded as 1/2IN BSPF.
          </p>
        </section>
      </AccordionItem>
      {/* SIZE & NUMERIC ATTRIBUTES */}
      <AccordionItem
        title="SIZE & NUMERIC ATTRIBUTES"
        isOpen={openSection === "SIZE & NUMERIC ATTRIBUTES"}
        onClick={() => toggleSection("SIZE & NUMERIC ATTRIBUTES")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <p style={textStyle}>
            All Line Pipe, Pipe Valves and Pipe fittings will have their size
            identified using the European designation of Diameter Nominal (DN)
            metric e.g. DN50
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              17.1 CONVERSIONS (METRIC AND IMPERIAL)
            </span>
          </h4>
          <p style={textStyle}>
            Do not convert customer data from metric to imperial or vice versa.
            If there is no size information available in the original
            description, raise an issue to Petrofac for clarification.
          </p>
          <h4>
            <span style={boldTextStyle}>17.2 TOLERANCES</span>
          </h4>
          <span style={textStyle}>
            Brackets will enclose all tolerances for units of measurement.&nbsp;
          </span>
          <br />
          <span style={textStyle}>
            The symbol + and - shall be used for Plus or Minus.
          </span>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <table className="w-full max-w-md border-collapse text-sm">
              <thead className="bg-sky-100">
                <tr className="text-sky-900">
                  <th className="p-2 border border-sky-200">Unit of Measure</th>
                  <th className="p-2 border border-sky-200">Example</th>
                </tr>
              </thead>
              <tbody>
                {tolerances.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-sky-50"
                    style={idx % 2 === 0 ? styles.shadedRow : {}}
                  >
                    <td className="p-2 font-semibold">{item.unit}</td>
                    <td className="p-2 text-gray-700">{item.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <h4>
            <span style={boldTextStyle}> 17.3 FRACTIONS AND DECIMALS</span>
          </h4>
          <p style={textStyle}>
            When recording the sizes of products such as bearings, Rotary Shaft
            (Oil) Seals and Belts the measurements recorded by the Original Part
            Manufacturer or Brand in their catalogue shall be used. &nbsp;In
            cases such as Rotary Shaft Seals, decimals may be used to express a
            fraction i.e. 0.375 inches.
          </p>
          <span style={textStyle}>
            Fractions shall not be used to express a decimal of a metric
            measurement such as millimetres e.g. do not use 1.1/2mm when the
            proper style would be 1.5mm. &nbsp;&nbsp;
          </span>
          <br />
          <span style={textStyle}>
            Where fractions of inches need to be converted to decimals of inches
            or vice versa, as in 1/2IN to 0.5IN, use just one decimal
            place.&nbsp;
          </span>
          <br />
          <br />
          <span style={textStyle}>
            &nbsp;The maximum number of decimals points to be used is three:
          </span>
          <ul>
            <li>
              <span style={textStyle}>
                Use oblique strokes (/) when expressing fractions; e.g. 3/8IN.
              </span>
            </li>
            <li>
              <span style={textStyle}>
                Use dashes (-) between whole numbers and fractions; e.g.
                6-1/4IN.
              </span>
            </li>
            <li>
              <span style={textStyle}>
                All other guidelines apply; e.g. a set of dimensions involving
                fractions shall be shown thus: 2FT 1-1/4IN LG.
              </span>
            </li>
            <li>
              <span style={textStyle}>
                When a dimension is expressed in decimal form and is less than
                one (1), place a zero (0) preceding the decimal point; e.g.
                0.137IN.
              </span>
            </li>
          </ul>
          <br />
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>17.4 FRACTION STYLE</span>
          </h4>
          <p style={textStyle}>
            The following chart will be used to convert fractions of inches to
            decimals of inches or vice versa if a conversion is required.
            &nbsp;&nbsp;
          </p>
          <table
            className="w-full border-collapse border-none"
            style={{ width: "100%" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e1f5fe" }}>
                <th className="md-3 py-2 w-1/4" style={{ textAlign: "center" }}>
                  Fraction
                </th>
                <th className="md-3 py-2 w-1/4" style={{ textAlign: "left" }}>
                  Decimal
                </th>
                <th className="md-3 py-2 w-1/4" style={{ textAlign: "left" }}>
                  Fraction
                </th>
                <th className="md-3 py-2 w-1/4" style={{ textAlign: "left" }}>
                  Decimal
                </th>
              </tr>
            </thead>
            <tbody>
              {fractionStyleData.map((row, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.shadedRow : {}}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    {row.f1}
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left">
                    {row.d1}
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left">
                    {row.f2}
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] border-r border-r-[#e4f6ff] text-left">
                    {row.d2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <h4>
            <span style={boldTextStyle}>17.5 VOLTAGES</span>
          </h4>
          <p style={textStyle}>
            International legislation harmonised the standardisation of
            voltages. Any piece of equipment rated at 230V will work with 240V
            supply. For the same reasons of consistency, the following table
            shall be used when adding attribute values for voltages.
          </p>
          <p style={textStyle}>
            The Units of Measure to use are VAC (Volts Alternating Current) and
            VDC (Volts Direct Current).
          </p>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <table className="w-full border-collapse border-none">
              <thead>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <th
                    className="p-2 border border-sky-200 w-1/2"
                    style={{ textAlign: "center" }}
                  >
                    If
                  </th>
                  <th
                    className="p-2 border border-sky-200 w-1/2"
                    style={{ textAlign: "left" }}
                  >
                    Use
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    100
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left">
                    110
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    110
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left"></td>
                </tr>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    120
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left"></td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    220
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left">
                    230
                  </td>
                </tr>
                <tr>
                  <td
                    className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold"
                    style={{ backgroundColor: "#e1f5fe" }}
                  >
                    230
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left"></td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    240
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left"></td>
                </tr>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    400
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left">
                    400
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    410
                  </td>
                  <td
                    className="py-2 px-4 border-b border-[#e4f6ff] text-left"
                    style={{ backgroundColor: "#e1f5fe" }}
                  ></td>
                </tr>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    415
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left"></td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    420
                  </td>
                  <td
                    className="py-2 px-4 border-b border-[#e4f6ff] text-left"
                    style={{ backgroundColor: "#e1f5fe" }}
                  ></td>
                </tr>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    670
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left">
                    690
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    680
                  </td>
                  <td
                    className="py-2 px-4 border-b border-[#e4f6ff] text-left"
                    style={{ backgroundColor: "#e1f5fe" }}
                  ></td>
                </tr>
                <tr style={{ backgroundColor: "#e1f5fe" }}>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    700
                  </td>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-left"></td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-[#e4f6ff] text-center font-bold">
                    710
                  </td>
                  <td
                    className="py-2 px-4 border-b border-[#e4f6ff] text-left"
                    style={{ backgroundColor: "#e1f5fe" }}
                  ></td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <h4>
            <span style={boldTextStyle}>17.6 CURRENT</span>
          </h4>
          <p>
            Current is expressed as amps. Many electrical products have
            attributes expressed as a range of amps. Where this happens, the
            range shall be expressed by listing the lower value first then the
            higher value separated by the word &ldquo;TO&rdquo; in UPPER CASE.
            &nbsp;&nbsp;
          </p>
          <p>
            Where the range includes a low value, median value and high value,
            the median value shall be excluded leaving just the low and high
            values. &nbsp;
          </p>
          <p>Example: 0.5 / 1.4 / 4.1 becomes 0.5 TO 4.1</p>
          <p>
            When recording the amperage for an item with a rating less than one
            ampere it should be recorded as Milliamperes (MA), except where it
            is nominated in a range (as per above). When it is nominated as a
            single attribute then it should be recorded as follows. Example:
            0.25A should be recorded as 250MA.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              17.7 POLES &ndash; AC ELECTRIC MOTORS
            </span>
          </h4>
          <p>
            Poles shall be used as an attribute value of Rotational Speed for AC
            Electric Motors, e.g. MOTOR_AC_2P not MOTOR_AC_3100RPM.&nbsp;
          </p>
          <br />
          <p>
            The table below shows the typical speed and related poles.&nbsp;
          </p>
          <br />
          <div style={{ padding: "20px" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th rowSpan="3" style={headerCellStyle}>
                    Poles
                  </th>
                  <th colSpan="2" style={headerCellStyle}>
                    Frequency(Hz)
                  </th>
                </tr>
                <tr>
                  <th style={{ ...headerCellStyle, backgroundColor: "white" }}>
                    50
                  </th>
                  <th style={{ ...headerCellStyle, backgroundColor: "white" }}>
                    60
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="2"
                    style={{ ...headerCellStyle, backgroundColor: "white" }}
                  >
                    Synchronous RPM
                  </th>
                </tr>
              </thead>
              <tbody>
                {data1.map((row) => (
                  <tr key={row.poles}>
                    <td style={polesCellStyle}>{row.poles}</td>
                    <td style={cellStyle}>{row.f50}</td>
                    <td style={cellStyle}>{row.f60}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </AccordionItem>
      {/* PACKAGE SIZE */}
      <AccordionItem
        title="PACKAGE SIZE"
        isOpen={openSection === "PACKAGE SIZE"}
        onClick={() => toggleSection("PACKAGE SIZE")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <p>
            When package data is included in the description, it is to be
            recorded in the following format, UoM followed by the package size,
            e.g. PK/10. Where the UoM provides sufficient information to the
            package data then only the size of the item needs to be entered in
            the description e.g. 205L where the UoM is drum.
          </p>
          <h4>
            <span style={boldTextStyle}>18.1 REPETITIVE SIZES</span>
          </h4>
          <p>
            If the pipe or tubing size is repetitive (1/2x1/2) only enter the
            size value once (1/2).
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>18.2 REDUCING SIZES</span>
          </h4>
          <p>Reducing sizes will be entered large to small (10X8).</p>
          <br />
          <h4>
            <span style={boldTextStyle}>18.3 TRAILING ZEROES</span>
          </h4>
          <p>
            Trailing zeroes should be removed from all sizes, regardless of the
            noun/modifier (1.500 = 1.5).
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>18.4 MULTIPLE VALUES</span>
          </h4>
          <p>
            If there is more than one numeric, they should be written as
            follows: 3 X 5 or 1-1/2 X 3 with one space between X and the
            numbers.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              18.5 PIPING, FLANGE &amp; VALVE SIZE CONVERSIONS
            </span>
          </h4>
          <p>
            The following chart will be used to convert Nominal Pipe Size
            (Inches) and Nominal Bore (Inches) to Diameter Nominal
            (Millimetres).
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <table className="w-full text-left border-collapse">
              <thead
                className="bg-[#e4f6ff] text-[10px] leading-tight text-blue-900"
                style={{ backgroundColor: "#e1f5fe" }}
              >
                <tr>
                  <th className="p-1 pl-4 w-1/2">
                    Diameter Nominal (DN) Metric (MM)
                  </th>
                  <th className="p-1 pl-4 w-1/2">
                    Nominal Pipe Size (NPS) Imperial (Inches)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    style={index % 2 === 0 ? styles.shadedRow : {}}
                  >
                    <td style={{ textAlign: "center" }}>
                      <strong>{row.metric}</strong>
                    </td>
                    <td className="p-0.5 pl-4 border-b border-blue-50 text-gray-600">
                      {row.imperial}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </AccordionItem>
      {/* RANGE */}
      <AccordionItem
        title="RANGE"
        isOpen={openSection === "RANGE"}
        onClick={() => toggleSection("RANGE")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>19.1 LOW TO HIGH</span>
          </h4>
          <p style={textStyle}>
            Numbers should be entered low to high and not vice versa.
          </p>
        </section>
      </AccordionItem>
      {/* CONSTRUCTION MATERIALS */}
      <AccordionItem
        title="CONSTRUCTION MATERIALS"
        isOpen={openSection === "CONSTRUCTION MATERIALS"}
        onClick={() => toggleSection("CONSTRUCTION MATERIALS")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={boldTextStyle}>20.1 TYPES AND GRADES</h4>
          <p style={textStyle}>
            304, 316 and others are a TYPE of stainless steel and not a Grade.
            They should be entered with the material as Stainless Steel 304,
            etc.
          </p>
        </section>
      </AccordionItem>
      {/* ATTRIBUTE VALUES */}
      <AccordionItem
        title="ATTRIBUTE VALUES"
        isOpen={openSection === "ATTRIBUTE VALUES"}
        onClick={() => toggleSection("ATTRIBUTE VALUES")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>21.1 USE EXISTING VALUES</span>
          </h4>
          <p style={textStyle}>
            When adding new attribute values, check for proper spelling and try
            to mirror formats, styles and values with those that already exist
            in the list.
          </p>
          <p style={textStyle}>
            Before creating a new attribute value always check existing values
            and ensure that you cannot use a similar existing value. E.g.
            &ldquo;pump rear journal&rdquo; and &ldquo;pump journal rear&rdquo;
            are more than likely the same type item, so use what is there
            instead of creating a new value.
          </p>
          <h4>
            <span style={boldTextStyle}>21.2 SYNONYMS</span>
          </h4>
          <p style={textStyle}>
            Certain words &amp; phrases may have a synonym, in which case if a
            word or phrase is entered as a new value, it will automatically
            change to the correct value.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>21.3 PUNCTUATION</span>
          </h4>
          <p>
            The use of special characters in an item description can impede
            search functionality and so their use shall be restricted where
            possible, a special character that will NEVER be used in the
            description text is the percentage (%) as this is used for wild card
            search functionality.&nbsp;
          </p>
          <div className="p-8 bg-white font-sans text-[#333]">
            <div className="max-w-4xl mx-auto overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-sm">
                    <th className="py-4 px-6 text-center font-bold w-1/3">
                      Rule / Convention
                    </th>
                    <th className="py-4 px-6 text-center font-bold w-1/3">
                      Special Character
                    </th>
                    <th className="py-4 px-6 text-center font-bold w-1/3">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px] leading-relaxed">
                  {/* Group 1: No spaces */}
                  <tr
                    className="bg-[#f2faff]"
                    style={{ backgroundColor: "#e1f5fe" }}
                  >
                    <td
                      rowSpan="3"
                      className="p-4 font-bold align-top border-b border-white"
                    >
                      These special characters must not have a space before or
                      after them
                    </td>
                    <td className="p-2 pl-12 border-b border-white">
                      . &nbsp; Period
                    </td>
                    <td className="p-2 pl-12 border-b border-white">7.62MM</td>
                  </tr>
                  <tr className="bg-[#f2faff]">
                    <td className="p-2 pl-12 border-b border-white">
                      / &nbsp; Slash/solidus
                    </td>
                    <td className="p-2 pl-12 border-b border-white">
                      1-3/4IN LG or <br /> BLACK/BLUE/GREEN
                    </td>
                  </tr>
                  <tr
                    className="bg-[#f2faff]"
                    style={{ backgroundColor: "#e1f5fe" }}
                  >
                    <td className="p-2 pl-12 border-b border-[#e6f4ff]">
                      - &nbsp; Dash
                    </td>
                    <td className="p-2 pl-12 border-b border-[#e6f4ff]">
                      2-3/8IN DIA
                    </td>
                  </tr>

                  {/* Group 2: Left Paren */}
                  <tr className="bg-white">
                    <td className="p-6 font-bold border-b border-[#e6f4ff]">
                      The following special character must have a space before,
                      and must not have a space after them
                    </td>
                    <td className="p-6 pl-12 border-b border-[#e6f4ff]">
                      ( &nbsp; Left parenthesis
                    </td>
                    <td className="p-6 pl-12 border-b border-[#e6f4ff]">
                      1IN (25MM) DIA
                    </td>
                  </tr>

                  {/* Group 3: Right Paren */}
                  <tr
                    className="bg-[#f2faff]"
                    style={{ backgroundColor: "#e1f5fe" }}
                  >
                    <td className="p-6 font-bold border-b border-[#e6f4ff]">
                      The following special character must not have a space
                      before, but must have a space after them
                    </td>
                    <td className="p-6 pl-12 border-b border-[#e6f4ff]">
                      ) &nbsp; Right parenthesis
                    </td>
                    <td className="p-6 pl-12 border-b border-[#e6f4ff]">
                      25MM (1IN) DIA
                    </td>
                  </tr>

                  {/* Group 4: Forbidden */}
                  <tr className="bg-white">
                    <td className="p-6 font-bold border-b border-[#e6f4ff] align-top">
                      The following characters must not be used in any
                      circumstances
                    </td>
                    <td
                      colSpan="2"
                      className="p-4 pl-12 border-b border-[#e6f4ff]"
                    >
                      <div className="grid grid-cols-1 gap-1">
                        <div>" &nbsp; &nbsp; Quotation</div>
                        <div>
                          % &nbsp; &nbsp; Percent (use PCNT example: 75PCNT for
                          75%)
                        </div>
                        <div>= &nbsp; &nbsp; Equals</div>
                        <div>' &nbsp; &nbsp; Apostrophe</div>
                        <div>&amp; &nbsp; &nbsp; Ampersand</div>
                        <div>* &nbsp; &nbsp; Asterisk</div>
                        <div>; &nbsp; &nbsp; Semi-Colon</div>
                      </div>
                    </td>
                  </tr>

                  {/* Group 5: Period usage */}
                  <tr
                    className="bg-[#f2faff]"
                    style={{ backgroundColor: "#e1f5fe" }}
                  >
                    <td className="p-4 font-bold border-b border-[#e6f4ff]">
                      A period (.) may only be used in metric dimensions
                    </td>
                    <td
                      colSpan="2"
                      className="p-4 pl-12 border-b border-[#e6f4ff]"
                    >
                      E.g. &nbsp; 2.4MM, 0.05IN
                    </td>
                  </tr>

                  {/* Group 6: Number abbreviation */}
                  <tr className="bg-white">
                    <td className="p-4 font-bold">
                      As an abbreviation for number, # shall be used instead of
                      NO.
                    </td>
                    <td colSpan="2" className="p-4 pl-12">
                      E.g. &nbsp; NO.6 will be encoded as #6
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h4>
            <span style={boldTextStyle}>21.4 SEPARATOR</span>
          </h4>
          <p>
            Before adding two values as a single attribute value, make sure it
            is correct to record both values. If it is necessary, separate the
            two attribute values using a forward slash i.e. &ldquo;/&rdquo;.
            &nbsp; Put values in alphabetical order and DO NOT leave a space
            before and after forward slash i.e., black/red not black / red.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>21.5 RELATED DIMENSIONAL ORDER</span>
          </h4>
          <span>Approved sequences for dimensions are:&nbsp;</span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Length X Width X
            Height.
          </span>
          <br />
          <span style={textStyle}>
            &bull; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Inside Diameter X Outside
            Diameter X Width/Thickness.
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>21.6 PLURALS</span>
          </h4>
          <span style={textStyle}>
            Try not to use plurals in type or other attributes where possible.
            Adding an &ldquo;s&rdquo; where it is not necessary only adds
            additional values that are neither necessary nor unique.&nbsp;
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>21.7 RATIOS</span>
          </h4>
          <span style={textStyle}>
            Ratios should be written in 45:1 format and consideration should be
            given to whether it is an increasing or reducing ratio so that the
            numbers are put the right way around.
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>21.8 DIMENSIONS</span>
          </h4>
          <p style={textStyle}>
            Imperial dimensions will not be converted to metric equivalents,
            except where industry-standard dictates.
          </p>
          <span style={textStyle}>
            When a metric dimensional value is recorded in a description, the
            industry-standard shall be used.
          </span>
          <br />
          <br />
          <p style={textStyle}>
            When a single factor only is involved in a dimension; e.g. length
            and such a dimension rounds off to multiples of whole feet, the
            abbreviation FT will be used; e.g. Raw bar stock indicated as
            nominally 72 inches long, will be recorded as 6FT LG. Conversion
            shall only occur to align with an industry standard for any given
            material.
          </p>
          <ul>
            <li>
              <span style={textStyle}>
                The abbreviation for foot/feet will be <strong>FT</strong>. The
                symbol &#39; shall not be used. The abbreviation is placed
                immediately following numerical quantity, with no space; e.g.
                12FT.
              </span>
            </li>
            <li>
              <span style={textStyle}>
                The abbreviation for inches will be <strong>IN</strong>. The
                symbol &ldquo; shall not be used. The abbreviation is placed
                immediately following the numerical quantity, with no space;
                e.g. 12IN.
              </span>
            </li>
            <li>
              <span style={boldTextStyle}>
                The FEET and INCH symbols will not be used under any
                circumstances.
              </span>
            </li>
          </ul>
          <br />
          <h4>
            <span style={boldTextStyle}>21.9 NEGATIVE NUMBERS</span>
          </h4>
          <p style={textStyle}>
            If there is a negative number in the range, it shall be entered as
            -20 TO 100 (lowest number first), separation of a number range shall
            always be separated by the word &ldquo;TO&rdquo; in UPPER CASE.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}> 21.10 TIME</span>
          </h4>
          <span style={textStyle}>
            Time is often also expressed as a range in certain electronic
            devices such as a Timer. Where this happens, the range shall be
            expressed by listing the lower value then the higher value separated
            by the word &ldquo;TO&rdquo; in UPPER CASE.&nbsp;
          </span>
          <br />
          <span>Example: 1 - 60 becomes 1 TO 60</span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}> 21.11 WITH</span>
          </h4>
          <p style={textStyle}>
            The word &ldquo;with&rdquo; should be abbreviated to &ldquo;w/
            &rdquo; (space after /) and &ldquo;without&rdquo; to &ldquo;w/o
            &rdquo; (space after o).
          </p>
          <h4>
            <span style={boldTextStyle}> 21.12 PART KIT CONTENTS</span>
          </h4>
          <p style={textStyle}>
            Where a material is a Kit, the parts information including quantity
            and part number, where available, shall be entered into the
            Description Notes field in the C screen to define the spares
            provided within the kit.
          </p>
          <br />
          <p>The format of the kit shall be written as follows:</p>
          <br />
          <span style={textStyle}>
            HEADING:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp;&nbsp;&ldquo;KIT CONTAINS:&rdquo;
          </span>
          <br />
          <span style={textStyle}>
            LINE PER PART:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2 X O-RING
            P/N 123-ABD
          </span>
          <br />
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;For single items do
            not use a prefix such as 1 X or (1) OF.&nbsp;
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;For multiples use the
            format &lsquo;2 X O-RINGS&rsquo;.
          </span>
          <br />
        </section>
      </AccordionItem>
      {/* STANDARDS AND UNITS OF MEASURE (UOM) */}
      <AccordionItem
        title="STANDARDS AND UNITS OF MEASURE (UOM)"
        isOpen={openSection === "STANDARDS AND UNITS OF MEASURE (UOM)"}
        onClick={() => toggleSection("STANDARDS AND UNITS OF MEASURE (UOM)")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>22.1 ATTRIBUTE</span>
          </h4>
          <p>
            Units of Measure (mm, inch, gm, etc.) should be recorded as the
            Attribute Units of Measure, and not written as part of the Attribute
            Value.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>22.2 TUBE AND FITTINGS</span>
          </h4>
          <p>
            Tube and Tube fittings are manufactured in both Metric and Imperial
            measurements and at no stage shall a conversion from metric to
            imperial or vice versa be carried out. These items shall have their
            measurements added as per the sizing supplied by the manufacturer.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>22.3 PIPE, VALVES AND FITTINGS</span>
          </h4>
          <p>
            The Standard sizes &amp; UoM for pipe, valves &amp; fittings will be
            cleaned to the DN or &quot;diameter nominal&quot; metric equivalent
            of the nominal pipe size - NPS, or &quot;Nominal Pipe Size&quot;.
            The metric designations conform to International Standards
            Organization (ISO) usage and apply to all plumbing, natural gas,
            heating oil, and miscellaneous piping used in buildings.
          </p>
          <br />
          <p>
            The table below should be used to validate the DN attribute
            conversion and value for the description outputs. Any issues should
            be raised to Petrofac for resolution or client escalation
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Diameter Nominal</th>
                  <th style={styles.th}>Attribute value in SF</th>
                </tr>
              </thead>
              <tbody>
                {diameterData.map((item, index) => (
                  <tr
                    key={index}
                    style={index % 2 === 0 ? styles.shadedRow : {}}
                  >
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      {item.label}
                    </td>
                    <td style={styles.td}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>
            <span style={boldTextStyle}>
              22.4 PIPE FLANGES, VALIVES &amp; FITTINGS
            </span>
          </h4>
          <p>
            Pressure Class is to be used when describing pressure ratings for
            Pipes, valves and fittings. There are several standards used in the
            Oil &amp; Gas industry. The below table contains examples the
            pressure class should be validated against for value and UOM format.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Pressure Rating Table */}
            <table style={styles.table}>
              <thead style={{ backgroundColor: "#e1f5fe" }}>
                <tr>
                  <th style={styles.th}>Pressure rating</th>
                  <th style={styles.th}>Value in SF</th>
                </tr>
              </thead>
              <tbody>
                {["150", "300", "400", "600", "900", "1500", "2500"].map(
                  (p, index) => (
                    <tr key={p} style={index % 2 === 0 ? styles.shadedRow : {}}>
                      <td style={{ padding: "8px" }}>{p}</td>
                      <td style={{ padding: "8px" }}>CL{p}</td>
                    </tr>
                  )
                )}
                <tr style={{ fontWeight: "bold", rowSpan: "2" }}>
                  <td>ASME/ANSI B16.5</td>
                  <td>Value includes UoM</td>
                </tr>
                {["25", "125", "250", "800"].map((p, index) => (
                  <tr key={p} style={index % 2 !== 0 ? styles.shadedRow : {}}>
                    <td style={{ padding: "8px" }}>{p}</td>
                    <td style={{ padding: "8px" }}>CL{p}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", rowSpan: "2" }}>
                  <td>API 6A</td>
                  <td>Value includes UoM</td>
                </tr>
                {["2000", "3000", "5000"].map((p, index) => (
                  <tr key={p} style={index % 2 !== 0 ? styles.shadedRow : {}}>
                    <td style={{ padding: "8px" }}>{p}</td>
                    <td style={{ padding: "8px" }}>{p}PSI</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>
            <span style={boldTextStyle}>22.5 PIPING SCHEDULES</span>
          </h4>
          <p>
            Schedules for Pipe and Fittings shall conform to the relevant
            International Standards. XS and XXS shall be used instead of XH and
            XXH to conform to those standards. Where items have corresponding
            schedules then the referenced too schedule shall be used, e.g. where
            Schedule 40 is the same as Standard Weight then Standard Weight
            shall be used.
          </p>
        </section>
      </AccordionItem>
      {/* NOTES */}
      <AccordionItem
        title="NOTES"
        isOpen={openSection === "NOTES"}
        onClick={() => toggleSection("NOTES")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>23.1 NOTES FIELDS</span>
          </h4>
          <p>
            These are plant-specific notes found on the C-screen and the Working
            screen. They consist of Equipment Notes, Purchasing Notes and
            General Notes. These fields are used to store additional information
            which does not fall into an attribute value or is non-descriptive
            information
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>
              23.2 EQUIPMENT NOTES (i.e. APPLICATION)
            </span>
          </h4>
          <p>
            &ldquo;where used&rdquo; or &ldquo;Application&rdquo; information
            does not generally describe an item&rsquo;s functionality and does
            not form part of the master description but should be entered in the
            Equipment notes field.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>23.3 PURCHASING NOTES</span>
          </h4>
          <p>
            This field is for all information related to purchasing the item,
            including delivery information. Do not enter price information. This
            includes drawing numbers, item numbers, reference numbers and Model
            numbers.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>23.4 GENERAL NOTES</span>
          </h4>
          <p>
            This field is only for item-specific, descriptive information that
            does not fit into the NMQA structure or that are not related to
            Equipment or Purchasing.
          </p>
          <br />
          <h4>
            <span style={boldTextStyle}>23.5 COMPLETING THE NOTES FIELDS</span>
          </h4>
          <p>
            Complete the notes fields in a concise and logical style excluding
            the attribute name: eg. Rather than: &quot;For: valve, Size:2in,
            Material: carbon steel&quot; use: &quot;for 2in carbon steel
            valve&quot;. For nonspecific values which are not clear, preface
            with &lsquo;REF:&rsquo;.
          </p>
        </section>
      </AccordionItem>
      {/* NOUN-MODIFIER SPECIFIC RULES */}
      <AccordionItem
        title="NOUN-MODIFIER SPECIFIC RULES"
        isOpen={openSection === "NOUN-MODIFIER SPECIFIC RULES"}
        onClick={() => toggleSection("NOUN-MODIFIER SPECIFIC RULES")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4 style={boldTextStyle}>
            <span>24.1 BOLTS</span>
          </h4>
          <p style={textStyle}>Stud Bolt:</p>
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;For Bolts 1in and
            under, enter THREAD TYPE as UNC &nbsp;&nbsp;
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;For Bolts over 1in
            with UNC threads AND 8tpi, enter THREAD TYPE as 8UN
          </span>
          <p style={textStyle}>
            If an item is a common Hex or Heavy Hex head bolt, cleanse to Bolt,
            Machine applying the above convention.
          </p>
          <br />
          <h4 style={boldTextStyle}>
            <span>24.2 ELBOW</span>
          </h4>
          <span style={textStyle}>
            &bull; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; If an Elbow has a Bend
            Radius of 1.5D, 3D, 5D, 6D the item will go to Bend, Pipe.
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;If the Elbow has a
            Bend Radius of 1.5D LONG, the item will go to Elbow, Pipe.
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;If the Bend Radius is
            less than 1.5 it will go to Elbow.
          </span>
          <br />
          <br />
          <h4 style={boldTextStyle}>
            <span>24.3 ALL GASKETS</span>
          </h4>
          <span>24.3.1. &nbsp;Gaskets Piping (to ASME Standards)</span>
          <br />
          <span style={textStyle}>
            Gaskets that conform to ASME Standards that are used within piping
            systems shall conform to the designation of Diameter Nominal (DN)
            metric and pressure shall be identified using class e.g. DN50 CL600
          </span>
          <br />
          <br />
          <h4 style={boldTextStyle}>
            <span>24.4 GASKETS NON-PIPING (NON-ASME STANDARD)</span>
          </h4>
          <p style={textStyle}>
            Gaskets that do not conform to ASME standards, shall be catalogued
            in Millimetres (Metric) and the dimensions will be in the sequence
            from Inside Diameter to Outside Diameter.&nbsp;
          </p>
          <br />
          <h4 style={boldTextStyle}>
            <span>24.5 GASKET SPECIFICATIONS</span>
          </h4>
          <span>
            Gasket Manufactures use their naming conventions to describe the
            type of gasket that is being supplied. &nbsp;This project will use
            the naming convention described by Flexitallic Group when creating
            an item number for a gasket. Spiral Wound gaskets shall be of the
            following designations:
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Style R &ndash;
            Spiral Wound Gasket without an Inner Ring or Guide Ring
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Style RIR - Spiral
            Wound Gasket with an Inner Ring only
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Style CG - Spiral
            Wound Gasket with a Guide Ring only
          </span>
          <br />
          <span style={textStyle}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Style CGI - Spiral
            Wound Gasket with an Inner Ring and a Guide Ring
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>24.6 KITS</span>
          </h4>
          <span style={textStyle}>
            Where a material number is a Kit, the parts information including
            quantity, Noun Modifier and part number shall be entered into the
            description notes, not &ldquo;CONSISTS OF&rdquo;
          </span>
          <br />
          <span style={textStyle}>1 X FILTER OIL&nbsp;P/N 123-ABC</span>
          <br />
          <span style={textStyle}>
            2 X O-RING &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;&nbsp;P/N 234-CDE
          </span>
          <br />
          <span style={textStyle}>
            4 X SEAL&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp;&nbsp;P/N 345-DEF
          </span>
          <br />
          <img
            width="389"
            src={NounModifierSpecificRules}
            alt="Noun-Modifier Specific Rules"
            style={{ marginRight: "5px" }}
          />
          <br />
          <h4>
            <span style={boldTextStyle}>24.7 STANDARD</span>
          </h4>
          <p style={textStyle}>
            If the term Standard appears alongside a chemical name, clean as
            Chemical and include Standard in Type as well as the chemical name.
            Example: Chemical Ammonium Hydrate Standard.
          </p>
        </section>
      </AccordionItem>
      {/* DESCRIPTION SETTINGS - HOLD */}
      <AccordionItem
        title="DESCRIPTION SETTINGS - HOLD"
        isOpen={openSection === "DESCRIPTION SETTINGS - HOLD"}
        onClick={() => toggleSection("DESCRIPTION SETTINGS - HOLD")}
      >
        <section style={{ fontSize: "13px", color: "#333" }}>
          <h4>
            <span style={boldTextStyle}>25.1 SHORT DESCRIPTION PARAMETERS</span>
          </h4>
          <span style={{ background: "yellow" }}>
            Origin&rsquo;s Oracle Short description has the following
            parameters:
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Max length:
            &ldquo;240 characters&rdquo;
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Truncation character:
            &ldquo;~&rdquo;
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            &bull; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Separator: &ldquo;_&rdquo;
          </span>
          <br />
          <br />
          <h4>
            <span style={{ background: "yellow" }}>
              25.2 Attribute truncation
            </span>
          </h4>
          <span style={{ background: "yellow" }}>
            Within the Short description, only the attributes will be truncated.
            Noun Modifiers, Manufacturer names and part numbers shall and must
            not be truncated. The following formula should be used to work out
            how many characters are available to truncate.
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            &bull;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Attribute truncation
            (At) = Max length &ndash; (NM length + Manufacturer + Part number)
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            o&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;i.e. if part number = 40
            characters, NM length = 15 characters and Manufacturer = 8
            characters then the attribute truncation is worked out as:
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            At = 240 &ndash; (15+8+40)
          </span>
          <br />
          <span style={{ background: "yellow" }}>At = 177 characters</span>
          <p>
            <span style={{ background: "yellow" }}>
              25.3.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              &nbsp;Short description settings
            </span>
          </p>
          <span style={{ background: "yellow" }}>
            The following description groups will be applied to the appropriate
            noun modifiers as defined in Appendix 1 of this DCG.
          </span>
          <br />
          <br />
          <h4>
            <span style={{ background: "yellow" }}>
              25.3 OEM &amp; Maintenance parts
            </span>
          </h4>
          <span style={{ background: "yellow" }}>
            SD order &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Attribute truncation
            applied example
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            NM_Attributes~_Manufacturer_Part number
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;&nbsp;Gauge_Pressure_Att1_Att2_
            Att3_Att4~_Rosemount_3051XXXXXXXXXXXX
          </span>
          <br />
          <br />
          <h4>
            <span style={boldTextStyle}>
              <span style={{ background: "yellow" }}>25.4 COMMODITY PARTS</span>
            </span>
          </h4>
          <span style={{ background: "yellow" }}>
            SD order &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Attribute truncation
            applied example
          </span>
          <br />
          <span style={{ background: "yellow" }}>NM_ Attributes~</span>
          <br />
          <span style={{ background: "yellow" }}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Gauge_
            Pressure_Att1_Att2_Att3_Att4~
          </span>
          <br />
          <br />
          <span style={{ background: "yellow" }}>
            25.3.1.&nbsp;&nbsp;Non-Inventory parts
          </span>
          <br />
          <span style={{ background: "yellow" }}>
            SD order&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Attribute
            truncation applied example
          </span>
          <br />
          <span style={{ background: "yellow" }}>Attributes~</span>
          <span style={{ background: "yellow" }}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Att1_Att2_Att3_Att4~
          </span>
          <br />
          <br />
          <span style={{ background: "yellow" }}>&emsp;Long description</span>
          <p>
            <span style={{ background: "yellow" }}>
              The limit to the long description is 80 characters per line. The
              maximum number of lines is 48.
            </span>
          </p>
          <span style={{ background: "yellow" }}>
            The output description settings need to reflect the order and line
            break/ text wrap as per the C-Screen preview. For example:
          </span>
          <br />
          <br />
          <p>
            <span style={{ background: "yellow" }}>
              Should show in the CDE as:
            </span>
          </p>
          <span style={{ background: "yellow" }}>VALVE SOLENOID</span>
          <br />
          <span style={{ background: "yellow" }}>TYPE: DIRECT ACTING</span>
          <br />
          <span style={{ background: "yellow" }}>PIPE SIZE: 1/4in</span>
          <br />
          <span style={{ background: "yellow" }}>ORIFICE SIZE: 5mm</span>
          <br />
          <span style={{ background: "yellow" }}>VOLTAGE: 24V</span>
          <br />
          <span style={{ background: "yellow" }}>CURRENT TYPE: DC</span>
          <br />
          <span style={{ background: "yellow" }}>CURRENT: 162mA</span>
          <br />
          <span style={{ background: "yellow" }}>PRESSURE RATING: 0-10bar</span>
          <br />
          <span style={{ background: "yellow" }}>
            BODY MATERIAL: 1.4404 STAINLESS STEEL
          </span>
          <br />
          <span style={{ background: "yellow" }}>CONNECTION TYPE: NPT</span>
          <br />
          <span style={{ background: "yellow" }}>POWER RATING: 4W</span>
          <br />
          <span style={{ background: "yellow" }}>
            HAZARD PROTECTION: EEX ME II T4/T6
          </span>
          <br />
          <span style={{ background: "yellow" }}>CONFIGURATION: 3/2-WAY</span>
          <br />
          <span style={{ background: "yellow" }}>
            CONSTRUCTION: M20-1.5 CONDUIT CONNECTION
          </span>
          <br />
          <span style={{ background: "yellow" }}>MANUFACTURER: HERION</span>
          <br />
          <span style={{ background: "yellow" }}>
            MAN PART NUMBER: 2401112.4260.024.00
          </span>
          <br />
        </section>
      </AccordionItem>
    </div>
  );
};

export default PETGuidelines;
