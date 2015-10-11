var gulp = require('gulp'),
    flatten = require('gulp-flatten'),
    minifyHTML = require('gulp-minify-html');

gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src([
        './source/**/*.html',
        '!./source/index.html'
    ])
        .pipe(minifyHTML(opts))
        .pipe(flatten())
        .pipe(gulp.dest('./front/html/'));
});