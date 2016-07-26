var gulp = require('gulp');
gulpHtmlVersion = require('../index');

gulp.task('default', function() {
    return gulp.src('./example.html')
        .pipe(gulpHtmlVersion({
            paramType: 'guid'
        }))
        .pipe(gulp.dest('./build/'));
});
