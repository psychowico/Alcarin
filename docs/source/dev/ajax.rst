================
AJAX_ programming
================

On alcarin programming process you will often need AJAX_ methods - because
one of our objectives is creating rich user interface. Instead of default jquery ajax
methods you should use one of two alcarin ajax managing ways. First is RESTful style
requests, second - event style requests. Second way is prefered when you create ajax-only
controllers (what you should do in most cases).

.. _AJAX: http://pl.wikipedia.org/wiki/AJAX

Urls
====

Transfering ajax targets urls by html *data* attributes and others html ways is trivial,
awkward and time-consuming. To make it easier we just simple put static urls to global
accesible **urls** object. You will find it in *..Alcarin\\static\\coffee\\urls.coffee*.
When you need new urls for your ajax calls, just add it to this object and use anywhere
in code.

RESTful_ requests
================

To use RESTful_ requests style first you prepare default `Zend Restful Controller`_. To make
work easier, you should consider using *Core\\Controller\\AbstractAlcarinRestfulController*
instead of default *AbstractRestfulController*. It implement all 4 defaults restful methods,
so you not must implement them all (if you need only part of it). Moreover it give you some
better errors support (in JSON mode) and two shortcuts method:
    * mongo() - returing mongodb object, our wrapper for default Mongo php drivers
    * gameServices() -returning GameServiceContainer instance, use with our code subsystem: :ref:`plugable-game-services`.

To work faster with JSON responses, you should use alcarin **"json()"** controller plugin.
Here is few samples of use it:

.. code-block:: php

    <?php

    ...
    public function getList()
    {
        //this same like:
        //return $this->json()->__invoke(...);
        //it will return jsonmodel
        return $this->json(['text' => 'this is page information']);
    }

As long as we using AngularJS js framework to ajax calls you should use angular `$resource`_
module (for REST requests) or angular `$http`_ module (if you want make not-REST requests).
Check their documentations for API and examples.

.. _RESTful: http://en.wikipedia.org/wiki/Representational_state_transfer
.. _`Zend Restful Controller`: http://framework.zend.com/manual/2.1/en/modules/zend.mvc.controllers.html#the-abstractrestfulcontroller
.. _$resource: http://docs.angularjs.org/api/ngResource.$resource
.. _$http: http://docs.angularjs.org/api/ng.$http