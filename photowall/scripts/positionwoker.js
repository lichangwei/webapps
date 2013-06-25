
importScripts('../../common/scripts/console-enabled-webworker.js');
importScripts('worker/start-top-left.js');

self.onmessage = function( e ){
  var positions = positionImages( e.data );
  self.postMessage( positions );
};