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
     * @Annotation\Attributes({"value":"post"})
     */
    public $_method;

    /**
     * @Annotation\Type("csrf")
     */
    // temporary removed, need thing how connect this feature with angularjs system
    // public $CSRF;

    /**
     * @Annotation\Type("submit")
     * @Annotation\Attributes({"value":"Submit"})
     */
    public $submit;
}