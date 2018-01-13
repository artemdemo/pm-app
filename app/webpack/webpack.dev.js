const webpackCommonFactory = require('./webpack.common');
const { commonCommons } = require('./commonChunks');

/**
 * @param options {Object} - see required params in `webpack.common.js`
 */
module.exports = (options) => {
    const webpackCommon = webpackCommonFactory(options);
    return Object.assign(webpackCommon, {
        devtool: 'source-map',
        devServer: {
            port: 8080,
            contentBase: `${options.buildFolder}/`,
            historyApiFallback: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                },
            },
        },
        plugins: webpackCommon.plugins.concat([
            commonCommons(),
        ]),
    });
};
