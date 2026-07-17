import http from "../../http-common";

class stpDescriptionGenerator {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/STPDescriptionGenerator/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Process And Write the output to file
  generateDescriptionAndWriteToOutput(uploadedInputFileName, inputFileName) {
    return http.post(
      `/STPDescriptionGenerator/GenerateDescriptionAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}`
    );
  }
  //#endregion
}

export default new stpDescriptionGenerator();
