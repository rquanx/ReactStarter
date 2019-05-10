import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Language from "@services/translation";
import Loading from "@components/Loading";
import Notification from "@components/Notification";


// 入口、初始化
Language.inital();

// 对话框初始化
Notification.Config({
    beforeShow: Loading.hideAll
});

ReactDOM.render(
    <App></App>,
    document.getElementById("app")
);