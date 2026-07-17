import http from "../http-common";

class projectStatusService {
  //#region fetch Project Codes of Customer
  readProjectCodesOfCustomer(customerCode) {
    return http.get(
      `/ProjectStatusReport/ReadProjectCodesOfCustomer/${customerCode}`,
    );
  }
  //#endregion

  //#region fetch Batch Nos of Project
  ReadBatchesOfProject(customerCode, projectCode) {
    return http.get(
      `/ProjectStatusReport/ReadBatchesOfProject/${customerCode}/${projectCode}`,
    );
  }
  //#endregion

  //#region fetch Project Details of Project or Batch
  readProjectDetails(customerCode, projectCode, batchNo) {
    return http.get(
      `/ProjectStatusReport/ReadProjectDetails/${customerCode}/${projectCode}/${batchNo}`,
    );
  }
  //#endregion

  //#region fetch Project Status Report of Project or Batch
  readProjectStatusReportData(customerCode, projectCode, batchNo) {
    return http.get(
      `/ProjectStatusReport/ReadProjectStatusReportData/${customerCode}/${projectCode}/${batchNo}`,
    );
  }
  //#endregion

  //#region Download Project Status to Excel
  exportProjectStatusReportToExcel(customerCode, projectCode, batchNo, userID) {
    return http.get(
      `/ProjectStatusReport/ExportProjectStatusReportToExcel/${customerCode}/${projectCode}/${batchNo}/${userID}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion

  //#region fetch Project Status Activity Summary of Project or Batch
  readProjectStatusActivitySummary(customerCode, projectCode, batchNo) {
    return http.get(
      `/ProjectStatusReport/ReadProjectStatusActivitySummary/${customerCode}/${projectCode}/${batchNo}`,
    );
  }
  //#endregion
}

export default new projectStatusService();
