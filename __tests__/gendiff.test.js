/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import gendiff from '../index.js';
import getExpectedStr from '../__fixtures__/expected';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFilePathsByType = (type) => {
  const defaultPath = join(__dirname, '..', '__fixtures__/inspect');
  return {
    firstFilepath: join(defaultPath, `file1.${type}`),
    secondFilepath: join(defaultPath, `file2.${type}`),
  };
};

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
    const { firstFilepath, secondFilepath } = getFilePathsByType(extname);
    const difference = gendiff(firstFilepath, secondFilepath, format);
    expect(getExpectedStr(format)).toEqual(difference);
  });
});
