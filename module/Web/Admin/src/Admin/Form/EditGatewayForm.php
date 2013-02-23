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
     * @Annotation\Attributes({"value":"new_gateway", "id": "name"})
     */
    public $name;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Gateway description:"})
     * @Annotation\Required(false)
     * @Annotation\Attributes({"id": "description"})
     */
    public $description;
}
