<?php

namespace Admin\GameObject\Extension;

class TranslationEntry extends \Core\GameObject
{
    protected $group;
    protected $name;
    protected $version = 'std';

    protected $cache = [];

    public function __construct($group, $name)
    {
        $this->group = $group;
        $this->name = $name;
    }

    public function key()
    {
        return $this->generateKey();
    }

    /**
     * just alias for "val"
     */
    public function value($version = 'std')
    {
        return $this->val($version);
    }

    /*
     * return translation entry content in specific version
     */
    public function val($version = 'std')
    {
        if(!isset($this->cache[$version])) {
            $this->version = $version;

            $key = $this->generateKey();
            $entry = $this->mongo()->translations->findOne(['_id' => $key]);
            $this->cache[$version] = empty($entry['val']) ? '' : $entry['val'];
        }
        return $this->cache[$version];
    }

    /*
     * shortcut to "val"
     */
    public function __call($value_version, $args)
    {
        return $this->value($value_version);
    }

    protected function generateKey()
    {
        return sprintf("%s.%s.%s.%s", $this->group, $this->name, $this->version, $this->parent()->lang());
    }
}