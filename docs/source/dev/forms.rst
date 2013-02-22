=====
Forms
=====

In alcarin project we prefer using zf2 annotations_ form system instead of standard form
system.

.. _`annotations` http://framework.zend.com/manual/2.0/en/modules/zend.form.quick-start.html#using-annotations

Alcarin code has prepared some facilities to make working with annotations forms easier.
First, you should use *\\Core\\Service\\AnnotationBuilderService* builder class instead of
zf2 default *AnnotationBuilder* class. You can use it like normal *AnnotationBuilder*:

.. code-block:: php

    <?php
    $builder = new \Core\Service\AnnotationBuilderService();
    $form    = $builder->createForm(new \Module\Form\MyFormName());


But it give you few additional benefits:
    - `default form fields`_
    - `registration custom validators`_
    - `registration custom filters`_

Default form fields
===================

By default *AnnotationBuilderService* *createForm* method adding default fields to any
created form. It use *Core\\Form\\DefaultFieldset* class as base form.
You can control this behaviour by *createForm* arguments:

.. code-block:: php

    <?php
    ...

    $submit_button_caption = 'Confirm';
    $use_default_fields = true;
    $form_ann = new \Module\Form\MyFormName();
    $form = $builder->createForm($form_ann, $submit_button_caption, $use_default_fields);


Registration custom validators
==============================

It is often case that you need add some custom validators to you form. You can do this by:

.. code-block:: php

    <?php
    ...
    $builder->registerCustomValidator('CheckIt', 'Module\Validator\MyTestValidator');
    ...

    //and in form class you now can add validator annotation:
    /**
     * @Annotation\Type("text")
     * @Annotation\Validator({"name":"CheckIt"})
     */
    public $username;

Registration custom filters
===========================

Registration of custom filters is similar like registration of custom validators:

.. code-block:: php

    <?php

    $builder->registerCustomFilter('FilterIt', 'Module\Filter\MyTestFilter');