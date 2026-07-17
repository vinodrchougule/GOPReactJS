import http from "../http-common";

class ItemStatusService {
  //#region Create Item Status
  createItemStatus(data) {
    return http.post("/itemstatus", data);
  }
  //#endregion

  //#region Get All Item Status
  getAllItemStatus(userID) {
    return http.get(`/itemstatus/${userID}`);
  }
  //#endregion

  //#region Get Item Status by ID
  getItemStatus(id, userID) {
    return http.get(`/itemstatus/${id}/${userID}`);
  }
  //#endregion

  //#region Update Item Status
  updateItemStatus(id, data) {
    return http.put(`/itemstatus/${id}`, data);
  }
  //#endregion

  //#region Delete Item Status
  deleteItemStatus(id, userID) {
    return http.patch(`/itemstatus/${id}/${userID}`);
  }
  //#endregion

  //#region Export Item Status List to Excel
  exportItemStatusListToExcel() {
    return http.get(`/itemstatus/ExportItemStatusListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new ItemStatusService();
