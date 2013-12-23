<?php

namespace Alcarin\Controller\Game;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Core\Permission\Resource;
use \EngineBase\GameObject\Char\Race;

class CreateCharController extends AbstractAlcarinRestfulController
{
    protected function getForm()
    {
        $_   = $this->gameServices()->get('translations')->translation('static', 'race');
        $all = $_->allValues();

        $builder = $this->getServiceLocator()->get('AnnotationBuilderService');
        $form = $builder->createForm(new \Alcarin\Form\CreateCharForm(), true, 'Create');
        $values = [];
        foreach(Race::$ALL as $key => $obj) {
            $values[$key] = $all[$key];
        }
        $form->get('race')->setValueOptions($values);
        $form->setAttribute('action', $this->url()->fromRoute(
            'alcarin/default', ['controller' => 'create-char'])
        );

        return $form;
    }

    public function getList()
    {
        $form    = $this->getForm();
        return ['form' => $form];
    }

    public function create($data)
    {
        $form = $this->getForm();
        $form->setData($data);
        if($form->isValid($data)) {
            $data = $form->getData();
            $charname = $data['charname'];

            $a_options = ['race', 'sex'];
            $options = [];
            foreach ($a_options as $key) {
                $options[$key] = $data[$key];
            }

            $this->player()->chars()->create($charname, $options);
        }

        return $this->redirect()->toParent();
    }
}
