import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import MarketingMenu from "./MarketingMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class Marketing extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/Marketing" exact>
            <MarketingMenu />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default Marketing;
