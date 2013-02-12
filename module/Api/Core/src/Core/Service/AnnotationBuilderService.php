<?php

namespace Core\Service;

use Zend\Form\Annotation\AnnotationBuilder;

/**
 * Parses a class' properties for annotations in order to create a form and
 * input filter definition. it is wrapper to make much easier to use default
 * annotation builder
 */
class AnnotationBuilderService
{
    protected $builder;

    protected function builder()
    {
        if( $this->builder == null ) {
            $this->builder = new \Zend\Form\Annotation\AnnotationBuilder();
        }

        return $this->builder;
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
        $validator_plugins->setService('TestValidator', $validator);

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
        $filter_plugins->setService('TestValidator', $filter);

        $input_factory->setDefaultValidatorChain( $filter_chain );
        return $this;
    }

    /**
     * Create a form from an object.
     *
     * @param  string|object $entity
     * @return \Zend\Form\Form
     */
    public function createForm($entity)
    {
        return $this->builder()->createForm($entity);
    }
}