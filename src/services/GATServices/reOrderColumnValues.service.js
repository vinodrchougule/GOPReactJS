import http from "../../http-common";

class reOrderColumnValues {
  //#region Validate Input File Data
  validateInputFileData(fileName, columnToSort, delimiter) {
    return http.post(
      `/ReOrderColumnValues/ValidateInputData?FileName=${fileName}&ColumnToSort=${columnToSort}&Delimiter=${delimiter}`
    );
  }
  //#endregion

  //#region Sort selected Column Values from input file
  sortTheValuesFromSelectedColumn(
    uploadedInputFileName,
    fileName,
    columnToSort,
    delimiter,
    isToWriteTYPEAttributeAtTheBeginning
  ) {
    return http.post(
      `/ReOrderColumnValues/SortTheValuesFromSelectedColumn?UploadedInputFileName=${uploadedInputFileName}&InputFileName=${fileName}&ColumnToSort=${columnToSort}&Delimiter=${delimiter}&IsToWriteTYPEAttributeAtTheBeginning=${isToWriteTYPEAttributeAtTheBeginning}`
    );
  }
  //#endregion
}

export default new reOrderColumnValues();
