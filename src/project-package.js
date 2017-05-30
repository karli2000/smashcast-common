const fs = require('fs');
const path = require('path');

class ProjectPackage {
    constructor(rootPath) {
        this.pkgFilePath = path.resolve(rootPath, 'package.json');
    }
    getContents() {
        return JSON.parse(fs.readFileSync(this.pkgFilePath, 'utf8'));
    }
    write(packageFileObject) {
        fs.writeFileSync(this.pkgFilePath, JSON.stringify(packageFileObject, null, 2));
    }
}

module.exports.ProjectPackage = ProjectPackage;
