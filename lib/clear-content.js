var callNextTick = require('call-next-tick');

function clearContent(done) {
  var postsEl = document.querySelector('#posts');
  var postsChildren = document.querySelectorAll('#posts > *');
  for (var i = 0; i < postsChildren.length; ++i) {
    postsEl.removeChild(postsChildren[i]);
  }
  callNextTick(done);
}

module.exports = clearContent;
