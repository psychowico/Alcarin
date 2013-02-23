<?php

namespace Core\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("default-fieldset")
 */
class DefaultFieldset
{
    /**
     * @Annotation\Type("hidden")
     * @Annotation\Required(false)
     * @Annotation\Attributes({"value":"POST"})
     */
    public $_method;

    /**
     * @Annotation\Type("csrf")
     */
    public $CSRF;

    /**
     * @Annotation\Type("submit")
     * @Annotation\Attributes({"value":"Submit"})
     */
    public $submit;
}