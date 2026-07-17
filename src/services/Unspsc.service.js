import http from "../http-common";

class UNSPSCService {
  //#region UNSPSC Version Data Service
  UNSPSCVersionData() {
    return http.get("/UNSPSC/ReadUNSPSCVersions");
  }
  //#endregion

  //#region UNSPSC Latest Version Data
  UNSPSCLatestVersion() {
    return http.get(`/UNSPSC/GetUNSPSCLatestVersion`);
  }
  //#endregion

  //#region UNSPSC Searched Data
  UNSPSCSearchData(data) {
    return http.post(`UNSPSC/ReadUNSPSCSearchResult`, data);
  }
  //#endregion

  //#region UNSPSC Commodity Data
  UNSPSCCommodityData(TableName, Code) {
    return http.get(
      `/UNSPSC/ReadSegmentFamilyClassCommodity/${TableName}/${Code}`
    );
  }
  //#endregion

  //#region Download UNSPSC help file
  DownloadUNSPSCHelpFile() {
    return http.get("/UNSPSC/DownloadHelpDocument", {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new UNSPSCService();
