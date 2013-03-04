<?php

namespace Admin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("edit-gateway-form")
 * @Annotation\Attributes({"class":"form-horizontal ajax-form"})
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
     * @Annotation\Type("select")
     * @Annotation\Required(true)
     * @Annotation\Options({"label":"Gateway group:"})
     * @Annotation\Attributes({"class": "active-group", "options":{"{item.group_name}":"{item.group_name}"}})
     * @Annotation\Filter({"name": "UngroupedFilter"})
     */
    public $group;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"X:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"{item.x}"})
     * @Annotation\Validator({"name": "Int"})
     */
    public $x;

    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Y:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"value":"{item.y}"})
     * @Annotation\Validator({"name": "Int"})
     */
    public $y;

    /**
     * @Annotation\Type("textarea")
     * @Annotation\Options({"label":"Description:"})
     * @Annotation\Required(false)
     * @Annotation\Attributes({"value":"{item.description}", "rows": 10})
     */
    public $description;
}
