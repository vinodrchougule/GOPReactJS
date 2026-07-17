import http from "../../http-common";

class duplicatesCheckGeneric {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/DuplicatesCheckGeneric/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Check for generic duplicate rows and Write the result to output file
  duplicateCheckGenericAndWriteOutputToExcel(data) {
    return http.post(
      "/DuplicatesCheckGeneric/DuplicateCheckGenericAndWriteOutputToExcel",
      data,
    );
  }
  //#endregion
}

export default new duplicatesCheckGeneric();
