var test = require('tape');
var getActivitiesFromHTML = require('../lib/get-activities-from-html');
var fs = require('fs');
var jsonfile = require('jsonfile');
var restoreDate = require('./fixtures/restore-date');

var validIdRegex = /^\w+-\d+-\d+$/;

var userActivityHTML = fs.readFileSync(
  __dirname + '/fixtures/user-activity-24-hour-clock.html',
  {
    encoding: 'utf8'
  }
);

test('Parse test', function parseTest(t) {
  t.plan(50 * 3);
  var activities = getActivitiesFromHTML(userActivityHTML);
  activities.forEach(checkActivity);

  function checkActivity(activity, i) {
    t.ok(activity.stamp.getTime() > 0, 'Parses activity stamp.');
    t.ok(activity.html && activity.html.length > 0, 'Parses activity html.');
    t.ok(activity.id.match(validIdRegex), 'Activity has an proper id.');
  }
});
