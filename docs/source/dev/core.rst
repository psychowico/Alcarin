=========================
Core framework extensions
=========================

When working with project many specific zf2 extensions was created. They will be described here.

Routing
=======

About routing in zf2 you can read there: http://framework.zend.com/manual/2.0/en/modules/zend.mvc.routing.html .
In alcarin project we use specific, project route type: 'alcarin' route.
You can see example of use it on *../Admin/config/module.config.php*. You will see something like that:

.. code-block:: php

    <?php

    'router' => array(
        'routes' => array(
            'admin' => array(
                'type'    => 'alcarin',
                'options' => array(
                    'route'    => '/admin',
                    'namespace'=> 'Admin\Controller',
                    'restmode' => true,
                    'defaults' => array(
                        'controller' => 'Home',
                    ),
                ),
            ),
        ),
        /* declaring specific routes subfolders and corresponding namespaces */
        'namespaces' => array(
            'admin/subdefault' => array(
                'users' => 'Admin\Controller\Users',
            ),
        ),
    ),

Let us look at the various options:
    - *'type' => 'alcarin'* - our route type
    - *'route' => '/admin'* - route root path
    - *'namespace => 'Admin\Controller'* - base namespace where this route will be looking for controllers
    - *'restmode' => true* - should this route use RESTful controller standard or default, ActionControllers
    - *defaults* => ...* - defaults params that will be used by routes

All of this is only shortcut for the following part route:

.. code-block:: php

    <?php
    'route' => array(
            'type' => 'literal',
            'options' => array(
                'route' => '/admin',
                'defaults' => array(
                    '__NAMESPACE__' => 'Admin\Controller',
                )
            ),
        ),
        'may_terminate' => false,
        'child_routes' => array(
            'default' => array(
                'type' => 'Segment',
                'options' => array(
                    //when restmode is off it will be:
                    //'/:controller[/:action]'
                    'route' => '[/:controller][/:id][/:action]',
                    'defaults' => $defaults,
                ),
                'constraints' => array(
                    'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                ),
            ),
            'subdefault' => array(
                'type'    => 'Segment',
                'options' => array(
                    //when restmode is off it will be:
                    //'/:__NAMESPACE__/:controller[/:action]'
                    'route'    => '/:__NAMESPACE__/:id/:controller[/:action]',
                    'defaults' => array(),
                    'constraints' => array(
                        '__NAMESPACE__' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'controller'    => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[a-zA-Z0-9_-]+',
                        'action'        => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                ),
            ),
        ),

What job is done for us by this? It give our few routes type possibility.
First, at our root route (in our example */admin*) we have our default controller, prepended by
namespace given.

    /admin -> Admin\\Controller\\Home

Depthly, we can use "admin/default" route with some more params:
    /admin/items

This will be resolved to controller **Amin\\Controller**\\Items and call it "getList" method.

    /admin/items/13

This want too **Amin\\Controller**\\Items and calling it "get" method with $id param setted to 13.

What about "admin/subdefault"? This is used to calling controllers in our root namespaces subnamespaces.
First sample use "admin/default" route:
    /admin/users/13 -> Admin\\Controller\\Users, id == 13
And second "admin/subdefault":
    /admin/users/13/privilages
And it is resolved to controller **Admin\\Controller\\Users**\\Privilages.
namespace param "users" has been mapped to **Admin\\Controller\\Users** because since it
has been marked in the 'router'->'namespaces' config:

.. code-block:: php

    <?php

    'router' => array(
        ...
        /* declaring specific routes subfolders and corresponding namespaces */
        'namespaces' => array(
            'admin/subdefault' => array(
                'users' => 'Admin\Controller\Users',
            ),
        ),
    ),