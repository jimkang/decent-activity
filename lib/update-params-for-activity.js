function updateParamsForActivity(activity) {
  var params = {
    type: 'put',
    key: activity.stamp.toISOString(),
    value: activity
  };

  return params;
}

module.exports = updateParamsForActivity;
