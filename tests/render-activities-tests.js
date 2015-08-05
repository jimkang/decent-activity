var test = require('tape');
var createRenderActivities = require('../lib/render-activities');
var jsonfile = require('jsonfile');
var jsdom = require('jsdom');
var d3 = require('d3-selection');
var restoreDate = require('./fixtures/restore-date');
var _ = require('lodash');

var activities = jsonfile.readFileSync(
  __dirname + '/fixtures/activities-to-render.json'
);
activities = activities.map(restoreDate);

function findActivityForStamp(stamp) {
  return _.find(activities, activityStampMatchesStamp);

  function activityStampMatchesStamp(activity) {
    return activity.stamp === stamp;
  }
}

test('Render activities under the root by date', function renderTest(t) {
  var document = jsdom.jsdom(
    '<div id="outer">' +
      'Hi!' +
      '<div id="inner"></div>' +
      '<span id="other">That\'s the activities!</span>' +
    '</div>'
  );

  var body = d3.select(document.body);
  var root = body.select('#inner').node();

  var renderActivities = createRenderActivities({
    d3: d3,
    activityClass: 'activity'
  });

  renderActivities({
    root: root,
    activities: activities
  });

  var activityEls = body.selectAll('.activity');
  t.equal(activityEls.size(), 5, 'Renders an element for each activity.');

  var lastStampChecked = new Date();
  activityEls.each(checkActivityEl);

  function checkActivityEl(d, i) {
    activityEl = d3.select(this);

    t.ok(
      d.stamp < lastStampChecked,
      'Activity stamp precedes the previous activity stamp.'
    );
    lastStampChecked = d.stamp;

    var correspondingActivity = findActivityForStamp(d.stamp);
    t.equal(
      activityEl.html(),
      correspondingActivity.html,
      'Activity element contains the expected html.'
    );
  }

  t.end();
});

// TODO: Put in its own module.
