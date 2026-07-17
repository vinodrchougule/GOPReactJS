import http from "../../http-common";

class attributeValueConsistencyCheck {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/AttributeValueConsistencyCheck/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Validate UOM File
  validateUOMFile(fileName) {
    return http.post(
      `/AttributeValueConsistencyCheck/ValidateUOMFile?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Fetch the unique UOMs from the UOM file
  fetchUniqueUOMs(fileName) {
    return http.get(
      `/AttributeValueConsistencyCheck/FetchUniqueUOMs?FileName=${fileName}`,
    );
  }
  //#endregion

  //#region Check the attribute value consistency and Write results to output file
  checkAttributeValueConsistency(data) {
    return http.post(
      "/AttributeValueConsistencyCheck/CheckAttributeValueConsistency",
      data,
    );
  }
  //#endregion
}

export default new attributeValueConsistencyCheck();
