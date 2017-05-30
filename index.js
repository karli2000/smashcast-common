require('babel-register')({
    ignore: /node_modules\/(?!smashcast\-common)/,
});

const tasks = require('./src/default-gulp-tasks');

module.exports.setDefaultTasks = tasks.default;
