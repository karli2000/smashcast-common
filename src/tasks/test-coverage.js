const gulp = require('gulp');
const path = require('path');
const istanbul = require('gulp-istanbul');
const isparta = require('isparta');
const runSequence = require('run-sequence');

module.exports = (config, done) => {
    gulp.task('coverage:instrument', () => {
        const stream = gulp.src(path.join(config.srcFolder, '**', config.app.buildPattern))
            .pipe(istanbul({
                instrumenter: isparta.Instrumenter,
                includeUntested: true,
                babel: {
                    extends: `${__dirname}/../../.babelrc`,
                },
            }))
            .pipe(istanbul.hookRequire());

        return stream;
    });

    gulp.task('coverage:report', () => {
        const coverageDir = path.join(config.path, 'report', 'coverage');

        return gulp.src(path.join(config.srcFolder, '**', config.app.buildPattern), { read: false })
            .pipe(istanbul.writeReports({
                dir: coverageDir,
                reportOpts: { dir: coverageDir },
                reporters: ['html'],
            }));
    });

    runSequence('coverage:instrument', 'test', 'coverage:report', done);
};
