#!/usr/bin/env node
import pkg from 'commander';
import gendiff from '../src/gendiff.js';

const { Command } = pkg;
const program = new Command();
program.version('0.0.1');
program
  .arguments('<firstPath> <secondPath>')
  .action((firstPath, secondPath, { format }) => {
    console.log(gendiff(firstPath, secondPath, format));
  });
program.description('Compares two configuration files and shows a difference.');
program.option('-f, --format [type]', 'output format', 'stylish');
program.parse(process.argv);

export default gendiff;
