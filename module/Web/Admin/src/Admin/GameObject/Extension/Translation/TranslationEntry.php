<?php

namespace Admin\GameObject\Extension\Translation;

class TranslationEntry extends \Core\GameObject
{
    protected $group;
    protected $tagid;
    protected $variety = 'std';

    protected $cache = [];

    public function __construct($group, $tagid)
    {
        $this->group = $group;
        $this->tagid = $tagid;
    }

    public function key()
    {
        return $this->generateKey();
    }

    /**
     * just alias for "val"
     */
    public function value($variety = 'std')
    {
        return $this->val($variety);
    }

    /*
     * return translation entry content in specific variety
     */
    public function val($variety = 'std')
    {
        if(!isset($this->cache[$variety])) {
            $this->variety = $variety;

            $key = $this->generateKey();
            $entry = $this->mongo()->translations->findOne(['_id' => $key]);
            $this->cache[$variety] = empty($entry['val']) ? '' : $entry['val'];
        }
        return $this->cache[$variety];
    }

    /*
     * shortcut to "val"
     */
    public function __call($value_variety, $args)
    {
        return $this->value($value_variety);
    }

    protected function generateKey()
    {
        return sprintf("%s.%s.%s.%s", $this->group, $this->tagid, $this->variety, $this->parent()->lang());
    }
}