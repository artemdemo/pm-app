import gulp from 'gulp';
import gutil from 'gulp-util';
import less from 'gulp-less';
import del from 'del';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

let compiler = webpack(webpackConfig);
let hash = '';

gulp.task('js', ['clean'], function(callback) {
    function report(resolve, err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        hash = stats.compilation.hash;

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

        hash = stats.compilation.hash;

        gutil.log('[webpack]', stats.toString({
            chunks: false,
            colors: true
        }));
    });
});

gulp.task('clean', function(callback) {
    del(['public/js']).then(function() {
        callback();
    });
});

gulp.task('less', ['clean'], function () {
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
        .pipe(gulp.dest('./public/css'))
});

gulp.task('less-watch', () => {
    gulp.watch('./app/less/*.less', ['less']);
});

gulp.task('build', ['clean', 'js', 'less']);
gulp.task('watch', ['clean', 'js-watch', 'less-watch']);
