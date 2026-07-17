import http from "../../http-common";

class findMissingWords {
  //#region Fetch columns list
  readColumnNamesFromFile(fileName) {
    return http.get(
      `/FindMissingWords/ReadColumnNamesFromFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Validate Input File Data
  validateInputFileData(data) {
    return http.post("/FindMissingWords/ValidateInputFileData", data);
  }
  //#endregion

  //#region Find Missing Words, Repeated Words and, New Words and Write To Excel output file
  findMissingRepeatedAndNewWordsAndWriteToExcel(data) {
    return http.post(
      "/FindMissingWords/FindMissingRepeatedAndNewWordsAndWriteToExcel",
      data
    );
  }
  //#endregion

  //#region Download the output file
  downloadOutputFile(fileFullName) {
    return http.get(
      `/FindMissingWords/DownloadOutputFile?FileFullName=${fileFullName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new findMissingWords();
