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
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Gateway name:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"new_gateway"})
     */
    public $name;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Gateway description:"})
     * @Annotation\Required(false)
     */
    public $description;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"X:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"0"})
     * @Annotation\Validator({"name": "Float"})
     */
    public $x;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Y:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"0"})
     * @Annotation\Validator({"name": "Float"})
     */
    public $y;
}
