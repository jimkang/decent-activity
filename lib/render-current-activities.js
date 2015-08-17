// Renders the current arrayFinderView.

var createRenderActivities = require('./render-activities');
var d3 = require('d3-selection');

function createRenderCurrentActivities(createOpts) {
  var activityRoot;
  var arrayViewfinder;

  if (createOpts) {
    activityRoot = createOpts.activityRoot;
    arrayViewfinder = createOpts.arrayViewfinder;
  }

  var renderActivities = createRenderActivities({
    d3: d3,
    activityClass: 'mefi-haps-activity'
  });

  function renderCurrentActivities() {
    renderActivities({
      root: activityRoot,
      activities: arrayViewfinder.view()
    });
  }
  
  return renderCurrentActivities;
}

module.exports = createRenderCurrentActivities;
