import _ from 'lodash';

const getPreparedValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const render = (tree) => {
  const getChangedNodes = (nodes, path = []) => {
    const changedNodes = nodes.flatMap((node) => {
      const {
        type,
        key,
        children,
        value,
        valueBefore,
        valueAfter,
      } = node;
      const currentPath = [...path, key].join('.');
      switch (type) {
        case 'added':
          return `Property '${currentPath}' was added with value: ${getPreparedValue(value)}`;
        case 'deleted':
          return `Property '${currentPath}' was removed`;
        case 'changed':
          return `Property '${currentPath}' was updated. From ${getPreparedValue(valueBefore)} to ${getPreparedValue(valueAfter)}`;
        case 'parent':
          return getChangedNodes(children, [...path, key]);
        case 'unchanged':
          return [];
        default:
          throw new Error(`Unknown node type '${type}' in plain formatter`);
      }
    });
    return changedNodes;
  };
  const result = getChangedNodes(tree);
  return result.join('\n');
};

export default render;
