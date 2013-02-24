
namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return exports.MinimapRenderer = (function() {

    function MinimapRenderer(_minimap) {
      this.minimap = _minimap;
    }

    MinimapRenderer.prototype.context = function() {
      if (this._context == null) {
        this._context = this.minimap[0].getContext('2d');
      }
      return this._context;
    };

    MinimapRenderer.prototype.fill_by_sea = function() {
      var context;
      context = this.context();
      context.fillStyle = 'blue';
      context.arc(this.w / 2, this.h / 2, this.w / 2 - 1, 0, 2 * Math.PI, false);
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = 'white';
      return context.stroke();
    };

    MinimapRenderer.prototype.init = function() {
      this.w = this.minimap.width();
      this.h = this.minimap.height();
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
});
