import http from "../http-common";

class confirmDuplicatesService {
  // #region duplicate SKUs
  readDuplicateSKUs(data) {
    return http.post("/ConfirmDuplicateSKUsFromCIF/ReadDuplicateSKUs", data);
  }
  //  #endregion

  //#region Write CIF data to database
  writeCIFDataToDatabase(customerCode, projectCode, batchNo) {
    return http.post(
      `/ConfirmDuplicateSKUsFromCIF/WriteCIFDataToDatabase?` +
        `CustomerCode=${customerCode}&` +
        `ProjectCode=${projectCode}&` +
        `BatchNo=${batchNo}`
    );
  }
  //#endregion

  //#region Update selected SKUs as Duplicates in CIF table on selected columns
  updateSelectedSKUsAsDuplicates(selectedSKUsData) {
    return http.post(
      "/ConfirmDuplicateSKUsFromCIF/UpdateSelectedSKUsAsDuplicates",
      selectedSKUsData
    );
  }
  //#endregion

  //#region Check if duplicate SKUs already saved in database
  areDuplicateSKUsAlreadySaved(customerCode, projectCode, batchNo) {
    return http.get(
      `/ConfirmDuplicateSKUsFromCIF/AreDuplicateSKUsAlreadySaved?` +
        `CustomerCode=${customerCode}&` +
        `ProjectCode=${projectCode}&` +
        `BatchNo=${batchNo}`
    );
  }
  //#endregion
}

export default new confirmDuplicatesService();
