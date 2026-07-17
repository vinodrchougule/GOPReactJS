import http from "../../http-common";

class findSameDrugs {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(`/FindSameDrugs/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Process And Write the output to file
  findSameDrugsAndWriteToOutput(uploadedInputFileName, inputFileName) {
    return http.post(
      `/FindSameDrugs/FindSameDrugsAndWriteToOutput?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}`
    );
  }
  //#endregion
}

export default new findSameDrugs();
