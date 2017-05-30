const gulp = require('gulp');
const path = require('path');

module.exports = config => gulp.watch([path.join(config.srcFolder, '**', config.app.testPattern)], ['test:unit']);
