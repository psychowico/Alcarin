var __slice = [].slice;

namespace('Alcarin', function(exports, Alcarin) {
  return exports.ActiveList = (function() {

    ActiveList.prototype.anim = {
      add: 'show',
      remove: 'hide'
    };

    ActiveList.prototype.iterator = function() {
      return this.source;
    };

    ActiveList.prototype.setAnims = function(adding, removing) {
      if (removing == null) {
        removing = 'hide';
      }
      return this.anim = {
        add: adding,
        remove: removing
      };
    };

    function ActiveList() {
      this.source = [];
      this.binded = false;
    }

    ActiveList.prototype.bind = function(el) {
      var dom_obj, ind, parent, pr, view, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      this.parents = $(el);
      this.parents.data('active-list', this);
      this.prototypes = [];
      _ref = this.parents.children();
      for (ind = _i = 0, _len = _ref.length; _i < _len; ind = ++_i) {
        pr = _ref[ind];
        while (pr && pr.nodeType !== 1) {
          pr = pr.nextSibling;
        }
        this.prototypes[ind] = $(pr);
        this.prototypes[ind].remove();
      }
      _ref1 = this.source;
      for (ind = _j = 0, _len1 = _ref1.length; _j < _len1; ind = ++_j) {
        view = _ref1[ind];
        _ref2 = this.parents;
        for (ind = _k = 0, _len2 = _ref2.length; _k < _len2; ind = ++_k) {
          parent = _ref2[ind];
          dom_obj = this.prototypes[ind].clone(true);
          if (view instanceof exports.ActiveView) {
            view.bind(dom_obj);
          }
          $(parent).append(dom_obj);
        }
      }
      return this.binded = true;
    };

    ActiveList.prototype.clear = function() {
      var _results;
      _results = [];
      while (this.source.length > 0) {
        _results.push(this.pop());
      }
      return _results;
    };

    ActiveList.prototype.push = function() {
      var dom_obj, el, elements, ind, parent, _i, _j, _len, _len1, _ref;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.source.push(el);
        if (this.binded) {
          _ref = this.parents;
          for (ind = _j = 0, _len1 = _ref.length; _j < _len1; ind = ++_j) {
            parent = _ref[ind];
            dom_obj = this.prototypes[ind].clone(true);
            if (el instanceof exports.ActiveView) {
              el.bind(dom_obj);
            }
            dom_obj.hide();
            $(parent).append(dom_obj);
            dom_obj[this.anim.add]();
          }
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
      var children, dom_obj, ind, parent, _i, _len, _ref, _results;
      this.source.splice(index, 0, obj);
      if (this.binded) {
        _ref = this.parens;
        _results = [];
        for (ind = _i = 0, _len = _ref.length; _i < _len; ind = ++_i) {
          parent = _ref[ind];
          dom_obj = this.prototype[ind].clone(true);
          if (obj instanceof exports.ActiveView) {
            obj.bind(dom_obj);
          }
          children = $(parent).children();
          if (index >= children.length) {
            children.last().after(dom_obj);
          } else {
            children.eq(index).before(dom_obj);
          }
          _results.push(true);
        }
        return _results;
      }
    };

    ActiveList.prototype.remove = function(obj, on_done) {
      var index;
      index = this.source.indexOf(obj);
      return this.removeAt(index, on_done);
    };

    ActiveList.prototype.removeAt = function(index, on_done) {
      var counter, dom_obj, parent, _context, _i, _len, _on_done, _ref,
        _this = this;
      if (this.binded) {
        counter = this.parents.length;
        _ref = this.parents;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          parent = _ref[_i];
          dom_obj = $(parent).children().eq(index);
          _on_done = function(_index, _obj) {
            var obj;
            _obj.remove();
            if (counter === 0) {
              if (typeof on_done === "function") {
                on_done();
              }
              obj = _this.source[_index];
              if (obj instanceof exports.ActiveView) {
                return obj.unbind();
              }
            }
          };
          if (this.anim.remove === 'hide') {
            dom_obj[this.anim.remove]();
            _on_done.apply(this, [index, dom_obj]);
          } else {
            _context = function(index, dom_obj) {
              return dom_obj[_this.anim.remove](function() {
                return _on_done.apply(_this, [index, dom_obj]);
              });
            };
            _context(index, dom_obj);
          }
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
