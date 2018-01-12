const {
    CommonsChunkPlugin,
} = require('webpack').optimize;

const commonCommons = (prod = false) => {
    const filename = prod ? './js/common-[chunkhash].js' : './js/common.js';
    return new CommonsChunkPlugin({
        name: 'common',
        filename,
        minChunks: Infinity,
    });
};

module.exports = {
    commonCommons,
};
