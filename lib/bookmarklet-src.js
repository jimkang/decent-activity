var getMutualContactsFromURL = require('./get-mutual-contacts-from-url');
var createActivitiesStream = require('./activities-stream');
var waterfall = require('async-waterfall');
var makeRequest = require('basic-browser-request');
var getActivitiesFromHTML = require('./get-activities-from-html');
var callNextTick = require('call-next-tick');
var clearContent = require('./clear-content');
var createRenderCurrentActivities = require('./render-current-activities');
var createReactToScroll = require('./react-to-scroll');
var createElementScrollResponder = require('./respond-to-element-entering-view');
var updateParamsForActivity = require('./update-params-for-activity');
var throttle = require('lodash.throttle');
var queue = require('queue-async');
var DateRanger = require('date-ranger');
var moment = require('moment');
var getUserIdFromPage = require('./get-userid-from-page');
var renderNavBar = require('./render-nav-bar');

var levelup = require('levelup');
var leveljs = require('level-js');
process.hrtime = require('browser-process-hrtime');
var LevelBatch = require('level-batch-stream');
var through2 = require('through2');

var dateRanger = DateRanger({
  futureLimit: moment().add(1, 'days')
});

var renderCurrentActivities;
var db;
var contactsURL;
var waitingForFirstActivityFromNetwork = true;

waterfall(
  [
    kickOff,
    setUp,
    clearContent,
    runNavBarRender,
    startActvitiesRenderer,
    getContacts,
    startStoringActivities
  ],
  report
);

function kickOff(done) {
  getUserIdFromPage(document, done);  
}

function setUp(userId, done) {
  contactsURL = '//www.metafilter.com/usercontacts/' + userId +
    '/contacted-by/';

  db = levelup(
    'haps',
    {
      db: leveljs,
      valueEncoding: 'json'
    }
  );

  var viewOpts = {
    olderButtonResponder: shiftViewToPreviousDay,
    newerButtonResponder: shiftViewToNextDay,
    dateRanger: dateRanger
  };

  callNextTick(done);
}

function runNavBarRender(done) {
  var opts = {
    activityRoot: document.querySelector('#posts'),
    olderButtonResponder: shiftViewToPreviousDay,
    newerButtonResponder: shiftViewToNextDay,
    dateRanger: dateRanger
  };
  
  if (waitingForFirstActivityFromNetwork) {
    opts.notice = "Waiting for activity to arrive from MetaFilter…";
  }

  renderNavBar(opts, done);
}

function noteFirstActivityHasArrived() {
  waitingForFirstActivityFromNetwork = false;
  runNavBarRender(report);
}

function startActvitiesRenderer(done) {
  renderCurrentActivities = createRenderCurrentActivities({
    activityRoot: document.querySelector('#posts'),
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

  runRender(done);
}

function runRender(done) {
  if (typeof done !== 'function') {
    done = reportRenderDone;
  }

  renderCurrentActivities(
    {
      range: dateRanger.getCurrentRangeStrings()
    },
    done
  );
}

function reportRenderDone(error) {
  if (error) {
    console.log(error);
  }
  // else {
  //   console.log('Render complete.');
  // }
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

  activitiesStream.on('data', notifyActivityReceived);

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

  function notifyActivityReceived() {
    noteFirstActivityHasArrived();
    activitiesStream.removeListener('data', notifyActivityReceived);
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

function shiftViewToPreviousDay() {
  dateRanger.shift({
    days: -1
  });
  waterfall([
    runRender,
    runNavBarRender
  ]);
}

function shiftViewToNextDay() {
  dateRanger.shift({
    days: 1
  });
  waterfall([
    runRender,
    runNavBarRender
  ]);
}

function report(error) {
  if (error) {
    console.log(error);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}
