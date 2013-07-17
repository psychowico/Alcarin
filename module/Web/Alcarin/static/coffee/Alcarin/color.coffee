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

        @intToRGB: (color)->
            c = {}
            for cmp, i in ['r', 'g', 'b']
                c[cmp] = ((color >> (8 * (2 - i) ) ) & 0xFF)
            return c

        @RGBToInt: (rgb)->
            return (rgb.r << 16) + (rgb.g << 8) + rgb.b

        # mix two color - use (1 - percentage) of first and percentage second
        @mix: (color1, color2, percentage=0.5)->
            return {
                r: (1 - percentage) * color1.r + color2.r * percentage
                g: (1 - percentage) * color1.g + color2.g * percentage
                b: (1 - percentage) * color1.b + color2.b * percentage
            }
