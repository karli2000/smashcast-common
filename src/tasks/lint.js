import path from 'path';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import eslint from 'gulp-eslint';
import stylelint from 'gulp-stylelint';

module.exports = () => ({
    scripts: config => {
        const stream = gulp.src(path.join(config.srcFolder, '**', '*.js'))
            .pipe(eslint({
                useEslintrc: true,
            }))
            .pipe(eslint.format())
            .pipe(gulpIf(!config.relax, eslint.failAfterError()));

        return stream;
    },
    stylesheets: config => {
        const stream = gulp.src(path.join(config.srcFolder, '**', '*.scss'))
            .pipe(stylelint({
                failAfterError: !config.relax,
                reporters: [
                    {
                        formatter: 'string',
                        console: true,
                    },
                ],
            }));

        return stream;
    },
});
