import _ from 'lodash';

const getValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const getValueRow = (elem) => {
  const {
    path,
    type,
    valueBefore,
    valueAfter,
    value,
  } = elem;
  const defaultStr = `Property '${path.join('.')}' was`;

  const startMessageByType = {
    added: `${defaultStr} added with value: `,
    deleted: `${defaultStr} removed`,
    changed: `${defaultStr} updated. `,
  };

  const valueMessageByType = {
    added: `${getValue(value)}`,
    deleted: '',
    changed: `From ${getValue(valueBefore)} to ${getValue(valueAfter)}`,
  };

  return `${startMessageByType[type]}${valueMessageByType[type]}`;
};

const plainFormatter = (tree) => {
  const getChangedNodes = (nodes, path = []) => {
    const changedNodes = nodes.flatMap((node) => {
      const { type, key, children } = node;
      const currentPath = [...path, key];
      if (type === 'unchanged') {
        return [];
      }
      if (type === 'parent') {
        return getChangedNodes(children, [...path, key]);
      }
      return { ...node, path: currentPath };
    });
    return changedNodes;
  };
  const result = getChangedNodes(tree);
  return result.map(getValueRow).join('\n');
};

export default plainFormatter;
