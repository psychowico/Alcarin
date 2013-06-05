<?php

namespace DevPack;

/**
 * override default \Mongo_Collection from colinmollenhour
 * library to have better profiling effects when iterating
 */
class MongoDatabase extends \Mongo_Database
{
    /**
     * translate default mongo php id system (_id->$id) to string in 'id' field.
     * working on array reference.
     */
    public function transl(&$_mongo_record, $target_field = 'id')
    {
        if(!empty($_mongo_record['_id'])) {
            $_mongo_record[$target_field] = $_mongo_record['_id']->{'$id'};
            unset($_mongo_record['_id']);
        }

        return $_mongo_record;
    }

    /**
     * override default static to create this object.
     */
    public static function instance($name = NULL, array $config = NULL)
    {
        if ($name === NULL)
        {
            $name = self::$default;
        }
        if( ! isset(self::$instances[$name]) )
        {
            if ($config === NULL)
            {
            // Load the configuration for this database
                $config = Kohana::$config->load('mongo')->$name;
            }
            new self($name,$config);
        }

        return self::$instances[$name];
    }
}