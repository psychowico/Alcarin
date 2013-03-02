<?php

namespace Core\Form\Element;

class Select extends \Zend\Form\Element\Select
{
    protected $validation_disabled = false;

    public function disableValidation($disable = true)
    {
        $this->validation_disabled = $disable;
        return $this;
    }

    public function getInputSpecification()
    {
        $spec = array(
            'name' => $this->getName(),
            'required' => true,
        );

        if(!$this->validation_disabled) {
            $spec['validators'] = [$this->getValidator()];
        }

        return $spec;
    }
}