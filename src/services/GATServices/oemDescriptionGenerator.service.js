import http from "../../http-common";

class oemDescriptionGenerator {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/OEMDescriptionGenerator/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Process And Write the output to file
  generateOEMDescriptionAndWriteToOutput(
    uploadedInputFileName,
    inputFileName,
    maxCharacters
  ) {
    return http.post(
      `/OEMDescriptionGenerator/GenerateOEMDescriptionAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&MaxChars=${maxCharacters}`
    );
  }
  //#endregion
}

export default new oemDescriptionGenerator();
