"use strict";
/* global chrome */

function coerce(val) {
  if(val instanceof Error)
    return val.stack || val.message;
  return val;
}

if(process.env.DEBUG_FILE) {

  const fs       = require('fs');
  const humanize = require('ms');
  const tty      = require('tty');
  const util     = require('util');

  const Transform   = require('stream').Transform;
  const PassThrough = require('stream').PassThrough;

  const format   = process.env.DEBUG_FORMAT || ":time :namespace :body"; // :diff

  const out      = fs.createWriteStream(process.env.DEBUG_FILE, {flags: 'a'}); // PATCH BY BANANAACID - append added
  const nw       = !!global.window;
  const fdStderr = 2;
  const detached = !tty.isatty(fdStderr);

  if(nw) { //force debug in 'browser' mode (fake electronjs API)
    //debug in browser mode do NOT add timestamp, but colors have to be removed
    process.type = "renderer";
    window.localStorage.setItem('debug',  process.env.DEBUG);
    chrome.storage.local.debug = process.env.DEBUG;
  }

  var formatters = {};

  formatters.o = function(v) {
    return util.inspect(v, {colors : false})
      .replace(/\s*\n\s*/g, ' ');
  };

  var stderr = null;
  if(!nw && !detached)
    stderr = new tty.WriteStream(fdStderr);

  var pass = new PassThrough();

  process.__defineGetter__('stderr', function() { return pass; });
  process.__defineGetter__('stdout', function() { return pass; });

  var log = function() {

    var args = [].slice.apply(arguments);

    args[0] = coerce(args[0]);

    if(typeof args[0] !== 'string') {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if(match === '%%')
        return match;
      index++;
      var formatter = formatters[format];
      if(typeof formatter === 'function') {
        var val = args[index];
        match = formatter.call(this, val);         // bugfix ?? PATCH BY BANANAACID -> self is not defined

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    var body = util.format.apply(this, args);
    var now = new Date();


    function pad(number) {
      return number < 10 ? '0' + number : number;
    }

    var time =  now.getFullYear() +
          '-' + pad(now.getMonth() + 1) +
          '-' + pad(now.getDate()) +
          ' ' + pad(now.getHours()) +
          ':' + pad(now.getMinutes()) +
          ':' + pad(now.getSeconds()) +
          '.' + (now.getMilliseconds() / 1000).toFixed(3).slice(2, 5);


    var namespace = this.namespace || 'console';

    var str = format
      .replace(':namespace', namespace)
      .replace(':time', time)
      .replace(':body', body)
      .replace(':diff', this.diff ? humanize(this.diff) : "")
      .replace(new RegExp('.*?m', 'g'), '');


    out.write(str + '\n');

    if(stderr)
      stderr.write(str + '\n');
  };


  global.console.log   = global.console.info  = global.console.error = global.console.warn  = log;

  if(nw)
    global.window.console = global.console;


  const debug      = require('debug');
  debug.log        = log;
  debug.formatArgs = function() { return arguments; };

  if(nw) {
    pass.pipe(out);
  }
  else {
    //we are in node, debug will output colors to (tty) stderr
    if(stderr)
      pass.pipe(stderr);

    // in the log file, we remove colors
    const myTransform = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString().replace(new RegExp('.*?m', 'g'), ''));
        callback();
      }
    });

    pass.pipe(myTransform).pipe(out);

  }
}
