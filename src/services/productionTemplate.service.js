import http from "../http-common";

class productionTemplate {
  //#region Get Production Item Details
  getProductionItemDetails(customerCode, projectCode, uniqueId, batchNo) {
    return http.get(
      `/production/ProductionItemDetails/${customerCode}/${projectCode}/${uniqueId}/${batchNo}`
    );
  }
  //#endregion

  //#region Get Noun / Modifier
  getNounModifierList(customerCode, projectCode) {
    return http.get(`/production/NounModifierList?CustomerCode=${customerCode}&ProjectCode=${projectCode}`);
  }
  //#endregion

  //#region Get Attribute List
  getNounModifierAttributeList(customerCode, projectCode, noun, modifier) {
    return http.get(
      `/production/NounModifierAttributeList?CustomerCode=${customerCode}&ProjectCode=${projectCode}&Noun=${noun}&Modifier=${modifier}`
    );
  }
  //#endregion

  //#region Post GOP Edit Screen
  productionItemUpdate(data) {
    return http.post(`/production/ProductionItemUpdate`, data);
  }
  //#endregion

  //#region find duplicate unique Id
  findDublicateUniqueId(data) {
    return http.post(`/production/FindDuplicateUniqueID`, data);
  }
  //#endregion

  //#region Get Manufacturer & Vendor existing names Edit Screen
  productionMFRVendorsName(CustomerCode, ProjectCode, MFRorVendorFlag) {
    return http.get(
      `/production/ProjectMFRorVendorUniqueNames/${CustomerCode}/${ProjectCode}?MFRorVendorFlag=${MFRorVendorFlag}`
    );
  }
  //#endregion

  //#region Get Manufacturer & Vendor existing names Edit Screen
  NMUniqueAttributeValue = (data) => {
    return http.post(
      `/production/ProjectNounModifierUniqueAttributeValues`, data
    );
    
  }
  //#endregion

  //#region Get Read Project Noun Modifier UNSPSC Code And Categories
  UNSPSCcodeCategoryDropDown(customerCode, projectCode, Noun, Modifier) {
    return http.get(`/production/ReadProjectNounModifierUNSPSCCodeAndCategories/${customerCode}/${projectCode}/${Noun}/${Modifier}`);
  }
  //#endregion

  //#region Get Read UNSPSC Versions From Project Noun Modifier
  UNSPSCMroDictionaryCategoryDropDown(customerCode, projectCode, Noun, Modifier) {
    return http.get(`/production/ReadUNSPSCVersionsFromProjectNounModifier?CustomerCode=${customerCode}&ProjectCode=${projectCode}&Noun=${Noun}&Modifier=${Modifier}`);
  }
  //#endregion
  
}

export default new productionTemplate();