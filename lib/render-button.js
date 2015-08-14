var d3 = require('d3-selection');

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
    done(new Error('No rootEl provided to renderButton.'));
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
    done(null, button);
  }
}

module.exports = renderButton;
