import ncu from 'npm-check-updates';

module.exports = (config, done) => {
    ncu.run({
        packageFile: `${config.path}/package.json`,
    }).then(upgraded => {
        console.log('dependencies to upgrade:', upgraded);
        done();
    });
};
