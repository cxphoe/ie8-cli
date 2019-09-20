# ie8-cli

[English](./README_en.md)

> IE8 CLI 是用于开发具备 ie8 兼容性项目的工具

已经 2019 了，现在使用IE8的用户并不多。开发这种工具似乎不是明智之举。但是，我需要在工作中支持ie8。因此也在这里把我的发现通过 CLI 保存好，一方面是回顾一下我的成果，另一方面也是为了方便还为 ie8 兼容挣扎的兄弟。

IE8总有一天会被彻底抛弃。这个工具在那个时候就完全没用了。但是，由于它使用了最新的工具，如 `typescript` 和 `webpack4` (这意味着当您决定不支持ie8时，由该工具生成的项目不需要做太多更改，也方便重构)，所以在此之前它会有所帮助。

这个工具通过一些预设的脚手架创建项目。它集成了以下几种工具：

- [sanjs](https://github.com/baidu/san) (百度框架))
- [anujs](https://github.com/RubyLouvre/anu) (迷你 React 框架))
- typescript
- webpack4

我花了很多时间研究如何在ie8开发中使用最新的webpack工具。使用此工具，您可以使用webpack 4进行开发。这意味着**基本所有的 proposal 只要在您设置了相应的babel插件**时就可以使用了。

**注意：这里创建的项目配置里面还是不支持某些功能的**

- `getter` / `setter`: `defineProperty` 在 ie8 中有些怪异。它只能被用在 dom 实例上。
- 不支持装饰器的语法，即便使用了 [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#readme)

## Getting Started

### install:

```bash
npm install -g ie8-cli
# OR
yarn global add ie8-cli
```

### Create a project:

```bash
ie8 create my-project
```

命令 `create` 的所有选项(可由命令 `ie8 create -h` 查看)

```
Usage: create [options] <app-name>

create a new project powered by ie8-cli

Options:
  --type <value>     Boilerplate type, default to `es`
  -d, --default      Skip prompts and use default preset
  -f, --force        Overwrite target directory if it exists
  -i, --install      Install dependencies after creating project
  --exclude <items>  Exclude files in target directory that you do not wanna cover while merging
  -h, --help         output usage information
```

选项 `type` 的替代选项如下:

| value | description |
| -- | -- |
| es | 使用 es6 (default setting) |
| san | 使用 san (https://github.com/baidu/san) |
| anujs | 使用 anujs (https://github.com/RubyLouvre/anu) |

#### other options

`--exclude`

> use it if you want to excludes some files when merging

Usage:

- seperate the filepaths with comma
- filepaths can be file names or directory path
- it only works under `merge` mode (when you create a project in an existed directory)


```bash
ie8 create my-project --exclude=package.json,config
# exludes files: my-project/package.json my-project/config/*
```

#### Extensions

创建项目时，可以选择所需的工具。预设的 `默认` 包含所有这些如下:

- typescript
- san-store (only show when you choose `type` san)
- tslint
- eslint
- less
- polyfills（ie8, fetch-ie8, fetch-jsonp-polyfill, dom4, console-polyfill）

你可以选择 `Munually select features` 自行配置以上的工具.

### 更新/升级 ie8-cli:

```bash
ie8 update
```

## Development

```bash
node bin/ie8
```

## Requirement

- node >= 8.9
