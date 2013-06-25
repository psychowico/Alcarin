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
        $group = $this->params()->fromQuery('group');
        $lang = $this->params()->fromQuery('lang');
        if(empty($group) || empty($lang)) {
            return [
                'groups' => DynamicTranslations::$groups,
                'languages' => DynamicTranslations::$languages,
            ];
        }
        else {
            return $this->getSentences($group, $lang);
        }
    }

    public function get($tagid)
    {
        $group = $this->params()->fromQuery('group');
        $lang  = $this->params()->fromQuery('lang');
        return $this->getSentence($group, $lang, $tagid);
    }

    public function update($tagid, $transl_entry)
    {
        $group = $this->params()->fromQuery('group');
        $lang  = $this->params()->fromQuery('lang');
        return $this->saveSentence($group, $lang, $tagid, $transl_entry);
    }

    private function getSentences($group, $lang)
    {
        if(!in_array($group, DynamicTranslations::$groups) ||
           !in_array($lang, DynamicTranslations::$languages) ) {
            return $this->responses()->badRequest();
        }
        else {
            $keys = $this->system()->getAllTagsIdInGroup($group, $lang);
            return $this->json(array_map(function($e) {
                return ['tagid' => $e];
            }, $keys));
        }
    }

    private function getSentence($group, $lang, $tagid)
    {
        if(empty($tagid) || empty($lang) || empty($group)) {
            return $this->responses()->badRequest();
        }
        else {
            $def = $this->system()->getTagDefinition($group, $tagid, $lang);
            $def['tagid'] = $tagid;
            return $this->json($def);
        }
    }

    private function saveSentence($group, $lang, $tagid, $data)
    {
        $data['tagid'] = $tagid;
        if(empty($group) || empty($lang) || empty($data['tagid'])) {
            return $this->responses()->badRequest();
        }

        $entry = $this->system()->translation($group, $data['tagid'], $lang);
        $new_content = empty($data['content']) ? [] : $data['content'];
        foreach($new_content as $variety => $content) {
            $entry->setValue($content, $variety);
        }

        return $this->getSentence($group, $lang, $data['tagid']);
    }

    protected function system()
    {
        return $this->gameServices()->get('translations');
    }
}
