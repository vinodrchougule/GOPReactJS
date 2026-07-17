import http from "../http-common";

class ProjectSubActivityService {
  //#region Create Project Sub Activity
  createProjectSubActivity(data) {
    return http.post("/projectsubactivity", data);
  }
  //#endregion

  //#region Get All Project Sub Activities
  getAllSubActivities(userID) {
    return http.get(`/projectsubactivity/${userID}`);
  }
  //#endregion

  //#region Get Project Sub Activity by ID
  getProjectSubActivity(id, userID) {
    return http.get(`/projectsubactivity/${id}/${userID}`);
  }
  //#endregion

  //#region Update Project Sub Activity
  updateProjectSubActivity(id, data) {
    return http.put(`/projectsubactivity/${id}`, data);
  }
  //#endregion

  //#region Delete Project Sub Activity
  deleteProjectSubActivity(id, userID) {
    return http.patch(`/projectsubactivity/${id}/${userID}`);
  }
  //#endregion

  //#region Export Project Sub-Activity List to Excel
  exportProjectSubActivityListToExcel() {
    return http.get(`/projectsubactivity/ExportProjectSubActivityListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new ProjectSubActivityService();
