import http from "../http-common";

class onScreenProductionAllocationService {
  //#region get Pending To Allocate SKUs From CIF
  getPendingToAllocateSKUsFromCIF(
    customerCode,
    projectCode,
    batchNo,
    searchOn,
    searchText,
  ) {
    return http.get(
      `/ProductionAllocation/ReadPendingToAllocateSKUsFromCIF?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}&SearchOn=${searchOn}&SearchText=${searchText}`,
    );
  }
  //#endregion

  // #region validate and allocate Selecetd SKUs From Pending To Allocate List
  validateAndAllocateSelecetdSKUsFromPendingToAllocateList(data) {
    return http.post(
      "/ProductionAllocation/ValidateAndAllocatePendingSKUs",
      data,
    );
  }
  //  #endregion

  //#region get the already allocated SKUs of Project / Batch
  getProductionAllocatedSKUsOfProject(
    customerCode,
    projectCode,
    productionUser,
    batchNo,
    whichSKUs,
  ) {
    return http.get(
      `/ProductionAllocation/ReadProductionAllocatedSKUsOfProject?CustomerCode=${customerCode}&ProjectCode=${projectCode}&ProductionUser=${productionUser}&BatchNo=${batchNo}&WhichSKUs=${whichSKUs}`,
    );
  }
  //#endregion

  // #region validate and move allocated SKUs To Pending To Allocate List
  validateAndMoveAllocatedSKUsToPending(data) {
    return http.post(
      "/ProductionAllocation/ValidateAndMoveAllocatedSKUsToPending",
      data,
    );
  }
  //  #endregion

  //#region read Project Allocated User Names
  getProjectAllocatedUserNames(customerCode, projectCode, batchNo) {
    return http.get(
      `/ProductionAllocation/ReadProjectAllocatedUserNames?CustomerCode=${customerCode}&ProjectCode=${projectCode}&BatchNo=${batchNo}`,
    );
  }
  //#endregion

  //#region Validate and Re-Allocate SKUs
  validateAndReAllocateSKUs(data) {
    return http.post("/ProductionAllocation/ValidateAndReAllocateSKUs", data);
  }
  //#endregion
}

export default new onScreenProductionAllocationService();
