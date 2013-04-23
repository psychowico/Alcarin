<?php
namespace Admin\Controller\Translations;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Mvc\Router\RouteMatch;
use Admin\GameObject\DynamicTranslations;

class TranslationsPanelController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'groups' => DynamicTranslations::$groups,
            'languages' => DynamicTranslations::$languages,
        ];
    }
}
