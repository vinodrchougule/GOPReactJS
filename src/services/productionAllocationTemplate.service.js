import http from "../http-common";

class productionAllocationTemplateService {
  //#region Get Allocation pending Customer Codes
  getCustomerCodes() {
    return http.get("/productionallocation");
  }
  //#endregion

  //#region Download ProductionAllocationTemplate File
  DownloadProductionAllocationTemplateFile() {
    return http.get(
      "/productionallocation/DownloadProductionAllocationTemplateFile",
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Allocate Production File
  ValidateAndAllocateForStaticColumns(data) {
    return http.post(
      "/productionallocation/ValidateAndAllocateForStaticColumns",
      data
    );
  }
  //#endregion

  //#region Download ProductionAllocationTemplate File
  ProductionItemDetails(productionItemID) {
    return http.get(`/production/ProductionItemDetails/${productionItemID}`);
  }
  //#endregion

  //#region Production Item Details Of Production User From Allocation
  ProductionItemDetailsOfProductionUserFromAllocation(
    selectedCustomerCode,
    selectedProjectCode,
    ProductionAllocationId,
    user,
    selectedBatchNo,
    currentPage,
    pageSize,
    status
  ) {
    return http.get(
      `/production/ProductionUsersProjectProductionData/?CustomerCode=${selectedCustomerCode}&ProjectCode=${selectedProjectCode}&ProductionAllocationID=${ProductionAllocationId}&ProductionUser=${user}${
        selectedBatchNo && `&BatchNo=${selectedBatchNo}`
      }&PageNo=${currentPage}&PageSize=${pageSize}&IsToFetchOnlyProductionCompletedSKUs=false&status=${status}`
    );
  }
  //#endregion

  //#region Production Item Details Of Production User From Allocation With Status
  ProductionItemDetailsOfProductionUserFromAllocationWithStatus(
    selectedCustomerCode,
    selectedProjectCode,
    ProductionAllocationId,
    user,
    selectedBatchNo,
    currentPage,
    pageSize,
    status
  ) {
    return http.get(
      `/production/ProductionUsersProjectProductionData/?CustomerCode=${selectedCustomerCode}&ProjectCode=${selectedProjectCode}&ProductionAllocationID=${ProductionAllocationId}&ProductionUser=${user}${
        selectedBatchNo && `&BatchNo=${selectedBatchNo}`
      }&PageNo=${currentPage}&PageSize=${pageSize}&IsToFetchOnlyProductionCompletedSKUs=false&status=${status}`
    );
  }
  //#endregion

  //#region Download Production Itme files

  downloadAllProductionItemFiles(
    CustomerCode,
    ProjectCode,
    ProductionAllocationID,
    ProductionUser,
    BatchNo
  ) {
    return http.get(
      `/production/DownloadProjectProductionItemDetailsOfUser?CustomerCode=${CustomerCode}&ProjectCode=${ProjectCode}&ProductionAllocationID=${ProductionAllocationID}&ProductionUser=${ProductionUser}${
        BatchNo && "&BatchNo=" + BatchNo
      }`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Change Production Item Status
  changeProductionItemStatus(ProductionItemID, Status, UserID, Level) {
    return http.patch(
      `/production/ChangeProductionItemStatus/${ProductionItemID}/${Status}/${UserID}/${Level}`
    );
  }
  //#endregio
  //#region Move Selected SKUs To QC
  moveToQC(data) {
    return http.patch(`/production/MoveSelectedSKUsToQC`, data);
  }
  //#endregion

  //#region Read Production Update List Search Fields
  ReadProductionUpdateListSearchFields() {
    return http.get(`/production/ReadProductionUpdateListSearchFields`);
  }
  //#endregion

  //#region Search Production Update List
  SearchProductionUpdateList(
    CustomerCode,
    ProjectCode,
    ProductionAllocationID,
    ProductionUser,
    BatchNo,
    SearchOn,
    SearchText,
    SortOn,
    SortDirection
  ) {
    return http.get(
      `/production/SearchProductionUpdateList/?CustomerCode=${CustomerCode}&ProjectCode=${ProjectCode}&ProductionAllocationID=${ProductionAllocationID}&ProductionUser=${ProductionUser}
            &SearchOn=${SearchOn}&SearchText=${SearchText}&SortOn=${SortOn}&SortDirection=${SortDirection}&BatchNo=${BatchNo}`
    );
  }
  //#endregion
}

export default new productionAllocationTemplateService();
