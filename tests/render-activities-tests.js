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

function aStampIsOlderThanBStamp(a, b) {
  return a.stamp < b.stamp;
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
  t.equal(
    activityEls.size(),
    activities.length,
    'Renders an element for each activity.'
  );

  var lastStampChecked = new Date();
  activityEls.each(checkActivityEl);

  function checkActivityEl(d, i) {
    var activityRaw = this;
    var activityEl = d3.select(activityRaw);

    t.ok(
      d.stamp < lastStampChecked,
      'Activity stamp precedes the previous activity stamp.'
    );
    lastStampChecked = d.stamp;

    t.ok(activityEl.class('activity'), 'Element has activityClass.');

    var correspondingActivity = findActivityForStamp(d.stamp);
    t.equal(
      activityEl.html(),
      correspondingActivity.html,
      'Activity element contains the expected html.'
    );
  }

  t.end();
});

test('Rendered DOM matches data', function enterExitTest(t) {
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

  var activityGroup1 = activities.slice(0, 3);
  var activityGroup2 = activities.slice(2, 4);
  var activityGroup3 = activities.slice(4);

  [activityGroup1, activityGroup2, activityGroup3].forEach(testGroup);

  function testGroup(activityGroup) {
    renderActivities({
      root: root,
      activities: activityGroup
    });

    var activityEls = body.selectAll('.activity');

    t.equal(
      activityEls.size(),
      activityGroup.length,
      'Renders an element for each activity.'
    );

    activityGroup = activityGroup.sort(aStampIsOlderThanBStamp);
    activityEls.each(checkActivityEl);

    function checkActivityEl(d, i) {
      var activityAtPosition = activityGroup[i];
      t.ok(d.id, 'Activity has an id.');
      t.equal(
        d.id, activityAtPosition.id, 'Activity is rendered in correct order.'
      );
      t.equal(
        d.html, activityAtPosition.html, 'HTML is correct for activity.'
      );
    }
  }

  t.end();
});
