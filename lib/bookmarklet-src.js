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

console.log('This is happening.');

// TODO: Get user id via scraping.
var iframe = loadInIFrame(
  document, 'http://metafilter.com/usercontacts/44769/contacted-by/'
);
debugger;

//getMutualContactURLs
