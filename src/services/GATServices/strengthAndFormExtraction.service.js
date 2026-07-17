import http from "../../http-common";

class strengthAndFormExtraction {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/StrengthAndFormExtraction/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Process And Write the output to file
  extractStrengthsAndFormsAndWriteToOutput(
    uploadedInputFileName,
    inputFileName
  ) {
    return http.post(
      `/StrengthAndFormExtraction/ExtractStrengthsAndFormsAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}`
    );
  }
  //#endregion
}

export default new strengthAndFormExtraction();
