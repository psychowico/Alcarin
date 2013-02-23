namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class exports.Minimap

        constructor : ( _minimap )->
            @minimap = _minimap

        context : ->
            @_context = @minimap[0].getContext('2d') unless @_context?
            return @_context

        fill_by_sea : ->

            context = @context()
            context.fillStyle = 'blue'
            context.arc(@w/2, @h/2, @w/2 - 1, 0 , 2 * Math.PI, false)
            context.fill();

            context.lineWidth = 2
            context.strokeStyle = 'white'
            context.stroke()

        init : ->
            @w = @minimap.width()
            @h = @minimap.height()
            @fill_by_sea()
            #image_data = @context().createImageData @width, @height

            ###
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
            ###


    $ =>
        minimap = new Alcarin.Orbis.Minimap $('#minimap')
        minimap.init()