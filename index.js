var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var through2 = require('through2');

module.exports = function (options) {
  return through2.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-inline-txt', 'Streaming not supported'));
    }

    var str = file.contents.toString().replace(/__inline\(['"](.*?)['"]\)/g, (match, filepath)=>{
      return loadFile(file.base, filepath, file.history[0], new FileLink(null, file.history[0]));
    });

    file.contents = new Buffer(str || '');
    this.push(file);
    return cb();
  });
};

function FileLink(host = null, path = './') {
  this.host = host;
  this.path = path;
}

FileLink.prototype.lookup = function(path = '') {
  var found, file = this;

  while(file) {
    if (file.path == path) {
      found = file.host.path;
      break;
    }
    file = file.host;
  }

  return found;
}

function loadFile(base, p, from, fileLink = new FileLink) {
  p = path.resolve(base, p); 

  var found = fileLink.lookup(p);
  if (!!found) {
    console.error(p, 'in', from+', '+found, 'triggered circular reference!');
    return '';
  }

  var childFileLink = new FileLink(fileLink, p);

  if (fs.existsSync(p)) {
    var str = fs.readFileSync(p, 'utf8');
    var inlineExp = /__inline\(['"](.*?)['"]\)/g;

    str = str.replace(inlineExp,(match, url) => {
      return loadFile(path.dirname(p), url, p, childFileLink);
    });

    return str;
  } else {
    console.error(p, 'referenced by', from, 'is not exist!');
    return '';
  }
}