#!/usr/bin/env node
import pkg from 'commander';
const { Command } = pkg;
const program = new Command();
console.log(program)
program.version('0.0.1');
program.description('Compares two configuration files and shows a difference.')
program.parse(process.argv);