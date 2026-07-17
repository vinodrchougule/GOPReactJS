import http from "../http-common";

class userService {
  //#region Create User
  createUser(data) {
    return http.post("/account", data);
  }
  //#endregion

  //#region Get All Users
  getAllUsers(userID) {
    return http.get(`/account/${userID}`);
  }
  //#endregion

  //#region Get User by ID
  getUser(id, userID) {
    return http.get(`/account/${id}/${userID}`);
  }
  //#endregion

  //#region Get Users By Department
  getUsersByDepartment(department) {
    return http.get(
      `/account/AccountsListByDepartment?Department=${department}`
    );
  }
  //#endregion

  //#region Update User
  updateUser(id, data) {
    return http.put(`/account/${id}`, data);
  }
  //#endregion

  //#region Delete User
  deleteUser(id, userID) {
    return http.patch(`/account/${id}/${userID}`);
  }
  //#endregion

  //#region Read Departments
  readDepartments() {
    return http.get(`/department`);
  }
  //#endregion

  //#region Read Departments with flag
  readDepartmentsHcNMro(IsToFetchOnlyOperationsDepartments) {
    return http.get(
      `/department?IsToFetchOnlyOperationsDepartments=${IsToFetchOnlyOperationsDepartments}`
    );
  }
  //#endregion

  //#region Read Departments
  resetUserCredential(id, userName) {
    return http.patch(
      `/account/ResetUserCredentials?id=${id}&UserName=${userName}`
    );
  }
  //#endregion

  //#region Export User List to Excel
  exportUserListToExcel(department, manager) {
    return http.get(
      `/account/ExportUsersListToExcel/${department}/${manager}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion
}

export default new userService();
