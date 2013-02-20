<?php

namespace Core\Service;

interface GameServiceAwareInterface
{
    public function setServicesContainer($gameServiceContainer);
    public function getServicesContainer();
}