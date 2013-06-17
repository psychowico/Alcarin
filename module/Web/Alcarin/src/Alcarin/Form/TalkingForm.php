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
     * @Annotation\Attributes({"autocomplete":"off", "data-ng-model":"talkContent"})
     * @Annotation\Attributes({"autocomplete":"off", "data-ui-event":"{keydown: 'onKeyDown($event)'}"})
     */
    public $content;
}
