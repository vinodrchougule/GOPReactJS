import http from "../../http-common";

class fuzzyValueFixer {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(`/FuzzyValueFixer/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Fix the fuzzy values and write it to output file
  fixFuzzyValuesAndWriteToOutput(uploadedInputFileName, inputFileName) {
    return http.post(
      `/FuzzyValueFixer/FixFuzzyValuesAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}`
    );
  }
  //#endregion
}

export default new fuzzyValueFixer();
