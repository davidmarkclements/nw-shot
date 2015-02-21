'use strict';
/* globals nwrequire */
var compare = require('buffer-compare');

var gui = nwrequire('nw.gui');
var options = JSON.parse(gui.App.argv.toString());
// Needed if the procces is running in a framebuffer (like on travis)
var show = process.env.NWSHOT_SHOW === '1' ? true : false;
if (show) { gui.Window.get().show(); }

var dataType = (options.encoding === 'base64')
  ? 'raw'
  : (options.encoding === 'binary')
  ? 'buffer'
  : 'buffer'

if (process.platform === 'linux') { options.height += 38;}

var win = gui.Window.open(options.url, {
  width: options.width,
  height: options.height,
  show: show,
  frame: show
});

var prefix = Buffer('data:image');
var newline = Buffer('\n');

function capture(e, cb) {
  if (e) { win.eval(null, e); }
  setTimeout(function(){
    win.capturePage(function(buffer) {
      if (compare(buffer.slice(0, 10), prefix) === 0) {
        process.stdout.write(buffer);
        process.stdout.write(newline);
        cb();        
      }
     }, {format : options.format, datatype : dataType});
  }, options.evalDelay);
}

function close() {
  win.close(true);
  gui.Window.get().close(true);
}

win.once('document-end', function() {
  setTimeout(function(){

    if (Array.isArray(options.eval)) {
      ;(function recurse(e) {
        capture(e, function () {
          if (!options.eval.length) { return close(); }
          recurse(options.eval.shift());
        });
      }(options.eval.shift()));
      return;
    }

    capture(options.eval, close);

  }, options.delay);

  
});
