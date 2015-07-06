var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var gulp = require('gulp'); 
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');

gulp.task('browser-sync-dev', function(){
	browserSync({
		// server:{
		// 	baseDir:"./build"
		// }
		proxy: "localhost:3000"
	});
	gulp.watch('css/*.less', ['less-dev']);
	gulp.watch('js/*.js', ['scripts']);
	gulp.watch("*.html").on('change', reload);
	
});

gulp.task('less-dev', function() {
    return gulp.src('css/main.less')
    	.pipe(plumber())
        .pipe(less())
		.pipe(autoprefixer({
			cascade: true
		}))
        .pipe(gulp.dest('public/css'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src(['js/libs/*.js','js/*.js'])
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(gulp.dest('public/js/'))
	.pipe(reload({stream: true}));
});

gulp.task('default',['browser-sync-dev']);