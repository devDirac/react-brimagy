/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import configureStore from "./store";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";

// Material Dashboard 2 PRO React TS Context Provider
import { MaterialUIControllerProvider } from "context";

const store = configureStore;

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <Provider store={store}>
        <PrimeReactProvider value={{ appendTo: "self", cssTransition: false }}>
          <App />
        </PrimeReactProvider>
      </Provider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
