var gulp = require('gulp');
gulpHtmlVersion = require('../index');

gulp.task('default', function() {
    return gulp.src('./*.html')
        .pipe(gulpHtmlVersion())
        .pipe(gulp.dest('./build/'));
});
