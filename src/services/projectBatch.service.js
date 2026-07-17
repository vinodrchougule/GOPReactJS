import http from "../http-common";

class projectBatchService {
  //#region Download File
  downloadFile(fileName) {
    return http.get(
      "/projectbatch/downloadcustomerinputbatchfile?FileName=" + fileName,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Create Project Batch
  createProjectBatch(data) {
    return http.post("/projectbatch", data);
  }
  //#endregion

  //#region Get All the Batches of Selected Project by Project ID
  getProjectBatches(id, userID, status) {
    return http.get(`/projectbatch/projectbatchlist/${id}/${userID}/${status}`);
  }
  //#endregion

  //#region Get Project Batch Details by Project Batch ID
  getProjectBatchDetailsByID(id, userID) {
    return http.get(`/projectbatch/${id}/${userID}`);
  }
  //#endregion

  //#region Update Project Batch
  updateProjectBatch(id, data) {
    return http.put(`/projectbatch/${id}`, data);
  }
  //#endregion

  //#region Delete Project Batch
  deleteProjectBatch(id, userID) {
    return http.patch(`/projectbatch/${id}/${userID}`);
  }
  //#endregion

  //#region Change Batch no
  changeBatchNo(customerCode, projectCode, BatchNo, changeToBatchNo, userID) {
    return http.post(
      `/projectbatch/ChangeProjectBatchNo/${customerCode}/${projectCode}/${BatchNo}/${changeToBatchNo}/${userID}`
    );
  }
  //#endregion

  //#region Download Project Batch List to Excel
  exportProjectBatchListToExcel(projectID, status) {
    return http.get(
      `/projectbatch/ExportProjectBatchListToExcel/${projectID}/${status}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Deliver Project Batch
  deliverProjectBatch(data) {
    return http.post("/projectbatch/DeliverProjectBatch", data);
  }
  //#endregion

  //#region Delete Delivered Project Batch
  deleteDeliveredProjectBatch(customerCode, projectCode, batchNo, userID) {
    return http.patch(
      `/projectbatch/DeleteDeliveredProjectBatch/${customerCode}/${projectCode}/${batchNo}/${userID}`
    );
  }
  //#endregion
}
export default new projectBatchService();