// declare the gulp dependency 
const gulp = require('gulp');

// set up js-hint
const jshint = require('gulp-jshint');

// our task
gulp.task('jshint', () => {
    // run the gulp task on our script file
    return gulp.src('script.js')
        // telling gulp that we are using JavaScript version es6
        // .pipe is like a .then
        .pipe(jshint({ "esversion": 6 }))
        // plug in the styles we downloaded from npm (stylish reporter)
        .pipe(jshint.reporter('jshint-stylish'))
});

// our new task
// Sass - lint
const sassLint = require('gulp-sass-lint');

gulp.task('sass-lint', () => {
    return gulp.src('styles.scss')
        // run sass lint
        .pipe(sassLint())
        // tell sass lint to format your sass
        .pipe(sassLint.format())
        // tells sass lint to stop if there is an error
        .pipe(sassLint.failOnError())
})

// set up a watch task. watching our files on 
// save will auto run our tasks on save

const { watch } = require('gulp');

gulp.task('watch', () => {
    gulp.watch('*.js', gulp.series('jshint')),
        gulp.watch('styles.scss', gulp.series('sass-lint'))
})

// gulp.watch('css/**/*.scss', gulp.series('sass-lint')) to go inside the gulp.tasl('watch').....
// plugin the css folder and then leave two trailing asterix, two astrixs are known as wildcards
// two asterixs indicates a directory
// one asterix indicates a file