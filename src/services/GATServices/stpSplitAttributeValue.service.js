import http from "../../http-common";

class stpSplitAttributeValue {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/STPSplitAttributeValue/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Process And Write the output to file
  splitAttributeValueAndWriteToOutput(
    uploadedInputFileName,
    inputFileName,
    maxCharacters
  ) {
    return http.post(
      `/STPSplitAttributeValue/SplitAttributeValueAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&MaxChars=${maxCharacters}`
    );
  }
  //#endregion
}

export default new stpSplitAttributeValue();
