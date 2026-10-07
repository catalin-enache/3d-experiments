import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense } from "react";

import { flatRoutes } from "@src/constants/routesConfig";

import classes from "./App.module.css";
import { ExperimentsMenu } from "@components";

function App() {
  return (
    <HashRouter>
      <div className={classes.app}>
        <ExperimentsMenu />
        <Suspense fallback={<div className={classes.loading}>Loading...</div>}>
          <Routes>
            {flatRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
}

export default App;
