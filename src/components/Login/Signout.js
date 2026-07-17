import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

class Signout extends Component {
  //#region component mount
  componentDidMount() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("sortField");
    sessionStorage.removeItem("sortOrder");
    sessionStorage.removeItem("activeMroDictionaryTab");
  }
  //#endregion

  render() {
    return (
      <div>
        <div className="az-content pd-y-20 pd-lg-y-30 pd-xl-y-40">
          <div className="container">
            <div className="az-content-body pd-lg-l-40 d-flex flex-column">
              <Card border="secondary" className="text-center">
                <Card.Header className="card bg-secondary text-white">
                  <Card.Title className="text-white">Sign Out</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    You have signed out successfully. Thank you for using GOP
                    Application. Click below to Sign In again
                  </Card.Text>
                  <Link to="/#" className="btn btn-primary">
                    Sign In
                  </Link>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signout;
