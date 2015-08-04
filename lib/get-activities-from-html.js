var cheerio = require('cheerio');
var activityRegex = /<div class="copy">(.*)<\/div><br \/>/g;
var dateRegex = /at (\d+:\d\d \w\w) on (\w+ \d+, \d\d\d\d)/;

function getActivitiesFromHTML(html) {
  var activities = [];
  $ = cheerio.load(html);
  $('.copy blockquote').each(addActivityFromEl);
  return activities;

  function addActivityFromEl(i, el) {
    activities.push(getActivityFromChunkEl(el));
  }
}

function getActivityFromChunkEl(el) {
  var wrappedEl = $(el);
  var activityFooter = wrappedEl.children('.smallcopy').last().text();
  var capturedDateTokens = dateRegex.exec(activityFooter);
  var stamp;

  if (capturedDateTokens && capturedDateTokens.length > 2) {
    var day = capturedDateTokens[2];
    var time = capturedDateTokens[1];
    stamp = new Date(day + ' ' + time);
  }

  return {
    html: wrappedEl.html(),
    stamp: stamp
  };
}

module.exports = getActivitiesFromHTML;
