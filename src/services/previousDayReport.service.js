import http from "../http-common";

class previousDayReportService {
  //#region fetch previous Day Report
  readpreviousDayReport(fromDate, toDate) {
    return http.get(
      `/PreviousDayReport/ReadPreviousDayReportData/${fromDate}/${toDate}`
    );
  }
  //#endregion

  //#region Download Previous Day Report to Excel
  exportPreviousDayReportToExcel(fromDate, toDate, userID) {
    return http.get(
      `/PreviousDayReport/ExportPreviousDayReportDataToExcel/${fromDate}/${toDate}/${userID}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion
}

export default new previousDayReportService();
