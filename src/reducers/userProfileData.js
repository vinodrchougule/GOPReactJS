import * as types from "../actions/types";

const initialState = {
 userProfile: {},
 userRoles: [],
}

function userProfileData(userProfile = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.User_Profile_Data:
      return {
        ...userProfile,
        userProfile: payload
    }

    case types.User_Role_Data:
      return {
          ...userProfile,
          userRoles: payload
      }
      

    default:
      return userProfile;
  }
}

export default userProfileData;
