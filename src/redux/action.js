import * as types from "../actions/types";

export const setNMUniqurVaue = (data) => ({
    type: types.Attribute_Unique_Value,
    payload: data,
  });

  export const rowDataPass = (data) => ({
    type: types.Attribute_rowData,
    payload: data,
  });