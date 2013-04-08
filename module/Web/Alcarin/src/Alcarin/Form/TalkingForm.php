<?php

namespace Alcarin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("talking-form")
 * @Annotation\Attributes({"class":"ajax-form", "autocomplete":"off"})
 */
class TalkingForm
{
    /**
     * @Annotation\Type("text")
     * @Annotation\Options({"label":"mów do wszystkich"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"autocomplete":"off"})
     */
    public $content;
}
