var makeRequest = require('basic-browser-request');
var getMutualContactsFromHTML = require('./get-mutual-contacts-from-html');

function getMutualContactsFromURL(url, done) {
  makeRequest(
    {
      url: url,
      method: 'GET',
      mimeType: 'text/html'
    },
    extractContacts
  );

  function extractContacts(error, html) {
    if (error) {
      done(error);
    }
    else {
      done(error, getMutualContactsFromHTML(html));
    }
  }
}

module.exports = getMutualContactsFromURL;
