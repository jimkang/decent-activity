var test = require('tape');
var getMutualContactURLsFromHTML = require('../lib/get-mutual-contacts-from-html.js');
var fs = require('fs');

var contactsHTML = fs.readFileSync(
  __dirname + '/fixtures/contacts.html',
  {
    encoding: 'utf8'
  }
);

test('Parse test', function parseTest(t) {
  t.plan(1);

  var contacts = getMutualContactURLsFromHTML(contactsHTML);

  t.deepEqual(contacts, [], 'Parses contacts correctly.');
});
