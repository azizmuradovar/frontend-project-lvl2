import isLikeObjectTree from '../helpers/isLikeObjectTree.js';

const changedTypes = ['add', 'delete', 'changed'];

const getValue = (value) => {
  if (isLikeObjectTree(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const getValueRow = (elem) => {
  const {
    path,
    type,
    value,
    oldValue,
    newValue,
  } = elem;

  const defaultStr = `Property '${path.join('.')}' was`;

  const startMessageByType = {
    add: `${defaultStr} added with value: `,
    delete: `${defaultStr} removed`,
    changed: `${defaultStr} updated. `,
  };

  const valueMessageByType = {
    add: `${getValue(value)}`,
    delete: '',
    changed: `From ${getValue(oldValue)} to ${getValue(newValue)}`,
  };

  return `${startMessageByType[type]}${valueMessageByType[type]}`;
};

const plainFormatter = (arr) => {
  const changedValues = [];
  const getChangedValues = (values, path = []) => {
    values.forEach((el) => {
      const { type, name, children } = el;
      const currentPath = [...path, name];
      if (changedTypes.includes(type)) {
        if (children) {
          getChangedValues(children, [...path, name]);
        } else {
          changedValues.push({ ...el, path: currentPath });
        }
      }
    });
  };
  getChangedValues(arr);
  const result = changedValues.map(getValueRow).join('\n');
  return result;
};

export default plainFormatter;
