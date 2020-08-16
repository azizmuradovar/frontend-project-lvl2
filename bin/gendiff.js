#!/usr/bin/env node
import pkg from 'commander';
const { Command } = pkg;
const program = new Command();
program.version('0.0.1');
program.arguments('<filepath1> <filepath2>')
program.description('Compares two configuration files and shows a difference.')
program.option('-f, --format <type>', 'output format');
program.parse(process.argv);