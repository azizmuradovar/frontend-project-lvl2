/* eslint-disable no-underscore-dangle */

import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import gendiff from '../src/gendiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__/jsonType', filename);

const filePath1 = getFixturePath('jsonFile1.json');
const filePath2 = getFixturePath('jsonFile2.json');
const expectedFilePath = getFixturePath('expectedFile.json');
const expectedFileData = fs.readFileSync(expectedFilePath, 'utf8');

describe('gendiff', () => {
  test('json type', () => {
    const difference = gendiff(filePath1, filePath2);
    const expectedDifference = expectedFileData.replace(/"/gi, '');
    expect(expectedDifference).toEqual(difference);
  });
});
