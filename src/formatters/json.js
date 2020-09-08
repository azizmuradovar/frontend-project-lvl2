const buildObject = (arr) => {
  const result = arr.reduce((acc, item) => {
    const {
      key,
      children,
      changeType,
      valueBefore,
      valueAfter,
    } = item;
    if (changeType === 'changed' && children) {
      acc[key] = buildObject(children);
    }
    if (changeType === 'changed' && !children) {
      acc[`- ${key}`] = valueBefore;
      acc[`+ ${key}`] = valueAfter;
    }
    if (changeType === 'deleted') {
      acc[`- ${key}`] = valueBefore;
    }
    if (changeType === 'added') {
      acc[`+ ${key}`] = valueAfter;
    }
    if (changeType === 'unchanged') {
      acc[key] = valueBefore;
    }
    return acc;
  }, {});
  return result;
};

const jsonFormatter = (tree) => JSON.stringify(buildObject(tree));

export default jsonFormatter;
