# ie8-cli

> IE8 CLI is a Tooling for project Development With IE8 Compability.

It is 2019. The users using IE8 is not that much now. Developling this tool seems not a smart move. But, I need to support ie8 (at work). I need a tool to maintain what I have figured out during development. So, this is the reason why it comes out.

IE8 will be completely abandoned someday. And this tool will be totally useless at that time. But, I hope it helps before that time.

This tool is for creating projects with ie8 compability by using preset boilerplates. It integrates several tools:

- [sanjs](https://github.com/baidu/san) (a framework kindof like vue)
- [anujs](https://github.com/RubyLouvre/anu) (A mini React-like framework that is extremely compatible with React16)
- typescript
- webpack4

I spent a lot of time figuring out how to use latest webpack tools in ie8 development. With this tool, you can develop with webpack 4.x, which means that **all proposals is usable only if you set up corresponding babel plugins**.

note: there still are some several unsupport features:
- `getter` / `setter`: the `defineProperty` is wierd in ie8. Please keep in mind that in ie8 `defineProperty` can only be used with dom instances during development.

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

all options of command `create` (which can be accessed by `ie8 create -h`):

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

The alternatives of option `type` are as below:

| value | description |
| -- | -- |
| es | using es6 (default setting) |
| san | using san (https://github.com/baidu/san) |
| anujs | using anujs (https://github.com/RubyLouvre/anu) |

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

You can choose needed extesions when you create a project. Preset `default` contains all of them as below:

- typescript
- san-store (only show when you choose `type` san)
- tslint
- eslint
- less
- polyfills（ie8, fetch-ie8, fetch-jsonp-polyfill, dom4, console-polyfill）

You can choose `Munually select features` if you want to customize by your own.

### Update/Upgrade ie8-cli:

```bash
ie8 update
```

## Development

```bash
node bin/ie8
```

## Requirement

- node >= 8.9
