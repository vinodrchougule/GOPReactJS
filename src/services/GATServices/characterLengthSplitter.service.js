import http from "../../http-common";

class characterLengthSplitter {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/CharacterLengthSplitter/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Process And Write the output to file
  splitAttributeValueAndWriteToOutput(
    uploadedInputFileName,
    inputFileName,
    maxCharacters,
    prefix
  ) {
    return http.post(
      `/CharacterLengthSplitter/SplitAttributeValueAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&MaxChars=${maxCharacters}&Prefix=${prefix}`
    );
  }
  //#endregion
}

export default new characterLengthSplitter();
