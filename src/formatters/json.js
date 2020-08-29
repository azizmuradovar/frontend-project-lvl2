const buildObject = (arr) => {
  const result = arr.reduce((acc, item) => {
    const {
      name,
      children,
      type,
      value,
      oldValue,
      newValue,
    } = item;
    if (type === 'changed' && children) {
      acc[name] = buildObject(children);
    }
    if (type === 'changed' && !children) {
      acc[`- ${name}`] = oldValue;
      acc[`+ ${name}`] = newValue;
    }
    if (type === 'delete') {
      acc[`- ${name}`] = value;
    }
    if (type === 'add') {
      acc[`+ ${name}`] = value;
    }
    if (type === 'equal') {
      acc[name] = value;
    }
    return acc;
  }, {});
  return result;
};

const jsonFormatter = (tree) => JSON.stringify(buildObject(tree));

export default jsonFormatter;
