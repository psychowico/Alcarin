var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin', function(exports, Alcarin) {
  var _this = this;
  $(function() {
    var test;
    return test = new Alcarin.TestClass();
  });
  return exports.TestClass = (function() {

    function TestClass() {
      this.factor = __bind(this.factor, this);

    }

    TestClass.prototype.factor = function(x) {
      return x * x;
    };

    return TestClass;

  })();
});
