import http from "../../http-common";

class mroDictionaryAttributeValues {
  //#region Validate Input File
  validateInputFile(fileName) {
    return http.post(
      `/MRODictionaryAttributeValues/ValidateInputFile?FileName=${fileName}`
    );
  }
  //#endregion

  //#region Fetch Noun Modifier Attributes Values and Write to output file
  fetchNounModifierAttributeValuesAndWriteToOutputFile(
    uploadedInputFileName,
    inputFileName,
    versionNameOrNo
  ) {
    return http.post(
      `/MRODictionaryAttributeValues/FetchNounModifierAttributeValuesAndWriteToOutputFile?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${inputFileName}&VersionNameOrNo=${versionNameOrNo}`
    );
  }
  //#endregion
}

export default new mroDictionaryAttributeValues();
