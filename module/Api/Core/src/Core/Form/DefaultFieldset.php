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
     * @Annotation\Type("csrf")
     */
    public $CSRF;

    /**
     * @Annotation\Type("submit")
     * @Annotation\Attributes({"value":"Submit"})
     */
    public $submit;
}