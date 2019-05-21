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

/**
 * 新建一个列表列表字段,Time、Level、Agent、Message 全都是文本，Message为多行文本
 */
logger.setting({                      // logger为全局单例，在入口中setting一次即可
  JSOM: JSOM.create("", "错误列表名"), // 设置通过SharePoint日志存储的列表
  getFolderPath: () => "", // 创建item时所在的文件夹路径
  autoLogAjax: false, // 禁止自动log ajax
  logAjaxFilter: (ajaxUrl: string, ajaxMethod) => {
    let filterList = [
      "sockjs-node",  // 过滤本地服务器请求
      "_api/contextinfo", // 过滤JSOM context请求
      "ProcessQuery",     // 过滤JSOM query请求
      "hot-update.json",   // 过滤热更新请求
    ];
    return filterList.every((url) => !(ajaxUrl.indexOf(url) > -1))
  }
});
// 使用
// logger.info();
// logger.warn();
// logger.error();

ReactDOM.render(<App />, document.getElementById("app"));
