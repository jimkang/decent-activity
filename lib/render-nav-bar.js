var d3 = require('d3-selection');
var callNextTick = require('call-next-tick');

function renderNavBar(opts, done) {
  var activityRoot;
  var olderButtonResponder;
  var newerButtonResponder;
  var dateRanger;

  if (opts) {
    activityRoot = d3.select(opts.activityRoot);
    olderButtonResponder = opts.olderButtonResponder;
    newerButtonResponder = opts.newerButtonResponder;
    dateRanger = opts.dateRanger;
  }

  var centerLabelText = 'Decent Activity for ' +
    dateRanger.getCurrentStartMoment().format('dddd, MMMM D');

  if (!activityRoot) {
    callNextTick(done, new Error('No activityRoot provided to renderButton.'));
    return;
  }

  // "Enter" elements.

  var navRoot = activityRoot.select('.decent-activity-nav-root');
  if (navRoot.empty()) {
    navRoot = activityRoot.append('div').class('decent-activity-nav-root', true);
  }

  var prevButton = navRoot.select('.prev-button');
  if (prevButton.empty()) {
    prevButton = navRoot.append('a')
      .html('&#10094; Previous Day')
      .on('click', olderButtonResponder)
      .class('prev-button', true)
      .class('haps-button', true);
  }

  var centerLabel = navRoot.select('.center-label');
  if (centerLabel.empty()) {
    centerLabel = navRoot.append('span')
      .class('center-label', true);
  }

  var nextButton = navRoot.select('.next-button');
  if (nextButton.empty()) {
    nextButton = navRoot.append('a')
      .html('Next Day &#10095;')
      .on('click', newerButtonResponder)
      .class('next-button', true)
      .class('haps-button', true);
  }

  // "Update" elements that need it.
  centerLabel.text(centerLabelText);

  callNextTick(done);
}

module.exports = renderNavBar;
