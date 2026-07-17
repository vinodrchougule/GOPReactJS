import { GET_PROJECTBATCHES } from "../actions/projectBatch/projectBatchTypes";

const initialState = [];

function projectBatches(projectBatches = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTBATCHES:
      return payload;

    default:
      return projectBatches;
  }
}

export default projectBatches;
