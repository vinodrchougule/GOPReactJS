import http from "../../http-common";

class xlsxTocsvConverterForVAMSService {
  //#region Validate Input File Data
  validateInputFileData(fileName) {
    return http.post(
      `/XLSXtoCSVConverterForVAMS/ValidateInputFile?FileName=${fileName}`,
    );
  }
  //#endregion

  convertXlsxToCsv(
    uploadedInputFileName,
    inputFileName,
    delimiter,
    inputHospitalName,
    itemOrPO,
    isToTrimCellValues,
    isToWriteEachHospitalDataInSeparateFile,
  ) {
    return http.post(
      `/XLSXtoCSVConverterForVAMS/ConvertXLSXtoCSVForVAMS?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&Delimiter=${delimiter}&inputHospitalName=${inputHospitalName}&ItemOrPO=${itemOrPO}&IsToTrimCellValues=${isToTrimCellValues}&IsToWriteEachHospitalDataInSeparateFile=${isToWriteEachHospitalDataInSeparateFile}`,
    );
  }
}

export default new xlsxTocsvConverterForVAMSService();
