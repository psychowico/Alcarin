<?php

namespace EngineBase\GameObject\Char;

/**
 * char events is used only to resolving event loaded from database to text
 */
class Event extends \Core\GameObject
{
    protected $source_data;

    public function __construct($source_data = null)
    {
        $this->source_data = $source_data;
    }

    /**
     * resolve game event argument to text or hyperlink representation
     */
    protected function resolveArg($arg)
    {
        //to do for
        return strval($arg);
    }

    public function time()
    {
        return $this->source_data['time'];
    }

    public function toArray()
    {
        return $this->source_data;
    }

    public function toString()
    {
        $text = '';
        if(!empty($this->source_data['text']) && !empty($this->source_data['args'])) {
            $text = $this->source_data['text'];
            $_args = $this->source_data['args'];

            for($i = 0; $i < count($_args); $i++) {
                $arg = $this->resolveArg($_args[$i]);
                $text = str_replace('%' . $i, $arg, $text);

            }
        }
        return $text;
    }
}