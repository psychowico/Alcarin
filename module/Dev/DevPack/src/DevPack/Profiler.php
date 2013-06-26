<?php

namespace DevPack;

/**
 * profiler for mongo db odm wrapper
 */
class Profiler
{
    protected $current = [];
    protected $data    = [];

    private function getKey( $group, $query )
    {
        do {
            $hash = md5(mt_rand());
        }
        while( isset( $this->current[$hash] ) );
        return $hash;
    }

    public function start($group, $query)
    {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);
        $backtrace_obj = '';
        $start_index = 1;
        # trying to find backtrace frame with user true code that generate the query.
        if(count($backtrace) > $start_index) {
            $ignore = ['Mongo_Collection', 'Mongo_Database', 'DevPack\MongoCollection'];
            for($i = $start_index; $i < count($backtrace); $i++) {
                // if(\Mongo_Collection::$test) \Zend\Debug\Debug::dump($backtrace[$i]);

                if(empty($backtrace[$i]['class'])) continue;
                if(in_array($backtrace[$i]['class'], $ignore)) continue;
                if(strpos($backtrace[$i]['class'], 'Zend\\') === 0) continue;
                if(strpos($backtrace[$i]['function'], '{closure}') !== false) continue;

                $backtrace_obj = print_r($backtrace[$i], true);
                break;
            }
        }

        $key = $this->getKey( $group, $query );

        $this->current[ $key ] = [
            'begin' => microtime(true),
            'group' => $group,
            'query' => $query,
            'backtrace' => print_r($backtrace_obj, true)
        ];
        return $key;
    }

    public function stop( $key )
    {
        $time = microtime(true);

        if( !isset($this->current[$key]) ) {
            throw new \Exception( sprintf(
                '`%s`: Calling stop for group "%s" before start.',
                __METHOD__,
                $key ));
        }

        $data = $this->current[$key];
        unset( $this->current[$key] );

        $time = 1000 * ($time - $data['begin']);
        unset($data['begin']);

        $data['time'] = $time;

        $this->data []= $data;
    }

    public function getStoredData()
    {
        return $this->data;
    }
}