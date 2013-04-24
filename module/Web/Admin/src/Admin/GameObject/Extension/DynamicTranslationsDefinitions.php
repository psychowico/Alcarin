<?php

namespace Admin\GameObject\Extension;

use Admin\GameObject\DynamicTranslations;

class DynamicTranslationsDefinitions extends \Core\GameObject
{
    protected function table()
    {
        return $this->mongo()->{'translations.def'};
    }

    public function getAll($group_name)
    {
        return $this->table()->find([
            'group' => $group_name
        ])->fields(['key'])->toArray();
    }

    public function get($id)
    {
        return $this->table()->findOne([
            '_id' => new \MongoId($id),
        ]);
    }

    public function save($data)
    {
        return $this->table()->updateById( $data['id'], [
            '$set' => [
                'descr' => empty($data['descr']) ? '' : $data['descr'],
                'args' => empty($data['args']) ? [] : $data['args']
            ]
        ]);
    }

    public function create($group, $key)
    {
        $data = ['group' => $group, 'key' => $key];
        $exists = $this->table()->find($data)->count();
        if( $exists > 0 ) return false;

        return $this->table()->insert($data);
    }
}