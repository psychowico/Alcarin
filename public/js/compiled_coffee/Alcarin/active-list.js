var __slice = [].slice;

namespace('Alcarin', function(exports, Alcarin) {
  return exports.ActiveList = (function() {

    function ActiveList(el) {
      this.parent = $(el);
      this.protype = $(el).children().first();
      this.protype.remove();
      this.source = [];
    }

    ActiveList.prototype.push = function() {
      var dom_obj, el, elements, _i, _len, _results;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.source.push(el);
        dom_obj = this.protype.clone(true);
        el.bind(dom_obj);
        _results.push(this.parent.append(dom_obj));
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
      dom_obj = this.protype.clone(true);
      if (obj instanceof exports.ActiveView) {
        obj.bind(dom_obj);
      }
      children = this.parent.children();
      if (index >= children.length) {
        return children.last().after(dom_obj);
      } else {
        return children.eq(index).before(dom_obj);
      }
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
  /*class exports.TestView extends Alcarin.ActiveView
      name    : @dependencyProperty('name', 'test')
      val     : @dependencyProperty('value', 0)
  
  $ ->
  list = new Alcarin.ActiveList('#active-select')
  
  v = new Alcarin.TestView()
  v.name(7)
  v2 = new Alcarin.TestView()
  v2.name('10')
  v3 = new Alcarin.TestView()
  v3.name('środek')
  v3.val 33
  
  list.push( v, v2 )
  list.insert(1, v3)
  */

});
