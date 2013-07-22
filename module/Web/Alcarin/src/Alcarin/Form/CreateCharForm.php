<?php

namespace Alcarin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("create-char-form")
 * @Annotation\Attributes({"class": "create-char"})
 */
class CreateCharForm
{
    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"Name"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"data-descr": "name"})
     */
    public $charname;

    /**
     * @Annotation\Type("select")
     * @Annotation\Required(true)
     * @Annotation\Options({"label":"Race"})
     * @Annotation\Attributes({"data-descr": "race"})
     */
    public $race;

    /**
     * @Annotation\Type("radio")
     * @Annotation\Options({"label":"Sex", "value_options":{"m": "Male", "f": "Female"}})
     * @Annotation\Attributes({"value":"m", "data-descr": "sex"})
     */
    public $sex;
}
