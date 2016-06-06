'use strict';

const vfs = require('vinyl-fs')
    , getContents = require('vinyl-fs/lib/src/getContents')
    , through2 = require('through2')
    , resolve = require('path').resolve

module.exports = function merge (paths, globs, opts = {}) {
  paths = paths.slice()

  const seenFiles = new Set
      , seenSources = new Set
      , merged = through2.obj()
      , cwd = opts.cwd || process.cwd()

  let finished = 0

  function nextSource () {
    if (!paths.length) return finish()

    const path = resolve(cwd, paths.shift())

    if (seenSources.has(path)) return nextSource()
    else seenSources.add(path)

    vfs.src(globs, { ...opts, cwd: path, read: false, allowEmpty: true })
      .on('error', finish)
      .pipe(through2.obj(function (file, enc, next) {
        if (seenFiles.has(file.relative)) return next()
        else seenFiles.add(file.relative)

        next(null, file)
      }))
      .on('finish', nextSource)
      .on('error', finish)
      .pipe(merged, { end: false })
  }

  function finish(err) {
    if (finished++) return
    if (err) merged.destroy(err)
    else merged.end()
  }

  setImmediate(nextSource)

  if (opts.read === false) return merged

  const withContents = merged.pipe(getContents(opts))
  merged.on('error', (err) => withContents.destroy(err))

  return withContents
}
