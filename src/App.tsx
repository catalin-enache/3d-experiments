import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense } from "react";

import { routesConfig } from "@src/constants/routesConfig";

import classes from "./App.module.css";
import { ExperimentsMenu } from "@components";

function App() {
  return (
    <HashRouter>
      <div className={classes.app}>
        <ExperimentsMenu />
        <Suspense fallback={<div className={classes.loading}>Loading...</div>}>
          <Routes>
            {(Object.keys(routesConfig) as (keyof typeof routesConfig)[]).map(
              (page) => {
                const Component = routesConfig[page].component;
                return (
                  <Route
                    key={routesConfig[page].path}
                    path={routesConfig[page].path}
                    element={<Component />}
                  />
                );
              }
            )}
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
}

export default App;
