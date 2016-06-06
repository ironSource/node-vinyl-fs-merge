const test = require('tape')
    , merge = require('../')
    , concat = require('concat-stream')
    , fixtures = __dirname + '/../../fixtures'
    , resolve = require('path').resolve

test('first source takes precedence', function (t) {
  t.plan(2)

  merge(['a', 'b', 'c'], '*.txt', { cwd: fixtures })
    .pipe(concat(function (files) {
      t.same(files.map(simple), [
        { p: fixture('a', '1.txt'),  r: '1.txt',  c: 'a1' },
        { p: fixture('a', 'a2.txt'), r: 'a2.txt', c: 'a2' },
        { p: fixture('b', 'b2.txt'), r: 'b2.txt', c: 'b2' }
      ])
    }))

  merge(['c', 'b', 'a'], '*.txt', { cwd: fixtures })
    .pipe(concat(function (files) {
      t.same(files.map(simple), [
        { p: fixture('c', '1.txt'),  r: '1.txt',  c: 'c1' },
        { p: fixture('b', 'b2.txt'), r: 'b2.txt', c: 'b2' },
        { p: fixture('a', 'a2.txt'), r: 'a2.txt', c: 'a2' }
      ])
    }))
})

test('ignores duplicate sources', function (t) {
  t.plan(2)

  merge(['a', 'b', 'c', 'a'], '*.txt', { cwd: fixtures })
    .pipe(concat(function (files) {
      t.same(files.map(simple), [
        { p: fixture('a', '1.txt'),  r: '1.txt',  c: 'a1' },
        { p: fixture('a', 'a2.txt'), r: 'a2.txt', c: 'a2' },
        { p: fixture('b', 'b2.txt'), r: 'b2.txt', c: 'b2' }
      ])
    }))

  merge(['c', 'c', 'b', 'a', 'b'], '*.txt', { cwd: fixtures })
    .pipe(concat(function (files) {
      t.same(files.map(simple), [
        { p: fixture('c', '1.txt'),  r: '1.txt',  c: 'c1' },
        { p: fixture('b', 'b2.txt'), r: 'b2.txt', c: 'b2' },
        { p: fixture('a', 'a2.txt'), r: 'a2.txt', c: 'a2' }
      ])
    }))
})

test('singular glob does not throw', function (t) {
  t.plan(1)

  merge(['a', 'b', 'c'], '3.txt', { cwd: fixtures })
    .on('error', (err) => t.fail(err))
    .on('finish', () => t.pass('finished'))
})

test('read: false', function (t) {
  t.plan(1)

  merge(['a', 'b', 'c'], '*.txt', { cwd: fixtures, read: false })
    .pipe(concat(function (files) {
      t.same(files.map(simple), [
        { p: fixture('a', '1.txt'),  r: '1.txt',  c: null },
        { p: fixture('a', 'a2.txt'), r: 'a2.txt', c: null },
        { p: fixture('b', 'b2.txt'), r: 'b2.txt', c: null }
      ])
    }))
})

function fixture(...args) {
  return resolve(fixtures, ...args)
}

function simple(file) {
  return {
    p: file.path,
    r: file.relative,
    c: file.isBuffer() ? file.contents.toString().trim() : null
  }
}
