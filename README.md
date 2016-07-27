# gulp-html-version

gulp 插件，避免版本差异缓存，自动添加 css、js 版本号


## 安装

    npm install gulp-html-version --save-dev


## 使用

gulpfile.js:

```js
var gulp = require('gulp');
gulpHtmlVersion = require('gulp-html-version');

gulp.task('default', function() {
    return gulp.src('./*.html')
        .pipe(gulpHtmlVersion())
        .pipe(gulp.dest('./build/'));
});
```

html:

```html
<link rel="stylesheet" href="./example.css">
<script src="./example.js"></script>
<script src="./example1.js?code=utf-8"></script>
```

结果:

```html
<link rel="stylesheet" href="./example.css?v=0.3.2">
<script src="./example.js?v=0.3.2"></script>
<script src="./example1.js?code=utf-8&v=0.3.2"></script>
```

## 参数

```js
.pipe(gulpHtmlVersion({
    paramName: 'version',
    paramType: 'timestamp',
    suffix: ['css', 'js', 'jpg']
}))
```

参数列表

 * `paramName` 版本号参数名称，默认为 `v`
 * `paramType` 生成版本的参数类型，默认为 `version` 有三个选项。 `version`: 在 `package.json` 中 `version` 作为版本号； `guid`: 生成唯一字符串版本号 ； `timestamp`: 生成时间戳版本号
 * `suffix` 需要在资源文件添加的版本号 默认为 `['css', 'js']`