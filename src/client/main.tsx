import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { UploadProvider } from "./context/upload.context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UploadProvider>
      <App />
    </UploadProvider>
  </React.StrictMode>,
);
