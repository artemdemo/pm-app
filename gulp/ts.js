var gulp = require('gulp'),
    ts = require('gulp-typescript');

gulp.task('ts', function(){
    gulp.src('source/init.ts')
        .pipe(ts({
            out: 'app.js'
        }))
        .js.pipe(gulp.dest('front/js'));

    gulp.src('source/run.ts')
        .pipe(ts({
            out: 'app-run.js'
        }))
        .js.pipe(gulp.dest('front/js'));
});