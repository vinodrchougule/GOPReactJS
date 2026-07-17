import http from "../http-common";

class InputOutputFormatService {
  //#region Create Input Output Format
  createInputOutputFormat(data) {
    return http.post("/inputoutputformat", data);
  }
  //#endregion

  //#region Get All Input Output Formats
  getAllInputOutputFormats(userID, isActiveOnly) {
    return http.get(
      `/inputoutputformat/readinputoutputformats/${userID}/${isActiveOnly}`
    );
  }
  //#endregion

  //#region Get Input Output Format by ID
  getInputOutputFormat(id, userID) {
    return http.get(`/inputoutputformat/${id}/${userID}`);
  }
  //#endregion

  //#region Update Input Output Format
  updateInputOutputFormat(id, data) {
    return http.put(`/inputoutputformat/${id}`, data);
  }
  //#endregion

  //#region Delete Input Output Format
  deleteInputOutputFormat(id, userID) {
    return http.patch(`/inputoutputformat/${id}/${userID}`);
  }
  //#endregion

  //#region Export Input Output Format List to Excel
  exportInputOutputFormatListToExcel() {
    return http.get(`/inputoutputformat/ExportInputOutputFormatListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new InputOutputFormatService();
