function activityAIsOlderThanActivityB(a, b) {
  return a.stamp < b.stamp;
}

function activitiesAreEqual(a, b) {
  return a.id === b.id;
}

module.exports = {
  activityAIsOlderThanActivityB: activityAIsOlderThanActivityB,
  activitiesAreEqual: activitiesAreEqual
};
