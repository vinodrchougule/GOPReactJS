import http from "../http-common";

class EmployeesTaskReportService {
  //#region Read Employees Task Details Report Data
  readEmployeesTaskDetailsReportData(data) {
    return http.post(
      `/EmployeesTaskReport/ReadEmployeesTaskDetailsReportData`,
      data
    );
  }
  //#endregion

  //#region Download Employees Task Report to Excel
  exportEmployeesTaskReportToExcel(data) {
    return http.post(
      `/EmployeesTaskReport/ExportEmployeesTaskDetailsReportDataToExcel`,
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Read Employees Task Summary Report Data
  readEmployeesTaskSummaryReportData(data) {
    return http.post(
      `/EmployeesTaskReport/ReadEmployeesTaskSummaryReportData`,
      data
    );
  }
  //#endregion

  //#region Download Employees Task Report to Excel
  exportEmployeesTaskSummaryReportToExcel(data) {
    return http.post(
      `/EmployeesTaskReport/ExportEmployeesTaskSummaryReportDataToExcel`,
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Read UnAllocated Resource Details Report Data
  readUnAllocatedResourceDetailsReportData(data) {
    return http.post(
      `/EmployeesTaskReport/ReadUnAllocatedResourceDetailsReportData`,
      data
    );
  }
  //#endregion

  //#region Download Employees Unallocated Resource Report to Excel
  exportUnAllocatedResourceDetailsReportDataToExcel(data) {
    return http.post(
      `/EmployeesTaskReport/ExportUnAllocatedResourceDetailsReportDataToExcel`,
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new EmployeesTaskReportService();
