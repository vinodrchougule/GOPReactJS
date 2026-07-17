import http from "../http-common";

class QCAllocationService {
  //#region Get QCAllocated Customer Codes of logedin User
  getCustomerCodes(QCUser, status) {
    return http.get(`/QC/ReadProjectCustomerCodesOfUser/${QCUser}/${status}`);
  }
  //#endregion

  //#region Get Project Codes of Selected Customer
  getProjectCodesOfCustomer(customerCode, QCUser, status) {
    return http.get(
      `/QC/ReadCustomerProjectCodesOfUser/${customerCode}/${QCUser}/${status}`
    );
  }
  //#endregion

  //#region Get Batch Nos. of Selected Project Code
  getBatchesOfProject(customerCode, projectCode, QCUser, status) {
    return http.get(
      `/QC/ReadCustomerProjectBatchNosOfUser/${customerCode}/${projectCode}/${QCUser}/${status}`
    );
  }
  //#endregion

  //#region Get Activity Details of Selected Project Code or Batch No.
  getActivityDetails(customerCode, projectCode, QCUser, batchNo) {
    return http.get(
      `/QC/ReadProjectActivitiesOfUser/${customerCode}/${projectCode}/${QCUser}/${batchNo}`
    );
  }
  //#endregion

  //#region Download QC Allocated file
  downloadQCAllocatedFile(data) {
    return http.post("/QC/DownloadQCAllocationOfUser/", data, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Upload QC Completed File
  uploadQCCompletedFile(data) {
    return http.post("/QC/ValidateAndUploadQC/", data);
  }
  //#endregion

  //#region Get QC Uploaded details of Selected Project Code or Batch No.
  getQCUploadedDetails(customerCode, projectCode, QCUser, batchNo) {
    return http.get(
      `/QC/ReadExistingProjectUploadsByUser/${customerCode}/${projectCode}/${QCUser}/${batchNo}`
    );
  }
  //#endregion

  //#region Download QC Uploaded file
  downloadQCUploadedFile(id) {
    return http.get("/QC/downloadfile/" + id, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Delete Production Upload
  deleteQCUpload(id, userID) {
    return http.patch(`/QC/DeleteQCUpload/${id}/${userID}`);
  }
  //#endregion

  //#region Download Production Error file
  downloadProductionErrorFile(data) {
    return http.post("/QC/DownloadProductionErrorSKUs/", data, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region QC Items List Services
  //#region Get Moved To QC Customer Codes
  getMovedToQCCustomerCodes() {
    return http.get(`/QC/ReadMovedToQCCustomerCodes`);
  }
  //#endregion

  //#region Get Moved To QC Project Codes
  getMovedToQCProjectCodes(customerCode) {
    return http.get(
      `/QC/ReadMovedToQCProjectCodes?CustomerCode=${customerCode}`
    );
  }
  //#endregion

  //#region Get Moved To QC Batch Nos. of selected Project
  getMovedToQCBatchNosOfProject(customerCode, projectCode) {
    return http.get(
      `/QC/ReadMovedToQCBatchNos?CustomerCode=${customerCode}&ProjectCode=${projectCode}`
    );
  }
  //#endregion

  //#region Get Moved To QC Noun/Modifiers List of selected Project / Batch
  getMovedToQCNounModifiers(customerCode, projectCode, batchNo) {
    return http.get(
      `/QC/ReadMovedToQCNounModifiers?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}`
    );
  }
  //#endregion

  //#region Get Moved To QC Items List of selected Project / Batch
  getMovedToQCProjectItems(
    customerCode,
    projectCode,
    batchNo,
    noun,
    modifier,
    currentPage,
    pageSize
  ) {
    return http.get(
      `/QC/ReadMovedToQCProjectItems?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}&Noun=${noun}&Modifier=${modifier}&PageNo=${currentPage}&PageSize=${pageSize}`
    );
  }
  //#endregion

  //#region Export Moved To QC Noun / Modifiers List to Excel
  exportMovedToQCNounModifiersListToExcel(customerCode, projectCode, batchNo) {
    return http.get(
      `/QC/ExportMovedToQCNounModifiersListToExcel?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Export Moved To QC Items List to Excel
  exportMovedToQCItemsListToExcel(
    customerCode,
    projectCode,
    batchNo,
    noun,
    modifier
  ) {
    return http.get(
      `/QC/ExportMovedToQCItemsListToExcel?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}&Noun=${noun}&Modifier=${modifier}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
  //#endregion
}

export default new QCAllocationService();
