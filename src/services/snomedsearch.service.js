import http from "../http-common";

class snomedSearchService {

    //#Snomed Serach Service
    serchSnomedData(data) {
        return http.post("/snomedsearch/ReadConceptTerms", data);
    }
    //#Snomed Serach Service

    //#Snomed synonyms Data
    snomedSynonymsData(conceptId) {
        return http.get(`/snomedsearch/ReadConceptSynonyms/${conceptId}`);
    }
    //#Snomed synonyms Data

    //#Snomed Parent Data
    snomedParentData(conceptId) {
        return http.get(`/snomedsearch/ReadConceptParents/${conceptId}`);
    }
    //#Snomed Parent Data

    //#Snomed Children Data
    snomedChildrenData(conceptId) {
        return http.get(`/snomedsearch/ReadConceptChildren/${conceptId}`);
    }
    //#Snomed Children Data

    //#region Download SnomedSearcher help file
    DownloadSnomedSearcherHelpFile() {
        return http.get("/snomedsearch/DownloadHelpDocument", {
        responseType: "blob",
        });
    }
    //#endregion
  
}

export default new snomedSearchService();
