import React, { Component } from "react";
import loginService from "../../services/login.service";
import { withRouter } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import helper from "../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class ResetPassword extends Component {
  constructor(props) {
    super(props); //reference to the parent constructor

    this.onChangePassword = this.onChangePassword.bind(this);
    //this.sendEmail = this.sendEmail.bind(this);

    //Component State
    this.state = {
      loading: false,
      spinnerMessage: "",
      UId: null,
      newPassword: "",
      showNewPassword: false,
      confirmPassword: "",
      showConfirmPassword: false,
      isToShowResetPasswordForm: false,
      formErrors: {},
    };
  }

  //#region component mount
  componentDidMount() {
    const UId = window.location.href.split("=")[1];
    this.checkIsValidResetPasswordLink(UId);
  }
  //#endregion

  //#region Check Is Valid Reset Password Link
  async checkIsValidResetPasswordLink(UId) {
    this.setState({
      spinnerMessage: "Please wait while loading...",
      loading: true,
      UId: UId,
    });

    await loginService
      .IsPasswordResetLinkValid(UId)
      .then((response) => {
        this.setState({ isToShowResetPasswordForm: true, loading: false });
      })
      .catch((e) => {
        this.setState({ loading: false });
        // toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Change Password
  onChangePassword(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    let formErrors = {};

    if (e.target.value !== "" && e.target.value !== null) {
      if (e.target.name === "newPassword") {
        formErrors = { ...this.state.formErrors, newPasswordError: "" };
      } else if (e.target.name === "confirmPassword") {
        formErrors = { ...this.state.formErrors, confirmPasswordError: "" };
      }
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Show or Hide Password
  handleClickShowPassword() {
    this.setState((previousState) => ({
      showNewPassword: !previousState.showNewPassword,
    }));
  }
  //#endregion

  //#region Show or Hide Confirm Password
  handleClickShowConfirmPassword() {
    this.setState((previousState) => ({
      showConfirmPassword: !previousState.showConfirmPassword,
    }));
  }
  //#endregion

  //#region Validating the input data
  handleFormValidation() {
    const newPassword = this.state.newPassword.trim();
    const confirmPassword = this.state.confirmPassword.trim();
    let formErrors = {};
    let isValidForm = true;

    //New Password
    if (!newPassword) {
      isValidForm = false;
      formErrors["newPasswordError"] = "New Password is required";
    } else if (newPassword.length < 6) {
      isValidForm = false;
      formErrors["newPasswordError"] = "Invalid New Password";
    }

    //New Password
    if (!confirmPassword) {
      isValidForm = false;
      formErrors["confirmPasswordError"] = "Confirm Password is required";
    } else if (newPassword !== confirmPassword) {
      isValidForm = false;
      formErrors["confirmPasswordError"] =
        "Confirm Password doesn't match with new password";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region User Login
  resetPassword = () => {
    if (this.handleFormValidation()) {
      this.setState({
        spinnerMessage: "Please wait while resetting password...",
        loading: true,
      });

      //Bind state data to object
      var data = {
        UId: this.state.UId.trim(),
        Password: this.state.newPassword.trim(),
      };

      //Service call
      loginService
        .changePasswordUsingPasswordResetLink(data)
        .then(() => {
          this.setState({
            loading: false,
            isToShowResetPasswordForm: false,
            newPassword: "",
            confirmPassword: "",
          });
          toast.success("Password Changed Successfully");

          this.props.history.push({
            pathname: "/",
          });
        })

        .catch((error) => {
          this.setState({
            loading: false,
          });
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  render() {
    return (
      <div>
        <LoadingOverlay
          active={this.state.loading}
          className="custom-loader"
          spinner={
            <div className="spinner-background">
              <BarLoader
                css={helper.getcss()}
                color={"#38D643"}
                width={"350px"}
                height={"10px"}
                speedMultiplier={0.3}
              />
              <p style={{ color: "black", marginTop: "5px" }}>
                {this.state.spinnerMessage}
              </p>
            </div>
          }
        >
          {!this.state.isToShowResetPasswordForm && (
            <p className="password-link-invalid">
              Password Reset Link is Invalid
            </p>
          )}
          <div className="az-signin-wrapper">
            <div className="az-card-resetPassword">
              <h1 className="az-logo">GOP</h1>
              <h4>Change Password</h4>
              <div className="az-signin-header">
                <div className="form-group">
                  <label htmlFor="username">New Password</label>
                  <input
                    type={this.state.showNewPassword ? "text" : "password"}
                    className="form-control"
                    maxLength="50"
                    id="newPassword"
                    name="newPassword"
                    tabIndex="1"
                    placeholder="Enter New Password"
                    value={this.state.newPassword}
                    onChange={this.onChangePassword}
                  />
                  <i
                    className={
                      this.state.showNewPassword
                        ? "fas fa-eye-slash field-icon"
                        : "fas fa-eye field-icon"
                    }
                    onClick={() => this.handleClickShowPassword()}
                  ></i>
                  <div className="error-message">
                    {this.state.formErrors["newPasswordError"]}
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type={this.state.showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    maxLength="50"
                    id="confirmPassword"
                    name="confirmPassword"
                    tabIndex="2"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.onChangePassword}
                  />
                  <i
                    className={
                      this.state.showConfirmPassword
                        ? "fas fa-eye-slash field-icon"
                        : "fas fa-eye field-icon"
                    }
                    onClick={() => this.handleClickShowConfirmPassword()}
                  ></i>
                  <div className="error-message">
                    {this.state.formErrors["confirmPasswordError"]}
                  </div>
                </div>
                <button
                  className="btn btn-az-primary btn-block"
                  onClick={this.resetPassword}
                  disabled={
                    !this.state.isToShowResetPasswordForm ? true : false
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default withRouter(ResetPassword);
