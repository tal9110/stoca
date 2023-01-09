import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import AudioController from "./AudioController";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colorScheme: "dark",
        colors: {
          // override dark colors to change them for all components
          dark: [
            "#d5d7e0",
            "#acaebf",
            "#8c8fa3",
            "#666980",
            "#4d4f66",
            "#34354a",
            "#2b2c3d",
            "#transparent",
            "#transparent",
            "#transparent",
          ],
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
