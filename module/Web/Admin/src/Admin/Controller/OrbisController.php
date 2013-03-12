<?php
/**
 * users administration
 */

namespace Admin\Controller;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\View\Model\ViewModel;
use Zend\InputFilter\Input;

class OrbisController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'gateway_form' => $this->getServiceLocator()->get('gateways-form'),
            'radius' => $this->orbis()->minimap()->properties()->radius(),
            'radius_form' => $this->getRadiusForm(),
        ];
    }

    public function create($data)
    {
        $form = $this->getRadiusForm();
        $form->setData($data);

        if($form->isValid()) {
            $new_radius = $form->getData()['radius'];
            $this->orbis()->minimap()->properties()->set('radius', $new_radius);
        }
        return $this->redirect()->toSelf();
    }

    public function get($id)
    {
        $args = explode(',', $id);
        if(count($args) >= 2) {
            list($x, $y) = $args;
            $x = floatval($x);
            $y = floatval($y);
            $range = empty($args[2]) ? null : $args[2];
            if($this->isJson()) {
                return $this->json()->success([
                    'map' => $this->getMapAtRange($x, $y, $range)
                ]);
            }

            $map = $this->orbis()->minimap();
            $radius = $map->properties()->radius();
            if($x <= $radius && $y <= $radius ) {
                $model = new ViewModel([
                    'x' => $x,
                    'y' => $y,
                    'range' => $range
                ]);
                return $model->setTemplate('admin/orbis/orbis/editor');
            }
        }

        return $this->redirect()->toParent();
    }

    private function orbis()
    {
        return $this->gameServices()->get('orbis');
    }

    private function getRadiusForm()
    {
        $radius = $this->orbis()->minimap()->properties()->radius();
        $form = new \Zend\Form\Form('radius-form');
        $form->add([
            'name' => 'radius',
            'type' => 'text',
            'options' => [
                'label'=> 'World radius:',
                'twb' => [
                    'help-inline' => $radius / 10 . 'km',
                ],
            ],
            'attributes' => [
                'min'   => $radius,
                'value' => $radius,
                'autocomplete' => 'off',
            ],
        ]);

        $radius_validator = new \Zend\Validator\GreaterThan(['min' => $radius]);

        $input = new Input('radius');
        $input->getValidatorChain()->addValidator($radius_validator);

        $filters = $form->getInputFilter()->add($input);

        return $form;
    }

    private function getMapAtRange($x, $y, $range = null)
    {
        return ['test'];

    }
}