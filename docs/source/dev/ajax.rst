================
AJAX_ programming
================

On alcarin programming process you will often need AJAX_ methods - because
one of our objectives is creating rich user interface. Instead of default jquery ajax
methods you should use one of two alcarin ajax managing ways. First is RESTful style
requests, second - event style requests. Second way is prefered when you create ajax-only
controllers (what you should do in most cases).

.. _AJAX: http://pl.wikipedia.org/wiki/AJAX

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

    public function get($id)
    {
        if($id > 0) {
            return $this->json()->success(['text' => 'It working nice']);
        }
        else {
            return $this->json()->fail(['text' => 'It working bad']);
        }
    }


.. _RESTful: http://en.wikipedia.org/wiki/Representational_state_transfer
.. _`Zend Restful Controller`: http://framework.zend.com/manual/2.1/en/modules/zend.mvc.controllers.html#the-abstractrestfulcontroller