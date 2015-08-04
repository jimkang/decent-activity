function createGetActivitiesForContact(opts) {
  var getActivitiesFromHTML;
  var makeRequest;

  if (opts) {
    getActivitiesFromHTML = opts.getActivitiesFromHTML;
    makeRequest = opts.makeRequest;
  }

  function getActivitiesForContact(contactId, done) {
    makeRequest(
      {
        url: getCommentActivityURLForUserId(contactId),
        method: 'GET',
        mimeType: 'text/html'
      },
      extractActivities
    );

    function extractActivities(error, html) {
      if (error) {
        done(error);
      }
      else {
        done(error, getActivitiesFromHTML(html));
      }
    }
  }

  return getActivitiesForContact;
}

function getCommentActivityURLForUserId(id) {
  return 'http://www.metafilter.com/activity/' + id + '/comments/';
}

module.exports = createGetActivitiesForContact;
