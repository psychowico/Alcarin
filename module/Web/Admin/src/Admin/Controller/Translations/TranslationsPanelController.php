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

    public function getSentencesAction()
    {
        $data = $this->params()->fromPost();
        if(empty($data['group']) ||
           !in_array($data['group'], DynamicTranslations::$groups) ||
           empty($data['lang']) ||
           !in_array($data['lang'], DynamicTranslations::$languages)
           ) {
            return $this->json()->fail($data);
        }
        else {
            $group = $data['group'];
            $lang = $data['lang'];

            $keys = $this->system()->getAllTagsIdInGroup($group, $lang);
            return $this->json()->success(['sentences' => $keys]);
        }
    }


    protected function system()
    {
        return $this->gameServices()->get('translations');
    }
}
