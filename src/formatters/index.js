import plain from './plain.js';
import stylish from './stylish.js';

export default (format) => {
  switch (format) {
    case 'plain':
      return plain;
    case 'stylish':
      return stylish;
    case 'json':
      return JSON.stringify;
    default:
      throw new Error(`Unknown formatter - '${format}'`);
  }
};
