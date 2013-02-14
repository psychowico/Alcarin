============
Installation
============

Alcarin is a complex, browser mmorpg game based on ZF2 technology. Inspiration for creating it
was Cantr_, old, similar game where characters live in more real environment.


You can find full docs here: http://alcarin.readthedocs.org/.

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

In second step you should copy all "dist" configuration files to you local and reconfigure
their if needed. Fastest way on linux is:

.. code-block:: bash

    for i in config/autoload/*.dist; do cp "$i" "${i/.dist/}"; done


Finally, if you are on UNIX system, you will probably need give change owner for you
data/cache directory, for this same like you php server use. On apache this will probably
work:

.. code-block:: bash

    sudo chown www-data data/cache


Virtual Host
------------
Afterwards, set up a virtual host to point to the public/ directory of the
project and you should be ready to go!

Administration
--------------

You will probably need user with all privilages to work easy and fast. You can create one
by using console script, in project main directory:

.. code-block:: bash

    bin/createsu alcarin@test.com test321

First argument will be super user email address, second - password. You can use any
email and password you want.