let gulp = require("gulp");

let sass = require("gulp-sass");

let server = require("gulp-webserver");

let bCss = require("gulp-clean-css");

let bHtml = require("gulp-htmlmin");

let js = require("gulp-uglify");

let concat = require("gulp-concat");

let url = require("url");

let path = require("path");

let fs = require("fs");

let babel = require("gulp-babel");

let mock = require("./src/mock/data.json");
//编译scss
gulp.task("css", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(bCss())
        .pipe(concat("all.css"))
        .pipe(gulp.dest("./src/css"))
})

//监听css
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("css"))
})

//起服务
gulp.task('webserver', function() {
    gulp.src('src')
        .pipe(server({
            port: 9009,
            middleware: function(req, res, next) {
                let pathname = url.parse(req.url).pathname;
                if (pathname == "/favicon.ico") {
                    res.end("");
                    return;
                } else if (pathname == "/api/data") {
                    res.end(JSON.stringify({ code: 0, datas: mock }))
                } else if (pathname == "/api/list") {
                    let querystring = require("querystring");
                    var chunkStr = "";
                    req.on("data", function(chunk) {
                        chunkStr += chunk
                    })

                    req.on("end", function() {
                        var params = querystring.parse(chunkStr);
                        params.time = new Date().toLocaleString();
                        params.id = mock.length + 1;
                        mock.unshift(params);
                        fs.writeFileSync("./src/mock/data.json", JSON.stringify(mock));
                        res.end(JSON.stringify({ code: 0, msg: "上传成功" }))
                    })
                } else {
                    pathname = pathname == "/" ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)));
                }
            }
        }));
});


gulp.task("dev", gulp.series("css", "webserver", "watch"))


gulp.task("bCss", function() {
    return gulp.src("./src/css/*.css")
        .pipe(gulp.dest("./bulid/css"))
})


gulp.task("bHtml", function() {
    return gulp.src("./src/index.html")
        .pipe(bHtml({ collapseWhitespace: true }))
        .pipe(gulp.dest("./bulid"))
})


gulp.task("bJs", function() {
    return gulp.src("./src/js/*.js", "!./src/js/libs")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(js())
        .pipe(gulp.dest("./bulid/js"))
})


gulp.task("default", gulp.series("bCss", "bHtml", "bJs"))