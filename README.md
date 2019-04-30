以下所有cnpm均可替换成npm,国内使用npm速度较慢，建议安装cnpm且使用cnpm

#### 开始
1、安装所有依赖
cnpm i

2、打包
    见打包指令

3、部署


#### 打包指令  
cnpm run build
    开发打包不进行代码压缩

cnpm run buildPro
    生产环境打包，进行代码压缩

cnpm run watch
    开发打包，打开本地服务器预览且监控代码修改，代码修改保存后自动打包刷新浏览器
    运行指令后等待打包完成，在浏览器中选择html打开页面

#### 其他指令
cnpm run lint
    代码规范检查



#### npm/cnpm使用 
##### 安装在开发环境
对于类型声明文件、webpack插件等不需要在正式环境中使用的第三方库使用指令：cnpm i -D name

##### 安装在正式环境
在业务代码里进行使用的第三方库使用指令：cnpm i -S name

#### 目录结构
```js
 ├──config     // 打包配置
 ├──script     // 打包脚本
 ├──src
 │  ├── asset // 公共静态资源
 │  │       ├── css
 │  │       ├── imgs
 │  │       └── font
 │  ├── components  // 公共组件/公共组件库，按功能划分
 │  ├── config      // 项目配置文件
 │  ├── html        // 页面模板
 │  ├── i18n        // 语言包
 │  ├── pages       // 所有的页面容器组件
 │  │       └── Todo
 │  │             ├── index.ts // 主容器，页面入口
 │  │             └── Filter.tsx // 非通用，自身页面使用的组件
 │  └──services // 其他功能库
 ├──package.json // 项目信息，脚本指令，依赖信息
 ├──README.md   // 简单的说明
 ├──tsconfig.json // TypeScript编译设置
 ├──tslint.json     // 代码规范选项
 └──webpack.config.js   // webpack打包配置文件
 ```
