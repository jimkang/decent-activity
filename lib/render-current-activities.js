// Renders the current arrayFinderView.

var createRenderActivities = require('./render-activities');
var d3 = require('d3-selection');

function createRenderCurrentActivities(createOpts) {
  var activityRoot;
  var db;  

  if (createOpts) {
    activityRoot = createOpts.activityRoot;
    db = createOpts.db;
  }

  var renderActivities = createRenderActivities({
    d3: d3,
    activityClass: 'decent-activity'
  });

  function renderCurrentActivities(opts, done) {
    var range;
    if (opts) {
      range = opts.range;
    }

    var activities = [];

    var activityStream = db.createValueStream({
      gte: range[0],
      lte: range[1]
    });

    activityStream.on('data', saveActivity);
    activityStream.on('error', done);
    activityStream.on('end', callRender);

    function saveActivity(activity) {
      activity.stamp = new Date(activity.stamp);
      activities.unshift(activity);
    }

    function callRender() {
      renderActivities({
        root: activityRoot,
        activities: activities
      });
      done();
    }
  }
  
  return renderCurrentActivities;
}

module.exports = createRenderCurrentActivities;
