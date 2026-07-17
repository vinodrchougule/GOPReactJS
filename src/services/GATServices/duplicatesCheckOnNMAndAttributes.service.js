import http from "../../http-common";

class duplicatesCheckOnNMAndAttributes {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/DupesCheckOnNMAndAttributes/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Find Duplicates and Write the Output to file
  findDuplicatesAndWriteOutputToExcel(inputFileName, uploadedInputFileName) {
    return http.post(
      `/DupesCheckOnNMAndAttributes/FindDuplicatesAndWriteOutputToExcel?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}`
    );
  }
  //#endregion
}

export default new duplicatesCheckOnNMAndAttributes();
