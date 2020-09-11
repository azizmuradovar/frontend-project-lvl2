/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getExpectedStr = (filename) => {
  const filepath = join(__dirname, '..', '__fixtures__', 'expected', filename);
  const data = fs.readFileSync(filepath, 'utf8');
  return data;
};

const getFilePathsByType = (type) => {
  const defaultPath = join(__dirname, '..', '__fixtures__/inspect');
  return {
    firstFilepath: join(defaultPath, `file1.${type}`),
    secondFilepath: join(defaultPath, `file2.${type}`),
  };
};

describe('gendiff', () => {
  test.each`
  extname   | format        | expectedFilename
  ${'json'} | ${'stylish'}  | ${'stylish.txt'}
  ${'json'} | ${'plain'}    | ${'plain.txt'}
  ${'json'} | ${'json'}     | ${'json.txt'}
  ${'yml'}  | ${'stylish'}  | ${'stylish.txt'}
  ${'yml'}  | ${'plain'}    | ${'plain.txt'}
  ${'yml'}  | ${'json'}     | ${'json.txt'}
  ${'ini'}  | ${'stylish'}  | ${'stylish.txt'}
  ${'ini'}  | ${'plain'}    | ${'plain.txt'}
  ${'ini'}  | ${'json'}     | ${'json.txt'}
`('extname = $extname and format = $format', ({ extname, format, expectedFilename }) => {
    const { firstFilepath, secondFilepath } = getFilePathsByType(extname);
    const difference = gendiff(firstFilepath, secondFilepath, format);
    expect(getExpectedStr(expectedFilename)).toEqual(difference);
  });
});
