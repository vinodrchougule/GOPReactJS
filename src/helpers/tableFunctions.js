class tableFunctions {
  //#region Sort Table
  sortData(array, column, selectedSort, numberColumns, dateColumns) {
    let sortedArray = [];

    sortedArray = array.sort(function (a, b) {
      var x = a[column];
      var y = b[column];

      if (numberColumns.length > 0) {
        if (!numberColumns.includes(column)) {
          x = a[column].toLowerCase();
          y = b[column].toLowerCase();
        }
      }

      if (dateColumns.length > 0) {
        if (dateColumns.includes(column)) {
          x = a[column] !== "" ? new Date(a[column]).getTime() : null;
          y = b[column] !== "" ? new Date(b[column]).getTime() : null;
        }
      }

      if (selectedSort === "ascending") {
        return x < y ? -1 : x > y ? 1 : 0;
      } else if (selectedSort === "descending") {
        return x > y ? -1 : x < y ? 1 : 0;
      } else {
        return array;
      }
    });

    return sortedArray;
  }
  //#endregion

  //#region Filter Table
  filterArray(array, filterValue) {
    let filteredArray = array.filter(
      (data) =>
        JSON.stringify(data)
          .replace(/("\w+":)/g, "")
          .toLowerCase()
          .indexOf(filterValue.toLowerCase()) !== -1
    );

    return filteredArray;
  }
  //#endregion
}

export default new tableFunctions();
