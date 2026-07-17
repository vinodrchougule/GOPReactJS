import http from "../../http-common";

class dictionaryCheck {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(`/DictionaryCheck/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  //#region Validate dictionary File Data
  validateDictionaryFile(fileName) {
    return http.post(
      `/DictionaryCheck/ValidateDictionaryFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Write UnMatched NMAs
  writeUnMatchedNMAs(uploadedInputFileName, inputFileName, dictionaryFileName) {
    return http.post(
      `/DictionaryCheck/WriteUnMatchedNMAs?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&DictionaryFileName=${dictionaryFileName}`
    );
  }
  //#endregion

  //#region Download the help document
  downloadHelpDocument() {
    return http.get(`/DictionaryCheck/DownloadHelpDocument`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new dictionaryCheck();
