var gulp = require('gulp'),
    //settings  = require('./settings.json'),
    fs        = require('fs'),
    arg       = require('yargs').argv,
    include   = require('gulp-include'),
    minifyJS  = require('gulp-minify'),
    stylus    = require('gulp-stylus'),
    prefixer  = require('gulp-autoprefixer'),
    jade      = require('gulp-jade'),
    coffee    = require('gulp-coffee'),
    gulpif    = require('gulp-if'),
    image     = require('gulp-image'),
    rename    = require('gulp-rename');

var bannerName = arg.l.replace(/.+?([^\/]+)\/?$/i, '$1') || '';
var srcPath = 'banners/'+ bannerName +'/src/';

function getBannerName(path) {
    var match = path.match(/.+?\/([^\/]+)\/?$/);
    return match ? match[1] : match[0];
}

gulp.task('page', ['page-styles'], function() {
    var bannerName = getBannerName(arg.l);
    var banner = false;

    try {
        banner = fs.readFileSync('banners/'+ bannerName + '.html', 'utf8');
    } catch(e) {
        console.error(e);
    }

    return gulp.src('page/tpl/index.jade')
        .pipe(jade({
            pretty: '    ',
            locals: {
                __banner: banner
            }
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('.'));
});

gulp.task('page-styles', function() {
    return gulp.src('page/css/index.styl')
        .pipe(stylus({
            'include css': true,
            'compress'   : true,
            'rawDefine': {
                'inline-image': stylus.stylus.url()
            }
        }))
        .pipe(prefixer(['> 0%']))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('static'));
});

gulp.task('banner', ['banner-images', 'banner-styles', 'banner-scripts'], function() {
    var bannerName = getBannerName(arg.l);
    var rootDir = process.cwd();
    var styles = false;
    var scripts = false;

    try {
        styles = fs.readFileSync('banners/' + bannerName + '/.tmp/styles.css', 'utf8');
    } catch(e) {}

    try {
        scripts = fs.readFileSync('banners/' + bannerName + '/.tmp/scripts.js', 'utf8');
    } catch(e) {}

    if (bannerName) {
        return gulp.src('banners/' + bannerName + '/tpl/index.jade')
            .pipe(jade({
                pretty: '    ',
                locals: {
                    __styles: styles,
                    __scripts: scripts
                }
            }))
            .pipe(rename(bannerName + '.html'))
            .pipe(gulp.dest('banners/'));
    }
});

gulp.task('banner-images', function() {
    var bannerName = getBannerName(arg.l);

    gulp.src('banners/'+ bannerName +'/imgs/*.*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: false,
            jpegRecompress: false,
            jpegoptim: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10            
        }))
        .pipe(gulp.dest('static/imgs/' + bannerName))
});

gulp.task('banner-styles', function() {
    var bannerName = getBannerName(arg.l);
   
    return gulp.src('banners/'+ bannerName +'/css/index.styl')
        .pipe(stylus({
            'include css': true,
            'compress'   : true,
            'rawDefine': {
                'inline-image': stylus.stylus.url()
            }
        }))
        .pipe(prefixer(['> 0%']))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('banners/'+ bannerName +'/.tmp/'));    
});

gulp.task('banner-scripts', function() {
    var bannerName = getBannerName(arg.l);

    return gulp.src('banners/'+ bannerName +'/js/index.coffee')
        .pipe(include())
        .pipe(coffee({bare: true}).on('error', console.log))
        .pipe(minifyJS({ compress: true, noSource: true }))
        .pipe(rename('scripts.js'))
        .pipe(gulp.dest('banners/'+ bannerName +'/.tmp/'));
});

gulp.task('default', ['banner', 'page'], function() {
    var bannerName = getBannerName(arg.l);
    gulp.watch(['page/**/*.*', 'banners/'+ bannerName +'/**/*.*'], ['banner', 'page']);
});
