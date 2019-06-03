#### 目录及约定

在文件和目录的组织上，使用约定的方式。

一个应用的目录结构如下：

```js
 ├─build 					 // 输出路径
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
 ├──modules.d.ts             // TypeScript模块声明
 ├──package.json			 // 项目信息，脚本指令，依赖信息
 ├──README.md                // 使用说明
 ├──tsconfig.json            // TypeScript编译设置
 └──tslint.json              // tslint代码规范选项
```





#### 开始

##### 环境准备

1.nodejs安装

[node](<https://nodejs.org/en/>)，在官网直接下载LTS版本双击安装，安装完毕后打开cmd，执行查看npm版本命令，能输出npm版本号即可

```bash
npm -v 
# 查看npm版本
```



2.npm镜像

由于网络问题，国内建议使用[淘宝NPM镜像](<https://npm.taobao.org/>)，以管理员权限打开cmd执行安装cnpm命令，安装完成后，可以查看cnpm版本即安装完成

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 安装cnpm

cnpm -v
# 查看cnpm版本
```



3.编辑器

建议使用vscode



##### 通过手脚架创建项目

未开发，从svn或已有的项目中获取前端框架



##### 使用

1.安装依赖

在项目路径下打开cmd或使用vscode打开项目后启动终端，执行依赖安装命令

```bash
cnpm i
# 安装所需的依赖
```



2.项目配置

根据项目需要，编辑config/index.js中的配置，第一次打包template.enable需为true。

注：若SP.enable为true，需要设置SharePoint登录信息，请看SharePoint调试章节。



3.运行

依次执行以下的命令，执行完命令后会自动打开浏览器，在打开的页面中选择打开html下的页面即可看到示例页面

```bash
cnpm run dll	# 打包通用dll
cnpm run watch	# 进行本地调试
```



4.部署

执行正式环境打包命令，将build文件夹的内容复制到服务器。

```bash
cnpm run prod # 正式环境打包
```



#### 指令说明  

##### 依赖安装指令

cnpm i

> 安装所有package.json中设置的依赖



cnpm i -D name

> 安装在开发环境，对于类型声明文件、webpack插件等不需要在正式环境中使用的第三方库使用指令



cnpm i -S name

> 安装在正式环境,在业务代码里进行使用的第三方库使用指令



##### 打包指令

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




##### 其他指令
cnpm run lint
    代码规范检查



#### 打包处理

##### 单页/多页应用

###### 单页应用

入口：src/index.tsx

子页面：src/pages/...



###### 多页应用

多页应用pages下每一个文件夹都是一个应用

入口：src/pages/xx/index.tsx

模板：

```js
// 多页应用下可以通过创建pageinfo.js，对生成的的html模板进行一些设置
// html模板设置，pageinfo.js内容
module.exports = {
    // 额外引入的js
    scripts: [],
    // 额外引入的css
    css: [],
    // title
    title: ""
}
```





##### CSS

1.可以支持类似Sass的语法，需要被import才可解析,注意模块化，互相影响

vscode提示错误可以在编辑器设置中增加以下内容
```json
 "files.associations": {
        "*.css": "scss"
    }
```



##### 图片、图标处理

可以打包字体图标和图片
图片：10k以下会转换成base64





#### 工具使用

##### 消息提示

###### Loading

```js
Loading.show();
Loading.hide();
Loading.hideAll();
```



###### Dialog

```js

```





###### Message

```js

```





##### 多语言

```js

```







##### 日志

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







#### SharePoint本地调试

1、将config/index.js中SP.enable设为true
2、config下的private.json中输入下列信息，如果没有private.json文件，可以手动创建

```js
{
  "siteUrl": "",
  "strategy": "", //SP Online为 UserCredentials,本地为 OnpremiseUserCredentials
  "username": "",
  "domain": "", 
  "password: ""
}
```

