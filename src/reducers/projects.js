import { READ_DELIVERED_PROJECTS } from "../actions/types";
import { READ_ONGOING_PROJECTS } from "../actions/types";

const initialState = [];

function projectReducer(projects = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case READ_DELIVERED_PROJECTS:
      return payload;

    case READ_ONGOING_PROJECTS:
      return payload;

    default:
      return projects;
  }
}

export default projectReducer;
