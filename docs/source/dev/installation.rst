============
Installation
============

.. if you update this file you should update README.rst in main project directory too.

Introduction
============

Alcarin is a complex, browser game based on ZF2 technology. Inspiration for creating it
was Cantr_, old, similar game where characters live in more real environment.


.. _Cantr: http://cantr.net

Installation
============

Using Composer
--------------

The recommended way to get a working copy of this project is to clone the repository
and use `composer` to install dependencies:

.. code-block:: bash

    cd my/project/dir
    git clone git://github.com/psychowico/Alcarin.git
    cd Alcarin
    php composer.phar self-update
    php composer.phar install

(The `self-update` directive is to ensure you have an up-to-date `composer.phar`
available.)

Virtual Host
------------
Afterwards, set up a virtual host to point to the public/ directory of the
project and you should be ready to go!
