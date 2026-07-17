import { GET_PROJECTBATCHES } from "./projectBatchTypes";
import ProjectBatchService from "../../services/projectBatch.service";

export const getProjectBatches = (id, userID, status) => async (dispatch) => {
  try {
    const res = await ProjectBatchService.getProjectBatches(id, userID, status);

    dispatch({
      type: GET_PROJECTBATCHES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
