import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";

/**
 * All routes for the application
 * @param {Object} props - props for app
 */
const Routes = (props) => {
  return (
    <Router {...props}>
      <div>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default Routes;
