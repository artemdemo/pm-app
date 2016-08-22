import gulp from 'gulp';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import del from 'del';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import yargs from 'yargs';

const extractTextPluginFileName = 'css/styles-[hash].css';

let hash;

const args = yargs
    .options({
        pack: {
            alias: 'min',
            describe: 'uglify code',
            'boolean': true,
        },
        packWithMangle: {
            describe: 'uglify code with mangle',
        },
    }).argv;

if (args.pack) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, mangle: false}));
} else if (args.packWithMangle) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, mangle: true}));
}

webpackConfig.plugins.push(new ExtractTextPlugin(extractTextPluginFileName, {
    allChunks: true,
}));

const compiler = webpack(webpackConfig);

gulp.task('js', ['clean'], (callback) => {
    function report(resolve, err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        hash = stats.compilation.hash;

        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true,
        }));

        resolve();
    }

    Promise.all([
        new Promise((resolve) => {
            compiler.run(report.bind(null, resolve));
        }),
    ]).then(() => {
        runSequence('clean');
        callback();
    });
});


gulp.task('js-watch', ['clean'], () => {
    compiler.watch({
        aggregateTimeout: 300,
        poll: true,
    }, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        hash = stats.compilation.hash;
        runSequence('clean');

        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true,
        }));
    });
});

gulp.task('clean', (callback) => {
    del([
        'public/js/*.js',
        'public/js/*.js.map',
        `!public/js/bundle-${hash}.js`,
        `!public/js/bundle-${hash}.js.map`,
        'public/css/*.css',
        'public/css/*.css.map',
        `!public/css/styles-${hash}.css`,
        `!public/css/styles-${hash}.css.map`,
    ]).then(() => {
        callback();
    });
});

gulp.task('build', ['js']);
gulp.task('watch', ['clean', 'js-watch']);
