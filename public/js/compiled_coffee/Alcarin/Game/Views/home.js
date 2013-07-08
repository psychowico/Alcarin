'use strict';namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.Home = ngcontroller(function() {
    return this.$on('initialized', function(ev, socket) {
      socket.on('terrain.update', function(fields) {
        return console.log(fields);
      });
      return socket.emit('terrain.fetch');
    });
  });
});

/*
//@ sourceMappingURL=home.js.map
*/
