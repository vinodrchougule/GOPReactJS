import http from "../../http-common";

class transposeHtoVService {
  //#region Download Transpose Horizontal To Vertical Template File
  downloadTransposeHtoVFileTemplate() {
    return http.get(`/TransposeHtoV/DownloadTransposeHtoVFileTemplate`, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Validate and Write Input File Data to database
  validateAndWriteInputFileDataToDatabase(fileName) {
    return http.post(
      `/TransposeHtoV/ValidateAndWriteInputFileDataToDatabase?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Transpose the data and Download To Excel
  transposeDataAndDownloadToExcel(sqlTableName) {
    return http.get(
      `/TransposeHtoV/TransposeDataAndDownloadToExcel?sqlTableName=${sqlTableName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new transposeHtoVService();
