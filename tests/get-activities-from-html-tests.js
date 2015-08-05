var test = require('tape');
var getActivitiesFromHTML = require('../lib/get-activities-from-html');
var fs = require('fs');
var jsonfile = require('jsonfile');
var restoreDate = require('./fixtures/restore-date');

var userActivityHTML = fs.readFileSync(
  __dirname + '/fixtures/user-activity.html',
  {
    encoding: 'utf8'
  }
);

var expectedActivities = jsonfile.readFileSync(
  __dirname + '/fixtures/expected-user-activity.json'
);

expectedActivities = expectedActivities.map(restoreDate);

test('Parse test', function parseTest(t) {
  t.plan(expectedActivities.length * 2);

  var activities = getActivitiesFromHTML(userActivityHTML);
  activities.forEach(checkActivity);

  function checkActivity(activity, i) {
    t.equal(
      activity.stamp.getTime(),
      expectedActivities[i].stamp.getTime(),
      'Parses activity stamp.'
    );
    t.equal(
      activity.html, expectedActivities[i].html, 'Parses activity html.'
    );
  }
});
