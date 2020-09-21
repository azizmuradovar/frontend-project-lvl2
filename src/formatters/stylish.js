import _ from 'lodash';

const render = (arr, depth = 0) => {
  const endPrefix = '  '.repeat(depth * 2);
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

    const getPreparedValue = (currentValue) => {
      if (!_.isPlainObject(currentValue)) {
        return currentValue;
      }
      const tree = Object.keys(currentValue).map((currentKey) => ({
        key: currentKey,
        type: 'unchanged',
        value: currentValue[currentKey],
      }));
      return render(tree, depth + 1);
    };

    switch (type) {
      case 'added':
        return `${prefix}+ ${key}: ${getPreparedValue(value)}`;
      case 'deleted':
        return `${prefix}- ${key}: ${getPreparedValue(value)}`;
      case 'unchanged':
        return `${prefix}  ${key}: ${getPreparedValue(value)}`;
      case 'parent':
        return `${prefix}  ${key}: ${render(children, depth + 1)}`;
      case 'changed':
        return `${prefix}- ${key}: ${getPreparedValue(valueBefore)}\n${prefix}+ ${key}: ${getPreparedValue(valueAfter)}`;
      default:
        throw new Error(`Unknown node type '${type}' in stylish formatter`);
    }
  }).join('\n');

  return `{\n${result}\n${endPrefix}}`;
};

export default render;
