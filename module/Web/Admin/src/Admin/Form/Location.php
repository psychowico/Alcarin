<?php

namespace Admin\Form;

use Zend\Form\Annotation;

class Location
{
    /**
     * @Annotation\Type("hidden")
     * @Annotation\Required(true)
     * @Annotation\Validator({"name": "Int"})
     */
    public $x;

    /**
     * @Annotation\Type("hidden")
     * @Annotation\Required(true)
     * @Annotation\Validator({"name": "Int"})
     */
    public $y;
}
