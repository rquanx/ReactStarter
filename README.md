以下所有cnpm均可替换成npm,国内使用npm速度较慢，建议安装cnpm且使用cnpm或者将npm的源指向淘宝源


#### 开始
1、安装所有依赖
cnpm i

2、打包
    见打包指令

3、部署


#### 打包指令  
cnpm run dll
    进行Dll打包，当打包配置中的dll有变化时需重新打包

cnpm run dev
    开发打包不进行代码压缩,开发打包会引用dll
        打包配置中的template.enable为false关闭可提高打包速度

cnpm run prod
    生产环境打包，进行代码压缩,不会使用dll

cnpm run watch
    开发打包，打开本地服务器预览且监控代码修改，代码修改保存后自动打包刷新浏览器
    运行指令后等待打包完成，在浏览器中选择html打开页面


#### 其他指令
cnpm run lint
    代码规范检查


#### SharePoint本地开发
1、将config/index.js中SP.enable设为true
2、config下的private.json中输入下列信息
```json
{
  "siteUrl": "",
  "strategy": "",
  "username": "",
  "domain": "", 
  "password: ""
}
```

SharePoint Online的strategy为 UserCredentials
本地的使用 OnpremiseUserCredentials

#### CSS编写
可以支持类似Sass的语法，需要被import才可解析,注意模块化，互相影响

vscode提示错误可以在编辑器设置中增加以下内容
```json
 "files.associations": {
        "*.css": "scss"
    }
```

#### 图片、图标处理
可以打包字体图标和图片
图片：10k以下会转换成base64

#### 日志使用
本地连接调试时建议禁用，防止上传了调试中产生的错误日志

新建日志列表，列表字段,Time、Level、Agent、Message 全都是文本，Message为多行文本
默认每10s检查一次是否需要上传

```js
import {logger } from "@services/log";
logger.setting({                      // logger为全局单例，在入口中setting一次即可
  JSOM: JSOM.create("", "错误列表名"), // 设置通过SharePoint日志存储的列表
  getFolderPath: () => "", // 创建item时所在的文件夹路径
  autoLogAjax: false, // 禁止自动log ajax
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
logger.info();
logger.warn();
logger.error();
```

#### npm/cnpm使用 
##### 安装在开发环境
对于类型声明文件、webpack插件等不需要在正式环境中使用的第三方库使用指令：cnpm i -D name


##### 安装在正式环境
在业务代码里进行使用的第三方库使用指令：cnpm i -S name


#### 目录结构
```js
 ├─config                    // 配置
 │   ├─index.js              // 打包配置
 │   └─private.json          // SharePoint凭据信息
 ├─scripts                   // 打包脚本
 ├─src
 │   ├─assets                // 公共静态资源
 │   ├─components            // 公共组件/公共组件库
 │   ├─config                // 运行时配置文件
 │   ├─html                  // 页面模板
 │   ├─i18n                  // 语言包
 │   ├─pages
 │   │  └─Test
 │   │     ├── Index.ts      // 多页应用时的页面入口，单页应用时为页面组件
 │   │     └── pageinfo.js   // 对应页面的html模板信息，多页应用时使用
 │   ├─services              // 其他功能库
 │   ├─App.css
 │   ├─App.tsx
 │   └─Index.tsx             // 单页应用入口
 ├──package.json             // 项目信息，脚本指令，依赖信息
 ├──README.md                // 使用说明
 ├──tsconfig.json            // TypeScript编译设置
 └──tslint.json              // tslint代码规范选项
```