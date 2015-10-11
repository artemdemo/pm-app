var gulp = require('gulp'),
    gutil = require('gulp-util');

// @source http://rhumaric.com/2014/01/livereload-magic-gulp-style/

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname + '/../front';
var LIVERELOAD_PORT = 35729;

// Let's make things more readable by
// encapsulating each part's setup
// in its own method
function startExpress() {

    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);

    gutil.log(gutil.colors.yellow('[livereload]'),'Server started at', gutil.colors.blue('http://localhost:' + EXPRESS_PORT));
    gutil.log(gutil.colors.yellow('[livereload]'),'Serving directory', gutil.colors.blue(EXPRESS_ROOT));
}

// We'll need a reference to the tinylr
// object to send notifications of file changes
// further down
var lr;
function startLivereload() {

    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}

// Notifies livereload of changes detected
// by `gulp.watch()`
function notifyLivereload(event) {

    // `gulp.watch()` events provide an absolute path
    // so we need to make it relative to the server root
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

// ---------------> Watch for livereload

gulp.task('watch-livereload', function(){

    startExpress();
    startLivereload();

    gulp.watch('./source/**/**/*.less',notifyLivereload);
    gulp.watch('./source/**/*.ts',notifyLivereload);
    gulp.watch('./source/**/*.html',notifyLivereload);
});