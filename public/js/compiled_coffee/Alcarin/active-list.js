var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin', function(exports, Alcarin) {
  exports.ActiveList = (function() {

    function ActiveList(el) {
      var pr;
      this.parent = $(el);
      console.log(this.parent);
      pr = this.parent[0].firstChild;
      while (pr && pr.nodeType !== 1) {
        pr = pr.nextSibling;
      }
      this.prototype = $(pr);
      this.prototype.remove();
      this.source = [];
    }

    ActiveList.prototype.push = function() {
      var dom_obj, el, elements, _i, _len;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.source.push(el);
        dom_obj = this.prototype.clone(true);
        el.bind(dom_obj);
        this.parent.append(dom_obj);
      }
      return true;
    };

    ActiveList.prototype.pop = function() {
      return this.removeAt(this.source.length - 1);
    };

    ActiveList.prototype.indexOf = function(obj, start) {
      return this.source.indexOf(obj, start);
    };

    ActiveList.prototype.length = function() {
      return this.source.length;
    };

    ActiveList.prototype.insert = function(index, obj) {
      var children, dom_obj;
      this.source.splice(index, 0, obj);
      dom_obj = this.prototype.clone(true);
      if (obj instanceof exports.ActiveView) {
        obj.bind(dom_obj);
      }
      children = this.parent.children();
      if (index >= children.length) {
        children.last().after(dom_obj);
      } else {
        children.eq(index).before(dom_obj);
      }
      return true;
    };

    ActiveList.prototype.remove = function(obj) {
      var index;
      index = this.source.indexOf(obj);
      return this.removeAt(index);
    };

    ActiveList.prototype.removeAt = function(index) {
      var dom_obj, obj;
      dom_obj = this.parent.children().eq(index);
      dom_obj.remove();
      obj = this.source[index];
      if (obj instanceof exports.ActiveView) {
        obj.unbind(dom_obj);
      }
      this.source.splice(index, 1);
      return obj;
    };

    ActiveList.prototype.toString = function() {
      return this.source.toString();
    };

    ActiveList.prototype.valueOf = function() {
      return this.source.valueOf();
    };

    return ActiveList;

  })();
  return exports.TestView = (function(_super) {

    __extends(TestView, _super);

    function TestView() {
      return TestView.__super__.constructor.apply(this, arguments);
    }

    TestView.prototype.name = TestView.dependencyProperty('name', 'test');

    TestView.prototype.val = TestView.dependencyProperty('value', 0);

    return TestView;

  })(Alcarin.ActiveView);
});

$(function() {
  /*list = new Alcarin.ActiveList('#active-select')
  
  v = new Alcarin.TestView()
  v.name(7)
  v2 = new Alcarin.TestView()
  v2.name('10')
  v3 = new Alcarin.TestView()
  v3.name('środek')
  v3.val 33
  
  list.push( v, v2 )
  list.insert(1, v3)
  true
  */

});
