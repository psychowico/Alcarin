namespace 'Alcarin', (exports, Alcarin) ->

    #base class for active views - grouped data
    #that will be automatically synhronized with
    #corresponding part of the html template.
    class exports.ActiveView

        @TYPE_CONTENT = 0
        @TYPE_ATTR    = 1

        #common regex, used by all, static for better performance
        @regex       = /{item\.(.*?)}/g
        #static list of all created active views
        @global_list = []
        @auto_init   = false

        #assoc array of this object properties. for each property name
        #we have list of jquery objects that need be updated when this
        #property will change
        bindings            : {}
        #before full initialization bindings won't be called and html template
        #won't be updated
        initialized         : false

        #simple properties container
        properties_container  : {}

        constructor: ->
            $.merge exports.ActiveView.global_list, [@]
            @properties_container  = jQuery.extend({}, @.properties_container)
            @active_list_container = {}
            @initialized           = false
            @bindings              = {}

        # static function, should ba called once, after all page loading,
        # to prepare all views and update needed values. later all active-objects
        # will be auto initialize when bind.
        @initializeAll : ->
            for view in exports.ActiveView.global_list
                view.init()
            @auto_init = true;

        #it return function, should be used to preparing view properties.
        #check sample view below
        @dependencyProperty: (name, default_value, onChange)->
            if default_value? then @.__super__.properties_container[name] = default_value
            #this method will be called in specific object context
            (val) ->
                if not val? then return @properties_container[name]
                @properties_container[name] = val
                if @initialized
                    @propertyChanged name
                onChange?.call @, val


        # it return function, should be used to updating activelist's
        # inside object
        @dependencyList: (query)->
            #this method will be called in specific object context
            (val) ->
                if not @active_list_container[query]?
                    activelist = @active_list_container[query] = new Alcarin.ActiveList
                    if @rel?
                        activelist.bind @rel.find query
                return @active_list_container[query]

        #called automaticaly when class is full initialized and
        #property value will change.
        propertyChanged : (prop_name) ->
            if not @bindings[prop_name]?
                return
            bindings = @bindings[prop_name]
            for data in bindings
                $el = data.element
                new_val = org = data.original
                while result = ActiveView.regex.exec org
                    val = @properties_container[result[1]]
                    if val?
                        new_val = new_val.replace result[0], val
                switch data.type
                    when exports.ActiveView.TYPE_CONTENT
                        $el.html new_val
                    when exports.ActiveView.TYPE_ATTR
                        $el.attr data.attr, new_val
                    else
                        throw new Error('"#{data.type}" type not supported.')


        ###private function, storing entries in @bindings table for specific property
        names used in "content". it store object with 'type' (TYPE_ATTR/TYPE_CONTENT)
        'element' (jquery ref), 'original' ("content" value) and attribute ###
        prepare_bind : ($root, $child, content, attribute) ->
            #store in data attribute for later use
            checked = {}
            while result = ActiveView.regex.exec content
                property_name = result[1]
                if property_name?
                    if checked[property_name]? then continue
                    checked[property_name] = true
                    @bindings[property_name] = @bindings[property_name] ? []
                    @bindings[property_name].push {
                        'type'    : if attribute? then exports.ActiveView.TYPE_ATTR else exports.ActiveView.TYPE_CONTENT,
                        'element' : $child,
                        'original': content,
                        'attr'    : attribute,
                        'root'    : $root,
                    }
            true

        # check specific jquery element for properties that have been used inside
        # and store them in @bindings assoc array, to update html template when
        # correspondive property will change
        bind: (e) ->
            $e = $ e
            @rel = $e
            $e.data 'active-view', @
            $e.each (index, val) =>
                $el = $ val

                all_children = $el.find('*')

                #checking all children attributes
                for child in all_children.toArray().concat [$el.get 0]
                    $child = $ child
                    for attr in child.attributes
                        @prepare_bind $e, $child, attr.value, attr.name
                    @prepare_bind $e, $child, attr.value, attr.name

                children = all_children.filter (i, val)->
                    not $(val).children().length

                list = children.toArray()
                if not $el.children().length
                    list = list.concat [$el.get 0]

                for child in list
                    $child = $(child)
                    @prepare_bind $e, $child, $child.html()

                true

            for query, activelist of @active_list_container
                activelist.bind $e.find query

            if ActiveView.auto_init and not @initialized
                @init()
            true

        #unbind not needed view relation
        unbind: (e) ->
            $e = $ e
            for key, list of @bindings
                for obj, index in list
                    if obj.root.is $e
                        list.splice(index, 1)

        #shouldn't be called directly, rather by initializeAll static method.
        init : ->
            @initialized = true
            for property of @properties_container
                @propertyChanged property
            true

    ###
    Usage sample.

    class exports.TestView extends exports.ActiveView
        me    : @dependencyProperty('me')
        teraz : @dependencyProperty('teraz', 12)
        active_list: @dependencyList('.items') #jquery style child query

    av = new Alcarin.TestView()
    av.me 'psychowico321'
    #av.teraz 0
    #console.log av.teraz()
    av.bind '#active-item'

    When you prepare class like this you can use in html:

    <li id="active-item">
        <span class="pepe" data-tutaj="jajajaja">tell {item.me} raz</span>
        <span>a {item.teraz} dwa powiedz</span>
        <input type="text" value="{item.teraz}">
    </li>

    And later, for sample in click method:
    $('#active-item').click ->
        #set "teraz" value to 13
        av.teraz 13
        #get "teraz" value, only for sample
        av.teraz()

    And value on template will be automatically updated.
    ###


    $ ->
        #to add this at end of queue
        $ ->
            Alcarin.ActiveView.initializeAll()