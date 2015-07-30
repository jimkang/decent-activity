(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYm9va21hcmtsZXQtc3JjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHZhciBjcmVhdGVNb2R1bGUgPSByZXF1aXJlKCcuL3lldC1hbm90aGVyLWJvb2ttYXJrbGV0L2luZGV4JykuY3JlYXRlO1xuXG4vLyB2YXIgdHJhbnNmb3JtRnVuY3Rpb24gPSBjcmVhdGVNb2R1bGUoKTtcblxuLy8gZnVuY3Rpb24gZ2V0QWxsTm9kZXNXaXRoVGV4dCgpIHtcbi8vICAgdmFyIGFsbE5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYm9keSAqJyk7XG4vLyAgIHZhciBub2Rlc1dpdGhUZXh0ID0gW107XG5cbi8vICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7ICsraSkge1xuLy8gICAgIHZhciBub2RlID0gYWxsTm9kZXNbaV07XG4vLyAgICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0JSJyAmJlxuLy8gICAgICAgbm9kZS5pbm5lclRleHQgJiZcbi8vICAgICAgICghbm9kZS5jaGlsZHJlbiB8fCBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkpIHtcblxuLy8gICAgICAgbm9kZXNXaXRoVGV4dC5wdXNoKG5vZGUpO1xuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIHJldHVybiBub2Rlc1dpdGhUZXh0O1xuLy8gfVxuXG4vLyB2YXIgbm9kZXNXaXRoVGV4dCA9IGdldEFsbE5vZGVzV2l0aFRleHQoKTtcblxuLy8gbm9kZXNXaXRoVGV4dC5mb3JFYWNoKHRyYW5zZm9ybSk7XG5cbi8vIGZ1bmN0aW9uIHRyYW5zZm9ybShub2RlKSB7XG4vLyAgIHRyYW5zZm9ybUZ1bmN0aW9uKG5vZGUuaW5uZXJUZXh0LCB1cGRhdGVOb2RlKTtcblxuLy8gICBmdW5jdGlvbiB1cGRhdGVOb2RlKGVycm9yLCB0ZXh0KSB7XG4vLyAgICAgaWYgKCFlcnJvcikge1xuLy8gICAgICAgbm9kZS5pbm5lclRleHQgPSB0ZXh0O1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG5mdW5jdGlvbiBnZXRNdXR1YWxDb250YWN0VVJMc0Zyb21Eb2MoZG9jKSB7XG4gIHZhciBsaW5rRWxzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ2EubXV0dWFsJyk7XG4gIHZhciB1cmxzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua0Vscy5sZW5ndGg7ICsraSkge1xuICAgIHVybHMucHVzaChsaW5rRWxzW2ldLmhyZWYpO1xuICB9XG4gIHJldHVybiB1cmxzO1xufVxuXG5mdW5jdGlvbiBsb2FkSW5JRnJhbWUoZG9jLCB1cmwpIHtcbiAgdmFyIGlmcmFtZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuICBpZnJhbWUuc3JjID0gdXJsO1xuICBpZnJhbWUud2lkdGggPSAwO1xuICBpZnJhbWUuaGVpZ2h0ID0gMDtcbiAgZG9jLmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgcmV0dXJuIGlmcmFtZTtcbn1cblxuY29uc29sZS5sb2coJ1RoaXMgaXMgaGFwcGVuaW5nLicpO1xuXG4vLyBUT0RPOiBHZXQgdXNlciBpZCB2aWEgc2NyYXBpbmcuXG52YXIgaWZyYW1lID0gbG9hZEluSUZyYW1lKFxuICBkb2N1bWVudCwgJ2h0dHA6Ly9tZXRhZmlsdGVyLmNvbS91c2VyY29udGFjdHMvNDQ3NjkvY29udGFjdGVkLWJ5Lydcbik7XG5kZWJ1Z2dlcjtcblxuLy9nZXRNdXR1YWxDb250YWN0VVJMc1xuIl19
