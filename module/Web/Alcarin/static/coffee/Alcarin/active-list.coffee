
namespace 'Alcarin', (exports, Alcarin) ->

    #base class for active views - grouped data
    #that will be automatically synhronized with
    #corresponding part of the html template.
    class exports.ActiveList

        constructor: (el)->
            @parent = $ el
            @protype = $(el).children().first()
            @protype.remove()
            @source = []

        #insert elements at list end, and update related view
        push: (elements...)->
            for el in elements
                @source.push el
                dom_obj = @protype.clone(true)
                el.bind dom_obj
                @parent.append dom_obj

        pop: ->
            @removeAt @source.length - 1

        #simple wrapper
        indexOf: (obj, start)->
            @source.indexOf obj, start

        #return list length
        length: ->
            @source.length

        #inserting object in specific place in list and update related view
        insert: (index, obj)->
            #update list
            @source.splice index, 0, obj
            #prepare prototype
            dom_obj = @protype.clone(true)

            #auto bind if this is a activeview
            if obj instanceof exports.ActiveView
                obj.bind dom_obj

            #insert it in DOM
            children = @parent.children()
            if index >= children.length
                children.last().after dom_obj
            else
                children.eq(index).before dom_obj

        remove: (obj)->
            index = @source.indexOf obj
            @removeAt index

        #remove one item and update related view
        removeAt: (index)->
            dom_obj = @parent.children().eq index
            dom_obj.remove()

            obj = @source[index]

            if obj instanceof exports.ActiveView
                obj.unbind dom_obj

            @source.splice index, 1
            obj

        toString: ->
            @source.toString()

        valueOf: ->
            @source.valueOf()


    ###class exports.TestView extends Alcarin.ActiveView
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
    list.insert(1, v3)###