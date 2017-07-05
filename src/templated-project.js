const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const smashcastCommonPackagePath = path.resolve(__dirname, '..');

class TemplatedProject {
    constructor(copyableTemplates) {
        this.copyableTemplates = copyableTemplates;
    }

    copyTemplatesIfAbsent() {
        for (const sourcePath of Object.keys(this.copyableTemplates)) { // eslint-disable-line no-restricted-syntax
            const fileMaps = this.copyableTemplates[sourcePath];

            for (const fileName of Object.keys(fileMaps)) { // eslint-disable-line no-restricted-syntax
                const templateMap = fileMaps[fileName];
                const sourceFileName = sourcePath === 'tpl' ? `${fileName}.tpl` : fileName;

                const src = path.resolve(smashcastCommonPackagePath, sourcePath, sourceFileName);
                const dest = path.join(getHostRootPath(), fileName);

                if (!fileExist(dest)) {
                    if (fileExist(src)) {
                        console.log(`Creating ${dest}`);
                        copyFile(src, dest, templateMap);
                    } else {
                        console.warn('WARNING: Could not find template', src, 'in package');
                    }
                }
            }
        }
    }
}

function getHostRootPath() {
    return process.cwd();
}

function copyFile(src, dest, templateMap) {
    const originalFileContent = fs.readFileSync(src, 'utf8');
    const newFileContent = _.template(originalFileContent)(templateMap);
    fs.writeFileSync(dest, newFileContent);
}

function fileExist(pathToCheck) {
    return fs.existsSync(pathToCheck);
}

module.exports = TemplatedProject;
