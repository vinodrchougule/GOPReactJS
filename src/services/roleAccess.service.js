import http from "../http-common";

class roleAccessService {
  //#region Update Role Access
  updateRoleAccess(data) {
    return http.post("/RoleAccess", data);
  }
  //#endregion

  //#region Get Role Access by Role Name
  ReadRoleAccessByRoleName(roleName, userID) {
    return http.get(`/RoleAccess/${roleName}/${userID}`);
  }
  //#endregion

  //#region Get Role Access
  ReadRoleAccess(userID) {
    return http.get(`/RoleAccess/RoleAccessList/${userID}`);
  }
  //#endregion

  //#region Export Role Access List to Excel
  exportRoleAccessListToExcel() {
    return http.get(`/RoleAccess/ExportRoleAccessListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new roleAccessService();
