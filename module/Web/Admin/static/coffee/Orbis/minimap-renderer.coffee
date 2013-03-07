namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class exports.MinimapRenderer

        _radius: 10000
        flags_drop : {}

        radius: ()->
            @_radius

        constructor : ( _minimap )->
            @rel = _minimap
            @rel.on 'drop', @_on_drop
            @context = _minimap[0].getContext('2d')

            _minimap.data('minimap', @)
                    .droppable { 'accept': (drop)=>
                        p = drop.position()
                        p = {x: p.left - @pixel_radius, y: p.top - @pixel_radius}
                        r = Math.sqrt(p.x * p.x + p.y * p.y)
                        r <= @pixel_radius
                    }

        register_drop: (flag, _method)->
            @flags_drop[flag.id] = _method

        release_drop: (flag)->
            delete @flags_drop[flag.id]

        create_flag: (x, y)->
            flag = new Flag @
            flag.position x, y
            flag

        _on_drop: (e, drop_event)=>
            flag = drop_event.draggable.data 'minimap-flag'
            @flags_drop[flag.id]?(drop_event)

        to_pixels: (x, y)->
            {
                left: Math.round @pixel_radius + x * (@pixel_radius / @radius())
                top: Math.round @pixel_radius + y * (@pixel_radius / @radius())
            }

        to_coords: (px, py)->
            {
                x: Math.round (px - @pixel_radius) * ( @radius() / @pixel_radius)
                y: Math.round (py - @pixel_radius) * ( @radius() / @pixel_radius)
            }

        fill_by_sea : ->

            r = @pixel_radius

            @context.beginPath()
            @context.fillStyle = 'blue'
            @context.arc(r, r, r - 1, 0 , 2 * Math.PI, false)
            @context.closePath()
            @context.fill();

            @context.lineWidth = 2
            @context.strokeStyle = 'white'
            @context.stroke()

            @context.beginPath()
            @context.fillStyle = 'red'
            @context.arc(r, r, 2, 0 , 2 * Math.PI, false)
            @context.closePath()
            @context.fill();

        init : ->
            @pixel_radius = @rel.width() / 2
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

    class Flag
        constructor: (@renderer)->
            @id = Alcarin.Randoms.id()
            @rel = $('<div>', {class: 'flag', id: @id}).append(
                $('<div>').append $ '<i>', {class: 'icon-flag'}
            ).data('minimap-flag', @).hide()
            @rel.appendTo @renderer.rel.parent()
            @rel.draggable {revert: 'invalid'}

        drop: (_method)->
            @renderer.register_drop @, _method

        release_drop: ->
            @renderer.release_drop @

        position: (x, y)->
            @rel.position @renderer.to_pixels x, y

        show: (anim_speed='fast')->
            @rel.fadeIn(anim_speed)

        hide: (anim_speed='fast')->
            @rel.fadeOut(anim_speed)

        destroy: (with_anim=true, anim_speed='fast')->
            if with_anim
                @rel.fadeOut anim_speed, =>
                    @rel.remove()
                    @rel = null
            else
                @rel.remove()
                @rel = null
