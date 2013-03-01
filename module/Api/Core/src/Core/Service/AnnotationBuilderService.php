<?php

namespace Core\Service;

use Zend\Form\Annotation\AnnotationBuilder;
use Zend\Stdlib\ArrayUtils;

/**
 * Parses a class' properties for annotations in order to create a form and
 * input filter definition. it is wrapper to make much easier to use default
 * annotation builder
 */
class AnnotationBuilderService
{
    protected $builder;
    protected $default_fieldset;

    protected function builder()
    {
        if( $this->builder == null ) {
            $this->builder = new \Zend\Form\Annotation\AnnotationBuilder();
        }

        return $this->builder;
    }

    public function getDefaultFieldset()
    {
        if( $this->default_fieldset == null ) {
            $this->default_fieldset = new \Core\Form\DefaultFieldset();
        }
        return $this->default_fieldset;
    }

    public function setDefaultFieldset($fieldset)
    {
        $this->default_fieldset = $fieldset;
        return $this;
    }

    /**
     * easy method to use custom validators in annotation builded forms
     */
    public function registerCustomValidator($key, $service_or_invokable)
    {
        $builder = $this->builder();

        $input_factory = $builder->getFormFactory()->getInputFilterFactory();
        $validator_chain = $input_factory->getDefaultValidatorChain();
        if( $validator_chain == null ) {
            $validator_chain = new \Zend\Validator\ValidatorChain();
        }

        $validator_plugins  = $validator_chain->getPluginManager();

        $validator = $service_or_invokable;
        if( is_string($service_or_invokable) ) {
            //ading service as callable object
            $validator = new $service_or_invokable();
        }

        //adding service directly
        $validator_plugins->setService($key, $validator);

        $input_factory->setDefaultValidatorChain( $validator_chain );
        return $this;
    }

    /**
     * easy method to use custom filters in annotation builded forms
     */
    public function registerCustomFilter($key, $service_or_invokable)
    {
        $builder = $this->builder();

        $input_factory = $builder->getFormFactory()->getInputFilterFactory();
        $filter_chain = $input_factory->getDefaultFilterChain();
        if( $filter_chain == null ) {
            $filter_chain = new \Zend\Filter\FilterChain();
        }

        $filter_plugins  = $filter_chain->getPluginManager();

        $filter = $service_or_invokable;
        if( is_string($service_or_invokable) ) {
            //ading service as callable object
            $filter = new $service_or_invokable();
        }

        //adding service directly
        $filter_plugins->setService($key, $filter);

        $input_factory->setDefaultValidatorChain( $filter_chain );
        return $this;
    }

    /**
     * Create a form from an object.
     *
     * @param  string|object $entity
     * @return \Zend\Form\Form
     */
    public function createForm($entity, $add_default_fieldset = true, $submit_button_caption = null)
    {
        $form = $this->builder()->createForm($entity);

        if( $add_default_fieldset ) {
            $default = $this->generateDefaultFieldset($submit_button_caption);
            //I just added fieldset elements to form, because simple adding full fieldset
            //generate some problems when rendering. (ZF2.2.0)
            foreach( $default->getElements() as $name => $el ) {
                if(!$form->has($name)) {
                    $form->add($el);
                }
            }
        }

        return $form;
    }

    protected function createFieldset($entity)
    {
        $formSpec    = ArrayUtils::iteratorToArray($this->builder()->getFormSpecification($entity));
        $formFactory = $this->builder()->getFormFactory();
        return $formFactory->createFieldset($formSpec);
    }

    protected function generateDefaultFieldset($submit_button_caption)
    {
        $builder = $this->builder();

        $default = $this->getDefaultFieldset();
        $fieldset = $this->createFieldset($default);

        if( $submit_button_caption !== null ) {
            $fieldset->get('submit')->setValue($submit_button_caption);
        }

        return $fieldset;
    }
}