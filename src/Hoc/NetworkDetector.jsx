import React, { Component } from "react";
import helpers from "../helpers/helpers";
//import { Button, Modal } from "react-bootstrap";

export default function foo(ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false,
      //displayCloseTab: false,
    };

    componentDidMount() {
      this.handleConnectionChange();
      window.addEventListener("online", this.handleConnectionChange);
      //window.addEventListener("beforeunload", this.onUnload);
    }

    componentWillUnmount() {
      window.removeEventListener("online", this.handleConnectionChange);
      //window.removeEventListener("beforeunload", this.onUnload);
    }

    onUnload = (e) => {
      // the method that will be used for both add and remove event
      e.preventDefault();

      // let pageReloaded = window.performance
      //   .getEntriesByType("navigation")
      //   .map((nav) => nav.type)
      //   .includes("reload");

      if (helpers.getUser()) {
        this.setState({
          displayCloseTab: true,
        });
        e.returnValue = "";
      }
    };

    handleConnectionChange = () => {
      setInterval(() => {
        fetch("//google.com", {
          mode: "no-cors",
        })
          .then(() => {
            this.setState({ isDisconnected: false });
          })
          .catch(() => this.setState({ isDisconnected: true }));
      }, 2000);
    };

    render() {
      const { isDisconnected } = this.state;
      return (
        <div>
          {isDisconnected && (
            <div className="internet-error">
              <p>Internet connection lost</p>
            </div>
          )}
          <ComposedComponent {...this.props} />
          {/* <Modal
            show={this.state.displayCloseTab}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={this.handleNo}
            backdrop="static"
            enforceFocus={false}
          >
            <Modal.Header>
              <Modal.Title>Sign-out GOP?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>
                  You have not signed out of GOP, Would you like to Sign-Out?
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.SignOut}>
                Sign-Out
              </Button>
              <Button variant="primary" onClick={this.handleCancel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal> */}
        </div>
      );
    }
  }

  return NetworkDetector;
}
