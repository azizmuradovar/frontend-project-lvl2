import yaml from 'js-yaml';
import ini from 'ini';

export default (extname) => {
  switch (extname) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    case '.ini':
      return ini.parse;
    default:
      throw new Error(`Unknown Parser for '${extname}' type`);
  }
};
