"use strict";

var   gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require('del');

//concat js files - Gulp task
gulp.task("concatScripts", function () {
  return gulp.src([  //with return statement it forces this to
                     //finish before others start
    'js/jquery.js',
    'js/sticky/jquery.sticky.js',
    'js/customjs.js'
  ])
  .pipe(maps.init()) //js course maps created
  .pipe(concat('app.js')) //creates app js file
  .pipe(maps.write('./')) //writes js maps files
  .pipe(gulp.dest('js'));
  
});

//minify js files - Gulp task
gulp.task("minifyScripts", ['concatScripts'], function () {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js')) //rename/add min file
    .pipe(gulp.dest('js'));
});

//sass compiler - Gulp task
gulp.task('compileSass', function () {
  return gulp.src("scss/app.scss")
    .pipe(maps.init()) //css source maps created
    .pipe(sass())
    .pipe(maps.write('./')) //writes source maps files
    .pipe(gulp.dest('css')); //where css is piped to
});

gulp.task('watchFiles', function () {
  //checks all scss and updates on changes on any of them
  gulp.watch('scss/**/*.scss', ['compileSass']); 
  gulp.watch('js/main.js', ['concatScripts']); //only watching main.js file and then runs task 
});

// create clean task to clean out older files
gulp.task('clean', function () {
  del(['dist', 'css/app*.css*', 'js/app*.js*']);
  // deletes files in these specified locations
});

// create build task to run all tasks with one task
gulp.task("build", ['minifyScripts', 'compileSass'], function () {
  return gulp.src(["css/cdapplication.css", "js/app.min.js", 'index.html',
                    "img/**", "fonts/**"], { base: './'}) 
              //this makes sure that folder structure is maintained in
              //dist folder
           .pipe(gulp.dest('dist')); //creates dist folder for all prod files
});

gulp.task('serve', ['watchFiles']);

//create default task -- includes build as dependancy
gulp.task("default", ["clean"], function() {
  gulp.start('build');
});