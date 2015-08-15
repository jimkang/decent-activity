var getMutualContactsFromURL = require('./get-mutual-contacts-from-url');
var createActivitiesStream = require('./activities-stream');
var waterfall = require('async-waterfall');
var makeRequest = require('basic-browser-request');
var getActivitiesFromHTML = require('./get-activities-from-html');
var createRenderActivities = require('./render-activities');
var d3 = require('d3-selection');
var createArrayViewfinder = require('array-viewfinder');
var comparators = require('./activity-comparators');
var callNextTick = require('call-next-tick');
var establishHapsViewOnPage = require('./establish-haps-view-on-page');

var arrayViewfinder = createArrayViewfinder({
  array: [],
  viewSize: 10,
  valueEqualityFn: comparators.activitiesAreEqual
});

// TODO: Get user id via scraping.
var contactsURL = 'http://metafilter.com/usercontacts/44769/contacted-by/';
var activityRoot;

var renderActivities = createRenderActivities({
  d3: d3,
  activityClass: 'mefi-haps-activity'
});

waterfall(
  [
    kickOff,
    getContacts,
    streamActivities
  ],
  report
);

function kickOff(done) {
  var viewOpts = {
    olderButtonResponder: loadMoreOlderActivities,
    newerButtonResponder: loadMoreNewerActivities
  };
  establishHapsViewOnPage(viewOpts, done);
}

function getContacts(root, done) {
  activityRoot = root;
  getMutualContactsFromURL(contactsURL, done);
}

function streamActivities(userIds, done) {
  var activitiesStream = createActivitiesStream({
    makeRequest: makeRequest,
    getActivitiesFromHTML: getActivitiesFromHTML
  });

  activitiesStream.on('data', updateActivities);
  activitiesStream.on('error', report);

  userIds.forEach(pushUserIdOntoStream);

  function pushUserIdOntoStream(userId) {
    activitiesStream.write(userId);
  }

  callNextTick(done);
}

function updateActivities(activities) {
  var allActivities = arrayViewfinder.getWholeArray().concat(activities);
  allActivities = allActivities.sort(comparators.compareActivitiesByStamp);
  arrayViewfinder.update(allActivities);

  renderCurrentView();
}

function renderCurrentView() {
  renderActivities({
    root: activityRoot,
    activities: arrayViewfinder.view()
  });
}

function loadMoreOlderActivities() {
  arrayViewfinder.shift(10);
  renderCurrentView();
}

function loadMoreNewerActivities() {
  arrayViewfinder.shift(-10);
  renderCurrentView();
}

function report(error) {
  if (error) {
    console.log(error);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}
