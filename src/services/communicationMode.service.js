import http from "../http-common";

class CommunicationModeService {
  //#region Create Communication Mode
  createCommunicationMode(data) {
    return http.post("/communicationmode", data);
  }
  //#endregion

  //#region Get All Communication Modes
  getAllCommunicationModes(userID, isActiveonly) {
    return http.get(
      `/communicationmode/readcommunicationmodes/${userID}/${isActiveonly}`
    );
  }
  //#endregion

  //#region Get Communication Mode by ID
  getCommunicationMode(id, userID) {
    return http.get(`/communicationmode/${id}/${userID}`);
  }
  //#endregion

  //#region Update Communication Mode
  updateCommunicationMode(id, data) {
    return http.put(`/communicationmode/${id}`, data);
  }
  //#endregion

  //#region Delete Communication Mode
  deleteCommunicationMode(id, userID) {
    return http.patch(`/communicationmode/${id}/${userID}`);
  }
  //#endregion

  //#region Export Communication Mode List to Excel
  exportCommunicationModeListToExcel() {
    return http.get(`/communicationmode/ExportCommunicationModeListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new CommunicationModeService();
