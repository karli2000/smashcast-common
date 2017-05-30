import gulp from 'gulp';
import runSequence from 'run-sequence';
import conventionalChangelog from 'gulp-conventional-changelog';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import bump from 'gulp-bump';
import gutil from 'gulp-util';
import git from 'gulp-git';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const requiredFiles = ['CHANGELOG.md', 'package.json'];

module.exports = config => {
    const npmPackage = require(`${config.path}/package.json`); // eslint-disable-line import/no-dynamic-require, global-require

    gulp.task('bump-version', done => {
        conventionalRecommendedBump({
            preset: 'angular',
        }, (err, result) => {
            gulp.src(`${config.path}/package.json`)
                .pipe(bump({ type: result.releaseType }).on('error', gutil.log))
                .pipe(gulp.dest(`${config.path}/`))
                .on('end', done);
        });
    });

    gulp.task('changelog', done => {
        gulp.src(`${config.path}/CHANGELOG.md`, {
            buffer: false,
        })
            .pipe(conventionalChangelog({
                preset: 'angular',
            }, {
                currentTag: getPackageJsonVersion(),
                commit: 'commit',
            }))
            .pipe(gulp.dest(`${config.path}/`))
            .on('end', done);
    });

    gulp.task('commit-changes', () => {
        const version = getPackageJsonVersion();

        return gulp
            .src([
                `${config.path}/${config.distFolder}`,
                `${config.path}/{${requiredFiles.join(',')}}`,
            ])
            .pipe(git.add())
            .pipe(git.commit(`chore(release): Release ${version}${config.release.commitMessageAddition}`));
    });

    gulp.task('push-changes', done => {
        git.push('origin', 'master', { args: '--tags' }, done);
    });

    gulp.task('create-new-tag', done => {
        const version = getPackageJsonVersion();
        git.tag(version, `Created Tag for version: ${version}`, done);
    });

    gulp.task('look-for-uncommitted-changes', done => {
        git.status({ args: '--porcelain' }, (err, stdout) => {
            if (err) {
                throw err;
            }

            if (!stdout) {
                done();
                return;
            }

            const errorTxt = 'You have uncommitted changes.';
            logError(errorTxt);
            logError('Please commit everything before releasing a new version.');
            done(new Error(errorTxt));
        });
    });

    gulp.task('fetch-remote', done => {
        git.fetch('', '', { args: '--all' }, done);
    });

    gulp.task('check-if-up-to-date', ['fetch-remote'], done => {
        git.status({ args: '-uno' }, (err, stdout) => {
            if (err) {
                throw err;
            }

            if (!stdout.includes('Your branch is behind')) {
                done();
                return;
            }

            const errorTxt = 'Your branch is not up-to-date. Pull first!';
            logError(errorTxt);
            done(new Error(errorTxt));
        });
    });

    gulp.task('requirements', done => {
        requiredFiles.forEach(fileName => {
            const fullPath = path.resolve(config.path, fileName);
            if (!fs.existsSync(fullPath)) {
                const errorTxt = `Missing file: ${fullPath}`;
                logError(errorTxt);
                done(new Error(errorTxt));
            }
        });
        done();
    });

    function getPackageJsonVersion() {
        // We parse the json file instead of using require because require caches
        // multiple calls so the version number won't be updated
        return JSON.parse(fs.readFileSync(`${config.path}/package.json`, 'utf8')).version;
    }

    function onEnd(error) {
        if (error) {
            console.log(error.message);
            logError('RELEASE FAILED');
        } else {
            console.log(chalk.green.bold('RELEASE FINISHED SUCCESSFULLY'));
        }
    }

    function logError(msg) {
        console.log(chalk.red.bold(msg));
    }

    runSequence(
        'look-for-uncommitted-changes',
        'check-if-up-to-date',
        'requirements',
        'build',
        'bump-version',
        'changelog',
        'commit-changes',
        'create-new-tag',
        'push-changes',
        onEnd
    );
};
