import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Language from "@services/translation";
import Loading from "@components/Loading";
import Notification from "@components/Notification";
import { logger } from "@services/logger";
import JSOM from "@services/jsom";
// 入口、初始化
Language.inital();

// 对话框初始化
Notification.Config({
  beforeShow: Loading.hideAll
});

JSOM.Config({
  before: Loading.show,
  after: Loading.hide
})

logger.setting({
  JSOM: JSOM.create("", "AppConfig"),
  interval: 10000,
  autoLogAjax: false, // 禁止自动log ajax
  logAjaxFilter: (ajaxUrl, ajaxMethod) =>
    !(
      ajaxUrl.includes("sockjs-node") ||  // 过滤本地服务器请求
      ajaxUrl.includes("_api/contextinfo") || // 过滤JSOM context请求
      ajaxUrl.includes("ProcessQuery") ||        // 过滤JSOM query请求
      ajaxUrl.includes("hot-update.json")     // 过滤热更新请求
    )
});

ReactDOM.render(<App />, document.getElementById("app"));
