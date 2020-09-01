import _ from 'lodash';

const stylishFormatter = (arr, depth = 0) => {
  const endPrefix = '  '.repeat(depth);
  const prefix = `${endPrefix}  `;
  const result = arr.map((item) => {
    const {
      name,
      children,
      changeType,
      valueBefore,
      valueAfter,
    } = item;

    const getValue = (currentValue) => {
      if (!_.isPlainObject(currentValue)) {
        return currentValue;
      }
      const tree = Object.keys(currentValue).map((key) => ({
        name: key,
        changeType: 'equal',
        valueBefore: currentValue[key],
      }));
      return stylishFormatter(tree, depth + 2);
    };

    if (changeType === 'changed' && children) {
      return `${prefix}  ${name}: ${stylishFormatter(children, depth + 2)}`;
    }
    if (changeType === 'changed' && !children) {
      const deleteData = `${prefix}- ${name}: ${getValue(valueBefore)}`;
      const addedData = `${prefix}+ ${name}: ${getValue(valueAfter)}`;
      return `${deleteData}\n${addedData}`;
    }
    if (changeType === 'delete') {
      return `${prefix}- ${name}: ${getValue(valueBefore)}`;
    }
    if (changeType === 'add') {
      return `${prefix}+ ${name}: ${getValue(valueAfter)}`;
    }
    return `${prefix}  ${name}: ${getValue(valueBefore)}`;
  }).join('\n');

  return `{\n${result}\n${endPrefix}}`;
};

export default stylishFormatter;
