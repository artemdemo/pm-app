var gulp = require('gulp');

gulp.task('copy-build', function () {
    gulp
        .src('index.html')
        .pipe(gulp.dest('./front'));
    gulp
        .src([
            './node_modules/font-awesome/fonts/*'
        ])
        .pipe(gulp.dest('./front/fonts'));
    gulp
        .src([
            './node_modules/moment/min/moment.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-foundation/mm-foundation-tpls.min.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/angular-resource/angular-resource.min.js',
            './vendor/ng-sortable/dist/ng-sortable.min.js'
        ])
        .pipe(gulp.dest('./front/js'))
});