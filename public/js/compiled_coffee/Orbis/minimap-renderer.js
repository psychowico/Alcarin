var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  var Flag;
  exports.MinimapRenderer = (function() {
    MinimapRenderer.prototype._radius = 100;

    MinimapRenderer.prototype.flags_drop = {};

    MinimapRenderer.prototype.radius = function() {
      return this._radius;
    };

    function MinimapRenderer(_minimap) {
      this._on_drop = __bind(this._on_drop, this);
      var _this = this;
      this.rel = _minimap;
      this.rel.on('drop', this._on_drop);
      this.context = _minimap[0].getContext('2d');
      this._radius = _minimap.data('radius');
      _minimap.data('minimap', this).droppable({
        'accept': function(drop) {
          var p, r;
          p = drop.position();
          p = {
            x: p.left - _this.pixel_radius,
            y: p.top - _this.pixel_radius
          };
          r = Math.sqrt(p.x * p.x + p.y * p.y);
          return r <= _this.pixel_radius;
        }
      });
    }

    MinimapRenderer.prototype.register_drop = function(flag, _method) {
      return this.flags_drop[flag.id] = _method;
    };

    MinimapRenderer.prototype.release_drop = function(flag) {
      return delete this.flags_drop[flag.id];
    };

    MinimapRenderer.prototype.create_flag = function(x, y) {
      var flag;
      flag = new Flag(this);
      flag.position(x, y);
      return flag;
    };

    MinimapRenderer.prototype._on_drop = function(e, drop_event) {
      var flag, _base, _name;
      flag = drop_event.draggable.data('minimap-flag');
      return typeof (_base = this.flags_drop)[_name = flag.id] === "function" ? _base[_name](drop_event) : void 0;
    };

    MinimapRenderer.prototype.to_pixels = function(x, y) {
      return {
        left: Math.round(this.pixel_radius + x * (this.pixel_radius / this.radius())),
        top: Math.round(this.pixel_radius + y * (this.pixel_radius / this.radius()))
      };
    };

    MinimapRenderer.prototype.to_coords = function(px, py) {
      return {
        x: Math.round((px - this.pixel_radius) * (this.radius() / this.pixel_radius)),
        y: Math.round((py - this.pixel_radius) * (this.radius() / this.pixel_radius))
      };
    };

    MinimapRenderer.prototype.fill_by_sea = function() {
      var r;
      r = this.pixel_radius;
      this.context.beginPath();
      this.context.fillStyle = 'blue';
      this.context.arc(r, r, r - 1, 0, 2 * Math.PI, false);
      this.context.closePath();
      this.context.fill();
      this.context.lineWidth = 2;
      this.context.strokeStyle = 'white';
      this.context.stroke();
      this.context.beginPath();
      this.context.fillStyle = 'red';
      this.context.arc(r, r, 2, 0, 2 * Math.PI, false);
      this.context.closePath();
      return this.context.fill();
    };

    MinimapRenderer.prototype.init = function() {
      this.pixel_radius = this.rel.width() / 2;
      return this.fill_by_sea();
      /*
      canvasContext.drawImage(imgObj, 0, 0, imgW, imgH);
      var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
      
      for(var y = 0; y < imgPixels.height; y++){
          for(var x = 0; x < imgPixels.width; x++){
              var i = (y * 4) * imgPixels.width + x * 4;
              var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
              imgPixels.data[i] = avg;
              imgPixels.data[i + 1] = avg;
              imgPixels.data[i + 2] = avg;
          }
      }
      
      canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
      
      image.attr('original-src', image.attr('src'));
      imgObj.src = canvas.toDataURL();
      */

    };

    return MinimapRenderer;

  })();
  return Flag = (function() {
    function Flag(renderer) {
      this.renderer = renderer;
      this.id = Alcarin.Randoms.id();
      this.rel = $('<div>', {
        "class": 'flag',
        id: this.id
      }).append($('<div>').append($('<i>', {
        "class": 'icon-flag'
      }))).data('minimap-flag', this).hide();
      this.rel.appendTo(this.renderer.rel.parent());
      this.rel.draggable({
        revert: 'invalid'
      });
    }

    Flag.prototype.drop = function(_method) {
      return this.renderer.register_drop(this, _method);
    };

    Flag.prototype.release_drop = function() {
      return this.renderer.release_drop(this);
    };

    Flag.prototype.position = function(x, y) {
      return this.rel.position(this.renderer.to_pixels(x, y));
    };

    Flag.prototype.show = function(anim_speed) {
      if (anim_speed == null) {
        anim_speed = 'fast';
      }
      return this.rel.fadeIn(anim_speed);
    };

    Flag.prototype.hide = function(anim_speed) {
      if (anim_speed == null) {
        anim_speed = 'fast';
      }
      return this.rel.fadeOut(anim_speed);
    };

    Flag.prototype.destroy = function(with_anim, anim_speed) {
      var _this = this;
      if (with_anim == null) {
        with_anim = true;
      }
      if (anim_speed == null) {
        anim_speed = 'fast';
      }
      if (with_anim) {
        return this.rel.fadeOut(anim_speed, function() {
          _this.rel.remove();
          return _this.rel = null;
        });
      } else {
        this.rel.remove();
        return this.rel = null;
      }
    };

    return Flag;

  })();
});

/*
//@ sourceMappingURL=minimap-renderer.js.map
*/
