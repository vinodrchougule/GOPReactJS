import http from "../http-common";

class roleService {
  //#region Create Role
  createRole(data) {
    return http.post("/role", data);
  }
  //#endregion

  //#region Get All Roles
  getAllRoles(userID, isActiveonly) {
    return http.get(`/role/roles/${userID}/${isActiveonly}`);
  }
  //#endregion

  //#region Get Role by ID
  getRole(id, userID) {
    return http.get(`/role/${id}/${userID}`);
  }
  //#endregion

  //#region Update Role
  updateRole(id, data) {
    return http.put(`/role/${id}`, data);
  }
  //#endregion

  //#region Delete Role
  deleteRole(id, userID) {
    return http.patch(`/role/${id}/${userID}`);
  }
  //#endregion

  //#region Export Role List to Excel
  exportRoleListToExcel() {
    return http.get(`/role/ExportRolesListToExcel`, {
      responseType: "blob",
    });
  }
  //#endregion
}

export default new roleService();
