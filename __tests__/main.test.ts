import {Checker, Result} from "../src/checker";

test('skips validation if excludeTitle matches', () => {
  const excludeTitle = new RegExp('Skip')
  const checker = new Checker(20, 10, excludeTitle)
  const result = checker.check({title: 'Skip PR size check', files: [{additions: 100}]})
  expect(result).toBe(Result.ok)
});

test('does validation if excludeTitle not matches', () => {
  const excludeTitle = new RegExp('NO_VALIDATION')
  const checker = new Checker(20, 10, excludeTitle)
  const result = checker.check({title: 'Skip PR size check', files: [{additions: 100}]})
  expect(result).toBe(Result.error)
});

test('does validation if excludeTitle is undefined', () => {
  const checker = new Checker(20, 10)
  const result = checker.check({title: 'Skip PR size check', files: [{additions: 100}]})
  expect(result).toBe(Result.error)
});

test('returns warning', () => {
  const checker = new Checker(20, 10)
  const result = checker.check({title: 'PR', files: [{additions: 10}, {additions: 5}]})
  expect(result).toBe(Result.warning)
});

test('returns errors', () => {
  const checker = new Checker(20, 10)
  const result = checker.check({title: 'PR', files: [{additions: 10}, {additions: 15}]})
  expect(result).toBe(Result.error)
});

test('returns OK', () => {
  const checker = new Checker(100, 50)
  const result = checker.check({title: 'PR', files: [{additions: 10}, {additions: 15}]})
  expect(result).toBe(Result.ok)
});
