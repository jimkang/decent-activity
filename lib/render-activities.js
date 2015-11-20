var accessor = require('accessor');

var activityRead = accessor('viewed');

function activityIsUnread(d) {
  return !activityRead(d);
}

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

    var update = root.selectAll('.' + activityClass)
      .data(activities, accessor());

    var entering = update.enter();
    var newEls = entering.append('div').class(activityClass, true);

    setTimeout(makeVisible, 500);

    function makeVisible() {
      newEls.class('haps-visible', true);
    }

    update.each(renderActivityContents);
    update.class('hap-unread', activityIsUnread);
    update.class('hap-read', activityRead);
    update.exit().remove();
  }

  function renderActivityContents(d) {
    d3.select(this).html(d.html);
  }

  return renderActivities;
}

module.exports = createRenderActivities;
