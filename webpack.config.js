import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default options => {
    return {
        // https://webpack.github.io/docs/configuration.html#devtool
        // cheap-module-eval-source-map might still be bugged: https://github.com/webpack/webpack/issues/2145
        // lets test it again
        devtool: 'cheap-module-eval-source-map',

        entry: {
            app: [
                'eventsource-polyfill',
                'webpack-hot-middleware/client?reload=true',
                path.join(process.cwd(), options.src, options.appEntry),
            ],
        },

        output: {
            path: path.join(process.cwd(), options.target),
            publicPath: '/',
            filename: 'app.js',
            devtoolModuleFilenameTemplate: '/[resource-path]',
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    query: {
                        ...(options.babelQuery || {}),
                        cacheDirectory: './.babelcache',
                    },
                    include: [
                        path.resolve(process.cwd(), options.src),
                    ],
                },
                {
                    test: /\.scss$/,
                    loader: `style-loader?convertToAbsoluteUrls&sourceMap!css-loader?${options.cssLoaderOptions}&sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap`,
                    include: [
                        path.resolve(process.cwd(), 'node_modules'),
                        path.resolve(process.cwd(), options.src),
                    ],
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    include: [
                        path.resolve(process.cwd(), 'node_modules'),
                        path.resolve(process.cwd(), options.src),
                    ],
                },
            ],
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: false,
                debug: options.debug,
                options: {
                    context: '/',
                    sassLoader: {
                        includePaths: [
                            path.resolve(process.cwd(), './node_modules'),
                        ],
                    },
                    postcss: () => {
                        return [
                            require('autoprefixer')({
                                browsers: [
                                    'last 2 versions',
                                ],
                            }),
                            require('postcss-reporter')({
                                clearMessages: true,
                            }),
                        ];
                    },
                },
            }),
            new webpack.DefinePlugin({
                // also set to "production" if "webpack -p" is used, but just to make sure
                // and to be also useable by something like grunt/gulp
                'process.env': {
                    // JSON.stringify is needed here, not a mistake .. :)
                    // `"development"` would also work, but i fear someone string replaces double quotes
                    NODE_ENV: JSON.stringify('development'),
                },
            }),
            new HtmlWebpackPlugin({
                template: options.htmlTemplate,
            }),
        ],

        resolve: {
            extensions: [
                '.js',
                '.json',
                '.jsx',
            ],
            modules: [
                path.resolve(process.cwd(), options.src),
                'node_modules',
            ],
        },

        resolveLoader: {
            modules: [
                path.resolve(process.cwd(), options.src),
                'node_modules',
            ],
        },

        stats: false,

        // Report the first error as a hard error instead of tolerating it.
        bail: false,
    };
};
