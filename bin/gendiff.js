#!/usr/bin/env node
import pkg from 'commander';
import gendiff from '../src/gendiff.js';

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
