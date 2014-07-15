var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');
var clientRefresh = require('./clientRefresh');

//
// task for building - invoked simply via 'gulp'
// 
gulp.task('default', function() {
  gulp.src('public/script-source/read.js') /* source to build */
        .pipe(browserify())
        .pipe(gulp.dest('public/script'))  /* output directory */

  gulp.src('public/script-source/connect.js') /* source to build */
        .pipe(browserify())
        .pipe(gulp.dest('public/script'))     /* output directory */

  gulp.src('public/script-source/wait.js') /* source to build */
        .pipe(browserify())
        .pipe(gulp.dest('public/script'))     /* output directory */

  gulp.src('public/script-source/hive.js')    /* source to build */
        .pipe(browserify())
        .pipe(gulp.dest('public/script'))     /* output directory */
});

//
// task for automatic building upon javascript change - 
// invoked via 'gulp watch'
// 
gulp.task("watch", function() {
    watch({glob: "public/script-source/**/*.js"}, function() {
        gulp.start("default");
    });

    watch({glob: "public/**/*"}, function() {
        clientRefresh.broadcast()
    });

    watch({glob: "public/landing/*"}, function() {
        clientRefresh.broadcast()
    });

    watch({glob: "mock-data/*"}, function() {
        clientRefresh.broadcast()
    });
});