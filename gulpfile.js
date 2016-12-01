var gulp = require('gulp'),
    //settings  = require('./settings.json'),
    arg       = require('yargs').argv,
    include   = require('gulp-include'),
    minifyJS  = require('gulp-minify'),
    stylus    = require('gulp-stylus'),
    prefixer  = require('gulp-autoprefixer'),
    jade      = require('gulp-jade'),
    coffee    = require('gulp-coffee'),
    gulpif    = require('gulp-if'),
    rename    = require('gulp-rename');

var bannerName = arg.l.replace(/.+?([^\/]+)\/?$/i, '$1') || '';
var srcPath = 'banners/'+ bannerName +'/src/';

gulp.task('styles', function() {
    return gulp.src(srcPath +'css/index.styl')
        .pipe(stylus({
            'include css': true,
            'compress'   : true
        }))
        .pipe(prefixer(['> 0%']))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(srcPath +'.tmp/'));
});

gulp.task('scripts', function() {
    return gulp.src(srcPath +'js/index.coffee')
        .pipe(include())
        .pipe(coffee({bare: true}).on('error', console.log))
        .pipe(minifyJS({ compress: true, noSource: true }))
        .pipe(rename('scripts.js'))
        .pipe(gulp.dest(srcPath +'.tmp/'));
});

gulp.task('tpl', ['styles', 'scripts'], function() {
    return gulp.src(srcPath + 'tpl/index.jade')
        .pipe(jade({
            pretty: '    '
        }))
        .pipe(rename({extname:'.html'}))
        .pipe(gulp.dest(srcPath));
});

gulp.task('default', ['main'], function() {
    console.log(bannerName + ' start');
    if (bannerName) {
        gulp.watch('banners/'+ bannerName +'/**/*.*', ['main']);
    }
    else {
        console.warning('Пожалуйста укажите параметр -l');
        return;
    }
});

gulp.task('main', ['tpl'], function() {
    console.log(bannerName + ' собран');
});