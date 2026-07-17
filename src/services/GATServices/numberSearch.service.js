import http from "../../http-common";

class numberSearch {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(`/NumberSearch/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Search the data from input file and write the result
  searchDataAndWriteTheResult(uploadedInputFileName, inputFileName) {
    return http.post(
      `/NumberSearch/SearchDataAndWriteTheResult?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}`
    );
  }
  //#endregion
}

export default new numberSearch();
