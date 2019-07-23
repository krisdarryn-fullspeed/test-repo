var gulp = require('gulp'),
   sass = require('gulp-ruby-sass'),
   autoprefixer = require('gulp-autoprefixer'),
   cssnano = require('gulp-cssnano'),
   jshint = require('gulp-jshint'),
   uglify = require('gulp-uglify'),
   imagemin = require('gulp-imagemin'),
   rename = require('gulp-rename'),
   concat = require('gulp-concat'),
   notify = require('gulp-notify'),
   cache = require('gulp-cache'),
   livereload = require('gulp-livereload'),
   del = require('del'),
   gutil = require('gulp-util')
   changed = require('gulp-changed'),
   sourcemaps = require('gulp-sourcemaps'),
   merge = require('merge-stream'),
   newer = require('gulp-newer');
   
var manifest = require('asset-builder')('./manifest.json'); 
var manifestGlobs = manifest.globs;

// Set environment
gutil.env.type = 'development';

/**
 * CSS automation task
 *
 * @param JSON dep
 * @return JSON
 */
var cssTask = (dep) => {
   var process =  sass(dep.globs, { style: 'expanded', verbose: false })
                     .on('error', sass.logError)
                  .pipe(changed(manifest.paths.dist + 'styles'))
                  .pipe(autoprefixer('last 2 version'))
                  .pipe(concat(dep.name))
      
   // Add additional configuration if env = production
   if (gutil.env.type === 'production') {
      process.pipe(rename({suffix: '.min'}))
             .pipe(cssnano());
   } 
   
   return process.pipe(gulp.dest(manifest.paths.dist + 'styles'))
                 .pipe(notify({ message: 'Styles ' + dep.name + ' task complete' }));
};

/**
 * Styles libraries task
 */
gulp.task('libStyles', function() {
   cssTask(manifest.getDependencyByName('lib1.css'));
   
   var lib2 = manifest.getDependencyByName('lib2.css');
   
   return gulp.src(lib2.globs)
              .pipe(changed(manifest.paths.dist + 'styles'))
              .pipe(autoprefixer('last 2 version'))
              .pipe(concat(lib2.name))
              .pipe(gulp.dest(manifest.paths.dist + 'styles'))
              .pipe(notify({ message: 'Styles ' + lib2.name + ' task complete' }));
});

/**
 * Custom Styles task
 */
gulp.task('customStyles', function() {
   var merged = merge();
   
   manifest.forEachDependency('css', function(dep) {
      
      if ((dep.name !== 'lib1.css') && (dep.name !== 'lib2.css')) {
         merged.add(cssTask(dep));
      }
      
   });
   
   return merged;
});

/**
 * Sass watch
 */
gulp.task('watch-styles', function() {
   gulp.watch('sass/**/*.scss', ['customStyles']);
});

/**
 * Script task automation
 * 
 * @param JSON dep
 * @return JSON
 */
var jsTask = (dep) => {
   var process = gulp.src(dep.globs, {base: 'scripts'})
                     //.pipe( (gutil.env.type === 'production' ? sourcemaps.init() : gutil.noop()) )
                     .pipe(changed(manifest.paths.dist + 'scripts'))
                     .pipe(newer(manifest.paths.dist + 'scripts'))
                     .pipe(concat(dep.name))
                     .pipe(jshint())
                     .pipe(jshint.reporter('jshint-stylish'));

   // Add additional configuration if env = production
   if (gutil.env.type === 'production') {
      process.pipe(uglify())
             //.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: './styles/'}));
   }
   
   return process.pipe(concat(dep.name))
                 .pipe(gulp.dest(manifest.paths.dist + 'scripts'))
                 .pipe(notify({ message: 'Script "' + dep.name + '" task complete.' }));
};

/**
 * JS Library task
 */
gulp.task('libScripts', function() {
   return jsTask(manifest.getDependencyByName('lib.js'));              
});

/**
 * Custom JS task
 */
gulp.task('customScripts', function() {
   var merged = merge();
   
   manifest.forEachDependency('js', function(dep) {
      
      if (dep.name !== 'lib.js') {
         merged.add(jsTask(dep));
      }
      
   });
   
   return merged;
});

/**
 * JS watch 
 */
gulp.task('watch-scripts', function() {
   gulp.watch('scripts/**/*', ['customScripts'])
});

/**
 * Font task
 */
gulp.task('fonts', function() {
   return gulp.src(manifestGlobs.fonts)
         //.pipe(changed(manifest.paths.dist + 'fonts'))
         .pipe(newer(manifest.paths.dist + 'fonts'))
         .pipe(gulp.dest(manifest.paths.dist + 'fonts'))
         .pipe(notify({ message: 'Font task complete' }));
});

/**
 * Image task
 */
gulp.task('images', function() {
   return gulp.src(manifestGlobs.images)
         //.pipe(changed(manifest.paths.dist + 'images'))
         .pipe(newer(manifest.paths.dist + 'images'))
         .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
         .pipe(gulp.dest(manifest.paths.dist + 'images'))
         .pipe(notify({ message: 'Image task complete' }));
});

gulp.task('ckeditor', function() {
    return gulp.src('bower_components/ckeditor/**/*')
          .pipe(gulp.dest(manifest.paths.dist + 'ckeditor'));
});

/**
 * Default automation
 * Runs fonts, scritps and stlyes task
 */
gulp.task('default', ['clean'], function() {
   gulp.start('fonts', 'images', 'libScripts', 'libStyles', 'customScripts', 'customStyles');
});

/**
 * Clean generated directories and files
 */
gulp.task('clean', function() {
   return del(
      [
         '../../public/backend/fonts', 
         '../../public/backend/images', 
         '../../public/backend/styles', 
         '../../public/backend/scripts'
      ], 
      {
         force: true
      }
   );
});