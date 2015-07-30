var makeRequest = require('basic-browser-request');
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

function getMutualContactURLsFromDoc(doc) {
  var linkEls = doc.querySelectorAll('a.mutual');
  var urls = [];
  for (var i = 0; i < linkEls.length; ++i) {
    urls.push(linkEls[i].href);
  }
  return urls;
}

function loadInIFrame(doc, url) {
  var iframe = doc.createElement('iframe')
  iframe.src = url;
  iframe.width = 0;
  iframe.height = 0;
  doc.body.appendChild(iframe);
  return iframe;
}

function getDOMFromURL(url, done) {
  makeRequest(
    {
      url: url,
      method: 'GET',
      mimeType: 'text/html',
    },
    makeDOMWithHTML
  );

  function makeDOMWithHTML(error, html) {  
    done(error, html);
  }
}

console.log('This is happening.');

// TODO: Get user id via scraping.
var contactsURL = 'http://metafilter.com/usercontacts/44769/contacted-by/';

getDOMFromURL(contactsURL, getActivityForContacts);

function getActivityForContacts(error, contactsHTML) {
  if (error) {
    report(error);
  }
  else {
    debugger;
    getMutualContactURLsFromDoc();
  }
}

debugger;

//getMutualContactURLs

function report(error) {
  console.log(error);
  if (error.stack) {
    console.log(error.stack);
  }
}
