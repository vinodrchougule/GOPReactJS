import * as types from "../actions/types";

const initialState = {
    uniqueValues: [],
    rowData: [],
}

function productionsData(productions = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.Attribute_Unique_Value:
      return {
        ...productions,
        uniqueValues: payload
    } 
    case types.Attribute_rowData:
      return {
        ...productions,
        rowData: payload
    } 

    default:
      return productions;
  }
}

export default productionsData;