'use strict';
namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@jquery-anims', ['ngAnimate']).animation('.anim-slide', function() {
    return {
      enter: function(e, done) {
        e.hide().slideDown(function() {
          return done();
        });
        return function(isCancelled) {
          if (isCancelled) {
            return e.stop();
          }
        };
      },
      leave: function(e, done) {
        e.slideUp(function() {
          return done();
        });
        return function(isCancelled) {
          if (isCancelled) {
            return e.stop();
          }
        };
      }
    };
  }).animation('.anim-slide-show', function() {
    return {
      removeClass: function(e, cn, done) {
        e.hide().slideDown(function() {
          return done();
        });
        return function(isCancelled) {
          if (isCancelled) {
            return e.stop();
          }
        };
      },
      beforeAddClass: function(e, cn, done) {
        e.slideUp(function() {
          return done();
        });
        return function(isCancelled) {
          if (isCancelled) {
            return e.stop();
          }
        };
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-jquery-anims.js.map
*/
