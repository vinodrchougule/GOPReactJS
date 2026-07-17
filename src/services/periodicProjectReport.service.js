import http from "../http-common";

class periodicProjectReportService {
  //#region fetch Periodic Project Report of Project or Batch
  ReadPeriodicProjectReportData(data) {
    return http.post(
      `/PeriodicProjectReport/ReadPeriodicProjectReportData`,
      data
    );
  }
  //#endregion

  //#region Download Periodic Project Report to Excel
  exportPeriodicProjectReportToExcel(data) {
    return http.post(
      `/PeriodicProjectReport/ExportPeriodicProjectReportDataToExcel`,
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new periodicProjectReportService();
