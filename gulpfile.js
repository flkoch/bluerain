const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const zip = require("gulp-zip");
const smap = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const watch = require("gulp-watch");
const batch = require("gulp-batch")
// const seq = require("gulp-sequence");

var dirOut = "build/bluerain/";
var dirIn = "development/";

gulp.task('sass:dev', function(){
  return gulp.src(dirIn + 'style/scss/*.scss')
    .pipe(smap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(smap.write('.'))
    .pipe(gulp.dest(dirIn + 'style/css/'));
});
gulp.task('sass:build', function(){
  return gulp.src(dirIn + 'style/scss/*.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirOut + 'style/css'));
});
gulp.task('js', function(){
  return gulp.src(dirIn + 'js/*.js')
    .pipe(gulp.dest(dirOut + 'js'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirOut + 'js'));
});
gulp.task('root-folder', function(){
  return gulp.src(dirIn + '*.*')
    .pipe(gulp.dest(dirOut));
});
gulp.task('dependencies', function(){
  return gulp.src(dirIn + 'dependencies/**/*.*')
    .pipe(gulp.dest(dirOut + 'dependencies'));
});
gulp.task('style', ['sass:dev', 'sass:build'], function(){
  return gulp.src(dirIn + 'style/**/*.*')
    .pipe(gulp.dest(dirOut + 'style'));
});
gulp.task('templates', function(){
  gulp.src(dirIn + 'templates/**/*.*')
    .pipe(gulp.dest(dirOut + 'templates'));
});
gulp.task('build', ['js', 'root-folder', 'dependencies', 'style', 'templates']);
gulp.task('watch', function(){
  watch(dirIn + 'style/scss/**/*.*', batch(function(events,done){gulp.start('sass:dev', done); gulp.start('sass:build', done);}));
  watch(dirIn + 'js/**/*.*', batch(function(events,done){gulp.start('js', done);}));
});
