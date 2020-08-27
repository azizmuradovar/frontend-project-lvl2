import _ from 'lodash';

export default (obj) => _.isObjectLike(obj) && !Array.isArray(obj);
