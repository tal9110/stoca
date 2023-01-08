import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import AudioController from "./AudioController";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
