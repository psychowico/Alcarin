'use strict';namespace('Alcarin.Game', function(exports, Alcarin) {
  var fail, success;

  success = function(x) {
    return console.log('success: ' + x);
  };
  fail = function(x) {
    return console.log('fail: ' + x);
  };
  return exports.loadSocketLibrary = function(host, socket_port) {
    var deffered, intId, loadScript, loaded, url;

    deffered = Q.defer();
    loaded = false;
    url = "http://" + host + ":" + socket_port + "/socket.io/socket.io.js";
    loadScript = function(intId) {
      return $.getScript(url, function() {
        window.clearInterval(intId);
        return deffered.resolve();
      });
    };
    intId = window.setInterval((function() {
      return loadScript(intId);
    }), 5000);
    loadScript(intId);
    return deffered.promise;
  };
});

/*
//@ sourceMappingURL=socket.io-loader.js.map
*/
