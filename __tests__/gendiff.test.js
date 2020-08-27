/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import gendiff from '../src/gendiff';
import expected from '../__fixtures__/expected.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultFixturePath = '__fixtures__/';

const folderByType = {
  json: `${defaultFixturePath}json`,
  yml: `${defaultFixturePath}yml`,
  ini: `${defaultFixturePath}ini`,
};

const getFixturePath = (filename, type) => join(
  __dirname,
  '..',
  folderByType[type],
  `${filename}.${type}`,
);

const getFilePathsByType = (type) => ({
  file1: getFixturePath('file1', type),
  file2: getFixturePath('file2', type),
});

describe('gendiff', () => {
  test.each(['json', 'yml', 'ini'])('%s', (format) => {
    const { file1, file2 } = getFilePathsByType(format);
    const difference = gendiff(file1, file2);
    expect(expected).toEqual(difference);
  });
});
