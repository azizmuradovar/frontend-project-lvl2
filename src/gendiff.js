import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import getParser from './parsers.js';
import isLikeObjectTree from './helpers/isLikeObjectTree.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';

const getFileData = (pathToFile) => {
  const absolutePath = path.resolve(process.cwd(), pathToFile);
  const fileData = fs.readFileSync(absolutePath, 'utf8');
  return fileData;
};

const getParsedData = (pathToFile) => {
  const extname = path.extname(pathToFile);
  const data = getFileData(pathToFile);
  const parser = getParser(extname);
  const parsedData = parser(data);
  return parsedData;
};

const getDiffBetweenObjects = (firstObj, secondObj) => {
  const uniqSortedKeys = _.uniq([
    ...Object.keys(firstObj),
    ...Object.keys(secondObj),
  ]).sort();
  const getChangeTypeValue = (key) => {
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
  const result = uniqSortedKeys.reduce((acc, key) => {
    const changeType = getChangeTypeValue(key);
    const currentValue = {
      name: key,
      type: changeType,
    };
    if (changeType === 'changed') {
      const hasTreeChildren = (
        isLikeObjectTree(firstObj[key]) && isLikeObjectTree(secondObj[key])
      );
      if (hasTreeChildren) {
        currentValue.children = getDiffBetweenObjects(firstObj[key], secondObj[key]);
      } else {
        currentValue.oldValue = firstObj[key];
        currentValue.newValue = secondObj[key];
      }
    }
    if (changeType === 'add') {
      currentValue.value = secondObj[key];
    }
    if (changeType === 'delete') {
      currentValue.value = firstObj[key];
    }
    if (changeType === 'equal') {
      currentValue.value = firstObj[key];
    }
    acc.push(currentValue);
    return acc;
  }, []);
  return result;
};

const formattersByType = {
  stylish,
  plain,
};

const gendiff = (path1, path2, format = 'stylish') => {
  const firstObj = getParsedData(path1);
  const secondObj = getParsedData(path2);
  const differenceTree = getDiffBetweenObjects(firstObj, secondObj);
  const result = formattersByType[format](differenceTree);
  return result;
};

export default gendiff;
