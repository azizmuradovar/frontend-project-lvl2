import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import getParserByExtname from './parsers.js';
import getFormattersByType from './formatters/index.js';

const getFileData = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(absolutePath, 'utf8');
};

const getParsedData = (filepath) => {
  const extname = path.extname(filepath);
  const data = getFileData(filepath);
  return getParserByExtname(extname)(data);
};

const getDiffBetweenObjects = (firstObj, secondObj) => {
  const uniqSortedKeys = _.union(_.keys(firstObj), _.keys(secondObj)).sort();
  const result = uniqSortedKeys.map((key) => {
    if (!_.has(firstObj, key)) {
      return {
        key,
        type: 'added',
        value: secondObj[key],
      };
    }

    if (!_.has(secondObj, key)) {
      return {
        key,
        type: 'deleted',
        value: firstObj[key],
      };
    }
    const isParent = _.isPlainObject(firstObj[key]) && _.isPlainObject(secondObj[key]);

    if (isParent) {
      return {
        key,
        type: 'parent',
        children: getDiffBetweenObjects(firstObj[key], secondObj[key]),
      };
    }

    if (_.isEqual(firstObj[key], secondObj[key])) {
      return {
        key,
        type: 'unchanged',
        value: firstObj[key],
      };
    }

    return {
      key,
      type: 'changed',
      valueBefore: firstObj[key],
      valueAfter: secondObj[key],
    };
  });
  return result;
};

const gendiff = (firstFilepath, secondFilepath, format = 'stylish') => {
  const firstObj = getParsedData(firstFilepath);
  const secondObj = getParsedData(secondFilepath);
  const differenceTree = getDiffBetweenObjects(firstObj, secondObj);
  const result = getFormattersByType(format)(differenceTree);
  return result;
};

export default gendiff;
