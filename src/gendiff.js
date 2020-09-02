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

const getChangeValueType = (firstObj, secondObj, key) => {
  const deletedKeys = _.difference(Object.keys(firstObj), Object.keys(secondObj));
  const addedKeys = _.difference(Object.keys(secondObj), Object.keys(firstObj));
  if (deletedKeys.includes(key)) {
    return 'delete';
  }
  if (addedKeys.includes(key)) {
    return 'add';
  }
  if (_.isEqual(firstObj[key], secondObj[key])) {
    return 'equal';
  }
  return 'changed';
};

const getDiffBetweenObjects = (firstObj, secondObj) => {
  const uniqSortedKeys = Object.keys({ ...firstObj, ...secondObj }).sort();
  const result = uniqSortedKeys.reduce((acc, key) => {
    const hasChildren = _.isPlainObject(firstObj[key]) && _.isPlainObject(secondObj[key]);
    const current = {
      name: key,
      changeType: getChangeValueType(firstObj, secondObj, key),
      valueBefore: firstObj[key],
      valueAfter: secondObj[key],
      children: hasChildren ? getDiffBetweenObjects(firstObj[key], secondObj[key]) : null,
    };
    acc.push(current);
    return acc;
  }, []);
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
