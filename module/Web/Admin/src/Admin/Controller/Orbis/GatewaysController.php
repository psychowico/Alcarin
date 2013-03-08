<?php
/**
 * users administration
 */

namespace Admin\Controller\Orbis;

use Core\Controller\AbstractEventController;

class GatewaysController extends AbstractEventController
{
    protected function onGatewaysFetch($data)
    {
        $grouped_gateways = $this->orbis()->gateways()->find();
        foreach($grouped_gateways as $key => $group) {
            $grouped_gateways[$key] = array_map( function($gateway) {
                $gateway['id'] = $gateway['_id']->{'$id'};
                unset($gateway['_id']);
                return $gateway;
            }, $group );
        }

        $response = $this->success(['gateways' => $grouped_gateways]);
        return $this->emit('gateways.all', $response );
    }

    protected function onGroupCreate($data)
    {
        $form = $this->getServiceLocator()->get('gateways-form');
        $form->remove('CSRF');

        $form->setData($data);

        $result = null;
        if($form->isValid()) {
            $data = $form->getData();
            $gateway_name  = $data['name'];
            $gateway_group = empty($data['group']) ? null : $data['group'];


            $gateway_desc  = empty($data['description']) ? null : $data['description'];
            $x             = empty($data['x']) ? 0 : $data['x'];
            $y             = empty($data['y']) ? 0 : $data['y'];

            $result_id = $this->orbis()->gateways()->insert(
                $gateway_name, $gateway_desc,
                $x, $y, $gateway_group);
            if($result_id !== false) {
                $data['id'] = $result_id;
                $result = $this->success($data);
            }
            else {
                $result = $this->fail();
            }
        }
        else {
            $result = $this->fail(['errors' => $form->getMessages()]);
        }
        return $this->emit('group.created', $result);
    }

    protected function onGroupDelete($data)
    {
        $this->orbis()->gateways()->delete_group($data['id']);
        $result = $this->success($data);
        return $this->emit('group.deleted', $result);
    }

    public function create($data)
    {
        $creating_group = !empty($data['creating_group']);

        $form = $this->getServiceLocator()->get('gateways-form');
        if($creating_group) {
            $form->remove('CSRF');
        }

        $form->setData($data);

        if($form->isValid()) {
            $data = $form->getData();
            $gateway_name  = $data['name'];
            $gateway_group = empty($data['group']) ? null : $data['group'];


            $gateway_desc  = empty($data['description']) ? null : $data['description'];
            $x             = empty($data['x']) ? 0 : $data['x'];
            $y             = empty($data['y']) ? 0 : $data['y'];

            $result_id = $this->orbis()->gateways()->insert(
                $gateway_name, $gateway_desc,
                $x, $y, $gateway_group);
            if($result_id !== false) {
                $data['id'] = $result_id;
                return $this->json()->success(['data'=>$data]);
            }
            return $this->json()->fail();
        }
        else {
            return $this->json()->fail(['errors' => $form->getMessages()]);
        }
    }

    public function update($id, $data)
    {
        $mode = empty($data['mode']) ? 'gateway' : $data['mode'];

        if($mode == 'group') {
            if(!empty($data['value'])) {
                $group_name = $id;
                $new_name = $data['value'];

                //validated value
                $result = $this->orbis()->gateways()->rename_group($group_name, $new_name);
                if(is_string($result)) {
                    return $this->json()->fail(['error'   => $result]);
                }
                else {
                    return $this->json()->success();
                }
            }
        }
        else {
            //gateways
            #

            $form = $this->getServiceLocator()->get('gateways-form');
            $form->setData($data);

            if($form->isValid()) {
                $new_data = $form->getData();

                $this->orbis()->gateways()->update($id,
                    $new_data['name'], $new_data['description'],
                    $new_data['x'], $new_data['y'], $new_data['group'] );
                return $this->json()->success(['data' => $new_data]);
            }
            else {
                return $this->json()->fail(['errors' => $form->getMessages()]);
            }
        }

        return $this->json()->fail();
    }

    public function delete($id)
    {
        $mode = $this->params()->fromPost('mode', 'gateway');

        if($mode == 'gateway') {
            $this->orbis()->gateways()->delete($id);
            return $this->json()->success();
        }

        return $this->json()->fail();
    }

    protected function orbis()
    {
        return $this->gameServices()->get('orbis');
    }
}