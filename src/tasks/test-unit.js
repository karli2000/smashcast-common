import path from 'path';
import defaultGulpTestTaskHelper from '../default-gulp-test-task-helper';

module.exports = (config, done) => defaultGulpTestTaskHelper(['spec'], 'bdd',
        path.resolve(config.srcFolder, '**', config.app.testPattern))(config, done);
