var mutualContactUserIdRegex = /user\/(\d+).*class="mutual"/g;

function getMutualContactIdsFromHTML(html) {
  var result;
  var ids = [];

  while ((result = mutualContactUserIdRegex.exec(html)) !== null) {
    debugger;
    ids.push(result[1]);
  }

  return ids;
}

module.exports = getMutualContactIdsFromHTML;
