<?php

namespace Core\Service;

Trait GameServiceAwareTrait
{
    protected $gameServiceContainer;

    public function setServicesContainer($gameServiceContainer)
    {
        $this->gameServiceContainer = $gameServiceContainer;
    }

    public function getServicesContainer()
    {
        return $this->gameServiceContainer;
    }
}