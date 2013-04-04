<?php
namespace Core;

/**
 * in working state, to automate some class field caching.
 * in target object we should prefix name all methods that we want cache by "fetch",
 * but call it without 'fetch' prefix. they will be automatically called when needed
 * and getted from cache if it is possible.
 */
trait AutoCacheTrait
{
    protected $storage = [];

    public function __call($name, $args)
    {
        if(isset($this->storage[$name])) return $this->storage[$name];

        $fullname = 'fetch' . ucfirst($name);
        if(method_exists($this, $fullname)) {
            $result = call_user_func_array([$this,$fullname], $args);
            $this->storage[$name] = $result;
            return $result;
        }

        throw new \DomainException(sprintf('Method "%s" not found in object "%s".',
            $fullname, get_class($this)));
    }
}
