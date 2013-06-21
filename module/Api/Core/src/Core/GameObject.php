<?php

namespace Core;

use Core\Service\GameServiceAwareInterface;
use Core\Service\GameServiceAwareTrait;

class GameObject implements GameServiceAwareInterface
{
    use GameServiceAwareTrait;

    protected $child_reflect;
    protected $extManager;
    protected $plugins   = [];
    private $mongo;
    private $parent;
    private $lang;
    private $current_char;

    public function __construct($parent = null)
    {
        $this->setParent($parent);
    }

    public function setServicesContainer($gameServiceContainer)
    {
        $this->gameServiceContainer = $gameServiceContainer;
        $this->init();
    }

    protected function init(){}

    protected function setParent($parent)
    {
        $this->parent = $parent;
    }


    protected function parent()
    {
        return $this->parent;
    }

    /**
     * we will need it very often, so let create shortcut in this base class
     */
    protected function mongo()
    {
        if( $this->mongo == null ) {
            $this->mongo = $this->getServicesContainer()->get('mongo');
        }
        return $this->mongo;
    }

    protected function lang()
    {
        if($this->lang == null) {
            $player = $this->getServicesContainer()->get('players')->current();
            $this->lang = $player->lang();
        }
        return $this->lang;
    }

    protected function currentChar()
    {
        if($this->current_char == null) {
            $player = $this->getServicesContainer()->get('players')->current();
            $this->current_char = $player->currentChar();
        }
        return $this->current_char;
    }


    /**
     * we will need it very often, so let create shortcut in this base class
     */
    protected function time()
    {
        return $this->getServicesContainer()->get('time');
    }

    protected function getExtManager()
    {
        if( $this->extManager == null ) {
            $this->extManager = $this->getServicesContainer()->get('ext-manager');
        }
        return $this->extManager;
    }

    /**
     * checking than this object has plugin with specific name
     */
    public function has($plugin_name)
    {
        if( isset($this->plugins[$plugin_name]) ) return true;
        return $this->getExtManager()->hasFactory($this, $plugin_name);
    }

    public function __call($plugin_name, $args)
    {
        $plugin = null;
        if( !isset($this->plugins[$plugin_name]) ) {
            $factory = $this->getExtManager()->getFactory($this, $plugin_name);
            if(is_string($factory)) {
                $plugin = new $factory($this);
            }
            else {
                $plugin = $factory($this->getServicesContainer(), $this);
            }

            if( $plugin instanceof GameServiceAwareInterface ) {
                $plugin->setServicesContainer($this->getServicesContainer());
            }
            $this->plugins[$plugin_name] = $plugin;
        }
        else {
            $plugin = $this->plugins[$plugin_name];
        }

        if(method_exists($plugin, '__invoke')) {
            return call_user_func_array($plugin, $args);
        }

        return $plugin;
    }

    protected function initChildFactory($child_class)
    {
        $this->child_reflect = new \ReflectionClass($child_class);
    }

    protected function createChild()
    {
        if($this->child_reflect === null) {
            throw new \Exception("You need first initilize child factory before use it.");
        }

        $args = func_get_args();
        $instance = $this->child_reflect->newInstanceArgs($args);

        if($instance instanceof GameServiceAwareInterface) {
            $sc = $this->getServicesContainer();
            $instance->setServicesContainer($sc);
        }
        if($instance instanceof GameObject) {
            $instance->setParent($this);
        }
        return $instance;
    }

    protected function childrenFromArray($args_array)
    {
        return array_map(function($args) {
            return $this->createChild($args);
        }, $args_array);
    }
}