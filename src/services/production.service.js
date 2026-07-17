import http from "../http-common";

class productionAllocationService {
  //#region Get Allocation pending Customer Codes
  getCustomerCodes(productionUser, status) {
    return http.get(
      `/production/ReadProjectCustomerCodesOfUser/${productionUser}/${status}`
    );
  }
  //#endregion

  //#region Get Project Codes of Selected Customer
  getProjectCodesOfCustomer(customerCode, productionUser, status) {
    return http.get(
      `/production/ReadCustomerProjectCodesOfUser/${customerCode}/${productionUser}/${status}`
    );
  }
  //#endregion

  //#region Get Batch Nos. of Selected Project Code
  getBatchesOfProject(customerCode, projectCode, productionUser, status) {
    return http.get(
      `/production/ReadCustomerProjectBatchNosOfUser/${customerCode}/${projectCode}/${productionUser}/${status}`
    );
  }
  //#endregion

  //#region Get Project Details of Selected Project Code or Batch No.
  getProjectDetails(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/ReadProjectScope/${customerCode}/${projectCode}/${batchNo}`
    );
  }
  //#endregion

  //#region Get Activity Details of Selected Project Code or Batch No.
  getActivityDetails(customerCode, projectCode, productionUser, batchNo) {
    return http.get(
      `/production/ReadProjectActivitiesOfUser/${customerCode}/${projectCode}/${productionUser}/${batchNo}`
    );
  }
  //#endregion

  //#region Download Production Allocated file
  downloadProductionAllocatedFile(data) {
    return http.post("/production/DownloadProductionAllocationOfUser/", data, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Upload Production Completed File
  uploadProductionCompletedFile(data) {
    return http.post("/production/ValidateAndUploadProduction/", data);
  }
  //#endregion

  //#region Get Production Uploaded details of Selected Project Code or Batch No.
  getProductionUploadedDetails(
    customerCode,
    projectCode,
    productionUser,
    batchNo
  ) {
    return http.get(
      `/production/ReadExistingProjectUploadsByUser/${customerCode}/${projectCode}/${productionUser}/${batchNo}`
    );
  }
  //#endregion

  //#region Download Allocated file
  downloadUploadedFile(id) {
    return http.get("/production/downloadfile/" + id, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Delete Production Upload
  deleteProductionUpload(id, userID) {
    return http.patch(`/production/DeleteProductionUpload/${id}/${userID}`);
  }
  //#endregion

  //#region Download Production Error file
  downloadProductionErrorFile(data) {
    return http.post(
      "/production/DownloadProductionAllocationErrorsOfUser/",
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Upload Production Error File
  uploadProductionErrorFile(data) {
    return http.post("/production/ValidateAndUploadProductionErrorSKUs/", data);
  }
  //#endregion

  // #region find duplicates
  findDuplicates(data) {
    return http.post("/production/FindDuplicatesOnSelectedColumns", data);
  }
  //  #endregion

  // #region find duplicates
  findCustomerDuplicates(data) {
    return http.post(
      "/production/ReadDuplicateSKUsBasedOnSelectedColumnsFromCustomerInputFile",
      data
    );
  }
  //  #endregion

  //#region Get Allocation pending Customer Codes
  getqcCustomerCodes() {
    return http.get("/productionallocation");
  }
  //#endregion

  //#region Get Project Codes of Selected Customer
  ReadOnGoingProjectCodesOfCustomer(customerCode) {
    return http.get(
      `/productionallocation/ReadOnGoingProjectCodesOfCustomer/${customerCode}`
    );
  }
  //#endregion

  //#region Get Batch Nos. of Selected Project Code
  ReadOnGoingBatchesOfProject(customerCode, projectCode) {
    return http.get(
      `/productionallocation/ReadOnGoingBatchesOfProject/${customerCode}/${projectCode}`
    );
  }
  //#endregion

  //#region Search
  ReadAllSKUsPendingForQCFromSelectedProjectOrBatch(searchData) {
    return http.get(
      `/production/ReadAllSKUsPendingForQCFromSelectedProjectOrBatch/?CustomerCode=${searchData.customerCode}&ProjectCode=${searchData.projectCode}`
    );
  }

  //#endregion

  //#region Production Rejected Items Services (QC Feedbacks)
  //#region Production Rejected Items List of Production User from selected Project / Batch
  getProductionRejectedProjectItems(
    productionUser,
    customerCode,
    projectCode,
    batchNo
  ) {
    return http.get(
      `/production/ReadProductionUsersRejectedItemsOfProject?ProductionUser=${productionUser}&CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}`
    );
  }
  //#endregion

  //#region Export Production Rejected Items List to Excel
  exportProductionRejectedItemsListToExcel(
    productionUser,
    customerCode,
    projectCode,
    batchNo
  ) {
    return http.get(
      `/production/ExportProductionRejectedItemsListToExcel?ProductionUser=${productionUser}&CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Project Overall Status
  getProjectOverallStatus(customerCode, projectCode, batchNo, status) {
    return http.get(
      `/production/ReadProjectOverallStatus?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}&Status=${status}`
    );
  }
  //#endregion

