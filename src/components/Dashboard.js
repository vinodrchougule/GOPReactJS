import React, { useEffect } from "react";
import { HashRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import DashboardDetails from "./Dashboard/dashboardDetails";
import ActiveResources from "./Dashboard/activeResources";
import ActiveTasks from "./Dashboard/activeTasks";
import Duration from "./Dashboard/duration";
import helper from "../helpers/helpers";
import "./dashboard.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Dashboard (props) {
  const history = useHistory();

  //#region component mount
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
    }
  }, [history]);
  //#endregion

  return (
    <div style={{ height: "93%" }}>
      <Router>
        <Switch>
          <Route path="/Dashboard" exact>
            <DashboardDetails {...props} />
          </Route>
          <Route path="/Dashboard/Duration" component={Duration} />
          <Route path="/Dashboard/ActiveResources" component={ActiveResources} />
          <Route path="/Dashboard/ActiveTasks" component={ActiveTasks} />
        </Switch>
      </Router>
    </div>
  );
};
export default Dashboard;