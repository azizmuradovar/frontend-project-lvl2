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
        changeType: 'added',
        valueBefore: null,
        valueAfter: secondObj[key],
        children: null,
      };
    }

    if (!_.has(secondObj, key)) {
      return {
        key,
        changeType: 'deleted',
        valueBefore: firstObj[key],
        valueAfter: null,
        children: null,
      };
    }

    const children = _.isPlainObject(firstObj[key]) && _.isPlainObject(secondObj[key])
      ? getDiffBetweenObjects(firstObj[key], secondObj[key])
      : null;

    if (_.isEqual(firstObj[key], secondObj[key])) {
      return {
        key,
        changeType: 'unchanged',
        valueBefore: firstObj[key],
        valueAfter: secondObj[key],
        children,
      };
    }

    return {
      key,
      changeType: 'changed',
      valueBefore: firstObj[key],
      valueAfter: secondObj[key],
      children,
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
