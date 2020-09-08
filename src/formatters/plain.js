import _ from 'lodash';

const changedTypes = ['added', 'deleted', 'changed'];

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
    added: `${defaultStr} added with value: `,
    deleted: `${defaultStr} removed`,
    changed: `${defaultStr} updated. `,
  };

  const valueMessageByType = {
    added: `${getValue(valueAfter)}`,
    deleted: '',
    changed: `From ${getValue(valueBefore)} to ${getValue(valueAfter)}`,
  };

  return `${startMessageByType[changeType]}${valueMessageByType[changeType]}`;
};

const plainFormatter = (tree) => {
  const changedValues = [];
  const getChangedValues = (values, path = []) => {
    values.forEach((el) => {
      const { changeType, key, children } = el;
      const currentPath = [...path, key];
      if (changedTypes.includes(changeType)) {
        if (children) {
          getChangedValues(children, [...path, key]);
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
