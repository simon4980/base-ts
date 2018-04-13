var gulp = require('gulp');
var browserify = require('browserify');
// var watchify = require("watchify");
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var gutil = require("gulp-util");
var connect = require('gulp-connect');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');

var scsslocation = 'src/scss/*.scss';
var imglocation = 'src/img/**/*';

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/typescript/app.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));


function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload())
        .pipe(notify({ message: 'Typescript task complete' }));
}
// Live server reload
gulp.task('connect', function() {
    connect.server({
      root: 'dist/.',
      livereload: true
    })
});

gulp.task('test', function(){
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/typescript/app.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload())
    .pipe(notify({ message: 'Typescript task complete' }));
});

// Styles
gulp.task('styles', function() {
    return sass(scsslocation, { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
    .pipe(notify({ message: 'Styles task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src(imglocation)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/img/'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'Images task complete' }));
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch(scsslocation, ['styles']);
    // Watch image files
    gulp.watch(imglocation, ['images']);

    gulp.watch('src/typescript/**/*.ts', ['test']);

});

gulp.task("default", ['styles', 'connect', 'images', 'test', 'watch']);