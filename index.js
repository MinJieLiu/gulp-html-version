'use strict';
var through = require('through2');
var assign = require('object-assign');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var pkg = require(__dirname + '/package.json');

// 插件名称
const PLUGIN_NAME = 'gulp-html-version';

// 默认参数
var defaults = {
    paramType: 'version',
    extensions: ['css', 'js']
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

    // 选择参数类型
    switch (opts.paramType) {
        case 'version':
            opts.version = pkg.version;
            break;
        case 'guid':
            opts.version = new ShortId().next();
            break;
        case 'timestamp':
            opts.version = Date.now();
            break;
    }

    // 创建一个让每个文件通过的 stream 通道
    var stream = through.obj(function(file, enc, callback) {

        if (!file) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Missing file option!'));
            return callback();
        }

        var contents = file.contents.toString();
        // 处理js
        contents = contents.replace(/<script\s+src="(.*)"><\/script>/gi, function(match, $1) {
            return '<script src="' + $1 + '?v=' + opts.version + '"></script>';
        });
        // 处理css
        contents = contents.replace(/<link\s+rel="stylesheet"\s+href="(.*)"\s?\/>/gi, function(match, $1) {
            return '<link rel="stylesheet" href="' + $1 + '?v=' + opts.version + '" />';
        });
        file.contents = new Buffer(contents);

        // 确保文件进去下一个插件
        this.push(file);

        callback();
    });

    return stream;
}

module.exports = gulpHtmlVersion;
