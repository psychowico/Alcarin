namespace 'Alcarin', (exports, Alcarin) ->

    class exports.Color

        @hexToRGB: (hex)->
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec hex
            return {
                r: parseInt result[1], 16
                g: parseInt result[2], 16
                b: parseInt result[3], 16
            }

        @RGBToHex: (rgb)->
            cth = (c)->
                hex = c.toString 16
                if hex.length == 1 then "0" + hex else hex
            "#" + cth rgb.r + cth rgb.g + cth rgb.b