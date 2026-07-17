import http from "../http-common";

class dashboardService {
  //#region Read Dashboard details
  ReadDashboardDetails() {
    return http.get(`/Dashboard`);
  }
  //#endregion

  //#region Read Active Tasks
  ReadActiveTasks() {
    return http.get(`/Dashboard/ReadActiveTasks`);
  }
  //#endregion

  //#region Read Resources
  ReadResources(fromDate, toDate) {
    return http.get(
      `/Dashboard/ReadResources/?FromDate=${fromDate}&ToDate=${toDate}`,
    );
  }
  //#endregion

  //#region Read Resource Productivity Details
  ReadResourceProductivityDetails(userID, fromDate, toDate) {
    return http.get(
      `/Dashboard/ReadResourceProductivityDetails/?UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}`,
    );
  }
  //#endregion

  //#region Read Hours Worked
  ReadHoursWorked() {
    return http.get(`/Dashboard/ReadHoursWorked`);
  }
  //#endregion

  //#region

  //#region Export Active Tasks to Excel
  exportActiveTasksToExcel(userID) {
    return http.get(`/Dashboard/ExportActiveTasksToExcel?UserID=${userID}`, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Export Active Resources to Excel
  exportActiveResourcesToExcel(fromDate, toDate, userID) {
    return http.get(
      `/Dashboard/ExportActiveResourcesToExcel?FromDate=${fromDate}&ToDate=${toDate}&UserID=${userID}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion

  //#region Export Duration Details to Excel
  exportDurationDetailsToExcel(userID) {
    return http.get(
      `/Dashboard/ExportNoOfHoursWorkedToExcel?UserID=${userID}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion

  //#region Read Active Projects
  readActiveProjects(fromDate, toDate) {
    return http.get(
      `/Dashboard/ReadActiveProjects/?FromDate=${fromDate}&ToDate=${toDate}`,
    );
  }
  //#endregion

  //#region Export Active Projects to Excel
  exportActiveProjectsToExcel(fromDate, toDate) {
    return http.get(
      `/Dashboard/ExportActiveProjectsToExcel/?FromDate=${fromDate}&ToDate=${toDate}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion

  //#region Read Projects Completion Status
  ReadProjectsCompletionStatus() {
    return http.get(`/Dashboard/ReadProjectsCompletionStatus`);
  }
  //#endregion
}

export default new dashboardService();
