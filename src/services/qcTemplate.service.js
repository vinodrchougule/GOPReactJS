import http from "../http-common";

class qcTemplate {
  //#region Get QC Item Details
  getQCItemDetails(qcItemID) {
    return http.get(`/QC/QCItemDetails/${qcItemID}`);
  }
  //#endregion

  //#region Post GOP QC Edit Screen
  qcItemUpdate(data) {
    return http.post(`/QC/QCItemUpdate`, data);
  }
  //#endregion
}

export default new qcTemplate();
