import _ from 'lodash';

const changedTypes = ['add', 'delete', 'changed'];

const getValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const getValueRow = (elem) => {
  const {
    path,
    changeType,
    valueBefore,
    valueAfter,
  } = elem;

  const defaultStr = `Property '${path.join('.')}' was`;

  const startMessageByType = {
    add: `${defaultStr} added with value: `,
    delete: `${defaultStr} removed`,
    changed: `${defaultStr} updated. `,
  };

  const valueMessageByType = {
    add: `${getValue(valueAfter)}`,
    delete: '',
    changed: `From ${getValue(valueBefore)} to ${getValue(valueAfter)}`,
  };

  return `${startMessageByType[changeType]}${valueMessageByType[changeType]}`;
};

const plainFormatter = (tree) => {
  const changedValues = [];
  const getChangedValues = (values, path = []) => {
    values.forEach((el) => {
      const { changeType, name, children } = el;
      const currentPath = [...path, name];
      if (changedTypes.includes(changeType)) {
        if (children) {
          getChangedValues(children, [...path, name]);
        } else {
          changedValues.push({ ...el, path: currentPath });
        }
      }
    });
  };
  getChangedValues(tree);
  const result = changedValues.map(getValueRow).join('\n');
  return result;
};

export default plainFormatter;
