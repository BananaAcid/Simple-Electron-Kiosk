#! /usr/bin/node



process.env.DEBUG_FILE = require('path').resolve( require('os').tmpdir(), '__PATHS.txt' );

console.log('Temp File:', process.env.DEBUG_FILE);


// register babel hook
require('babel-core/register')({
    extensions: ['.js', '.mjs'],
});
// register application
module.exports = require('./index.mjs').default;
