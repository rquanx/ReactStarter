import Lajax from "./lajax";
const lowerMethods = ["info", "error", "warn"];
const upperMethods = ["Info", "Error", "Warn"];

function defaultLog(...args) {
  console.log("请先进行Log初始化");
  console.log(args);
}

/**
 * JSOM: JSOM操作对象，JSOM.create("site","list")
 *
 * getFolderPath: JSOM上传路径 () => "path"
 *
 * url: 服务器接口url;
 *
 * autoLogError: 是否自动记录未捕获错误;
 *
 * autoLogRejection 是否自动记录预备;
 *
 * autoLogAjax: 是否自动记录ajax;
 *
 * encode: 是否对日志信息进行encode，默认为true，上传到SP必须进行encode
 *
 * logAjaxFilter: ajax日志过滤;
 *
 * stylize: 设置输出样式;
 *
 * showDesc: 描述信息;
 *
 * customDesc: 自定义描述信息;
 *
 * interval: 日志发送周期;
 *
 * maxErrorReq: 日志发送最大试错数;
 *
 * customQueue: 对Post的数组日志进行额外处理
 * @param {{encode?: boolean,customQueue?(queue: { level, time, messages, url, agent }[]): any[],JSOM?: any,getFolderPath?: any,url?: string | function,autoLogError?: boolean,autoLogRejection?: boolean,autoLogAjax?: boolean,logAjaxFilter?: any,stylize?: any,showDesc?: any,customDesc?: any,interval?: number,maxErrorReq?: number}} param
 */
function setting(param = undefined) {
  logger = new Lajax(param);
  lowerMethods.forEach((method, i) => {
    logger[method] = logger[method].bind(logger);
    Logger[upperMethods[i]] = logger[method];
  });
}

export let logger = {
  info: defaultLog,
  error: defaultLog,
  warn: defaultLog,
  setting
};

export let Logger = {
  Info: logger.info,
  Error: logger.error,
  Warn: logger.warn,
  Setting: setting
};
