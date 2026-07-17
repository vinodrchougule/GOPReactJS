import http from "../http-common";

class loginService {
  //#region User Login
  UserLogin(data) {
    return http.patch("/login", data);
  }
  //#endregion

  //#region Get Username by User ID
  getUsername(userID) {
    return http.get(`/account/accountbyusername/${userID}`);
  }
  //#endregion

  //#region Change Password
  changePassword(data) {
    return http.patch("/login/changepassword", data);
  }
  //#endregion

  //#region Forgot Password
  forgotPassword(username) {
    return http.patch(`/login/forgotpassword/${username}`);
  }
  //#endregion

  //#region Reset Password
  resetPassword(username) {
    return http.patch(`/login/ResetPassword/${username}`);
  }
  //#endregion

  //#region Is Password Reset Link Valid
  IsPasswordResetLinkValid(UId) {
    return http.get(`/login/IsPasswordResetLinkValid/${UId}`);
  }
  //#endregion

  //#region Change Password Using Link
  changePasswordUsingPasswordResetLink(data) {
    return http.patch("/login/ChangePasswordUsingPasswordResetLink", data);
  }
  //#endregion

  //#region Alert Password Expiry
  alertPasswordExpiry(username) {
    return http.get(`/login/AlertPasswordExpiry/${username}`);
  }
  //#endregion
}

export default new loginService();
