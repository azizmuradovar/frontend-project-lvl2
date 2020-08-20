#!/usr/bin/env node
import pkg from 'commander';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const gendiff = (firstPath, secondPath) => {
  const firstAbsolutePath = path.resolve(process.cwd(), firstPath);
  const secondAbsolutePath = path.resolve(process.cwd(), secondPath);
  const firstFileData = fs.readFileSync(firstAbsolutePath, 'utf8');
  const secondFileData = fs.readFileSync(secondAbsolutePath, 'utf8');
  const firstObj = JSON.parse(firstFileData);
  const secondObj = JSON.parse(secondFileData);
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
  return JSON.stringify(result, null, 2).replace(/"/gi, '');
};

const { Command } = pkg;
const program = new Command();
program.version('0.0.1');
program.arguments('<firstPath> <secondPath>').action((...args) => {
  console.log(gendiff(...args));
});
program.description('Compares two configuration files and shows a difference.');
program.option('-f, --format <type>', 'output format');
program.parse(process.argv);

export default gendiff;
