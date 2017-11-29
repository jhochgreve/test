//utils
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const rename = require('gulp-rename');

//css
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

//babel + browserify
const babel = require('gulp-babel');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const image = require('gulp-image');


gulp.task('default', ['sass', 'babel', 'image'], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['babel']);
    gulp.watch('./src/images/*', ['image']);
});

gulp.task('sass', () => {
    const plugins = [
        autoprefixer({browsers: ['last 2 versions']}), cssnano(),
        require('postcss-normalize')({
            browsers: 'last 2 versions',
            forceImport: true
        })
    ];
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('image', function () {
    gulp.src('./src/images/*')
      .pipe(image())
      .pipe(gulp.dest('./dist/images'));
  });


gulp.task('babel', function() {
    browserify({
        entries: './src/js/main.js',
        debug: true
    })
    .transform(babelify, { presets: ['env'] })
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});