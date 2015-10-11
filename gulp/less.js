var gulp = require('gulp'),
    less = require('gulp-less');

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