import http from "../../http-common";

class termAnalysis {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(`/TermAnalysis/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Write Input Description data to server
  writeInputDescriptionDataToDatabase(inputFileName) {
    return http.post(
      `/TermAnalysis/WriteInputDescriptionDataToDatabase?InputFileName=${inputFileName}`
    );
  }
  //#endregion

  //#region Analyze Terms and Write the Output to file
  analyzeTermsAndWriteOutputToExcel(
    inputFileName,
    uploadedInputFileName,
    descSqlTableName,
    delimiter
  ) {
    return http.post(
      `/TermAnalysis/AnalyzeTermsAndWriteOutputToExcel?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}&` +
        `descSqlTableName=${descSqlTableName}&` +
        `Delimiter=${delimiter}`
    );
  }
  //#endregion
}

export default new termAnalysis();
