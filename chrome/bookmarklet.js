(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"basic-browser-request":2}],2:[function(require,module,exports){
function createRequestMaker() {
  function makeRequest(opts, done) {
    opts = defaults(opts, {mimeType: 'application/json'});

    var xhr = new XMLHttpRequest();
    xhr.open(opts.method,  opts.url);
    if (opts.method === 'POST') {
      xhr.setRequestHeader('content-type', opts.mimeType);
    }
    else if (opts.method === 'GET') {
      xhr.setRequestHeader('accept', opts.mimeType);
    }

    var timeoutKey = null;

    xhr.onload = function requestDone() {
      clearTimeout(timeoutKey);
      
      if (this.status === 200) {

        var resultObject = this.responseText;
        if (opts.mimeType === 'application/json') {
          resultObject = JSON.parse(resultObject);
        }
        done(null, resultObject);
      }
      else {
        done(new Error('Error while making request. XHR status: ' + this.status));
      }
    };

    if (opts.onData) {
      var lastReadIndex = 0;
      xhr.onprogress = function progressReceived() {
        opts.onData(this.responseText.substr(lastReadIndex));
        lastReadIndex = this.responseText.length;
      };   
    }
   
    xhr.send(opts.method === 'POST' ? opts.body : undefined);

    if (opts.timeLimit > 0) {
      timeoutKey = setTimeout(cancelRequest, opts.timeLimit);
    }

    function cancelRequest() {
      xhr.abort();
      clearTimeout(timeoutKey);
      done(new Error('Timed out'));
    }

    return {
      url: opts.url,
      cancelRequest: cancelRequest
    };
  }

  // From Underscore, more or less.
  function defaults(obj, source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }  

  return {
    makeRequest: makeRequest
  };
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  var requestMaker = createRequestMaker();
  module.exports = requestMaker.makeRequest;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYm9va21hcmtsZXQtc3JjLmpzIiwibm9kZV9tb2R1bGVzL2Jhc2ljLWJyb3dzZXItcmVxdWVzdC9iYXNpY3JlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtYWtlUmVxdWVzdCA9IHJlcXVpcmUoJ2Jhc2ljLWJyb3dzZXItcmVxdWVzdCcpO1xuLy8gdmFyIGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKTtcblxuLy8gdmFyIGNyZWF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4veWV0LWFub3RoZXItYm9va21hcmtsZXQvaW5kZXgnKS5jcmVhdGU7XG5cbi8vIHZhciB0cmFuc2Zvcm1GdW5jdGlvbiA9IGNyZWF0ZU1vZHVsZSgpO1xuXG4vLyBmdW5jdGlvbiBnZXRBbGxOb2Rlc1dpdGhUZXh0KCkge1xuLy8gICB2YXIgYWxsTm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdib2R5IConKTtcbi8vICAgdmFyIG5vZGVzV2l0aFRleHQgPSBbXTtcblxuLy8gICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgKytpKSB7XG4vLyAgICAgdmFyIG5vZGUgPSBhbGxOb2Rlc1tpXTtcbi8vICAgICBpZiAobm9kZS50YWdOYW1lICE9PSAnQlInICYmXG4vLyAgICAgICBub2RlLmlubmVyVGV4dCAmJlxuLy8gICAgICAgKCFub2RlLmNoaWxkcmVuIHx8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSkge1xuXG4vLyAgICAgICBub2Rlc1dpdGhUZXh0LnB1c2gobm9kZSk7XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgcmV0dXJuIG5vZGVzV2l0aFRleHQ7XG4vLyB9XG5cbi8vIHZhciBub2Rlc1dpdGhUZXh0ID0gZ2V0QWxsTm9kZXNXaXRoVGV4dCgpO1xuXG4vLyBub2Rlc1dpdGhUZXh0LmZvckVhY2godHJhbnNmb3JtKTtcblxuLy8gZnVuY3Rpb24gdHJhbnNmb3JtKG5vZGUpIHtcbi8vICAgdHJhbnNmb3JtRnVuY3Rpb24obm9kZS5pbm5lclRleHQsIHVwZGF0ZU5vZGUpO1xuXG4vLyAgIGZ1bmN0aW9uIHVwZGF0ZU5vZGUoZXJyb3IsIHRleHQpIHtcbi8vICAgICBpZiAoIWVycm9yKSB7XG4vLyAgICAgICBub2RlLmlubmVyVGV4dCA9IHRleHQ7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbmZ1bmN0aW9uIGdldE11dHVhbENvbnRhY3RVUkxzRnJvbURvYyhkb2MpIHtcbiAgdmFyIGxpbmtFbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbCgnYS5tdXR1YWwnKTtcbiAgdmFyIHVybHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5rRWxzLmxlbmd0aDsgKytpKSB7XG4gICAgdXJscy5wdXNoKGxpbmtFbHNbaV0uaHJlZik7XG4gIH1cbiAgcmV0dXJuIHVybHM7XG59XG5cbmZ1bmN0aW9uIGxvYWRJbklGcmFtZShkb2MsIHVybCkge1xuICB2YXIgaWZyYW1lID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG4gIGlmcmFtZS5zcmMgPSB1cmw7XG4gIGlmcmFtZS53aWR0aCA9IDA7XG4gIGlmcmFtZS5oZWlnaHQgPSAwO1xuICBkb2MuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICByZXR1cm4gaWZyYW1lO1xufVxuXG5mdW5jdGlvbiBnZXRET01Gcm9tVVJMKHVybCwgZG9uZSkge1xuICBtYWtlUmVxdWVzdChcbiAgICB7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBtaW1lVHlwZTogJ3RleHQvaHRtbCcsXG4gICAgfSxcbiAgICBtYWtlRE9NV2l0aEhUTUxcbiAgKTtcblxuICBmdW5jdGlvbiBtYWtlRE9NV2l0aEhUTUwoZXJyb3IsIGh0bWwpIHsgIFxuICAgIGRvbmUoZXJyb3IsIGh0bWwpO1xuICB9XG59XG5cbmNvbnNvbGUubG9nKCdUaGlzIGlzIGhhcHBlbmluZy4nKTtcblxuLy8gVE9ETzogR2V0IHVzZXIgaWQgdmlhIHNjcmFwaW5nLlxudmFyIGNvbnRhY3RzVVJMID0gJ2h0dHA6Ly9tZXRhZmlsdGVyLmNvbS91c2VyY29udGFjdHMvNDQ3NjkvY29udGFjdGVkLWJ5Lyc7XG5cbmdldERPTUZyb21VUkwoY29udGFjdHNVUkwsIGdldEFjdGl2aXR5Rm9yQ29udGFjdHMpO1xuXG5mdW5jdGlvbiBnZXRBY3Rpdml0eUZvckNvbnRhY3RzKGVycm9yLCBjb250YWN0c0hUTUwpIHtcbiAgaWYgKGVycm9yKSB7XG4gICAgcmVwb3J0KGVycm9yKTtcbiAgfVxuICBlbHNlIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICBnZXRNdXR1YWxDb250YWN0VVJMc0Zyb21Eb2MoKTtcbiAgfVxufVxuXG5kZWJ1Z2dlcjtcblxuLy9nZXRNdXR1YWxDb250YWN0VVJMc1xuXG5mdW5jdGlvbiByZXBvcnQoZXJyb3IpIHtcbiAgY29uc29sZS5sb2coZXJyb3IpO1xuICBpZiAoZXJyb3Iuc3RhY2spIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjayk7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3RNYWtlcigpIHtcbiAgZnVuY3Rpb24gbWFrZVJlcXVlc3Qob3B0cywgZG9uZSkge1xuICAgIG9wdHMgPSBkZWZhdWx0cyhvcHRzLCB7bWltZVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKG9wdHMubWV0aG9kLCAgb3B0cy51cmwpO1xuICAgIGlmIChvcHRzLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignY29udGVudC10eXBlJywgb3B0cy5taW1lVHlwZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdHMubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ2FjY2VwdCcsIG9wdHMubWltZVR5cGUpO1xuICAgIH1cblxuICAgIHZhciB0aW1lb3V0S2V5ID0gbnVsbDtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiByZXF1ZXN0RG9uZSgpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0S2V5KTtcbiAgICAgIFxuICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICB2YXIgcmVzdWx0T2JqZWN0ID0gdGhpcy5yZXNwb25zZVRleHQ7XG4gICAgICAgIGlmIChvcHRzLm1pbWVUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgICAgICByZXN1bHRPYmplY3QgPSBKU09OLnBhcnNlKHJlc3VsdE9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgZG9uZShudWxsLCByZXN1bHRPYmplY3QpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRvbmUobmV3IEVycm9yKCdFcnJvciB3aGlsZSBtYWtpbmcgcmVxdWVzdC4gWEhSIHN0YXR1czogJyArIHRoaXMuc3RhdHVzKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChvcHRzLm9uRGF0YSkge1xuICAgICAgdmFyIGxhc3RSZWFkSW5kZXggPSAwO1xuICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBwcm9ncmVzc1JlY2VpdmVkKCkge1xuICAgICAgICBvcHRzLm9uRGF0YSh0aGlzLnJlc3BvbnNlVGV4dC5zdWJzdHIobGFzdFJlYWRJbmRleCkpO1xuICAgICAgICBsYXN0UmVhZEluZGV4ID0gdGhpcy5yZXNwb25zZVRleHQubGVuZ3RoO1xuICAgICAgfTsgICBcbiAgICB9XG4gICBcbiAgICB4aHIuc2VuZChvcHRzLm1ldGhvZCA9PT0gJ1BPU1QnID8gb3B0cy5ib2R5IDogdW5kZWZpbmVkKTtcblxuICAgIGlmIChvcHRzLnRpbWVMaW1pdCA+IDApIHtcbiAgICAgIHRpbWVvdXRLZXkgPSBzZXRUaW1lb3V0KGNhbmNlbFJlcXVlc3QsIG9wdHMudGltZUxpbWl0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5jZWxSZXF1ZXN0KCkge1xuICAgICAgeGhyLmFib3J0KCk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dEtleSk7XG4gICAgICBkb25lKG5ldyBFcnJvcignVGltZWQgb3V0JykpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cmw6IG9wdHMudXJsLFxuICAgICAgY2FuY2VsUmVxdWVzdDogY2FuY2VsUmVxdWVzdFxuICAgIH07XG4gIH1cblxuICAvLyBGcm9tIFVuZGVyc2NvcmUsIG1vcmUgb3IgbGVzcy5cbiAgZnVuY3Rpb24gZGVmYXVsdHMob2JqLCBzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfSAgXG5cbiAgcmV0dXJuIHtcbiAgICBtYWtlUmVxdWVzdDogbWFrZVJlcXVlc3RcbiAgfTtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgdmFyIHJlcXVlc3RNYWtlciA9IGNyZWF0ZVJlcXVlc3RNYWtlcigpO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3RNYWtlci5tYWtlUmVxdWVzdDtcbn1cbiJdfQ==
