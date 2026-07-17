import * as types from "../actions/types";
import http from "../http-common";

// const userProfileService = {
//   getUserProfile: (userName) => {
//     return http.get(`/account/accountbyusername/${userName}`);
//   }
// };

const setUserProfileData = (data) => ({
    type: types.User_Profile_Data,
    payload: data,
  });

const setUserRoleData = (data) => ({
    type: types.User_Role_Data,
    payload: data,
  });

export const loadUserProfile = (userName) => {
    return function(dispatch){
        return http.get(`/account/accountbyusername/${userName}`)
        .then((resp) => {
              dispatch(setUserProfileData(resp.data))
              return resp.data;
            })
            .catch((err) => {
              console.log(err)
              return null;
            });
    }
  }
export const loadUserRoleAccess = (userName) => {
    return function(dispatch){
        return http.get(`/UserRole/ReadUserRolesPagewiseAccess/${userName}`)
        .then((resp) => {
              dispatch(setUserRoleData(resp.data))
            })
            .catch((err) => {
              console.log(err)
            });
    }
  }

// export default userProfileService;