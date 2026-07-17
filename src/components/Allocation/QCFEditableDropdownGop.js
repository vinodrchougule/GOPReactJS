import React from "react";
import { Autocomplete, Popper, TextField } from "@mui/material";

const CustomPopper = (props) => (
  <Popper {...props} className="custom-popper-class" />
);
function QCFEditableDropdownGop(props) {
  const handleAttributeChange = (e, newValue, selectId, type) => {
    if (newValue) {
      let modifiedString = "";
      if (
        props.projectSettings.SpecialCharacters &&
        props.projectSettings.SpecialCharacters.length !== 0
      ) {
        let characters = props.projectSettings.SpecialCharacters.map((char) => {
          return char.Characters;
        });
        let pattern = new RegExp("[" + characters.join("") + "]", "g");

        modifiedString = newValue.replace(pattern, "");
      } else {
        modifiedString = newValue;
      }

      let newValueSelect = {
        label: modifiedString,
        value: modifiedString,
      };
      if (props.projectSettings.IsToConvertAttributeValueToUppercase) {
        newValueSelect = {
          label: modifiedString.toUpperCase(),
          value: modifiedString.toUpperCase(),
        };
      }

      props.handleVendorChange(newValueSelect, selectId, type);
    } else {
      props.handleVendorChange("", selectId, type);
    }
  };

  const handleMFRBlur = (event, selectId, type) => {
    if (event.target.value) {
      let modifiedString = "";
      if (
        props.projectSettings.SpecialCharacters &&
        props.projectSettings.SpecialCharacters.length !== 0
      ) {
        let characters = props.projectSettings.SpecialCharacters.map((char) => {
          return char.Characters;
        });
        let pattern = new RegExp("[" + characters.join("") + "]", "g");

        modifiedString = event.target.value.replace(pattern, "");
      } else {
        modifiedString = event.target.value;
      }

      const inputValue = modifiedString;

      let newValueSelect = {};
      if (props.projectSettings.IsToConvertAttributeValueToUppercase) {
        newValueSelect = {
          label: inputValue.toUpperCase(),
          value: inputValue.toUpperCase(),
          // name: this.props.AttributeName,
        };
      } else {
        newValueSelect = {
          label: inputValue.toLowerCase(),
          value: inputValue.toLowerCase(),
          // name: this.props.AttributeName,
        };
      }
      props.handleVendorChange(newValueSelect, selectId, type);
    } else {
      props.handleVendorChange("", selectId, type);
    }
  };

  const customFormControlClass = "custom-Auto-form-control";
  const customInputBaseClass = "selected-Auto-input-base";
  const customNotchedOutlineClass = "selected-Notched-Outline";
  return (
    <div>
      <Autocomplete
        id="free-solo-demo"
        className="select-autocomplete-custom"
        freeSolo
        options={props.Options.map((option) => option.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            classes={{
              root: customFormControlClass,
              input: customInputBaseClass, // Uncomment and ensure this class is defined
            }}
            InputProps={{
              ...params.InputProps,
              classes: {
                root: customInputBaseClass, // Ensure this matches your CSS
                notchedOutline: customNotchedOutlineClass, // Ensure this matches your CSS
              },
            }}
          />
        )}
        value={props.selectValue || ""}
        classes={{
          option: "autocomplete-option",
          selected: "autocomplete-option--selected",
        }}
        onChange={(e, newValue) =>
          handleAttributeChange(e, newValue, props.Inputs, props.Types)
        }
        onFocus={() => props.handleFocus(props.optionDataType)}
        onBlur={(e) => handleMFRBlur(e, props.Inputs, props.Types)}
        PopperComponent={CustomPopper}
      />
    </div>
  );
}

export default QCFEditableDropdownGop;
