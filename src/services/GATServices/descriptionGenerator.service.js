import http from "../../http-common";

class descriptionGenerator {
  //#region Fetch Setting Names
  fetchSettingNames() {
    return http.get(`/DescriptionGenerator/ReadDGSettingNames`);
  }
  //#endregion

  //#region Validate Input File Data
  validateInputFileData(fileName) {
    return http.post(
      `/DescriptionGenerator/ValidateInputFileData?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Validate Abbreviation File Data
  validateAbbreviationFileData(fileName) {
    return http.post(
      `/DescriptionGenerator/ValidateAbbreviationFileData?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Validate Identifiers File Data
  validateIdentifiersFileData(fileName) {
    return http.post(
      `/DescriptionGenerator/ValidateIdentifiersFileData?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Generate Description
  generateDescription(data) {
    return http.post("/DescriptionGenerator/GenerateDescription", data);
  }
  //#endregion

  //#region Save Description Generator Settings
  saveDescriptionGeneratorSettings(data) {
    return http.post(
      "/DescriptionGenerator/SaveDescriptionGeneratorSettings",
      data
    );
  }
  //#endregion

  //#region Read Description Generator Saved Setting
  readDescriptionGeneratorSavedSetting(settingName) {
    return http.get(
      `/DescriptionGenerator/ReadDescriptionGeneratorSavedSetting?SettingName=${settingName}`
    );
  }
  //#endregion
}

export default new descriptionGenerator();
