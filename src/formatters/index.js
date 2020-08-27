import plain from './plain.js';
import stylish from './stylish.js';

export default (format) => {
  switch (format) {
    case 'plain':
      return plain;
    case 'stylish':
      return stylish;
    default:
      throw new Error(`Unknown formatter - '${format}'`);
  }
};
