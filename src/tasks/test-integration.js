import path from 'path';
import defaultGulpTestTaskHelper from '../default-gulp-test-task-helper';

module.exports = (config, done) =>
    defaultGulpTestTaskHelper(['dot'], 'bdd',
    path.resolve(config.testsFolder, '**', config.app.buildPattern),
    path.resolve(config.testsFolder, '**', '*.html'))(config, done);
