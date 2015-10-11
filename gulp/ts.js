var gulp = require('gulp'),
    ts = require('gulp-typescript');

gulp.task('ts', function(){
    var tsResult = gulp.src('source/init.ts')
        .pipe(ts({
            out: 'app.js'
        }));
    return tsResult.js.pipe(gulp.dest('front/js'));
});