import http from "../../http-common";

class itemSpendAnalysis {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/ItemSpendAnalysis/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Do Item Spend Analysis and Write the Output to file
  doItemSpendAnalysis(inputFileName, uploadedInputFileName) {
    return http.post(
      `/ItemSpendAnalysis/DoItemSpendAnalysis?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}`
    );
  }
  //#endregion
}

export default new itemSpendAnalysis();
