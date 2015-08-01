var makeRequest = require('basic-browser-request');
var getMutualContactsFromHTML = require('./get-mutual-contacts-from-html');
var getActivitiesFromHTML = require('./get-activities-from-html');

// var async = require('async');

// var createModule = require('./yet-another-bookmarklet/index').create;

// var transformFunction = createModule();

// function getAllNodesWithText() {
//   var allNodes = document.querySelectorAll('body *');
//   var nodesWithText = [];

//   for (var i = 0; i < allNodes.length; ++i) {
//     var node = allNodes[i];
//     if (node.tagName !== 'BR' &&
//       node.innerText &&
//       (!node.children || node.children.length === 0)) {

//       nodesWithText.push(node);
//     }
//   }

//   return nodesWithText;
// }

// var nodesWithText = getAllNodesWithText();

// nodesWithText.forEach(transform);

// function transform(node) {
//   transformFunction(node.innerText, updateNode);

//   function updateNode(error, text) {
//     if (!error) {
//       node.innerText = text;
//     }
//   }
// }


// function loadInIFrame(doc, url) {
//   var iframe = doc.createElement('iframe')
//   iframe.src = url;
//   iframe.width = 0;
//   iframe.height = 0;
//   doc.body.appendChild(iframe);
//   return iframe;
// }

// TODO: Get user id via scraping.
var contactsURL = 'http://metafilter.com/usercontacts/44769/contacted-by/';

getMutualContactsFromURL(contactsURL, getActivityForContacts);

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

function getActivityForContacts(error, contactIds, done) {
  if (error) {
    report(error);
  }
  else {
    var activityURLs = contactIds.map(getCommentActivityURLForUserId);

    makeRequest(
      {
        url: activityURLs[0],
        method: 'GET',
        mimeType: 'text/html'
      },
      extractActivities
    );
  }

  function extractActivities(error, html) {
    if (error) {
      done(error);
    }
    else {
      done(error, getActivitiesFromHTML(html));
    }
  }
}

function getCommentActivityURLForUserId(id) {
  return 'http://www.metafilter.com/activity/' + id + '/comments/';
}

function report(error) {
  console.log(error);
  if (error.stack) {
    console.log(error.stack);
  }
}
