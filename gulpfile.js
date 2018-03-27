// 1) Gulp.js configuration
'use strict';

/*******************************************************/

// 2) Set up
const

  // Source and build folders
  dir = {
    src         : 'dev-boneus/',
    build       : 'C:/xampp/htdocs/sites/wordpress-sites/wp-gulp-1/wp-content/themes/boneus/'
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  newer         = require('gulp-newer'),
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  sourcemaps    = require('gulp-sourcemaps'),
  postcss       = require('gulp-postcss'),
  autoprefixer       = require('autoprefixer'),
  cssnano       = require('cssnano'), 
  cssmqpacker   = require('css-mqpacker'),
  browser_sync   = require('browser-sync'),
  deporder      = require('gulp-deporder'),
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),
  cache         = require('gulp-cache'),
  path          = require('path'),
  del           = require('del'),
  runSequence   = require('run-sequence')
;

// Browser-sync
var browsersync = false;

/*******************************************************/


// 3) PHP settings (command: gulp php)
const php = {
  src           : dir.src + '**/*.php',
  build         : dir.build 
};

// copy PHP files
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build));
});

/*******************************************************/

// 4) image settings (command: gulp images)
const images = {
  src         : dir.src + 'library/images/**/*',
  build       : dir.build + 'library/images/'
};

// image processing
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(images.build));
});

/*******************************************************/

// 5) CSS settings (command: gulp css) 
const css = {
  src         : dir.src + 'library/scss/*.scss',
  build       : dir.build + 'library/css/',

  sassOpts: {
    precision       : 3,
    errLogToConsole : true
  },

  processors: [
    autoprefixer({
      browsers: ['last 2 versions', '> 2%']
    }),
    cssmqpacker,
    cssnano
  ]

};

gulp.task('css', () => {
  return gulp.src(css.src)
    .pipe(sourcemaps.init())
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(css.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
});


/*******************************************************/

// 6) JavaScript settings (command: gulp js)
const js = {
  src         : dir.src + 'library/js/**/*',
  build       : dir.build + 'library/js/',
  filename    : 'scripts.js'
};

// JavaScript processing
gulp.task('js', () => {

  return gulp.src(js.src)
    .pipe(deporder())
    .pipe(concat(js.filename))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest(js.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());

});

/*******************************************************/

// 7) Copy tasks: 

// a) to theme root (command: gulp copyroot)
const copyroot = {
  src : {
    /* 
      style.css just makes the theme available to Worpdress theme dashboard - the actual
      styling takes place in css/styles.css 
    */   
    themestyle: dir.src + 'style.css',
    /* 
      If you want image icons (favicon.png, apple touch icons etc) to be processed by imagemin put them in the images folder
    */
    themereadmemd: dir.src + 'readme.md',
    themechangelogmd: dir.src + 'CHANGELOG.md',
    themegitignore: dir.src + '.gitignore',
    themegitattributes: dir.src + '.gitattributes',
    themeico: dir.src + 'favicon.ico',
    themescreenshot: dir.src + 'screenshot.png',
  },

  build : dir.build
};

gulp.task('copyroot', () => {
   return gulp.src(
    [
      copyroot.src.themestyle, 
      copyroot.src.themereadmemd,
      copyroot.src.themechangelogmd,
      copyroot.src.themegitignore,
      copyroot.src.themegitattributes,
      copyroot.src.themeico, 
      copyroot.src.themescreenshot,
    ])
    .pipe(gulp.dest(copyroot.build));
});


// b) to library/translation (command: gulp copytranslation)
const copytranslation = {
  src :  dir.src + 'library/translation/**/*',
  build : dir.build + 'library/translation/'
};

gulp.task('copytranslation', () => {
   return gulp.src(copytranslation.src)
    .pipe(gulp.dest(copytranslation.build));
});


// c) to library/vendor (command: gulp copyvendor)
const copyvendor = {
  src :  dir.src + 'library/vendor/**/*',
  build : dir.build + 'library/vendor/'
};

gulp.task('copyvendor', () => {
   return gulp.src(copyvendor.src)
    .pipe(gulp.dest(copyvendor.build));
});


/*******************************************************/

// 8) Delete build directory (command: gulp clean:dirbuild)
gulp.task('clean:dirbuild', function() {
  // If build directory is outside the working folder:
  return del.sync(dir.build, {force: true});
  // If inside:
  // return del.sync(dir.build);
});


/*******************************************************/

// 9) Clear caches from local system (command: gulp cache:clear)
// This is a standalone task (not incorporated into build, watch or default)
gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
});

/*******************************************************/

// 10) Build task (command: gulp build)
// gulp.task('build', ['php', 'css', 'js', 'copyroot', 'copytranslation']);

gulp.task('build', function (callback) {
  runSequence('clean:dirbuild', 
    ['php', 'css', 'js', 'images', 'copyroot', 'copytranslation', 'copyvendor'],
    callback
  )
});


