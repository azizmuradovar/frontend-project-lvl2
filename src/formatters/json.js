const buildObject = (arr) => {
  const result = arr.reduce((acc, item) => {
    const {
      key,
      children,
      type,
      valueBefore,
      valueAfter,
    } = item;
    switch (type) {
      case 'added':
        return { ...acc, [`+ ${key}`]: valueAfter };
      case 'deleted':
        return { ...acc, [`- ${key}`]: valueBefore };
      case 'parent':
        return { ...acc, [key]: buildObject(children) };
      case 'unchanged':
        return { ...acc, [key]: valueBefore };
      case 'changed':
        return {
          ...acc,
          [`- ${key}`]: valueBefore,
          [`+ ${key}`]: valueAfter,
        };
      default:
        throw new Error(`Unknown type node ${type} for json parser`);
    }
  }, {});
  return result;
};

const jsonFormatter = (tree) => JSON.stringify(buildObject(tree));

export default jsonFormatter;
