var gulp = require('gulp');
var browserify = require('browserify');
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
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var inlinesource = require('gulp-inline-source');

var scsslocation = 'src/scss/*.scss';
var imglocation = 'src/img/**/*';

// Bundle TS files
function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload());
}

// Live server reload
gulp.task('connect', function() {
    connect.server({
      root: 'dist/.',
      livereload: true
    })
});

gulp.task('typescript', function(){
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
    .pipe(gulp.dest("dist/js"));
});

// Styles
gulp.task('styles', function() {
    return sass(scsslocation, { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

// Images
gulp.task('images', function() {
    return gulp.src(imglocation)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/img/'))
        .pipe(connect.reload());
});

// Copy html file from src/html to dist/
gulp.task("copy-html", ['styles', 'typescript'], function () {
    return gulp.src('src/html/*.html')
        .pipe(inlinesource({rootpath: 'dist/'}))
        .pipe(gulp.dest("dist"))
        .pipe(connect.reload());
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch(scsslocation, ['styles', 'copy-html']);
    // Watch image files
    gulp.watch(imglocation, ['images']);
    // Watch typescript files
    gulp.watch('src/typescript/**/*.ts', ['typescript', 'copy-html']);
    // Watch html files
    gulp.watch('src/html/*.html', ['copy-html']);
});

gulp.task("default", ['styles', 'connect', 'images', 'typescript', 'copy-html', 'watch']);

