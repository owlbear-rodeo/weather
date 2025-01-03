import React from "react";
import ReactDOM from "react-dom/client";

import { Menu } from "./Menu";
import { PluginGate } from "./util/PluginGate";
import { PluginThemeProvider } from "./util/PluginThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "./GlobalStyles";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <CssBaseline />
        <GlobalStyles />
        <Menu />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>
);
