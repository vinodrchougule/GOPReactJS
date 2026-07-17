import http from "../http-common";

class userRoleService {
  //#region Create User
  createUserRole(data) {
    return http.post("/UserRole", data);
  }
  //#endregion

  //#region Get UserRole by Username
  ReadUserRolesByUserName(username, userID) {
    return http.get(`/UserRole/${username}/${userID}`);
  }
  //#endregion

  //#region Get UserRoles
  ReadUserRoles(userID) {
    return http.get(`/UserRole/UserRoleList/${userID}`);
  }
  //#endregion

  //#region Export User Role List to Excel
  exportUserRoleListToExcel() {
    return http.get(`/UserRole/ExportUserRolesListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new userRoleService();
