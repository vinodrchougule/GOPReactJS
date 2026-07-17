import http from "../http-common";

class ProjectActivityService {
  //#region Create Project Activity
  createProjectActivity(data) {
    return http.post("/projectactivity", data);
  }
  //#endregion

  //#region Get All Project Activities
  getAllActivities(userID, isActiveonly) {
    return http.get(
      `/projectactivity/readprojectactivities/${userID}/${isActiveonly}`
    );
  }
  //#endregion

  //#region Get Project Activity by ID
  getProjectActivity(id, userID) {
    return http.get(`/projectactivity/${id}/${userID}`);
  }
  //#endregion

  //#region Update Project Activity
  updateProjectActivity(id, data) {
    return http.put(`/projectactivity/${id}`, data);
  }
  //#endregion

  //#region Delete Project Activity
  deleteProjectActivity(id, userID) {
    return http.patch(`/projectactivity/${id}/${userID}`);
  }
  //#endregion

  //#region Export Project Activity List to Excel
  exportProjectActivityListToExcel() {
    return http.get(`/projectactivity/ExportProjectActivityListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new ProjectActivityService();
