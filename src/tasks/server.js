import http from 'http';
import connect from 'connect';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import liveReload from 'connect-livereload';

let webpackMiddlewareInstance;
let webpackHotMiddlewareInstance;

function createHttpServer(options) {
    const app = connect();

    if (!webpackMiddlewareInstance || !webpackHotMiddlewareInstance) {
        createWebpackMiddlewares(options);
    }

    app.use(webpackMiddlewareInstance)
        .use(webpackHotMiddlewareInstance)
        .use(connectHistoryApiFallback())
        .use(serveStatic('./'))
        .use(serveIndex('./', {
            icons: true,
        }));

    if (options.liveReload) {
        app.use(liveReload({
            port: options.liveReload.port,
            src: options.liveReload.src,
        }));
    }

    http.createServer(app).listen(options.http.port);
}

function createWebpackMiddlewares(options) {
    const webpackDevConfig = require(options.webpack.file).default(options.webpack.options); // eslint-disable-line import/no-dynamic-require, global-require
    const webpackDevCompiler = webpack(webpackDevConfig);

    webpackMiddlewareInstance = webpackDevMiddleware(webpackDevCompiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: false,
        quiet: false,
        stats: {
            chunks: false,
            colors: true,
        },
    });
    webpackHotMiddlewareInstance = webpackHotMiddleware(webpackDevCompiler);
}

module.exports = createHttpServer;
