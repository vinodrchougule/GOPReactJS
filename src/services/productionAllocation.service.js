import http from "../http-common";

class productionAllocationService {
  //#region Get Allocation pending Customer Codes
  getCustomerCodes() {
    return http.get("/productionallocation");
  }
  //#endregion

  //#region Get Project Codes of Selected Customer
  getProjectCodesOfCustomer(customerCode) {
    return http.get(
      `/productionallocation/ReadOnGoingProjectCodesOfCustomer/${customerCode}`
    );
  }
  //#endregion

  //#region Get Batch Nos. of Selected Project Code
  getBatchesOfProject(customerCode, projectCode) {
    return http.get(
      `/productionallocation/ReadOnGoingBatchesOfProject/${customerCode}/${projectCode}`
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
  //#region Get Project Details of Selected Project Code or Batch No.
  getOnScreenProjectDetails(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/ReadProjectAllocationAndCompletedCountStatus?CustomerCode=${customerCode}&ProjectCode=${projectCode}${batchNo && '&BatchNo='+batchNo}`
    );
  }
  //#endregion

  //#region Get Activity Details of Selected Project Code or Batch No.
  getActivityDetails(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/ReadProjectActivities/${customerCode}/${projectCode}/${batchNo}`
    );
  }
  //#endregion

  //#region Get Unique Column Naames of Selected file or Project
  getUniqueColumnNames(fileName, customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/ReadUniqueColumnNames/${fileName}/${customerCode}/${projectCode}/${batchNo}`
    );
  }
  //#endregion

  //#region Allocate Production File
  ValidateAndAllocate(data) {
    return http.post("/productionallocation", data);
  }
  //#endregion

  //#region Get Existing Project Allocation Details of Selected Project Code or Batch No.
  getExistingProjectAllocationDetails(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/ReadExistingProjectAllocations/${customerCode}/${projectCode}/${batchNo}`
    );
  }
  //#endregion

  //#region Get Allocation Details of Selected Allocation
  getExistingProjectAllocationDetailsByID(id) {
    return http.get(
      `/productionallocation/ReadExistingProjectAllocationDetailsByID/${id}`
    );
  }
  //#endregion

  //#region Download Allocated file
  DownloadAllocatedFile(id) {
    return http.get("/productionallocation/downloadfile/" + id, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Delete Production Allocation
  deleteProductionAllocation(id, userID) {
    return http.patch(
      `/productionallocation/DeleteProductionAllocation/${id}/${userID}`
    );
  }
  //#endregion

  //#region Delete On Screen Production Allocation
  deleteOnScreenProductionAllocation(id, userID) {
    return http.patch(
      `/productionallocation/DeleteProductionAllocationProductionPendingSKUs?id=${id}&UserID=${userID}`
    );
  }
  //#endregion

  //#region Delete Production allocation activities
  deleteProductionAllocationActivities(data) {
    return http.patch(
      "/productionallocation/DeleteProductionAllocationActivities",
      data
    );
  }
  //#endregion

  //#region Delete On Screen Production allocation activities
  deleteOnScreenProductionAllocationActivities(data) {
    return http.patch(
      "/productionallocation/DeleteProductionAllocationProductionUsersPendingSKUs",
      data
    );
  }
  //#endregion

  //#region Delete Production Allocation
  changeProductionAllocationUser(data) {
    return http.patch("/productionallocation/ChangeUser", data);
  }
  //#endregion

  //#region Download Production Allocation Completed file
  downloadAllocationProductionCompletedAllDetails(id) {
    return http.get(
      "/productionallocation/DownloadAllocationProductionCompletedAllDetails/" +
        id,
      {
        responseType: "blob",
      }
    );
  }
  downloadAllocationProductionCompletedSKUs(id) {
    return http.get(
      "/productionallocation/DownloadAllocationProductionCompletedSKUs?id=" +
        id,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download Production Allocation Completed Activities file
  downloadProductionCompletedAllocationActivities(data) {
    return http.post(
      "/productionallocation/DownloadProductionCompletedAllocationActivities",
      data,
      {
        responseType: "blob",
      }
    );
  }
  
  downloadProductionCompletedAllocationActivitiesSKUs(data) {
    return http.post(
      "/productionallocation/DownloadProductionCompletedAllSKUsOfUser",
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download Production Completed file from Output Table
  downloadProductionCompletedOutputTable(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation//DownloadProductionCompletedOutputTable/${customerCode}/${projectCode}/${batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download GOP help file
  DownloadGOPHelpFile() {
    return http.get("/productionallocation/DownloadHelpDocument", {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Read Production Pending SKUs By Production User
  readProductionPendingSKUsByProductionUser(data) {
    return http.post(
      "/productionallocation/ReadProductionPendingSKUsByProductionUser",
      data
    );
  }
  //#endregion

  //#region Change SKU Production User
  ChangeSKUProductionUser(data) {
    return http.patch("/productionallocation/ChangeSKUProductionUser", data);
  }
  //#endregion

  //#region Download Allocated file
  downloadAllProductionAllocatedSKUs(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/DownloadAllProductionAllocatedSKUs/${customerCode}/${projectCode}/${batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download Allocated file
  downloadAllProductionPendingSKUs(customerCode, projectCode, batchNo) {
    return http.get(
      `/productionallocation/DownloadAllProductionPendingSKUs/${customerCode}/${projectCode}/${batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download Allocated file
  downloadAllProductionOnScreenPendingSKUs(customerCode, projectCode, batchNo) {
    return http.get(
      `http://localhost:51786/api/productionallocation/DownloadProductionPendingSKUs?CustomerCode=${customerCode}&ProjectCode=${projectCode}${batchNo && "&BatchNo=" + batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new productionAllocationService();
