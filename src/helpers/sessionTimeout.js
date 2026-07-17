import React, { Component } from "react";
import IdleTimer from "react-idle-timer";
import { Button, Modal } from "react-bootstrap";
import helpers from "./helpers";

let countdownInterval;
let timeout;

class SessionTimeout extends Component {
  constructor(props) {
    super(props);

    this.idleTimer = React.createRef();

    //Component State
    this.state = {
      timeoutModalOpen: false,
      timeoutCountdown: 0,
      isAuthenticated: false,
    };
  }

  //#region Component did Mount
  componentDidMount() {
    const user = helpers.getUser();

    const isAuthenticated = user ? true : false;
    this.setState({ isAuthenticated: isAuthenticated });
  }
  //#endregion

  clearSessionTimeout = () => {
    clearTimeout(timeout);
  };

  clearSessionInterval = () => {
    clearInterval(countdownInterval);
  };

  handleLogout = async (isTimedOut = false) => {
    try {
      this.setState({ timeoutModalOpen: false });
      this.clearSessionInterval();
      this.clearSessionTimeout();
      this.logOut();
    } catch (err) {
      console.error(err);
    }
  };

  logOut = () => {
    this.props.history.push({
      pathname: "/signout",
    });
  };

  handleContinue = () => {
    this.setState({ timeoutModalOpen: false });
    this.clearSessionInterval();
    this.clearSessionTimeout();
  };

  onActive = () => {
    if (!this.state.timeoutModalOpen) {
      this.clearSessionInterval();
      this.clearSessionTimeout();
    }
  };

  onIdle = () => {
    const delay = 1000 * 1;
    if (this.state.isAuthenticated && !this.state.timeoutModalOpen) {
      timeout = setTimeout(() => {
        let countDown = 20;
        this.setState({ timeoutModalOpen: true, timeoutCountdown: countDown });
        countdownInterval = setInterval(() => {
          if (countDown > 0) {
            this.setState({ timeoutCountdown: --countDown });
          } else {
            this.handleLogout(true);
          }
        }, 1000);
      }, delay);
    }
  };

  render() {
    let timeoutCountdown = this.state.timeoutCountdown;
    let timeoutModalOpen = this.state.timeoutModalOpen;

    return (
      <>
        <IdleTimer
          ref={this.idleTimer}
          onActive={this.onActive}
          onIdle={this.onIdle}
          debounce={250}
          timeout={2000000}
        />
        <Modal
          className="session-timeout-modal"
          show={timeoutModalOpen}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title>Session Timeout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The current session is about to expire in{" "}
            <span>{timeoutCountdown}</span> seconds. Would you like to continue
            the session?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-gray-700"
              onClick={() => this.handleLogout(false)}
            >
              Sign Out
            </Button>
            <Button
              className="btn btn-az-primary"
              onClick={this.handleContinue}
            >
              Continue Session
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default SessionTimeout;
