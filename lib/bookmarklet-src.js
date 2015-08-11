var getMutualContactsFromURL = require('./get-mutual-contacts-from-url');
var createActivitiesStream = require('./activities-stream');
var waterfall = require('async-waterfall');
var makeRequest = require('basic-browser-request');
var getActivitiesFromHTML = require('./get-activities-from-html');
var createRenderActivities = require('./render-activities');
var d3 = require('d3-selection');
var createArrayViewfinder = require('array-viewfinder');
var comparators = require('./activity-comparators');

var arrayViewfinder = createArrayViewfinder({
  array: [],
  viewSize: 50,
  valueEqualityFn: comparators.activitiesAreEqual
});

// TODO: Get user id via scraping.
var contactsURL = 'http://metafilter.com/usercontacts/44769/contacted-by/';

// TODO: Create a root.
var activityRoot = d3.select('.content').node();

var renderActivities = createRenderActivities({
  d3: d3,
  activityClass: 'mefi-haps-activity'
});

waterfall(
  [
    kickOff,
    streamActivities
  ],
  report
);

function kickOff(done) {
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
}

function updateActivities(activities) {
  var allActivities = arrayViewfinder.getWholeArray().concat(activities);
  allActivities = allActivities.sort(comparators.activityAIsOlderThanActivityB);
  arrayViewfinder.update(allActivities);

  renderActivities({
    root: activityRoot,
    activities: arrayViewfinder.view()
  });
  // console.log('render', activities);
}

function report(error) {
  if (error) {
    console.log(error);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}
