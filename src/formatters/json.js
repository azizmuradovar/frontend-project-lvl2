const buildObject = (arr) => {
  const result = arr.reduce((acc, item) => {
    const {
      name,
      children,
      changeType,
      valueBefore,
      valueAfter,
    } = item;
    if (changeType === 'changed' && children) {
      acc[name] = buildObject(children);
    }
    if (changeType === 'changed' && !children) {
      acc[`- ${name}`] = valueBefore;
      acc[`+ ${name}`] = valueAfter;
    }
    if (changeType === 'delete') {
      acc[`- ${name}`] = valueBefore;
    }
    if (changeType === 'add') {
      acc[`+ ${name}`] = valueAfter;
    }
    if (changeType === 'equal') {
      acc[name] = valueBefore;
    }
    return acc;
  }, {});
  return result;
};

const jsonFormatter = (tree) => JSON.stringify(buildObject(tree));

export default jsonFormatter;
