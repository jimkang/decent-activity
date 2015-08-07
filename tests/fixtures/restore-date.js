var _ = require('lodash');

function restoreDate(activity) {
  var copy = _.cloneDeep(activity);
  copy.stamp = new Date(activity.stamp);
  return copy;
}

module.exports = restoreDate;