/*******************************************************/

// 11) Browsersync (command: browsersync)
const syncOpts = {
  proxy       : 'http://localhost/sites/wordpress-sites/wp-gulp-1/',
  files       : dir.build + '**/*',
  open        : 'local',
  /*
    You can add more browsers as required e.g. ['chrome', 'firefox'].
    If you do you should change some or all of ghostMode options to 'true'.
  */
  browser     : ['chrome'], 

  // set this to 'true' if you want a message in browser whenever files update 
  notify      : false, 

  // Very useful if you're comparing across multiple browsers
  ghostMode   : {
      clicks: false, // 'true' : Clicks occur simultaneously when multiple browsers are open
      forms: false,  // 'true' : Form fields and button clicks occur in multiple browsers
      scroll: false, // 'true' : All synched browsers scroll simultaneously
  },  
  ui          : { port: 8001 },
};


// browser-sync task ()
gulp.task('browsersync', () => {
  if (browsersync === false) {
    // browsersync = require('browser-sync').create();
    browsersync = browser_sync.create();
    browsersync.init(syncOpts);
  }
});

/*******************************************************/

// 12) Watch for file changes (command: watch)
gulp.task('watch', ['browsersync'], () => {

  // page changes
  var watcherPHP = gulp.watch(php.src, ['php'], browsersync ? browsersync.reload : {});

  watcherPHP.on('change', function (event) {
    if (event.type === 'deleted') {
      
      var filePathFromSrc = path.relative(path.resolve(dir.src), event.path);
      var destFilePath = path.resolve(dir.build, filePathFromSrc);

      // If build directory is outside the working folder:
      del.sync(destFilePath, {force: true});
      // If inside:
      // del.sync(destFilePath);
    }
  });  

  // image changes
  var watcherImages = gulp.watch(images.src, ['images']);

  watcherImages.on('change', function (event) {
    if (event.type === 'deleted') {
      
      var filePathFromSrc = path.relative(path.resolve(dir.src), event.path);
      var destFilePath = path.resolve(dir.build, filePathFromSrc);

      // If build directory is outside the working folder:
      del.sync(destFilePath, {force: true});
      // If inside:
      // del.sync(destFilePath);
    }
  });


  // CSS changes - no 'watcherCSS' for this as you never touch the css files in dev-boneus/library
  gulp.watch(css.src, ['css']);

  // Watch for deleted files in copyroot
  var watcherCopyRoot = gulp.watch([
      copyroot.src.themestyle, 
      copyroot.src.themereadmemd,
      copyroot.src.themechangelogmd,
      copyroot.src.themegitignore,
      copyroot.src.themegitattributes,
      copyroot.src.themeico, 
      copyroot.src.themescreenshot,
    ], ['copyroot']);
    watcherCopyRoot.on('change', function (event) {
    if (event.type === 'deleted') {
      
      var filePathFromSrc = path.relative(path.resolve(dir.src), event.path);
      var destFilePath = path.resolve(dir.build, filePathFromSrc);

      // If build directory is outside the working folder:
      del.sync(destFilePath, {force: true});
      // If inside:
      // del.sync(destFilePath);
    }
  });

  // Watch for deleted files in copytranslation
  var watcherCopyTranslation = gulp.watch(copytranslation.src, ['copytranslation']);
  watcherCopyTranslation.on('change', function (event) {
    if (event.type === 'deleted') {
      
      var filePathFromSrc = path.relative(path.resolve(dir.src), event.path);
      var destFilePath = path.resolve(dir.build, filePathFromSrc);

      // If build directory is outside the working folder:
      del.sync(destFilePath, {force: true});
      // If inside:
      // del.sync(destFilePath);
    }
  });

  // Watch for deleted files in copyvendor
  var watcherCopyVendor = gulp.watch(copyvendor.src, ['copyvendor']);
  watcherCopyVendor.on('change', function (event) {
    if (event.type === 'deleted') {
      
      var filePathFromSrc = path.relative(path.resolve(dir.src), event.path);
      var destFilePath = path.resolve(dir.build, filePathFromSrc);

      // If build directory is outside the working folder:
      del.sync(destFilePath, {force: true});
      // If inside:
      // del.sync(destFilePath);
    }
  });

  // JavaScript main changes
  var watcherJS = gulp.watch(js.src, ['js']);
  watcherJS.on('change', function (event) {
    if (event.type === 'deleted') {
      
      var filePathFromSrc = path.relative(path.resolve(dir.src), event.path);
      var destFilePath = path.resolve(dir.build, filePathFromSrc);

      // If build directory is outside the working folder:
      del.sync(destFilePath, {force: true});
      // If inside:
      // del.sync(destFilePath);
    }
  });
});

// 13) default task - combine build and watch (command: gulp)

gulp.task('default', function (callback) {
  runSequence('build', ['watch'], callback)
});

