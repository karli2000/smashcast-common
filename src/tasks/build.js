import gulp from 'gulp';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import filter from 'gulp-filter';
import ngHtml2Js from 'gulp-ng-html2js';
import concat from 'gulp-concat';

module.exports = (config, done) => {
    if (!isAHostProject(config.path)) {
        done();
        return;
    }

    const jsFilter = filter('**/*.js', { restore: true });
    const htmlFilter = filter('**/*.html', { restore: true });
    const npmPackage = require(`${config.path}/package.json`); // eslint-disable-line import/no-dynamic-require, global-require

    gulp
        .src([
            path.join(config.srcFolder, '**'),
            `!${path.join(config.srcFolder, '**', config.app.testPattern)}`,
            `${path.resolve(__dirname, '..', '..', 'tpl', '.eslintignore')}`,
        ])
        .pipe(jsFilter)
        .pipe(sourcemaps.init())
        .pipe(babel({
            extends: path.join(__dirname, '..', '..', '.babelrc'),
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(jsFilter.restore)
        .pipe(htmlFilter)
        .pipe(ngHtml2Js({
            moduleName: npmPackage.name,
            declareModule: false,
        }))
        .pipe(concat('templates.js'))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(config.distFolder))
        .on('end', done);
};

function isAHostProject(projectPath) {
    return projectPath !== path.resolve(__dirname, '..', '..');
}
