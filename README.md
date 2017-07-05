# gulp-inline-txt
A gulp plugin to Inline any text files.

## Install

``` bash
$ npm i gulp-inline-txt -D
```

## basic usage:
in your gulpfiles
``` javascript
var inline = require('gulp-inline-txt');
gulp.task('inline', function() {
    return gulp.src('src/js/a.js')
        .pipe(inline())
        .pipe(gulp.dest('build/js'));
});
```

In your file, such as a js file:

a.js
``` javascript
console.log(1);
__inline('./b.js');
```
b.js (which is to be inlined)
``` javascript
console.log(2);
```

and the result, a.js will be:
``` javascript
console.log(1);
console.log(2);
```

Also you can cancel the inline temporarily.
``` javascript
//__inline('path/to/file')
```