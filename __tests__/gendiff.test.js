/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => {
  const path = join(__dirname, '..', '__fixtures__', filename);
  return path;
};

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

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
    const firstFilepath = getFixturePath(`file1.${extname}`);
    const secondFilepath = getFixturePath(`file2.${extname}`);
    const difference = gendiff(firstFilepath, secondFilepath, format);
    const expectedData = readFile(expectedFilename);
    expect(difference).toEqual(expectedData);
  });
});
