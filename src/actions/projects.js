import { READ_DELIVERED_PROJECTS } from "./types";
import { READ_ONGOING_PROJECTS } from "./types";
import ProjectService from "../services/project.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export const readOnGoingProjectsList = (data) => async (dispatch) => {
  try {
    const res = await ProjectService.readOnGoingProjectsList(data);
    dispatch({
      type: READ_ONGOING_PROJECTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const readDeliveredProjectsList = (data) => async (dispatch) => {
  try {
    const res = await ProjectService.readDeliveredProjectsList(data);

    dispatch({
      type: READ_DELIVERED_PROJECTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
