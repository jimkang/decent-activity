// var d3 = require('d3-selection');

function createReactToScroll(opts) {
  var inViewElementResponder;

  if (opts) {
    inViewElementResponder = opts.inViewElementResponder;
  }

  function reactToScroll() {
    var viewTop = document.body.scrollTop;
    console.log('window.innerHeight', window.innerHeight);
    var viewBottom = viewTop + window.innerHeight;

    var activities = document.querySelectorAll('.decent-activity');
    for (var i = 0; i < activities.length; ++i) {
      var activityEl = activities[i];
      if (centerIsVisible(viewTop, viewBottom, activityEl)) {
        inViewElementResponder(activityEl);
      }
    }
  }
  return reactToScroll;
}

function centerIsVisible(viewTop, viewBottom, el) {  
  var center = el.offsetTop + el.offsetHeight/2;

  // In Firefox SVGs will not have these properties.
  if ((el.offsetTop === undefined || el.offsetHeight === undefined) &&
    el.nodeName === 'svg') {

    center = el.parentNode.offsetTop + el.parentNode.offsetHeight/2;
  }
  if (center > viewTop && center < viewBottom) {
    console.log(center, viewTop, viewBottom);
  }

  return (center > viewTop && center < viewBottom);
}

module.exports = createReactToScroll;
