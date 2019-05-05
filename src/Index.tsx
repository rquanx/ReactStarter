import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Language from "@services/translation";

Language.inital();
ReactDOM.render(
    <App></App>,
    document.getElementById("app")
);