  //#region Fetch Date Range Status report data
  readDateRangeStatus(fromDate, toDate, status) {
    return http.get(
      `/production/ReadDateRangeStatus?FromDate=${fromDate}&ToDate=${toDate}&Status=${status}`
    );
  }
  //#endregion

  //#region Export Date Range Status report data to Excel
  exportDateRangeStatusListToExcel(fromDate, toDate, userID,status) {
    return http.get(
      `/production/ExportDateRangeStatusListToExcel?FromDate=${fromDate}&ToDate=${toDate}&UserID=${userID}&Status=${status}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion

  //#region User Based Status Report
  //#region Read User Names list
  readProductionAndQCUniqueUserNames() {
    return http.get(`/production/ReadProductionAndQCUniqueUserNames`);
  }
  //#endregion

  //#region Fetch User Based Status report data
  readUserBasedStatus(userName, status) {
    return http.get(
      `/production/ReadUserBasedStatus?UserName=${userName}&Status=${status}`
    );
  }
  //#endregion

  //#region Export User Based Status report data to Excel
  exportUserBasedStatusListToExcel(userName,userID, status) {
    return http.get(
      `/production/ExportUserBasedStatusListToExcel?UserName=${userName}&UserID=${userID}&Status=${status}`,
      {
        responseType: "blob",
      },
    );
  }
  //#endregion
  //#endregion

  //#region Fetch Project Level Quality Report
  readProjectLevelQualityReportCountStats(customerCode, projectCode, batchNo) {
    return http.get(
      `/production/ReadProjectLevelQualityReportCountStats?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}`
    );
  }

  readProjectLevelQualityReportSKUDetails(
    customerCode,
    projectCode,
    batchNo,
    status
  ) {
    return http.get(
      `/production/ReadProjectLevelQualityReportSKUDetails?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}&Status=${status}`
    );
  }

  exportProjectLevelQualityReportToExcel(
    customerCode,
    projectCode,
    batchNo,
    userID,
    status
  ) {
    return http.get(
      `/production/ExportProjectLevelQualityReportToExcel?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}&UserID=${userID}&Status=${status}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Fetch Resource Level Quality Report
  readResourceLevelQualityReportCountStats(
    userName,
    customerCode,
    projectCode,
    fromDate,
    toDate,
    batchNo
  ) {
    return http.get(
      `/production/ReadResourceLevelQualityReportCountStats?UserName=${userName}&CustomerCode=${customerCode}&ProjectCode=${projectCode}&FromDate=${fromDate}&ToDate=${toDate}&BatchNo=${batchNo}`
    );
  }

  readResourceLevelQualityReportSKUDetails(
    userName,
    customerCode,
    projectCode,
    fromDate,
    toDate,
    batchNo,
    status
  ) {
    return http.get(
      `/production/ReadResourceLevelQualityReportSKUDetails?UserName=${userName}&CustomerCode=${customerCode}&ProjectCode=${projectCode}&FromDate=${fromDate}&ToDate=${toDate}&BatchNo=${batchNo}&Status=${status}`
    );
  }

  exportResourceLevelQualityReportToExcel(
    userName,
    customerCode,
    projectCode,
    fromDate,
    toDate,
    batchNo,
    userID,
    status
  ) {
    return http.get(
      `/production/ExportResourceLevelQualityReportToExcel?UserName=${userName}&CustomerCode=${customerCode}&ProjectCode=${projectCode}&FromDate=${fromDate}&ToDate=${toDate}&BatchNo=${batchNo}&UserID=${userID}&Status=${status}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new productionAllocationService();
