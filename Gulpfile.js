var browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html'),
    minimist = require('minimist'),
    pngcrush = require('imagemin-pngcrush'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    uglify = require('gulp-uglify'),
    wait = require('gulp-wait'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    summary = require('jshint-summary'),
    transform = require('vinyl-transform'),
    rename = require('gulp-rename'),
    plugins = require('gulp-load-plugins')();

var config = {
    filepath: {
        js:     ['./app/js/**/*.js'],
        scss:   ['./app/css/**/*.scss'],
        img:    ['./app/assets/img/**/*.*'],
        font:   ['./app/assets/fonts/**/*.*'],
        html:   ['./app/js/**/*.html'],
        data:   ['./app/assets/data/**/*.*']
    },
    mainfile: {
        js: './app/js/app.js',
        scss: './app/css/app.scss'
    },
    dist: {
        path: './dist/',
        js: './dist/js'
    },
    buildAssets: [
        './app/js/**/*',
        './app/css/**/*',
        './app/assets/img/**/*'
    ]
};

var defaultOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
};

var argv = minimist(process.argv.slice(2), defaultOptions);

gulp.task('lint', function()
{
    return gulp.src(config.filepath.js)
        .pipe(plugins.plumber())
        .pipe(plugins.cached('lint'))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-summary'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.remember('lint'));
});

gulp.task('script', ['lint'], function () {

    var b = browserify({
        entries: './app/js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist.js));
});

// Build CSS
gulp.task('sass', function () {
    return gulp.src(config.mainfile.scss)
        .pipe(plugins.plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.dist.path + 'css'));
});

// Publish Fonts
gulp.task('fonts', function () {
    return gulp.src('./app/assets/fonts/**/*.*')
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist.path + 'fonts'));
});

gulp.task('json', function () {
    return gulp.src('./app/assets/data/**/*.*')
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist.path + 'data'));
});

gulp.task('images', function () {
    return gulp.src(config.filepath.img)
        .pipe(plugins.plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(config.dist.path + 'img'));
});

gulp.task('html', function () {
    return gulp.src(config.filepath.html)
        .pipe(minifyHTML())
        .pipe(gulp.dest(config.dist.path + 'template'));
});


// Setup watchers - Republish to both patternlab and website
gulp.task('watch', function () {
    gulp.watch(config.filepath.font, ['fonts']);
    gulp.watch(config.filepath.data, ['json']);
    gulp.watch(config.filepath.js, ['script']);
    gulp.watch(config.filepath.img, ['images']);
    gulp.watch(config.filepath.scss, ['sass']);
    gulp.watch(config.filepath.html, ['html']);
});

gulp.task('clean', function () {
    del.sync(config.dist, {force: true});
});

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('default', function (callBack) {
    runSequence('html', 'fonts', 'json', 'script', 'sass', 'images', 'watch', callBack);
});

// Publish to Web Gulp Task
gulp.task('publish', function (callBack) {
    runSequence('html', 'fonts', 'json', 'script', 'sass', 'images', callBack);
});
