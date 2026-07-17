import http from "../../http-common";

class highlightMandatoryAttributes {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(
      `/HighlightMandatoryAttributes/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Validate Dictionary File Data
  validateDictionaryFile(fileName) {
    return http.post(
      `/HighlightMandatoryAttributes/ValidateDictionaryFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Highlight Mandatory Attributes
  highlightMandatoryAttributes(inputFileName, dictionaryFileName) {
    return http.post(
      `/HighlightMandatoryAttributes/HighlightMandatoryAttributes?InputFileName=${inputFileName}&DictionaryFileName=${dictionaryFileName}`
    );
  }
  //#endregion
}

export default new highlightMandatoryAttributes();
