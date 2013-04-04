<?php

namespace Alcarin\View\Helper;

use Zend\View\Helper\AbstractHelper;
use Core\Permission\AuthService;

class CurrentPlayer extends AbstractHelper
                    implements \Core\Service\GameServiceAwareInterface
{
    use \Core\Service\GameServiceAwareTrait;

    public function __invoke()
    {
        return $this->getServicesContainer()->get('players')->current();
    }
}