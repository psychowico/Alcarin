===========================
Zend Framework 2 extensions
===========================

When working with project many specific zf2 extensions has been created.
They will be described here.

Controller Plugins
==================

http://framework.zend.com/manual/2.2/en/modules/zend.mvc.plugins.html

Fast list:
 - isAllowed - *check that logged user is allowed to use specific $resource*
 - isJson - *simple plugin that checking that actual request except "json" response (in 'accept' header)*
 - json - *faster json responses, check this for sample:* :ref:`json-example`
 - redirect - *additional functionality for default zf2* redirect_ *plugin*
 - responses - *shortcut for returning non-200 html responses*
 - logger - *plugin helpers to have easy access to logging system*

.. _redirect: http://framework.zend.com/manual/2.2/en/modules/zend.mvc.plugins.html#zend-mvc-controller-plugins-redirect

View Helpers
============

http://framework.zend.com/manual/2.2/en/modules/zend.view.helpers.html

Fast list:
 - player - *return current player game object*
 - isAllowed - *check that logged user is allowed to use specific $resource*
 - helpButton - *auto-create dynamic help button for admin sites*
 - helpButton - *auto-create dynamic help button for admin sites*
 - uri - *extension for default zf2* url_ *plugin*

 .. _url: http://framework.zend.com/manual/2.2/en/modules/zend.view.helpers.html#url-helper