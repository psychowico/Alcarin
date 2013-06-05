<?php

namespace Admin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("edit-gateway-form")
 * @Annotation\Attributes({"class":"form-horizontal", "data-ng-submit"="save()"})
 */
class EditGatewayForm
{
    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Gateway name:"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"data-ng-model":"rel.name"})
     */
    public $name;

    /**
     * @Annotation\Type("select")
     * @Annotation\Required(true)
     * @Annotation\Options({"label":"Gateway group:"})
     * @Annotation\Attributes({"data-ng-options":"group.name as group.displayname() for group in groups","data-ng-model": "rel.group"})
     * @Annotation\Filter({"name": "UngroupedFilter"})
     */
    public $group;

    /**
     * @Annotation\Type("textarea")
     * @Annotation\Options({"label":"Description:"})
     * @Annotation\Required(false)
     * @Annotation\Attributes({"data-ng-model":"rel.description", "rows": 10})
     */
    public $description;

    /**
     * @Annotation\Type("hidden")
     * @Annotation\Required(true)
     */
    public $id;

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
