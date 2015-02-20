var gulp = require('gulp')
	, jshint = require('gulp-jshint')
	, jshintReporter = require('jshint-stylish')
  , nodemon = require('gulp-nodemon')
	, watch = require('gulp-watch');

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']
};


// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));

});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// auto restart
gulp.task('develop', function () {
  nodemon({ 
    script: 'keystone.js', 
    ext: 'js'
  })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    });
});
