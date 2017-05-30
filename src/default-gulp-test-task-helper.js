import gulp from 'gulp';
import mocha from 'gulp-mocha';
import babelRegister from 'babel-register';
import karma from 'karma';

import getKarmaConfig from '../karma.conf';

babelRegister({
    extends: `${__dirname}/../.babelrc`,
});

function createTestRunner(reporters, ui, testPattern, additionalTemplatePattern) {
    return (config, done) => {
        if (config.targetBuild === 'node') {
            return nodeTest(config, done);
        }

        return browserTest(config, done);
    };

    function nodeTest(config) {
        return gulp.src([testPattern])
            .pipe(mocha({
                compilers: {
                    js: babelRegister,
                },
                ui,
                bail: !config.relax,
                reporter: reporters,
            }));
    }

    function browserTest(config, done) {
        const KarmaServer = karma.Server;
        const karmaConfig = getKarmaConfig(config, testPattern, additionalTemplatePattern);

        const server = new KarmaServer(karmaConfig, exitCode => {
            if (exitCode > 0) {
                done(new Error(`Karma exited with status code ${exitCode}`));
                return;
            }

            done();
        });
        server.start();
    }
}

export default createTestRunner;
