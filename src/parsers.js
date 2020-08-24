import yaml from 'js-yaml';

const getParser = (format) => {
  switch (format) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    default:
      return JSON.parse;
  }
};

export default getParser;
