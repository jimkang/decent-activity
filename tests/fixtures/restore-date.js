function restoreDate(activity) {
  return {
    html: activity.html,
    stamp: new Date(activity.stamp)
  };
}

module.exports = restoreDate;
