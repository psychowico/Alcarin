<?php

namespace Admin\GameObject\Extension;

class OrbisGateways extends \Core\GameObject
{
    const COLLECTION = 'map.gateways';

    public function fetchGroups()
    {
        return $this->mongo()->{static::COLLECTION}->distinct('group');
    }

    public function find($grouped = true)
    {
        $gateways = $this->mongo()->{static::COLLECTION}->find()->sort(['group' => 1, 'name'=> 1]);
        if($grouped) {
            $gateways = $gateways->toArray();
            $grouped_gateways = [];
            foreach($gateways as $gateway) {
                $_group = empty($gateway['group']) ? 0 : $gateway['group'];
                if(empty($grouped_gateways[$_group])) {
                    $grouped_gateways[$_group] = [];
                }
                $grouped_gateways[$_group] []= $gateway;
            }
            $gateways = $grouped_gateways;
        }

        return $gateways;
    }

    public function get($id)
    {
        $obj = $this->mongo()->{static::COLLECTION}->findById($id);
        return $this->mongo()->transl($obj);
    }

    public function rename_group($old_name, $new_name)
    {
        $all = $this->mongo()->{static::COLLECTION}->distinct('group');
        $all = array_flip($all);

        #"Can not find group '$old_name'
        # or group with name '$new_name' exists"
        if(empty($all[$old_name]) || !empty($all[$new_name])) return false;

        $this->mongo()->{static::COLLECTION}->update_safe(
            ['group' => $old_name],
            ['$set' => ['group' => $new_name]],
            ['multiple' => true]
        );

        return true;
    }

    public function delete($gateway_id)
    {
        return $this->mongo()->{static::COLLECTION}->removeById($gateway_id);
    }

    public function delete_group($group_name)
    {
        if($group_name === 0 || $group_name == 'Ungrouped') return false;
        $all = $this->find();

        if(empty($all[$group_name])) return false;

        foreach($all[$group_name] as $gateway) {
            $gateway['group'] = 0;
            $this->mongo()->{static::COLLECTION}->updateById($gateway['_id'], $gateway);
        }

        return true;
    }

    public function update($id, $name, $description, $x, $y, $group = null)
    {
        if($group == 'Ungrouped') $group = 0;

        return $this->mongo()->{static::COLLECTION}->updateById($id, [
            'name'        => $name,
            'description' => $description,
            'x'           => $x,
            'y'           => $y,
            'group'       => $group,
        ]);
    }

    public function insert($name, $description, $x, $y, $group = null)
    {
        if($group == 'Ungrouped') $group = 0;

        $data = [
            'name'        => $name,
            'description' => $description,
            'x'           => $x,
            'y'           => $y,
            'group'       => $group === null ? 0 : $group,
        ];
        $result = $this->mongo()->{static::COLLECTION}->insert($data);
        if($result) return $data['_id']->{'$id'};
        return false;
    }
}