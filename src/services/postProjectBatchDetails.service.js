import http from "../http-common";

class postProjectBatchDetailsService {
  //#region Update Post Project Batch Details
  updatePostProjectBatchDetails(data) {
    return http.post("/postprojectbatchdetails", data);
  }
  //#endregion

  //#region Read Post Project Batch Details by Batch No
  readPostProjectBatchDetailsByBatchNo(
    customerCode,
    projectCode,
    batchNo,
    userID
  ) {
    return http.get(
      `/postprojectbatchdetails/${customerCode}/${projectCode}/${batchNo}/${userID}`
    );
  }
  //#endregion
}

export default new postProjectBatchDetailsService();
