const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const pleeease = require('gulp-pleeease');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const imgMin = require('gulp-imagemin');
const jpgMin = require('imagemin-mozjpeg');
const pngMin = require('imagemin-optipng');
const gifMin = require('imagemin-gifsicle');
const svgMin = require('gulp-svgmin');
const browserSync = require('browser-sync');
const process = require('process');
const notifier = require('node-notifier');
const pug = require('gulp-pug');


// setting
const assets_dir = {
    css: 'assets/css/',
    js: 'assets/js/',
    img: 'assets/img/',
    root: './assets/'
};
const src_file = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/img/**/*.+(jpg|jpeg|png|gif)',
    svg: 'src/img/**/*.svg',
    pug: '**/*.pug'
};


// task
function exit(done){
    process.exit(0);
    done();
}
exports.task = exit;

const errorHandler = function(error) {
    console.log(error.message);
    notifier.notify({
        message: 'Putted the error in the log',
        title: 'ERROR!',
        appIcon: './err_icon.jpeg'
    });
    // gulp.task(exit);
};

function pug_compile(){
    return gulp
        .src(src_file.pug)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(pug())
        .pipe(gulp.dest('./'));
}
exports.task = pug_compile;

function sass_compile(){
    return gulp
        .src(src_file.scss)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(sass())
        .pipe(pleeease())
        .pipe(autoprefixer())
        .pipe(gulp.dest(assets_dir.css));
}
exports.task = sass_compile;

function js_min(){
    return gulp
        .src(src_file.js)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(uglify())
        .pipe(gulp.dest(assets_dir.js));
}
exports.task = js_min;

function img_min(){
    return gulp
        .src(src_file.img)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(imgMin([
            jpgMin(),
            pngMin(),
            gifMin({
                optimizationLevel: 3
            })
        ]))
        .pipe(gulp.dest(assets_dir.img));
}
function svg_min(){
    return gulp
        .src(src_file.svg)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(svgMin())
        .pipe(gulp.dest(assets_dir.img));
}
exports.task = img_min;
exports.task = svg_min; 

function serve(done) {
    browserSync.init({
        // ローカルサーバー
        server: {
            baseDir: './'
        },
        port: 3000

        // プロキシ指定
        // proxy: 'http://●●/',
        // Host: '●●.com',
        // open: 'external'
    });
    done();
}
exports.task = serve;

function reload(done){
    browserSync.reload();
    done();
}
exports.task = reload;

function watch(done){
    gulp.watch(src_file.pug, gulp.task(pug_compile));
    gulp.watch(src_file.scss, gulp.task(sass_compile));
    gulp.watch(src_file.js, gulp.task(js_min));
    gulp.watch(src_file.img, gulp.task(img_min));
    gulp.watch(src_file.svg, gulp.task(svg_min));
    gulp.watch(['assets/**/*', '**/*.html'], gulp.task(reload));
    done();
}
exports.task = watch;

// default
gulp.task('default', gulp.series(serve, watch));