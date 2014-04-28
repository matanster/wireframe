var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');

//
// task for building - invoked simply via 'gulp'
// 
gulp.task('default', function() {
  return gulp.src('public/script-source/main.js') /* source to build */
        .pipe(browserify())
        .pipe(gulp.dest('public/script'))         /* output directory */
});

//
// task for continous building upon javascript change - 
// invoked via 'gulp watch'
// 
gulp.task("watch", function() {
    watch({glob: "public/script-source/*.js"}, function() {
        gulp.start("default");
    });
});