'use strict';
var namespace, ngcontroller,
  __slice = [].slice,
  _this = this;

namespace = function(target, name, block) {
  var item, main_ns, _i, _len, _ref, _ref1;
  if (arguments.length < 3) {
    _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
  }
  main_ns = target.Alcarin;
  _ref1 = name.split('.');
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    item = _ref1[_i];
    target = target[item] || (target[item] = {});
  }
  return block(target, main_ns);
};

Array.prototype.remove = function(obj) {
  var ind;
  ind = this.indexOf(obj);
  return this.splice(ind, 1);
};

ngcontroller = function(block) {
  var args, fun, inv;
  if (!$.isArray(block)) {
    block = [block];
  }
  args = block.length > 1 ? block.slice(0, -1) : [];
  fun = block.slice(-1)[0];
  inv = ['$scope'].concat(args);
  inv.push(function() {
    var $scope, _args;
    $scope = arguments[0], _args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return fun.apply($scope, _args);
  });
  return inv;
};

angular._module = angular.module;

angular.module = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (args.length < 2) {
    args.push([]);
  }
  args[1].push('@core', '@jquery-anims', 'ngAnimate-animate.css');
  if (args.length < 3) {
    args.push([
      '$interpolateProvider', function($ip) {
        return $ip.startSymbol('{*').endSymbol('*}');
      }
    ]);
  }
  return angular._module.apply(angular, args).config(function($parseProvider) {
    return $parseProvider.unwrapPromises(true);
  });
};

$(function() {
  $('input[type="text"],textarea:first').focus();
  $('.modal-footer .btn-primary').on('click', function(e) {
    var result;
    return result = $(this).trigger('success', e);
  });
  $('.modal').on('success', function(e) {
    if (!e.isDefaultPrevented()) {
      return $(this).modal('hide');
    }
  });
  return $('body').disableSelection();
});

/*
//@ sourceMappingURL=core.js.map
*/
