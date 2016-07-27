'use strict';
var through = require('through2');
var assign = require('object-assign');
var gutil = require('gulp-util');
var pkg = require(__dirname + '/package.json');

// 插件名称
const PLUGIN_NAME = 'gulp-html-version';

// 默认参数
var defaults = {
    paramName: 'v',
    paramType: 'version',
    suffix: ['css', 'js']
};

/**
 * 生成 shortId
 */
var ShortId = function() {
    var lastTime;

    this.next = function() {
        var d = new Date();
        var thisTime = (d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) * 1000;
        while (lastTime >= thisTime) {
            thisTime++;
        }
        lastTime = thisTime;
        return thisTime.toString(16);
    };
};

function gulpHtmlVersion(options) {

    // 合并参数
    var opts = assign(defaults, options);
    var shortId = new ShortId();

    // 选择参数类型
    switch (opts.paramType) {
        case 'version':
            opts.version = pkg.version;
            break;
        case 'guid':
            opts.version = shortId.next();
            break;
        case 'timestamp':
            opts.version = Date.now();
            break;
    }

    // 初始化匹配正则
    var suffix = opts.suffix.join('|');
    var regex = new RegExp('(\\s[\\w-]+=".+)(\\.' + suffix + ')(\\?[^&]+(?:&[^&]+)*)?(")', 'ig');

    // 创建一个让每个文件通过的 stream 通道
    var stream = through.obj(function(file, enc, cb) {

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var contents = file.contents.toString();
        // 替换
        contents = contents.replace(regex, function(match, $1, $2, $3, $4) {
            var version;
            // 追加参数
            if ($3 != undefined) {
                version = $3 + '&' + opts.paramName + '=' + opts.version;
            } else {
                version = '?' + opts.paramName + '=' + opts.version;
            }
            return $1 + $2 + version + $4;
        });

        file.contents = new Buffer(contents);

        this.push(file);

        cb();
    });

    return stream;
}

module.exports = gulpHtmlVersion;
