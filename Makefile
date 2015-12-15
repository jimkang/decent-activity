BROWSERIFY = node_modules/.bin/browserify
UGLIFY = node_modules/.bin/uglifyjs

build:
	$(BROWSERIFY) lib/bookmarklet-src.js | $(UGLIFY) -c -m -o chrome/bookmarklet.js

build-dev:
	$(BROWSERIFY) -d lib/bookmarklet-src.js > chrome/bookmarklet.js

test:
	node tests/parse-contacts-test.js
	node tests/get-activities-from-html-tests.js
	node tests/get-activities-from-html-24-hour-clock-tests.js
	node tests/activities-stream-tests.js
	node tests/render-activities-tests.js
	node tests/activity-comparator-tests.js
