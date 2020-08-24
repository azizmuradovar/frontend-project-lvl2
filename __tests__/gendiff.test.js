/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import gendiff from '../src/gendiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultFixturePath = '__fixtures__/';

const folderByType = {
  json: `${defaultFixturePath}json`,
  yml: `${defaultFixturePath}yml`,
};

const expectedFileName = 'expected.json';
const expectedPath = join(__dirname, '..', defaultFixturePath, expectedFileName);

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
  test('json type', () => {
    const { file1, file2 } = getFilePathsByType('json');
    const expectedFileData = fs.readFileSync(expectedPath, 'utf8');
    const difference = gendiff(file1, file2);
    const expectedDifference = expectedFileData.replace(/"/gi, '');
    expect(expectedDifference).toEqual(difference);
  });
});
