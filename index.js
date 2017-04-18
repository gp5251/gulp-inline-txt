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

    var str = file.contents.toString().replace(/__inline\(['"](.*?)['"]\);?/g, (match, filepath)=>{
      return loadFile(file.base, filepath);
    });

    file.contents = new Buffer(str || '');
    this.push(file);
    return cb();
  });
};

function loadFile(base, p, splitToken = ';') {
  p = path.resolve(base, p); 
  if (fs.existsSync(p)) {
    var str = fs.readFileSync(p, 'utf8');
    var inlineExp = /__inline\(['"](.*?)['"]\);?/g;

    str = str.replace(inlineExp,(match, p) => {
      return loadFile(base, p);
    });

    return splitToken + str + splitToken;
  } else {
    console.error(p, 'not exist!');
    return '';
  }
}