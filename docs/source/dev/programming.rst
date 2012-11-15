===========
Programming
===========

Here you can found instruction about how prepare your environment to easy work with Alcarin code
and what exacly you should know to start.

Preparing
=========

Base introduction you can find on :ref:`installation` page.

Alcarin has been written in PHP language, as persistent mechanism MongoDB_ has been used.

If you want developing new code you should know few technologies:
 - ZF2_, php framework used to create this game, if you want to learn about it `there is good place to start`_
 - MongoDB_, NoSQL database system. We use `mongodb-php-odm php library`_ from *colinmollenhour*, it is easy and intuitive - if you know MongoDB
 - CoffeeScript_, this is a little language that compiles into JavaScript. Make work with JS much easier and enjoyable
 - LESS_, the dynamic stylesheet language, compiling to CSS.
 - TWIG_, the flexible, fast, and secure template engine for PHP

 .. _ZF2: http://framework.zend.com/
 .. _`there is good place to start`: http://framework.zend.com/manual/2.0/en/user-guide/overview.html
 .. _MongoDB: http://www.mongodb.org/
 .. _`mongodb-php-odm php library`: https://github.com/colinmollenhour/mongodb-php-odm
 .. _CoffeeScript: http://coffeescript.org/
 .. _LESS: http://lesscss.org/
 .. _TWIG: http://twig.sensiolabs.org/

Read about `guard configuration`_ to make you life easier with automate compile LESS, COFFEE, docs
and reloading browser when you make any changes in project.

Architecture design
===================

.. note:: You should have basic understand of Zend Framework 2 to read this.

We can recognize three part of application. This will be API_, Web_ and Dev_.

API
---

Api code should not provide any normal views, but only logic that can used to achive any action
accesible in the game. It use JSON to `communicate with clients`_. Thanks to this later we can
create another client tool (for sample application written in java) to play Alcarin. All API
modules should be stored in *module/API* directory. We use RESTful standard to write our controllers
in this app part.

Web
---

This is the main Alcarin web page. It contains all views and use API_ code to call game mechanic.
You can find there specific modules - with *admin*, *game master*, *guest* and normal player views.
In modules we have additional, not standard, *.../static* directory. Inside coffee and less files
are store, they will be compiled to css/js and moved to */public/..* directory.

Dev
---

Additional code that is useful to debugging and developing application, for sample mongo panel to
ZendDeveloperTools_.

.. _ZendDeveloperTools: https://github.com/zendframework/ZendDeveloperTools

Remember to read samples code before writing anything.



.. _`communicate with clients`: http://en.wikipedia.org/wiki/Client%E2%80%93server_model