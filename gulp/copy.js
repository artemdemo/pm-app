var gulp = require('gulp');

gulp.task('copy', function () {
    return gulp
        .src('source/index.html')
        .pipe(gulp.dest('./front'))
});