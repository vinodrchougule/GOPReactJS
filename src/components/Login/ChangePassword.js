import React, { Component } from "react";
import helper from "../../helpers/helpers";
import loginService from "../../services/login.service";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class ChangePassword extends Component {
  constructor(props) {
    super(props); //reference to the parent constructor

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
    this.onChangeReTypeNewPassword = this.onChangeReTypeNewPassword.bind(this);

    //Component state
    this.state = {
      username: "",
      password: "",
      newPassword: "",
      reTypeNewPassword: "",
      formErrors: {},
      passWordType: "password",
      newpassWordType: "password",
      repassWordType: "password",
    };
  }

  //#region Component Mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    this.setState({
      username: helper.getUser(),
    });
  }
  //#endregion

  //#region Get password Value
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, passwordError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region on change new password Value
  onChangeNewPassword(e) {
    this.setState({
      newPassword: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, newPasswordError: "" };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Get Re Type Password Value
  onChangeReTypeNewPassword(e) {
    this.setState({
      reTypeNewPassword: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = {
        ...this.state.formErrors,
        reTypeNewPasswordError: "",
      };
      this.setState({ formErrors: formErrors });
    }
  }
  //#endregion

  //#region Validating the input data
  handleFormValidation() {
    const userName = this.state.username.trim();
    const password = this.state.password;
    const newPassword = this.state.newPassword;
    const reTypeNewPassword = this.state.reTypeNewPassword;
    let formErrors = {};
    let isValidForm = true;

    //User Name
    if (!userName) {
      isValidForm = false;
      formErrors["userNameError"] = "User Name is required";
    }

    //Password
    if (!password) {
      isValidForm = false;
      formErrors["passwordError"] = "Password is required";
    } else if (password.length < 6) {
      isValidForm = false;
      formErrors["passwordError"] = "Password must be at least 6 characters";
    }

    //New Password
    if (!newPassword) {
      isValidForm = false;
      formErrors["newPasswordError"] = "New Password is required";
    } else if (newPassword.length < 6) {
      isValidForm = false;
      formErrors["newPasswordError"] =
        "New Password must be at least 6 characters";
    }

    //Re Type Password
    if (!reTypeNewPassword) {
      isValidForm = false;
      formErrors["reTypeNewPasswordError"] = "Re-type Password is required";
    } else if (newPassword !== reTypeNewPassword) {
      isValidForm = false;
      formErrors["reTypeNewPasswordError"] =
        "Re-type New Password doesn't match with new password";
    }

    if (password === newPassword) {
      isValidForm = false;
      formErrors["newPasswordError"] =
        "New Password should not be same as current password";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  // #region Paswword Show and Hide Function
  showHidePassWord = (type, fieldpasswordType) => {

    if (fieldpasswordType === "password") {
      this.setState({ passWordType: type })
    } else if (fieldpasswordType === "new-password") {
      this.setState({ newpassWordType: type })
    } else if (fieldpasswordType === "re-password") {
      this.setState({ repassWordType: type })
    }
  }
  // #endregion Paswword Show and Hide Function

  //#region Change Password
  changePassword = () => {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    if (this.handleFormValidation()) {
      this.setState({
        spinnerMessage: "Please wait while changing the password...",
        loading: true,
      });

      //Bind state data to object
      var data = {
        UserName: this.state.username.trim(),
        Password: this.state.password,
        NewPassword: this.state.newPassword,
      };

      //Service call
      loginService
        .changePassword(data)
        .then(() => {
          toast.success("Password Changed Successfully");
          this.setState(this.initialState);
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

  //#region  UI
  render() {

    return (
      <div className="container">
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
          <div className="az-content-breadcrumb">
            <span>Change Password</span>
          </div>
          <h4>Change Password</h4>
          <br />
          <div className="row row-sm">
            <div className="col-md-3">
              <label>
                <b>Username </b>
              </label>
            </div>
            <div className="col-md-5 mg-t-7 p-0">
              <p>{this.state.username}</p>
            </div>
            <div className="error-message">
              {this.state.formErrors["userNameError"]}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="password">
                <b>Password</b>{" "}
                <span className="text-danger asterisk-size">*</span>
              </label>
            </div>
            <div className="col-md-4 p-0">
              <div className="password-input">
                <input
                  type={this.state.passWordType}
                  className="form-control"
                  tabIndex="1"
                  id="password"
                  name="password"
                  maxLength="50"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                />
                {this.state.passWordType === "password" ?
                  <div><i className="fa fa-eye showHidePassword" onClick={() => this.showHidePassWord("text", "password")} /></div>
                  :
                  <div><i className="fa fa-eye-slash showHidePassword" onClick={() => this.showHidePassWord("password", "password")} /></div>
                }
              </div>
              <div className="error-message">
                {this.state.formErrors["passwordError"]}
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3">
              <label>
                <b>New Password</b>{" "}
                <span className="text-danger asterisk-size">*</span>
              </label>
            </div>
            <div className="col-md-4 p-0">
              <div className="password-input">
                <input
                  type={this.state.newpassWordType}
                  className="form-control"
                  tabIndex="2"
                  id="newPassword"
                  name="newPassword"
                  maxLength="50"
                  value={this.state.newPassword}
                  onChange={this.onChangeNewPassword}
                />
                {this.state.newpassWordType === "password" ?
                  <div><i className="fa fa-eye showHidePassword" onClick={() => this.showHidePassWord("text", "new-password")} /></div>
                  :
                  <div><i className="fa fa-eye-slash showHidePassword" onClick={() => this.showHidePassWord("password", "new-password")} /></div>
                }
              </div>
              <div className="error-message">
                {this.state.formErrors["newPasswordError"]}
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3">
              <label>
                <b>Re-type New Password</b>{" "}
                <span className="text-danger asterisk-size">*</span>
              </label>
            </div>
            <div className="col-md-4 p-0">
              <div className="password-input">
                <input
                  type={this.state.repassWordType}
                  className="form-control"
                  tabIndex="3"
                  id="reTypeNewPassword"
                  name="reTypeNewPassword"
                  maxLength="50"
                  value={this.state.reTypeNewPassword}
                  onChange={this.onChangeReTypeNewPassword}
                />
                {this.state.repassWordType === "password" ?
                  <div><i className="fa fa-eye showHidePassword" onClick={() => this.showHidePassWord("text", "re-password")} /></div>
                  :
                  <div><i className="fa fa-eye-slash showHidePassword" onClick={() => this.showHidePassWord("password", "re-password")} /></div>
                }
              </div>
              <div className="error-message">
                {this.state.formErrors["reTypeNewPasswordError"]}
              </div>
            </div>
          </div>
          <br />
          <div className="row row-sm"></div>
          <br />
          <div className="row row-sm">
            <div className="col-md-3"></div>
            <div className="col-md-3 p-0">
              <button
                className="col-sm-6 col-md-8 mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block"
                tabIndex="4"
                onClick={this.changePassword}
              >
                Change
              </button>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
  //#endregion
}

export default ChangePassword;
