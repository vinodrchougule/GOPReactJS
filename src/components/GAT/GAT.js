import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// Consolidating the import for the component from gatTabs.js
import GATNavigation from "./gatTabs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

// class GAT extends Component {
//   // render() {
//   //   return (
//   //     <Router>
//   //       <Switch>
//   //         <Route path="/GAT" exact>
//   //           {/* The GATMegaMenu component contains the single 'GAT' dropdown and tool content */}
//   //           <GATNavigation />
//   //         </Route>
//   //       </Switch>
//   //     </Router>
//   //   );
//   // }
// }

// export default GAT;
