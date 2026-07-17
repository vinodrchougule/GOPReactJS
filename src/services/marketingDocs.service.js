import http from "../http-common";

class marketingDocsService {
  //#region Upload Marketing Document
  uploadMarketingDocument(data) {
    return http.post("/MarketingDocs/UploadMarketingDocument", data);
  }
  //#endregion

  //#region Read All Marketing Documents
  readAllMarketingDocuments(domain, docType, userID) {
    return http.get(
      `/MarketingDocs/ReadAllMarketingDocuments?Domain=${domain}&DocType=${docType}&UserID=${userID}`
    );
  }
  //#endregion

  downloadMarketingDocument = (domain, docType, fileName) =>
    http.get(
      `/MarketingDocs/DownloadMarketingDocument?Domain=${domain}&DocType=${docType}&FileName=${encodeURIComponent(
        fileName
      )}`,
      { responseType: "blob" }
    );

  previewAsPdf = (domain, docType, fileName) =>
    http.get(
      `/MarketingDocs/PreviewAsPdf?Domain=${domain}&DocType=${docType}&FileName=${encodeURIComponent(
        fileName
      )}`,
      { responseType: "blob" }
    );

  deleteMarketingDocument(id, domain, docType, fileName, userID) {
    return http.post(
      `/MarketingDocs/DeleteMarketingDocument?id=${id}&Domain=${domain}&DocType=${docType}&FileName=${fileName}&UserID=${userID}`
    );
  }

  //#region Download Marketing help file
  downloadHelpDocument() {
    return http.get("/MarketingDocs/DownloadHelpDocument", {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new marketingDocsService();
