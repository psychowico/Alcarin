<?php

namespace Admin\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class GatewaysFormFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $sm)
    {
        $ungrouped_filter = new \Zend\Filter\PregReplace([
            'pattern'     => '/Ungrouped/',
            'replacement' => '0'
        ]);

        $builder = $sm->get('AnnotationBuilderService');
        $builder->registerCustomFilter('UngroupedFilter', $ungrouped_filter);

        $form = $builder->createForm( new \Admin\Form\EditGatewayForm(), true, 'Save');

        # let disable default InArray select validator for groups - they are dynamic
        # and not needed this validator.
        $form->get('group')->disableValidation();

        return $form;
    }
}