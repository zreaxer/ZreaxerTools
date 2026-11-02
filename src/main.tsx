
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import PWAInstallButton from "./components/PWAInstallButton";
import OfflineStatus from "./components/OfflineStatus";
import SocialMeta from "./components/SocialMeta";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <PWAInstallButton />
      <OfflineStatus />
      <SocialMeta />
    </BrowserRouter>
  </React.StrictMode>
);
