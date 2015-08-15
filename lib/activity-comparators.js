// If A is older than B, A should go last (have a higher index in the array).
function compareActivitiesByStamp(a, b) {
  return a.stamp < b.stamp ? 1 : -1;
}

function activitiesAreEqual(a, b) {
  return a.id === b.id;
}

module.exports = {
  compareActivitiesByStamp: compareActivitiesByStamp,
  activitiesAreEqual: activitiesAreEqual
};
