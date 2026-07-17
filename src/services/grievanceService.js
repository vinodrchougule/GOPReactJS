import http from "../http-common";

class grievanceService {
  //#region Grievance Reach CEO Directly CreateSuggestion
  CreateSuggestion(data) {
    return http.post("/GrievanceReachCEODirectly/CreateSuggestion", data);
  }
  //#endregion

  //#region Grievance Reach CEO Directly ReadSuggestionsByStatus
  ReadSuggestionsByStatus(UserID, Status) {
    return http.get(
      `/GrievanceReachCEODirectly/ReadSuggestionsByStatus?UserID=${UserID}&Status=${Status}`
    );
  }
  //#endregion

  //#region Grievance Reach CEO Directly ReadSuggestionsByStatus
  ReadSuggestionById(id, UserID) {
    return http.get(
      `/GrievanceReachCEODirectly/ReadSuggestionById?id=${id}&UserID=${UserID}`
    );
  }
  //#endregion

  //#region Update Suggestion Status To Closed
  UpdateSuggestionStatusToClosed(id, UserID) {
    return http.patch(
      `/GrievanceReachCEODirectly/UpdateSuggestionStatusToClosed?id=${id}&UserID=${UserID}`
    );
  }
  //#endregion

  //#region Export Suggestions To Excel
  ExportSuggestionsToExcel(UserID, Status) {
    return http.get(
      `/GrievanceReachCEODirectly/ExportSuggestionsToExcel?UserID=${UserID}&Status=${Status}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}
export default new grievanceService();
