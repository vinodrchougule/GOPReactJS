import http from "../../http-common";

class duplicatesCheckOnMultipleCols {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/DuplicatesCheckOnMultipleColumns/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Check for Duplicate Rows and Write the duplicate remarks in Output to file
  duplicatesCheckOnMultipleColumns(
    inputFileName,
    uploadedInputFileName
  ) {
    return http.post(
      `/DuplicatesCheckOnMultipleColumns/CheckDuplicatesOnMultipleColumnsAndWriteDuplicateRows?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}`,
    );
  }
  //#endregion
}

export default new duplicatesCheckOnMultipleCols();