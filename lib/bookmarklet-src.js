var getMutualContactsFromURL = require('./get-mutual-contacts-from-url');
var createActivitiesStream = require('./activities-stream');
var waterfall = require('async-waterfall');
var makeRequest = require('basic-browser-request');
var getActivitiesFromHTML = require('./get-activities-from-html');

// TODO: Get user id via scraping.
var contactsURL = 'http://metafilter.com/usercontacts/44769/contacted-by/';

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

  activitiesStream.on('data', renderActivities);
  activitiesStream.on('error', report);

  userIds.forEach(pushUserIdOntoStream);

  function pushUserIdOntoStream(userId) {
    activitiesStream.write(userId);
  }
}

function renderActivities(activities) {
  console.log('render', activities);
}

function report(error) {
  if (error) {
    console.log(error);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}
