#### 日志



##### 功能

1、异常捕获

> 自动记录所有未捕获的异常



2、定时发送

> 默认每隔10S进行一次上传



3、日志离线存储

> 日志记录在localStorage中，发送成功后会清除已发送的
>
> 关闭页面时如果有未发送的日志会存储在localStorage，等待下次进行发送



##### 使用

```js
import { Logger } from "./logger";
// Logger为全局单例，在入口进行一次setting即可
Logger.Setting({                     
  JSOM: JSOM.create("", "日志列表名"), // 设置通过SharePoint日志存储的列表
  getFolderPath: () => "", 			 // JSOM创建item时所在的文件夹路径
    								// 注：如果文件夹不存会报错，不会自动创建
    
  url: "",			  // 服务器接口地址，url与JSOM只有一个有效
  autoLogAjax: false, // 禁止自动记录ajax的发送
    
  logAjaxFilter: (ajaxUrl: string, ajaxMethod) => {
  // ajax过滤函数，返回false的不进行log，启用autoLogAjax生效
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
Logger.Info();
Logger.Warn();
Logger.Error();

// 发送格式
// 前端以Post发送日志数组
logQueue = [{
    time: "时间",
    level: "info/warn/error",
    message: "记录的信息",
    url: "浏览器当前url"，
    agent: "浏览器信息"
},...]
```



##### 配置项

```js
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
 */
```





##### JSOM

需新建日志列表，列表字段：Time、Level、Agent、Message 都是文本类型，其中Message为多行文本



##### 注意事项

1、本地连接调试时建议禁用，防止上传了调试中产生的错误日志

2、SharePoint路径文件夹需要提前创建