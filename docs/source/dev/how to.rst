============
Dev: How to?
============

How to define access permissions for page?
==========================================

When you define new controller, nobody have access to it. You need define how kind
of permissions is needed to have access to page. You do it by edit
*"config/autoload/global.php"* file - in config **controllers_access** -> **controllers**.

For sampe, assume you define new controller in admin page:

.. code-block:: php


    <?php

    return array(
        ...
        'controllers' => array(
            'invokables' => array(
                ...
                'Admin\Controller\Test'  => 'Admin\Controller\TestController',

Now this page will be unaccessible - because all pages are unaccessible by default. You need
define privilages for it. In *global.php*:

.. code-block:: php

    <?php
    return array(
    ...
    'controllers_access' => array(
        'controllers' => array(
            ...
            'Admin\Controller\Test'            => [],

By define empty array you will make this controller public accesible. To controll who have
access to it, you need open *Core\\Permission\\Resource* class and define new resource type
(or use exists) for you controller.

.. code-block:: php

    <?php
    class Resource
    {
        ...
        const ADMIN_TEST = 5;
        ...
        public static $Descriptions = [
            ...
            'Administrative' => [
                ...
                Resource::ADMIN_TEST => ["Test privilage", "This is simple, test privilage."],
            ]

**Resource::ADMIN_TEST** is a constant with resource id, that must be unique resource representation
(and must be lower than Resource::RESOURCE_LIMIT). In $Description table you define
informations that are use to display resource in player privilages
admin panel *(/admin/users/{id}/privilages)*. Now you can set this resource obligation
for you new controller:

.. code-block:: php

    <?php
    return array(
    ...
    'controllers_access' => array(
        'controllers' => array(
            ...
            'Admin\Controller\Test'            => [Resource::ADMIN_TEST],

Now only users with *"Test privilage"* option checked in privilages admin panel can request
you new controller.

Remember that you can more than one resources obligation for you controller.

How to add coffee/less files to project?
========================================

First, you should prepare you guard to automatically compile LESS and COFFEE files.
See there for details: :ref:`guard-configuration`.

Now, you should choose module where you shoud logically add you code. In this module you
open (or create) *static/coffee* or *static/less* directory. There you can create
subdirectories and put *.coffee/*.less files. They will be automatically compiled - results
will be stored in **public/js/compiled_coffee** \\ **public/js/compiled_less**,
with directory and name exactly like original file -
just with new extension - *.js* or *.css*.

Good practice is to create subdirectory with you module name
in your *static/coffee* \ *static/less*. For sample, if you create new less to manage
*orbis editor* view, you should probably use path:

    *{Admin module path}/static/less/Admin/orbis.less*

When you end editing this file you,
save it and let guard do work you can find results in

    */public/css/compiles_less/Admin/orbis.css*

Now you need register this new libraries in our project. Let open
*config/autoload/minifier.global.php* file and add js/css file path to suitable section.
Alcarin use `AssetsCompiler`_ js/css minify system. If you want learn more, read it docs.

.. _`AssetsCompiler`: https://github.com/psychowico/AssetsCompiler