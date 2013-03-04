namespace 'Alcarin', (exports, Alcarin) ->

    # some randoms generate and similar helper methods
    class exports.Randoms

        @index : 0
        # return unique id, just by using format "id--{index}", index is globally incrementing
        @id: ->
            _index = @index++
            "id--#{_index}"