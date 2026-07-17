import http from "../../http-common";

class mapUNSPSCLevels {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(`/MapUNSPSCLevels/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Map UNSPSC Levels And Write Output To Excel
  mapUNSPSCLevelsAndWriteOutputToExcel(
    uploadedInputFileName,
    inputFileName,
    sqlTableName,
    unspscVersion
  ) {
    return http.post(
      `/MapUNSPSCLevels/MapUNSPSCLevelsAndWriteOutputToExcel?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&sqlTableName=${sqlTableName}&UNSPSCVersion=${unspscVersion}`
    );
  }
  //#endregion
}

export default new mapUNSPSCLevels();
