import http from "../../http-common";

class convertXlsxDataToVAMSTemplateService {
  convertXlsxDataToVAMSTemplate(
    uploadedInputFileName,
    inputFileName,
    hospitalName,
    itemOrPO,
  ) {
    return http.post(
      `/TXTtoXLSX/ConvertSplittedDataToCommonTemplate?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&HospitalName=${hospitalName}&ItemOrPO=${itemOrPO}`,
    );
  }
}

export default new convertXlsxDataToVAMSTemplateService();
