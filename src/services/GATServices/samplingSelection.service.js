import http from "../../http-common";

class samplingSelection {
  //#region Validate Input File
  validateInputFile(fileName, samplingPercentage) {
    return http.post(
      `/SamplingSelection/ValidateInputFile?FileName=${fileName}&SamplingPercentage=${samplingPercentage}`
    );
  }
  //#endregion

  //#region Check Duplicate Material No. exists in input file
  checkDuplicateMaterialNoExists(inputFileName) {
    return http.post(
      `/SamplingSelection/CheckDuplicateMaterialNoExists?InputFileName=${inputFileName}`
    );
  }
  //#endregion

  //#region Fetching the data from Database and Write to Excel
  selectRandomRowsAndWriteToOutputFile(
    uploadedInputFileName,
    inputFileName,
    sqlTableName,
    samplingSelectionPercentage
  ) {
    return http.post(
      `/SamplingSelection/SelectRandomRowsAndWriteToOutputFile?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&sqlTableName=${sqlTableName}&SamplingSelectionPercentage=${samplingSelectionPercentage}`
    );
  }
  //#endregion
}

export default new samplingSelection();
