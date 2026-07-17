import http from "../../http-common";

class abbreviateFile {
  //#region Download Template File
  downloadTemplateFile(fileName) {
    return http.get(
      `/AbbreviateFile/DownloadTemplateFile?FileName=${fileName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Validate and Write Input File Data to database
  validateAndWriteInputFileDataToDatabase(fileName) {
    return http.post(`/AbbreviateFile/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Validate and Write Abbreviation File Data to database
  validateAndWriteAbbreviationFileDataToDatabase(fileName) {
    return http.post(
      `/AbbreviateFile/ValidateAbbreviationFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Abbreviate Input File And Write Output To Excel
  abbreviateInputFileAndWriteOutputToExcel(
    uploadedInputFileName,
    inputFileSqlTableName,
    abbreviationFileSqlTableName
  ) {
    return http.post(
      `/AbbreviateFile/AbbreviateInputFileAndWriteOutputToExcel?UploadedInputFileName=${uploadedInputFileName}&inputFileSqlTableName=${inputFileSqlTableName}&abbreviationFileSqlTableName=${abbreviationFileSqlTableName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download the output file
  downloadOutputFile(fileFullName) {
    return http.get(
      `/AbbreviateFile/DownloadOutputFile?FileFullName=${fileFullName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new abbreviateFile();
