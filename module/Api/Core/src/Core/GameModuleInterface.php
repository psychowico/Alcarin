<?php

namespace Core;

interface GameModuleInterface
{
    /**
     * game module can extend game objects on some plugins - this method return
     * array of ['Full\GameObject\Class' => ['plugin1' => $plugin1]] - assigns array
     * of plugins to specific game object class.
     */
    public function getGameObjectsPlugins();
    /**
     * game module can extend game service on new gameobjects - this method return
     * array of ['game-object-alias' => $factory_or_invokable] - assigns array
     * of gameobject aliases and factory method/invokable class string.
     */
    public function getGameObjects();

    public function getGameModuleDescription();
}