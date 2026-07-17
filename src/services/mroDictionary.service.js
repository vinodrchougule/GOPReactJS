import http from "../http-common";

class mroDictionaryService {
   //#region Download Dictionary List Itme files
   DownloadMRODictionaryTemplate(
    
  ) {
    return http.get(
      `/MRODictionary/DownloadMRODictionaryTemplate`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region validating correct file upload 
  validateCorrectFileUpload(fileName) {
    return http.get(`/MRODictionary/ValidateCorrectFileUpload?FileName=${fileName}`);
         
  }
  //#endregion

  //#region read count of all data from file 
  readCountOfAllDataFromFile(fileName) {
      return http.get(`/MRODictionary/ReadCountOfAllDataFromFile?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and upload noun definitions 
  validateAndUploadNounDefinitions(fileName) {
    return http.post(`/MRODictionary/ValidateAndUploadNounDefinitions?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and upload noun modifier definitions
  validateAndUploadNounModifierDefinitions(fileName) {
    return http.post(`/MRODictionary/ValidateAndUploadNounModifierDefinitions?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and upload noun synonyms 
   validateAndUploadNounSynonyms(fileName) {
    return http.post(`/MRODictionary/ValidateAndUploadNounSynonyms?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and upload noun modifier attributes 
  validateAndUploadNounModifierAttributes(fileName) {
    return http.post(`/MRODictionary/ValidateAndUploadNounModifierAttributes?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and upload noun modifier attributes EVVs
  validateAndUploadNounModifierAttributeEVVs(fileName) {
    return http.post(`/MRODictionary/ValidateAndUploadNounModifierAttributeEVVs?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and upload noun modifier mapped UNSPSCs
  validateAndUploadNounModifierMappedUNSPSCs(fileName) {
    return http.post(`/MRODictionary/ValidateAndUploadNounModifierMappedUNSPSCs?FileName=${fileName}`);
  }
  //#endregion

  //#region validate and update MRO Dictionary
  validateAndUpdateMRODictionary(data) {
    return http.post(`/MRODictionary/ValidateAndUpdateMRODictionary`, data);
  }
  //#endregion

  //#region read MRO dictionaries list
  readMRODictionariesList() {
    return http.get(`/MRODictionary/ReadMRODictionariesList`);
  }
  //#endregion

   //#region download selected MRODictionaryVersionDataFile
   downloadSelectedMRODictionaryVersionDataFile(id, fileName, UserID) {
    return http.get(`/MRODictionary/DownloadSelectedMRODictionaryVersionDataFile?MRODictionaryID=${id}&FileName=${fileName}&UserID=${UserID}`,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

   //#region validate and upload noun modifier mapped UNSPSCs
   deleteSelectedMRODictionaryVersion(id, fileName, UserID) {
    return http.patch(`/MRODictionary/DeleteSelectedMRODictionaryVersion?id=${id}&FileName=${fileName}&UserID=${UserID}`);
  }
  //#endregion

  //#region read Read UNSPSC Versions
  readUNSPSCVersions() {
    return http.get(`/UNSPSC/ReadUNSPSCVersions`);
  }
  //#endregion

  //#region read Read All Categories Of Selecetd UNSPSC Version
  readAllCategoriesOfSelecetdUNSPSCVersion(UNSPSCVersion) {
    return http.get(`/UNSPSC/ReadAllCategoriesOfSelecetdUNSPSCVersion?UNSPSCVersion=${UNSPSCVersion}`);
  }
  //#endregion

  //#region read Read All Images From Temp Folder
  readAllImagesFromTempFolder(imageFileNamesList) {
    return http.post(`/MRODictionaryNounModifierTemplate/ReadAllImagesFromTempFolder`, imageFileNamesList);
  }
  //#endregion

  

  //#region Create Noun Modifier Template
  createNounModifierTemplate(model){
    return http.post(`/MRODictionaryNounModifierTemplate/CreateNounModifierTemplate`, model);
  }
  //#endregion


  //#region Noun Modifier Template List
  readNounModifiersTemplateList(UserID, VersionNameOrNo) {
    return http.get(
      `/MRODictionaryNounModifierTemplate/ReadNounModifiersTemplateList?&UserID=${UserID}&VersionNameOrNo=${VersionNameOrNo}`);
  }
  //#endregion

  //#region Read Noun Modifier Details From Selected Version
  readNounModifierDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier ){
    return http.get(`/MRODictionaryNounModifierTemplate/ReadNounModifierDetailsFromSelectedVersion?VersionNameOrNo=${VersionNameOrNo}&Noun=${Noun}&Modifier=${Modifier}`);
  }
  //#endregion 

  //#region Read Noun Synonym Details From Selected Version
  readNounSynonymDetailsFromSelectedVersion(VersionNameOrNo, Noun ){
    return http.get(`/MRODictionaryNounModifierTemplate/ReadNounSynonymDetailsFromSelectedVersion?VersionNameOrNo=${VersionNameOrNo}&Noun=${Noun}`);
  }
  //#endregion 

  //#region Read Noun Modifier Attribute Details From Selected Version
  readNounModifierAttributeDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier ){
    return http.get(`/MRODictionaryNounModifierTemplate/ReadNounModifierAttributeDetailsFromSelectedVersion?VersionNameOrNo=${VersionNameOrNo}&Noun=${Noun}&Modifier=${Modifier}`);
  }
  //#endregion 

  //#region Read Noun Modifier Attribute Values Details From Selected Version
  readNounModifierAttributeValuesDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier ){
    return http.get(`/MRODictionaryNounModifierTemplate/ReadNounModifierAttributeValuesDetailsFromSelectedVersion?VersionNameOrNo=${VersionNameOrNo}&Noun=${Noun}&Modifier=${Modifier}`);
  }
  //#endregion 

  //#region Read Noun Modifier Attribute Values Details From Selected Version
  readNounModifierUNSPSCDetailsFromSelectedVersion(VersionNameOrNo, Noun, Modifier ){
    return http.get(`/MRODictionaryNounModifierTemplate/ReadNounModifierUNSPSCDetailsFromSelectedVersion?VersionNameOrNo=${VersionNameOrNo}&Noun=${Noun}&Modifier=${Modifier}`);
  }
  //#endregion 

  //#region Read Noun Modifier Attribute Values Details From Selected Version
  readNounModifierImages(Noun, Modifier, IsOnlyToView ){
    return http.post(`/MRODictionaryNounModifierTemplate/ReadNounModifierImages?Noun=${Noun}&Modifier=${Modifier}&IsOnlyToView=${IsOnlyToView}`);
  }
  //#endregion 

  //#region Edit Noun Modifier Template
   editNounModifierTemplate(data){
    return http.post(`/MRODictionaryNounModifierTemplate/EditNounModifierTemplate`, data);
  }
  //#endregion
  
  //#region Read Noun Modifier Attribute Values Details From Selected Version
  deleteNounModifierTemplate(VersionNameOrNo, Noun, Modifier, UserID){
    return http.patch(`/MRODictionaryNounModifierTemplate/DeleteNounModifierTemplate?VersionNameOrNo=${VersionNameOrNo}&Noun=${Noun}&Modifier=${Modifier}&UserID=${UserID}`);
  }
  //#endregion

  //#region Download MRO Dictionary help file
  downloadHelpDocument() {
    return http.get("/MRODictionaryNounModifierTemplate/DownloadHelpDocument", {
    responseType: "blob",
    });
  }
//#endregion
}

export default new mroDictionaryService();
