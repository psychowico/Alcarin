
namespace 'Alcarin', (exports, Alcarin) ->

    #base class for active views - grouped data
    #that will be automatically synhronized with
    #corresponding part of the html template.
    class exports.ActiveList

        anim : {
            add: 'show',
            remove: 'hide'
        }

        iterator: -> @source

        setAnims : (adding, removing = 'hide') ->
            @anim = {
                add: adding,
                remove: removing
            }

        constructor: ->
            @source = []
            @binded = false

        bind: (el)->
            @parents = $ el
            @parents.data 'active-list', @

            @prototypes = []
            for pr, ind in @parents.children()
                while pr && pr.nodeType != 1
                    pr = pr.nextSibling
                @prototypes[ind] = $ pr
                #delete prototype from DOM
                @prototypes[ind].remove()

            for view, ind in @source
                for parent, ind in @parents
                    dom_obj = @prototypes[ind].clone(true)
                    if view instanceof exports.ActiveView
                        view.bind dom_obj
                    $(parent).append dom_obj

            @binded = true



        clear: ->
            while @source.length > 0
                @pop()

        #insert elements at list end, and update related view
        push: (elements...)->
            for el in elements
                @source.push el
                if @binded
                    for parent, ind in @parents
                        dom_obj = @prototypes[ind].clone(true)
                        if el instanceof exports.ActiveView
                            el.bind dom_obj

                        dom_obj.hide()
                        $(parent).append dom_obj
                        dom_obj[@anim.add]()
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
                for parent, ind in @parens
                    dom_obj = @prototype[ind].clone(true)

                    #auto bind if this is a activeview
                    if obj instanceof exports.ActiveView
                        obj.bind dom_obj

                    #insert it in DOM
                    children = $(parent).children()
                    if index >= children.length
                        children.last().after dom_obj
                    else
                        children.eq(index).before dom_obj
                    true

        remove: (obj, on_done)->
            index = @source.indexOf obj
            @removeAt index, on_done

        #remove one item and update related view
        removeAt: (index, on_done)->
            if @binded
                counter = @parents.length
                for parent in @parents
                    dom_obj = $(parent).children().eq index
                    _on_done = (_index, _obj)=>
                        _obj.remove()
                        if counter == 0
                            on_done?()
                            obj = @source[_index]
                            if obj instanceof exports.ActiveView
                                obj.unbind()

                    if @anim.remove == 'hide'
                        dom_obj[@anim.remove]()
                        _on_done.apply @, [index, dom_obj]
                    else
                        _context = (index, dom_obj) =>
                            dom_obj[@anim.remove] =>
                                _on_done.apply @, [index, dom_obj]
                        # run it with own name context, because vars
                        # can change to time, when anim will end
                        _context(index, dom_obj)


            @source.splice index, 1

        toString: ->
            @source.toString()

        valueOf: ->
            @source.valueOf()


    # class exports.TestView extends Alcarin.ActiveView
    #     name    : @dependencyProperty('name', 'test')
    #     val     : @dependencyProperty('value', 0)

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

$ ->
    class TestView extends Alcarin.ActiveView
        a    : @dependencyProperty('a', '133')
        b    : @dependencyProperty('b', 0)

    el = $ 'div.test, div.test2'

    i = 3
    view = new TestView
    view.a 'dupa'
    view.b i++

    list = new Alcarin.ActiveList
    list.setAnims 'slideDown', 'slideUp'
    list.push view
    list.bind el

    $('body').on 'click', ->
        #view.b view.b() + 1

    $('strong').on 'click', ->

        view = new TestView
        view.a 'dupa'
        view.b i++
        list.push view

        console.log list.length()

        false

    $('.container').on 'click', 'a.prototype', ->
        view = $(@).data 'active-view'
        list.remove view
        console.log list.length()
        false
