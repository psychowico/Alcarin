<?php

namespace Admin\GameObject;

class DynamicTranslations extends \Core\GameObject
{
    public static $groups = ['Events', 'Others', 'Test'];
    //id has meaning in database - not change it if you wont know what you are doing
    public static $args_types = [ 0 => 'Text', 1 => 'Object', 2 => 'Character'];
    public static $languages = ['pl'];

    protected $current_lang = 'pl';

    public function init()
    {
        $player = $this->getServicesContainer()->get('players')->current();
        $this->current_lang = $player->lang();

        $this->initChildFactory('Admin\GameObject\Extension\TranslationEntry');
    }

    public function lang()
    {
        return $this->current_lang;
    }

    public function translation($group, $name, $lang = null)
    {
        $group = strtolower($group);
        $name = strtolower($name);

        $lang = $lang ?: $this->current_lang;

        $key = $group . '.' . $name;
        if(empty($this->cache[$key])) {
            $this->cache[$key] = $this->createChild([$group, $name]);
        }
        return $this->cache[$key];
    }

    public function getSentencesKeysForGroup($group_name, $lang = null)
    {
        $lang = $lang ?: $this->current_lang;

        $key = sprintf('/%s\..*\.%s/', strtolower($group_name), strtolower($lang));

        $query = $this->mongo()->translations
            ->find(['_id' => new \MongoRegex($key)])
            ->fields(['_id']);
        return array_keys($query->toArray());
    }
}