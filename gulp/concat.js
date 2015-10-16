var gulp = require('gulp'),
    concat = require('gulp-concat');

gulp.task('concat', function(){
    return gulp.src([
        './front/js/moment.min.js',
        './front/js/angular.min.js',

        './front/js/angular-ui-router.min.js',
        './front/js/angular-resource.min.js',
        './front/js/mm-foundation-tpls.min.js',
        './front/js/angular-sanitize.min.js',
        './front/js/app.js',
        './front/js/app-run.js'
    ])
        .pipe(concat('app-all.js'))
        .pipe(gulp.dest('./front/js/'));
});