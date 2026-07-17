import http from "../../http-common";

class mergeMultipleWorksheets {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(
      `/MergeMultipleWorksheets/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Merge Multiple Worksheets And Save The File
  mergeWorksheetsDataAndSaveTheFile(uploadedInputFileName, inputFileName) {
    return http.post(
      `/MergeMultipleWorksheets/MergeWorksheetsDataAndSaveTheFile?UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}&InputFileName=${encodeURIComponent(inputFileName)}`,
    );
  }
  //#endregion
}

export default new mergeMultipleWorksheets();
