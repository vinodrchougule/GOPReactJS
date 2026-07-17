import accessControlService from "../services/accessControl.service";
import { css } from "@emotion/react";

class helpers {
  //#region Get User
  getUser() {
    const username = sessionStorage.getItem("username");
    return username;
  }
  //#endregion

  //#region Get User Page Access
  canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(this.getUser(), pageName)
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        return e;
      });
  };
  //#endregion

  getcss() {
    return css`
      display: block;
      margin: 0 auto;
      border-color: red;
      border: none;
    `;
  }

  IsValidFileExtension(fileName, allowedFileExtensions) {
    let fileExtensionArray = fileName.split(".");
    let fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

    return allowedFileExtensions.indexOf(fileExtension) > -1;
  }
}

export default new helpers();
