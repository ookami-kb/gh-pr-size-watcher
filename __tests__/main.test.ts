import {Checker, Result} from '../src/checker'

test('skips validation if excludeTitle matches', () => {
  const excludeTitle = new RegExp('Skip')
  const checker = new Checker({errorSize: 20, warningSize: 10, excludeTitle})
  const result = checker.check({
    title: 'Skip PR size check',
    files: [{additions: 100, filename: '1.txt'}],
    labels: []
  })
  expect(result).toBe(Result.ok)
})

test('does validation if excludeTitle not matches', () => {
  const excludeTitle = new RegExp('NO_VALIDATION')
  const checker = new Checker({errorSize: 20, warningSize: 10, excludeTitle})
  const result = checker.check({
    title: 'Skip PR size check',
    files: [{additions: 100, filename: '1.txt'}],
    labels: []
  })
  expect(result).toBe(Result.error)
})

test('does validation if excludeLabels not matches', () => {
  const excludeTitle = new RegExp('NO_VALIDATION')
  const excludeLabels = ['skip']
  const checker = new Checker({errorSize: 20, warningSize: 10, excludeTitle, excludeLabels})
  const result = checker.check({
    title: 'Skip PR size check',
    files: [{additions: 100, filename: '1.txt'}],
    labels: ['no-skip']
  })
  expect(result).toBe(Result.error)
})

test('does validation if excludeTitle is undefined', () => {
  const checker = new Checker({errorSize: 20, warningSize: 10})
  const result = checker.check({
    title: 'Skip PR size check',
    files: [{additions: 100, filename: '1.txt'}],
    labels: []
  })
  expect(result).toBe(Result.error)
})

test('returns warning', () => {
  const checker = new Checker({errorSize: 20, warningSize: 10})
  const result = checker.check({
    title: 'PR',
    files: [
      {additions: 10, filename: '1.txt'},
      {additions: 5, filename: '2.txt'}
    ],
    labels: []
  })
  expect(result).toBe(Result.warning)
})

test('returns errors', () => {
  const checker = new Checker({errorSize: 20, warningSize: 10})
  const result = checker.check({
    title: 'PR',
    files: [
      {additions: 10, filename: '1.txt'},
      {additions: 15, filename: '2.txt'}
    ],
    labels: []
  })
  expect(result).toBe(Result.error)
})

test('returns OK', () => {
  const checker = new Checker({errorSize: 100, warningSize: 50})
  const result = checker.check({
    title: 'PR',
    files: [
      {additions: 10, filename: '1.txt'},
      {additions: 15, filename: '2.txt'}
    ],
    labels: []
  })
  expect(result).toBe(Result.ok)
})

test('skips files matching excludePath', () => {
  const checker = new Checker({
    errorSize: 40,
    warningSize: 30,
    excludePaths: ['**/test/**', 'README.md', '**/resources/**/*.json']
  })
  const result = checker.check({
    title: 'PR',
    files: [
      {additions: 10, filename: '1.txt'},
      {additions: 15, filename: '2.txt'},
      {additions: 100, filename: 'some/test/file.txt'},
      {additions: 100, filename: 'README.md'},
      {additions: 100, filename: 'resources/1.json'}
    ],
    labels: []
  })
  expect(result).toBe(Result.ok)
})

test('skips files matching excludeLabels', () => {
  const checker = new Checker({
    errorSize: 40,
    warningSize: 30,
    excludeLabels: ['skip']
  })
  const result = checker.check({
    title: 'PR',
    files: [
      {additions: 10, filename: '1.txt'},
      {additions: 15, filename: '2.txt'},
      {additions: 100, filename: 'some/test/file.txt'},
      {additions: 100, filename: 'README.md'},
      {additions: 100, filename: 'resources/1.json'}
    ],
    labels: ['skip']
  })
  expect(result).toBe(Result.ok)
})
