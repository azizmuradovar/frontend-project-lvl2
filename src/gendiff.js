import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import isLikeObjectTree from './helpers/isLikeObjectTree.js';
import getParserByExtname from './parsers.js';
import getFormattersByType from './formatters/index.js';

const getFileData = (pathToFile) => {
  const absolutePath = path.resolve(process.cwd(), pathToFile);
  return fs.readFileSync(absolutePath, 'utf8');
};

const getParsedData = (pathToFile) => {
  const extname = path.extname(pathToFile);
  const data = getFileData(pathToFile);
  return getParserByExtname(extname)(data);
};

const getChangeValueType = (firstObj, secondObj, key) => {
  const isDelete = _.has(firstObj, key) && !_.has(secondObj, key);
  const isAdded = _.has(secondObj, key) && !_.has(firstObj, key);
  const isEqual = _.isEqual(firstObj[key], secondObj[key]);
  if (isDelete) {
    return 'delete';
  }
  if (isAdded) {
    return 'add';
  }
  if (isEqual) {
    return 'equal';
  }
  return 'changed';
};

const getValueByType = (firstValue, secondValue, changeType) => {
  switch (changeType) {
    case 'changed':
      return { oldValue: firstValue, newValue: secondValue };
    case 'add':
      return { value: secondValue };
    case 'delete':
      return { value: firstValue };
    case 'equal':
      return { value: firstValue };
    default:
      throw new Error(`Unknown change type - ${changeType}`);
  }
};

const getDiffBetweenObjects = (firstObj, secondObj) => {
  const uniqSortedKeys = (
    _.uniq([...Object.keys(firstObj), ...Object.keys(secondObj)]).sort()
  );
  const result = uniqSortedKeys.reduce((acc, key) => {
    const changeType = getChangeValueType(firstObj, secondObj, key);
    const firstValue = firstObj[key];
    const secondValue = secondObj[key];
    const value = getValueByType(firstValue, secondValue, changeType);
    let current = {
      name: key,
      type: changeType,
    };

    const hasChildren = isLikeObjectTree(firstValue) && isLikeObjectTree(secondValue);
    if (changeType === 'changed' && hasChildren) {
      current.children = getDiffBetweenObjects(firstValue, secondValue);
    } else {
      current = { ...current, ...value };
    }
    acc.push(current);
    return acc;
  }, []);
  return result;
};

const gendiff = (path1, path2, format = 'stylish') => {
  const firstObj = getParsedData(path1);
  const secondObj = getParsedData(path2);
  const differenceTree = getDiffBetweenObjects(firstObj, secondObj);
  const result = getFormattersByType(format)(differenceTree);
  return result;
};

export default gendiff;
