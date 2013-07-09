<?php

namespace Alcarin\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Stdlib\Hydrator\ObjectProperty")
 * @Annotation\Name("talking-form")
 * @Annotation\Attributes({"data-ng-submit":"talkToAll()"})
 */
class TalkingForm
{
    /**
     * @Annotation\Type("textarea")
     * @Annotation\Options({"label":"mów do wszystkich"})
     * @Annotation\Required(true)
     * @Annotation\Attributes({"autocomplete":"off", "data-alc-talking-input": "talkToAll($content)", "tabindex" : "1"})
     */
    public $content;
}
