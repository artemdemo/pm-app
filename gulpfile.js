var gulp = require('gulp'),
    gutil = require('gulp-util');


require('./gulp/livereload.js');
require('./gulp/less.js');
require('./gulp/ts.js');
require('./gulp/minify-html.js');
require('./gulp/concat.js');
require('./gulp/copy.js');
require('./gulp/copy-build.js');


gulp.task('default-info', function(){
    gutil.log(gutil.colors.yellow('[watching]'),'Frontend url:', gutil.colors.blue('http://localhost/pm/front/'));
});

gulp.task('watch', function(){
    gulp.watch('./source/**/**/*.less',['less']);
    gulp.watch('./source/**/*.ts',['ts', 'concat']);
    gulp.watch('./source/**/*.html',['minify-html', 'copy']);
});


gulp.task('build', ['less', 'ts', 'copy-build', 'minify-html', 'copy', 'concat']);
gulp.task('serve', ['build', 'watch', 'watch-livereload']);
gulp.task('default', ['build', 'watch', 'default-info']);
