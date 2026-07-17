import http from "../../http-common";

class stpInputFormatConversion {
  //#region Validate Input File Data
  validateInputFile(fileName) {
    return http.post(
      `/STPInputFormatConversion/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Validate Taxonomy File Data
  validateTaxonomyFile(fileName) {
    return http.post(
      `/STPInputFormatConversion/ValidateTaxonomyFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Write input and taxonomy files data to server
  writeInputAndTaxonomyDataToDatabase(inputFileName, taxonomyFileName) {
    return http.post(
      `/STPInputFormatConversion/WriteInputAndTaxonomyDataToDatabase?InputFileName=${inputFileName}&TaxonomyFileName=${taxonomyFileName}`
    );
  }
  //#endregion

  //#region Split PO Text and Write it to Columns
  splitPOTextAndWriteOutputToExcel(
    inputFileName,
    uploadedInputFileName,
    inputFileSqlTableName,
    taxonomyFileSqlTableName
  ) {
    return http.post(
      `/STPInputFormatConversion/SplitPOTextAndWriteOutputToExcel?InputFileName=${inputFileName}&UploadedInputFileName=${uploadedInputFileName}&inputFileSqlTableName=${inputFileSqlTableName}&taxonomyFileSqlTableName=${taxonomyFileSqlTableName}`
    );
  }
  //#endregion
}

export default new stpInputFormatConversion();
