import http from "../../http-common";

class txtToXlsxConverterService {
  convertTxtToXlsx(
    uploadedInputFileName,
    inputFileName,
    delimiter,
    isToTrimSplittedValues,
  ) {
    return http.post("/TXTtoXLSX/ConvertTXTtoXLSX", {
      uploadedInputFileName,
      inputFileName,
      delimiter, // Sends the literal "\t" safely inside JSON
      isToTrimSplittedValues,
    });
    // return http.post(
    //   `/TXTtoXLSX/ConvertTXTtoXLSX?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&Delimiter=${encodeURIComponent(encodeURIComponent(delimiter))}&IsToTrimSplittedValues=${isToTrimSplittedValues}`,
    // );
  }
}

export default new txtToXlsxConverterService();
