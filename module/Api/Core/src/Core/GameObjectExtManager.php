<?php

namespace Core;

use Core\Service\GameServiceAwareInterface;
use Core\Service\GameServiceAwareTrait;

/**
 * class storing factories method/invokables names that are use for extending GameObject
 * system. you can register specific factory/class name for specifc plugin name,
 * for specific object
 */
class GameObjectExtManager implements GameServiceAwareInterface
{
    use GameServiceAwareTrait;

    protected $factories = [];

    public function hasFactory($object, $ext_name)
    {
        if( !is_string($object) ) $object = get_class($object);

        return isset($this->factories[$object][$ext_name]);
    }

    public function getFactory($object, $ext_name)
    {
        $object_name = $object;
        if( !is_string($object_name) ) $object_name = get_class($object_name);

        if( !isset($this->factories[$object_name][$ext_name]) ) {
            throw new \DomainException(sprintf(
                'Extension "%s" is not exist in "%s" class.',
                $ext_name, $object_name
            ));
        }

        return $this->factories[$object_name][$ext_name];
    }

    public function registerFactory($object, $ext_name, $ext_factory_or_invokable)
    {
        if( !is_string($object) ) $object = get_class($object);

        if( isset($this->factories[$object][$ext_name]) ) {
            throw new \DomainException(sprintf(
                'Plugin "%s" is already registered in "%s" class.',
                $ext_name, $object
            ));
        }
        $this->factories[$object][$ext_name] = $ext_factory_or_invokable;
    }
}