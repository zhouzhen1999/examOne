let gulp = require("gulp");

let sass = require("gulp-sass");

let webserver = require("gulp-webserver");

let bCss = require("gulp-clean-css");

let bHtml = require("gulp-minhtml");

let js = require("gulp-uglify");

let concat = require("gulp-concat");


//编译scss
gulp.task("css", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
})