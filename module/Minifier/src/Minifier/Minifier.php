<?php

namespace Minifier;

use Minifier\Adapter\AdapterInterface;

/**
 * @author Wiktor Obrębski
 */
class Minifier
{
    protected $adapter;

    public function __construct( AdapterInterface $adapter )
    {
        $this->setAdapter( $adapter );
    }

    public function setAdapter( AdapterInterface $adapter )
    {
        $this->adapter = $adapter;
        return $this;
    }

    public function getAdapter()
    {
        return $this->adapter;
    }
}