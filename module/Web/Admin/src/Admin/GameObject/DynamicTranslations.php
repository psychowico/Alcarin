<?php

namespace Admin\GameObject;

class DynamicTranslations extends \Core\GameObject
{
    public static $groups = ['Events', 'Others'];
    public static $languages = ['pl'];

    public function getSentencesKeysForGroup($group_name, $lang)
    {
        $key = sprintf('/%s\..*\.%s/', strtolower($group_name), strtolower($lang));

        $query = $this->mongo()->translations
            ->find(['_id' => new \MongoRegex($key)])
            ->fields(['_id']);
        return array_keys($query->toArray());
    }
}