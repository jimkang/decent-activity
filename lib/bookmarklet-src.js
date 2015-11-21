var getMutualContactsFromURL = require('./get-mutual-contacts-from-url');
var createActivitiesStream = require('./activities-stream');
var waterfall = require('async-waterfall');
var makeRequest = require('basic-browser-request');
var getActivitiesFromHTML = require('./get-activities-from-html');
var callNextTick = require('call-next-tick');
var establishHapsViewOnPage = require('./establish-haps-view-on-page');
var createRenderCurrentActivities = require('./render-current-activities');
var createReactToScroll = require('./react-to-scroll');
var createElementScrollResponder = require('./respond-to-element-entering-view');
var updateParamsForActivity = require('./update-params-for-activity');
var throttle = require('lodash.throttle');
var queue = require('queue-async');
var DateRanger = require('date-ranger');

var levelup = require('levelup');
var leveljs = require('level-js');
process.hrtime = require('browser-process-hrtime');
var LevelBatch = require('level-batch-stream');
var through2 = require('through2');

var dateRanger = DateRanger();
var renderCurrentActivities;
var db;

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
    olderButtonResponder: shiftViewToPreviousDay,
    newerButtonResponder: shiftViewToNextDay
  };

  establishHapsViewOnPage(viewOpts, done);
}

function startRenderer(root, done) {
  renderCurrentActivities = createRenderCurrentActivities({
    activityRoot: root,
    db: db
  });

  var throttledRunRender = throttle(runRender, 1000);

  window.onscroll = createReactToScroll({
    inViewElementResponder: createElementScrollResponder({
      db: db,
      onUpdateDone: throttledRunRender
    })
  });  

  db.on('batch', throttledRunRender);

  runRender();
  callNextTick(done);
}

function runRender() {
  renderCurrentActivities(
    {
      range: dateRanger.getCurrentRangeStrings()
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

function getContacts(done) {
  getMutualContactsFromURL(contactsURL, done);
}

function startStoringActivities(userIds, done) {
  var activitiesStream = createActivitiesStream({
    makeRequest: makeRequest,
    getActivitiesFromHTML: getActivitiesFromHTML
  });

  var batchCommandStream = through2(
    {
      objectMode: true
    },
    createBatchUpdateCommands
  );

  activitiesStream.on('error', report);
  activitiesStream.on('end', checkDb);

  activitiesStream
    .pipe(batchCommandStream)
    .pipe(new LevelBatch(db));

  userIds.forEach(pushUserIdOntoStream);
  callNextTick(done);

  function pushUserIdOntoStream(userId) {
    activitiesStream.write(userId);
  }

  function checkDb() {
    debugger;
    // db.createValueStream()
    // .on('data', function (data) {
    //   console.log('value=', data)
    // });
  }
}

// Will *skip* creating update commands for activities that already exist in the
// database.
function createBatchUpdateCommands(activities, enc, cb) {
  var commands = [];

  var q = queue(10);
  activities.forEach(queueParamGen);
  q.awaitAll(passCommmands);

  function queueParamGen(activity) {
    q.defer(addUpdateParamsIfActivityIsNotSaved, activity);
  }

  function addUpdateParamsIfActivityIsNotSaved(activity, done) {
    activityIsSaved(activity, decideParams);

    function decideParams(error, isSaved) {
      if (error) {
        // Not stopping for errors.
        console.log(error, error.stack);
      }
      if (!isSaved) {
        commands.push(updateParamsForActivity(activity));
      }
      done(error);
    }
  }

  function passCommmands() {
    cb(null, commands);
  }
}

function activityIsSaved(activity, done) {
  db.get(activity.stamp.toISOString(), checkGet);
  var isSaved = false;

  function checkGet(error, value) {
    if (!error && value) {
      isSaved = true;
    }
    done(null, isSaved);
  }
}

// TODO: Make these work again.
function shiftViewToPreviousDay() {
  dateRanger.shift({
    days: -1
  });
  runRender();
}

function shiftViewToNextDay() {
  dateRanger.shift({
    days: 1
  });
  runRender();
}

function report(error) {
  if (error) {
    console.log(error);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}
