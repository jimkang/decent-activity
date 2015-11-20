var updateParamsForActivity = require('./update-params-for-activity');

function createElementScrollResponder(opts) {
  var db;
  var onUpdateDone;

  if (opts) {
    db = opts.db;
    onUpdateDone = opts.onUpdateDone;
  }

  function respondToElementEnteringView(el) {
    console.log(el, 'entered view.');
    var activity = el.__data__;
    activity.viewed = true;
    var updateParams = updateParamsForActivity(activity);
    db.put(updateParams.key, updateParams.value, triggerRender);
  }

  function triggerRender(error) {
    if (error) {
      console.log(error);
    }
    else {
      onUpdateDone();
    }
  }

  return respondToElementEnteringView;
}

module.exports = createElementScrollResponder;
