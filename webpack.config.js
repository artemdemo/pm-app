var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = {
    entry: {
        'app': './app/bootstrap.ts'
    },
    output: {
        path: __dirname + '/public/',
        filename: './js/bundle-[hash].js'
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: ['ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // function() {
        //     this.plugin('done', function(stats) {
        //         var htmlSrc = path.join(__dirname, 'app', 'index.html');
        //         var template = fs.readFileSync(htmlSrc, 'utf8');
        //         var html = _.template(template)({hash: stats.hash});
        //         fs.writeFile(path.join(__dirname, 'public', 'index.html'), html);
        //     });
        // }
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
