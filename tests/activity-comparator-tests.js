var test = require('tape');
var comparators = require('../lib/activity-comparators');
var _ = require('lodash');
var jsonfile = require('jsonfile');
var restoreDate = require('./fixtures/restore-date');

var unsortedActivities = jsonfile.readFileSync(
  __dirname + '/fixtures/unsorted-activities.json'
);
unsortedActivities = unsortedActivities.map(restoreDate);

var sortedActivities = jsonfile.readFileSync(
  __dirname + '/fixtures/sorted-activities.json'
);
sortedActivities = sortedActivities.map(restoreDate);

test('Sort with compareActivitiesByStamp', function sortTest(t) {
  var sorted = unsortedActivities.sort(comparators.compareActivitiesByStamp);
  // console.log(JSON.stringify(sorted, null, '  '));
  t.deepEqual(sorted, sortedActivities, 'Activities are sorted correctly.');

  t.end();
});
