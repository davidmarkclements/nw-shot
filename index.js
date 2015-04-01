'use strict';

var path = require('path');
var spawn = require('win-spawn');
var nw = require('nw').findpath();
var app =  path.join(__dirname, 'nw-screenshot');

/**
 * Takes an options object like
 * { url : '', delay : [seconds], width : [size], heihgt :  [size], format : 'png|jpeg' default png };
 * returns a stream
 */
module.exports = function (options) {

  if ((options.format !== 'png' && options.format !== 'jpeg') || !options.format) {
    options.format = 'png';
  }

  var cwd = options.app ? options.app : app;
  options.app = null;

  var nwPath = options.nwPath instanceof Function ? options.nwPath(nw) : nw;
  nwPath = typeof options.nwPath === 'string' ? options.nwPath : nw;

  var stream = spawn(nwPath, [
    '.',
    JSON.stringify(options)
  ],{
    cwd: cwd,
    env: process.env
  })

  return stream.stdout;
};