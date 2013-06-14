<?php

namespace EngineBase\GameObject\GameEvent;

/**
 * gameobject with method, that return minimal data needed to resolve it to
 * text representation (in any language)
 */
interface SqueezableInterface
{
    function squeeze();
}