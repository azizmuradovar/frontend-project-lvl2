import _ from 'lodash';

const stylishFormatter = (arr, depth = 0) => {
  const endPrefix = '  '.repeat(depth);
  const prefix = `${endPrefix}  `;
  const result = arr.map((item) => {
    const {
      key,
      children,
      type,
      valueBefore,
      valueAfter,
      value,
    } = item;

    const getValue = (currentValue) => {
      if (!_.isPlainObject(currentValue)) {
        return currentValue;
      }
      const tree = Object.keys(currentValue).map((currentKey) => ({
        key: currentKey,
        type: 'unchanged',
        value: currentValue[currentKey],
      }));
      return stylishFormatter(tree, depth + 2);
    };

    switch (type) {
      case 'added':
        return `${prefix}+ ${key}: ${getValue(value)}`;
      case 'deleted':
        return `${prefix}- ${key}: ${getValue(value)}`;
      case 'unchanged':
        return `${prefix}  ${key}: ${getValue(value)}`;
      case 'parent':
        return `${prefix}  ${key}: ${stylishFormatter(children, depth + 2)}`;
      case 'changed':
        return `${prefix}- ${key}: ${getValue(valueBefore)}\n${prefix}+ ${key}: ${getValue(valueAfter)}`;
      default:
        throw new Error(`Unknown node type '${type}' in stylish formatter`);
    }
  }).join('\n');

  return `{\n${result}\n${endPrefix}}`;
};

export default stylishFormatter;
