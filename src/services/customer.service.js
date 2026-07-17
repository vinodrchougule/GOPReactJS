import http from "../http-common";

class CustomerDataService {
  //#region Create Customer
  createCustomer(data) {
    return http.post("/customer", data);
  }
  //#endregion

  //#region Get All Customers
  getAllCustomers(userID) {
    return http.get(`/customer/${userID}`);
  }
  //#endregion

  //#region Get Customer by ID
  getCustomer(id, userID) {
    return http.get(`/customer/${id}/${userID}`);
  }
  //#endregion

  //#region Update Customer
  updateCustomer(id, data) {
    return http.put(`/customer/${id}`, data);
  }
  //#endregion

  //#region Delete Customer
  deleteCustomer(id, userID) {
    return http.patch(`/customer/${id}/${userID}`);
  }
  //#endregion

  //#region Export Customer List to Excel
  exportCustomersListToExcel() {
    return http.get(`/customer/ExportCustomersListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new CustomerDataService();
