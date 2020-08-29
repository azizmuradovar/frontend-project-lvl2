import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

export default (format) => {
  switch (format) {
    case 'plain':
      return plain;
    case 'stylish':
      return stylish;
    case 'json':
      return json;
    default:
      throw new Error(`Unknown formatter - '${format}'`);
  }
};
