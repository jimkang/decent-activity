var queue = require('queue-async');
var renderButton = require('./render-button');
var _ = require('lodash');
var callNextTick = require('call-next-tick');

function renderNavButtons(opts, done) {
  var activityRoot;
  var olderButtonResponder;
  var newerButtonResponder;

  if (opts) {
    activityRoot = opts.activityRoot;
    olderButtonResponder = opts.olderButtonResponder;
    newerButtonResponder = opts.newerButtonResponder;
  }

  if (!activityRoot) {
    callNextTick(done, new Error('No activityRoot provided to renderButton.'));
    return;
  }

  var q = queue();

  var buttonOptsList = [
    {
      text: 'Older',
      rootEl: activityRoot,
      cssClass: 'haps-button',
      clickResponder: olderButtonResponder
    },
    {
      text: 'Newer',
      rootEl: activityRoot,
      cssClass: 'haps-button',
      clickResponder: newerButtonResponder
    }
  ];

  buttonOptsList.forEach(queueRender);

  function queueRender(buttonOpts) {
    q.defer(renderButton, buttonOpts);
  }

  q.awaitAll(done);
}

function clearContent() {
  var contentEl = document.querySelector('.content');
  var containerEl = document.querySelector('.content .container');
  if (contentEl && containerEl) {
    contentEl.removeChild(containerEl);
  }
}

function createRoot() {
  var newRootEl;
  var contentEl = document.querySelector('.content');
  if (contentEl) {
    newRootEl = document.createElement('div');
    newRootEl.id = 'posts';
    contentEl.appendChild(newRootEl);
  }
  return newRootEl;
}

function establishHapsViewOnPage(opts, done) {
  clearContent();
  var activityRoot = createRoot();

  navButtonOpts = _.pick(opts, 'olderButtonResponder', 'newerButtonResponder');
  navButtonOpts.activityRoot = activityRoot;
  renderNavButtons(navButtonOpts, callDone);

  // callDone passes back the activityRoot, notthe buttons that will be 
  // passed back from renderNavButtons.

  function callDone(error) {
    done(error, activityRoot);
  }
}

module.exports = establishHapsViewOnPage;
