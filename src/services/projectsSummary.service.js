import http from "../http-common";

class projectsSummaryService {
  //#region fetch previous Day Report
  ReadProjectsSummaryReportData(fromDate, toDate) {
    return http.get(
      `/ProjectsSummaryReport/ReadProjectsSummaryReportData/${fromDate}/${toDate}`
    );
  }
  //#endregion
}

export default new projectsSummaryService();
