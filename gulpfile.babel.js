import gulp from 'gulp';
import gutil from 'gulp-util';
import less from 'gulp-less';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import del from 'del';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import _ from 'underscore';

const randomID = () => {
    return 'xxxxxxxx'.replace(
        /[xy]/g,
        (c) => {
            let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
};
let hash = {
    css: randomID(),
    js: randomID()
};

var args = yargs
    .options('pack', {
        alias: 'min',
        describe: 'uglify code',
        boolean: true
    }).argv;
    
if (args.pack) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, mangle: false}));
}

const compiler = webpack(webpackConfig);

gulp.task('js', ['clean'], function(callback) {
    function report(resolve, err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        hash.js = stats.compilation.hash;

        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true
        }));

        resolve();
    }

    Promise.all([
        new Promise(function(resolve) {
            compiler.run(report.bind(null, resolve));
        })
    ]).then(function() {
        runSequence('clean', 'html');
        callback();
    });
});


gulp.task('js-watch', ['clean'], function() {
    compiler.watch({
        aggregateTimeout: 300,
        poll: true
    }, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        hash.js = stats.compilation.hash;
        runSequence('clean', 'html');

        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true
        }));
    });
});

gulp.task('html', function() {
    const htmlSrc = path.join(__dirname, 'app', 'index.html');
    const template = fs.readFileSync(htmlSrc, 'utf8');
    const html = _.template(template)({hash});
    fs.writeFile(path.join(__dirname, 'public', 'index.html'), html);
});

gulp.task('clean', function(callback) {
    del([
        'public/js/*.js',
        'public/js/*.js.map',
        `!public/js/bundle-${hash.js}.js`,
        `!public/js/bundle-${hash.js}.js.map`,
        'public/css/*.css',
        `!public/css/styles-${hash.css}.css`
    ]).then(function() {
        callback();
    });
});

gulp.task('less', ['clean'], function () {
    hash.css = hash.js;
    return gulp.src('./app/less/styles.less')
        .pipe(less())
        .on('error', function(err) {
            // Handle less errors, but do not stop watch task
            gutil.log(gutil.colors.red.bold('[Less error]'));
            gutil.log(gutil.colors.bgRed('filename:') +' '+ err.filename);
            gutil.log(gutil.colors.bgRed('lineNumber:') +' '+ err.lineNumber);
            gutil.log(gutil.colors.bgRed('extract:') +' '+ err.extract.join(' '));
            this.emit('end');
        })
        .pipe(rename(`styles-${hash.css}.css`))
        .pipe(gulp.dest('./public/css'))
        .on('end', function() {
            runSequence('clean', 'html');
        });
});

gulp.task('copy', function () {
    return gulp
        .src([
            './node_modules/bootstrap/fonts/glyphicons-halflings-regular.eot',
            './node_modules/bootstrap/fonts/glyphicons-halflings-regular.svg',
            './node_modules/bootstrap/fonts/glyphicons-halflings-regular.ttf',
            './node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff',
            './node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff2'
        ])
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('less-watch', () => {
    gulp.watch('./app/less/**/*.less', ['less']);
});

gulp.task('build', ['copy', 'js', 'less']);
gulp.task('watch', ['clean', 'js-watch', 'less', 'less-watch']);
