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
import _ from 'underscore';

const compiler = webpack(webpackConfig);
let hash = {
    css: '123',
    js: '123'
};

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
        runSequence('html');

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
            runSequence('html');
        });
});

gulp.task('less-watch', () => {
    gulp.watch('./app/less/*.less', ['less']);
});

gulp.task('build', ['clean', 'js', 'html', 'less']);
gulp.task('watch', ['clean', 'js-watch', 'less', 'less-watch']);
