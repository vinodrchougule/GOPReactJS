import http from "../../http-common";

class fileServices {
  //#region Download Template File
  downloadTemplateFile(fileName) {
    return http.get(`/FileServices/DownloadTemplateFile?FileName=${fileName}`, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Download the output file
  downloadOutputFile(fileFullName) {
    return http.get(
      `/FileServices/DownloadOutputFile?FileFullName=${fileFullName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download the help document
  downloadHelpDocument(functionName) {
    return http.get(
      `/FileServices/DownloadHelpDocument?FunctionName=${functionName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new fileServices();
