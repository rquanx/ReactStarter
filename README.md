以下所有cnpm均可替换成npm,国内使用npm速度较慢，建议安装cnpm且使用cnpm


#### 开始
1、安装所有依赖
cnpm i

2、打包
    见打包指令

3、部署


#### 打包指令  
cnpm run buildDll
    进行Dll打包，当打包配置中的dll有变化时需重新打包

cnpm run build
    开发打包不进行代码压缩,开发打包会引用dll
        打包配置中的template.enable为false关闭可提高打包速度

cnpm run buildPro
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
{
  "siteUrl": "",
  "strategy": "",
  "username": "",
  "domain": "", 
  "password: ""
}

删除private.json，代理会通过cmd要求输入对应的信息，并且生成private.json保存

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
 │   │     ├── index.ts      // 多页应用时的页面入口，单页应用时为页面组件
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