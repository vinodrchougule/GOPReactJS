import http from "../http-common";

class incidentRegisterService {
  //#region Post Register Incident
  postRegisterIncident(data) {
    return http.post(`/IncidentRegister/PostRegisterIncident`, data);
  }
  //#endregion

  //#region Read Incident Search Values
  readIncidentSearchValues(searchField) {
    return http.get(
      `/IncidentRegister/ReadIncidentsUniqueSearchValuesBySearchField?SearchField=${searchField}`
    );
  }
  //#endregion

  //#region Read Incidents By Search Field and Search Value
  readIncidentsBySearchFieldAndSearchValue(searchField, searchValue) {
    return http.get(
      `/IncidentRegister/ReadIncidentsBySearchFieldAndSearchValue?SearchField=${searchField}&SearchValue=${searchValue}`
    );
  }
  //#endregion

  //#region Read All Incidents
  readAllIncidents(userID) {
    return http.get(`/IncidentRegister/ReadAllIncidents?UserID=${userID}`);
  }
  //#endregion

  //#region Read Incident By Id
  readIncidentById(incidentRegisterID) {
    return http.get(
      `/IncidentRegister/ReadIncidentById?incidentRegisterID=${incidentRegisterID}`
    );
  }
  //#endregion

  //#region Read Incident Years
  readIncidentYears() {
    return http.get(`/IncidentRegister/ReadIncidentYears`);
  }
  //#endregion

  //#region Read Incidents Count Summary By Year
  readIncidentsCountSummaryByYear(userID, year) {
    return http.get(
      `/IncidentRegister/ReadIncidentsCountSummaryByYear?UserID=${userID}&YearOfIncident=${year}`
    );
  }
  //#endregion

  //#region Read Incidents By Incident Year And Status
  readIncidentsByIncidentYearAndStatus(department, incidentType, status, year) {
    return http.get(
      `/IncidentRegister/ReadIncidentsByIncidentYearAndStatus?Department=${department}&IncidentType=${incidentType}&Status=${status}&YearOfIncident=${year}`
    );
  }
  //#endregion

  //#region Post Update Incident
  postUpdateIncident(data) {
    return http.post(`/IncidentRegister/PostUpdateIncident`, data);
  }
  //#endregion

  //#region Post Delete Incident
  postDeleteIncident(data) {
    return http.post(`/IncidentRegister/PostDeleteIncident`, data);
  }
  //#endregion

  //#region Export Incidents List To Excel
  exportIncidentsListToExcel(userID) {
    return http.get(
      `/IncidentRegister/ExportIncidentsListToExcel?UserID=${userID}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Post Update Action on Incident
  postUpdateActionOnIncident(data) {
    return http.post(`/IncidentRegister/PostUpdateActionOnIncident`, data);
  }
  //#endregion

  //#region Export the list of Incidents status count summary
  exportIncidentsStatusCountSummaryToExcel(year) {
    return http.get(
      `/IncidentRegister/ExportIncidentsStatusCountSummaryListToExcel?YearOfIncident=${year}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Export the list of Incidents status count summary
  exportIncidentsListByYearAndStatusToExcel(
    department,
    incidentType,
    status,
    year
  ) {
    return http.get(
      `/IncidentRegister/ExportIncidentsListByYearAndStatusToExcel?Department=${department}&IncidentType=${incidentType}&Status=${status}&YearOfIncident=${year}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
  
    //#region Download Incident Report help file
    DownloadHelpFile() {
        return http.get("/IncidentRegister/DownloadHelpDocument", {
          responseType: "blob",
        });
    }
    //#endregion
}
export default new incidentRegisterService();
