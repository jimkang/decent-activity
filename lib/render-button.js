var d3 = require('d3-selection');
var callNextTick = require('call-next-tick');

function renderButton(opts, done) {
  var root;
  var rootEl;
  var clickResponder;
  var cssClass;
  var text;

  if (opts) {
    rootEl = opts.rootEl;
    clickResponder = opts.clickResponder;
    cssClass = opts.cssClass;
    text = opts.text;
  }

  if (!rootEl) {
    callNextTick(done, new Error('No rootEl provided to renderButton.'));
  }
  else {
    root = d3.select(rootEl);
    var button = root.append('button')
    button.text(text);
    if (cssClass) {
      button.class(cssClass, true);
    }
    if (clickResponder) {
      button.on('click', clickResponder);
    }
    callNextTick(done, null, button);
  }
}

module.exports = renderButton;
