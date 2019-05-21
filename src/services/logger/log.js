import Lajax from "./lajax";



function defaultLog(...args) {
  console.log("请先进行Log初始化");
  console.log(args);
}

const methods = ["info","error","warn"];

const LOG = {
  info: defaultLog,
  error: defaultLog,
  warn: defaultLog
};

/**
 * JSOM: JSOM.create("site","list")
 * 
 * getFolderPath: () => "path"
 * 
 * url: 服务器接口url;
 * 
 * autoLogError: 是否自动记录未捕获错误;
 * 
 * autoLogRejection 是否自动记录预备;
 * 
 * autoLogAjax: 是否自动记录ajax;
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
 * @param {{JSOM?: any,getFolderPath?: any,url?: string,autoLogError?: boolean,autoLogRejection?: boolean,autoLogAjax?: boolean,logAjaxFilter?: any,stylize?: any,showDesc?: any,customDesc?: any,interval?: number,maxErrorReq?: number}} param
 */
export const setting = function(param = undefined) {
  LOG = new Lajax(param);
  methods.forEach((method) => {
    logger[method] = LOG[method].bind(LOG);
  });
};

export let logger = {
  info: LOG.info,
  error: LOG.error,
  warn: LOG.warn,
  setting
};
