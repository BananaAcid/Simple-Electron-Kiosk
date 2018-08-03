[debug-to-file](http://github.com/131/debug-to-file) is tiny, no dependecy  helper to dump [debug](http://github.com/visionmedia/debug) traces to a file (through `DEBUG_FILE` env var).

[debug-to-file](http://github.com/131/debug-to-file) also allows you to customize debug output format using the `DEBUG_FORMAT`.

[![Build Status](https://travis-ci.org/131/debug-to-file.svg?branch=master)](https://travis-ci.org/131/debug-to-file)
[![Version](https://img.shields.io/npm/v/debug-to-file.svg)](https://www.npmjs.com/package/debug-to-file)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)






# DEBUG_FILE 
Declare env DEBUG_FILE as the debug-to-file  target


# Available format for DEBUG_FORMAT
* use :time for ISO timestamp
* use :namespace for debug namespace
* use :body for main payload
* use :diff for last msg diff


Defaut DEBUG_FORMAT is ":time :namespace :body"

# Support for console.log/console.error
debug-to-file will duplex everything to the console into the trace file

# Support for debug
debug-to-file will overrite debug.log (per specifications) to a dedicated file

# Browserify recommandation
Exclude debug from browserify is a good way to make sure only one debug reference is loaded.

# Credits
* [131](https://github.com/131) author
* [debug](https://github.com/visionmedia/debug)

