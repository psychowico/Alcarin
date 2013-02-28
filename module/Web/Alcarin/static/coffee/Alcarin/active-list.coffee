
namespace 'Alcarin', (exports, Alcarin) ->

    #base class for active views - grouped data
    #that will be automatically synhronized with
    #corresponding part of the html template.
    class exports.ActiveList

        anim : 'show'

        iterator: -> @source

        setAnim : (method) ->
            @anim = method

        constructor: ->
            @source = []
            @binded = false

        bind: (el)->
            @parent = $ el
            @parent.data 'active-list', @

            pr = @parent[0].firstChild
            while pr && pr.nodeType != 1
                pr = pr.nextSibling
            @prototype = $ pr
            @prototype.remove()

            @binded = true

            for view in @source
                dom_obj = @prototype.clone(true)
                if view instanceof exports.ActiveView
                    view.bind dom_obj
                @parent.append dom_obj


        #insert elements at list end, and update related view
        push: (elements...)->
            for el in elements
                @source.push el
                if @binded
                    dom_obj = @prototype.clone(true)
                    if el instanceof exports.ActiveView
                        #el.reset()
                        el.bind dom_obj

                    dom_obj.hide()
                    @parent.append dom_obj
                    dom_obj[@anim]()
            true

        concat: (arrays...)->
            @push element for element in array for array in arrays

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
            if @binded
                #prepare prototype
                dom_obj = @prototype.clone(true)

                #auto bind if this is a activeview
                if obj instanceof exports.ActiveView
                    obj.bind dom_obj

                #insert it in DOM
                children = @parent.children()
                if index >= children.length
                    children.last().after dom_obj
                else
                    children.eq(index).before dom_obj
                true

        remove: (obj)->
            index = @source.indexOf obj
            @removeAt index

        #remove one item and update related view
        removeAt: (index)->
            if @binded
                dom_obj = @parent.children().eq index
                dom_obj.remove()

                obj = @source[index]

                if obj instanceof exports.ActiveView
                    obj.unbind dom_obj

            @source.splice index, 1

        toString: ->
            @source.toString()

        valueOf: ->
            @source.valueOf()


    # class exports.TestView extends Alcarin.ActiveView
    #     name    : @dependencyProperty('name', 'test')
    #     val     : @dependencyProperty('value', 0)

$ ->
    ###list = new Alcarin.ActiveList('#active-select')

    v = new Alcarin.TestView()
    v.name(7)
    v2 = new Alcarin.TestView()
    v2.name('10')
    v3 = new Alcarin.TestView()
    v3.name('środek')
    v3.val 33

    list.push( v, v2 )
    list.insert(1, v3)
    true###