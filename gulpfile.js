const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const zip = require("gulp-zip");
const smap = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const watch = require("gulp-watch");
const batch = require("gulp-batch");
const header = require("gulp-header");
// const seq = require("gulp-sequence");

var dirOut = "build/bluerain/";
var dirIn = "development/";
const pkg = require("./package.json");
var banner = ['/**',
  ' * @name <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('sass:dev', function(){
  gulp.src(dirIn + 'style/scss/*.scss')
    .pipe(smap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(smap.write('.'))
    .pipe(gulp.dest(dirIn + 'style/css/'));
});
gulp.task('sass:build', function(){
  gulp.src(dirIn + 'style/scss/*.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirOut + 'style/css'));
});
gulp.task('js', function(){
  gulp.src(dirIn + 'js/*.js')
    .pipe(gulp.dest(dirOut + 'js'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirOut + 'js'));
});
gulp.task('root-folder', function(){
  gulp.src(dirIn + '*.*')
    .pipe(gulp.dest(dirOut));
});
gulp.task('dependencies', function(){
  gulp.src(dirIn + 'dependencies/**/*.*')
    .pipe(gulp.dest(dirOut + 'dependencies'));
});
gulp.task('style', ['sass:dev', 'sass:build'], function(){
  gulp.src(dirIn + 'style/**/*.*')
    .pipe(gulp.dest(dirOut + 'style'));
});
gulp.task('templates', function(){
  gulp.src(dirIn + 'templates/**/*.*')
    .pipe(gulp.dest(dirOut + 'templates'));
});
gulp.task('build', ['js', 'root-folder', 'dependencies', 'style', 'templates'], function(){
  gulp.src([dirOut + '**/*@(js|scss|css|min.css)', '!**/dependencies/**/*.*',])
    .pipe(header(banner, {pkg:pkg}))
    .pipe(gulp.dest(dirOut))
});
gulp.task('deploy:full', function(){
  gulp.src(dirOut + '**/*.*', { base: 'build'})
    .pipe(zip('tmpl_bluerain.zip'))
    .pipe(gulp.dest('build/'));
});
gulp.task('deploy:min', function(){
  gulp.src([dirOut + '**/*.*', '!**/*.scss', '!**/*.css', dirOut + '**/*.min.css'], {base: 'build'})
    .pipe(zip('tmpl_bluerain.min.zip'))
    .pipe(gulp.dest('build/'));
});
gulp.task('watch', function(){
  watch(dirIn + 'style/scss/**/*.*', batch(function(events,done){gulp.start('sass:dev', done); gulp.start('sass:build', done);}));
  watch(dirIn + 'js/**/*.*', batch(function(events,done){gulp.start('js', done);}));
});
