import yaml from 'js-yaml';
import ini from 'ini';

const getParser = (format) => {
  switch (format) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    case '.ini':
      return ini.parse;
    default:
      return JSON.parse;
  }
};

export default getParser;
