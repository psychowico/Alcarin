<?php

namespace Admin\GameObject;

class DynamicTranslations extends \Core\GameObject
{
    public static $groups = ['static', 'events'];

    //constant groups that are statically used in code and should use static
    //definitions for fetching (DynamicTranslationsDefinitions class)
    public static $predefined_groups = ['static', 'events'];
    public static $languages = ['pl'];

    public function init()
    {
        $this->initChildFactory('Admin\GameObject\Extension\Translation\TranslationEntry');
    }


    public function translation($group, $tagid, $lang = null)
    {
        $lang = $lang ?: $this->lang();

        $key = $group . '.' . $tagid;
        if(empty($this->cache[$key])) {
            $this->cache[$key] = $this->createChild($group, $tagid);
        }
        return $this->cache[$key];
    }

    public function getAllTagsIdInGroup($group, $lang = null)
    {
        $lang = $lang ?: $this->lang();
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
        $lang = $lang ?: $this->lang();
        $key = sprintf('/%s\.%s\..*\.%s/', $group, $tagid, $lang);

        if(in_array($group, static::$predefined_groups)) {
            $def     = $this->def()->get($group, $tagid) ?: [];

            $entry = $this->translation($group, $tagid, $lang);
            $def['content'] = $entry->allValues();
            return $def;
        }
        else {
            //will be done later
        }
    }
}