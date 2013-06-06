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
  args[1].push('@core');
  if (args.length < 3) {
    args.push(function($interpolateProvider) {
      return $interpolateProvider.startSymbol('{*').endSymbol('*}');
    });
  }
  return angular._module.apply(angular, args);
};

$(function() {
  $('[data-instance]').each(function() {
    var class_str, instance, splitted, str, _class, _i, _len;
    class_str = $(this).data('instance');
    splitted = class_str.split('.');
    _class = window;
    for (_i = 0, _len = splitted.length; _i < _len; _i++) {
      str = splitted[_i];
      if (_class[str] != null) {
        _class = _class[str];
      } else {
        throw "Can not find instance of '" + class_str + "' class.";
      }
    }
    instance = new _class($(this));
    return typeof instance.init === "function" ? instance.init() : void 0;
  });
  $('input[type="text"]:first').focus();
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
