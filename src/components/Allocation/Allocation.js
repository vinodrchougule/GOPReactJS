import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import AllocationDetails from "./allocationDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GOPEditScreen from "./GOPEditScreen";
import ProjectSetting from "../ProjectSetting/ProjectSetting";
import ProductionUpdateList from "./ProductionUpdateList";
import SessionTimeout from "../../helpers/sessionTimeout";
import GOPQCEditScreen from "./GOPQCEditScreen";
import GOPProdItemEditWithQCRef from "./GOPProdItemEditWithQCRef";
toast.configure();

class Allocation extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/Allocation" exact>
            <AllocationDetails {...this.props} />
          </Route>
          <Route
            path="/Allocation/GOPEditScreen"
            exact
            render={(props) => (
              <div style={{ height: "100%" }}>
                {/* <Header data={props} /> */}
                <GOPEditScreen {...props} />
                <SessionTimeout {...props} />
              </div>
            )}
          >
            {/* <GOPEditScreen /> */}
          </Route>
          <Route
            path="/Allocation/GOPQCEditScreen"
            exact
            render={(props) => (
              <div style={{ height: "100%" }}>
                <GOPQCEditScreen {...props} />
                <SessionTimeout {...props} />
              </div>
            )}
          ></Route>
          <Route
            path="/Allocation/GOPProdItemEditWithQCRef"
            exact
            render={(props) => (
              <div style={{ height: "100%" }}>
                <GOPProdItemEditWithQCRef {...props} />
                <SessionTimeout {...props} />
              </div>
            )}
          ></Route>
          <Route path="/Allocation/projectSettings" exact>
            <ProjectSetting />
          </Route>
          <Route path="/Allocation/screenProjectSettings" exact>
            <ProjectSetting />
          </Route>
          <Route path="/Allocation/editProjectSettings" exact>
            <ProjectSetting />
          </Route>
          <Route path="/Allocation/viewProjectSettings" exact>
            <ProjectSetting />
          </Route>
          <Route
            path="/Allocation/ProductionUpdateList"
            component={ProductionUpdateList}
          ></Route>
        </Switch>
      </Router>
    );
  }
}

export default Allocation;
