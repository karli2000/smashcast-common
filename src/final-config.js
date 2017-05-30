
const extend = require('deep-extend');
const fs = require('fs');
const path = require('path');
const defaultConfig = require('./default-config');

const customConfigPath = path.join(defaultConfig.path, 'tasks.config.js');
let finalConfig = defaultConfig;

if (fs.existsSync(customConfigPath)) {
    const customConfig = require(customConfigPath); // eslint-disable-line import/no-dynamic-require, global-require
    finalConfig = extend(defaultConfig, customConfig);
}

module.exports = finalConfig;
