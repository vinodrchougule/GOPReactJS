import http from "../http-common";

class QCAllocationService {
  //#region Get QC pending Customer Codes
  getCustomerCodes(status) {
    return http.get(`/QCAllocation/ReadProjectsCustomerCodes/${status}`);
  }
  //#endregion

  //#region Get Project Codes of Selected Customer
  getProjectCodesOfCustomer(customerCode) {
    return http.get(`/QCAllocation/ReadProjectCodesOfCustomer/${customerCode}`);
  }
  //#endregion

  //#region Get Batch Nos. of Selected Project Code
  getBatchesOfProject(customerCode, projectCode) {
    return http.get(
      `/QCAllocation/ReadBatchesOfProject/${customerCode}/${projectCode}`
    );
  }
  //#endregion

  //#region Get Project Details of Selected Project Code or Batch No.
  getProjectDetails(customerCode, projectCode, batchNo) {
    return http.get(
      `/QCAllocation/ReadProjectScope/${customerCode}/${projectCode}/${batchNo}`
    );
  }
  //#endregion

  //#region Validate and Allocate QC File
  ValidateAndAllocate(data) {
    return http.post("/QCAllocation", data);
  }
  //#endregion

  //#region Get Existing QC Allocation of Selected Project Code or Batch No.
  getExistingQCAllocation(customerCode, projectCode, batchNo) {
    return http.get(
      `/QCAllocation/ReadExistingProjectQCAllocations/${customerCode}/${projectCode}/${batchNo}`
    );
  }
  //#endregion

  //#region Get Allocation Details of Selected Allocation
  getExistingQCAllocationDetailsByID(id) {
    return http.get(
      `/QCAllocation/ReadExistingProjectAllocationDetailsByID/${id}`
    );
  }
  //#endregion

  //#region Download QC Allocated file
  downloadQCAllocatedFile(id) {
    return http.get("/QCAllocation/downloadfile/" + id, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Delete QC Allocation
  changeQCAllocationUser(data) {
    return http.patch("/QCAllocation/ChangeUser", data);
  }
  //#endregion

  //#region Delete QC allocation activities
  deleteQCAllocationActivities(data) {
    return http.patch("/QCAllocation/DeleteQCAllocationActivities", data);
  }
  //#endregion

  //#region Delete QC Allocation
  deleteQCAllocation(id, userID) {
    return http.patch(`/QCAllocation/DeleteQCAllocation/${id}/${userID}`);
  }
  //#endregion

  //#region Download QC Allocation Completed Activities file
  downloadQCCompletedAllocationActivities(data) {
    return http.post(
      "/QCAllocation/DownloadQCCompletedAllocationActivities",
      data,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download QC Allocation Completed file
  downloadAllocationQCCompletedAllDetails(id) {
    return http.get(
      "/QCAllocation/DownloadAllocationQCCompletedAllDetails/" + id,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Download QC Completed file from Output Table
  downloadQCCompletedOutputTable(customerCode, projectCode, batchNo) {
    return http.get(
      `/QCAllocation/DownloadQCCompletedOutputTable/${customerCode}/${projectCode}/${batchNo}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new QCAllocationService();
