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

    if (type === 'parent') {
      return `${prefix}  ${key}: ${stylishFormatter(children, depth + 2)}`;
    }
    if (type === 'changed') {
      const deleteData = `${prefix}- ${key}: ${getValue(valueBefore)}`;
      const addedData = `${prefix}+ ${key}: ${getValue(valueAfter)}`;
      return `${deleteData}\n${addedData}`;
    }
    if (type === 'deleted') {
      return `${prefix}- ${key}: ${getValue(value)}`;
    }
    if (type === 'added') {
      return `${prefix}+ ${key}: ${getValue(value)}`;
    }
    return `${prefix}  ${key}: ${getValue(value)}`;
  }).join('\n');

  return `{\n${result}\n${endPrefix}}`;
};

export default stylishFormatter;
