import path from 'path';
import fs from 'fs';
import _ from 'lodash';

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

const gendiff = (firstPath, secondPath) => {
  const firstAbsolutePath = path.resolve(process.cwd(), firstPath);
  const secondAbsolutePath = path.resolve(process.cwd(), secondPath);
  const firstFileData = fs.readFileSync(firstAbsolutePath, 'utf8');
  const secondFileData = fs.readFileSync(secondAbsolutePath, 'utf8');
  const firstObj = JSON.parse(firstFileData);
  const secondObj = JSON.parse(secondFileData);
  const differenceObj = getDiffBetweenObjects(firstObj, secondObj);
  return JSON.stringify(differenceObj, null, 2).replace(/"/gi, '');
};

export default gendiff;
