const extend = require('deep-extend');
const smascastCommonPackage = require('../package.json');

postInstall();

function postInstall() {
    const commonPathRegexp = new RegExp(`node_modules/${smascastCommonPackage.name}`);
    if (commonPathRegexp.test(process.cwd())) {
        process.chdir('../..');
    }

    const projectPath = process.cwd();
    if (!installedFromHostProject()) {
        return;
    }

    const projectPackage = require(`${projectPath}/package.json`); // eslint-disable-line import/no-dynamic-require, global-require
    const TemplatedProject = require('./templated-project'); // eslint-disable-line global-require
    const ProjectPackage = require('./project-package'); // eslint-disable-line global-require

    const copyableTemplates = {
        '.': {
            '.gitattributes': {},
            '.eslintrc': {},
            '.editorconfig': {},
        },
        'tpl': {
            '.gitignore': {},
            'gulpfile.js': {},
            'CHANGELOG.md': {},
            'README.md': {
                projectName: projectPackage.name,
                gitRepo: projectPackage.repository ? projectPackage.repository.url : '',
                version: projectPackage.version,
            },
            'stylelint.config.js': {},
        },
    };

    const defaultPackageConfig = {
        private: true,
        config: {
            'pre-git': {
                'commit-msg': 'conventional',
                'pre-commit': ['gulp test'],
            },
        },
    };

    const project = new TemplatedProject(copyableTemplates);

    project.copyTemplatesIfAbsent();
    addDefaultConfigToPackage(defaultPackageConfig);

    function installedFromHostProject() {
        return __dirname !== projectPath;
    }

    function addDefaultConfigToPackage(configToBeAdded) {
        const pkgFile = new ProjectPackage.ProjectPackage(projectPath);
        const originalHostProjectPkg = pkgFile.getContents();
        const newHostProjectPkg = extend(originalHostProjectPkg, configToBeAdded);

        pkgFile.write(newHostProjectPkg);
    }
}
