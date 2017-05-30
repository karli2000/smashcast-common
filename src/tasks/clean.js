import del from 'del';
import path from 'path';

module.exports = config => del([
    path.join(config.distFolder, '**'),
    `!${config.distFolder}`,
]);

