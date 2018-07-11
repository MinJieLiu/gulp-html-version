'use strict';
var through = require('through2');
var assign = require('object-assign');
var gutil = require('gulp-util');
var pkg = require(process.cwd() + '/package.json');

// plugin name
const PLUGIN_NAME = 'gulp-html-version';

// default parameter
var defaults = {
  paramName: 'v',
  paramType: 'version',
  suffix: ['css', 'js'],
};

/**
 * Short unique id generator
 */
var ShortId = function () {
  var lastTime;

  this.next = function () {
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

  // merge
  var opts = assign(defaults, options);
  var shortId = new ShortId();

  // switch a parameter
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

  var regex = new RegExp('(\\s[\\w-]+=".+)(\\.' + opts.suffix.join('|') + ')(\\?[^&"]+(?:&[^&"]+)*)?(")', 'ig');

  var stream = through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    var contents = file.contents.toString();
    // replace
    contents = contents.replace(regex, function (match, $1, $2, $3, $4) {
      var version;
      // append parameter
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
