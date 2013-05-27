<?php

namespace Admin\Controller\Translations;

use Core\Controller\AbstractEventController;
use Admin\GameObject\DynamicTranslations;
use Zend\Mvc\Controller\AbstractActionController;

class TranslationEventsController extends AbstractActionController
{
    public function system()
    {
        return $this->gameServices()->get('translations');
    }
}