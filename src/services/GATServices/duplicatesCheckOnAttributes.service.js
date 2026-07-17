import http from "../../http-common";

class duplicatesCheckOnAttributes {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/DuplicatesCheckOnAttributes/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Validate Attributes List File
  validateAttributesListFile(fileName) {
    return http.post(
      `/DuplicatesCheckOnAttributes/ValidateAttributeListFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Check for Duplicate Rows and Write the duplicate remarks in Output to file
  duplicateCheckOnAttributesAndWriteOutputToExcel(
    inputFileName,
    uploadedInputFileName,
    attributeListFileName,
  ) {
    return http.post(
      `/DuplicatesCheckOnAttributes/DuplicateCheckOnAttributesAndWriteOutputToExcel?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}&` +
        `AttributeListFileName=${encodeURIComponent(attributeListFileName)}`,
    );
  }
  //#endregion
}

export default new duplicatesCheckOnAttributes();
