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
var dirIn = "src/";
var localServer = "F:/server/xampp/htdocs/drupal/themes/custom/bluerain"
const pkg = require("./package.json");
var banner = ['/**',
  ' * @name <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('sass:dev', function(done){
  gulp.src(dirIn + 'style/scss/*.scss')
    .pipe(smap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(smap.write('.'))
    .pipe(gulp.dest(dirIn + 'style/css/'));
  done();
});
gulp.task('sass:build', function(done){
  gulp.src(dirIn + 'style/scss/*.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirOut + 'style/css'));
  done();
});
gulp.task('sass', gulp.parallel('sass:build', 'sass:dev'));
gulp.task('js', function(done){
  gulp.src(dirIn + 'js/*.js')
    .pipe(gulp.dest(dirOut + 'js'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirOut + 'js'));
  done();
});
gulp.task('root-folder', function(done){
  gulp.src([dirIn + '*.*', dirIn + '.prod.*.*'])
    .pipe(rename(function(opt){
      opt.basename = opt.basename.replace(/^\.prod\./,'');
      return opt;
    }))
    .pipe(gulp.dest(dirOut));
    done();
});
gulp.task('dependencies', function(done){
  gulp.src(dirIn + 'dependencies/**/*.*')
    .pipe(gulp.dest(dirOut + 'dependencies'));
    done();
});
gulp.task('style', gulp.series('sass', function(done){
  gulp.src(dirIn + 'style/**/*.*')
    .pipe(gulp.dest(dirOut + 'style'));
  done();
}));
gulp.task('templates', function(done){
  gulp.src(dirIn + 'templates/**/*.*')
    .pipe(gulp.dest(dirOut + 'templates'));
  done();
});
gulp.task('build', gulp.series(gulp.parallel('js', 'root-folder', 'dependencies', 'style', 'templates'), function(done){
  gulp.src([dirOut + '**/*@(js|scss|css|min.css)', '!**/dependencies/**/*.*',])
    .pipe(header(banner, {pkg:pkg}))
    .pipe(gulp.dest(dirOut));
  done();
}));
gulp.task('deploy:full', function(done){
  gulp.src(dirOut + '**/*.*', { base: 'build'})
    .pipe(zip('tmpl_bluerain.zip'))
    .pipe(gulp.dest('build/'));
  done();
});
gulp.task('deploy:min', function(done){
  gulp.src([dirOut + '*.*', dirOut + 'dependencies/**/*.*', dirOut + '!dependencies/**/*.scss', dirOut + 'js/**/*.min.js', dirOut + 'style/**/*.min.css', dirOut + 'templates/**/*.*'], {base: 'build'})
    .pipe(zip('tmpl_bluerain.min.zip'))
    .pipe(gulp.dest('build/'));
  done();
});
gulp.task('deploy', gulp.parallel('deploy:full', 'deploy:min'));
gulp.task('push:dev', function(done){
  gulp.src([dirIn + '**/*.*', dirIn + '.dev.*.*'])
  .pipe(rename(function(opt){
    opt.basename = opt.basename.replace(/^\.dev\./,'');
    return opt;
  }))
  .pipe(gulp.dest(localServer));
  done();
});
gulp.task('push:min', function(done){
  gulp.src([dirOut + '*.*', dirOut + 'dependencies/**/*.*', dirOut + '!dependencies/**/*.scss', dirOut + 'js/**/*.min.js', dirOut + 'style/**/*.min.css', dirOut + 'templates/**/*.*'], {base: 'build'})
  .pipe(gulp.dest(localServer));
  done();
});
gulp.task('watch', function(done){
  gulp.watch(dirIn + 'style/scss/**/*.*', gulp.series('sass:dev', 'push:dev'));
  gulp.watch(dirIn + 'js/**/*.*', gulp.series('js', 'push:dev'));
  gulp.watch([dirIn + 'templates/**/*.*', dirIn + '*.*'], gulp.task('push:dev'));
  done();
});
