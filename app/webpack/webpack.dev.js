const webpackCommonFactory = require('./webpack.common');

/**
 * @param options {Object} - see required params in `webpack.common.js`
 */
module.exports = (options) => {
    const webpackCommon = webpackCommonFactory(options);
    return Object.assign(webpackCommon, {
        mode: 'development',
        devtool: 'source-map',
        optimization: {
            minimize: false,
        },
        devServer: {
            host: '0.0.0.0',
            port: 8080,
            contentBase: `${options.buildFolder}/`,
            historyApiFallback: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                },
            },
        },
        plugins: [
            ...webpackCommon.plugins,
        ],
    });
};
