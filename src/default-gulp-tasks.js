import open from 'gulp-open';
import finalConfig from './final-config';
import testUnitTask from './tasks/test-unit';
import testIntegrationTask from './tasks/test-integration';
import testUnitWatchTask from './tasks/test-unit-watch';
import testIntegrationWatchTask from './tasks/test-integration-watch';
import testCoverageTask from './tasks/test-coverage';
import nspTask from './tasks/nsp';
import ncuTask from './tasks/ncu';
import lintTask from './tasks/lint';
import buildTask from './tasks/build';
import buildWatchTask from './tasks/build-watch';
import cleanTask from './tasks/clean';
import releaseTask from './tasks/release';
import serverTask from './tasks/server';

export default gulp => {
    const defaultTasks = getTasks(gulp);

    gulp.task('lint', ['lint:JS', 'lint:CSS']);
    gulp.task('lint:JS', defaultTasks.lintJS);
    gulp.task('lint:CSS', defaultTasks.lintCSS);
    gulp.task('nsp', defaultTasks.nsp);
    gulp.task('ncu', defaultTasks.ncu);
    gulp.task('test:unit', ['lint:JS'], defaultTasks.testUnit);
    gulp.task('test:unit:watch', ['test:unit'], defaultTasks.testUnitWatch);
    gulp.task('test:integration', ['lint:JS'], defaultTasks.testIntegration);
    gulp.task('test:integration:watch', ['test:integration'], defaultTasks.testIntegrationWatch);
    gulp.task('test:coverage', defaultTasks.testCoverage);
    gulp.task('test', ['test:unit', 'test:integration']);
    gulp.task('server', defaultTasks.server);
    gulp.task('build', [
        'clean',
        ...(!finalConfig.skipTests ? ['lint', 'test'] : []),
    ], defaultTasks.build);
    gulp.task('build:watch', ['build'], defaultTasks.buildWatch);
    gulp.task('clean', defaultTasks.clean);
    gulp.task('release', ['nsp', 'ncu'], defaultTasks.release);
};

function getTasks(gulp) {
    return {
        config: finalConfig,
        testUnit: done => testUnitTask(finalConfig, done),
        testUnitWatch: done => testUnitWatchTask(finalConfig, done),
        testIntegration: done => testIntegrationTask(finalConfig, done),
        testIntegrationWatch: done => testIntegrationWatchTask(finalConfig, done),
        testCoverage: done => testCoverageTask(finalConfig, done),
        nsp: done => nspTask(finalConfig, done),
        ncu: done => ncuTask(finalConfig, done),
        lintJS: () => lintTask().scripts(finalConfig),
        lintCSS: () => lintTask().stylesheets(finalConfig),
        build: done => buildTask(finalConfig, done),
        buildWatch: done => buildWatchTask(finalConfig, done),
        clean: () => cleanTask(finalConfig),
        release: () => releaseTask(finalConfig),
        server: () => {
            const server = serverTask;
            let openUri = `http://${finalConfig.server.url}`;

            server(finalConfig.server);

            if (finalConfig.server.http.port !== 80) {
                openUri += `:${finalConfig.server.http.port}`;
            }

            gulp.src(__filename)
                .pipe(open({
                    uri: openUri,
                }));
        },
    };
}
