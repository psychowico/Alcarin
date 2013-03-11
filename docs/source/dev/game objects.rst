.. _`plugable-game-services`:

======================
Plugable game services
======================

One of the objectives of the game engine is api divided into logical game modules.
We achieve this by our *Plugable game services* system. It consists of the following elements:
 - **GameServiceContainer** - singleton class, that our plugable system heart
 - **GameObject** - classes inherit from \\Core\\GameObject class

You can get *GameServiceContainer* from most place in our code by getting
service_manager instance and use 'game-services' key:

.. code-block:: php

    <?php
    $game_services = $service_manager->get('game-services')

*GameServiceContainer* is lighter, faster (and less functional) version of
ZF2 ServiceManager. You can use it to retrieve registered GameObject's. For sample:

.. code-block:: php

    <?php
    //this will get for us instance of EngineBase\GameObject\Players class.
    $players     = $game_services->get('players');
    $logged_user = $players->current();

*GameServiceContainer* will load required class only when it will be needed - all services
are lazy loaded.

Often you need add you own GameObject service. For sample, you create
this simple class, in hypothetical module "Test";

.. code-block:: php

    <?php
    namespace Test;

    class RealWorldTime extends \Core\GameObject
    {
        public function current()
        {
            return time();
        }
    }

Note that it inherit from *\\Core\\GameObject*. Now, to get this class from *GameServiceContainer* you need register it. It can be done
in two ways - first is adding configuration key to you *module.config.php* file.

.. code-block:: php

    <?php
    return array(
        ...

        'game-modules' => array(
            'TestModule' => array(
                'discription'  => 'Our testing module',
                'game-objects' => array(
                    'real-world-time' => 'Test\RealWorldTime',
                ),
            ),
        ),

In our example we name our module *"TestModule"*. Module name should be unique - or they will
be merged and regard as one module. You can give any module description you want.
'real-world-time' is a key that you can use to retrieve you *GameObject*
from *GameServiceContainer*.

You can do this same by adding *getGameModuleConfig()* method to any of your
'Module' main class. For sample:

.. code-block:: php

    <?php
    namespace Test;

    class Module
    {
        ...

        public function getGameModuleConfig()
        {
            return array(
                'TestModule' => array(
                    'discription'  => 'Our testing module',
                    'game-objects' => array(
                        'real-world-time' => 'Test\RealWorldTime',
                    ),
                ),
            );
        )

        ...
    }

Next it is simple - you can retrieve you game object by his key.

.. code-block:: php

    <?php
    //this will get for us instance of Test\RealWorldTime class.
    $time     = $game_services->get('real-world-time');
    $current_time = $time->current();

So let go next. We want possibility to extending our game objects from another modules.
So we can, for example, giving our plugin possibility to returning inner game time.
We can do this by prepare next class with method that returning it:

.. code-block:: php

    <?php
    namespace Test;

    class RealWorldTimeExt extends \Core\GameObject
    {
        public function current()
        {
            //this only sample, not existed mongo table.
            $data = $this->mongo()->gametime->findOne([]);
            return $data['current_time'];
        }
    }

First you should note, than our GameObject extension inherit from \\Core\\GameObject. It is
not necessery - but give us few benefits in form of basis methods that we can use:
    - *mongo()*  - returning \\Mongo_Database class, our php mongo connection
    - *parent()* - returing this extension parent object, null if it is root GameObject
    - *has($ext_name)* - return true, if this game object has extension with specific name
    - *getServicesContainer()* - returning our *GameServiceConteiner* object

When you done writing our class you need register it in similar way like normal GameObject.
You just need use diffrent key name:

.. code-block:: php

    <?php
    'game-modules' => array(
        'TestModule' => array(
            'discription'  => 'Our testing module',
            'game-objects' => array(
                'real-world-time' => 'Test\RealWorldTime',
            ),
            'game-objects-ext' => array(
                'Test\RealWorldTime' => array(
                    'game' => 'Test\ReadlWorldTimeExt'
                ),
            ),
        ),
    ),

This mean that you register *Test\\ReadlWorldTimeExt* extension for
*GameObject* *Test\\RealWorldTime* and you call it "game". Now you can use it like in this
example:

.. code-block:: php

    <?php
    //this will get for us instance of Test\RealWorldTime class.
    $time     = $game_services->get('real-world-time');
    $current_time = $time->current();
    $current_game_time = $time->game()->current();

If you need check game modules configuration you can retrieve it from service manager, like
with all zf2 configuration entries:

.. code-block:: php

    <?php
    $game_modules_info = $service_manager->get('config')['game-modules'];
    $test_description  = $game_modules_info['TestModule']['discription'];
    echo $test_description;