import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAcceptEncoding } from '../src/index.js';

test('empty header returns empty list', () => {
  assert.deepEqual(parseAcceptEncoding(''), []);
});

test('undefined returns empty list', () => {
  assert.deepEqual(parseAcceptEncoding(undefined), []);
});

test('single coding defaults to q=1', () => {
  assert.deepEqual(parseAcceptEncoding('gzip'), [{ coding: 'gzip', q: 1 }]);
});

test('sorts by quality descending', () => {
  assert.deepEqual(parseAcceptEncoding('gzip;q=0.5, deflate;q=0.8'), [
    { coding: 'deflate', q: 0.8 },
    { coding: 'gzip', q: 0.5 },
  ]);
});

test('wildcard is a coding token', () => {
  assert.deepEqual(parseAcceptEncoding('*'), [{ coding: '*', q: 1 }]);
});

test('skips invalid q values', () => {
  assert.deepEqual(parseAcceptEncoding('gzip;q=2, deflate;q=0.5'), [
    { coding: 'deflate', q: 0.5 },
  ]);
});

test('skips malformed parameters', () => {
  assert.deepEqual(parseAcceptEncoding('gzip;level=1'), []);
});

test('q without value is invalid', () => {
  assert.deepEqual(parseAcceptEncoding('gzip;q='), []);
});

test('ignores empty segments', () => {
  assert.deepEqual(parseAcceptEncoding('gzip,, deflate'), [
    { coding: 'gzip', q: 1 },
    { coding: 'deflate', q: 1 },
  ]);
});

test('case-insensitive q parameter and trims whitespace', () => {
  assert.deepEqual(parseAcceptEncoding('gzip; Q=0.3'), [
    { coding: 'gzip', q: 0.3 },
  ]);
});

test('q=0 is kept but sorted last', () => {
  assert.deepEqual(parseAcceptEncoding('gzip;q=0, deflate;q=1'), [
    { coding: 'deflate', q: 1 },
    { coding: 'gzip', q: 0 },
  ]);
});

test('tie preserves original order', () => {
  assert.deepEqual(parseAcceptEncoding('gzip, deflate'), [
    { coding: 'gzip', q: 1 },
    { coding: 'deflate', q: 1 },
  ]);
});

test('non-string input is coerced', () => {
  assert.deepEqual(parseAcceptEncoding(123), [{ coding: '123', q: 1 }]);
});
