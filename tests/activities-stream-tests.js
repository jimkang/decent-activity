var test = require('tape');
var createActivitiesStream = require('../lib/activities-stream');
var fs = require('fs');
var jsonfile = require('jsonfile');
var Stream = require('stream');
var callNextTick = require('call-next-tick');

function mockMakeRequest(opts, done) {
  var html = '<div>HTML for: ' + opts.url + '</div>';
  callNextTick(done, null, html);
}

function mockGetActivitiesFromHTML(html) {
  return [
    {
      html: '<div>first activity from</div>\n' + html,
      stamp: new Date()
    },
    {
      html: '<div>second activity from</div>\n' + html,
      stamp: new Date()
    },
    {
      html: '<div>third activity from</div>\n' + html,
      stamp: new Date()
    }
  ];
}

test('Stream test', function streamTest(t) {
  var currentId = 0;
  var maxIds = 50;

  t.plan(maxIds * 7 + 1);  
  
  var activitiesStream = createActivitiesStream({
    makeRequest: mockMakeRequest,
    getActivitiesFromHTML: mockGetActivitiesFromHTML
  });

  var checkerStream = Stream.Writable({objectMode: true});
  checkerStream._write = function checkActivities(activityGroup, enc, next) {
    t.ok(
      activityGroup.length === 3,
      'activityGroup with three activities streamed.'
    );
    activityGroup.forEach(checkActivity);

    next();
  };

  function checkActivity(activity) {
    t.ok(activity.html.length > 0, 'activity has html.');
    t.ok(activity.stamp instanceof Date, 'activity has a valid stamp.');
  }

  var contactIdStream = Stream.Readable();
  contactIdStream._read = function getNextId() {
    if (currentId < maxIds) {
      contactIdStream.push(currentId.toString());
      currentId += 1;
    }
    else {
      contactIdStream.push(null);
    }
  };
 
  contactIdStream.pipe(activitiesStream);
  activitiesStream.pipe(checkerStream);

  activitiesStream.on('end', noteStreamEnded);

  function noteStreamEnded() {
    t.pass('Activities stream ended.');
  }
});
