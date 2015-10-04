var gulp = require('gulp'),
    less = require('gulp-less'),
    ts = require('gulp-typescript'),
    concat = require('gulp-concat'),
    minifyHTML = require('gulp-minify-html'),
    flatten = require('gulp-flatten'),
    sourcemaps = require('gulp-sourcemaps');

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix= new LessPluginAutoPrefix({ browsers: ['last 2 versions'] });

gulp.task('less', function(){
    return gulp.src('./source/less/main.less')
        .pipe(less({
            plugins: [autoprefix]
        }).on('error', function(err){

            // Handle less errors, but do not stop watch task
            console.log('Less error:');
            console.log('filename:', err.filename);
            console.log('lineNumber:', err.lineNumber);
            console.log('extract:', err.extract.join(' '));
            this.emit('end');
        }))
        .pipe(gulp.dest('./front/css/'));
});

gulp.task('ts', function(){
    var tsResult = gulp.src('source/init.ts')
        .pipe(ts({
            out: 'app.js'
        }));
    return tsResult.js.pipe(gulp.dest('front/js'));
});

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

gulp.task('concat', function(){
    return gulp.src([
        './front/js/angular.min.js',
        './front/js/moment.min.js',

        './front/js/angular-ui-router.min.js',
        './front/js/mm-foundation-tpls.min.js',
        './front/js/angular-resource.min.js',
        './front/js/ng-sortable.min.js',
        './front/js/app.js'
    ])
        .pipe(concat('app-all.js'))
        .pipe(gulp.dest('./front/js/'));
});

gulp.task('copy', function () {
    return gulp
        .src('source/index.html')
        .pipe(gulp.dest('./front'))
});

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

gulp.task('watch', function(){
    gulp.watch('./source/**/**/*.less',['less']);
    gulp.watch('./source/**/*.ts',['ts', 'concat']);
    gulp.watch('./source/**/*.html',['minify-html', 'copy']);
});

gulp.task('build', ['less', 'ts', 'copy-build', 'minify-html', 'copy', 'concat']);
gulp.task('default', ['build', 'watch']);
