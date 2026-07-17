import http from "../../http-common";

class xlsxTotxtConverterService {
  //#region Validate Input File Data
  validateInputFileData(fileName) {
    return http.post(`/XLSXtoTXT/ValidateInputFile?FileName=${fileName}`);
  }
  //#endregion

  convertXlsxToTxt(
    uploadedInputFileName,
    inputFileName,
    delimiter,
    isToTrimCellValues,
  ) {
    return http.post(
      `/XLSXtoTXT/ConvertXLSXtoTXT?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&Delimiter=${delimiter}&IsToTrimCellValues=${isToTrimCellValues}`,
    );
  }
}

export default new xlsxTotxtConverterService();
