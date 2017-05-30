const path = require('path');
const fs = require('fs');

module.exports = (config, testPattern, additionalTemplatePattern) => {
    const preprocessorsMetaData = {
        tests: {
            files: testPattern,
            preprocessors: ['webpack'],
        },
        code: {
            files: path.join(config.srcFolder, '**', config.app.buildPattern),
            preprocessors: ['webpack'],
        },
        templates: {
            files: path.join(config.srcFolder, '**', '*.html'),
            preprocessors: ['ng-html2js'],
        },
    };

    const configHash = {
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            preprocessorsMetaData.code.files,
            preprocessorsMetaData.tests.files,
            preprocessorsMetaData.templates.files,
        ],
        preprocessors: {},
        failOnEmptyTestSuite: false,
    };

    configHash.preprocessors[preprocessorsMetaData.code.files] = preprocessorsMetaData.code.preprocessors;
    configHash.preprocessors[preprocessorsMetaData.tests.files] = preprocessorsMetaData.tests.preprocessors;
    configHash.preprocessors[preprocessorsMetaData.templates.files] = preprocessorsMetaData.templates.preprocessors;

    if (additionalTemplatePattern) {
        configHash.files.push(additionalTemplatePattern);
        configHash.preprocessors[additionalTemplatePattern] = preprocessorsMetaData.templates.preprocessors;
    }

    configHash.ngHtml2JsPreprocessor = {
        moduleName: 'ngTemplates',
    };

    const customWebpackConfigPath = path.join(process.cwd(), 'webpack.config.js');
    const webpackConfigPath = fs.existsSync(customWebpackConfigPath) ? customWebpackConfigPath : './webpack.config';

    configHash.webpack = require(webpackConfigPath).default({
        ...config.server.webpack.options,
        isTest: true,
    });

    configHash.webpackMiddleware = {
        noInfo: true,
        stats: 'errors-only',
    };

    configHash.plugins = [
        require('karma-webpack'),
        require('karma-mocha'),
        require('karma-phantomjs-launcher'),
        require('karma-ng-html2js-preprocessor'),
    ];

    return Object.assign({}, configHash, {
        basePath: '',
        frameworks: ['mocha'],
        exclude: [],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
    });
};
