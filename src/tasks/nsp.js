import nsp from 'gulp-nsp';

module.exports = (config, done) => {
    nsp({
        package: `${config.path}/package.json`,
        stopOnError: false,
        output: 'summary',
    }, done);
};
