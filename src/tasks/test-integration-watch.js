const gulp = require('gulp');
const path = require('path');

function getFoldersToWatch(config) {
    return [
        path.join(config.srcFolder, '**', '*'),
        path.join(config.testsFolder, '**', '*'),
    ];
}

module.exports = config => gulp.watch(getFoldersToWatch(config), ['test:integration']);
