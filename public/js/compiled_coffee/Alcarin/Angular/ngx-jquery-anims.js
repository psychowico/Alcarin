'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@jquery-anims').animation('$slideDown', function() {
    return {
      setup: function(e) {
        return e.hide();
      },
      start: function(e, done) {
        return e.slideDown(function() {
          return done();
        });
      },
      cancel: function(e) {
        return e.stop();
      }
    };
  }).animation('$slideUp', function() {
    return {
      setup: function(e) {
        return e.show();
      },
      start: function(e, done) {
        return e.slideUp(function() {
          return done();
        });
      },
      cancel: function(e) {
        return e.stop();
      }
    };
  });
});
