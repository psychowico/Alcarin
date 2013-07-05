===========
Programming
===========

Here you can found instruction about how prepare your environment to easy work with Alcarin code
and what exacly you should know to start.

Preparing
=========

Base introduction you can find on :ref:`installation` page.

Alcarin has been written in PHP language, as persistent mechanism MongoDB_ has been used.

If you want developing new code you should have minimum knowledge about the following technologies:
 - ZF2_, php framework used to create this game, if you want to learn about it `there is good place to start`_
 - MongoDB_, NoSQL database system. We use `mongodb-php-odm php library`_ from *colinmollenhour*, it is easy and intuitive - if you know MongoDB
 - CoffeeScript_, this is a little language that compiles into JavaScript. Make work with JS much easier and enjoyable
 - LESS_, the dynamic stylesheet language, compiling to CSS.
 - TWIG_, the flexible, fast, and secure template engine for PHP
 - AngularJS_, HTML enhanced for web apps
 - `Node.js`_, a server-side software system designed for writing scalable Internet applications, notably web servers
 - `socket.io`_, aims to make realtime apps possible in every browser and mobile device, blurring the differences between the different transport mechanisms

 .. _ZF2: http://framework.zend.com/
 .. _`there is good place to start`: http://framework.zend.com/manual/2.0/en/user-guide/overview.html
 .. _MongoDB: http://www.mongodb.org/
 .. _`mongodb-php-odm php library`: https://github.com/colinmollenhour/mongodb-php-odm
 .. _CoffeeScript: http://coffeescript.org/
 .. _LESS: http://lesscss.org/
 .. _TWIG: http://twig.sensiolabs.org/
 .. _AngularJS: http://http://angularjs.org//
 .. _`Node.js`: http://nodejs.org/
 .. _`socket.io`: http://socket.io/

Read about `guard configuration`_ to make you life easier with automate compile LESS, COFFEE, docs
and reloading browser when you make any changes in project.


Architecture design
===================

----------------------
ZF2 - Alcarin Web Page
----------------------

Web interface for Alcarin game - written in PHP. You can found code on github:
https://github.com/psychowico/Alcarin

.. note:: You should have basic understand of Zend Framework 2 to read this.

We can recognize three part of application. This will be API_, Web_ and Dev_.

API
---

Api code should not provide any normal views, but only logic that can used to achive any action
accesible in the game. It use JSON to `communicate with clients`_. Thanks to this later we can
create another client tool (for sample application written in java) to play Alcarin. All API
modules should be stored in *module/API* directory. We use RESTful standard to write our controllers
in this app part.

.. _`communicate with clients`: http://en.wikipedia.org/wiki/Client%E2%80%93server_model

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

---------------------
AlcarinGameplayServer
---------------------

Server application writed in *Node.js* and *socket.io*. It provide real-time event-based
communication system for main Alcarin web interface page - character page. It listening
on specific port, accepting browser connections and provide communication between logged
players without database.

.. _`guard-configuration`:

Guard configuration
===================

https://github.com/guard/guard

Guard is a command line tool to easily handle events on file system modifications. If you do not
want waste you time to recompiling your coffeescript, less files, RST docs or reloading web-browser
after any changes in code - it is something that you need.
You need fallow guard installation instructions. Next you should install 4 plugins:
 - **guard-less** to automatically compiles less (like lessc --watch)
 - **guard-coffeescript** to automatically generates your JavaScripts from your CoffeeScripts
 - **guard-shell** to automatically runs shell commands when watched files are modified
 - **guard-livereload** to automatically reloads your browser when 'view' files are modified

You will find them on `guard plugins page`_.

If you have all installed you can simply go to *Alcarin* main directory and write:

.. code-block:: bash

    guard

And it is all. All your coffeescripts, less files and docs will be automatically recompiling.
If you want use livereload too (auto reload browser when your make changes in files) you will
probably need a browser plugin, related with you client type. Check on `this site`_.

.. _`guard plugins page`: https://rubygems.org/search?query=guard-
.. _`this site`: http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-