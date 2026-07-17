import http from "../http-common";

class incidentTypeService {
  //#region validate and upload noun definitions
  PostAddIncidentType(data) {
    return http.post(`/IncidentType/PostAddIncidentType`, data);
  }
  //#endregion

  //#region Incident Type List
  ReadAllIncidentTypes(userID, IsToFetchOnlyActiveIncidentTypes) {
    return http.get(
      `/IncidentType/ReadAllIncidentTypes?UserID=${userID}&IsToFetchOnlyActiveIncidentTypes=${IsToFetchOnlyActiveIncidentTypes}`
    );
  }
  //#endregion

  //#region Incident Type ID
  readIncidentTypeById(userID, IncidentTypeID) {
    return http.get(
      `/IncidentType/ReadIncidentTypeById?UserID=${userID}&IncidentTypeID=${IncidentTypeID}`
    );
  }
  //#endregion

  //#region validate and upload noun definitions
  postUpdateIncidentType(data) {
    return http.post(`/IncidentType/PostUpdateIncidentType`, data);
  }
  //#endregion

  //#region validate and upload noun definitions
  postDeleteIncidentType(data) {
    return http.post(`/IncidentType/PostDeleteIncidentType`, data);
  }
  //#endregion

  //#region Export Incident Type List to Excel
  exportIncidentTypeListToExcel(userID) {
    return http.get(
      `/IncidentType/ExportIncidentTypesListToExcel?UserID=${userID}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}
export default new incidentTypeService();
