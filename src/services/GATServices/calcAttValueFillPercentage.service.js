import http from "../../http-common";

class calcAttValueFillPercentage {
  //#region Validate Input File first worksheet
  validateInputFileFirstWorksheet(fileName) {
    return http.post(
      `/CalcAttValueFillPercentage/ValidateInputFileFirstWorksheet?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Validate Input File second worksheet
  validateInputFileSecondWorksheet(fileName) {
    return http.post(
      `/CalcAttValueFillPercentage/ValidateInputFileSecondWorksheet?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Calculate Attribute Value Fill Percentage and Write results to output file
  calcAttValueFillPercentageAndWriteOutputToExcel(
    uploadedInputFileName,
    fileName
  ) {
    return http.post(
      `/CalcAttValueFillPercentage/CalcAttValueFillPercentageAndWriteOutputToExcel?UploadedInputFileName=${uploadedInputFileName}&FileName=${fileName}`
    );
  }
  //#endregion
}

export default new calcAttValueFillPercentage();
