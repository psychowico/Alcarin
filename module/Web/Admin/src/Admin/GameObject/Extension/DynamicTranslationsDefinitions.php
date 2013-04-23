<?php

namespace Admin\GameObject\Extension;

use Admin\GameObject\DynamicTranslations;

class DynamicTranslationsDefinitions extends \Core\GameObject
{
    public function getAll($group_name)
    {
        return $this->mongo()->{'translations.def'}->find([
            'group' => $group_name
        ])->fields(['key'])->toArray();
    }

    public function get($id)
    {
        return $this->mongo()->{'translations.def'}->findOne([
            '_id' => new \MongoId($id),
        ]);
    }
}