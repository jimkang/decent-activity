var cheerio = require('cheerio');
var activityRegex = /<div class="copy">(.*)<\/div><br \/>/g;
var dateRegex = /at (\d+:\d\d \w\w) on (\w+ \d+, \d\d\d\d)/;

var httpRegex = /(http[s]*:\/\/)/;
var unwantedInIdRegex = /(\.metafilter\.com\/)|(\/[\w-]+#)/g

function getActivitiesFromHTML(html) {
  var activities = [];
  $ = cheerio.load(html);
  $('.copy > blockquote').each(addActivityFromEl);
  return activities;

  function addActivityFromEl(i, el) {
    activities.push(getActivityFromChunkEl(el));
  }
}

function getActivityFromChunkEl(el) {
  var wrappedEl = $(el);
  var activityFooterEl = wrappedEl.children('.smallcopy').last();
  var activityFooter = activityFooterEl.text();
  var capturedDateTokens = dateRegex.exec(activityFooter);
  var stamp;
  var commentLink = activityFooterEl.children('a').first().attr('href');
  var id = idFromCommentLink(commentLink);

  if (capturedDateTokens && capturedDateTokens.length > 2) {
    var day = capturedDateTokens[2];
    var time = capturedDateTokens[1];
    stamp = new Date(day + ' ' + time);
  }

  return {
    html: wrappedEl.html(),
    stamp: stamp,
    id: id,
    viewed: false
  };
}

function idFromCommentLink(link) {
  var id = link.replace(httpRegex, '');
  id = id.replace(unwantedInIdRegex, '-');
  return id;
}

module.exports = getActivitiesFromHTML;
