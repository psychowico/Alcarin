<?php

namespace Admin\GameObject;

class DynamicTranslations extends \Core\GameObject
{
    public static $groups = ['static', 'events'];

    //constant groups that are statically used in code and should use static
    //definitions for fetching (DynamicTranslationsDefinitions class)
    public static $predefined_groups = ['static', 'events'];
    public static $languages = ['pl'];

    protected $current_lang = 'pl';

    public function init()
    {
        $player = $this->getServicesContainer()->get('players')->current();
        $this->current_lang = $player->lang();

        $this->initChildFactory('Admin\GameObject\Extension\Translation\TranslationEntry');
    }

    public function lang()
    {
        return $this->current_lang;
    }

    public function translation($group, $tagid, $lang = null)
    {
        $lang = $lang ?: $this->current_lang;

        $key = $group . '.' . $tagid;
        if(empty($this->cache[$key])) {
            $this->cache[$key] = $this->createChild([$group, $tagid]);
        }
        return $this->cache[$key];
    }

    public function getAllTagsIdInGroup($group, $lang = null)
    {
        $lang = $lang ?: $this->current_lang;
        if(in_array($group, static::$predefined_groups)) {
            $all = $this->def()->get($group) ?: [];
            return array_keys($all);
        }
        else {
            $key = sprintf('/%s\..*\.%s/', $group, $lang);

            $query = $this->mongo()->translations
                ->find(['_id' => new \MongoRegex($key)])
                ->fields(['_id']);
            $keys = array_keys($query->toArray());

            //getting sentences plain names
            $regex = sprintf('/%s\.(.*?)(\..*?)?\.%s/', $group, $lang);

            $rKeys = [];
            $matches = null;
            foreach ($keys as $key) {
                preg_match($regex, $key, $matches);
                $rKeys[$matches[1]] = null;
            }
            return array_keys($rKeys);

            return ;
        }
    }

    public function getTagDefinition($group, $tagid, $lang = null)
    {
        $lang = $lang ?: $this->current_lang;
        $key = sprintf('/%s\.%s\..*\.%s/', $group, $tagid, $lang);

        if(in_array($group, static::$predefined_groups)) {
            return $this->def()->get($group, $tagid) ?: [];
        }
        else {
            //will be done later
        }
    }
}