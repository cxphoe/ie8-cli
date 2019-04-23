# <%= info.name %>

> <%= info.description %>

## requirement

- node >= 8.9

## Build Setup

```bash
# install dependencies
npm install

# server with hot reload at localhost:8000
npm run dev
open http://localhost:8000/home.html

# server with hot reload at localhost:8000 with ie8 compatibility
npm run dev:ie8
open http://localhost:8000/home.html

# build for production with minification
# 项目打包结果会放在 [项目目录]/build
npm run build

# 可通过设置 build-path 参数改变打包的地址，支持相对(相对于项目目录)/绝对地址
npm run build --build-path=dist             # [项目地址]/dist
npm run build --build-path=D:\code\build    # D:\code\build
```

## development

默认是多页面开发的模式。在 `view` 文件夹下的每个文件夹中的

- `index.pug` 都会被当做页面入口进行编译；
- `index.ts/index.js` 则会被作为入口文件进行编译。
