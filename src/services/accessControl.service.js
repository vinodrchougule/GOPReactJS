import http from "../http-common";

class accessControlService {
  //#region Read User Menu Access List
  ReadUserMenuAccessList(userName, menuPanel) {
    return http.get(
      `/AccessControl/ReadUserMenuAccessList/${userName}/${menuPanel}`
    );
  }
  //#endregion

  //#region Read User Menu Access List
  CanUserAccessPage(userName, pageName) {
    return http.get(`/AccessControl/CanUserAccessPage/${userName}/${pageName}`);
  }
  //#endregion
}

export default new accessControlService();
