/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import gendiff from '../index.js';
import getExpectedStr from '../__fixtures__/expected';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename, type) => join(
  __dirname,
  '..',
  `__fixtures__/${type}`,
  `${filename}.${type}`,
);

const getFilePathsByType = (type) => ({
  file1: getFixturePath('file1', type),
  file2: getFixturePath('file2', type),
});

describe('gendiff', () => {
  test.each`
  extname   | format
  ${'json'} | ${'stylish'}
  ${'json'} | ${'plain'}
  ${'json'} | ${'json'}
  ${'yml'}  | ${'stylish'}
  ${'yml'}  | ${'plain'}
  ${'yml'}  | ${'json'}
  ${'ini'}  | ${'stylish'}
  ${'ini'}  | ${'plain'}
  ${'ini'}  | ${'json'}
`('extname = $extname and format = $format', ({ extname, format }) => {
    const { file1, file2 } = getFilePathsByType(extname);
    const difference = gendiff(file1, file2, format);
    expect(getExpectedStr(format)).toEqual(difference);
  });
});
