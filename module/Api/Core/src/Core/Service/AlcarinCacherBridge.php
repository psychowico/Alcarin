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
    protected $socket;
    protected $connected = false;
    protected $data_to_send = [];

    public function __construct($host, $port)
    {
        $this->host = $host;
        $this->port = $port;
    }

    public function fetchLog()
    {
        return $this->getServiceLocator()->get('system-logger');
    }

    public function connect()
    {
        if($this->connected) return true;

        $result = @fsockopen($this->host, $this->port);

        if($result === false) {
            $this->log()->err(sprintf(
                '"%s" can not connect to server. Host: "%s". Port: "%d"',
                __CLASS__, $this->host, $this->port)
            );
        }

        $this->socket = $result;
        $this->connected = ($result !== false);
        return ($result !== false);
    }

    public function sendEvent($target_ids, $event)
    {
        if(!$this->connected) return false;
        if(!is_array($target_ids)) $target_ids = [$target_ids];

        $this->data_to_send []= [
            '$ids'    => $target_ids,
            '$event' => $event,
        ];

        return true;
    }

    public function resetEvents($target, $new_events)
    {
        if(!$this->connected) return false;

        $this->data_to_send []= [
            '$ids'     => [$target],
            '$events' => $new_events,
            '$reset'   => true,
        ];

        return true;
    }

    public function disconnect()
    {
        if(!$this->connected) return true;

        $json_data = json_encode($this->data_to_send) . "\0";

        for ($written = 0; $written < strlen($json_data); $written += $fwrite) {
            $buff = substr($json_data, $written);
            $fwrite = fwrite($this->socket, $buff, strlen($buff));
            if ($fwrite === false) break;
        }

        fclose($this->socket);

        $this->connected = false;
        // return true;

        echo($json_data);
        exit;
    }
}