import gulp from 'gulp';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import del from 'del';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import _ from 'underscore';

const extractTextPluginFileName = 'css/styles-[hash].css';

let hash;

let args = yargs
    .options({
        'pack': {
            alias: 'min',
            describe: 'uglify code',
            boolean: true,
        },
        'packWithMangle': {
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
        runSequence('clean', 'html');
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
        runSequence('clean', 'html');

        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true,
        }));
    });
});

gulp.task('html', () => {
    const htmlSrc = path.join(__dirname, 'app', 'index.html');
    const template = fs.readFileSync(htmlSrc, 'utf8');
    const html = _.template(template)({hash});
    fs.writeFile(path.join(__dirname, 'public', 'index.html'), html);
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

gulp.task('copy', () => {
    const fonts = [
        './node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
        './node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
        './node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
        './node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
        './node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
    ];
    gulp
        .src([
            './node_modules/bootstrap/dist/css/bootstrap.css',
        ])
        .pipe(rename('bootstrap.less'))
        .pipe(gulp.dest('app/styles/bootstrap/css'));
    gulp
        .src(fonts)
        .pipe(gulp.dest('app/styles/bootstrap/fonts'));
    // gulp
    //     .src(fonts)
    //     .pipe(gulp.dest('public/fonts'));
});

gulp.task('less-watch', () => {
    gulp.watch('./app/less/**/*.less', ['less']);
});

gulp.task('build', ['copy', 'js']);
gulp.task('watch', ['clean', 'js-watch']);
