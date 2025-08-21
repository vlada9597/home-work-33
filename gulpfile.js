const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

// Шлях до файлів
const files = {
  scssPath: "scss/**/*.scss",
  htmlPath: "*.html",
  jsPath: "*.js"
};

// Компіляція SCSS → CSS
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("css"))
    .pipe(browserSync.stream());
}

// Сервер і LiveReload
function serveTask() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  watch(files.scssPath, scssTask);
  watch([files.htmlPath, files.jsPath]).on("change", browserSync.reload);
}

exports.default = series(
  scssTask,
  serveTask
);
