<?php

namespace Core\Service;


/**
 * bridge that can connect and communicate with alcarin-cacher application
 */
class AlcarinCacherBridge
{
    use \Core\AutoCacheTrait;
    use \Zend\ServiceManager\ServiceLocatorAwareTrait;

    protected $host;
    protected $port;
    protected $connected = false;

    public function __construct($host, $port)
    {
        $this->host = $host;
        $this->port = $port;
    }

    public function fetchLog()
    {
        return $this->getServiceLocator()->get('system-logger');
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

        if($result === false) {
            $this->log()->err(sprintf(
                '"%s" can not connect to server. Host: "%s". Port: "%d"',
                __CLASS__, $this->host, $this->port)
            );
        }

        $this->connected = ($result !== false);
        return ($result !== false);
    }

    public function send($data)
    {
        if(!$this->connected) return false;
        $json_data = json_encode($data);
        return socket_write($this->socket(), $json_data);
    }

    public function disconnect()
    {
        if(!$this->connected) return true;
        socket_close($this->socket());
        $this->connected = false;
        return true;
    }
}