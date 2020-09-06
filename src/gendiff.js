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
  const result = uniqSortedKeys.reduce((acc, key) => {
    const hasChildren = _.isPlainObject(firstObj[key]) && _.isPlainObject(secondObj[key]);
    const children = hasChildren
      ? getDiffBetweenObjects(firstObj[key], secondObj[key])
      : null;
    const name = key;

    if (_.has(firstObj, key) && !_.has(secondObj, key)) {
      const currentNode = {
        name,
        changeType: 'delete',
        valueBefore: firstObj[key],
        valueAfter: null,
        children,
      };
      return [...acc, currentNode];
    }

    if (_.has(secondObj, key) && !_.has(firstObj, key)) {
      const currentNode = {
        name,
        changeType: 'add',
        valueBefore: null,
        valueAfter: secondObj[key],
        children,
      };
      return [...acc, currentNode];
    }

    const currentNode = {
      name,
      changeType: _.isEqual(firstObj[key], secondObj[key]) ? 'equal' : 'changed',
      valueBefore: firstObj[key],
      valueAfter: secondObj[key],
      children,
    };
    return [...acc, currentNode];
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
