const path = require('path');
const args = require('yargs').argv;

const FOLDERS = {
    src: 'src',
    dist: 'lib',
    demo: 'demo',
    tests: 'tests',
};

const LOCAL_URL = 'localhost';

const Config = {
    path: process.cwd(),
    relax: !!args.relax,
    skipTests: !!args.skipTests,
    app: {
        buildPattern: '!(*.spec).js',
        testPattern: '*.spec.js',
    },
    stylesheets: {
        buildPattern: '*.scss',
    },
    srcFolder: FOLDERS.src,
    distFolder: FOLDERS.dist,
    testsFolder: FOLDERS.tests,
    targetBuild: 'browser', // browser/node
    server: {
        url: LOCAL_URL,
        http: {
            port: 80,
        },
        https: {
            port: 443,
        },
        liveReload: {
            port: 35730,
            src: `https://${LOCAL_URL}:35730/livereload.js?snipver=1`,
        },
        webpack: {
            file: path.join(__dirname, '..', 'webpack.config'),
            options: {
                debug: false,
                src: FOLDERS.src,
                target: FOLDERS.demo,
                appEntry: 'index.js',
                babelQuery: {},
                htmlTemplate: path.join(__dirname, 'demo-index.ejs'),
                cssLoaderOptions: '-url',
            },
        },
    },
    release: {
        commitMessageAddition: '',
    },
};

module.exports = Config;
