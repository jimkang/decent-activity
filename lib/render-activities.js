var accessor = require('accessor');
var activityAIsOlderThanActivityB = require('./activity-comparators').activityAIsOlderThanActivityB;

function createRenderActivities(createOpts) {
  var d3;
  var activityClass = 'activity';

  if (createOpts) {
    d3 = createOpts.d3;
    activityClass = createOpts.activityClass;
  }

  function renderActivities(opts) {
    var root;
    var activities;

    if (opts) {
      root = d3.select(opts.root);
      activities = opts.activities;
    }

    activities = activities.sort(activityAIsOlderThanActivityB);

    var update = root.selectAll('.' + activityClass)
      .data(activities, accessor());

    update.enter().append('div').classed(activityClass, true);
    update.each(renderActivityContents);
    update.exit().remove();
  }

  function renderActivityContents(d) {
    d3.select(this).html(d.html);
  }

  return renderActivities;
}

module.exports = createRenderActivities;
