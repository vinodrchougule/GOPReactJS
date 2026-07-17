import http from "../http-common";

class employeeSpecificReportService {
  //#region fetch previous Day Details Report
  readEmployeeSpecificDetailsReport(employee, fromDate, toDate) {
    return http.get(
      `/EmployeeSpecificReport/ReadEmployeeSpecificDetailsReportData/${employee}/${fromDate}/${toDate}`
    );
  }
  //#endregion

  //#region fetch previous Day Summary Report
  readEmployeeSpecificSummaryReport(employee, fromDate, toDate) {
    return http.get(
      `/EmployeeSpecificReport/ReadEmployeeSpecificSummaryReportData/${employee}/${fromDate}/${toDate}`
    );
  }
  //#endregion

  //#region Download Employee Specific Details Report to Excel
  exportEmployeeSpecificDetailsReportToExcel(employee, fromDate, toDate,userID) {
    return http.get(
      `/EmployeeSpecificReport/ExportEmployeeSpecificDetailsReportDataToExcel/${employee}/${fromDate}/${toDate}/${userID}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion

  //#region Download Employee Specific Summary Report to Excel
  exportEmployeeSpecificSummaryReportToExcel(employee, fromDate, toDate, userID) {
    return http.get(
      `/EmployeeSpecificReport/ExportEmployeeSpecificSummaryReportDataToExcel/${employee}/${fromDate}/${toDate}/${userID}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion
}

export default new employeeSpecificReportService();
