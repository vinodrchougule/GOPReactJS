import http from "../http-common";

class CustomerFeedbackTypeService {
  //#region Create Customer Feedback Type
  createCustomerFeedbackType(data) {
    return http.post("/customerfeedbacktype", data);
  }
  //#endregion

  //#region Get Customer Feedback Types
  getCustomerFeedbackTypes(userID, isActiveonly) {
    return http.get(
      `/customerfeedbacktype/readcustomerfeedbacktypes/${userID}/${isActiveonly}`
    );
  }
  //#endregion

  //#region Get Customer Feedback Type by ID
  getCustomerFeedbackType(id, userID) {
    return http.get(`/customerfeedbacktype/${id}/${userID}`);
  }
  //#endregion

  //#region Update Customer Feedback Type
  updateCustomerFeedbackType(id, data) {
    return http.put(`/customerfeedbacktype/${id}`, data);
  }
  //#endregion

  //#region Delete Customer Feedback Type
  deleteCustomerFeedbackType(id, userID) {
    return http.patch(`/customerfeedbacktype/${id}/${userID}`);
  }
  //#endregion

  //#region Export Customer Feedback Type List to Excel
  exportCustomerFeedbackTypeListToExcel() {
    return http.get(
      `/customerfeedbacktype/ExportCustomerFeedbackTypeListToExcel`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new CustomerFeedbackTypeService();
