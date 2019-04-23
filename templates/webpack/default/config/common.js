const path = require('path');
const slash = require('slash');
const fs = require('fs');
const ArgParser = require('./argParser');

const resolve = (str, baseDir = __dirname) => {
  return slash(path.resolve(baseDir, str));
};

const join = (...args) => {
  return slash(path.join.apply(null, args));
};

const getRootPath = () => {
  const optionArgs = ArgParser.getOptionArgs();
  let root = optionArgs['build-path'] || path.resolve(__dirname, '../build');
  if (!path.isAbsolute(root)) {
    root = path.join(process.cwd(), root);
  }
  return root;
};

const getPublicPath = () => {
  const envArgs = ArgParser.getEnvArgs();
  const {
    PUBLIC_PATH = '/',
  } = envArgs;
  let result = slash(PUBLIC_PATH.trim());
  if (!result.endsWith('/')) {
    result += '/';
  }
  return result;
};

/** path of the packaged files */
const ROOT_PATH = getRootPath();
/** path of the packaged static files (based on ROOT_PATH) */
const STATIC_PATH = 'static';
/** path of the packaged template files (based on ROOT_PATH) */
const TEMPLATE_PATH = 'view';
/** public path of static files */
const PUBLIC_PATH = getPublicPath();

/** polyfill files */
const POLIFILL_LIST = [/*- preset.polyfills.map(str => `'${str}'`).join(', ') */];

/** find entries in /src/view */
const findEntries = () => {
  const entryDirPath = resolve('../src/view');
  const dirs = fs.readdirSync(entryDirPath);
  const result = {};
  for (const dirname of dirs) {
    result[dirname] = join(
      entryDirPath,
      dirname,
      /*
        if (preset.typescript) {
          if (type.anujs) {
      */'index.tsx'/*
          } else {
      */'index.ts'/*
          }
        } else if (type.anujs) {
      */'index.jsx'/*
        } else {
      */'index.js'/*
        }
      */
    );
  }
  return result;
};

/** get entries with polyfill files */
const getEntriesWithPolyfill = () => {
  const entrys = findEntries();
  const result = {};
  for (const entry of Object.keys(entrys)) {
    result[entry] = [
      ...POLIFILL_LIST,
      entrys[entry],
    ];
  }
  return result;
};

module.exports = {
  POLIFILL_LIST,
  PUBLIC_PATH,
  ROOT_PATH,
  STATIC_PATH,
  TEMPLATE_PATH,
  findEntries,
  getEntriesWithPolyfill,
  join,
  resolve,
};
