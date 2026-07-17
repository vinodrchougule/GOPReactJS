import http from "../../http-common";

class removeDuplicateWords {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/RemoveDuplicateWords/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Remove Duplicate Words And Write Description To Output File
  removeDuplicateWordsAndWriteDescriptionToOutputFile(
    inputFileName,
    uploadedInputFileName
  ) {
    return http.post(
      `/RemoveDuplicateWords/RemoveDuplicateWordsAndWriteDescriptionToOutputFile?` +
        `InputFileName=${inputFileName}&` +
        `UploadedInputFileName=${encodeURIComponent(uploadedInputFileName)}`
    );
  }
  //#endregion
}

export default new removeDuplicateWords();
