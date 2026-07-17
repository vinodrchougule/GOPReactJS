import http from "../http-common";

class nmAutoClassifierService {
  //#region Download Input File Template
  downloadFileTemplate(fileType) {
    return http.get(
      `/NMAutoClassifier/DownloadFileTemplate?FileType=${fileType}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region validate and upload Input File Data
  validateAndUploadInputFileData(fileName) {
    return http.post(
      `/NMAutoClassifier/ValidateAndUploadInputFileData?FileName=${fileName}`
    );
  }
  //#endregion

  //#region validate and upload Abbreviation File Data
  validateAndUploadAbbreviationFileData(fileName) {
    return http.post(
      `/NMAutoClassifier/ValidateAndUploadAbbreviationFileData?FileName=${fileName}`
    );
  }
  //#endregion

  //#region validate and upload Std. Noun-Modifier File Data
  validateAndUploadStdNounModifierFileData(fileName) {
    return http.post(
      `/NMAutoClassifier/ValidateAndUploadStdNounModifierFileData?FileName=${fileName}`
    );
  }
  //#endregion

  processAndDownloadNMAutoClassifiedReportToExcel(inputFileTableName, abbreviationFileTableName, stdNounModifierFileTableName) {
    return http.get(
      `/NMAutoClassifier/ProcessAndDownloadNMAutoClassifiedReportToExcel?InputFileTableName=${inputFileTableName}&AbbreviationFileTableName=${abbreviationFileTableName}&StdNounModifierFileTableName=${stdNounModifierFileTableName}`,
      {
        responseType: "blob",
      }
    );
  }
}

export default new nmAutoClassifierService();
