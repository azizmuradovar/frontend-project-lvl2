import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import getParser from './parsers';

const getFileData = (pathToFile) => {
  const absolutePath = path.resolve(process.cwd(), pathToFile);
  const fileData = fs.readFileSync(absolutePath, 'utf8');
  return fileData;
};

const getDiffBetweenObjects = (firstObj, secondObj) => {
  const firstObjKeys = Object.keys(firstObj);
  const secondObjKeys = Object.keys(secondObj);
  const deletedKeys = _.difference(firstObjKeys, secondObjKeys);
  const addedKeys = _.difference(secondObjKeys, firstObjKeys);
  const uniqSortedKeys = _.uniq([...firstObjKeys, ...secondObjKeys]).sort();
  const result = uniqSortedKeys.reduce((acc, key) => {
    const isDeleted = deletedKeys.includes(key);
    const isAdded = addedKeys.includes(key);
    const isEqual = firstObj[key] === secondObj[key];

    if (isDeleted) {
      acc[`- ${key}`] = firstObj[key];
    } else if (isAdded) {
      acc[`+ ${key}`] = secondObj[key];
    } else if (isEqual) {
      acc[`  ${key}`] = secondObj[key];
    } else {
      acc[`- ${key}`] = firstObj[key];
      acc[`+ ${key}`] = secondObj[key];
    }
    return acc;
  }, {});
  return result;
};

const getParsedData = (pathToFile) => {
  const extname = path.extname(pathToFile);
  const data = getFileData(pathToFile);
  const parser = getParser(extname);
  const parsedData = parser(data);
  return parsedData;
};

const gendiff = (path1, path2) => {
  const firstObj = getParsedData(path1);
  const secondObj = getParsedData(path2);
  const differenceObj = getDiffBetweenObjects(firstObj, secondObj);
  return JSON.stringify(differenceObj, null, 2).replace(/"/gi, '');
};

export default gendiff;
