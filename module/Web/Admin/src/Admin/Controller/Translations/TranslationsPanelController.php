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

    public function getSentenceAction()
    {
        $data = $this->params()->fromPost();
        if(empty($data['sentence']) || empty($data['lang']) || empty($data['group'])) {
            return $this->json()->fail();
        }
        else {
            $tagid = $data['sentence'];
            $group = $data['group'];
            $lang = $data['lang'];

            $def = $this->system()->getTagDefinition($group, $tagid, $lang);

            return $this->json()->success(['sentence' => $def]);
        }
    }


    protected function system()
    {
        return $this->gameServices()->get('translations');
    }
}
