var __slice = [].slice;

namespace('Alcarin', function(exports, Alcarin) {
  return exports.ActiveList = (function() {

    ActiveList.prototype.anim = 'show';

    ActiveList.prototype.iterator = function() {
      return this.source;
    };

    ActiveList.prototype.setAnim = function(method) {
      return this.anim = method;
    };

    function ActiveList() {
      this.source = [];
      this.binded = false;
    }

    ActiveList.prototype.bind = function(el) {
      var dom_obj, pr, view, _i, _len, _ref, _results;
      this.parent = $(el);
      this.parent.data('active-list', this);
      pr = this.parent[0].firstChild;
      while (pr && pr.nodeType !== 1) {
        pr = pr.nextSibling;
      }
      this.prototype = $(pr);
      this.prototype.remove();
      this.binded = true;
      _ref = this.source;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        dom_obj = this.prototype.clone(true);
        if (view instanceof exports.ActiveView) {
          view.bind(dom_obj);
        }
        _results.push(this.parent.append(dom_obj));
      }
      return _results;
    };

    ActiveList.prototype.clear = function() {
      var _results;
      _results = [];
      while (this.length > 0) {
        _results.push(this.pop());
      }
      return _results;
    };

    ActiveList.prototype.push = function() {
      var dom_obj, el, elements, _i, _len;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.source.push(el);
        if (this.binded) {
          dom_obj = this.prototype.clone(true);
          if (el instanceof exports.ActiveView) {
            el.bind(dom_obj);
          }
          dom_obj.hide();
          this.parent.append(dom_obj);
          dom_obj[this.anim]();
        }
      }
      return true;
    };

    ActiveList.prototype.concat = function() {
      var array, arrays, element, _i, _len, _results;
      arrays = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = arrays.length; _i < _len; _i++) {
        array = arrays[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
            element = array[_j];
            _results1.push(this.push(element));
          }
          return _results1;
        }).call(this));
      }
      return _results;
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
      if (this.binded) {
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
      }
    };

    ActiveList.prototype.remove = function(obj) {
      var index;
      index = this.source.indexOf(obj);
      return this.removeAt(index);
    };

    ActiveList.prototype.removeAt = function(index) {
      var dom_obj, obj;
      if (this.binded) {
        dom_obj = this.parent.children().eq(index);
        dom_obj.remove();
        obj = this.source[index];
        if (obj instanceof exports.ActiveView) {
          obj.unbind();
        }
      }
      return this.source.splice(index, 1);
    };

    ActiveList.prototype.toString = function() {
      return this.source.toString();
    };

    ActiveList.prototype.valueOf = function() {
      return this.source.valueOf();
    };

    return ActiveList;

  })();
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
