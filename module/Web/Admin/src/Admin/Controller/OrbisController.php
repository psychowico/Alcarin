<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\InputFilter\InputFilter;

class OrbisController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        if($this->isJson()) {
            $grouped_gateways = $this->orbis()->gateways()->find();

            return $this->json(['gateways' => $grouped_gateways]);
        }
        else {
            return [
                'gateway_form' => $this->getForm()
            ];
        }
    }

    public function create($data)
    {
        $filter = $this->gatewayInputFilter();
        $filter->setData($data);

        if($filter->isValid()) {
            $data = $filter->getValues();
            $gateway_name  = $data['name'];
            $gateway_group = empty($data['group']) ? null : $data['group'];

            $this->orbis()->gateways()->insert($gateway_name, $gateway_group);
            return $this->json()->success();
        }
        else {
            return $this->json(['success' => false, 'errors' => $filter->getMessages()]);
        }
    }

    public function update($id, $data)
    {
        $mode = empty($data['name']) ? 'gateway' : $data['name'];
        $filter = $this->gatewayInputFilter();

        if(!empty($data['value'])) {
            if($mode == 'group-name') {
                $group_filter = $filter->get('group');

                $group_name = $id;
                $new_name = $data['value'];

                if($group_filter->setValue($group_name)->isValid()
                    && $group_filter->setValue($new_name)->isValid($new_name)) {
                    //validated value
                    $new_name = $group_filter->getValue();
                    $result = $this->orbis()->gateways()->rename_group($group_name, $new_name);
                    if(is_string($result)) {
                        return $this->json([
                            'success' => false,
                            'error'   => $result,
                        ]);
                    }
                    else {
                        return $this->json()->success();
                    }

                }
            }
            else {
                //gateways
                return $this->json(['test'=> 'to jest test']);
            }
        }

        return $this->json()->fail();
    }

    public function delete($id)
    {
        $mode = $this->params()->fromPost('mode', 'gateway');

        if($mode == 'group') {
            $group_name = $id;
            $this->orbis()->gateways()->delete_group($group_name);

            return $this->json()->success();
        }

        return $this->json()->fail();
    }

    protected function orbis()
    {
        return $this->gameServices()->get('orbis');
    }

    protected function gatewayInputFilter()
    {
        $inputFilter = new InputFilter();

        $filters = [
            [
                'name'     => 'name',
                'filters'  => [
                    ['name' => 'StripTags'],
                    ['name' => 'StringTrim'],
                ],
                'validators' => [ [
                        'name'    => 'StringLength',
                        'options' => [
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 50,
                        ],
                ]],
            ],
            [
                'name'     => 'group',
                'allow_empty' => true,
                'filters'  => [
                    ['name' => 'StripTags'],
                    ['name' => 'StringTrim'],
                ],
                'validators' => [
                    [
                        'name'    => 'StringLength',
                        'options' => [
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 50,
                        ],
                    ],
                ],
            ]
        ];

        foreach( $filters as $filter ) {
            $inputFilter->add( $filter );
        }

        return $inputFilter;
    }

    protected function getForm()
    {
        $form_prototype = new \Admin\Form\EditGatewayForm();
        $builder = new \Core\Service\AnnotationBuilderService();
        return $builder->createForm($form_prototype, 'Save');
    }

}