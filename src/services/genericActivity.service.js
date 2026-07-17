import http from "../http-common";

class GenericActivityService {
  //#region Create Generic Activity
  createGenericActivity(data) {
    return http.post("/genericactivity", data);
  }
  //#endregion

  //#region Get All Generic Activities
  getAllActivities(userID, isActiveonly) {
    return http.get(
      `/genericactivity/readgenericactivities/${userID}/${isActiveonly}`
    );
  }
  //#endregion

  //#region Get Generic Activity by ID
  getGenericActivity(id, userID) {
    return http.get(`/genericactivity/${id}/${userID}`);
  }
  //#endregion

  //#region Update Generic Activity
  updateGenericActivity(id, data) {
    return http.put(`/genericactivity/${id}`, data);
  }
  //#endregion

  //#region Delete Generic Activity
  deleteGenericActivity(id, userID) {
    return http.patch(`/genericactivity/${id}/${userID}`);
  }
  //#endregion

  //#region Export Generic Activity List to Excel
  exportGenericActivityListToExcel() {
    return http.get(`/genericactivity/ExportGenericActivityListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new GenericActivityService();
