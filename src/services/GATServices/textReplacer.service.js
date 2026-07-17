import http from "../../http-common";

class textReplacer {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(`/TextReplacer/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Write Description and Terms input data to server
  writeDescriptionAndTermsInputDataToDatabase(inputFileName) {
    return http.post(
      `/TextReplacer/WriteDescriptionAndTermsInputDataToDatabase?InputFileName=${inputFileName}`
    );
  }
  //#endregion

  //#region Replace Text and Write the Output to file
  replaceTextAndWriteOutputToExcel(
    inputFileName,
    uploadedInputFileName,
    descSqlTableName,
    termsSqlTableName,
    delimiter
  ) {
    return http.post(
      `/TextReplacer/ReplaceTextAndWriteOutputToExcel?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}&` +
        `descSqlTableName=${descSqlTableName}&` +
        `termsSqlTableName=${termsSqlTableName}&` +
        `Delimiter=${encodeURIComponent(delimiter)}`
    );
  }
  //#endregion
}

export default new textReplacer();
