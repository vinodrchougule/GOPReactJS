import React, { Component } from "react";
import { Link } from "react-router-dom";
import loginService from "../../services/login.service";
import { Button, Modal } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import helper from "../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class Login extends Component {
  constructor(props) {
    super(props); //reference to the parent constructor

    this.userNameInputRef = React.createRef();
    this.signInInputRef = React.createRef();

    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showPopUp = this.showPopUp.bind(this);
    this.onChangeForgotPasswordUserName =
      this.onChangeForgotPasswordUserName.bind(this);
    this.onChangeRememberMe = this.onChangeRememberMe.bind(this);

    //Component State
    this.state = {
      loading: false,
      spinnerMessage: "",
      username: "",
      password: "",
      rememberMe: false,
      formErrors: {},
      forgotPasswordUsername: "",
      forgotPasswordErrors: {},
      showModal: false,
      modalLoading: false,
      passWordType: "password"
    };

    this.initialState = this.state;
  }

  //#region component mount
  componentDidMount() {
    sessionStorage.setItem("username", "");

    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const username = rememberMe ? localStorage.getItem("user") : "";
    const password = rememberMe ? localStorage.getItem("password") : "";

    this.setState({ username, password, rememberMe }, () => {
      if (this.state.username) {
        this.signInInputRef.current.focus();
      } else {
        this.userNameInputRef.current.focus();
      }
    });

    // this.userNameInputRef.current.focus();
    // this.signInInputRef.current.focus();
  }
  //#endregion

  //#region Get User Name Value
  onChangeUserName(e) {
    this.setState({
      username: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      const formErrors = { ...this.state.formErrors, userNameError: "" };
      this.setState({ formErrors: formErrors });
    }
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

  // #region Paswword Show and Hide Function
  showHidePassWord = (type) => {
    this.setState({passWordType: type})
  }
  // #endregion Paswword Show and Hide Function

  //#region Get Remember me Value
  onChangeRememberMe(e) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }
  //#endregion

  //#region Validating the input data
  handleFormValidation() {
    const userName = this.state.username.trim();
    const password = this.state.password.trim();
    let formErrors = {};
    let isValidForm = true;

    //User Name
    if (!userName) {
      isValidForm = false;
      formErrors["userNameError"] = "User Name is required";
    } else if (userName.length < 3) {
      isValidForm = false;
      formErrors["userNameError"] = "Invalid Username";
    }

    //Password
    if (!password) {
      isValidForm = false;
      formErrors["passwordError"] = "Password is required";
    } else if (password.length < 6) {
      isValidForm = false;
      formErrors["passwordError"] = "Invalid Password";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region Alert User about password expiry
  alertPasswordExpiry(userName) {
    loginService
      .alertPasswordExpiry(userName)
      .then(() => {})
      .catch((e) => {
        toast.warning(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region User Login
  userLogin = () => {
    if (this.handleFormValidation()) {
      this.setState({
        spinnerMessage: "Please wait while signing in...",
        loading: true,
      });

      //Bind state data to object
      var data = {
        UserName: this.state.username.trim(),
        Password: this.state.password,
      };

      const { username, rememberMe, password } = this.state;

      //Service call
      loginService
        .UserLogin(data)
        .then(() => {
          localStorage.setItem("rememberMe", rememberMe);
          localStorage.setItem("user", rememberMe ? username : "");
          localStorage.setItem("password", rememberMe ? password : "");

          sessionStorage.setItem("username", data.UserName);

          this.alertPasswordExpiry(data.UserName);

          this.setState({
            loading: false,
          });

          this.props.history.push({
            pathname: "/Dashboard",
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

  //#region Call UserLogin on Enter button click
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.userLogin();
    }
  };
  //#endregion

  //#region modal functions
  //#region show popup
  showPopUp() {
    this.setState({ showModal: true, forgotPasswordUsername: "" });
  }
  //#endregion

  //#region Get Forgot Password User Name Value
  onChangeForgotPasswordUserName(e) {
    this.setState({
      forgotPasswordUsername: e.target.value,
    });

    if (e.target.value !== "" && e.target.value !== null) {
      this.setState({ forgotPasswordErrors: {} });
    }
  }
  //#endregion

  //#region Validating the modal pop up data
  handleModalPopupValidation() {
    const userName = this.state.forgotPasswordUsername.trim();
    let formErrors = {};
    let isValidForm = true;

    //User Name
    if (!userName) {
      isValidForm = false;
      formErrors["forgotPasswordUsernameError"] = "User Name is required";
    } else if (userName.length < 3) {
      isValidForm = false;
      formErrors["forgotPasswordUsernameError"] = "Invalid Username";
    }

    this.setState({ forgotPasswordErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region Save Password to Email
  sendEmail = () => {
    if (this.handleModalPopupValidation()) {
      this.setState({
        spinnerMessage: "Please wait while sending email...",
        modalLoading: true,
      });

      loginService
        .resetPassword(this.state.forgotPasswordUsername)
        .then(() => {
          this.handleCancel();
          toast.success(
            "Password reset link has been sent successfully to your email id"
          );
          this.setState({
            modalLoading: false,
          });
        })
        .catch((e) => {
          toast.error(e.response.data.Message, { autoClose: false });
          this.setState({ showModal: false, modalLoading: false });
        });
    }
  };
  //#endregion

  //#region handle Cancel
  handleCancel() {
    this.setState({
      showModal: false,
      forgotPasswordUsername: "",
      forgotPasswordErrors: {},
    });
  }
  //#endregion
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
          <div className="az-signin-wrapper">
            <div className="az-card-signin">
              <h1 className="az-logo">GOP</h1>
              <div className="az-signin-header">
                <h2>Welcome back!</h2>
                <h4>Please sign in to continue</h4>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength="50"
                    id="username"
                    name="username"
                    tabIndex="1"
                    placeholder="Enter your Username"
                    value={this.state.username}
                    onChange={this.onChangeUserName}
                    onKeyPress={this.handleKeyPress}
                    //autoFocus={!this.state.username}
                    ref={this.userNameInputRef}
                  />
                  <div className="error-message">
                    {this.state.formErrors["userNameError"]}
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input">
                  <input
                    type={this.state.passWordType}
                    className="form-control"
                    maxLength="50"
                    id="password"
                    name="password"
                    tabIndex="2"
                    placeholder="Enter your Password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    onKeyPress={this.handleKeyPress}
                  />
                  {this.state.passWordType === "password" ?
                  <div><i className="fa fa-eye showHidePassword" onClick={() => this.showHidePassWord("text")} /></div>
                  :
                  <div><i className="fa fa-eye-slash showHidePassword" onClick={() => this.showHidePassWord("password")} /></div>
        }
                  </div>
                  <div className="error-message">
                    {this.state.formErrors["passwordError"]}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-1">
                    <input
                      name="rememberMe"
                      checked={this.state.rememberMe}
                      onChange={this.onChangeRememberMe}
                      value={this.state.rememberMe}
                      type="checkbox"
                      id="rememberMe"
                    />
                  </div>
                  <div className="col-md-10">
                    <label htmlFor="rememberMe">
                      Remember me on this computer
                    </label>
                  </div>
                </div>
                <button
                  className="btn btn-az-primary btn-block"
                  tabIndex="3"
                  onClick={this.userLogin}
                  autoFocus={this.state.username}
                  ref={this.signInInputRef}
                >
                  Sign In
                </button>
              </div>
              <Modal
                show={this.state.showModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={this.handleCancel}
                enforceFocus={false}
                className="forgot-passowrd-modal"
              >
                <LoadingOverlay
          active={this.state.modalLoading}
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
                  <Modal.Header>
                    <Modal.Title>Forgot Password</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="row row-sm">
                      <div className="col-md-3">
                        <label>
                          <b>Username </b>{" "}
                          <span className="text-danger asterisk-size">*</span>
                        </label>
                      </div>
                      <div className="col-md-9">
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          id="username"
                          name="username"
                          tabIndex="1"
                          placeholder="Enter your Username"
                          value={this.state.forgotPasswordUsername}
                          onChange={this.onChangeForgotPasswordUserName}
                        />
                      </div>
                      <div className="error-message mg-l-120">
                        {
                          this.state.forgotPasswordErrors[
                            "forgotPasswordUsernameError"
                          ]
                        }
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="btn btn-az-primary"
                      onClick={this.sendEmail}
                    >
                      Send Email
                    </Button>
                    <Button variant="secondary" onClick={this.handleCancel}>
                      Cancel
                    </Button>
                  </Modal.Footer>
                </LoadingOverlay>
              </Modal>
              <div className="az-signin-footer">
                <p>
                  <Link to="/#" variant="primary" onClick={this.showPopUp}>
                    Forgot password?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Login;
