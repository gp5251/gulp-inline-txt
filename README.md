# gulp-inline-txt
A gulp plugin to Inline any text files.

## Install

``` bash
$ npm i gulp-inline-txt -D
```

## basic usage:
in gulpfiles
``` javascript
gulp.task('inline', function(done) {
    return gulp.src('path/to/your/file')
        .pipe(inline())
        .pipe(gulp.dest('path'));
});
```

In your file, such as a js file:

a.js
``` javascript
console.log(1);
__inline('./b.js');
```
b.js
``` javascript
console.log(2);
```

and the result is:
``` javascript
console.log(1);
console.log(2);
```

Also you can cancel the inline temporarily.
``` javascript
//__inline('path/to/file')
```

Later to add compression.
