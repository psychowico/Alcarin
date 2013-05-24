<?php

namespace Admin\Controller\Translations;

use Core\Controller\AbstractEventController;
use Admin\GameObject\DynamicTranslations;
use Zend\Mvc\Controller\AbstractActionController;

class TranslationEventsController extends AbstractActionController
{
    protected function sentenceChangeAction($data)
    {
        if(empty($data['sentence']) || empty($data['lang']) || empty($data['group'])) {
            $result = $this->fail();
        }
        else {
            $tagid = $data['sentence'];
            $group = $data['group'];
            $lang = $data['lang'];

            $def = $this->system()->getTagDefinition($group, $tagid, $lang);

            $result = $this->success(['sentence' => $def]);
        }
        return $this->emit('sentence.changed', $result);
    }


    public function system()
    {
        return $this->gameServices()->get('translations');
    }
}