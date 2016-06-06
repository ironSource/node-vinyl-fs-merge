# vinyl-fs-merge

**Merges file globs from two or more source directories. First source takes precedence over the next.**

[![npm status](http://img.shields.io/npm/v/vinyl-fs-merge.svg?style=flat-square)](https://www.npmjs.org/package/vinyl-fs-merge) [![node](https://img.shields.io/node/v/vinyl-fs-merge.svg?style=flat-square)](https://www.npmjs.org/package/vinyl-fs-merge)

## example

```js
const merge = require('vinyl-fs-merge')
    , gulp = require('gulp')
    , imagemin = require('gulp-imagemin')

merge(['./my-brand', './default'], '*.png')
  .pipe(imagemin())
  .pipe(gulp.dest('dist'))
```

If both directories have a `logo.png`, then only `my-brand/logo.png` is copied to `dist`. If `my-brand/logo.png` does not exist, `default/logo.png` is copied instead.

## `merge(paths, glob, [options])`

- **paths**: array of source directories
- **glob**: one or more glob patterns passed to [vinyl-fs](https://github.com/gulpjs/vinyl-fs) (must be relative)

Options:

- **read**: if false, do not read file contents
- **cwd**: custom working directory to resolve source paths
- Other options are passed to `vinyl-fs`, except:
  - `cwd` is set to a resolved source path
  - `allowEmpty` is always true (meaning it doesn't fail on a singular glob)

## install

With [npm](https://npmjs.org) do:

```
npm install vinyl-fs-merge
```

## license

[MIT](http://opensource.org/licenses/MIT) © ironSource.
