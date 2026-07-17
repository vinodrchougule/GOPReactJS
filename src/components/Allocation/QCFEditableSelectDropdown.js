// EditableSelectDropdown.jsx
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";

class QCFEditableSelectDropdown extends React.Component {
  handleAttributeChange = (selectedOption, newValue) => {
    if (newValue) {
      let modifiedString = "";
      if (this.props.projectSettings.SpecialCharacters.length !== 0) {
        let characters = this.props.projectSettings.SpecialCharacters.map(
          (char) => {
            return char.Characters;
          }
        );
        let pattern = new RegExp("[" + characters.join("") + "]", "g");

        modifiedString = newValue.replace(pattern, "");
      } else {
        modifiedString = newValue;
      }

      let newValueSelect = {
        label: modifiedString,
        value: modifiedString,
        name: this.props.AttributeName,
      };
      if (this.props.projectSettings.IsToConvertAttributeValueToUppercase) {
        newValueSelect = {
          label: modifiedString.toUpperCase(),
          value: modifiedString.toUpperCase(),
          name: this.props.AttributeName,
        };
      }

      this.props.getValueToPass(newValueSelect);
    }
  };

  handleMFRBlur = (event) => {
    let modifiedString = "";
    if (
      this.props.projectSettings.SpecialCharacters &&
      this.props.projectSettings.SpecialCharacters.length !== 0
    ) {
      let characters = this.props.projectSettings.SpecialCharacters.map(
        (char) => {
          return char.Characters;
        }
      );
      let pattern = new RegExp("[" + characters.join("") + "]", "g");

      modifiedString = event.target.value.replace(pattern, "");
    } else {
      modifiedString = event.target.value;
    }

    const inputValue = modifiedString;

    let newValueSelect = {};
    if (this.props.projectSettings.IsToConvertAttributeValueToUppercase) {
      newValueSelect = {
        label: inputValue.toUpperCase(),
        value: inputValue.toUpperCase(),
        //name: this.props.data.rowData.AttributeName,
        name: this.props.AttributeName,
        QCAttributeValueComments:
          this.props.data.rowData.QCAttributeValueComments,
      };
    } else {
      newValueSelect = {
        label: inputValue.toLowerCase(),
        value: inputValue.toLowerCase(),
        //name: this.props.data.rowData.AttributeName,
        name: this.props.AttributeName,
        QCAttributeValueComments:
          this.props.data.rowData.QCAttributeValueComments,
      };
    }

    this.props.getValueToPass(newValueSelect);
  };

  render() {
    const customFormControlClass = "custom-Auto-form-control";
    const customInputBaseClass = "custom-Auto-input-base";
    const customNotchedOutlineClass = "custom-Notched-Outline";

    return (
      <Autocomplete
        id="free-solo-demo"
        className="autocomplete-custom"
        freeSolo
        options={this.props.data.uniqueValues.map((option) => option.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            classes={{
              root: customFormControlClass,
              // input: customInputBaseClass,
            }}
            InputProps={{
              ...params.InputProps,
              classes: {
                root: customInputBaseClass,
                notchedOutline: customNotchedOutlineClass,
              },
            }}
          />
        )}
        value={this.props.AttributeValue || ""}
        classes={{
          option: "autocomplete-option",
          selected: "autocomplete-option--selected",
        }}
        onChange={this.handleAttributeChange}
        onBlur={this.handleMFRBlur}
        ListboxComponent={(props) => (
          <ul
            {...props}
            className={`${
              this.props.data.uniqueValues.length === 0
                ? "auto-popper-list"
                : "autocomplete-popper-list"
            }`}
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            className={`autocomplete-popper-list-item ${
              selected ? "autocomplete-popper-list-item--selected" : ""
            }`}
          >
            {option}
          </li>
        )}
      />
    );
  }
}
const mapStateToProps = (state) => ({
  data: state.productionsData,
});

export default withRouter(connect(mapStateToProps)(QCFEditableSelectDropdown));
