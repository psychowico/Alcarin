<?php

namespace Admin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("edit-gateway-form")
 * @Annotation\Attributes({"class":"form-horizontal"})
 */
class EditGatewayForm
{
    /**
     * @Annotation\Type("hidden")
     * @Annotation\Required(false)
     * @Annotation\Attributes({"value":"{item.id}"})
     */
    public $id;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Gateway name:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"{item.name}"})
     */
    public $name;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Gateway description:"})
     * @Annotation\Required(false)
     * @Annotation\Attributes({"value":"{item.description}"})
     */
    public $description;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"X:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"{item.x}"})
     * @Annotation\Validator({"name": "Float"})
     */
    public $x;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Y:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"{item.y}"})
     * @Annotation\Validator({"name": "Float"})
     */
    public $y;
}
