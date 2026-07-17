import React, { useState, useEffect } from "react";
import ProjectList from "./Project/ProjectList";
import CreateProject from "./Project/CreateProject";
import EditProject from "./Project/EditProject";
import ProjectBatchList from "./ProjectBatch/ProjectBatchList";
import CreateProjectBatch from "./ProjectBatch/CreateProjectBatch";
import ViewProjectBatch from "./ProjectBatch/ViewProjectBatch";
import EditProjectBatch from "./ProjectBatch/EditProjectBatch";
import CompletedProjectList from "./Project/DeliveredProjectList";
import PostProjectBatchDetails from "./PostProjectDetails/postProjectBatchDetails";
import { HashRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import DeliveredProjectBatchList from "./ProjectBatch/DeliveredProjectBatchList";
import accessControlService from "../services/accessControl.service";
import helper from "../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewProject from "./Project/ViewProject"

toast.configure();

function Projects (props) {

  //#region State management using useState hook
  const [projectPageAccess, setProjectPageAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  const history = useHistory();
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    fetchUserRoleAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  //#endregion

  //#region Fetch User Role Access
  const fetchUserRoleAccess = () => {
    setLoading(true);
    setSpinnerMessage("");

    accessControlService
      .ReadUserMenuAccessList(helper.getUser(), "Projects")
      .then((response) => {
        const projectPageAccess = response.data.find(
          (a) => a.PageName === "Project List"
        );

        setProjectPageAccess(projectPageAccess?.canAccess || false);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response?.data?.Message, { autoClose: false });
      });
  };
  //#endregion

  //#region Return
  return (
    <Router>
      <Switch>
      {loading && (
          <div className="loading-spinner">
            <p>{spinnerMessage}</p>
          </div>
        )}
        {projectPageAccess && (
          <Route path="/Projects" exact>
            <ProjectList {...props} />
          </Route>
        )}
        <Route path="/Projects/CreateProject" component={CreateProject}></Route>
        <Route path="/Projects/EditProject" component={EditProject}></Route>
        <Route path="/Projects/ViewProject">
          <ViewProject {...props} />
        </Route>
        <Route path="/Projects/ProjectBatchList">
          <ProjectBatchList {...props} />
        </Route>
        <Route path="/Projects/CreateProjectBatch">
          <CreateProjectBatch {...props} />
        </Route>
        <Route path="/Projects/ViewProjectBatch">
          <ViewProjectBatch {...props} />
        </Route>
        <Route path="/Projects/EditProjectBatch">
          <EditProjectBatch {...props} />
        </Route>
        <Route path="/Projects/Completed" component={CompletedProjectList}></Route>
        <Route path="/Projects/DeliveredProjectBatch" component={DeliveredProjectBatchList}></Route>
        <Route path="/Projects/PostProjectBatchDetails" component={PostProjectBatchDetails}></Route>
      </Switch>
    </Router>
  );
  //#endregion
};

export default Projects;
