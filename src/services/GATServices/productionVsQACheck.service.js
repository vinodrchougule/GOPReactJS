import http from "../../http-common";

class productionVsQACheck {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/ProductionVsQACheck/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Check for Differences and Write the result to Output file
  checkForDifferencesAndWriteToOutputFile(
    inputFileName,
    uploadedInputFileName,
  ) {
    return http.post(
      `/ProductionVsQACheck/CheckForDifferencesAndWriteToOutputFile?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}`,
    );
  }
  //#endregion
}

export default new productionVsQACheck();
