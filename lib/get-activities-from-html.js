var cheerio = require('cheerio');
var activityRegex = /<div class="copy">(.*)<\/div><br \/>/g;

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
  return {
    html: wrappedEl.html(),
    stamp: wrappedEl.children('.smallcopy').last().html()
  };
}

module.exports = getActivitiesFromHTML;
