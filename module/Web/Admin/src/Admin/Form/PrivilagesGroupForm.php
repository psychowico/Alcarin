<?php

namespace Admin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("privilages-group-form")
 */
class PrivilagesGroupForm
{
    /**
     * @Annotation\Type("hidden")
     * @Annotation\Attributes({"value":"PUT"})
     */
    public $_method;

    /**
     * @Annotation\Type("hidden")
     */
    public $group;

    /**
     * @Annotation\Type("multicheckbox")
     * @Annotation\Required(false)
     * @Annotation\Options({"label":"", "value_options": { "empty" }})
     */
    public $resource;
}
