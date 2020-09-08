import _ from 'lodash';

const stylishFormatter = (arr, depth = 0) => {
  const endPrefix = '  '.repeat(depth);
  const prefix = `${endPrefix}  `;
  const result = arr.map((item) => {
    const {
      key,
      children,
      changeType,
      valueBefore,
      valueAfter,
    } = item;

    const getValue = (currentValue) => {
      if (!_.isPlainObject(currentValue)) {
        return currentValue;
      }
      const tree = Object.keys(currentValue).map((currentKey) => ({
        key: currentKey,
        changeType: 'unchanged',
        valueBefore: currentValue[currentKey],
      }));
      return stylishFormatter(tree, depth + 2);
    };

    if (changeType === 'changed' && children) {
      return `${prefix}  ${key}: ${stylishFormatter(children, depth + 2)}`;
    }
    if (changeType === 'changed' && !children) {
      const deleteData = `${prefix}- ${key}: ${getValue(valueBefore)}`;
      const addedData = `${prefix}+ ${key}: ${getValue(valueAfter)}`;
      return `${deleteData}\n${addedData}`;
    }
    if (changeType === 'deleted') {
      return `${prefix}- ${key}: ${getValue(valueBefore)}`;
    }
    if (changeType === 'added') {
      return `${prefix}+ ${key}: ${getValue(valueAfter)}`;
    }
    return `${prefix}  ${key}: ${getValue(valueBefore)}`;
  }).join('\n');

  return `{\n${result}\n${endPrefix}}`;
};

export default stylishFormatter;
