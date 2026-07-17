import { combineReducers } from "redux";
import projects from "./projects";
import projectBatches from "./projectBatch";
import userProfileData from "./userProfileData";
import productionsData from "./productionsData";

export default combineReducers({
  projects,
  projectBatches,
  userProfileData,
  productionsData,
});
