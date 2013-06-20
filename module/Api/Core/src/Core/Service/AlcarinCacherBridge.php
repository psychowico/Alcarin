<?php

namespace Core\Service;


/**
 * bridge that can connect and communicate with alcarin-cacher application
 */
class AlcarinCacherBridge
{
    use \Core\AutoCacheTrait;

    protected $host;
    protected $port;
    protected $connected = false;

    public function __construct($host, $port)
    {
        $this->host = $host;
        $this->port = $port;
    }

    protected function fetchSocket()
    {
        return socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    }

    public function connect()
    {
        if($this->connected) return true;

        $socket = $this->socket();
        $result = socket_connect($socket, $this->host, $this->port) or false;

        $this->connected = ($result !== false);
        return ($result !== false);
    }

    public function disconnect()
    {
        if(!$this->connected) return true;
        socket_close($this->socket());
        $this->connected = false;
        return true;
    }
}