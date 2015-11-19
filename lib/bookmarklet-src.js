var getMutualContactsFromURL = require('./get-mutual-contacts-from-url');
var createActivitiesStream = require('./activities-stream');
var waterfall = require('async-waterfall');
var makeRequest = require('basic-browser-request');
var getActivitiesFromHTML = require('./get-activities-from-html');
var callNextTick = require('call-next-tick');
var establishHapsViewOnPage = require('./establish-haps-view-on-page');
var createRenderCurrentActivities = require('./render-current-activities');
var moment = require('moment');

var levelup = require('levelup');
var leveljs = require('level-js');
process.hrtime = require('browser-process-hrtime');
var LevelBatch = require('level-batch-stream');
var through2 = require('through2');

var db;
var renderCurrentActivities;

// TODO: Get user id via scraping.
var contactsURL = 'http://metafilter.com/usercontacts/44769/contacted-by/';

waterfall(
  [
    kickOff,
    startRenderer,
    getContacts,
    startStoringActivities
  ],
  report
);

function kickOff(done) {
  db = levelup(
    'haps',
    {
      db: leveljs,
      valueEncoding: 'json'
    }
  );

  var viewOpts = {
    olderButtonResponder: loadMoreOlderActivities,
    newerButtonResponder: loadMoreNewerActivities
  };
  establishHapsViewOnPage(viewOpts, done);
}

function startRenderer(root, done) {
  renderCurrentActivities = createRenderCurrentActivities({
    activityRoot: root,
    db: db
  });

  db.on('batch', runRender);

  runRender();
  callNextTick(done);

  function runRender() {
    renderCurrentActivities(
      {
        range: [
          moment().subtract(1, 'days').startOf('day').toISOString(),
          (new Date()).toISOString()      
        ]
      },
      reportRenderDone
    );
  }

  function reportRenderDone(error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('Render complete.');
    }
  }
}

function getContacts(done) {
  getMutualContactsFromURL(contactsURL, done);
}

function startStoringActivities(userIds, done) {
  var activitiesStream = createActivitiesStream({
    makeRequest: makeRequest,
    getActivitiesFromHTML: getActivitiesFromHTML
  });

  activitiesStream.on('error', report);
  activitiesStream.on('end', checkDb); //done);

  activitiesStream
    .pipe(through2(
      {
        objectMode: true
      },
      function makeCommandBatch(activities, enc, cb) {
        var batch = activities.map(levelCmdForActivity);
        cb(null, batch);
      }
    ))
    .pipe(new LevelBatch(db));

  userIds.forEach(pushUserIdOntoStream);
  callNextTick(done);

  function pushUserIdOntoStream(userId) {
    activitiesStream.write(userId);
  }

  function levelCmdForActivity(activity) {
    return {
      type: 'put',
      key: activity.stamp.toISOString(),
      value: activity
    };
  }

  function checkDb() {
    debugger;
    db.createValueStream()
    .on('data', function (data) {
      console.log('value=', data)
    });
  }
}

// TODO: Make these work again.
function loadMoreOlderActivities() {
  arrayViewfinder.shift(10);
  renderCurrentActivities();
}

function loadMoreNewerActivities() {
  arrayViewfinder.shift(-10);
  renderCurrentActivities();
}

function report(error) {
  if (error) {
    console.log(error);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}
