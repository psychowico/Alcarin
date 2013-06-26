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

    public function setValue($new_value, $variety = 'std')
    {
        $this->cache[$variety] = $new_value;
        $this->variety = $variety;

        $key = $this->generateKey();
        $this->mongo()->translations->update(['_id' => $key],
                      ['val' => $new_value, '_id' => $key], ['upsert' => true] );
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
            $value = '';
            if(empty($entry['val'])) {
                $def = $this->parent()->def()->get($this->group, $this->tagid);
                if(!empty($def['defaults'][$variety])) {
                    $value = $def['defaults'][$variety];
                }
            }
            else {
                $value = $entry['val'];
            }

            $this->cache[$variety] = $value;
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