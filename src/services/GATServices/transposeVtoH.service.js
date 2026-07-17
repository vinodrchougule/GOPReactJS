import http from "../../http-common";

class transposeVtoHService {
  //#region Download Transpose Vertical To Horizontal Template File
  downloadTransposeVtoHFileTemplate() {
    return http.get(`/TransposeVtoH/DownloadTransposeVtoHFileTemplate`, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Validate Input File Data
  validateInputFileData(fileName) {
    return http.post(
      `/TransposeVtoH/ValidateInputFileData?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Transpose the data and Download To Excel
  transposeDataFromVtoHAndDownloadToExcel(fileName) {
    return http.get(
      `/TransposeVtoH/TransposeDataFromVtoHAndDownloadToExcel?FileName=${fileName}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new transposeVtoHService();
