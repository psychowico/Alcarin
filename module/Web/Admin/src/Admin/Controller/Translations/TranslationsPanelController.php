<?php
namespace Admin\Controller\Translations;

use Core\Controller\AbstractAlcarinRestfulController;
use Zend\Mvc\Router\RouteMatch;
use Admin\GameObject\DynamicTranslations;
use Zend\View\Model\ViewModel;

class TranslationsPanelController extends AbstractAlcarinRestfulController
{
    public function getList()
    {
        return [
            'groups' => DynamicTranslations::$groups,
            'languages' => DynamicTranslations::$languages,
        ];
    }

    public function get($tagid)
    {
        $model = new ViewModel();
        $model->setTemplate('admin/translations-panel/get');
        return $model;
    }
}
