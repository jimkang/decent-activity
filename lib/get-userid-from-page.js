var callNextTick = require('call-next-tick');
var userIdRegex = /^\d+$/;

function getUserIdFromPage(doc, done) {
  var profileLink = doc.querySelector('.profile a');
  if (!profileLink) {
    callNextTick(done, new Error('Could not find profile link.'));
    return;
  }

  var profileURLParts = profileLink.href.split('/');
  if (profileURLParts.length < 1) {
    callNextTick(done, new Error('Could not find user id in profile.'));
    return;
  }

  var userId = profileURLParts[profileURLParts.length - 1];
  if (userId.match(userIdRegex)) {
    callNextTick(done, null, userId);
  }
  else {
    callNextTick(done, new Error('Could not find valid user id in profile.'));
  }
}

module.exports = getUserIdFromPage;
