import isLikeObjectTree from '../helpers/isLikeObjectTree.js';

const stylishFormatter = (arr, depth = 0) => {
  const endPrefix = '  '.repeat(depth);
  const prefix = `${endPrefix}  `;
  const result = arr.map((item) => {
    const {
      name,
      children,
      type,
      value,
      oldValue,
      newValue,
    } = item;

    const getValue = (currentValue) => {
      if (!isLikeObjectTree(currentValue)) {
        return currentValue;
      }
      const tree = Object.keys(currentValue).map((key) => ({
        name: key,
        type: 'equal',
        value: currentValue[key],
      }));
      return stylishFormatter(tree, depth + 2);
    };

    if (type === 'changed' && children) {
      return `${prefix}  ${name}: ${stylishFormatter(children, depth + 2)}`;
    }
    if (type === 'changed' && !children) {
      const deleteData = `${prefix}- ${name}: ${getValue(oldValue)}`;
      const addedData = `${prefix}+ ${name}: ${getValue(newValue)}`;
      return `${deleteData}\n${addedData}`;
    }
    if (type === 'delete') {
      return `${prefix}- ${name}: ${getValue(value)}`;
    }
    if (type === 'add') {
      return `${prefix}+ ${name}: ${getValue(value)}`;
    }
    return `${prefix}  ${name}: ${getValue(value)}`;
  }).join('\n');

  return `{\n${result}\n${endPrefix}}`;
};

export default stylishFormatter;
