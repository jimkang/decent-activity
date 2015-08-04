var through2 = require('through2');
var createGetActivitiesForContact = require('./get-activities-for-contact');

function createActivitiesStream(opts) {
  var getActivitiesForContact = createGetActivitiesForContact(opts);

  return through2(
    {
      objectMode: true
    },
    transformUserIdToActivities
  );

  function transformUserIdToActivities(userId, encoding, done) {
    getActivitiesForContact(userId, pushActivities);
    var transform = this;

    function pushActivities(error, activities) {
      if (error) {
        done(error);
      }
      else {
        transform.push(activities);
        done();
      }
    }
  }
}

module.exports = createActivitiesStream;
